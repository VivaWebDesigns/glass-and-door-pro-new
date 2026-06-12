import sanitizeHtml from "sanitize-html";
import type { BlogPost, CmsPage, Event, SeoSettings } from "@shared/schema";
import { getEventPath } from "@shared/event-url";
import { formatBrandFirstTitle } from "@shared/seo-title";
import {
  buildGlassBreadcrumbItems,
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getCmsPublicPath,
  getCmsSlugForPublicPath,
} from "@shared/glass-seo";
import { googleFontStylesheetHrefForBrandingOptions } from "@shared/branding-fonts";
import { storage } from "../storage";

interface PublicHtmlSnapshot {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImageUrl?: string | null;
  robots?: string | null;
  preloads?: string[];
  bodyHtml: string;
  jsonLd?: Array<Record<string, unknown>>;
}

type ResponsiveHeroImage = {
  fallback: string;
  avifSrcSet: string;
  webpSrcSet: string;
};

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
    body: "Glass & Door Pro serves greater Charlotte with frameless showers, windows, doors, window repair, and commercial glass.",
  },
  "/about": {
    title: "About",
    description:
      "Learn what it means for a provider to be vetted and how Core Platform supports cross-cultural mental health care.",
    body: "Learn what it means for a provider to be vetted and how Core Platform supports cross-cultural mental health care.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Get in touch with Core Platform through the contact form and company information.",
    body: "Contact Core Platform with questions, feedback, or partnership inquiries through the contact form and company information.",
  },
  "/join": {
    title: "Join the Network",
    description:
      "Learn about membership, the application process, and how Core Platform-informed mental health professionals can join the network.",
    body: "Join the network to learn about membership benefits and the application process, including submitting your application, credential verification, Core Platform competency review, profile setup, and going live in the directory.",
  },
  "/directory": {
    title: "Find a Mental Health Professional",
    description:
      "Search for Core Platform-informed mental health professionals by specialty, location, language, or session format.",
    body: "Find a mental health professional by searching specialties, locations, languages, and session formats in the Core Platform directory.",
  },
  "/gallery": {
    title: "Gallery",
    description:
      "Browse recent frameless shower, glass, window, and door installation projects from Glass & Door Pro in the Charlotte area.",
    body: "Browse recent Glass & Door Pro project photos, including frameless shower installations across Charlotte, Monroe, Indian Trail, and nearby communities.",
  },
  "/reviews": {
    title: "Customer Reviews",
    description:
      "Read customer reviews for Glass & Door Pro glass, shower, window, door, and commercial glass work in the Charlotte area.",
    body: "Read Glass & Door Pro customer reviews from homeowners and businesses across Charlotte, Monroe, Indian Trail, and nearby communities.",
  },
  "/insights": {
    title: "Insights & Articles",
    description:
      "Browse articles, guidance, and insights focused on Third Culture Kids and culturally informed care.",
    body: "Browse insights and articles focused on Third Culture Kids, culturally informed care, and mental health support.",
  },
  "/events": {
    title: "Events",
    description: "Explore public events, trainings, and community gatherings from Core Platform.",
    body: "Explore public events, trainings, and community gatherings from Core Platform.",
  },
  "/recordings": {
    title: "Recording Archives",
    description: "Watch archived event recordings and educational content from Core Platform.",
    body: "Watch archived event recordings and educational content from Core Platform.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Review how Core Platform collects, uses, stores, and protects information across the website and related services.",
    body: "Review how Core Platform collects, uses, stores, and protects information across the website and related services.",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description:
      "Review the terms governing use of the Core Platform website, directory, events, and related services.",
    body: "Review the terms governing use of the Core Platform website, directory, events, and related services.",
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Review emergency guidance, directory vetting limitations, and important information about using the Core Platform directory and related services.",
    body: "Review emergency guidance, directory vetting limitations, and important information about using the Core Platform directory and related services.",
  },
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, length = 240) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}...`;
}

function collectTextFragments(value: unknown): string[] {
  if (!value) return [];
  if (typeof value === "string") {
    const normalized = stripHtml(value);
    return normalized ? [normalized] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectTextFragments(entry));
  }
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((entry) =>
      collectTextFragments(entry),
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

function sanitizeRichHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li", "blockquote", "a", "h2", "h3", "h4"],
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

function resolveCmsAssetUrl(url: string): string {
  const legacyCmsAssetMap: Record<string, string> = {
    "/images/hero-therapy-session.png": "/images/hero-therapy-session-1920w.webp",
    "/uploads/cms/1781107243034-monroe.webp": "/images/glass-door-pro/city-monroe-hero.webp",
    "/uploads/cms/1781107218199-charlotte1.webp": "/images/glass-door-pro/city-charlotte-hero.webp",
  };

  return legacyCmsAssetMap[url] ?? url;
}

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
  "/images/glass-door-pro/gallery-shower1-1280w.jpg": heroImage(
    "gallery-shower1-hero",
    [640, 960, 1280],
    1280,
  ),
  "/images/glass-door-pro/hero/gallery-shower1-hero-1280w.webp": heroImage(
    "gallery-shower1-hero",
    [640, 960, 1280],
    1280,
  ),
  "/images/glass-door-pro/frameless-parallax.jpg": heroImage(
    "frameless-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/hero/frameless-parallax-hero-1024w.webp": heroImage(
    "frameless-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/window-parallax.jpg": heroImage(
    "window-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/hero/window-parallax-hero-1024w.webp": heroImage(
    "window-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/door-parallax.jpg": heroImage(
    "door-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/hero/door-parallax-hero-1024w.webp": heroImage(
    "door-parallax-hero",
    [640, 768, 1024],
    1024,
  ),
  "/images/glass-door-pro/window-repair-parallax.jpg": heroImage(
    "window-repair-parallax-hero",
    [640, 960, 1365],
    1365,
  ),
  "/images/glass-door-pro/hero/window-repair-parallax-hero-1365w.webp": heroImage(
    "window-repair-parallax-hero",
    [640, 960, 1365],
    1365,
  ),
  "/images/glass-door-pro/commercial-hero-1280w.webp": heroImage(
    "commercial-hero",
    [640, 960, 1280],
    1280,
  ),
  "/images/glass-door-pro/hero/commercial-hero-1280w.webp": heroImage(
    "commercial-hero",
    [640, 960, 1280],
    1280,
  ),
};

function isPreloadableImageUrl(url: string) {
  return /\.(avif|webp|jpe?g|png)(?:[?#].*)?$/i.test(url);
}

function getResponsiveCmsHeroImage(url: string): ResponsiveHeroImage {
  const resolvedUrl = resolveCmsAssetUrl(url);
  return (
    RESPONSIVE_HERO_IMAGE_MAP[resolvedUrl] ?? {
      fallback: resolvedUrl,
      avifSrcSet: "",
      webpSrcSet: "",
    }
  );
}

function getFirstCmsHeroBackgroundImage(content: unknown): string {
  if (!content || typeof content !== "object") return "";
  const blocks = (content as { blocks?: unknown }).blocks;
  if (!Array.isArray(blocks)) return "";

  for (const block of blocks) {
    if (!block || typeof block !== "object") continue;
    const candidate = block as { type?: unknown; props?: Record<string, unknown> };
    if (candidate.type !== "hero") continue;
    const url = candidate.props?.backgroundImageUrl;
    return typeof url === "string" ? url : "";
  }

  return "";
}

function buildHeroImagePreload(content: unknown): string | null {
  const backgroundImageUrl = getFirstCmsHeroBackgroundImage(content);
  if (!backgroundImageUrl) return null;

  const responsiveHeroImage = getResponsiveCmsHeroImage(backgroundImageUrl);
  const href = responsiveHeroImage.avifSrcSet
    ? responsiveHeroImage.avifSrcSet.split(/\s+/)[0]
    : responsiveHeroImage.fallback;

  if (!href || !isPreloadableImageUrl(href)) return null;

  const attrs = [
    `rel="preload"`,
    `as="image"`,
    `href="${escapeHtml(href)}"`,
    `fetchpriority="high"`,
  ];

  if (responsiveHeroImage.avifSrcSet) {
    attrs.push(`type="image/avif"`);
    attrs.push(`imagesrcset="${escapeHtml(responsiveHeroImage.avifSrcSet)}"`);
    attrs.push(`imagesizes="100vw"`);
  } else if (responsiveHeroImage.webpSrcSet) {
    attrs.push(`type="image/webp"`);
    attrs.push(`imagesrcset="${escapeHtml(responsiveHeroImage.webpSrcSet)}"`);
    attrs.push(`imagesizes="100vw"`);
  }

  return `<link ${attrs.join(" ")} />`;
}

function buildHeadTitle(rawTitle: string, seo?: SeoSettings | null) {
  return formatBrandFirstTitle(
    rawTitle,
    seo?.titleSuffix ?? " | Glass & Door Pro",
    seo?.siteName ?? "Glass & Door Pro",
  );
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
  const [headHtml, branding] = await Promise.all([
    storage.settings.getSetting("public_head_html"),
    storage.settings.getDecryptedCategory("branding").catch(() => null),
  ]);
  const normalized = normalizeHeadMarkup(headHtml);
  const brandingFontHref = googleFontStylesheetHrefForBrandingOptions([
    branding?.frontend_body_font,
    branding?.frontend_heading_font,
  ]);
  const fontLink = brandingFontHref
    ? `<link id="branding-dynamic-fonts" rel="stylesheet" href="${escapeHtml(brandingFontHref)}" />`
    : "";
  const headParts = [fontLink, normalized].filter(Boolean);
  return headParts.length > 0 ? headParts.join("\n") : null;
}

function normalizeHeadMarkup(value?: string | null) {
  if (!value) return null;

  return (
    value
      .trim()
      // Repair a common paste mistake where </script is missing its closing angle bracket.
      .replace(/<\/script(?!>)(?=(\s*<)|\s*$)/gi, "</script>")
  );
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

function buildSimplePageBody(title: string, description: string, fragments: string[] = []) {
  const paragraphs = uniqueFragments([description, ...fragments])
    .filter((fragment) => fragment && fragment.toLowerCase() !== title.trim().toLowerCase())
    .slice(0, 8);

  return [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(title)}</h1>`,
    ...paragraphs.map((paragraph) => `<p>${escapeHtml(truncate(paragraph, 340))}</p>`),
    `</article>`,
    `</main>`,
  ].join("");
}

function buildCmsSnapshot(
  page: CmsPage,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot {
  const title = page.seoTitle || page.title || "Page";
  const description =
    page.seoDescription ||
    truncate(uniqueFragments(collectTextFragments(page.content)).join(" "), 180) ||
    DEFAULT_DESCRIPTION;
  const publicPath = getCmsPublicPath(page.slug);
  const canonicalUrl =
    page.canonicalUrl || (publicPath === "/" ? siteUrl : `${siteUrl}${publicPath}`);
  const bodyHtml = buildSimplePageBody(
    page.title,
    description,
    uniqueFragments(collectTextFragments(page.content)),
  );

  const breadcrumbs =
    page.slug === "home" ? null : buildBreadcrumbSchema(buildGlassBreadcrumbItems(page, siteUrl));
  const faqItems = extractFaqItems(page.content);

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: page.ogImageUrl || seo?.defaultOgImageUrl || null,
    robots: page.noindex ? "noindex,nofollow" : null,
    preloads: [buildHeroImagePreload(page.content)].filter(Boolean) as string[],
    bodyHtml,
    jsonLd: [
      buildGlassLocalBusinessLd(siteUrl),
      buildGlassServiceLdForCmsPage(page, siteUrl),
      breadcrumbs,
      buildFaqPageSchema(faqItems),
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildPostSnapshot(
  post: BlogPost,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot {
  const canonicalUrl = `${siteUrl}/insights/${post.slug}`;
  const title = post.seoTitle || post.title;
  const description =
    post.seoDescription ||
    post.excerpt ||
    truncate(stripHtml(post.content), 180) ||
    DEFAULT_DESCRIPTION;
  const bodyHtml = [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(post.title)}</h1>`,
    post.excerpt ? `<p>${escapeHtml(post.excerpt)}</p>` : "",
    sanitizeRichHtml(post.content),
    `</article>`,
    `</main>`,
  ].join("");

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: post.ogImageUrl || post.coverImageUrl || seo?.defaultOgImageUrl || null,
    robots: post.noindex ? "noindex,nofollow" : null,
    bodyHtml,
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Insights", url: `${siteUrl}/insights` },
        { name: post.title, url: canonicalUrl },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.seoTitle || post.title,
        description,
        url: canonicalUrl,
        image: absoluteUrl(post.ogImageUrl || post.coverImageUrl, siteUrl) || undefined,
        datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        author: post.authorName
          ? {
              "@type": "Person",
              name: post.authorName,
            }
          : undefined,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildEventSnapshot(
  event: Event,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot {
  const canonicalUrl = `${siteUrl}${getEventPath(event)}`;
  const title = event.title;
  const description = truncate(stripHtml(event.description || ""), 180) || DEFAULT_DESCRIPTION;
  const detailLines = [
    event.description ? sanitizeRichHtml(event.description) : "",
    event.speakerName ? `<p><strong>Speaker:</strong> ${escapeHtml(event.speakerName)}</p>` : "",
    event.locationName || event.location
      ? `<p><strong>Location:</strong> ${escapeHtml(event.locationName || event.location || "")}</p>`
      : "",
    event.date
      ? `<p><strong>Date:</strong> ${escapeHtml(new Date(event.date).toUTCString())}</p>`
      : "",
  ].filter(Boolean);

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl,
    ogImageUrl: event.imageUrl || seo?.defaultOgImageUrl || null,
    bodyHtml: [
      `<main class="seo-prerender-content">`,
      `<article>`,
      `<h1>${escapeHtml(event.title)}</h1>`,
      ...detailLines,
      `</article>`,
      `</main>`,
    ].join(""),
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      buildBreadcrumbSchema([
        { name: "Home", url: siteUrl },
        { name: "Events", url: `${siteUrl}/events` },
        { name: event.title, url: canonicalUrl },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description || undefined,
        url: canonicalUrl,
        image: absoluteUrl(event.imageUrl, siteUrl) || undefined,
        startDate: event.date ? new Date(event.date).toISOString() : undefined,
        endDate: event.endDate ? new Date(event.endDate).toISOString() : undefined,
        location:
          event.locationName || event.location || event.locationAddress
            ? {
                "@type": "Place",
                name: event.locationName || event.location || undefined,
                address: event.locationAddress || event.location || undefined,
              }
            : undefined,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

async function buildTherapistSnapshot(
  id: string,
  seo: SeoSettings | null,
  siteUrl: string,
): Promise<PublicHtmlSnapshot | null> {
  const profile = await storage.therapists.getProfileWithUser(id);
  if (!profile || !profile.isApproved || !profile.isActive) return null;

  const displayName =
    [profile.user?.firstName, profile.user?.lastName].filter(Boolean).join(" ") ||
    "Mental Health Professional";
  const canonicalUrl = `${siteUrl}/directory/${profile.id}`;
  const description =
    truncate(
      stripHtml(
        profile.bio ||
          profile.title ||
          "View this Core Platform-informed mental health professional profile.",
      ),
      180,
    ) || "View this Core Platform-informed mental health professional profile.";

  return {
    title: buildHeadTitle(displayName, seo),
    description,
    canonicalUrl,
    ogImageUrl: profile.user?.profileImageUrl || seo?.defaultOgImageUrl || null,
    bodyHtml: [
      `<main class="seo-prerender-content">`,
      `<article>`,
      `<h1>${escapeHtml(displayName)}</h1>`,
      profile.title ? `<p>${escapeHtml(profile.title)}</p>` : "",
      profile.bio ? sanitizeRichHtml(profile.bio) : "",
      profile.city || profile.country
        ? `<p>${escapeHtml([profile.city, profile.country].filter(Boolean).join(", "))}</p>`
        : "",
      `</article>`,
      `</main>`,
    ].join(""),
    jsonLd: [
      buildOrganizationSchema(seo, siteUrl),
      buildWebsiteSchema(seo, siteUrl),
      {
        "@context": "https://schema.org",
        "@type": "Person",
        name: displayName,
        description,
        url: canonicalUrl,
      },
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildSearchSnapshot(
  query: string,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot {
  const term = query.trim();
  const title = term ? `Search Results for "${term}"` : "Site Search";
  const description = term
    ? `Search results for ${term} across pages, articles, and events on Core Platform.`
    : "Search pages, articles, and events on Core Platform.";

  return {
    title: buildHeadTitle(title, seo),
    description,
    canonicalUrl: term
      ? `${siteUrl}/search?query=${encodeURIComponent(term)}`
      : `${siteUrl}/search`,
    robots: "noindex,follow",
    bodyHtml: buildSimplePageBody(title, description, [
      "Search the site for pages, articles, and events.",
      term ? `Current search query: ${term}` : "",
    ]),
    jsonLd: [buildOrganizationSchema(seo, siteUrl), buildWebsiteSchema(seo, siteUrl)].filter(
      Boolean,
    ) as Array<Record<string, unknown>>,
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
    ogImageUrl: seo?.defaultOgImageUrl || null,
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
    pathname.startsWith("/therapist") ||
    pathname.startsWith("/setup") ||
    pathname.startsWith("/preview") ||
    pathname.startsWith("/uploads")
  ) {
    return null;
  }

  const seo = (await storage.seoSettings.get()) ?? null;
  const siteUrl = (seo?.siteUrl || "").replace(/\/$/, "") || "https://glassanddoorpro.com";

  if (pathname === "/search") {
    const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    return buildSearchSnapshot(params.get("query") || "", seo, siteUrl);
  }

  const blogMatch = pathname.match(/^\/insights\/([^/]+)$/);
  if (blogMatch) {
    const post = await storage.blog.getPostBySlug(decodeURIComponent(blogMatch[1]));
    if (!post || !post.isPublished) return null;
    return buildPostSnapshot(post, seo, siteUrl);
  }

  const eventMatch = pathname.match(/^\/events\/([^/]+)$/);
  if (eventMatch) {
    const event = await storage.events.getEventByIdentifier(decodeURIComponent(eventMatch[1]));
    if (!event || event.status !== "published" || event.visibility !== "public") return null;
    return buildEventSnapshot(event, seo, siteUrl);
  }

  const therapistMatch = pathname.match(/^\/directory\/([^/]+)$/);
  if (therapistMatch) {
    return buildTherapistSnapshot(decodeURIComponent(therapistMatch[1]), seo, siteUrl);
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
    .replace(/\s*<meta name="twitter:title"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="twitter:description"[^>]*>\s*/i, "\n")
    .replace(/\s*<meta name="robots"[^>]*>\s*/i, "\n")
    .replace(/\s*<link rel="canonical"[^>]*>\s*/i, "\n");

  if (!snapshot) {
    return normalizedTemplate
      .replace("<!--APP_DYNAMIC_HEAD-->", customHeadHtml || "")
      .replace("<!--APP_PRERENDER_CONTENT-->", "");
  }

  const headParts = [
    `<meta name="description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(snapshot.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(snapshot.canonicalUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(snapshot.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(snapshot.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(snapshot.canonicalUrl)}" />`,
    snapshot.robots ? `<meta name="robots" content="${escapeHtml(snapshot.robots)}" />` : "",
    snapshot.ogImageUrl
      ? `<meta property="og:image" content="${escapeHtml(snapshot.ogImageUrl)}" />`
      : "",
    ...(snapshot.preloads ?? []),
    customHeadHtml || "",
    ...(snapshot.jsonLd ?? []).map(
      (schema) =>
        `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`,
    ),
  ].filter(Boolean);

  return normalizedTemplate
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(snapshot.title)}</title>`)
    .replace("<!--APP_DYNAMIC_HEAD-->", headParts.join("\n"))
    .replace(
      "<!--APP_PRERENDER_CONTENT-->",
      snapshot.bodyHtml ? `<div id="seo-prerender">${snapshot.bodyHtml}</div>` : "",
    );
}
