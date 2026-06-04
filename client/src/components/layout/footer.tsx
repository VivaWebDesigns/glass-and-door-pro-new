import { useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useBranding } from "@/components/shared/branding-provider";
import type { CmsMenu, MenuItem, PublicMenuLocation } from "@shared/schema";

const defaultPlatformLinks = [
  { href: "/#services", label: "Frameless Showers", testId: "link-footer-frameless-showers" },
  { href: "/#services", label: "Window Installation", testId: "link-footer-window-installation" },
  { href: "/#services", label: "Door Installation", testId: "link-footer-door-installation" },
];

const defaultTherapistLinks = [
  { href: "/#services", label: "Window Repair", testId: "link-footer-window-repair" },
  { href: "/#services", label: "Commercial Glass", testId: "link-footer-commercial-glass" },
  { href: "/#contact", label: "Get a Free Quote", testId: "link-footer-quote" },
];

const defaultResourceLinks = [
  { href: "/#about", label: "About Doug", testId: "link-footer-about-doug" },
  { href: "/#gallery", label: "Project Gallery", testId: "link-footer-gallery" },
  { href: "/#reviews", label: "Reviews", testId: "link-footer-reviews" },
];

const defaultCompanyLinks = [
  { href: "/#contact", label: "Contact", testId: "link-footer-contact" },
  { href: "tel:+17047716111", label: "(704) 771-6111", testId: "link-footer-phone" },
  { href: "mailto:Doug@GlassandDoorPro.com", label: "Doug@GlassandDoorPro.com", testId: "link-footer-email" },
];

const defaultLegalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy", testId: "link-footer-privacy" },
  { href: "/terms-of-service", label: "Terms of Service", testId: "link-footer-terms" },
  { href: "/disclaimer", label: "Disclaimer", testId: "link-footer-disclaimer" },
];

type FooterLegalLink = {
  href: string;
  label: string;
  testId: string;
  openInNewTab?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; testId: string }[];
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white sm:mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm sm:space-y-3">
        {links.map((link) => (
          <li key={link.testId}>
            {link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? (
              <a
                href={link.href}
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={link.testId}
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={link.testId}
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
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
        {allLinks.map(({ item: child, depth }) => (
          <li key={child.id} style={depth > 0 ? { paddingLeft: `${depth * 12}px` } : undefined}>
            {child.openInNewTab ? (
              <a
                href={child.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={`link-footer-${child.id}`}
              >
                {child.label}
              </a>
            ) : (
              <Link
                href={child.url}
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={`link-footer-${child.id}`}
              >
                {child.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function flattenMenuLinks(items: MenuItem[]): MenuItem[] {
  return flattenFooterItems(items).map(({ item }) => item);
}

function StandardFooterColumn({ menu }: { menu: CmsMenu }) {
  const links = flattenMenuLinks((menu.items as MenuItem[]) || []);
  if (links.length === 0) return null;

  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-white sm:mb-4">
        {menu.name}
      </h4>
      <ul className="space-y-2.5 sm:space-y-3 text-sm">
        {links.map((item) => (
          <li key={item.id}>
            {item.openInNewTab ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={`link-footer-${item.id}`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                href={item.url}
                className="text-slate-400 transition-colors hover:text-white"
                data-testid={`link-footer-${item.id}`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { frontendLogoUrl, companyName } = useBranding();
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

  const standardFooterMenus = useMemo(
    () =>
      [
        publicMenus?.footer_platform,
        publicMenus?.footer_professionals,
        publicMenus?.footer_resources,
        publicMenus?.footer_company,
      ].filter((menu): menu is CmsMenu =>
        Boolean(menu && Array.isArray(menu.items) && menu.items.length > 0),
      ),
    [publicMenus],
  );

  const legalLinks = useMemo(() => {
    const legalMenu = publicMenus?.footer_legal;
    if (!legalMenu?.items) return defaultLegalLinks;

    const items = flattenMenuLinks((legalMenu.items as MenuItem[]) || []);
    if (items.length === 0) return defaultLegalLinks;

    return items.map((item) => ({
      href: item.url,
      label: item.label,
      openInNewTab: item.openInNewTab,
      testId: `link-footer-${item.id}`,
    }));
  }, [publicMenus]) as FooterLegalLink[];

  const useStandardFooterMenus = standardFooterMenus.length > 0;
  const brandLogo = frontendLogoUrl || "/images/glass-door-pro/logo.png";
  const brandName = companyName || "Glass & Door Pro";

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200" data-testid="footer">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:py-16">
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 ${useStandardFooterMenus ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-8 sm:gap-10 lg:gap-12`}
        >
          <div className="col-span-2">
            <div className="mb-4 inline-flex rounded bg-white p-3">
              <img src={brandLogo} alt={brandName} className="h-12 w-auto sm:h-14" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Specializing in frameless glass showers, residential window replacements and
              repairs, door installations, and commercial glass throughout the greater Charlotte
              area.
            </p>
          </div>

          {useStandardFooterMenus ? (
            standardFooterMenus.map((menu) => <StandardFooterColumn key={menu.id} menu={menu} />)
          ) : legacyFooterItems ? (
            legacyFooterItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <DynamicFooterColumn key={item.id} item={item} />
              ) : (
                <div key={item.id}>
                  <ul className="space-y-2.5 sm:space-y-3 text-sm">
                    <li>
                      {item.openInNewTab ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-slate-400 transition-colors hover:text-white"
                          data-testid={`link-footer-${item.id}`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.url}
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
              <FooterColumn title="Services" links={defaultPlatformLinks} />
              <FooterColumn title="More Services" links={defaultTherapistLinks} />
              <div className="col-span-2 sm:col-span-1">
                <FooterColumn title="Resources" links={defaultResourceLinks} />
                <div className="mt-6 sm:mt-8">
                  <FooterColumn title="Company" links={defaultCompanyLinks} />
                </div>
              </div>
            </>
          )}
        </div>

        <div
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 text-sm text-slate-400 sm:mt-10 sm:flex-row sm:gap-4"
          data-testid="text-copyright"
        >
          <span className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {legalLinks.map((link) =>
              link.openInNewTab ? (
                <a
                  key={link.testId}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                  data-testid={link.testId}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.testId}
                  href={link.href}
                  className="hover:text-white transition-colors"
                  data-testid={link.testId}
                >
                  {link.label}
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
