import type { CmsPage } from "./schema";

export type JsonLdObject = Record<string, unknown>;

export const GLASS_SITE_URL = "https://glassanddoorpro.com";
export const GLASS_BUSINESS_ID = `${GLASS_SITE_URL}/#business`;
export const GLASS_DEFAULT_OG_IMAGE = "/images/glass-door-pro/brand/logo-og-1200x630-white-bg.png";

const cityServiceOffers = [
  ["Frameless Shower Door Installation", "/services/frameless-showers"],
  ["Window Installation", "/services/window-installation"],
  ["Door Installation", "/services/door-installation"],
  ["Window Repair", "/services/window-repair"],
  ["Commercial Glass", "/services/commercial-glass"],
] as const;

const servicePageNames: Record<string, { serviceType: string; name: string; description?: string }> = {
  "services-frameless-showers": {
    serviceType: "Frameless Glass Shower Door Installation",
    name: "Custom Frameless Shower Door Installation",
    description:
      'Custom frameless glass shower door design, fabrication, and installation. Tempered safety glass in 3/8" and 1/2" thicknesses, low-iron glass available, premium hardware in multiple finishes. Serving the greater Charlotte, NC metro and surrounding areas.',
  },
  "services-window-installation": {
    serviceType: "Window Installation",
    name: "Residential Window Installation",
  },
  "services-door-installation": {
    serviceType: "Door Installation",
    name: "Door Installation Services",
  },
  "services-window-repair": {
    serviceType: "Window Repair",
    name: "Window Repair Services",
  },
  "services-commercial-glass": {
    serviceType: "Commercial Glass Services",
    name: "Commercial Glass Services",
  },
};

const cityPageData: Record<string, { city: string; state: string; name: string; description: string }> = {
  "areas-served-monroe-nc": {
    city: "Monroe",
    state: "North Carolina",
    name: "Glass and Door Services in Monroe, NC",
    description:
      "Frameless shower door installation, window installation, door installation, window repair, and commercial glass services for homes and businesses in Monroe, North Carolina.",
  },
  "areas-served-charlotte-nc": {
    city: "Charlotte",
    state: "North Carolina",
    name: "Glass and Door Services in Charlotte, NC",
    description:
      "Frameless shower door installation, window installation, door installation, window repair, and commercial glass services for homes and businesses in Charlotte, North Carolina.",
  },
};

export function absoluteGlassUrl(path: string | null | undefined, siteUrl = GLASS_SITE_URL) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function getCmsPublicPath(slug: string) {
  if (!slug || slug === "home") return "/";
  if (slug.startsWith("services-")) return `/services/${slug.replace(/^services-/, "")}`;
  if (slug.startsWith("areas-served-")) return `/areas-served/${slug.replace(/^areas-served-/, "")}`;
  return `/${slug}`;
}

export function getCmsSlugForPublicPath(pathname: string) {
  if (pathname === "/") return "home";

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) return `services-${serviceMatch[1]}`;

  const areaMatch = pathname.match(/^\/areas-served\/([^/]+)$/);
  if (areaMatch) return `areas-served-${areaMatch[1]}`;

  const slug = pathname.replace(/^\/+/, "");
  return slug && !slug.includes("/") ? slug : null;
}

export function buildGlassLocalBusinessLd(siteUrl = GLASS_SITE_URL): JsonLdObject {
  const city = (name: string, state = "North Carolina") => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: state },
  });

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": GLASS_BUSINESS_ID,
    name: "Glass and Door Pro",
    url: `${GLASS_SITE_URL}/`,
    telephone: "+1-704-771-6111",
    email: "Doug@GlassandDoorPro.com",
    image: absoluteGlassUrl(GLASS_DEFAULT_OG_IMAGE, siteUrl),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Monroe",
      addressRegion: "NC",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      city("Charlotte"),
      city("Monroe"),
      city("Indian Trail"),
      city("Matthews"),
      city("Mint Hill"),
      city("Waxhaw"),
      city("Weddington"),
      city("Wesley Chapel"),
      city("Stallings"),
      city("Pineville"),
      city("Fort Mill", "South Carolina"),
      city("Indian Land", "South Carolina"),
    ],
  };
}

export function buildGlassServiceLdForCmsPage(
  page: Pick<CmsPage, "slug" | "seoDescription">,
  siteUrl = GLASS_SITE_URL,
): JsonLdObject | null {
  const cityData = cityPageData[page.slug];
  if (cityData) {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: cityData.name,
      description: cityData.description,
      provider: { "@id": GLASS_BUSINESS_ID },
      areaServed: {
        "@type": "City",
        name: cityData.city,
        containedInPlace: { "@type": "State", name: cityData.state },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Glass and Door Services",
        itemListElement: cityServiceOffers.map(([name, path]) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
            url: absoluteGlassUrl(path, siteUrl),
          },
        })),
      },
    };
  }

  const serviceData = servicePageNames[page.slug];
  if (!serviceData) return null;

  const isFrameless = page.slug === "services-frameless-showers";
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: serviceData.serviceType,
    name: serviceData.name,
    description: serviceData.description || page.seoDescription || undefined,
    provider: { "@id": GLASS_BUSINESS_ID },
    areaServed: isFrameless
      ? [
          "Charlotte, NC",
          "Monroe, NC",
          "Indian Trail, NC",
          "Matthews, NC",
          "Mint Hill, NC",
          "Waxhaw, NC",
          "Weddington, NC",
          "Wesley Chapel, NC",
          "Stallings, NC",
          "Pineville, NC",
          "Fort Mill, SC",
          "Indian Land, SC",
          "Huntersville, NC",
          "Cornelius, NC",
          "Davidson, NC",
          "Concord, NC",
          "Tega Cay, SC",
          "Rock Hill, SC",
        ]
      : undefined,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      url: absoluteGlassUrl(getCmsPublicPath(page.slug), siteUrl),
    },
  };
}

export function buildGlassBreadcrumbItems(page: Pick<CmsPage, "slug" | "title">, siteUrl = GLASS_SITE_URL) {
  const publicPath = getCmsPublicPath(page.slug);
  const canonicalUrl = publicPath === "/" ? `${siteUrl}/` : absoluteGlassUrl(publicPath, siteUrl);

  if (page.slug.startsWith("services-")) {
    return [
      { name: "Home", url: `${siteUrl}/` },
      { name: "Services", url: `${siteUrl}/services` },
      { name: page.title, url: canonicalUrl },
    ];
  }

  if (page.slug.startsWith("areas-served-")) {
    return [
      { name: "Home", url: `${siteUrl}/` },
      { name: "Areas Served", url: `${siteUrl}/areas-served` },
      { name: page.title, url: canonicalUrl },
    ];
  }

  return [
    { name: "Home", url: `${siteUrl}/` },
    { name: page.title, url: canonicalUrl },
  ];
}
