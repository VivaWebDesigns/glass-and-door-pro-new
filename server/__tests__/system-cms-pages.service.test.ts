import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetPageBySlug = vi.fn();
const mockCreatePage = vi.fn();
const mockUpdatePage = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
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
});
