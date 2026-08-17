import type { Express, Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin/index";
import settingsRoutes from "./settings.routes";
import contactRoutes from "./contact.routes";
import docsRoutes from "./docs.routes";
import uploadRoutes from "./upload.routes";
import notificationsRoutes from "./notifications.routes";
import cmsPublicRoutes from "./cms-public.routes";
import r2PublicRoutes from "./r2-public.routes";
import setupRoutes from "./setup.routes";
import formsRoutes from "./forms.routes";
import { buildRobotsTxtPayload } from "../services/robots-txt.service";
import { storage } from "../storage/index";
import { getCmsPublicPath } from "@shared/glass-seo";
import { BRANDING_COLOR_DEFAULTS, resolveBrandingColor } from "@shared/branding-colors";
import { resolveLocalUploadUrlOrFallback } from "../services/local-upload-storage";

const DEFAULT_FRONTEND_LOGO_URL = "/images/glass-door-pro/brand/logo-header-900x260-white-bg.webp";
const DEFAULT_FAVICON_URL = "/favicon-32x32.png?v=large-2";

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
    try {
      const branding = await storage.settings.getDecryptedCategory("branding");
      res.json({
        frontendLogoUrl: resolveLocalUploadUrlOrFallback(
          branding.frontend_logo_url,
          DEFAULT_FRONTEND_LOGO_URL,
        ),
        faviconUrl: resolveLocalUploadUrlOrFallback(branding.favicon_url, DEFAULT_FAVICON_URL),
        companyName: branding.company_name || "Glass & Door Pro",
        companyAddress:
          branding.company_address || "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210",
        companyPhoneNumbers: branding.company_phone_numbers || "(704) 771-6111",
        companyGoogleBusinessUrl: branding.company_google_business_url || null,
        bodyFont: branding.frontend_body_font || null,
        headingFont: branding.frontend_heading_font || null,
        primaryColor: resolveBrandingColor("brand_primary_color", branding.brand_primary_color),
        secondaryColor: resolveBrandingColor(
          "brand_secondary_color",
          branding.brand_secondary_color,
        ),
        tertiaryColor: resolveBrandingColor("brand_tertiary_color", branding.brand_tertiary_color),
        quaternaryColor: resolveBrandingColor(
          "brand_quaternary_color",
          branding.brand_quaternary_color,
        ),
        h1Color: resolveBrandingColor("text_h1_color", branding.text_h1_color),
        h2Color: resolveBrandingColor("text_h2_color", branding.text_h2_color),
        h3ToH6Color: resolveBrandingColor("text_h3_h6_color", branding.text_h3_h6_color),
        bodyTextColor: resolveBrandingColor("text_body_color", branding.text_body_color),
        headingSubtextColor: resolveBrandingColor(
          "text_heading_subtext_color",
          branding.text_heading_subtext_color || branding.text_muted_color,
        ),
        supportingCopyColor: resolveBrandingColor(
          "text_supporting_copy_color",
          branding.text_supporting_copy_color || branding.text_muted_color,
        ),
        helperTextColor: resolveBrandingColor(
          "text_helper_text_color",
          branding.text_helper_text_color || branding.text_muted_color,
        ),
        metaTextColor: resolveBrandingColor("text_meta_color", branding.text_meta_color),
        linkColor: resolveBrandingColor("text_link_color", branding.text_link_color),
        linkHoverColor: resolveBrandingColor(
          "text_link_hover_color",
          branding.text_link_hover_color,
        ),
        inverseTextColor: resolveBrandingColor("text_inverse_color", branding.text_inverse_color),
        primaryTextColor: resolveBrandingColor(
          "text_primary_foreground_color",
          branding.text_primary_foreground_color,
        ),
        secondaryTextColor: resolveBrandingColor(
          "text_secondary_foreground_color",
          branding.text_secondary_foreground_color,
        ),
        tertiaryTextColor: resolveBrandingColor(
          "text_tertiary_foreground_color",
          branding.text_tertiary_foreground_color,
        ),
      });
    } catch (err) {
      logger.app.warn("Failed to retrieve branding settings, returning defaults", {
        error: err instanceof Error ? err.message : String(err),
      });
      res.json({
        frontendLogoUrl: DEFAULT_FRONTEND_LOGO_URL,
        faviconUrl: DEFAULT_FAVICON_URL,
        companyName: "Glass & Door Pro",
        companyAddress: "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210",
        companyPhoneNumbers: "(704) 771-6111",
        companyGoogleBusinessUrl: null,
        bodyFont: null,
        headingFont: null,
        primaryColor: BRANDING_COLOR_DEFAULTS.brand_primary_color,
        secondaryColor: BRANDING_COLOR_DEFAULTS.brand_secondary_color,
        tertiaryColor: BRANDING_COLOR_DEFAULTS.brand_tertiary_color,
        quaternaryColor: BRANDING_COLOR_DEFAULTS.brand_quaternary_color,
        h1Color: BRANDING_COLOR_DEFAULTS.text_h1_color,
        h2Color: BRANDING_COLOR_DEFAULTS.text_h2_color,
        h3ToH6Color: BRANDING_COLOR_DEFAULTS.text_h3_h6_color,
        bodyTextColor: BRANDING_COLOR_DEFAULTS.text_body_color,
        headingSubtextColor: BRANDING_COLOR_DEFAULTS.text_heading_subtext_color,
        supportingCopyColor: BRANDING_COLOR_DEFAULTS.text_supporting_copy_color,
        helperTextColor: BRANDING_COLOR_DEFAULTS.text_helper_text_color,
        metaTextColor: BRANDING_COLOR_DEFAULTS.text_meta_color,
        linkColor: BRANDING_COLOR_DEFAULTS.text_link_color,
        linkHoverColor: BRANDING_COLOR_DEFAULTS.text_link_hover_color,
        inverseTextColor: BRANDING_COLOR_DEFAULTS.text_inverse_color,
        primaryTextColor: BRANDING_COLOR_DEFAULTS.text_primary_foreground_color,
        secondaryTextColor: BRANDING_COLOR_DEFAULTS.text_secondary_foreground_color,
        tertiaryTextColor: BRANDING_COLOR_DEFAULTS.text_tertiary_foreground_color,
      });
    }
  });

  app.get("/api/runtime-integrations", async (_req, res) => {
    try {
      const analytics = await storage.settings.getDecryptedCategory("google_analytics");
      res.json({
        ga4MeasurementId: analytics.ga4_measurement_id || null,
      });
    } catch (err) {
      logger.app.warn("Failed to retrieve runtime integrations, returning defaults", {
        error: err instanceof Error ? err.message : String(err),
      });
      res.json({
        ga4MeasurementId: null,
      });
    }
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
        if (page.status !== "published" || page.noindex) continue;
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
    } catch (err) {
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
