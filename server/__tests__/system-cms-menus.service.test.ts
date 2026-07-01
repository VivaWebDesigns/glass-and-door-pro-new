import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetAll = vi.fn();
const mockGetByLocation = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsMenus: {
      getAll: mockGetAll,
      getByLocation: mockGetByLocation,
      create: mockCreate,
      update: mockUpdate,
    },
  },
}));

describe("ensureSystemCmsMenus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not remove or repoint admin-created menu links on startup unless marked system-managed", async () => {
    const adminMenu = {
      id: "main-id",
      name: "Main Navigation",
      location: "main_navigation",
      items: [
        { id: "about", label: "About", url: "/about", openInNewTab: false, children: [] },
        { id: "events", label: "Events", url: "/events", openInNewTab: false, children: [] },
      ],
    };
    const footerMenu = {
      id: "footer-id",
      name: "Footer Legal",
      location: "footer_legal",
      items: [
        {
          id: "privacy",
          label: "Privacy Policy",
          url: "/#contact",
          openInNewTab: false,
          children: [],
        },
      ],
    };

    mockGetAll.mockResolvedValue([adminMenu, footerMenu]);
    mockGetByLocation.mockResolvedValue(footerMenu);

    const mod = await import("../services/system-cms-menus.service");
    await mod.ensureSystemCmsMenus();

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("updates retired links only for explicitly system-managed menus", async () => {
    const systemMenu = {
      id: "system-main-id",
      name: "System - Main Navigation",
      location: "main_navigation",
      items: [
        { id: "about", label: "About", url: "/about", openInNewTab: false, children: [] },
        { id: "events", label: "Events", url: "/events", openInNewTab: false, children: [] },
      ],
    };
    const footerMenu = {
      id: "footer-id",
      name: "Footer Platform",
      location: "footer_platform",
      items: [],
    };

    mockGetAll.mockResolvedValue([systemMenu, footerMenu]);
    mockGetByLocation.mockResolvedValue(undefined);

    const mod = await import("../services/system-cms-menus.service");
    await mod.ensureSystemCmsMenus();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledWith("system-main-id", {
      items: [{ id: "about", label: "About", url: "/#about", openInNewTab: false, children: [] }],
    });
  });
});
