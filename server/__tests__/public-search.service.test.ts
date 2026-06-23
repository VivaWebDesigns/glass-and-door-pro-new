import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsPage } from "@shared/schema";

const mockGetAllPages = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
      getAllPages: mockGetAllPages,
    },
  },
}));

const samplePage: CmsPage = {
  id: "page-1",
  title: "Frameless Shower Doors",
  slug: "services-frameless-showers",
  status: "published",
  pageType: "custom",
  template: "full-width",
  sidebarId: null,
  content: [{ title: "Frameless Shower Doors", body: "Custom glass shower doors for Charlotte area homes." }],
  seoTitle: null,
  seoDescription: "Custom frameless shower doors installed in the Charlotte area.",
  seoKeywords: null,
  ogImageUrl: null,
  canonicalUrl: null,
  noindex: false,
  createdBy: null,
  updatedBy: null,
  scheduledAt: null,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const draftPage: CmsPage = {
  ...samplePage,
  id: "page-2",
  title: "Draft Only",
  slug: "draft-only",
  status: "draft",
};

const joinCmsPage: CmsPage = {
  ...samplePage,
  id: "page-join",
  title: "Join",
  slug: "join",
  seoDescription: null,
  content: [{ title: "Join", body: "Retired legacy page content." }],
};

describe("public-search.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPages.mockResolvedValue([samplePage, draftPage]);
  });

  it("returns public CMS page results for matching content", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("frameless shower");

    expect(results.map((result) => result.type)).toEqual(expect.arrayContaining(["page"]));
    expect(results.map((result) => result.url)).toContain("/services-frameless-showers");
    expect(results.some((result) => result.url.startsWith("/insights"))).toBe(false);
    expect(results.some((result) => result.url.startsWith("/events"))).toBe(false);
  });

  it("does not return non-public or draft content", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("draft");

    expect(results).toHaveLength(0);
  });

  it("prefers title matches over body-only matches", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("frameless shower");

    expect(results[0]?.title).toBe("Frameless Shower Doors");
  });

  it("includes current fallback public pages when no published CMS page exists for that route", async () => {
    mockGetAllPages.mockResolvedValue([]);

    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("privacy policy");

    expect(results.some((result) => result.url === "/privacy-policy")).toBe(true);
    expect(results.some((result) => result.url === "/directory")).toBe(false);
    expect(results.some((result) => result.url === "/join")).toBe(false);
  });

  it("excludes retired public pages even when a CMS version exists", async () => {
    mockGetAllPages.mockResolvedValue([joinCmsPage]);

    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("retired legacy");

    expect(results.some((result) => result.url === "/join")).toBe(false);
  });
});
