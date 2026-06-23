import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import {
  getPublicHeadAdditions,
  getPublicHtmlSnapshot,
  injectPublicHtmlSnapshot,
} from "./services/public-prerender.service";

const LEGACY_PUBLIC_REDIRECTS: Record<string, string> = {
  "/about": "/#about",
  "/contact": "/#contact",
  "/areas-served/charlotte-nc": "/service-areas/charlotte",
  "/areas-served/monroe-nc": "/service-areas/monroe",
  "/areas-served/indian-trail-nc": "/service-areas/indian-trail",
  "/areas-served/stallings-nc": "/service-areas/stallings",
  "/areas-served/wesley-chapel-nc": "/service-areas/wesley-chapel",
  "/areas-served/waxhaw-nc": "/service-areas/waxhaw",
  "/areas-served/matthews-nc": "/service-areas/matthews",
  "/areas-served/weddington-nc": "/service-areas/weddington",
  "/areas-served/pineville-nc": "/service-areas/pineville",
  "/areas-served/fort-mill-sc": "/service-areas/fort-mill",
  "/areas-served/fort-mill-nc": "/service-areas/fort-mill",
  "/areas-served/indian-land-sc": "/service-areas/indian-land",
  "/areas-served/indian-land-nc": "/service-areas/indian-land",
  "/window-installation": "/services/window-installation",
  "/door-installation": "/services/door-installation",
  "/window-repair": "/services/window-repair",
  "/frameless-showers": "/services/frameless-showers",
  "/frameless-shower-doors": "/services/frameless-showers",
  "/commercial-storefront-glass-installation": "/services/commercial-storefront-glass-installation",
  "/commercial-storefront-glass-replacement-repair": "/services/commercial-storefront-glass-replacement-repair",
  "/commercial-door-installation": "/services/commercial-door-installation",
  "/commercial-door-replacement-repair": "/services/commercial-door-replacement-repair",
  "/commercial-window-replacement": "/services/commercial-window-replacement",
};

const GONE_PUBLIC_PATH_PREFIXES = [
  "/commercial-glass",
  "/commercialglass",
  "/services/commercial-glass",
  "/services/commercialglass",
  "/directory",
  "/events",
  "/forms/newsletter-signup",
  "/insights",
  "/join",
  "/recordings",
  "/therapist",
];

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

  function isClientOnlyPublicRoute(pathname: string) {
    return pathname.startsWith("/forms/");
  }

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", async (req, res) => {
    const template = await getIndexTemplate();
    const { pathname, search } = getRequestPathAndSearch(req.originalUrl || req.url || "/");
    const redirectTo = LEGACY_PUBLIC_REDIRECTS[pathname];
    if (redirectTo) {
      res.redirect(301, redirectTo.includes("#") ? redirectTo : `${redirectTo}${search}`);
      return;
    }
    if (
      GONE_PUBLIC_PATH_PREFIXES.some((gonePath) => pathname === gonePath || pathname.startsWith(`${gonePath}/`))
    ) {
      res
        .status(410)
        .type("text")
        .set("Cache-Control", "no-cache")
        .send("Gone");
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
      !pathname.startsWith("/setup") &&
      !pathname.startsWith("/preview") &&
      !pathname.startsWith("/uploads") &&
      !pathname.startsWith("/api");
    if (shouldInjectPublicHead && !snapshot && !isClientOnlyPublicRoute(pathname)) {
      res
        .status(404)
        .type("text")
        .set("Cache-Control", "no-cache")
        .send("Not found");
      return;
    }
    const customHeadHtml = shouldInjectPublicHead ? await getPublicHeadAdditions() : null;

    res.setHeader(
      "Cache-Control",
      pathname.startsWith("/admin") ||
        pathname.startsWith("/auth") ||
        pathname.startsWith("/setup")
        ? "private, no-store, max-age=0"
        : "no-cache",
    );
    res.type("html").send(injectPublicHtmlSnapshot(template, snapshot, customHeadHtml));
  });
}
