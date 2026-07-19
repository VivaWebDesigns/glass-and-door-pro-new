import { useMemo, type ReactNode } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useBranding } from "@/components/shared/branding-provider";
import type { CmsMenu, MenuItem, PublicMenuLocation } from "@shared/schema";

const defaultPlatformLinks = [
  { href: "/services", label: "All Services", testId: "link-footer-services" },
  { href: "/services/frameless-showers", label: "Frameless Showers", testId: "link-footer-frameless-showers" },
  { href: "/services/window-installation", label: "Window Installation", testId: "link-footer-window-installation" },
  { href: "/services/door-installation", label: "Door Installation", testId: "link-footer-door-installation" },
  { href: "/services/window-repair", label: "Window Repair", testId: "link-footer-window-repair" },
  { href: "/services/commercial-storefront-glass-installation", label: "Commercial Storefront Glass Installation", testId: "link-footer-commercial-storefront-glass-installation" },
  { href: "/services/commercial-storefront-glass-replacement-repair", label: "Commercial Storefront Glass Replacement & Repair", testId: "link-footer-commercial-storefront-glass-replacement-repair" },
  { href: "/services/commercial-door-installation", label: "Commercial Door Installation", testId: "link-footer-commercial-door-installation" },
  { href: "/services/commercial-door-replacement-repair", label: "Commercial Door Replacement & Repair", testId: "link-footer-commercial-door-replacement-repair" },
  { href: "/services/commercial-window-replacement", label: "Commercial Window Replacement", testId: "link-footer-commercial-window-replacement" },
  { href: "/gallery", label: "Gallery", testId: "link-footer-gallery" },
  { href: "/reviews", label: "Reviews", testId: "link-footer-reviews" },
];

const defaultServiceAreaLinks = [
  { href: "/service-areas", label: "All Service Areas", testId: "link-footer-service-areas" },
  { href: "/service-areas/charlotte", label: "Charlotte", testId: "link-footer-service-area-charlotte" },
  { href: "/service-areas/monroe", label: "Monroe", testId: "link-footer-service-area-monroe" },
  { href: "/service-areas/indian-trail", label: "Indian Trail", testId: "link-footer-service-area-indian-trail" },
  { href: "/service-areas/stallings", label: "Stallings", testId: "link-footer-service-area-stallings" },
  { href: "/service-areas/wesley-chapel", label: "Wesley Chapel", testId: "link-footer-service-area-wesley-chapel" },
  { href: "/service-areas/waxhaw", label: "Waxhaw", testId: "link-footer-service-area-waxhaw" },
  { href: "/service-areas/matthews", label: "Matthews", testId: "link-footer-service-area-matthews" },
  { href: "/service-areas/weddington", label: "Weddington", testId: "link-footer-service-area-weddington" },
  { href: "/service-areas/indian-land", label: "Indian Land", testId: "link-footer-service-area-indian-land" },
  { href: "/service-areas/fort-mill", label: "Fort Mill", testId: "link-footer-service-area-fort-mill" },
  { href: "/service-areas/pineville", label: "Pineville", testId: "link-footer-service-area-pineville" },
];

const defaultCompanyLinks = [
  { href: "/#contact", label: "Contact", testId: "link-footer-contact" },
  { href: "tel:+17047716111", label: "(704) 771-6111", testId: "link-footer-phone" },
  { href: "mailto:Doug@GlassandDoorPro.com", label: "Doug@GlassandDoorPro.com", testId: "link-footer-email" },
];

const defaultLegalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", testId: "link-footer-privacy-policy" },
  { href: "/terms-of-service", label: "Terms of Service", testId: "link-footer-terms-of-service" },
  { href: "/disclaimer", label: "Disclaimer", testId: "link-footer-disclaimer" },
];

type FooterLegalLink = {
  href: string;
  label: string;
  testId: string;
  openInNewTab?: boolean;
};

function normalizeFooterMenuUrl(item: Pick<MenuItem, "label" | "url">) {
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

function flattenFooterItems(items: MenuItem[], depth = 0): { item: MenuItem; depth: number }[] {
  const result: { item: MenuItem; depth: number }[] = [];
  for (const item of items) {
    result.push({ item, depth });
    if (item.children?.length > 0) {
      result.push(...flattenFooterItems(item.children, depth + 1));
    }
  }
  return result;
}

function DynamicFooterColumn({ item }: { item: MenuItem }) {
  const allLinks = flattenFooterItems(item.children || []);
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white sm:mb-4">
        {item.label}
      </h4>
      <ul className="space-y-2.5 sm:space-y-3 text-sm">
        {allLinks.map(({ item: child, depth }) => {
          const href = normalizeFooterMenuUrl(child);
          return (
            <li key={child.id} style={depth > 0 ? { paddingLeft: `${depth * 12}px` } : undefined}>
              {child.openInNewTab ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 transition-colors hover:text-white"
                  data-testid={`link-footer-${child.id}`}
                >
                  {child.label}
                </a>
              ) : (
                <Link
                  href={href}
                  className="text-slate-400 transition-colors hover:text-white"
                  data-testid={`link-footer-${child.id}`}
                >
                  {child.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function flattenMenuLinks(items: MenuItem[]): MenuItem[] {
  return flattenFooterItems(items).map(({ item }) => item);
}

function menuItemsToLinks(items: MenuItem[] | undefined, testIdPrefix: string) {
  return flattenMenuLinks(items || []).map((item) => ({
    href: normalizeFooterMenuUrl(item),
    label: item.label === "Project Gallery" ? "Gallery" : item.label,
    openInNewTab: item.openInNewTab,
    testId: `${testIdPrefix}-${item.id}`,
  }));
}

function uniqueFooterLinks<T extends { href: string; label: string }>(links: T[]) {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = `${link.label.toLowerCase()}|${link.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function ensureServicesHubLink<T extends FooterLegalLink>(links: T[]) {
  if (links.some((link) => link.href === "/services")) return links;
  return [
    {
      href: "/services",
      label: "All Services",
      testId: "link-footer-services",
    } as T,
    ...links,
  ];
}

function ensureServiceAreasHubLink<T extends FooterLegalLink>(links: T[]) {
  if (links.some((link) => link.href === "/service-areas")) return links;
  return [
    {
      href: "/service-areas",
      label: "All Service Areas",
      testId: "link-footer-service-areas",
    } as T,
    ...links,
  ];
}

function FooterTextLink({ link }: { link: FooterLegalLink }) {
  const className = "text-slate-400 transition-colors hover:text-white";
  if (link.openInNewTab) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid={link.testId}
      >
        {link.label}
      </a>
    );
  }

  if (link.href.startsWith("tel:") || link.href.startsWith("mailto:")) {
    return (
      <a href={link.href} className={className} data-testid={link.testId}>
        {link.label}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className} data-testid={link.testId}>
      {link.label}
    </Link>
  );
}

function ContactInfoItem({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-3 text-sm leading-6 text-slate-400">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" />
      <span>{children}</span>
    </li>
  );
}

export function Footer() {
  const { frontendLogoUrl, companyAddress, companyName, companyPhoneNumbers } = useBranding();
  const { data: publicMenus } = useQuery<Partial<Record<PublicMenuLocation, CmsMenu>>>({
    queryKey: ["/api/cms/menus"],
    queryFn: async () => {
      const res = await fetch("/api/cms/menus");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const legacyFooterItems = useMemo(() => {
    const footerMenu = publicMenus?.footer;
    if (!footerMenu?.items) return null;
    const items = footerMenu.items as MenuItem[];
    return items.length > 0 ? items : null;
  }, [publicMenus]);

  const servicesLinks = useMemo(() => {
    const platformLinks = menuItemsToLinks(publicMenus?.footer_platform?.items as MenuItem[] | undefined, "link-footer-platform");
    const professionalLinks = menuItemsToLinks(publicMenus?.footer_professionals?.items as MenuItem[] | undefined, "link-footer-professionals");
    const galleryLinks = menuItemsToLinks(publicMenus?.footer_resources?.items as MenuItem[] | undefined, "link-footer-resources")
      .filter((link) => /gallery/i.test(link.label));
    const cmsLinks = uniqueFooterLinks([...platformLinks, ...professionalLinks, ...galleryLinks])
      .filter((link) => !/quote/i.test(link.label));

    return cmsLinks.length > 0 ? ensureServicesHubLink(cmsLinks) : defaultPlatformLinks;
  }, [publicMenus]) as FooterLegalLink[];

  const serviceAreaLinks = useMemo(() => {
    const links = menuItemsToLinks(publicMenus?.footer_resources?.items as MenuItem[] | undefined, "link-footer-service-areas")
      .filter((link) => link.href.startsWith("/service-areas/"));
    return links.length > 0
      ? ensureServiceAreasHubLink(uniqueFooterLinks(links))
      : defaultServiceAreaLinks;
  }, [publicMenus]) as FooterLegalLink[];

  const companyLinks = useMemo(() => {
    const links = menuItemsToLinks(publicMenus?.footer_company?.items as MenuItem[] | undefined, "link-footer-company");
    return links.length > 0 ? links : defaultCompanyLinks;
  }, [publicMenus]) as FooterLegalLink[];

  const legalLinks = useMemo(() => {
    const links = menuItemsToLinks(publicMenus?.footer_legal?.items as MenuItem[] | undefined, "link-footer-legal");
    return links.length > 0 ? links : defaultLegalLinks;
  }, [publicMenus]) as FooterLegalLink[];

  const brandLogo = frontendLogoUrl || "/images/glass-door-pro/brand/logo-header-900x260-white-bg.webp";
  const brandName = companyName || "Glass & Door Pro";
  const address = (companyAddress || "2341 Waverly Dr, Monroe, NC 28112").replace(/\s*\n\s*/g, ", ");
  const phone = companyPhoneNumbers || "(704) 771-6111";
  const phoneLink = companyLinks.find((link) => link.href.startsWith("tel:"))?.href || "tel:+17047716111";
  const emailLink =
    companyLinks.find((link) => link.href.startsWith("mailto:")) || {
      href: "mailto:Doug@GlassandDoorPro.com",
      label: "Doug@GlassandDoorPro.com",
      testId: "link-footer-email",
    };

  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-200" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.85fr_1.05fr] lg:gap-12">
          <div>
            <div className="mb-5 inline-flex bg-white p-1.5">
              <img src={brandLogo} alt={brandName} className="h-12 w-auto sm:h-11" />
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400">
              Specializing in frameless glass shower doors, residential window replacements and
              repairs, door installations, and commercial glass replacements and installations in
              the greater Charlotte area.
            </p>
          </div>

          {legacyFooterItems ? (
            legacyFooterItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <DynamicFooterColumn key={item.id} item={item} />
              ) : (
                <div key={item.id}>
                  <ul className="space-y-2.5 sm:space-y-3 text-sm">
                    <li>
                      {item.openInNewTab ? (
                        <a
                          href={normalizeFooterMenuUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-400 transition-colors hover:text-white"
                          data-testid={`link-footer-${item.id}`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={normalizeFooterMenuUrl(item)}
                          className="font-semibold text-slate-400 transition-colors hover:text-white"
                          data-testid={`link-footer-${item.id}`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  </ul>
                </div>
              ),
            )
          ) : (
            <>
              <div>
                <h4 className="mb-4 text-base font-bold text-white">Services</h4>
                <ul className="space-y-2.5 text-sm sm:space-y-3">
                  {servicesLinks.map((link) => (
                    <li key={link.testId}>
                      <FooterTextLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-base font-bold text-white">Service Areas</h4>
                <ul className="space-y-2.5 text-sm sm:space-y-3">
                  {serviceAreaLinks.map((link) => (
                    <li key={link.testId}>
                      <FooterTextLink link={link} />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-base font-bold text-white">Contact Info</h4>
                <ul className="space-y-3">
                  <ContactInfoItem icon={MapPin}>{address}</ContactInfoItem>
                  <ContactInfoItem icon={Phone}>
                    <a href={phoneLink} className="transition-colors hover:text-white">
                      {phone}
                    </a>
                  </ContactInfoItem>
                  <ContactInfoItem icon={Mail}>
                    <a href={emailLink.href} className="transition-colors hover:text-white">
                      {emailLink.label}
                    </a>
                  </ContactInfoItem>
                  <ContactInfoItem icon={Clock}>Mon-Sat: 7am - 7pm</ContactInfoItem>
                </ul>
              </div>
            </>
          )}
        </div>

        <div className="mt-10 border-t border-slate-800 pt-8 text-sm text-slate-500">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p data-testid="text-copyright">
              &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <nav aria-label="Legal links">
              <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <li key={link.testId}>
                    <FooterTextLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
