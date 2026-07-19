import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetPageBySlug = vi.fn();
const mockGetAllPages = vi.fn();
const mockCreatePage = vi.fn();
const mockUpdatePage = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
      getAllPages: mockGetAllPages,
      getPageBySlug: mockGetPageBySlug,
      createPage: mockCreatePage,
      updatePage: mockUpdatePage,
    },
  },
}));

vi.mock("../utils/logger", () => ({
  logger: {
    app: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));

describe("ensureSystemCmsPages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPages.mockResolvedValue([]);
  });

  it("does not draft or noindex existing public pages on every startup unless marked system-retired", async () => {
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).not.toHaveBeenCalled();
    expect(mockCreatePage).not.toHaveBeenCalled();
  });

  it("drafts and noindexes retired pages only when they are explicitly marked system-retired", async () => {
    mockGetPageBySlug.mockImplementation(async (slug: string) => {
      if (slug === "about") {
        return {
          id: "about-id",
          slug,
          status: "published",
          noindex: false,
          content: { _system: { systemRetired: true } },
          updatedBy: "admin-id",
        };
      }

      return {
        id: `${slug}-id`,
        slug,
        status: "published",
        noindex: false,
        content: { blocks: [] },
        updatedBy: "admin-id",
      };
    });

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    expect(mockUpdatePage).toHaveBeenCalledWith("about-id", {
      status: "draft",
      noindex: true,
      updatedBy: "admin-id",
    });
  });

  it("normalizes pasted meta description labels on existing CMS pages", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "charlotte-id",
        seoDescription:
          "Meta Description:\nOwner-operated glass and door services in Charlotte, NC.",
        updatedBy: "admin-id",
      },
      {
        id: "clean-id",
        seoDescription: "Already clean.",
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    expect(mockUpdatePage).toHaveBeenCalledWith("charlotte-id", {
      seoDescription: "Owner-operated glass and door services in Charlotte, NC.",
      updatedBy: "admin-id",
    });
  });

  it("updates published CMS hours in nested CTA and FAQ content", async () => {
    const unchangedBlock = { id: "intro", type: "rich-text", props: { content: "Unchanged" } };
    mockGetAllPages.mockResolvedValue([
      {
        id: "service-id",
        slug: "services-commercial-storefront-glass-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            unchangedBlock,
            {
              id: "faq",
              type: "faq",
              props: {
                items: [
                  { question: "When are you open?", answer: "Mon–Sat, 7am–6pm." },
                ],
              },
            },
            {
              id: "cta",
              type: "cta",
              props: { footerLine: "Mon-Sat: 7am - 6pm | Charlotte, NC" },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [, update] = mockUpdatePage.mock.calls[0];
    expect(update.content.blocks[0]).toBe(unchangedBlock);
    expect(update.content.blocks[1].props.items[0].answer).toBe("Mon–Sat, 7am–7pm.");
    expect(update.content.blocks[2].props.footerLine).toBe(
      "Mon-Sat: 7am - 7pm | Charlotte, NC",
    );
  });

  it("adds missing related services blocks to residential service pages", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "window-installation-id",
        slug: "services-window-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            { id: "intro", type: "rich-text", props: { title: "Intro" } },
            { id: "cta", type: "cta", props: { heading: "Ready?" } },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "door-installation-id",
        slug: "services-door-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            { id: "related", type: "link-list", props: { title: "Related Services" } },
            { id: "cta", type: "cta", props: { heading: "Ready?" } },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [pageId, update] = mockUpdatePage.mock.calls[0];
    expect(pageId).toBe("window-installation-id");
    expect(update.updatedBy).toBe("admin-id");
    expect(update.content.blocks.map((block: { type: string }) => block.type)).toEqual([
      "rich-text",
      "link-list",
      "cta",
    ]);
    expect(update.content.blocks[1]).toMatchObject({
      type: "link-list",
      props: {
        title: "Related Services",
        columns: "1",
      },
    });
    expect(update.content.blocks[1].props.links).toEqual([
      expect.objectContaining({ label: "Frameless Showers", url: "/services/frameless-showers" }),
      expect.objectContaining({ label: "Door Installation", url: "/services/door-installation" }),
      expect.objectContaining({ label: "Window Repair", url: "/services/window-repair" }),
    ]);
  });

  it("adds every service page to the homepage service cards without replacing other blocks", async () => {
    const heroBlock = { id: "hero", type: "hero", props: { heading: "Existing hero" } };
    const faqBlock = { id: "faq", type: "faq", props: { items: [{ question: "Existing FAQ" }] } };
    mockGetAllPages.mockResolvedValue([
      {
        id: "home-id",
        slug: "home",
        seoDescription: "Existing homepage description.",
        content: {
          blocks: [
            heroBlock,
            {
              id: "services",
              type: "cards-grid",
              props: {
                anchorId: "services",
                title: "What We Offer",
                cards: [
                  {
                    title: "Frameless Showers",
                    link: "/services/frameless-showers",
                  },
                ],
              },
            },
            faqBlock,
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [pageId, update] = mockUpdatePage.mock.calls[0];
    expect(pageId).toBe("home-id");
    expect(update.updatedBy).toBe("admin-id");
    expect(update.content.blocks[0]).toEqual(heroBlock);
    expect(update.content.blocks[2]).toEqual(faqBlock);
    expect(update.content.blocks[1].props.cards.map((card: { link: string }) => card.link)).toEqual([
      "/services/frameless-showers",
      "/services/window-installation",
      "/services/door-installation",
      "/services/window-repair",
      "/services/commercial-storefront-glass-installation",
      "/services/commercial-storefront-glass-replacement-repair",
      "/services/commercial-door-installation",
      "/services/commercial-door-replacement-repair",
      "/services/commercial-window-replacement",
    ]);
  });
});
