import { getCmsPublicPath, isGlassLegalNoindexSlug } from "@shared/glass-seo";
import type { Express, NextFunction, Request, Response } from "express";
import { buildRobotsTxtPayload } from "../services/robots-txt.service";
import { storage } from "../storage/index";
import { logger } from "../utils/logger";
import adminRoutes from "./admin/index";
import authRoutes from "./auth.routes";
import cmsPublicRoutes from "./cms-public.routes";
import contactRoutes from "./contact.routes";
import docsRoutes from "./docs.routes";
import formsRoutes from "./forms.routes";
import notificationsRoutes from "./notifications.routes";
import r2PublicRoutes from "./r2-public.routes";
import settingsRoutes from "./settings.routes";
import setupRoutes from "./setup.routes";
import uploadRoutes from "./upload.routes";
import { getPublicBranding } from "../services/public-bootstrap.service";


function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function registerApiRoutes(app: Express) {
  app.use("/r2", r2PublicRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin", settingsRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/forms", formsRoutes);
  app.use("/api/admin/docs", docsRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/notifications", notificationsRoutes);
  app.use("/api/cms", cmsPublicRoutes);
  app.use("/api/setup", setupRoutes);

  app.get("/api/branding", async (_req, res) => {
    res.json(await getPublicBranding());
  });

  app.get("/api/seo/global", async (_req, res) => {
    const settings = await storage.seoSettings.get();
    res.json(settings ?? {});
  });

  app.get("/robots.txt", async (_req, res) => {
    try {
      const seoSettings = await storage.seoSettings.get();
      const { effectiveContent } = buildRobotsTxtPayload(seoSettings);

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(effectiveContent);
    } catch {
      res.status(500).send("Error generating robots.txt");
    }
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const [seoSettings, pages] = await Promise.all([
        storage.seoSettings.get(),
        storage.cmsPages.getAllPages(),
      ]);

      const base = seoSettings?.siteUrl?.replace(/\/$/, "") || "";

      const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: string }> =
        [];

      urls.push({ loc: base || "/", changefreq: "weekly", priority: "1.0" });
      urls.push({
        loc: `${base}/service-areas`,
        changefreq: "monthly",
        priority: "0.75",
      });

      for (const page of pages) {
        if (page.status !== "published" || page.noindex || isGlassLegalNoindexSlug(page.slug)) {
          continue;
        }
        if (
          [
            "home",
            "about",
            "contact",
            "join",
            "insights",
            "events",
            "recordings",
            "directory",
          ].includes(page.slug)
        )
          continue;
        const publicPath = getCmsPublicPath(page.slug);
        const priority = publicPath.startsWith("/services/")
          ? "0.8"
          : publicPath.startsWith("/service-areas/")
            ? "0.75"
            : ["privacy-policy", "terms-of-service", "disclaimer"].includes(page.slug)
              ? "0.3"
              : "0.6";
        urls.push({
          loc: page.canonicalUrl || `${base}${publicPath}`,
          lastmod: page.updatedAt
            ? new Date(page.updatedAt).toISOString().split("T")[0]
            : undefined,
          changefreq: "monthly",
          priority,
        });
      }

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((u) => {
          const parts = [`  <url>`, `    <loc>${escapeXml(u.loc)}</loc>`];
          if (u.lastmod) parts.push(`    <lastmod>${u.lastmod}</lastmod>`);
          if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
          if (u.priority) parts.push(`    <priority>${u.priority}</priority>`);
          parts.push(`  </url>`);
          return parts.join("\n");
        }),
        "</urlset>",
      ].join("\n");

      res.set("Content-Type", "application/xml; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(xml);
    } catch {
      res.status(500).send("Error generating sitemap");
    }
  });

  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET" || req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    try {
      const redirect = await storage.redirects.getActiveForPath(req.path);
      if (redirect) {
        return res.redirect(redirect.statusCode, redirect.toPath);
      }
    } catch (err) {
      logger.app.warn("Failed to look up redirect", {
        path: req.path,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    next();
  });
}
