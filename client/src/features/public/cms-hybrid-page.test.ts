import { afterEach, describe, expect, it, vi } from "vitest";
import type { CmsPage } from "@shared/schema";
import { bootstrapCmsPrerenderPage, getPrerenderedCmsPage } from "@/lib/cms-prerender";

const page: CmsPage = {
  id: "page-1",
  title: "Window Installation",
  slug: "services-window-installation",
  status: "published",
  pageType: "service",
  template: "full-width",
  sidebarId: null,
  content: { blocks: [] },
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  ogImageUrl: null,
  canonicalUrl: "https://glassanddoorpro.com/services/window-installation",
  noindex: false,
  createdBy: null,
  updatedBy: null,
  scheduledAt: null,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("getPrerenderedCmsPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the prerendered page only when the slug matches", () => {
    vi.stubGlobal("window", { __CMS_PRERENDER_PAGE__: page });

    expect(getPrerenderedCmsPage("services-window-installation")).toMatchObject({
      slug: "services-window-installation",
    });
    expect(getPrerenderedCmsPage("services-frameless-showers")).toBeUndefined();
  });

  it("bootstraps a valid embedded CMS payload before page rendering", () => {
    const document = {
      getElementById: vi.fn(() => ({
        textContent: JSON.stringify(page),
      })),
    };
    vi.stubGlobal("window", {});
    vi.stubGlobal("document", document);

    bootstrapCmsPrerenderPage();

    expect(getPrerenderedCmsPage("services-window-installation")).toMatchObject({
      slug: "services-window-installation",
    });
  });
});
