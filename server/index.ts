import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import {
  enforceRequiredSecrets,
  securityHeaders,
  apiLimiter,
  originCheck,
} from "./middleware/security";
import { logger, requestIdMiddleware } from "./utils/logger";
import { recordRequest, getMetricsSnapshot } from "./utils/metrics";
import { startScheduledPublishService } from "./services/scheduled-publish.service";
import { startSystemBackupService } from "./services/system-backup.service";
import { getLocalUploadsRoot } from "./services/local-upload-storage";

declare const __APP_VERSION__: string;
const pkgVersion = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "unknown";

enforceRequiredSecrets();

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

app.use(securityHeaders());
app.use(requestIdMiddleware);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "ok",
    version: pkgVersion,
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      external: Math.round(mem.external / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health/ready", async (_req, res) => {
  try {
    const { db } = await import("./db");
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`SELECT 1`);
    res.json({
      status: "ready",
      database: "connected",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.db.error("Readiness check failed", err);
    res.status(503).json({
      status: "not_ready",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

app.get("/api/health/metrics", (req, res) => {
  if (process.env.NODE_ENV === "production" && process.env.METRICS_ENABLED !== "true") {
    return res.status(404).json({ message: "Not found" });
  }
  res.json(getMetricsSnapshot());
});

app.use("/api", apiLimiter);
app.use(originCheck);

app.use("/uploads", express.static(getLocalUploadsRoot()));
app.get(/^\/uploads\/cms\/.+\.(?:avif|gif|jpe?g|png|svg|webp)$/i, (_req, res) => {
  res
    .status(200)
    .type("image/svg+xml")
    .set("Cache-Control", "no-cache")
    .send(`<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-labelledby="title desc">
  <title id="title">CMS media unavailable</title>
  <desc id="desc">Placeholder shown when an uploaded CMS image file is unavailable.</desc>
  <rect width="1200" height="800" fill="#f4f7f6"/>
  <rect x="48" y="48" width="1104" height="704" rx="24" fill="none" stroke="#cfdad5" stroke-width="6" stroke-dasharray="22 18"/>
  <g fill="none" stroke="#3a7e78" stroke-linecap="round" stroke-linejoin="round" stroke-width="22" opacity=".9">
    <rect x="420" y="260" width="360" height="260" rx="28"/>
    <circle cx="530" cy="350" r="34"/>
    <path d="m455 490 120-120 88 88 48-48 76 80"/>
  </g>
  <text x="600" y="590" text-anchor="middle" fill="#1e2943" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="700">Media unavailable</text>
  <text x="600" y="642" text-anchor="middle" fill="#646e87" font-family="Arial, Helvetica, sans-serif" font-size="26">Replace or re-upload this CMS image</text>
</svg>`);
});

const REDACTED_KEYS = [
  "password",
  "currentPassword",
  "newPassword",
  "token",
  "resetToken",
  "secret",
  "authorization",
  "email",
  "phone",
  "address",
  "addressLine1",
  "addressLine2",
  "refereeEmail",
  "refereePhone",
  "ssn",
  "dateOfBirth",
  "secureToken",
];
const MAX_LOG_BODY_LENGTH = 500;

function redactSensitive(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => redactSensitive(item));
  const redacted: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (REDACTED_KEYS.some((rk) => key.toLowerCase().includes(rk.toLowerCase()))) {
      redacted[key] = "[REDACTED]";
    } else if (key === "bio" || key === "content" || key === "body" || key === "description") {
      const val = obj[key];
      redacted[key] =
        typeof val === "string" && val.length > 100 ? val.substring(0, 100) + "..." : val;
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      redacted[key] = redactSensitive(obj[key]);
    } else {
      redacted[key] = obj[key];
    }
  }
  return redacted;
}

function truncateBody(body: string): string {
  if (body.length > MAX_LOG_BODY_LENGTH) {
    return body.substring(0, MAX_LOG_BODY_LENGTH) + `...[truncated ${body.length} chars]`;
  }
  return body;
}

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      recordRequest(req.method, reqPath, duration, res.statusCode);

      let bodyStr = "";
      if (capturedJsonResponse) {
        bodyStr = truncateBody(JSON.stringify(redactSensitive(capturedJsonResponse)));
      }

      logger.http.info(`${req.method} ${reqPath} ${res.statusCode} ${duration}ms`, {
        requestId: req.requestId,
        method: req.method,
        path: reqPath,
        statusCode: res.statusCode,
        durationMs: duration,
        ...(bodyStr ? { body: bodyStr } : {}),
      });
    }
  });

  next();
});

(async () => {
  if (process.env.NODE_ENV === "production") {
    const { runMigrations } = await import("./migrate");
    await runMigrations();
  }

  const { runSystemBootstrap } = await import("./services/system-bootstrap.service");
  await runSystemBootstrap();

  await registerRoutes(httpServer, app);

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;

    logger.app.error(`${req.method} ${req.path} ${status}`, err, {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: status,
    });

    if (res.headersSent) {
      return next(err);
    }

    const isProduction = process.env.NODE_ENV === "production";
    const message =
      status >= 500 && isProduction
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

    return res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  startScheduledPublishService();
  startSystemBackupService();

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      logger.app.info(`Serving on port ${port}`);
    },
  );
})();
