export const BRANDING_COLOR_DEFAULTS = {
  brand_primary_color: "#1E2943",
  brand_secondary_color: "#A6C4B7",
  brand_tertiary_color: "#3A7E78",
  brand_quaternary_color: "#A6623A",
  text_h1_color: "#1E2943",
  text_h2_color: "#1E2943",
  text_h3_h6_color: "#1E2943",
  text_body_color: "#1E2943",
  text_heading_subtext_color: "#646E87",
  text_supporting_copy_color: "#646E87",
  text_helper_text_color: "#646E87",
  text_meta_color: "#646E87",
  text_link_color: "#3A7E78",
  text_link_hover_color: "#1E2943",
  text_inverse_color: "#FBFAF9",
  text_primary_foreground_color: "#FBFAF9",
  text_secondary_foreground_color: "#182035",
  text_tertiary_foreground_color: "#FFFFFF",
} as const;

export type BrandingColorSettingKey = keyof typeof BRANDING_COLOR_DEFAULTS;

const LEGACY_PROMPTED_COLOR_DEFAULTS: Partial<Record<BrandingColorSettingKey, string>> = {
  brand_primary_color: "#0F172A",
  brand_secondary_color: "#E2E8F0",
  brand_tertiary_color: "#0F766E",
  brand_quaternary_color: "#A8623A",
  text_h1_color: "#0F172A",
  text_h2_color: "#0F172A",
  text_h3_h6_color: "#0F172A",
  text_body_color: "#0F172A",
  text_heading_subtext_color: "#64748B",
  text_supporting_copy_color: "#64748B",
  text_helper_text_color: "#64748B",
  text_meta_color: "#64748B",
  text_link_color: "#0F766E",
  text_link_hover_color: "#0F172A",
  text_inverse_color: "#F8FAFC",
  text_primary_foreground_color: "#F8FAFC",
  text_secondary_foreground_color: "#0F172A",
  text_tertiary_foreground_color: "#FFFFFF",
};

export function normalizeBrandingHexColor(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
  return /^#([0-9a-fA-F]{6})$/.test(normalized) ? normalized.toUpperCase() : null;
}

export function resolveBrandingColor(
  key: BrandingColorSettingKey,
  value: string | null | undefined,
): string {
  const normalized = normalizeBrandingHexColor(value);
  const legacyDefault = LEGACY_PROMPTED_COLOR_DEFAULTS[key];

  if (!normalized || (legacyDefault && normalized === legacyDefault)) {
    return BRANDING_COLOR_DEFAULTS[key];
  }

  return normalized;
}
