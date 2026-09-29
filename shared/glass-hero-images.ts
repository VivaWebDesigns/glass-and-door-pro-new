export const MOBILE_HERO_MEDIA = "(max-width: 640px)";
export const DESKTOP_HERO_MEDIA = "(min-width: 641px)";

const mobileHeroImages = new Set([
  "/images/glass-door-pro/gallery-shower1-1280w.webp",
  "/images/glass-door-pro/reviews-hero-1920w.webp",
  "/images/glass-door-pro/charming-suburban-home-hero-1920x1080.webp",
  "/images/glass-door-pro/city-charlotte-hero.webp",
  "/images/glass-door-pro/city-fort-mill-hero.webp",
  "/images/glass-door-pro/city-indian-land-hero.webp",
  "/images/glass-door-pro/city-indian-trail-hero.webp",
  "/images/glass-door-pro/city-matthews-hero.webp",
  "/images/glass-door-pro/city-monroe-hero.webp",
  "/images/glass-door-pro/city-pineville-hero.webp",
  "/images/glass-door-pro/city-stallings-hero.webp",
  "/images/glass-door-pro/city-waxhaw-hero.webp",
  "/images/glass-door-pro/city-weddington-hero.webp",
  "/images/glass-door-pro/city-wesley-chapel-hero.webp",
  "/images/glass-door-pro/storefront-door-installation-hero.webp",
  "/images/glass-door-pro/commercial-door-repair-hero.webp",
  "/images/glass-door-pro/commercial-hero-1280w.webp",
  "/images/glass-door-pro/storefront-glass-replacement-hero.webp",
  "/images/glass-door-pro/commercial-window-replacement-hero-blue-sky.webp",
  "/images/glass-door-pro/door-hero.webp",
  "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp",
  "/images/glass-door-pro/broken-glass-hero.webp",
]);

export function getMobileHeroImageUrl(imageUrl: string): string | undefined {
  return mobileHeroImages.has(imageUrl)
    ? imageUrl.replace(/\.webp$/, "-mobile-1280w.webp")
    : undefined;
}
