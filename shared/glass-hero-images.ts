export const MOBILE_HERO_MEDIA = "(max-width: 640px)";
export const DESKTOP_HERO_MEDIA = "(min-width: 641px)";

const mobileHeroImages: Record<string, string> = {
  "/images/glass-door-pro/gallery-shower1-1280w.webp":
    "/images/glass-door-pro/gallery-shower1-1280w-mobile-1280w.webp",
  "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp":
    "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080-mobile-1280w.webp",
  "/images/glass-door-pro/city-waxhaw-hero.webp":
    "/images/glass-door-pro/city-waxhaw-hero-mobile-1280w.webp",
};

export function getMobileHeroImageUrl(imageUrl: string): string | undefined {
  return mobileHeroImages[imageUrl];
}
