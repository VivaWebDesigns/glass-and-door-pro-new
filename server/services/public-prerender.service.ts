import sanitizeHtml from "sanitize-html";
import type { CmsPage, SeoSettings } from "@shared/schema";
import { formatBrandFirstTitle, formatBrandLastTitle } from "@shared/seo-title";
import {
  buildGlassBreadcrumbItems,
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getGlassCityPageArea,
  getGlassServiceSeoOverride,
  getGlassServiceSocialMetadata,
  getCmsPublicPath,
  getCmsSlugForPublicPath,
  isGlassServicePageSlug,
} from "@shared/glass-seo";
import { storage } from "../storage";

interface PublicHtmlSnapshot {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  twitterSite?: string | null;
  robots?: string | null;
  bodyHtml: string;
  jsonLd?: Array<Record<string, unknown>>;
  cmsPage?: CmsPage;
}

const DEFAULT_TITLE = "Glass & Door Pro | Charlotte Glass, Windows & Doors";
const DEFAULT_DESCRIPTION =
  "Glass & Door Pro serves the Charlotte area with frameless showers, residential windows, door installation, window repair, and commercial glass.";

const FALLBACK_STATIC_PAGES: Record<
  string,
  { title: string; description: string; body: string; noindex?: boolean }
> = {
  "/": {
    title: "Home",
    description:
      "Explore frameless showers, window installation, door installation, window repair, and commercial glass from Glass & Door Pro.",
    body:
      "Glass & Door Pro serves greater Charlotte with frameless showers, windows, doors, window repair, and commercial glass.",
  },
  "/gallery": {
    title: "Gallery",
    description:
      "Browse recent frameless shower, glass, window, and door installation projects from Glass & Door Pro in the Charlotte area.",
    body:
      "Browse recent Glass & Door Pro project photos, including frameless shower installations across Charlotte, Monroe, Indian Trail, and nearby communities.",
  },
  "/reviews": {
    title: "Customer Reviews",
    description:
      "Read customer reviews for Glass & Door Pro glass, shower, window, door, and commercial glass work in the Charlotte area.",
    body:
      "Read Glass & Door Pro customer reviews from homeowners and businesses across Charlotte, Monroe, Indian Trail, and nearby communities.",
  },
  "/services": {
    title: "Glass and Door Services",
    description:
      "Explore frameless showers, window installation, door installation, window repair, and commercial glass services from Glass & Door Pro in Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas.",
    body:
      "Glass & Door Pro provides frameless shower doors, residential window installation, door installation, window repair, and commercial glass services across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby communities.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
    body:
      "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description:
      "Review the terms governing use of the Glass & Door Pro website, estimates, service information, third-party links, and site content.",
    body:
      "Review the terms governing use of the Glass & Door Pro website, estimates, service information, third-party links, and site content.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Review important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
    body:
      "Review important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
  },
};

const RETIRED_PUBLIC_PATH_PREFIXES = ["/directory", "/events", "/insights", "/join", "/recordings", "/therapist"];
const REDIRECT_ONLY_PUBLIC_PATHS = new Set(["/about", "/contact"]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, length = 240) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
}

const PUBLIC_TEXT_KEYS = new Set([
  "alt",
  "answer",
  "areasClosing",
  "areasIntro",
  "badgeLabel",
  "badgeValue",
  "body",
  "caption",
  "content",
  "ctaBody",
  "ctaFooter",
  "ctaHeading",
  "description",
  "eyebrow",
  "formTitle",
  "heading",
  "imageAlt",
  "introContent",
  "introTitle",
  "label",
  "name",
  "question",
  "quote",
  "sectionEyebrow",
  "servicesIntro",
  "servicesTitle",
  "subheading",
  "subtitle",
  "text",
  "title",
  "value",
]);

const NON_CONTENT_KEYS = new Set([
  "anchorId",
  "backgroundImageUrl",
  "canonicalUrl",
  "columns",
  "createdAt",
  "createdBy",
  "ctaAction",
  "ctaLink",
  "ctaSecondaryLink",
  "externalUrl",
  "formSlug",
  "gap",
  "href",
  "icon",
  "id",
  "imagePosition",
  "imagePositionX",
  "imagePositionY",
  "imageUrl",
  "layout",
  "link",
  "location",
  "noindex",
  "ogImageUrl",
  "overlayColor",
  "overlayOpacity",
  "pageType",
  "publishedAt",
  "scheduledAt",
  "sectionBackgroundColor",
  "sectionPaddingBottom",
  "sectionPaddingTop",
  "seoDescription",
  "seoKeywords",
  "seoTitle",
  "sidebarId",
  "slug",
  "status",
  "template",
  "type",
  "updatedAt",
  "updatedBy",
  "url",
  "variant",
  "videoBackgroundUrl",
  "width",
]);

function collectTextFragments(value: unknown, key?: string): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    if (!key || !PUBLIC_TEXT_KEYS.has(key)) return [];
    const normalized = stripHtml(value);
    return normalized ? [normalized] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectTextFragments(entry, key));
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([entryKey, entry]) =>
      NON_CONTENT_KEYS.has(entryKey) ? [] : collectTextFragments(entry, entryKey),
    );
  }
  return [];
}

function uniqueFragments(fragments: string[]) {
  const seen = new Set<string>();
  return fragments.filter((fragment) => {
    const normalized = fragment.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function sanitizeAnchorId(value: unknown) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return /^[A-Za-z][A-Za-z0-9_-]*$/.test(trimmed) ? trimmed : "";
}

function collectAnchoredSections(content: unknown) {
  if (!content || typeof content !== "object") return [];
  const blocks = (content as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return [];

  return blocks
    .map((block) => {
      if (!block || typeof block !== "object") return null;
      const props = (block as { props?: unknown }).props;
      if (!props || typeof props !== "object") return null;
      const anchorId = sanitizeAnchorId((props as { anchorId?: unknown }).anchorId);
      if (!anchorId) return null;
      const fragments = uniqueFragments(collectTextFragments(props)).slice(0, 3);
      return fragments.length > 0 ? { anchorId, fragments } : null;
    })
    .filter((section): section is { anchorId: string; fragments: string[] } => Boolean(section));
}

function isServiceAreaPageSlug(slug: string) {
  return slug.startsWith("service-areas-") || slug.startsWith("areas-served-");
}

function shouldHideServiceAreaWorkGallery(pageSlug: string, block: unknown) {
  if (!isServiceAreaPageSlug(pageSlug)) return false;
  if (!block || typeof block !== "object") return false;

  const entry = block as { type?: unknown; props?: Record<string, unknown> };
  if (entry.type !== "image-grid" || !entry.props) return false;

  const title = typeof entry.props.title === "string" ? entry.props.title : "";
  const anchorId = typeof entry.props.anchorId === "string" ? entry.props.anchorId : "";
  return anchorId === "gallery" && /^Our Work in the .+ Area$/i.test(title.trim());
}

function filterServiceAreaWorkGalleryFromPage(page: CmsPage): CmsPage {
  if (!isServiceAreaPageSlug(page.slug)) return page;
  const content = page.content;
  if (!content || typeof content !== "object") return page;
  const blocks = (content as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return page;

  return {
    ...page,
    content: {
      ...(content as Record<string, unknown>),
      blocks: blocks.filter((block) => !shouldHideServiceAreaWorkGallery(page.slug, block)),
    },
  };
}

function sanitizeRichHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "h2",
      "h3",
      "h4",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

function absoluteUrl(path: string | null | undefined, siteUrl: string) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function serializeJsonForHtml(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildHeadTitle(rawTitle: string, seo?: SeoSettings | null, options?: { brandLast?: boolean }) {
  if (/\s[|–—-]\sGlass (?:&|and) Door Pro$/i.test(rawTitle.trim())) {
    return rawTitle.trim();
  }

  const titleSuffix = seo?.titleSuffix ?? " | Glass & Door Pro";
  const siteName = seo?.siteName ?? "Glass & Door Pro";
  return options?.brandLast
    ? formatBrandLastTitle(rawTitle, titleSuffix, siteName)
    : formatBrandFirstTitle(rawTitle, titleSuffix, siteName);
}

function buildOrganizationSchema(seo: SeoSettings | null, siteUrl: string) {
  if (!seo?.organizationName && !seo?.siteName) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo?.organizationName || seo?.siteName || "Glass & Door Pro",
    url: siteUrl,
    logo: seo?.organizationLogoUrl
      ? {
          "@type": "ImageObject",
          url: absoluteUrl(seo.organizationLogoUrl, siteUrl),
        }
      : undefined,
  };
}

export async function getPublicHeadAdditions(): Promise<string | null> {
  const headHtml = await storage.settings.getSetting("public_head_html");
  const normalized = normalizeHeadMarkup(headHtml);
  return normalized ? normalized : null;
}

function normalizeHeadMarkup(value?: string | null) {
  if (!value) return null;

  return value
    .trim()
    // Repair a common paste mistake where </script is missing its closing angle bracket.
    .replace(/<\/script(?!>)(?=(\s*<)|\s*$)/gi, "</script>");
}

function buildWebsiteSchema(seo: SeoSettings | null, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seo?.siteName || "Glass & Door Pro",
    url: siteUrl,
  };
}

function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function extractFaqItems(pageContent: unknown): Array<{ question: string; answer: string }> {
  if (!pageContent || typeof pageContent !== "object") return [];
  const blocks = (pageContent as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return [];

  const items: Array<{ question: string; answer: string }> = [];
  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const entry = block as { type?: unknown; props?: { items?: unknown } };
    if (entry.type !== "faq" || !Array.isArray(entry.props?.items)) continue;
    for (const item of entry.props.items) {
      if (!item || typeof item !== "object") continue;
      const faq = item as { question?: unknown; answer?: unknown };
      if (typeof faq.question === "string" && typeof faq.answer === "string") {
        const question = stripHtml(faq.question);
        const answer = stripHtml(faq.answer);
        if (question && answer) items.push({ question, answer });
      }
    }
  }
  return items;
}

function buildFaqBodyHtml(items: Array<{ question: string; answer: string }>) {
  if (items.length === 0) return "";

  return [
    `<section class="seo-prerender-faqs" aria-labelledby="seo-prerender-faqs-heading">`,
    `<h2 id="seo-prerender-faqs-heading">Frequently Asked Questions</h2>`,
    ...items.map((item) =>
      [
        `<article class="seo-prerender-faq">`,
        `<h3>${escapeHtml(item.question)}</h3>`,
        sanitizeRichHtml(item.answer),
        `</article>`,
      ].join(""),
    ),
    `</section>`,
  ].join("");
}

function buildFaqPageSchema(items: Array<{ question: string; answer: string }>) {
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function buildSimplePageBody(
  title: string,
  description: string,
  fragments: string[] = [],
  anchoredSections: Array<{ anchorId: string; fragments: string[] }> = [],
  extraHtml: string[] = [],
) {
  const paragraphs = uniqueFragments([description, ...fragments])
    .filter((fragment) => fragment && fragment.toLowerCase() !== title.trim().toLowerCase())
    .slice(0, 8);
  const anchoredHtml = anchoredSections.map((section) => {
    const [heading, ...body] = section.fragments;
    return [
      `<section id="${escapeHtml(section.anchorId)}">`,
      heading ? `<h2>${escapeHtml(heading)}</h2>` : "",
      ...body.map((paragraph) => `<p>${escapeHtml(truncate(paragraph, 340))}</p>`),
      `</section>`,
    ].join("");
  });

  return [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(title)}</h1>`,
    ...paragraphs.map((paragraph) => `<p>${escapeHtml(truncate(paragraph, 340))}</p>`),
    ...anchoredHtml,
    ...extraHtml,
    `</article>`,
    `</main>`,
  ].join("");
}

function getPrerenderHeading(page: Pick<CmsPage, "slug" | "title">, effectiveTitle: string) {
  if (page.slug === "home") {
    return effectiveTitle || "Glass & Door Services in Charlotte & Monroe, NC";
  }

  return page.title;
}

function buildCmsSnapshot(page: CmsPage, seo: SeoSettings | null, siteUrl: string): PublicHtmlSnapshot {
  const visiblePage = filterServiceAreaWorkGalleryFromPage(page);
  const seoOverride = getGlassServiceSeoOverride(visiblePage.slug);
  const socialOverride = getGlassServiceSocialMetadata(visiblePage.slug);
  const title = seoOverride?.title || visiblePage.seoTitle || visiblePage.title || "Page";
  const description =
    seoOverride?.description ||
    visiblePage.seoDescription ||
    truncate(uniqueFragments(collectTextFragments(visiblePage.content)).join(" "), 180) ||
    DEFAULT_DESCRIPTION;
  const publicPath = getCmsPublicPath(visiblePage.slug);
  const canonicalUrl =
    visiblePage.canonicalUrl || (publicPath === "/" ? siteUrl : `${siteUrl}${publicPath}`);
  const faqItems = extractFaqItems(visiblePage.content);
  const bodyHtml = buildSimplePageBody(
    getPrerenderHeading(visiblePage, title),
    description,
    uniqueFragments(collectTextFragments(visiblePage.content)),
    collectAnchoredSections(visiblePage.content),
    [buildFaqBodyHtml(faqItems)].filter(Boolean),
  );

  const breadcrumbs =
    visiblePage.slug === "home" ? null : buildBreadcrumbSchema(buildGlassBreadcrumbItems(visiblePage, siteUrl));
  const cityArea = getGlassCityPageArea(visiblePage.slug);

  return {
    title: buildHeadTitle(title, seo, {
      brandLast: visiblePage.slug === "home" || isGlassServicePageSlug(visiblePage.slug),
    }),
    description,
    canonicalUrl,
    ogTitle: socialOverride?.ogTitle || null,
    ogDescription: socialOverride?.ogDescription || null,
    ogImageUrl: absoluteUrl(visiblePage.ogImageUrl || seo?.defaultOgImageUrl, siteUrl) || null,
    twitterSite: socialOverride?.twitterSite || null,
    robots: visiblePage.noindex ? "noindex,nofollow" : null,
    bodyHtml,
    cmsPage: visiblePage,
    jsonLd: [
      buildGlassLocalBusinessLd(siteUrl, cityArea),
      buildGlassServiceLdForCmsPage(visiblePage, siteUrl),
      breadcrumbs,
      buildFaqPageSchema(faqItems),
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildFallbackSnapshot(
  pathname: string,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot | null {
  const fallback = FALLBACK_STATIC_PAGES[pathname];
  if (!fallback) return null;

  return {
    title: buildHeadTitle(fallback.title, seo),
    description: fallback.description,
    canonicalUrl: pathname === "/" ? siteUrl : `${siteUrl}${pathname}`,
    ogImageUrl: absoluteUrl(seo?.defaultOgImageUrl, siteUrl) || null,
    robots: fallback.noindex ? "noindex,nofollow" : null,
    bodyHtml: buildSimplePageBody(fallback.title, fallback.body),
    jsonLd: [buildOrganizationSchema(seo, siteUrl), buildWebsiteSchema(seo, siteUrl)].filter(
      Boolean,
    ) as Array<Record<string, unknown>>,
  };
}

export async function getPublicHtmlSnapshot(
  pathname: string,
  search = "",
): Promise<PublicHtmlSnapshot | null> {
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/uploads")
  ) {
    return null;
  }

  const seo = (await storage.seoSettings.get()) ?? null;
  const siteUrl =
    (seo?.siteUrl || "").replace(/\/$/, "") ||
    "https://glassanddoorpro.com";

  if (
    REDIRECT_ONLY_PUBLIC_PATHS.has(pathname) ||
    RETIRED_PUBLIC_PATH_PREFIXES.some((retiredPath) => pathname === retiredPath || pathname.startsWith(`${retiredPath}/`))
  ) {
    return null;
  }

  const slug = getCmsSlugForPublicPath(pathname);
  if (slug) {
    if (slug === "gallery") {
      return buildFallbackSnapshot(pathname, seo, siteUrl);
    }

    const page = await storage.cmsPages.getPageBySlug(slug);
    if (page?.status === "published") {
      return buildCmsSnapshot(page, seo, siteUrl);
    }
  }

  return buildFallbackSnapshot(pathname, seo, siteUrl);
}

export function injectPublicHtmlSnapshot(
  template: string,
  snapshot: PublicHtmlSnapshot | null,
  customHeadHtml?: string | null,
) {
  const normalizedTemplate = template
    .replace(/\s*<meta name="description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:title"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:image"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta property="og:url"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:card"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:site"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:title"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:image"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="robots"[^>]*>\s*/i, "\n")
    .replace(/\s*<link rel="canonical"[^>]*>\s*/i, "\n");

  if (!snapshot) {
    return normalizedTemplate
      .replace("<!--APP_DYNAMIC_HEAD-->", () => customHeadHtml || "")
      .replace("<!--APP_PRERENDER_CONTENT-->", () => "");
  }

  const headParts = [
    `<meta name="description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(snapshot.ogTitle || snapshot.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(snapshot.ogDescription || snapshot.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(snapshot.canonicalUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    snapshot.twitterSite ? `<meta name="twitter:site" content="${escapeHtml(snapshot.twitterSite)}" />` : "",
    `<meta name="twitter:title" content="${escapeHtml(snapshot.ogTitle || snapshot.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(snapshot.ogDescription || snapshot.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(snapshot.canonicalUrl)}" />`,
    snapshot.robots ? `<meta name="robots" content="${escapeHtml(snapshot.robots)}" />` : "",
    snapshot.ogImageUrl
      ? `<meta property="og:image" content="${escapeHtml(snapshot.ogImageUrl)}" />`
      : "",
    snapshot.ogImageUrl
      ? `<meta name="twitter:image" content="${escapeHtml(snapshot.ogImageUrl)}" />`
      : "",
    customHeadHtml || "",
    ...(snapshot.jsonLd ?? []).map(
      (schema) =>
        `<script type="application/ld+json">${serializeJsonForHtml(schema)}</script>`,
    ),
  ].filter(Boolean);

  const prerenderPayload = snapshot.cmsPage
    ? `<script id="__CMS_PRERENDER_PAGE__" type="application/json">${serializeJsonForHtml(snapshot.cmsPage)}</script>`
    : "";

  return normalizedTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapeHtml(snapshot.title)}</title>`)
    .replace("<!--APP_DYNAMIC_HEAD-->", () => headParts.join("\n"))
    .replace(
      "<!--APP_PRERENDER_CONTENT-->",
      () =>
        `${prerenderPayload}${snapshot.bodyHtml ? `<div id="seo-prerender">${snapshot.bodyHtml}</div>` : ""}`,
    );
}
