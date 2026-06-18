import type { RequestHandler } from "express";
import { DEFAULT_SITE_FEATURES, normalizeBooleanSetting, type SiteFeatures } from "@shared/site-features";
import { storage } from "../storage/index";
import { logger } from "../utils/logger";

export async function getSiteFeatures(): Promise<SiteFeatures> {
  try {
    const settings = await storage.settings.getDecryptedCategory("system_configuration");
    return {
      directoryEnabled: normalizeBooleanSetting(
        settings.enable_directory,
        DEFAULT_SITE_FEATURES.directoryEnabled,
      ),
      blogEnabled: normalizeBooleanSetting(settings.enable_blog, DEFAULT_SITE_FEATURES.blogEnabled),
      eventsEnabled: normalizeBooleanSetting(
        settings.enable_events,
        DEFAULT_SITE_FEATURES.eventsEnabled,
      ),
      crmEnabled: normalizeBooleanSetting(settings.enable_crm, DEFAULT_SITE_FEATURES.crmEnabled),
    };
  } catch (err) {
    logger.app.warn("Failed to retrieve system configuration, returning defaults", {
      error: err instanceof Error ? err.message : String(err),
    });
    return DEFAULT_SITE_FEATURES;
  }
}

export function requireSiteFeature(feature: keyof SiteFeatures): RequestHandler {
  return async (_req, res, next) => {
    try {
      const features = await getSiteFeatures();
      if (!features[feature]) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
