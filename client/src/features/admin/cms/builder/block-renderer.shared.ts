import type { CSSProperties, SyntheticEvent } from "react";
import { normalizeHexColor } from "./section-style";

export function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

export function num(v: unknown, fallback = 3): number {
  return typeof v === "number" ? v : fallback;
}

export function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function colorStyle(value: unknown, fallback?: string) {
  const normalized = normalizeHexColor(str(value)) || fallback || "";
  return normalized ? { color: normalized } : undefined;
}

const MOBILE_IMAGE_HEIGHT_MAP: Record<string, string> = {
  auto: "auto",
  sm: "240px",
  md: "320px",
  lg: "420px",
  xl: "520px",
};

export function getMobileImageStyles(props: Record<string, unknown>): CSSProperties {
  const fit = str(props.mobileImageFit) || "cover";
  const heightKey = str(props.mobileImageHeight) || "auto";
  const height = MOBILE_IMAGE_HEIGHT_MAP[heightKey] ?? MOBILE_IMAGE_HEIGHT_MAP.auto;
  const positionX = Math.max(0, Math.min(100, num(props.mobileImagePositionX, 50)));
  const positionY = Math.max(0, Math.min(100, num(props.mobileImagePositionY, 50)));

  return {
    ["--mobile-image-fit" as string]: fit,
    ["--mobile-image-height" as string]: height,
    ["--image-position" as string]: `${positionX}% ${positionY}%`,
    ["--mobile-image-position" as string]: `${positionX}% ${positionY}%`,
  };
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export const SPACING_MAP: Record<string, string> = {
  xs: "h-4",
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
};

export const IMAGE_WIDTH_MAP: Record<string, string> = {
  full: "w-full",
  contained: "max-w-4xl mx-auto",
  narrow: "max-w-2xl mx-auto",
};

const LEGACY_CMS_ASSET_MAP: Record<string, string> = {
  "/images/hero-therapy-session.png": "/images/hero-therapy-session-1920w.webp",
  "/uploads/cms/1781107243034-monroe.webp": "/images/glass-door-pro/city-monroe-hero.webp",
  "/uploads/cms/1781107218199-charlotte1.webp": "/images/glass-door-pro/city-charlotte-hero.webp",
};

export const CMS_MISSING_IMAGE_PLACEHOLDER_URL = "/images/cms-media-missing.svg";

type ResponsiveHeroImage = {
  fallback: string;
  avifSrcSet: string;
  webpSrcSet: string;
};

function heroImage(base: string, widths: number[], fallbackWidth: number): ResponsiveHeroImage {
  const src = (width: number, format: "avif" | "webp") =>
    `/images/glass-door-pro/hero/${base}-${width}w.${format}`;

  return {
    fallback: src(fallbackWidth, "webp"),
    avifSrcSet: widths.map((width) => `${src(width, "avif")} ${width}w`).join(", "),
    webpSrcSet: widths.map((width) => `${src(width, "webp")} ${width}w`).join(", "),
  };
}

const RESPONSIVE_HERO_IMAGE_MAP: Record<string, ResponsiveHeroImage> = {
  "/images/glass-door-pro/gallery-shower1-1280w.jpg": heroImage("gallery-shower1-hero", [640, 960, 1280], 1280),
  "/images/glass-door-pro/hero/gallery-shower1-hero-1280w.webp": heroImage("gallery-shower1-hero", [640, 960, 1280], 1280),
  "/images/glass-door-pro/frameless-parallax.jpg": heroImage("frameless-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/hero/frameless-parallax-hero-1024w.webp": heroImage("frameless-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/window-parallax.jpg": heroImage("window-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/hero/window-parallax-hero-1024w.webp": heroImage("window-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/door-parallax.jpg": heroImage("door-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/hero/door-parallax-hero-1024w.webp": heroImage("door-parallax-hero", [640, 768, 1024], 1024),
  "/images/glass-door-pro/window-repair-parallax.jpg": heroImage("window-repair-parallax-hero", [640, 960, 1365], 1365),
  "/images/glass-door-pro/hero/window-repair-parallax-hero-1365w.webp": heroImage("window-repair-parallax-hero", [640, 960, 1365], 1365),
  "/images/glass-door-pro/commercial-hero-1280w.webp": heroImage("commercial-hero", [640, 960, 1280], 1280),
  "/images/glass-door-pro/hero/commercial-hero-1280w.webp": heroImage("commercial-hero", [640, 960, 1280], 1280),
};

export function cmsBackgroundImageValue(url: string): string {
  const resolvedUrl = resolveCmsAssetUrl(url);
  if (!resolvedUrl) return "";
  return `url(${JSON.stringify(resolvedUrl)})`;
}

export function handleCmsPreviewImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.src.endsWith(CMS_MISSING_IMAGE_PLACEHOLDER_URL)) return;
  image.onerror = null;
  image.src = CMS_MISSING_IMAGE_PLACEHOLDER_URL;
}

export function getResponsiveCmsHeroImage(url: string): ResponsiveHeroImage {
  const resolvedUrl = resolveCmsAssetUrl(url);
  return (
    RESPONSIVE_HERO_IMAGE_MAP[resolvedUrl] ?? {
      fallback: resolvedUrl,
      avifSrcSet: "",
      webpSrcSet: "",
    }
  );
}

export function resolveCmsAssetUrl(url: string): string {
  return LEGACY_CMS_ASSET_MAP[url] ?? url;
}
