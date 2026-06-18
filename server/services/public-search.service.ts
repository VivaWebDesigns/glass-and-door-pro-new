import type { CmsPage } from "@shared/schema";
import type { PublicSearchResult } from "@shared/types/public-search";
import { storage } from "../storage";

interface SearchDocument {
  type: PublicSearchResult["type"];
  id: string;
  title: string;
  url: string;
  metadata?: string | null;
  searchableText: string;
  excerptSource: string;
}

interface FallbackPageDocument extends Omit<SearchDocument, "id"> {
  slug: string;
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 180): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function collectContentText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return stripHtml(value);
  if (Array.isArray(value)) return value.map(collectContentText).filter(Boolean).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(collectContentText).filter(Boolean).join(" ");
  }
  return "";
}

function normalizeQuery(query: string) {
  const trimmed = query.trim().toLowerCase();
  return {
    raw: trimmed,
    terms: trimmed.split(/\s+/).filter(Boolean),
  };
}

function scoreSearchMatch(query: string, terms: string[], title: string, body: string, path = "") {
  if (!query) return 0;
  const lowerTitle = title.toLowerCase();
  const lowerBody = body.toLowerCase();
  const lowerPath = path.toLowerCase();

  let score = 0;

  if (lowerTitle === query) score += 180;
  if (lowerTitle.includes(query)) score += 120;
  if (lowerPath.includes(query)) score += 45;
  if (lowerBody.includes(query)) score += 55;

  const matchedTitleTerms = terms.filter((term) => lowerTitle.includes(term)).length;
  const matchedBodyTerms = terms.filter((term) => lowerBody.includes(term)).length;
  const matchedPathTerms = terms.filter((term) => lowerPath.includes(term)).length;

  if (matchedTitleTerms === terms.length) score += 70;
  else score += matchedTitleTerms * 18;

  if (matchedBodyTerms === terms.length) score += 35;
  else score += matchedBodyTerms * 8;

  score += matchedPathTerms * 8;

  return score;
}

function pageUrlForSlug(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}

function buildExcerpt(source: string, query: string, terms: string[], maxLength = 180) {
  const plainText = stripHtml(source);
  if (!plainText) return "";

  const lower = plainText.toLowerCase();
  const matchIndex = [query, ...terms]
    .filter(Boolean)
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (matchIndex === undefined) {
    return truncate(plainText, maxLength);
  }

  const start = Math.max(0, matchIndex - 60);
  const end = Math.min(plainText.length, matchIndex + maxLength - 20);
  const prefix = start > 0 ? "..." : "";
  const suffix = end < plainText.length ? "..." : "";
  return `${prefix}${plainText.slice(start, end).trim()}${suffix}`;
}

function joinFragments(values: Array<string | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

const FALLBACK_PAGE_DOCUMENTS: FallbackPageDocument[] = [
  {
    slug: "home",
    type: "page",
    title: "Home",
    url: "/",
    metadata: "Page",
    searchableText: [
      "Glass & Door Pro",
      "Charlotte glass company",
      "Frameless shower doors",
      "Window installation",
      "Door installation",
      "Window repair",
      "Commercial glass",
      "Service areas",
    ].join(" "),
    excerptSource:
      "Glass & Door Pro serves the Charlotte area with frameless showers, windows, doors, window repair, and commercial glass.",
  },
  {
    slug: "privacy-policy",
    type: "page",
    title: "Privacy Policy",
    url: "/privacy-policy",
    metadata: "Page",
    searchableText: [
      "Privacy Policy",
      "how Core Platform collects uses stores and protects information",
    ].join(" "),
    excerptSource: "Review how Core Platform collects, uses, stores, and protects information across the website and related services.",
  },
  {
    slug: "terms-of-service",
    type: "page",
    title: "Terms of Service",
    url: "/terms-of-service",
    metadata: "Page",
    searchableText: [
      "Terms of Service",
      "terms governing use of the Core Platform website directory events and services",
    ].join(" "),
    excerptSource: "Review the terms governing use of the Core Platform website, directory, events, and related services.",
  },
  {
    slug: "disclaimer",
    type: "page",
    title: "Disclaimer",
    url: "/disclaimer",
    metadata: "Page",
    searchableText: [
      "Disclaimer",
      "mental health emergency",
      "suicide and crisis lifeline",
      "Core Platform conducts a vetting process",
    ].join(" "),
    excerptSource: "Review emergency guidance, directory vetting limitations, and important information about using the Core Platform directory and related services.",
  },
];

const FALLBACK_PAGE_DOCUMENTS_BY_SLUG = new Map(
  FALLBACK_PAGE_DOCUMENTS.map((document) => [document.slug, document] as const),
);

const RETIRED_PUBLIC_PAGE_SLUGS = new Set([
  "about",
  "contact",
  "directory",
  "events",
  "insights",
  "join",
  "recordings",
]);

function buildPageText(page: CmsPage) {
  const fallbackDocument = FALLBACK_PAGE_DOCUMENTS_BY_SLUG.get(page.slug);
  return [
    page.title,
    page.slug,
    page.seoTitle,
    page.seoDescription,
    page.seoKeywords,
    collectContentText(page.content),
    fallbackDocument?.searchableText,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildFallbackPageDocuments(publishedPageSlugs: Set<string>): SearchDocument[] {
  return FALLBACK_PAGE_DOCUMENTS
    .filter((doc) => !publishedPageSlugs.has(doc.slug) && !RETIRED_PUBLIC_PAGE_SLUGS.has(doc.slug))
    .map((doc) => ({
      id: `fallback:${doc.slug}`,
      type: doc.type,
      title: doc.title,
      url: doc.url,
      metadata: doc.metadata,
      searchableText: doc.searchableText,
      excerptSource: doc.excerptSource,
    }));
}

export async function searchPublicSite(query: string): Promise<PublicSearchResult[]> {
  const normalized = normalizeQuery(query);
  if (!normalized.raw) return [];

  const [pages] = await Promise.all([
    storage.cmsPages.getAllPages(),
  ]);

  const publishedPages = pages.filter(
    (page) => page.status === "published" && !page.noindex && !RETIRED_PUBLIC_PAGE_SLUGS.has(page.slug),
  );
  const publishedPageSlugs = new Set(publishedPages.map((page) => page.slug));

  const documents: SearchDocument[] = [
    ...publishedPages.map((page) => ({
      type: "page" as const,
      id: page.id,
      title: page.title,
      url: pageUrlForSlug(page.slug),
      metadata: "Page",
      searchableText: buildPageText(page),
      excerptSource: joinFragments([
        page.seoDescription,
        collectContentText(page.content),
        FALLBACK_PAGE_DOCUMENTS_BY_SLUG.get(page.slug)?.excerptSource,
      ]),
    })),
    ...buildFallbackPageDocuments(publishedPageSlugs),
  ];

  return documents
    .map((document) => {
      const score = scoreSearchMatch(
        normalized.raw,
        normalized.terms,
        document.title,
        document.searchableText,
        document.url,
      );

      return score > 0
        ? {
            score,
            result: {
              type: document.type,
              id: document.id,
              title: document.title,
              url: document.url,
              excerpt: buildExcerpt(document.excerptSource || document.searchableText, normalized.raw, normalized.terms),
              metadata: document.metadata,
            } satisfies PublicSearchResult,
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => b.score - a.score || a.result.title.localeCompare(b.result.title))
    .map((entry) => entry.result);
}
