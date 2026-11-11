import { HOME_SOCIAL_IMAGE } from "@shared/glass-hero-images";
import { getRemoteFontStylesheet } from "@shared/branding-fonts";
import { resolveCmsAssetUrl } from "@shared/cms-asset-url";
import { getGlassLocationSearchCopy } from "@shared/glass-location-search";
import {
  GLASS_HOME_HERO_HEADING,
  GLASS_HOME_HERO_INTRO,
  getCmsHeroHeadingParts,
} from "@shared/glass-hero-heading";
import { GLASS_GALLERY_FALLBACK_BLOCKS } from "@shared/glass-gallery-fallback";
import {
  GLASS_HOMEPAGE_SERVICE_CARDS,
  GLASS_HOMEPAGE_SERVICES_LAYOUT,
} from "@shared/glass-homepage-services";
import {
  GLASS_ALL_SERVICES_CARD,
  getServiceImage,
  hasGlassAllServicesCard,
} from "@shared/glass-service-photo-cards";
import { getLocationSectionOrder, prepareSectionAnchorBlocks } from "@shared/glass-section-layout";
import {
  DESKTOP_HERO_MEDIA,
  getMobileHeroImageUrl,
  MOBILE_HERO_MEDIA,
} from "@shared/glass-hero-images";
import {
  correctGlassSearchTitle,
  excludeServiceUtilitySnippets,
} from "@shared/glass-search-snippets";
import {
  buildGlassBreadcrumbItems,
  buildGlassLocalBusinessLd,
  buildGlassServiceLdForCmsPage,
  getCmsPublicPath,
  getCmsSlugForPublicPath,
  getGlassServiceSeoOverride,
  getGlassServiceSocialMetadata,
  isGlassLegalNoindexSlug,
  isGlassServicePageSlug,
} from "@shared/glass-seo";
import {
  GLASS_PRIMARY_SERVICE_AREAS,
  GLASS_PRIMARY_SERVICE_AREA_NAMES,
  GLASS_SERVICE_AREAS_HERO_IMAGE,
  GLASS_SERVICE_AREA_HUB,
  GLASS_SERVICE_AREA_HUB_CARDS,
  summarizeServiceArea,
} from "@shared/glass-service-areas";
import type { CmsPage, SeoSettings } from "@shared/schema";
import { normalizeSeoDescription } from "@shared/seo-description";
import { formatBrandFirstTitle, formatBrandLastTitle } from "@shared/seo-title";
import sanitizeHtml from "sanitize-html";
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
  heroImageUrl?: string;
}

type PrerenderLink = {
  href: string;
  label: string;
  description?: string;
};

const DEFAULT_DESCRIPTION =
  "Glass & Door Pro serves the Charlotte area with frameless showers, residential windows, door installation, window repair, and commercial glass.";

const FALLBACK_STATIC_PAGES: Record<
  string,
  { title: string; heading?: string; description: string; body: string; noindex?: boolean }
> = {
  "/": {
    title: "Charlotte Glass, Door & Window Services",
    heading: "Glass, Door & Window Services Across Greater Charlotte",
    description:
      "Explore frameless showers, window installation, door installation, window repair, and commercial glass from Glass & Door Pro.",
    body: "Glass & Door Pro serves greater Charlotte with frameless showers, windows, doors, window repair, and commercial glass.",
  },
  "/gallery": {
    title: "Gallery",
    description:
      "Browse recent frameless shower, glass, window, and door installation projects from Glass & Door Pro in the Charlotte area.",
    body: `Browse recent Glass & Door Pro project photos, including frameless shower installations across ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby communities.`,
  },
  "/reviews": {
    title: "Customer Reviews",
    heading: "What Charlotte Customers Say About Glass & Door Pro",
    description:
      "Read customer reviews for Glass & Door Pro glass, shower, window, door, and commercial glass work in the Charlotte area.",
    body: `Read Glass & Door Pro customer reviews from homeowners and businesses across ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby communities.`,
  },
  "/services": {
    title: "Glass and Door Services",
    heading: "Glass and Door Services in Charlotte, NC",
    description: `Explore frameless showers, window installation, door installation, window repair, and commercial glass services from Glass & Door Pro in ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby areas.`,
    body: `Glass & Door Pro provides frameless shower doors, residential window installation, door installation, window repair, and commercial glass services across ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby communities.`,
  },
  "/service-areas": {
    title: "Service Areas",
    heading: "Glass and Door Services Across Greater Charlotte",
    description:
      "Explore Glass & Door Pro service areas across Charlotte, Union County, and nearby South Carolina for showers, windows, doors, repairs, and commercial glass.",
    body: "Explore Glass & Door Pro service areas across the greater Charlotte metro, Union County, and nearby South Carolina communities.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
    body: "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
    noindex: true,
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description:
      "Review the terms governing use of the Glass & Door Pro website, estimates, service information, third-party links, and site content.",
    body: "Review the terms governing use of the Glass & Door Pro website, estimates, service information, third-party links, and site content.",
    noindex: true,
  },
  "/disclaimer": {
    title: "Disclaimer",
    description:
      "Review important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
    body: "Review important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
  },
};

const PRIMARY_SERVICE_LINKS: PrerenderLink[] = [
  {
    href: "/services/frameless-showers",
    label: "Frameless Showers",
    description: "Custom frameless shower doors and glass enclosures.",
  },
  {
    href: "/services/window-installation",
    label: "Window Installation",
    description: "Residential window installation and replacement.",
  },
  {
    href: "/services/door-installation",
    label: "Door Installation",
    description: "Entry, patio, storm, and exterior door installation.",
  },
  {
    href: "/services/window-repair",
    label: "Window Repair",
    description: "Glass replacement, foggy panes, seal failure, and hardware repair.",
  },
];

const COMMERCIAL_SERVICE_LINKS: PrerenderLink[] = [
  {
    href: "/services/commercial-storefront-glass-installation",
    label: "Commercial Storefront Glass Installation",
    description: "Storefront framing, fixed glass panels, and commercial entrances.",
  },
  {
    href: "/services/commercial-storefront-glass-replacement-repair",
    label: "Commercial Storefront Glass Replacement & Repair",
    description: "Broken storefront glass replacement, repair, and board-up support.",
  },
  {
    href: "/services/commercial-door-installation",
    label: "Commercial Door Installation",
    description: "Commercial entry doors and complete entrance systems.",
  },
  {
    href: "/services/commercial-door-replacement-repair",
    label: "Commercial Door Replacement & Repair",
    description: "Commercial door glass, hardware, closer, lock, and alignment repair.",
  },
  {
    href: "/services/commercial-window-replacement",
    label: "Commercial Window Replacement",
    description: "Apartment, multi-family, and commercial window replacement.",
  },
];

const SERVICE_AREA_LINKS: PrerenderLink[] = [...GLASS_PRIMARY_SERVICE_AREAS];

const LEGAL_LINKS: PrerenderLink[] = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
];

const RETIRED_PUBLIC_PATH_PREFIXES = [
  "/directory",
  "/events",
  "/insights",
  "/join",
  "/recordings",
  "/therapist",
];
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
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
      "hr",
      "strong",
      "b",
      "em",
      "i",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "div",
      "table",
      "caption",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "dl",
      "dt",
      "dd",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel", "sms"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
      }),
    },
  });
}

function isSafePrerenderHref(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const href = value.trim();
  if (!href) return false;
  if (
    href.includes("\\") ||
    Array.from(href).some((character) => character < " " || character === "\u007f")
  ) {
    return false;
  }
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  if (href.startsWith("#")) return true;
  return /^(https?:|mailto:|tel:|sms:)/i.test(href);
}

function normalizePrerenderLink(link: PrerenderLink): PrerenderLink | null {
  if (!isSafePrerenderHref(link.href) || !link.label.trim()) return null;
  return {
    href: link.href.trim(),
    label: stripHtml(link.label),
    description: link.description ? stripHtml(link.description) : undefined,
  };
}

function uniquePrerenderLinks(links: PrerenderLink[]) {
  const seen = new Set<string>();
  return links
    .map(normalizePrerenderLink)
    .filter((link): link is PrerenderLink => Boolean(link))
    .filter((link) => {
      const key = `${link.href}|${link.label.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function buildLinkListHtml(title: string, links: PrerenderLink[], id?: string) {
  const normalizedLinks = uniquePrerenderLinks(links);
  if (normalizedLinks.length === 0) return "";
  const headingId = id || `seo-prerender-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return [
    `<section class="seo-prerender-link-list" aria-labelledby="${escapeHtml(headingId)}">`,
    `<h2 id="${escapeHtml(headingId)}">${escapeHtml(title)}</h2>`,
    `<ul>`,
    ...normalizedLinks.map((link) =>
      [
        `<li>`,
        // Keep email links usable in raw HTML; Cloudflare's obfuscated URL is a 404 for crawlers.
        /^mailto:/i.test(link.href) ? "<!--email_off-->" : "",
        `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`,
        /^mailto:/i.test(link.href) ? "<!--/email_off-->" : "",
        link.description ? `<p>${escapeHtml(truncate(link.description, 180))}</p>` : "",
        `</li>`,
      ].join(""),
    ),
    `</ul>`,
    `</section>`,
  ].join("");
}

function buildSeoFooterHtml() {
  return [
    `<nav class="seo-prerender-footer" aria-label="Priority site links">`,
    buildLinkListHtml("Services", PRIMARY_SERVICE_LINKS, "seo-prerender-footer-services"),
    buildLinkListHtml(
      "Commercial Services",
      COMMERCIAL_SERVICE_LINKS,
      "seo-prerender-footer-commercial-services",
    ),
    buildLinkListHtml("Service Areas", SERVICE_AREA_LINKS, "seo-prerender-footer-service-areas"),
    buildLinkListHtml("Legal", LEGAL_LINKS, "seo-prerender-footer-legal"),
    `</nav>`,
  ].join("");
}

type CmsBlock = { id?: string; type?: string; props?: Record<string, unknown> };

function cmsBlocks(content: unknown): CmsBlock[] {
  if (!content || typeof content !== "object") return [];
  const blocks = (content as { blocks?: unknown }).blocks;
  return Array.isArray(blocks)
    ? (blocks as unknown[]).filter((block): block is CmsBlock =>
        Boolean(block && typeof block === "object"),
      )
    : [];
}

function textProp(props: Record<string, unknown> | undefined, key: string) {
  const value = props?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function arrayProp<T = Record<string, unknown>>(
  props: Record<string, unknown> | undefined,
  key: string,
): T[] {
  const value = props?.[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

function headingHtml(level: 1 | 2 | 3, value: string) {
  const text = stripHtml(value);
  return text ? `<h${level}>${escapeHtml(text)}</h${level}>` : "";
}

function paragraphHtml(value: string) {
  const text = stripHtml(value);
  return text ? `<p>${escapeHtml(text)}</p>` : "";
}

function emailSafeLink(anchor: string, href: string) {
  // Keep email links usable in raw HTML; Cloudflare's obfuscated URL is a 404 for crawlers.
  return /^mailto:/i.test(href) ? `<!--email_off-->${anchor}<!--/email_off-->` : anchor;
}

function linkHtml(href: unknown, label: string) {
  const text = stripHtml(label);
  if (!text) return "";
  if (!isSafePrerenderHref(href)) return escapeHtml(text);
  const trimmed = href.trim();
  return emailSafeLink(`<a href="${escapeHtml(trimmed)}">${escapeHtml(text)}</a>`, trimmed);
}

function linkedHeadingHtml(href: unknown, label: string) {
  const link = linkHtml(href, label);
  return link ? `<h3>${link}</h3>` : "";
}

function photoHtml(src: unknown, alt: unknown, caption?: unknown) {
  if (typeof src !== "string") return "";
  const url = src.trim();
  if (!isSafePrerenderHref(url) || !/^(?:\/(?!\/)|https?:\/\/)/i.test(url)) return "";
  const image = `<img src="${escapeHtml(url)}" alt="${escapeHtml(typeof alt === "string" ? alt : "")}" loading="lazy" decoding="async">`;
  return typeof caption === "string" && caption.trim()
    ? `<figure>${image}<figcaption>${escapeHtml(caption)}</figcaption></figure>`
    : image;
}

function heroPhotoHtml(src: string, alt: unknown, variant?: string) {
  const desktop = resolveCmsAssetUrl(src);
  const image = photoHtml(desktop, alt);
  if (!image) return "";
  const mobile = getMobileHeroImageUrl(desktop, variant);
  return mobile
    ? `<picture><source media="${MOBILE_HERO_MEDIA}" srcset="${escapeHtml(mobile)}">${image}</picture>`
    : image;
}

function quoteFormHref(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug) ? `/forms/${encodeURIComponent(slug)}` : "";
}

function actionHtml(label: string, action: string, href: string, formSlug: string) {
  const destination = action === "form-modal" && formSlug ? quoteFormHref(formSlug) : href;
  return label && destination !== "#" && isSafePrerenderHref(destination)
    ? linkHtml(destination, label)
    : "";
}

function actionGroupHtml(...actions: string[]) {
  const links = actions.filter(Boolean);
  return links.length ? `<p>${links.join(" ")}</p>` : "";
}

function blockActionHtml(
  props: Record<string, unknown>,
  prefix: string,
  labelKey = `${prefix}Text`,
) {
  return actionHtml(
    textProp(props, labelKey),
    textProp(props, `${prefix}Action`),
    textProp(props, `${prefix}Link`),
    textProp(props, `${prefix}FormSlug`),
  );
}

function richHtml(value: string) {
  const sanitized = sanitizeRichHtml(value)
    .replace(/<a href="(mailto:[^"]*)"[^>]*>[\s\S]*?<\/a>/gi, (anchor, href: string) =>
      emailSafeLink(anchor, href),
    )
    .trim();
  if (!sanitized) return "";
  return /<(?:p|ul|ol|h[2-6]|blockquote|div|table|dl|hr)\b/i.test(sanitized)
    ? sanitized
    : `<p>${sanitized}</p>`;
}

function sectionHeadingHtml(
  props: Record<string, unknown>,
  heading = textProp(props, "title") || textProp(props, "heading"),
  level: 1 | 2 = 2,
) {
  return [
    paragraphHtml(textProp(props, "sectionEyebrow") || textProp(props, "eyebrow")),
    headingHtml(level, heading),
    richHtml(textProp(props, "subtitle") || textProp(props, "subheading")),
  ].join("");
}

type PrerenderImage = { url?: string; alt?: string; caption?: string };
type PrerenderCard = {
  title?: string;
  description?: string;
  link?: string;
  buttonText?: string;
  imageUrl?: string;
};

function serviceCardHtml(title: string, description: string, href?: string, label?: string) {
  const image = getServiceImage(href);
  return [
    image ? photoHtml(image.src, image.alt) : "",
    linkedHeadingHtml(href, title),
    paragraphHtml(description),
    href && label ? actionGroupHtml(actionHtml(label, "", href, "")) : "",
  ].join("");
}

function renderCmsBlockForSeo(
  block: CmsBlock,
  h1: { used: boolean },
  excludeUtilitySnippets: boolean,
) {
  const props = block.props ?? {};
  if (props.isActive === false) return "";
  const title = textProp(props, "title");
  const heading = textProp(props, "heading") || title;
  const utilityActions = (...actions: string[]) => {
    const group = actionGroupHtml(...actions);
    return group && excludeUtilitySnippets ? `<div data-nosnippet>${group}</div>` : group;
  };

  switch (block.type) {
    case "hero": {
      const isHomeHero = props.variant === "glass-home";
      const subheading = richHtml(
        isHomeHero ? GLASS_HOME_HERO_INTRO : textProp(props, "subheading"),
      );
      const image = heroPhotoHtml(
        textProp(props, "backgroundImageUrl"),
        props.backgroundImageAlt || props.imageAlt,
        textProp(props, "variant"),
      );
      const actions = utilityActions(
        blockActionHtml(props, "cta"),
        blockActionHtml(props, "ctaSecondary", "ctaSecondaryText"),
      );
      if (h1.used) return [headingHtml(2, heading), subheading, image, actions].join("");
      h1.used = true;
      const parts = getCmsHeroHeadingParts(props);
      const headingText = isHomeHero
        ? [
            GLASS_HOME_HERO_HEADING.location,
            GLASS_HOME_HERO_HEADING.firstLine,
            GLASS_HOME_HERO_HEADING.secondLine,
          ].join(" ")
        : [parts.location, parts.heading, parts.accent].filter(Boolean).join(" ");
      return [
        image,
        paragraphHtml(textProp(props, "badge")),
        `<h1>${escapeHtml(headingText)}</h1>`,
        subheading,
        actions,
      ].join("");
    }

    case "section-header": {
      const isPrimaryHeading = (props.sectionHeadingLevel ?? props.headingLevel) === "h1";
      if (isPrimaryHeading && !h1.used && (title || heading)) {
        h1.used = true;
        return sectionHeadingHtml(props, title || heading, 1);
      }
      return sectionHeadingHtml(props);
    }

    case "rich-text":
    case "callout-box":
      return [sectionHeadingHtml(props), richHtml(textProp(props, "content"))].join("");

    case "text-image":
      return [
        sectionHeadingHtml(
          props,
          props.variant === "featured-project" ? heading : title || heading,
        ),
        photoHtml(props.imageUrl, props.imageAlt, props.imageCaption),
        richHtml(textProp(props, "body")),
        props.variant === "featured-project"
          ? actionGroupHtml(
              actionHtml(textProp(props, "ctaText"), "form-modal", "", "contact-form"),
            )
          : "",
      ].join("");

    case "image":
    case "image-block":
      return [
        sectionHeadingHtml(props),
        photoHtml(props.imageUrl, props.alt || props.imageAlt, props.caption),
      ].join("");

    case "image-grid":
      return [
        sectionHeadingHtml(props),
        ...arrayProp<PrerenderImage>(props, "images").map(({ url, alt, caption }) =>
          photoHtml(url, alt, caption),
        ),
      ].join("");

    case "link-list": {
      const links = arrayProp<{ label?: string; description?: string; url?: string }>(
        props,
        "links",
      );
      const usesPhotos = links.length > 0 && links.every((link) => getServiceImage(link.url));
      const allServices = GLASS_ALL_SERVICES_CARD;
      return [
        sectionHeadingHtml(props),
        ...links.map((link) =>
          usesPhotos
            ? serviceCardHtml(link.label || "", link.description || "", link.url, "Learn More")
            : [
                linkedHeadingHtml(link.url, link.label || "Untitled link"),
                paragraphHtml(link.description || ""),
              ].join(""),
        ),
        hasGlassAllServicesCard(props.title, links)
          ? serviceCardHtml(
              allServices.title,
              allServices.description,
              allServices.href,
              allServices.buttonText,
            )
          : "",
      ].join("");
    }

    case "cards-grid": {
      const variant = textProp(props, "variant");
      const isHomeServices = variant === "home-service-gallery";
      const cards =
        isHomeServices && !Array.isArray(props.cards)
          ? GLASS_HOMEPAGE_SERVICE_CARDS
          : arrayProp<PrerenderCard>(props, "cards");
      const listTag =
        variant === "window-installation-steps"
          ? "ol"
          : ["window-type-catalog", "window-trust-band", "open-benefits-grid"].includes(variant)
            ? "ul"
            : null;
      const cardHtml = cards
        .map((card) => {
          const cardTitle = card.title || "";
          const cardImage = "imageUrl" in card ? card.imageUrl : undefined;
          const content = [
            variant === "window-type-catalog" && cardImage
              ? photoHtml(cardImage, `Illustration of ${cardTitle.toLowerCase()}`)
              : "",
            serviceCardHtml(
              cardTitle,
              card.description || "",
              card.link,
              card.link ? card.buttonText || "Learn More" : undefined,
            ),
          ].join("");
          return listTag && content ? `<li>${content}</li>` : content;
        })
        .join("");
      return [
        sectionHeadingHtml(isHomeServices ? GLASS_HOMEPAGE_SERVICES_LAYOUT : props),
        variant === "window-installation-steps" ? photoHtml(props.imageUrl, props.imageAlt) : "",
        variant === "window-trust-band"
          ? [props.experienceValue, props.experienceTitle, props.experienceDescription]
              .map((value) => paragraphHtml(typeof value === "string" ? value : ""))
              .join("")
          : "",
        listTag && cardHtml ? `<${listTag}>${cardHtml}</${listTag}>` : cardHtml,
      ].join("");
    }

    case "feature-list":
    case "icon-grid":
    case "benefit-stack":
      return [
        sectionHeadingHtml(props),
        ...[
          ...arrayProp<{ title?: string; description?: string }>(props, "items"),
          ...arrayProp<{ title?: string; description?: string }>(props, "features"),
        ].map((item) =>
          [headingHtml(3, item.title || ""), paragraphHtml(item.description || "")].join(""),
        ),
      ].join("");

    case "objection-busters":
      return [
        sectionHeadingHtml(props),
        ...arrayProp<{ concern?: string; response?: string }>(props, "items").map((item) =>
          [headingHtml(3, item.concern || ""), paragraphHtml(item.response || "")].join(""),
        ),
      ].join("");

    case "two-column-text":
      return [
        sectionHeadingHtml(props),
        ...(["left", "right"] as const).map((side) =>
          [
            headingHtml(3, textProp(props, `${side}Heading`)),
            richHtml(textProp(props, `${side}Body`)),
            ...arrayProp<{ text?: string }>(props, `${side}Items`).map((item) =>
              paragraphHtml(item.text || ""),
            ),
          ].join(""),
        ),
      ].join("");

    case "stats-bar":
      return arrayProp<{ value?: string; label?: string }>(props, "items")
        .map(
          (item) =>
            `<p><strong>${escapeHtml(item.value || "")}</strong> ${escapeHtml(item.label || "")}</p>`,
        )
        .join("");

    case "testimonials":
      return [
        sectionHeadingHtml(props),
        ...arrayProp<{ quote?: string; name?: string; role?: string; location?: string }>(
          props,
          "items",
        )
          .filter((item) => item.quote)
          .map((item) =>
            [
              "<blockquote>",
              paragraphHtml(`"${item.quote}"`),
              item.name ? `<cite>${escapeHtml(item.name)}</cite>` : "",
              paragraphHtml(`${item.role || ""}${item.location ? ` · ${item.location}` : ""}`),
              "</blockquote>",
            ].join(""),
          ),
        actionGroupHtml(blockActionHtml(props, "cta")),
      ].join("");

    case "faq":
      return [
        sectionHeadingHtml(props, title || "Frequently Asked Questions"),
        ...arrayProp<{ question?: string; answer?: string }>(props, "items").map((item) =>
          [headingHtml(3, item.question || ""), richHtml(item.answer || "")].join(""),
        ),
      ].join("");

    case "contact-info": {
      const items = arrayProp<{ label?: string; value?: string; url?: string }>(props, "items")
        .map((item) => {
          const value = isSafePrerenderHref(item.url)
            ? linkHtml(item.url, item.value || "")
            : escapeHtml(item.value || "");
          return `<p><strong>${escapeHtml(item.label || "")}</strong>: ${value}</p>`;
        })
        .join("");
      return [sectionHeadingHtml(props), items ? `<address>${items}</address>` : ""].join("");
    }

    case "cta":
      return [
        headingHtml(2, heading),
        richHtml(textProp(props, "subheading")),
        utilityActions(blockActionHtml(props, "primary"), blockActionHtml(props, "secondary")),
      ].join("");

    case "contact-form":
      return [
        paragraphHtml(textProp(props, "eyebrow")),
        headingHtml(2, heading),
        richHtml(textProp(props, "subheading")),
        ...arrayProp<{ icon?: string; label?: string; value?: string; href?: string }>(
          props,
          "contactItems",
        ).map(({ icon, label, value, href }) =>
          [
            `<p><strong>${escapeHtml(label || "")}</strong></p><p>${linkHtml(href, value || "")}</p>`,
            props.variant === "split-contact" &&
            icon === "MapPin" &&
            summarizeServiceArea(value || "")
              ? '<p><a href="/service-areas">See all areas</a></p>'
              : "",
          ].join(""),
        ),
        actionGroupHtml(
          actionHtml(
            textProp(props, "formTitle") || "Send a Message",
            "form-modal",
            "",
            textProp(props, "formSlug") || "contact-form",
          ),
        ),
      ].join("");

    case "divider":
    case "video-embed":
    case "raw-html":
      return sectionHeadingHtml(props);

    default: {
      // GDP-specific blocks without a dedicated case still contribute their public copy.
      const headingText = stripHtml(heading).toLowerCase();
      const fragments = uniqueFragments(collectTextFragments(props)).filter(
        (fragment) => fragment.toLowerCase() !== headingText,
      );
      return [headingHtml(2, heading), ...fragments.map(paragraphHtml)].join("");
    }
  }
}

function buildCmsBodyHtml(
  page: Pick<CmsPage, "slug" | "content">,
  h1Text: string,
  description: string,
) {
  const h1 = { used: false };
  const excludeUtilitySnippets = excludeServiceUtilitySnippets(getCmsPublicPath(page.slug));
  const blocks = cmsBlocks(page.content);
  const renderBlock = (block: CmsBlock) => {
    const html = renderCmsBlockForSeo(block, h1, excludeUtilitySnippets);
    const anchorId = sanitizeAnchorId(block.props?.anchorId);
    return html && anchorId ? `<section id="${escapeHtml(anchorId)}">${html}</section>` : html;
  };

  const [hero, ...sections] = blocks;
  let rendered: string;
  if (hero?.type === "hero" && isServiceAreaPageSlug(page.slug)) {
    const anchored = prepareSectionAnchorBlocks(
      sections.map((block) => ({ ...block, props: block.props ?? {} })),
    );
    const closingCta = anchored.at(-1)?.type === "cta" ? anchored.pop() : undefined;
    const { introBlock, serviceBlock, orderedBlocks } = getLocationSectionOrder(anchored);
    const ordered =
      serviceBlock || !introBlock
        ? orderedBlocks
        : [introBlock, ...anchored.filter((block) => block !== introBlock)];
    const guideLinks = ordered.flatMap((block) => {
      const id = sanitizeAnchorId(block.props.anchorId);
      const label = textProp(block.props, "title");
      return id && label && block.props.isActive !== false ? [{ href: `#${id}`, label }] : [];
    });
    const guide = guideLinks.length
      ? `<aside aria-label="Location page guide">${buildLinkListHtml("On this page", guideLinks, "location-page-guide")}</aside>`
      : "";
    rendered = [
      renderBlock(hero),
      ...ordered.flatMap((block, index) =>
        index === 0 ? [renderBlock(block), guide] : [renderBlock(block)],
      ),
      closingCta ? renderBlock(closingCta) : "",
    ].join("");
  } else if (hero?.type === "hero" && isGlassServicePageSlug(page.slug)) {
    const heroHtml = renderBlock(hero);
    const anchored = prepareSectionAnchorBlocks(
      sections.map((block) => ({ ...block, props: block.props ?? {} })),
    );
    const closingCta = anchored.at(-1)?.type === "cta" ? anchored.pop() : undefined;
    const content = anchored.map((block) => ({
      html: renderBlock(block),
      id: sanitizeAnchorId(block.props.anchorId),
      title: textProp(block.props, "title"),
    }));
    const guideItems = content
      .filter(({ html, id, title }) => html && id && title)
      .map(({ id, title }) => `<li>${linkHtml(`#${id}`, title)}</li>`)
      .join("");
    const guide = guideItems
      ? `<details><summary>On this page</summary><nav aria-label="Page sections"><ul>${guideItems}</ul></nav></details>`
      : "";
    rendered = [
      heroHtml,
      guide,
      ...content.map(({ html }) => html),
      closingCta ? renderBlock(closingCta) : "",
    ].join("");
  } else {
    rendered = blocks.map(renderBlock).join("");
  }

  if (!rendered) {
    return buildSimplePageBody(
      h1Text,
      description,
      uniqueFragments(
        collectTextFragments(
          blocks.length ? blocks.filter((block) => block.props?.isActive !== false) : page.content,
        ),
      ),
      [buildSeoFooterHtml()],
    );
  }

  return [
    `<main class="seo-prerender-content">`,
    `<article>`,
    h1.used ? "" : headingHtml(1, h1Text),
    rendered,
    buildSeoFooterHtml(),
    `</article>`,
    `</main>`,
  ].join("");
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

function buildHeadTitle(
  rawTitle: string,
  seo?: SeoSettings | null,
  options?: { brandLast?: boolean },
) {
  const titleSuffix = seo?.titleSuffix ?? " | Glass & Door Pro";
  const siteName = seo?.siteName ?? "Glass & Door Pro";
  return options?.brandLast
    ? formatBrandLastTitle(rawTitle, titleSuffix, siteName)
    : formatBrandFirstTitle(rawTitle, titleSuffix, siteName);
}

export async function getPublicHeadAdditions(): Promise<string | null> {
  const headHtml = await storage.settings.getSetting("public_head_html");
  const normalized = normalizeHeadMarkup(headHtml);
  return normalized ? normalized : null;
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
    alternateName: ["Glass and Door Pro", "glassanddoorpro.com"],
    url: `${siteUrl.replace(/\/$/, "")}/`,
  };
}

function buildServiceAreasHubItemListSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Service Areas",
    itemListElement: SERVICE_AREA_LINKS.map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      url: absoluteUrl(link.href, siteUrl),
    })),
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

function buildSimplePageBody(
  title: string,
  description: string,
  fragments: string[] = [],
  extraHtml: string[] = [],
) {
  const paragraphs = uniqueFragments([description, ...fragments]).filter(
    (fragment) => fragment && fragment.toLowerCase() !== title.trim().toLowerCase(),
  );

  return [
    `<main class="seo-prerender-content">`,
    `<article>`,
    `<h1>${escapeHtml(title)}</h1>`,
    ...paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`),
    ...extraHtml,
    `</article>`,
    `</main>`,
  ].join("");
}

function getFallbackLinkSections(pathname: string) {
  if (pathname === "/services") {
    return [
      { title: "Residential Services", links: PRIMARY_SERVICE_LINKS },
      { title: "Commercial Services", links: COMMERCIAL_SERVICE_LINKS },
      { title: "Service Areas", links: SERVICE_AREA_LINKS },
    ];
  }
  return [];
}

function buildServiceAreaHubBody() {
  const hub = GLASS_SERVICE_AREA_HUB;
  const actions = actionGroupHtml(
    linkHtml("tel:+17047716111", "Call (704) 771-6111"),
    linkHtml("/#contact", "Get a Free Quote"),
  );
  return [
    '<main class="seo-prerender-content"><article>',
    heroPhotoHtml(GLASS_SERVICE_AREAS_HERO_IMAGE, hub.heroAlt),
    headingHtml(1, hub.heading),
    paragraphHtml(hub.intro),
    actions,
    headingHtml(2, hub.areasTitle),
    paragraphHtml(hub.areasIntro),
    ...GLASS_SERVICE_AREA_HUB_CARDS.map(([name, href, description]) =>
      serviceCardHtml(name, description, href, hub.areaLinkText),
    ),
    headingHtml(2, hub.detailsTitle),
    paragraphHtml(hub.detailsIntro),
    paragraphHtml(hub.detailsClosing),
    headingHtml(2, hub.quoteTitle),
    paragraphHtml(hub.quoteIntro),
    `<p><strong>${escapeHtml(hub.quoteHours)}</strong></p>`,
    actions,
    buildSeoFooterHtml(),
    "</article></main>",
  ].join("");
}

function buildCmsSnapshot(
  page: CmsPage,
  seo: SeoSettings | null,
  siteUrl: string,
): PublicHtmlSnapshot {
  const visiblePage = filterServiceAreaWorkGalleryFromPage(page);
  const normalizedVisiblePage = {
    ...visiblePage,
    seoDescription: normalizeSeoDescription(visiblePage.seoDescription),
  };
  const seoOverride = getGlassServiceSeoOverride(visiblePage.slug);
  const socialOverride = getGlassServiceSocialMetadata(visiblePage.slug);
  const title =
    correctGlassSearchTitle(
      visiblePage.slug,
      seoOverride?.title || normalizedVisiblePage.seoTitle || normalizedVisiblePage.title,
    ) || "Page";
  const description =
    seoOverride?.description ||
    normalizedVisiblePage.seoDescription ||
    truncate(uniqueFragments(collectTextFragments(normalizedVisiblePage.content)).join(" "), 180) ||
    DEFAULT_DESCRIPTION;
  const publicPath = getCmsPublicPath(normalizedVisiblePage.slug);
  const canonicalUrl = new URL(normalizedVisiblePage.canonicalUrl || `${siteUrl}${publicPath}`)
    .href;
  const faqItems = extractFaqItems(normalizedVisiblePage.content);
  const bodyHtml = buildCmsBodyHtml(
    normalizedVisiblePage,
    normalizedVisiblePage.title,
    description,
  );

  const breadcrumbs =
    normalizedVisiblePage.slug === "home"
      ? null
      : buildBreadcrumbSchema(buildGlassBreadcrumbItems(normalizedVisiblePage, siteUrl));

  return {
    title: getGlassLocationSearchCopy(normalizedVisiblePage.slug)
      ? title
      : buildHeadTitle(title, seo, {
          brandLast: isGlassServicePageSlug(normalizedVisiblePage.slug),
        }),
    description,
    canonicalUrl,
    ogTitle: socialOverride?.ogTitle || null,
    ogDescription: socialOverride?.ogDescription || null,
    ogImageUrl:
      absoluteUrl(
        normalizedVisiblePage.slug === "home"
          ? HOME_SOCIAL_IMAGE
          : normalizedVisiblePage.ogImageUrl || seo?.defaultOgImageUrl,
        siteUrl,
      ) || null,
    twitterSite: socialOverride?.twitterSite || null,
    robots: normalizedVisiblePage.noindex
      ? isGlassLegalNoindexSlug(normalizedVisiblePage.slug)
        ? "noindex,follow"
        : "noindex,nofollow"
      : null,
    bodyHtml,
    cmsPage: normalizedVisiblePage,
    jsonLd: [
      normalizedVisiblePage.slug === "home" ? buildWebsiteSchema(seo, siteUrl) : null,
      buildGlassLocalBusinessLd(siteUrl),
      buildGlassServiceLdForCmsPage(normalizedVisiblePage, siteUrl),
      breadcrumbs,
      buildFaqPageSchema(faqItems),
    ].filter(Boolean) as Array<Record<string, unknown>>,
  };
}

function buildFallbackSnapshot(
  pathname: string,
  seo: SeoSettings | null,
  siteUrl: string,
  galleryPage?: CmsPage,
): PublicHtmlSnapshot | null {
  const fallback = FALLBACK_STATIC_PAGES[pathname];
  if (!fallback) return null;
  let bodyHtml: string;
  if (pathname === "/gallery") {
    const blocks = (
      galleryPage ? cmsBlocks(galleryPage.content) : GLASS_GALLERY_FALLBACK_BLOCKS
    ).map((block, index) =>
      index === 0 && block.type === "section-header"
        ? { ...block, props: { ...block.props, sectionHeadingLevel: "h1" } }
        : block,
    );
    bodyHtml = buildCmsBodyHtml(
      { slug: "gallery", content: { blocks } },
      fallback.title,
      fallback.body,
    );
  } else if (pathname === "/service-areas") {
    bodyHtml = buildServiceAreaHubBody();
  } else {
    bodyHtml = buildSimplePageBody(
      fallback.heading ?? fallback.title,
      fallback.body,
      [],
      [
        ...getFallbackLinkSections(pathname).map((section) =>
          buildLinkListHtml(section.title, section.links),
        ),
        buildSeoFooterHtml(),
      ].filter(Boolean),
    );
  }
  const fallbackJsonLd = [
    buildGlassLocalBusinessLd(siteUrl),
    buildWebsiteSchema(seo, siteUrl),
    pathname !== "/" && pathname !== "/service-areas"
      ? buildBreadcrumbSchema([
          { name: "Home", url: absoluteUrl("/", siteUrl) },
          { name: fallback.title, url: absoluteUrl(pathname, siteUrl) },
        ])
      : null,
    ...(pathname === "/service-areas"
      ? [
          buildBreadcrumbSchema([
            { name: "Home", url: absoluteUrl("/", siteUrl) },
            { name: "Service Areas", url: absoluteUrl("/service-areas", siteUrl) },
          ]),
          buildServiceAreasHubItemListSchema(siteUrl),
        ]
      : []),
  ].filter(Boolean) as Array<Record<string, unknown>>;

  return {
    title: buildHeadTitle(fallback.title, seo),
    description: fallback.description,
    canonicalUrl: `${siteUrl}${pathname}`,
    ogImageUrl: absoluteUrl(seo?.defaultOgImageUrl, siteUrl) || null,
    robots: fallback.noindex ? "noindex,follow" : null,
    bodyHtml,
    jsonLd: fallbackJsonLd,
    heroImageUrl: pathname === "/service-areas" ? GLASS_SERVICE_AREAS_HERO_IMAGE : undefined,
  };
}

export async function getPublicHtmlSnapshot(
  pathname: string,
  _search = "",
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
  const siteUrl = (seo?.siteUrl || "").replace(/\/$/, "") || "https://glassanddoorpro.com";

  if (
    REDIRECT_ONLY_PUBLIC_PATHS.has(pathname) ||
    RETIRED_PUBLIC_PATH_PREFIXES.some(
      (retiredPath) => pathname === retiredPath || pathname.startsWith(`${retiredPath}/`),
    )
  ) {
    return null;
  }

  const slug = getCmsSlugForPublicPath(pathname);
  if (slug) {
    if (slug === "gallery") {
      const gallery = await storage.cmsPages.getPageBySlug(slug);
      return buildFallbackSnapshot(
        pathname,
        seo,
        siteUrl,
        gallery?.status === "published" ? gallery : undefined,
      );
    }

    const page = await storage.cmsPages.getPageBySlug(slug);
    if (page?.status === "published") {
      return buildCmsSnapshot(page, seo, siteUrl);
    }
  }

  return buildFallbackSnapshot(pathname, seo, siteUrl);
}

// Match the first visible hero only. Static site assets have no legacy URL remapping;
// uploaded/external assets are left to the renderer rather than risking a wasted preload.
function getStaticHeroPreload(page: CmsPage | undefined, fallbackImage?: string) {
  let image: unknown = fallbackImage;
  let variant: string | undefined;
  if (page) {
    const content = page.content;
    if (!content || typeof content !== "object" || Array.isArray(content)) return "";
    const blocks = (content as Record<string, unknown>).blocks;
    if (!Array.isArray(blocks) || blocks[0]?.type !== "hero") return "";
    image = blocks[0]?.props?.backgroundImageUrl;
    variant = blocks[0]?.props?.variant;
  }
  if (
    typeof image !== "string" ||
    !/^\/images\/glass-door-pro\/[a-zA-Z0-9/_-]+\.(webp|png|jpe?g|avif)$/.test(image)
  )
    return "";
  const mobileImage = getMobileHeroImageUrl(image, variant);
  if (mobileImage) {
    return [
      `<link rel="preload" as="image" href="${escapeHtml(mobileImage)}" media="${MOBILE_HERO_MEDIA}" fetchpriority="high" />`,
      `<link rel="preload" as="image" href="${escapeHtml(image)}" media="${DESKTOP_HERO_MEDIA}" fetchpriority="high" />`,
    ].join("\n");
  }
  return `<link rel="preload" as="image" href="${escapeHtml(image)}" fetchpriority="high" />`;
}

/** Branding and menus the client seeds its query cache with, so the first render has them. */
export type PublicBootstrapData = { branding: unknown; menus: unknown };

function buildBootstrapScript(bootstrap?: PublicBootstrapData | null) {
  return bootstrap
    ? `<script id="__PUBLIC_BOOTSTRAP__" type="application/json">${serializeJsonForHtml(bootstrap)}</script>`
    : "";
}

export function injectPublicHtmlSnapshot(
  template: string,
  snapshot: PublicHtmlSnapshot | null,
  customHeadHtml?: string | null,
  bootstrap?: PublicBootstrapData | null,
) {
  const bootstrapScript = buildBootstrapScript(bootstrap);
  const branding = bootstrap?.branding as { bodyFont?: string; headingFont?: string } | undefined;
  const fontStylesheet = getRemoteFontStylesheet([branding?.bodyFont, branding?.headingFont]);
  const fontHead = fontStylesheet
    ? `<link rel="stylesheet" data-selected-branding-fonts="true" href="${escapeHtml(fontStylesheet)}" />`
    : "";
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
      .replace("<!--APP_DYNAMIC_HEAD-->", () =>
        [fontHead, customHeadHtml].filter(Boolean).join("\n"),
      )
      .replace("<!--APP_PRERENDER_CONTENT-->", () => bootstrapScript);
  }

  const headParts = [
    fontHead,
    getStaticHeroPreload(snapshot.cmsPage, snapshot.heroImageUrl),
    `<meta name="description" content="${escapeHtml(snapshot.description)}" />`,
    `<meta property="og:title" content="${escapeHtml(snapshot.ogTitle || snapshot.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(snapshot.ogDescription || snapshot.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(snapshot.canonicalUrl)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    snapshot.twitterSite
      ? `<meta name="twitter:site" content="${escapeHtml(snapshot.twitterSite)}" />`
      : "",
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
      (schema) => `<script type="application/ld+json">${serializeJsonForHtml(schema)}</script>`,
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
        `${bootstrapScript}${prerenderPayload}${snapshot.bodyHtml ? `<div id="seo-prerender">${snapshot.bodyHtml}</div>` : ""}`,
    );
}
