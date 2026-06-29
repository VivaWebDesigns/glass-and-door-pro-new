import { afterEach, describe, expect, it, vi } from "vitest";
import type { CmsPage } from "@shared/schema";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";
import { bootstrapCmsPrerenderPage, getPrerenderedCmsPage } from "@/lib/cms-prerender";
import { ensureRelatedCommercialServicesBlock } from "@/features/public/cms-hybrid-page";

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

describe("ensureRelatedCommercialServicesBlock", () => {
  it("adds missing related commercial services before the final CTA", () => {
    const blocks: BlockInstance[] = [
      { id: "intro", type: "rich-text", props: { title: "Intro" } },
      { id: "faq", type: "faq", props: { title: "FAQ" } },
      { id: "cta", type: "cta", props: { heading: "Call us" } },
    ];

    const result = ensureRelatedCommercialServicesBlock(
      "services-commercial-door-installation",
      blocks,
    );

    expect(result.map((block) => block.type)).toEqual(["rich-text", "faq", "link-list", "cta"]);
    expect(result[2].props).toMatchObject({
      title: "Related Commercial Services",
      columns: "2",
    });
    expect(result[2].props.links).not.toContainEqual(
      expect.objectContaining({ url: "/services/commercial-door-installation" }),
    );
  });

  it("does not duplicate an existing related commercial services block", () => {
    const blocks: BlockInstance[] = [
      {
        id: "related",
        type: "link-list",
        props: { title: "Related Commercial Services", links: [] },
      },
      { id: "cta", type: "cta", props: { heading: "Call us" } },
    ];

    const result = ensureRelatedCommercialServicesBlock(
      "services-commercial-door-installation",
      blocks,
    );

    expect(result).toBe(blocks);
  });
});
