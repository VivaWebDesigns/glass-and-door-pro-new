import { PUBLIC_MENU_LOCATIONS, type CmsMenu, type PublicMenuLocation } from "@shared/schema";
import { BRANDING_COLOR_DEFAULTS, resolveBrandingColor } from "@shared/branding-colors";
import { resolveLocalUploadUrlOrFallback } from "./local-upload-storage";
import { storage } from "../storage/index";
import { logger } from "../utils/logger";

const DEFAULT_FRONTEND_LOGO_URL = "/images/glass-door-pro/brand/logo-header-900x260-white-bg.webp";
const DEFAULT_FAVICON_URL = "/favicon-32x32.png?v=large-2";

/** What GET /api/branding returns; the same payload is embedded in public page HTML. */
export async function getPublicBranding() {
  try {
    const branding = await storage.settings.getDecryptedCategory("branding");
    return ({
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
    return ({
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
}

/** What GET /api/cms/menus returns: the first menu assigned to each public location. */
export async function getPublicMenuMap(): Promise<Partial<Record<PublicMenuLocation, CmsMenu>>> {
  const menus = await storage.cmsMenus.getAll();
  const menuMap: Partial<Record<PublicMenuLocation, CmsMenu>> = {};
  for (const menu of menus) {
    const location = menu.location as PublicMenuLocation;
    if (!PUBLIC_MENU_LOCATIONS.includes(location) || menuMap[location]) continue;
    menuMap[location] = menu;
  }
  return menuMap;
}
