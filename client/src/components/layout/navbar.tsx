import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  ChevronDown,
  Phone,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranding } from "@/components/shared/branding-provider";
import type { CmsMenu, MenuItem, PublicMenuLocation } from "@shared/schema";

const defaultNavLinks = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Frameless Showers", href: "/services/frameless-showers" },
  { label: "Window Installation", href: "/services/window-installation" },
  { label: "Door Installation", href: "/services/door-installation" },
  { label: "Window Repair", href: "/services/window-repair" },
  { label: "Commercial Storefront Glass Installation", href: "/services/commercial-storefront-glass-installation" },
  { label: "Commercial Storefront Glass Replacement & Repair", href: "/services/commercial-storefront-glass-replacement-repair" },
  { label: "Commercial Door Installation", href: "/services/commercial-door-installation" },
  { label: "Commercial Door Replacement & Repair", href: "/services/commercial-door-replacement-repair" },
  { label: "Commercial Window Replacement", href: "/services/commercial-window-replacement" },
  { label: "Reviews", href: "/reviews" },
];

const allResourceLinks: { label: string; href: string }[] = [];

function normalizePublicMenuUrl(item: Pick<MenuItem, "label" | "url">) {
  if (/services/i.test(item.label) && item.url === "/#services") {
    return "/services";
  }
  if (/gallery/i.test(item.label) && item.url === "/#gallery") {
    return "/gallery";
  }
  if (/reviews?/i.test(item.label) && item.url === "/#reviews") {
    return "/reviews";
  }
  return item.url;
}

function normalizePublicMenuItems(items: MenuItem[]): MenuItem[] {
  return items.map((item) => ({
    ...item,
    url: normalizePublicMenuUrl(item),
    children: item.children?.length ? normalizePublicMenuItems(item.children) : item.children,
  }));
}

function flattenItems(items: MenuItem[], depth = 0): { item: MenuItem; depth: number }[] {
  const result: { item: MenuItem; depth: number }[] = [];
  for (const item of items) {
    result.push({ item, depth });
    if (item.children?.length > 0) {
      result.push(...flattenItems(item.children, depth + 1));
    }
  }
  return result;
}

function isActiveRecursive(items: MenuItem[], currentPath: string): boolean {
  for (const item of items) {
    if (item.url === "#") continue;
    if (currentPath === item.url) return true;
    if (item.children?.length > 0 && isActiveRecursive(item.children, currentPath)) return true;
  }
  return false;
}

function getServicesOverviewLink(item: Pick<MenuItem, "label" | "url">) {
  if (!/^services$/i.test(item.label.trim())) return null;
  return {
    label: "Services Overview",
    href: item.url === "/#services" ? "/services" : normalizePublicMenuUrl(item),
  };
}

const mobileNavButtonClassName =
  "h-auto min-h-9 w-full min-w-0 justify-start whitespace-normal text-left leading-snug aria-[current=page]:bg-transparent aria-[current=page]:text-accent";

function DynamicDropdown({ item, location: currentPath }: { item: MenuItem; location: string }) {
  const overviewLink = getServicesOverviewLink(item);
  const isActive =
    currentPath === overviewLink?.href || isActiveRecursive(item.children || [], currentPath);
  const flatChildren = flattenItems(item.children || []);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="public-nav-link"
          data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          aria-current={isActive ? "page" : undefined}
        >
          {item.label}
          <ChevronDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[1000]">
        {overviewLink ? (
          <>
            <DropdownMenuItem asChild>
              <Link href={overviewLink.href} data-testid="link-nav-child-services-overview">
                {overviewLink.label}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        ) : null}
        {flatChildren.map(({ item: child, depth }) => {
          if (child.url === "#") {
            return (
              <div
                key={child.id}
                className="px-2 py-1.5 text-sm font-medium text-muted-foreground"
                data-testid={`text-nav-group-${child.id}`}
                style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
              >
                {child.label}
              </div>
            );
          }

          return (
            <DropdownMenuItem
              key={child.id}
              asChild
              className={depth > 0 ? `pl-${4 + depth * 4}` : ""}
            >
              {child.openInNewTab ? (
                <a
                  href={child.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-nav-child-${child.id}`}
                  style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
                >
                  {child.label}
                </a>
              ) : (
                <Link
                  href={child.url}
                  data-testid={`link-nav-child-${child.id}`}
                  style={depth > 0 ? { paddingLeft: `${12 + depth * 16}px` } : undefined}
                >
                  {child.label}
                </Link>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const [location] = useLocation();
  const { frontendLogoUrl, companyName } = useBranding();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: publicMenus } = useQuery<Partial<Record<PublicMenuLocation, CmsMenu>>>({
    queryKey: ["/api/cms/menus"],
    queryFn: async () => {
      const res = await fetch("/api/cms/menus");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const dynamicItems = useMemo(() => {
    const headerMenu = publicMenus?.main_navigation ?? publicMenus?.header;
    if (!headerMenu?.items) return null;
    const items = normalizePublicMenuItems(headerMenu.items as MenuItem[]);
    return items.length > 0 ? items : null;
  }, [publicMenus]);

  const resourceLinks = allResourceLinks;

  const brandLogo = frontendLogoUrl || "/images/glass-door-pro/brand/logo-header-900x260-white-bg.webp";
  const brandName = companyName || "Glass & Door Pro";

  return (
    <nav
      className="sticky top-0 z-[999] border-b border-border/70 bg-white/95 shadow-sm backdrop-blur-xl"
      data-testid="navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:gap-6 sm:px-6">
        <Link href="/" data-testid="link-brand">
          <img src={brandLogo} alt={brandName} className="h-14 w-auto sm:h-16" />
        </Link>

        <div className="hidden items-center gap-1.5 md:flex md:flex-wrap lg:gap-2">
          {dynamicItems ? (
            dynamicItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <DynamicDropdown key={item.id} item={item} location={location} />
              ) : item.openInNewTab ? (
                <Button
                  key={item.id}
                  asChild
                  variant="ghost"
                  className="public-nav-link"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </Button>
              ) : (
                <Button
                  key={item.id}
                  asChild
                  variant="ghost"
                  className="public-nav-link"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  aria-current={location === item.url ? "page" : undefined}
                >
                  <Link href={item.url}>
                    {item.label}
                  </Link>
                </Button>
              ),
            )
          ) : (
            <>
              {defaultNavLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant="ghost"
                  className="public-nav-link"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                  aria-current={location === link.href ? "page" : undefined}
                >
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </Button>
              ))}
              {resourceLinks.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="public-nav-link"
                      data-testid="link-nav-resources"
                      aria-current={resourceLinks.some((r) => location === r.href) ? "page" : undefined}
                    >
                      Resources
                      <ChevronDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="z-[1000]">
                    {resourceLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          data-testid={`link-nav-resource-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                        >
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button
                asChild
                variant="ghost"
                className="public-nav-link"
                data-testid="link-nav-contact"
                aria-current={location === "/#contact" ? "page" : undefined}
              >
                <Link href="/#contact">
                  Contact
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex md:flex-wrap">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden border-[#1a8ead] text-[#0f6f85] hover:bg-[#e8f7fb] hover:text-[#0f6f85] lg:inline-flex"
            data-testid="link-header-phone"
          >
            <a href="tel:+17047716111">
              <Phone className="h-3.5 w-3.5" />
              <span>(704) 771-6111</span>
            </a>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-[#1a8ead] text-white hover:bg-[#167f9b] hover:text-white"
            data-testid="link-header-quote"
          >
            <Link href="/#contact">Get a Free Quote</Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border border-border/70 bg-background/70"
                data-testid="button-mobile-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 max-w-[calc(100vw-1rem)] overflow-hidden">
              <SheetHeader className="shrink-0">
                <SheetTitle>
                  <img src={brandLogo} alt={brandName} className="h-12 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-8 pr-1">
                {dynamicItems ? (
                  flattenItems(dynamicItems).map(({ item, depth }) => {
                    const overviewLink = getServicesOverviewLink(item);
                    return item.children && item.children.length > 0 ? (
                        <div key={item.id}>
                          <p
                            className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                            style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                            data-testid={`text-mobile-group-${item.id}`}
                          >
                            {item.label}
                          </p>
                          {overviewLink ? (
                            <Button
                              asChild
                              variant="ghost"
                              className={mobileNavButtonClassName}
                              style={
                                depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined
                              }
                              data-testid="link-mobile-services-overview"
                              aria-current={location === overviewLink.href ? "page" : undefined}
                            >
                              <Link href={overviewLink.href} onClick={() => setMobileOpen(false)}>
                                {overviewLink.label}
                              </Link>
                            </Button>
                          ) : null}
                        </div>
                      ) : item.openInNewTab ? (
                      <Button
                        key={item.id}
                        asChild
                        variant="ghost"
                        className={mobileNavButtonClassName}
                        style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                        data-testid={`link-mobile-${item.id}`}
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </a>
                      </Button>
                    ) : (
                      <Button
                        key={item.id}
                        asChild
                        variant="ghost"
                        className={mobileNavButtonClassName}
                        style={depth > 0 ? { paddingLeft: `${16 + depth * 16}px` } : undefined}
                        data-testid={`link-mobile-${item.id}`}
                        aria-current={location === item.url ? "page" : undefined}
                      >
                        <Link href={item.url} onClick={() => setMobileOpen(false)}>
                          {item.label}
                        </Link>
                      </Button>
                    );
                  })
                ) : (
                  <>
                    {defaultNavLinks.map((link) => (
                      <Button
                        key={link.href}
                        asChild
                        variant="ghost"
                        className={mobileNavButtonClassName}
                        data-testid={`link-mobile-${link.label.toLowerCase()}`}
                        aria-current={location === link.href ? "page" : undefined}
                      >
                        <Link href={link.href} onClick={() => setMobileOpen(false)}>
                          {link.label}
                        </Link>
                      </Button>
                    ))}
                    {resourceLinks.length > 0 && (
                      <>
                        <p className="px-4 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Resources
                        </p>
                        {resourceLinks.map((link) => (
                          <Button
                            key={link.href}
                            asChild
                            variant="ghost"
                            className={`${mobileNavButtonClassName} pl-6`}
                            data-testid={`link-mobile-resource-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                            aria-current={location === link.href ? "page" : undefined}
                          >
                            <Link href={link.href} onClick={() => setMobileOpen(false)}>
                              {link.label}
                            </Link>
                          </Button>
                        ))}
                      </>
                    )}
                    <Button
                      asChild
                      variant="ghost"
                      className={mobileNavButtonClassName}
                      data-testid="link-mobile-contact"
                      aria-current={location === "/#contact" ? "page" : undefined}
                    >
                      <Link href="/#contact" onClick={() => setMobileOpen(false)}>
                        Contact
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
