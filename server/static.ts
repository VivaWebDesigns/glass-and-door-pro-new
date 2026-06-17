import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import {
  getPublicHeadAdditions,
  getPublicHtmlSnapshot,
  injectPublicHtmlSnapshot,
} from "./services/public-prerender.service";

const LEGACY_PUBLIC_REDIRECTS: Record<string, string> = {
  "/areas-served/charlotte-nc": "/service-areas/charlotte",
  "/areas-served/monroe-nc": "/service-areas/monroe",
};

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  const indexPath = path.resolve(distPath, "index.html");
  let cachedIndexTemplate: string | null = null;

  async function getIndexTemplate() {
    if (cachedIndexTemplate) return cachedIndexTemplate;
    cachedIndexTemplate = await fs.promises.readFile(indexPath, "utf-8");
    return cachedIndexTemplate;
  }

  app.use(express.static(distPath, {
    index: false,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
        return;
      }

      if (/\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|avif|ico)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }));

  function getRequestPathAndSearch(originalUrl: string) {
    const parsed = new URL(originalUrl, "http://localhost");
    return {
      pathname: parsed.pathname || "/",
      search: parsed.search,
    };
  }

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", async (req, res) => {
    const template = await getIndexTemplate();
    const { pathname, search } = getRequestPathAndSearch(req.originalUrl || req.url || "/");
    const redirectTo = LEGACY_PUBLIC_REDIRECTS[pathname];
    if (redirectTo) {
      res.redirect(301, `${redirectTo}${search}`);
      return;
    }
    if (pathname.length > 1 && pathname.endsWith("/")) {
      const canonicalPath = pathname.replace(/\/+$/, "");
      res.redirect(301, `${canonicalPath}${search}`);
      return;
    }
    if (pathname.startsWith("/uploads")) {
      res.status(404).type("text").send("Not found");
      return;
    }
    const snapshot = await getPublicHtmlSnapshot(pathname, search);
    const shouldInjectPublicHead =
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/auth") &&
      !pathname.startsWith("/therapist") &&
      !pathname.startsWith("/setup") &&
      !pathname.startsWith("/preview") &&
      !pathname.startsWith("/uploads") &&
      !pathname.startsWith("/api");
    const customHeadHtml = shouldInjectPublicHead ? await getPublicHeadAdditions() : null;

    res.setHeader(
      "Cache-Control",
      pathname.startsWith("/admin") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/setup") ||
        pathname.startsWith("/therapist")
        ? "private, no-store, max-age=0"
        : "no-cache",
    );
    res.type("html").send(injectPublicHtmlSnapshot(template, snapshot, customHeadHtml));
  });
}
