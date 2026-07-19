import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetPageBySlug = vi.fn();
const mockCreatePage = vi.fn();
const mockUpdatePage = vi.fn();
const mockDeletePage = vi.fn();
const mockGetAllMenus = vi.fn();
const mockCreateMenu = vi.fn();
const mockUpdateMenu = vi.fn();
const mockGetSetting = vi.fn();
const mockUpsertSetting = vi.fn();
const mockGetSeoSettings = vi.fn();
const mockUpsertSeoSettings = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
      getPageBySlug: mockGetPageBySlug,
      createPage: mockCreatePage,
      updatePage: mockUpdatePage,
      deletePage: mockDeletePage,
    },
    cmsMenus: {
      getAll: mockGetAllMenus,
      create: mockCreateMenu,
      update: mockUpdateMenu,
    },
    settings: {
      getSetting: mockGetSetting,
      upsertSetting: mockUpsertSetting,
    },
    seoSettings: {
      get: mockGetSeoSettings,
      upsert: mockUpsertSeoSettings,
    },
  },
}));

const FORCE_ENV_KEYS = [
  "GLASS_CMS_SEED_FORCE_PAGES",
  "GLASS_CMS_SEED_FORCE_MENUS",
  "GLASS_CMS_SEED_FORCE_BRANDING",
  "GLASS_CMS_SEED_FORCE_SEO",
  "GLASS_CMS_SEED_OVERWRITE_EXISTING",
  "GLASS_CMS_SEED_ONLY_SLUGS",
];

describe("seedGlassPublicCms", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    for (const key of FORCE_ENV_KEYS) {
      delete process.env[key];
    }
    vi.spyOn(console, "log").mockImplementation(() => undefined);

    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      content: { blocks: [{ id: "admin-edited" }] },
    }));
    mockGetAllMenus.mockResolvedValue([
      { id: "main-menu-id", location: "main_navigation", name: "Admin Main", items: [] },
      { id: "footer-platform-id", location: "footer_platform", name: "Admin Platform", items: [] },
      {
        id: "footer-professionals-id",
        location: "footer_professionals",
        name: "Admin Pros",
        items: [],
      },
      {
        id: "footer-resources-id",
        location: "footer_resources",
        name: "Admin Resources",
        items: [],
      },
      { id: "footer-company-id", location: "footer_company", name: "Admin Company", items: [] },
      { id: "footer-legal-id", location: "footer_legal", name: "Admin Legal", items: [] },
      { id: "header-id", location: "header", name: "Admin Header", items: [] },
    ]);
    mockGetSetting.mockResolvedValue("admin-edited-setting");
    mockGetSeoSettings.mockResolvedValue({ id: "global", siteName: "Admin SEO" });
    mockCreatePage.mockImplementation(async (page) => ({ id: `${page.slug}-new-id`, ...page }));
  });

  it("does not update existing pages, menus, SEO settings, or branding settings in safe mode", async () => {
    const mod = await import("../../scripts/seed-glass-public-cms");
    await mod.seedGlassPublicCms();

    expect(mockUpdatePage).not.toHaveBeenCalled();
    expect(mockDeletePage).not.toHaveBeenCalled();
    expect(mockUpdateMenu).not.toHaveBeenCalled();
    expect(mockCreateMenu).not.toHaveBeenCalled();
    expect(mockUpsertSetting).not.toHaveBeenCalled();
    expect(mockUpsertSeoSettings).not.toHaveBeenCalled();
  });

  it("force mode updates only the selected forced areas", async () => {
    process.env.GLASS_CMS_SEED_FORCE_PAGES = "true";
    process.env.GLASS_CMS_SEED_FORCE_MENUS = "true";

    const mod = await import("../../scripts/seed-glass-public-cms");
    await mod.seedGlassPublicCms();

    expect(mockUpdatePage).toHaveBeenCalled();
    expect(mockDeletePage).toHaveBeenCalledWith("services-commercial-glass-id");
    expect(mockUpdateMenu).toHaveBeenCalled();
    expect(mockUpsertSetting).not.toHaveBeenCalled();
    expect(mockUpsertSeoSettings).not.toHaveBeenCalled();

    const homeUpdate = mockUpdatePage.mock.calls.find(([id]) => id === "home-id")?.[1];
    const servicesBlock = homeUpdate?.content.blocks.find(
      (block: { type: string; props?: { anchorId?: string } }) =>
        block.type === "cards-grid" && block.props?.anchorId === "services",
    );

    expect(servicesBlock?.props.cards.map((card: { link: string }) => card.link)).toEqual([
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
    expect(JSON.stringify(mockUpdatePage.mock.calls)).not.toMatch(/7am(?:\s*[-–]\s*)6pm/i);
    expect(JSON.stringify(mockUpdatePage.mock.calls)).not.toContain("7 AM to 6 PM");
  });
});
