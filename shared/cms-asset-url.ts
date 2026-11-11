const LEGACY_CMS_ASSET_MAP: Record<string, string> = {
  "/images/hero-therapy-session.png": "/images/hero-therapy-session-1920w.webp",
  "/uploads/cms/1781107243034-monroe.webp": "/images/glass-door-pro/city-monroe-hero.webp",
  "/uploads/cms/1781107218199-charlotte1.webp": "/images/glass-door-pro/city-charlotte-hero.webp",
};

export function resolveCmsAssetUrl(url: string): string {
  return LEGACY_CMS_ASSET_MAP[url] ?? url;
}
