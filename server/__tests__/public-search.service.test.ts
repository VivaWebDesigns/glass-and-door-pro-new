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
  title: "Application Process",
  slug: "application-process",
  status: "published",
  pageType: "custom",
  template: "full-width",
  sidebarId: null,
  content: [{ title: "The Application Process", body: "Learn how to apply with step-by-step guidance." }],
  seoTitle: null,
  seoDescription: "A guide to the Core Platform application process.",
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
  title: "Join the Network",
  slug: "join",
  seoDescription: null,
  content: [{ title: "Membership", body: "Grow your practice with Core Platform." }],
};

describe("public-search.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPages.mockResolvedValue([samplePage, draftPage]);
  });

  it("returns public CMS page results for matching content", async () => {
    const { searchPublicSite } = await import("../services/public-search.service");
    const results = await searchPublicSite("application process");

    expect(results.map((result) => result.type)).toEqual(expect.arrayContaining(["page"]));
    expect(results.map((result) => result.url)).toContain("/application-process");
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
    const results = await searchPublicSite("application process");

    expect(results[0]?.title).toBe("Application Process");
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
    const results = await searchPublicSite("join network");

    expect(results.some((result) => result.url === "/join")).toBe(false);
  });
});
