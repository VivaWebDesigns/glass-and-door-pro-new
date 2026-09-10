import { beforeEach, describe, expect, it, vi } from "vitest";
import { GLASS_PRIMARY_SERVICE_AREAS } from "@shared/glass-service-areas";

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

  it("migrates complete location lists in header and footer menus, preserving IDs and unrelated links", async () => {
    const areaItems = [...GLASS_PRIMARY_SERVICE_AREAS]
      .reverse()
      .map(({ label, href }) => ({
        id: href,
        label,
        url: href,
        children: [],
        openInNewTab: false,
      }));
    const about = {
      id: "about",
      label: "About",
      url: "/#about",
      children: [],
      openInNewTab: false,
    };
    const parent = {
      id: "areas",
      label: "Service Areas",
      url: "/service-areas",
      children: areaItems,
      openInNewTab: false,
    };
    mockGetAll.mockResolvedValue([
      { id: "header", name: "Header", location: "header", items: [about, parent] },
      {
        id: "resources",
        name: "Resources",
        location: "footer_resources",
        items: [...areaItems, about],
      },
    ]);
    mockGetByLocation.mockResolvedValue(undefined);
    const { ensureSystemCmsMenus, migrateServiceAreaMenuOrder } =
      await import("../services/system-cms-menus.service");
    await ensureSystemCmsMenus();

    const ordered = GLASS_PRIMARY_SERVICE_AREAS.map(({ href }) =>
      areaItems.find((entry) => entry.url === href),
    );
    expect(mockUpdate).toHaveBeenCalledWith("header", {
      items: [about, { ...parent, children: ordered }],
    });
    expect(mockUpdate).toHaveBeenCalledWith("resources", { items: [...ordered, about] });
    const headerItems = mockUpdate.mock.calls.find(([id]) => id === "header")![1].items;
    expect(migrateServiceAreaMenuOrder(headerItems)).toBe(headerItems);
    const customItems = [about, areaItems[0]];
    expect(migrateServiceAreaMenuOrder(customItems)).toBe(customItems);
  });

  it("adds Monroe and Waxhaw to the former complete nine-location menu", async () => {
    const previousAreaItems = GLASS_PRIMARY_SERVICE_AREAS.filter(
      ({ href }) => href !== "/service-areas/monroe" && href !== "/service-areas/waxhaw",
    ).map(({ label, href }) => ({
      id: href,
      label,
      url: href,
      children: [],
      openInNewTab: false,
    }));
    const about = {
      id: "about",
      label: "About",
      url: "/#about",
      children: [],
      openInNewTab: false,
    };
    const { migrateServiceAreaMenuOrder } =
      await import("../services/system-cms-menus.service");

    const migrated = migrateServiceAreaMenuOrder([...previousAreaItems, about]);

    expect(migrated.map((entry) => entry.url)).toEqual([
      ...GLASS_PRIMARY_SERVICE_AREAS.map(({ href }) => href),
      "/#about",
    ]);
    expect(migrated.find((entry) => entry.url === "/service-areas/waxhaw")?.label).toBe(
      "Waxhaw",
    );
    expect(migrated.find((entry) => entry.url === "/service-areas/monroe")?.label).toBe(
      "Monroe",
    );
    expect(migrateServiceAreaMenuOrder(migrated)).toBe(migrated);
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
