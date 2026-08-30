import { randomUUID } from "crypto";
import { storage } from "../storage";
import type { InsertCmsMenu, MenuItem, StandardMenuLocation } from "@shared/schema";
import { GLASS_PRIMARY_SERVICE_AREAS } from "@shared/glass-service-areas";

export const SYSTEM_MANAGED_MENU_NAME_PREFIX = "System - ";

function id() {
  return randomUUID();
}

function item(
  label: string,
  url: string,
  children: MenuItem[] = [],
  openInNewTab = false,
): MenuItem {
  return {
    id: id(),
    label,
    url,
    openInNewTab,
    children,
  };
}

function patchRetiredPublicUrls(items: MenuItem[]): { items: MenuItem[]; changed: boolean } {
  let changed = false;
  const removedUrlPrefixes = ["/directory", "/events", "/insights", "/join", "/recordings"];

  const nextItems = items.flatMap((entry) => {
    const nextChildren = entry.children?.length
      ? patchRetiredPublicUrls(entry.children)
      : { items: entry.children ?? [], changed: false };

    if (nextChildren.changed) {
      changed = true;
    }

    let nextUrl = entry.url;
    if (entry.url === "/about") {
      nextUrl = "/#about";
      changed = true;
    } else if (entry.url === "/contact") {
      nextUrl = "/#contact";
      changed = true;
    }

    const shouldRemove = removedUrlPrefixes.some(
      (prefix) => entry.url === prefix || entry.url.startsWith(`${prefix}/`),
    );
    if (shouldRemove) {
      changed = true;
      return [];
    }

    return [{ ...entry, url: nextUrl, children: nextChildren.items }];
  });

  return { items: nextItems, changed };
}

const legacyServiceAreaUrls = new Set<string>([
  ...GLASS_PRIMARY_SERVICE_AREAS.map(({ href }) => href),
  "/service-areas/monroe",
  "/service-areas/waxhaw",
]);

// This is a targeted migration of the former complete eleven-location list.
// Do not overwrite smaller/custom menus or future CMS ordering choices.
export function migrateServiceAreaMenuOrder(items: MenuItem[]): MenuItem[] {
  let changed = false;
  const next = items.map((entry) => {
    const children = entry.children?.length
      ? migrateServiceAreaMenuOrder(entry.children)
      : entry.children;
    if (children === entry.children) return entry;
    changed = true;
    return { ...entry, children };
  });
  const areaItems = next.filter((entry) => legacyServiceAreaUrls.has(entry.url));
  const byUrl = new Map(areaItems.map((entry) => [entry.url, entry]));
  if (
    areaItems.length === legacyServiceAreaUrls.size &&
    byUrl.size === legacyServiceAreaUrls.size
  ) {
    const ordered = GLASS_PRIMARY_SERVICE_AREAS.map(({ href }) => byUrl.get(href)!);
    let inserted = false;
    return next.flatMap((entry) => {
      if (!legacyServiceAreaUrls.has(entry.url)) return [entry];
      if (inserted) return [];
      inserted = true;
      return ordered;
    });
  }
  return changed ? next : items;
}

function patchLegalItemUrls(items: MenuItem[]): { items: MenuItem[]; changed: boolean } {
  let changed = false;

  const nextItems = items.map((entry) => {
    const nextChildren = entry.children?.length
      ? patchLegalItemUrls(entry.children)
      : { items: entry.children ?? [], changed: false };

    const normalizedLabel = entry.label.trim().toLowerCase();
    let nextUrl = entry.url;

    if (
      normalizedLabel === "privacy policy" &&
      (entry.url === "/contact" ||
        entry.url === "/#contact" ||
        entry.url === "" ||
        entry.url === "#")
    ) {
      nextUrl = "/privacy-policy";
      changed = true;
    }

    if (
      normalizedLabel === "terms of service" &&
      (entry.url === "/contact" ||
        entry.url === "/#contact" ||
        entry.url === "" ||
        entry.url === "#")
    ) {
      nextUrl = "/terms-of-service";
      changed = true;
    }

    if (
      normalizedLabel === "disclaimer" &&
      (entry.url === "/contact" ||
        entry.url === "/#contact" ||
        entry.url === "" ||
        entry.url === "#")
    ) {
      nextUrl = "/disclaimer";
      changed = true;
    }

    if (nextChildren.changed) {
      changed = true;
    }

    return {
      ...entry,
      url: nextUrl,
      children: nextChildren.items,
    };
  });

  const hasDisclaimer = nextItems.some(
    (entry) => entry.label.trim().toLowerCase() === "disclaimer",
  );
  if (!hasDisclaimer) {
    nextItems.push(item("Disclaimer", "/disclaimer"));
    changed = true;
  }

  return { items: nextItems, changed };
}

const defaultMenus: Array<InsertCmsMenu & { location: StandardMenuLocation }> = [
  {
    name: "Main Navigation",
    location: "main_navigation",
    items: [item("About", "/#about"), item("Contact", "/#contact")],
  },
  {
    name: "Services",
    location: "footer_platform",
    items: [
      item("Services", "/services"),
      item("Frameless Showers", "/services/frameless-showers"),
      item("Window Installation", "/services/window-installation"),
    ],
  },
  {
    name: "Commercial Services",
    location: "footer_professionals",
    items: [
      item("Storefront Glass Installation", "/services/commercial-storefront-glass-installation"),
      item("Storefront Glass Repair", "/services/commercial-storefront-glass-replacement-repair"),
      item("Commercial Door Repair", "/services/commercial-door-replacement-repair"),
    ],
  },
  {
    name: "Resources",
    location: "footer_resources",
    items: [],
  },
  {
    name: "Company",
    location: "footer_company",
    items: [
      item("About Us", "/#about"),
      item("Contact", "/#contact"),
      item("Support", "/#contact"),
    ],
  },
  {
    name: "Legal",
    location: "footer_legal",
    items: [
      item("Privacy Policy", "/privacy-policy"),
      item("Terms of Service", "/terms-of-service"),
      item("Disclaimer", "/disclaimer"),
    ],
  },
];

export function isSystemManagedCmsMenu(menu: { name?: string | null }) {
  return Boolean(menu.name?.startsWith(SYSTEM_MANAGED_MENU_NAME_PREFIX));
}

export async function ensureSystemCmsMenus() {
  const menus = await storage.cmsMenus.getAll();
  const assignedLocations = new Set(menus.map((menu) => menu.location));

  const hasAnyHeaderMenu =
    assignedLocations.has("main_navigation") || assignedLocations.has("header");
  const hasAnyThemeMenu = menus.some((menu) => menu.location !== "unassigned");
  if (!hasAnyHeaderMenu && !hasAnyThemeMenu) {
    const mainNavigation = defaultMenus.find((menu) => menu.location === "main_navigation");
    if (mainNavigation) {
      await storage.cmsMenus.create(mainNavigation);
    }
  }

  const hasAnyFooterMenus =
    assignedLocations.has("footer") ||
    defaultMenus
      .filter((entry) => entry.location !== "main_navigation")
      .some((entry) => assignedLocations.has(entry.location));
  if (!hasAnyFooterMenus) {
    for (const menu of defaultMenus.filter((entry) => entry.location !== "main_navigation")) {
      await storage.cmsMenus.create(menu);
    }
  }

  for (const menu of menus) {
    if (!menu.items) continue;
    const existingItems = menu.items as MenuItem[];
    const patched = isSystemManagedCmsMenu(menu)
      ? patchRetiredPublicUrls(existingItems)
      : { items: existingItems, changed: false };
    const reorderedItems = migrateServiceAreaMenuOrder(patched.items);
    if (patched.changed || reorderedItems !== patched.items) {
      await storage.cmsMenus.update(menu.id, {
        items: reorderedItems,
      });
    }
  }

  const legalMenu = await storage.cmsMenus.getByLocation("footer_legal");
  if (legalMenu?.items && isSystemManagedCmsMenu(legalMenu)) {
    const patched = patchLegalItemUrls((legalMenu.items as MenuItem[]) || []);
    if (patched.changed) {
      await storage.cmsMenus.update(legalMenu.id, {
        items: patched.items,
      });
    }
  }
}
