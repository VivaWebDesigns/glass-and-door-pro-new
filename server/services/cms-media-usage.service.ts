import { storage } from "../storage";
import { createHash } from "crypto";
import type {
  CmsMediaAsset,
  CmsMediaLibraryAsset,
  CmsMediaUsageReference,
  CmsPage,
  SeoSettings,
} from "@shared/schema";

function isImageMimeType(mimeType: string) {
  return mimeType.startsWith("image/");
}

function assetKind(asset: CmsMediaAsset): "image" | "document" {
  return isImageMimeType(asset.mimeType) ? "image" : "document";
}

const IMAGE_URL_PATTERN =
  /(?:https?:\/\/[^\s"'<>]+|\/(?:uploads|images|r2)\/[^\s"'<>]+)\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?[^"'\s<>]*)?/gi;

function isImageUrl(value: string) {
  return /^(?:https?:\/\/|\/(?:uploads|images|r2)\/).+\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i.test(
    value,
  );
}

function normalizeUrlKey(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return url;
  }
}

function collectImageUrls(value: unknown, urls = new Set<string>()) {
  if (!value) return urls;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (isImageUrl(trimmed)) {
      urls.add(trimmed);
    }
    for (const match of trimmed.matchAll(IMAGE_URL_PATTERN)) {
      urls.add(match[0]);
    }
    return urls;
  }

  if (Array.isArray(value)) {
    for (const entry of value) collectImageUrls(entry, urls);
    return urls;
  }

  if (typeof value === "object") {
    for (const entry of Object.values(value as Record<string, unknown>)) {
      collectImageUrls(entry, urls);
    }
  }

  return urls;
}

function inferMimeType(url: string) {
  const pathname = normalizeUrlKey(url).toLowerCase();
  if (pathname.endsWith(".png")) return "image/png";
  if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
  if (pathname.endsWith(".gif")) return "image/gif";
  if (pathname.endsWith(".svg")) return "image/svg+xml";
  if (pathname.endsWith(".avif")) return "image/avif";
  return "image/webp";
}

function displayNameFromUrl(url: string) {
  const path = normalizeUrlKey(url);
  const filename = decodeURIComponent(path.split("/").filter(Boolean).pop() || "site-image");
  return filename || "site-image";
}

function createDiscoveredAsset(url: string): CmsMediaAsset {
  const originalName = displayNameFromUrl(url);
  return {
    id: `site-image:${createHash("sha1").update(url).digest("hex").slice(0, 16)}`,
    filename: originalName,
    originalName,
    title: originalName.replace(/\.[^.]+$/, ""),
    url,
    mimeType: inferMimeType(url),
    fileSize: 0,
    r2Key: null,
    alt: "",
    caption: null,
    description: null,
    seoTitle: null,
    seoDescription: null,
    ogTitle: null,
    ogDescription: null,
    uploadedBy: null,
    createdAt: null,
  };
}

function buildAssetNeedles(asset: CmsMediaAsset): string[] {
  const needles = new Set<string>();
  if (asset.url) {
    needles.add(asset.url);
    try {
      const parsed = new URL(asset.url);
      needles.add(parsed.toString());
      if (parsed.pathname.startsWith("/cms/media/") || parsed.pathname.startsWith("/uploads/")) {
        needles.add(parsed.pathname);
      }
    } catch {
      // Relative URLs are fine as-is.
    }
  }
  return Array.from(needles).filter(Boolean);
}

function textReferencesAsset(text: string, asset: CmsMediaAsset): boolean {
  return buildAssetNeedles(asset).some((needle) => text.includes(needle));
}

function valueReferencesAsset(value: unknown, asset: CmsMediaAsset): boolean {
  if (!value) return false;
  if (typeof value === "string") {
    return textReferencesAsset(value, asset);
  }
  if (Array.isArray(value)) {
    return value.some((entry) => valueReferencesAsset(entry, asset));
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((entry) =>
      valueReferencesAsset(entry, asset),
    );
  }
  return false;
}

function addUsageReference(
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  assetId: string,
  reference: CmsMediaUsageReference,
) {
  const dedupeKey = `${assetId}:${reference.entityType}:${reference.entityId}:${reference.field}`;
  if (dedupe.has(dedupeKey)) {
    return;
  }
  dedupe.add(dedupeKey);
  const existing = usageMap.get(assetId) ?? [];
  existing.push(reference);
  usageMap.set(assetId, existing);
}

function addDirectFieldUsage<T extends { id: string }>(
  assets: CmsMediaAsset[],
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  entity: T,
  entityType: CmsMediaUsageReference["entityType"],
  entityName: string,
  path: string | undefined,
  field: string,
  fieldValue: string | null | undefined,
  isLive: boolean,
  statusLabel: string,
) {
  if (!fieldValue) return;
  for (const asset of assets) {
    if (!textReferencesAsset(fieldValue, asset)) continue;
    addUsageReference(usageMap, dedupe, asset.id, {
      entityType,
      entityId: entity.id,
      entityName,
      field,
      path,
      isLive,
      statusLabel,
    });
  }
}

function addContentUsage<T extends { id: string }>(
  assets: CmsMediaAsset[],
  usageMap: Map<string, CmsMediaUsageReference[]>,
  dedupe: Set<string>,
  entity: T,
  entityType: CmsMediaUsageReference["entityType"],
  entityName: string,
  path: string | undefined,
  content: unknown,
  isLive: boolean,
  statusLabel: string,
) {
  for (const asset of assets) {
    if (!valueReferencesAsset(content, asset)) continue;
    addUsageReference(usageMap, dedupe, asset.id, {
      entityType,
      entityId: entity.id,
      entityName,
      field: "content",
      path,
      isLive,
      statusLabel,
    });
  }
}

function pageStatusLabel(page: CmsPage) {
  return page.status === "published"
    ? "Published page"
    : `${page.status[0].toUpperCase()}${page.status.slice(1)} page`;
}

export async function buildCmsMediaLibraryAssets(
  assets: CmsMediaAsset[],
): Promise<CmsMediaLibraryAsset[]> {
  const [pages, seoSettings] = await Promise.all([
    storage.cmsPages.getAllPages(),
    storage.seoSettings.get(),
  ]);

  const discoveredUrls = new Set<string>();
  for (const page of pages) {
    collectImageUrls(page.ogImageUrl, discoveredUrls);
    collectImageUrls(page.content, discoveredUrls);
  }
  if (seoSettings) {
    collectImageUrls(seoSettings.defaultOgImageUrl, discoveredUrls);
    collectImageUrls(seoSettings.organizationLogoUrl, discoveredUrls);
  }

  const managedUrlKeys = new Set(
    assets.flatMap((asset) => buildAssetNeedles(asset).map((needle) => normalizeUrlKey(needle))),
  );
  const discoveredAssets = Array.from(discoveredUrls)
    .filter((url) => !managedUrlKeys.has(normalizeUrlKey(url)))
    .map(createDiscoveredAsset);
  const allAssets = [...assets, ...discoveredAssets];

  const usageMap = new Map<string, CmsMediaUsageReference[]>();
  const dedupe = new Set<string>();

  for (const page of pages) {
    const isLive = page.status === "published";
    const path = page.slug ? `/${page.slug}` : undefined;
    addDirectFieldUsage(
      allAssets,
      usageMap,
      dedupe,
      page,
      "page",
      page.title,
      path,
      "ogImageUrl",
      page.ogImageUrl,
      isLive,
      pageStatusLabel(page),
    );
    addContentUsage(
      allAssets,
      usageMap,
      dedupe,
      page,
      "page",
      page.title,
      path,
      page.content,
      isLive,
      pageStatusLabel(page),
    );
  }

  if (seoSettings) {
    const globalSeo = seoSettings as SeoSettings;
    const seoEntity = { id: globalSeo.id };
    addDirectFieldUsage(
      allAssets,
      usageMap,
      dedupe,
      seoEntity,
      "global_seo",
      "Global SEO",
      undefined,
      "defaultOgImageUrl",
      globalSeo.defaultOgImageUrl,
      true,
      "Global setting",
    );
    addDirectFieldUsage(
      allAssets,
      usageMap,
      dedupe,
      seoEntity,
      "global_seo",
      "Global SEO",
      undefined,
      "organizationLogoUrl",
      globalSeo.organizationLogoUrl,
      true,
      "Global setting",
    );
  }

  return allAssets.map((asset) => {
    const usageRefs = (usageMap.get(asset.id) ?? []).sort((a, b) => {
      if (a.isLive !== b.isLive) {
        return a.isLive ? -1 : 1;
      }
      return a.entityName.localeCompare(b.entityName);
    });
    const liveUsageCount = usageRefs.filter((ref) => ref.isLive).length;

    return {
      ...asset,
      assetKind: assetKind(asset),
      usageRefs,
      usageCount: usageRefs.length,
      liveUsageCount,
      isInUse: liveUsageCount > 0,
      isManaged: !asset.id.startsWith("site-image:"),
      sourceLabel: asset.id.startsWith("site-image:") ? "Discovered on site" : "Managed upload",
    };
  });
}
