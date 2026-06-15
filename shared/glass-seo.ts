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

const serviceSocialMetadata: Record<
  string,
  { ogTitle: string; ogDescription: string; twitterCard: string; twitterSite: string }
> = {
  "services-window-installation": {
    ogTitle: "Window Installation & Replacement | Glass and Door Pro",
    ogDescription:
      "Owner-operated window installation serving Charlotte, Monroe, and the greater Union County area. Residential replacement windows, honest quotes, Saturday appointments available.",
    twitterCard: "summary_large_image",
    twitterSite: "@GlassDoorPro",
  },
  "services-window-repair": {
    ogTitle: "Window Repair Services | Glass and Door Pro",
    ogDescription:
      "Fix foggy windows, broken seals, failed panes, and damaged hardware without replacing the whole window. Owner-operated window repair across Charlotte and Monroe, NC.",
    twitterCard: "summary_large_image",
    twitterSite: "@GlassDoorPro",
  },
  "services-door-installation": {
    ogTitle: "Door Installation Services | Glass and Door Pro",
    ogDescription:
      "Entry doors, patio doors, storm doors, and exterior door installation. Owner-operated service across Charlotte, Monroe, and the greater Union County area. Honest pricing, clean finish.",
    twitterCard: "summary_large_image",
    twitterSite: "@GlassDoorPro",
  },
};

const glassServiceAreas = [
  ["Charlotte", "North Carolina"],
  ["Monroe", "North Carolina"],
  ["Indian Trail", "North Carolina"],
  ["Matthews", "North Carolina"],
  ["Mint Hill", "North Carolina"],
  ["Waxhaw", "North Carolina"],
  ["Weddington", "North Carolina"],
  ["Wesley Chapel", "North Carolina"],
  ["Stallings", "North Carolina"],
  ["Pineville", "North Carolina"],
  ["Fort Mill", "South Carolina"],
  ["Indian Land", "South Carolina"],
  ["Huntersville", "North Carolina"],
  ["Cornelius", "North Carolina"],
  ["Davidson", "North Carolina"],
  ["Concord", "North Carolina"],
  ["Tega Cay", "South Carolina"],
  ["Rock Hill", "South Carolina"],
] as const;

function city(name: string, state = "North Carolina") {
  return {
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: state },
  };
}

function buildGlassServiceAreaServed() {
  return glassServiceAreas.map(([name, state]) => city(name, state));
}

const servicePageNames: Record<
  string,
  {
    serviceType: string;
    name: string;
    description?: string;
    seoTitle?: string;
    seoDescription?: string;
    offerCatalogName?: string;
    offers?: string[];
    schemaAreaServed?: string[];
  }
> = {
  "services-frameless-showers": {
    serviceType: "Frameless Glass Shower Door Installation",
    name: "Custom Frameless Shower Door Installation",
    seoTitle: "Frameless Shower Doors in Charlotte, Monroe & Indian Trail NC",
    seoDescription:
      "Custom frameless glass shower doors installed by an owner-operator with 15+ years of experience. Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw and nearby NC areas. Call for a free quote.",
    description:
      'Custom frameless glass shower door design, fabrication, and installation. Tempered safety glass in 3/8" and 1/2" thicknesses, low-iron glass available, premium hardware in multiple finishes. Serving the greater Charlotte, NC metro and surrounding areas.',
  },
  "services-window-installation": {
    serviceType: "Window Installation & Replacement",
    name: "Window Installation & Replacement",
    seoTitle: "Window Installation in Charlotte & Monroe, NC | Replacement Windows | Glass and Door Pro",
    seoDescription:
      "Professional window installation and replacement for homes across Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Owner-operated, honest pricing, same-week appointments. Call (704) 771-6111.",
    description:
      "Professional residential window installation and replacement serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and surrounding communities in the greater Charlotte metro area.",
    offerCatalogName: "Window Installation Services",
    schemaAreaServed: ["Charlotte", "Monroe", "Indian Trail", "Matthews", "Waxhaw"],
    offers: [
      "Double-Hung Window Replacement",
      "Casement Window Installation",
      "Sliding Window Replacement",
      "Picture Window Installation",
      "Bay Window Installation",
      "Energy-Efficient Window Replacement",
    ],
  },
  "services-door-installation": {
    serviceType: "Door Installation",
    name: "Door Installation",
    seoTitle: "Door Installation in Charlotte & Monroe, NC | Entry, Patio & Storm Doors | Glass and Door Pro",
    seoDescription:
      "Residential door installation for entry doors, patio doors, storm doors, and exterior doors across Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    description:
      "Residential door installation services including entry doors, patio doors, storm doors, French doors, and exterior doors throughout Charlotte, Monroe, and the greater Charlotte metro area.",
    offerCatalogName: "Door Installation Services",
    schemaAreaServed: ["Charlotte", "Monroe", "Indian Trail", "Matthews", "Waxhaw"],
    offers: [
      "Entry Door Installation",
      "Patio Door Installation",
      "Storm Door Installation",
      "French Door Installation",
      "Exterior Door Replacement",
      "Door Frame Repair & Replacement",
    ],
  },
  "services-window-repair": {
    serviceType: "Window Repair",
    name: "Window Repair",
    seoTitle: "Window Repair in Charlotte & Monroe, NC | Foggy Glass, Broken Seals & More | Glass and Door Pro",
    seoDescription:
      "Window repair for broken seals, foggy panes, failed IGUs, broken hardware, and cracked glass. Serving Charlotte, Monroe, Indian Trail, Matthews, and surrounding areas. Call (704) 771-6111.",
    description:
      "Residential window repair services including foggy glass replacement, broken seal repair, IGU replacement, hardware repair, and weatherstripping. Serving Charlotte, Monroe, and the greater Charlotte metro area.",
    offerCatalogName: "Window Repair Services",
    schemaAreaServed: ["Charlotte", "Monroe", "Indian Trail", "Matthews", "Waxhaw"],
    offers: [
      "Foggy Window Repair",
      "Insulated Glass Unit (IGU) Replacement",
      "Broken Window Glass Replacement",
      "Window Hardware Repair",
      "Window Weatherstripping Replacement",
      "Window Screen Replacement",
    ],
  },
  "services-commercial-glass": {
    serviceType: "Commercial Glass Services",
    name: "Commercial Glass Services",
    seoTitle: "Commercial Glass Services in Charlotte, NC",
    seoDescription:
      "Commercial glass installation and repair for storefronts, office partitions, glass doors, restaurants, retail spaces, and property managers in Charlotte and nearby areas. Call for a free quote.",
    description:
      "Commercial glass installation and repair for storefronts, office partitions, glass doors, restaurants, retail spaces, offices, and property managers in Charlotte, NC and nearby areas.",
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

export function getGlassServiceSeoOverride(slug: string) {
  const serviceData = servicePageNames[slug];
  if (!serviceData?.seoTitle && !serviceData?.seoDescription) return null;
  return {
    title: serviceData.seoTitle,
    description: serviceData.seoDescription,
  };
}

export function getGlassServiceSocialMetadata(slug: string) {
  return serviceSocialMetadata[slug] ?? null;
}

export function isGlassServicePageSlug(slug: string) {
  return Boolean(servicePageNames[slug]);
}

export function buildGlassLocalBusinessLd(siteUrl = GLASS_SITE_URL): JsonLdObject {
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
      streetAddress: "2341 Waverly Dr",
      addressLocality: "Monroe",
      addressRegion: "NC",
      postalCode: "28112",
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
    areaServed: buildGlassServiceAreaServed(),
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

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteGlassUrl(getCmsPublicPath(page.slug), siteUrl)}#service`,
    serviceType: serviceData.serviceType,
    name: serviceData.name,
    description: serviceData.description || page.seoDescription || undefined,
    provider: { "@id": GLASS_BUSINESS_ID },
    areaServed: serviceData.schemaAreaServed?.length
      ? serviceData.schemaAreaServed.map((name) => city(name))
      : buildGlassServiceAreaServed(),
    ...(serviceData.offers?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: serviceData.offerCatalogName || `${serviceData.name} Services`,
            itemListElement: serviceData.offers.map((name) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name,
              },
            })),
          },
        }
      : {
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            url: absoluteGlassUrl(getCmsPublicPath(page.slug), siteUrl),
          },
        }),
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
