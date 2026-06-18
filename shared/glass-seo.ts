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
  ["Commercial Storefront Glass Installation", "/services/commercial-storefront-glass-installation"],
  ["Commercial Storefront Glass Replacement & Repair", "/services/commercial-storefront-glass-replacement-repair"],
  ["Commercial Door Installation", "/services/commercial-door-installation"],
  ["Commercial Door Replacement & Repair", "/services/commercial-door-replacement-repair"],
  ["Commercial Window Replacement", "/services/commercial-window-replacement"],
] as const;

const serviceHubOffers = [
  ["Frameless Showers", "/services/frameless-showers"],
  ["Window Installation", "/services/window-installation"],
  ["Window Repair", "/services/window-repair"],
  ["Door Installation", "/services/door-installation"],
  ["Commercial Storefront Glass Installation", "/services/commercial-storefront-glass-installation"],
  ["Commercial Storefront Glass Replacement & Repair", "/services/commercial-storefront-glass-replacement-repair"],
  ["Commercial Door Installation", "/services/commercial-door-installation"],
  ["Commercial Door Replacement & Repair", "/services/commercial-door-replacement-repair"],
  ["Commercial Window Replacement", "/services/commercial-window-replacement"],
] as const;

const serviceSocialMetadata: Record<
  string,
  { ogTitle: string; ogDescription: string; twitterCard: string; twitterSite?: string }
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
  "services-commercial-storefront-glass-installation": {
    ogTitle: "Commercial Storefront Glass Installation Charlotte, NC | Glass and Door Pro",
    ogDescription:
      "Storefront glass installation for new construction, tenant buildouts, and commercial renovations in Charlotte, NC. Owner-operated, reliable scheduling, and clean execution on every project.",
    twitterCard: "summary_large_image",
  },
  "services-commercial-storefront-glass-replacement-repair": {
    ogTitle: "Commercial Storefront Glass Replacement & Repair Charlotte, NC | Glass and Door Pro",
    ogDescription:
      "Broken storefront glass in Charlotte? We board up, secure, and replace commercial storefront glass fast. Owner-operated with same-day emergency response available.",
    twitterCard: "summary_large_image",
  },
  "services-commercial-door-installation": {
    ogTitle: "Commercial Door Installation Charlotte, NC | Glass and Door Pro",
    ogDescription:
      "Commercial door installation for GCs, project managers, and business owners in Charlotte. Aluminum entry doors, glass storefront doors, and complete entrance systems. Reliable scheduling, owner-operated.",
    twitterCard: "summary_large_image",
  },
  "services-commercial-door-replacement-repair": {
    ogTitle: "Commercial Door Replacement & Repair Charlotte, NC | Glass and Door Pro",
    ogDescription:
      "Commercial door not closing right? Glass panel broken? Hardware failing? Glass and Door Pro repairs and replaces commercial doors for Charlotte businesses. Fast response, honest pricing.",
    twitterCard: "summary_large_image",
  },
  "services-commercial-window-replacement": {
    ogTitle: "Apartment & Multi-Family Window Replacement Charlotte, NC | Glass and Door Pro",
    ogDescription:
      "Window replacement for apartment complexes and multi-family properties in Charlotte. Fast mobilization, project manager-friendly, owner-operated. When your timeline can't wait, call Glass and Door Pro.",
    twitterCard: "summary_large_image",
  },
  "service-areas-indian-trail": {
    ogTitle: "Glass & Door Services in Indian Trail, NC | Glass and Door Pro",
    ogDescription:
      "Local glass and door services in Indian Trail. Frameless shower doors, replacement windows, door installation, and more — measured and installed personally by Doug Adams.",
    twitterCard: "summary_large_image",
  },
  "service-areas-stallings": {
    ogTitle: "Glass & Door Services in Stallings, NC | Glass and Door Pro",
    ogDescription:
      "Local glass and door services in Stallings, NC. Frameless shower doors, replacement windows, and door installation measured and installed personally by Doug Adams.",
    twitterCard: "summary_large_image",
  },
  "service-areas-wesley-chapel": {
    ogTitle: "Glass & Door Services in Wesley Chapel, NC | Glass and Door Pro",
    ogDescription:
      "Glass and door services in Wesley Chapel, NC. Frameless showers, replacement windows, door installation — measured and installed personally by Doug Adams of Glass and Door Pro.",
    twitterCard: "summary_large_image",
  },
  "service-areas-waxhaw": {
    ogTitle: "Glass & Door Services in Waxhaw, NC | Glass and Door Pro",
    ogDescription:
      "Glass and door services for Waxhaw homeowners. Custom frameless showers, replacement windows, and door installation — personally measured and installed by Doug Adams.",
    twitterCard: "summary_large_image",
  },
  "service-areas-matthews": {
    ogTitle: "Glass & Door Services in Matthews, NC | Glass and Door Pro",
    ogDescription:
      "Glass and door services for Matthews homeowners. Frameless showers, replacement windows, door installation, and window repair — owner-operated and personally installed by Doug Adams.",
    twitterCard: "summary_large_image",
  },
  "service-areas-weddington": {
    ogTitle: "Glass & Door Services in Weddington, NC | Glass and Door Pro",
    ogDescription:
      "Custom glass and door work for Weddington homeowners. Frameless shower enclosures, replacement windows, and door installation — personally handled by Doug Adams of Glass and Door Pro.",
    twitterCard: "summary_large_image",
  },
  "service-areas-indian-land": {
    ogTitle: "Glass & Door Services in Indian Land, SC | Glass and Door Pro",
    ogDescription:
      "Glass and door services for Indian Land, SC homeowners. Frameless shower enclosures, replacement windows, and door installation — measured and installed personally by Doug Adams.",
    twitterCard: "summary_large_image",
  },
  "service-areas-fort-mill": {
    ogTitle: "Glass & Door Services in Fort Mill, SC | Glass and Door Pro",
    ogDescription:
      "Glass and door services for Fort Mill, SC homeowners. Frameless showers, replacement windows, and door installation — measured and installed personally by Doug Adams of Glass and Door Pro.",
    twitterCard: "summary_large_image",
  },
  "service-areas-pineville": {
    ogTitle: "Glass & Door Services in Pineville, NC | Glass and Door Pro",
    ogDescription:
      "Glass and door services for Pineville, NC homeowners. Frameless showers, replacement windows, door installation, and window repair — personally installed by Doug Adams.",
    twitterCard: "summary_large_image",
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
    seoTitle: "Frameless Shower Doors Charlotte NC | Glass & Door Pro",
    seoDescription:
      "Custom frameless shower doors installed by Doug with 15+ years of experience. Serving Charlotte, Matthews, Indian Trail, Waxhaw & Monroe.",
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
  "services-commercial-storefront-glass-installation": {
    serviceType: "Commercial Storefront Glass Installation",
    name: "Commercial Storefront Glass Installation",
    seoTitle: "Commercial Storefront Glass Installation in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Professional commercial storefront glass installation for new construction and business buildouts in Charlotte, NC. Aluminum framing, glass systems, and storefront doors. Call (704) 771-6111.",
    description:
      "Commercial storefront glass installation for new construction, tenant buildouts, and commercial renovations in Charlotte, NC. Aluminum framing systems, fixed glass panels, and commercial glass doors.",
    offerCatalogName: "Commercial Storefront Glass Installation Services",
    schemaAreaServed: ["Charlotte"],
    offers: [
      "Aluminum Storefront Framing Installation",
      "Commercial Glass Panel Installation",
      "Commercial Glass Storefront Door Installation",
      "Tenant Buildout Glazing",
      "Commercial Renovation Glass Installation",
      "Commercial Entrance System Installation",
    ],
  },
  "services-commercial-storefront-glass-replacement-repair": {
    serviceType: "Commercial Storefront Glass Replacement & Repair",
    name: "Commercial Storefront Glass Replacement & Repair",
    seoTitle: "Commercial Storefront Glass Replacement & Repair in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Emergency storefront glass repair, board-up, and replacement for Charlotte businesses. Broken storefront glass secured and replaced fast. Owner-operated, same-day response. Call (704) 771-6111.",
    description:
      "Emergency storefront glass board-up, repair, and replacement for Charlotte businesses. Broken storefront glass secured and replaced fast by a local owner-operator.",
    offerCatalogName: "Commercial Storefront Glass Replacement & Repair Services",
    schemaAreaServed: ["Charlotte"],
    offers: [
      "Emergency Storefront Glass Board-Up",
      "Commercial Storefront Glass Replacement",
      "Cracked Storefront Glass Repair",
      "Storefront Frame Damage Assessment",
      "Commercial Glass Specification & Upgrade",
      "Scheduled Storefront Glass Maintenance",
    ],
  },
  "services-commercial-door-installation": {
    serviceType: "Commercial Door Installation",
    name: "Commercial Door Installation",
    seoTitle: "Commercial Door Installation in Charlotte, NC | Storefront & Entry Doors | Glass and Door Pro",
    seoDescription:
      "Commercial door installation for new construction, tenant buildouts, and business renovations in Charlotte, NC. Aluminum entry doors, glass storefront doors, and commercial entrance systems. Call (704) 771-6111.",
    description:
      "Commercial door installation for new construction, tenant buildouts, and business renovations in Charlotte, NC. Aluminum entry doors, glass storefront doors, and complete commercial entrance systems.",
    offerCatalogName: "Commercial Door Installation Services",
    schemaAreaServed: ["Charlotte"],
    offers: [
      "Aluminum Storefront Entry Door Installation",
      "Commercial Glass Door Installation",
      "ADA-Compliant Commercial Entrance Installation",
      "Tenant Buildout Entry Door Installation",
      "Multi-Door Entrance System Installation",
      "Commercial Door Hardware Installation",
    ],
  },
  "services-commercial-door-replacement-repair": {
    serviceType: "Commercial Door Replacement & Repair",
    name: "Commercial Door Replacement & Repair",
    seoTitle: "Commercial Door Replacement & Repair in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Commercial door repair and replacement for Charlotte businesses. Broken glass panels, damaged hardware, misaligned frames, and worn closers fixed fast. Owner-operated. Call (704) 771-6111.",
    description:
      "Commercial door repair and replacement for Charlotte businesses. Broken glass panels, hardware failures, misaligned frames, and worn closers repaired fast by a local owner-operator.",
    offerCatalogName: "Commercial Door Replacement & Repair Services",
    schemaAreaServed: ["Charlotte"],
    offers: [
      "Commercial Door Glass Panel Replacement",
      "Commercial Door Closer Repair & Replacement",
      "Misaligned Commercial Door Repair",
      "Commercial Door Lock & Latch Repair",
      "Commercial Door Threshold & Weatherstripping Replacement",
      "Full Commercial Door Replacement",
    ],
  },
  "services-commercial-window-replacement": {
    serviceType: "Apartment & Multi-Family Window Replacement",
    name: "Apartment & Multi-Family Window Replacement",
    seoTitle: "Apartment & Multi-Family Window Replacement in Charlotte, NC | Glass and Door Pro",
    seoDescription:
      "Fast apartment and multi-family window replacement in Charlotte, NC. Wrong windows ordered? Unit damage? Doug mobilizes faster than larger companies — keeping your project on schedule. Call (704) 771-6111.",
    description:
      "Fast apartment and multi-family window replacement in Charlotte, NC. Wrong windows ordered, construction damage, pre-occupancy replacement, and warranty period issues resolved quickly by a local owner-operator.",
    offerCatalogName: "Apartment & Multi-Family Window Replacement Services",
    schemaAreaServed: ["Charlotte"],
    offers: [
      "Wrong Window Order Replacement",
      "Construction Damage Window Replacement",
      "Pre-Occupancy Window Replacement",
      "Warranty Period Window Replacement",
      "Unit Turnover Window Replacement",
      "Multi-Unit Window Replacement Projects",
    ],
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
  "service-areas-indian-trail": {
    city: "Indian Trail",
    state: "North Carolina",
    name: "Glass and Door Services in Indian Trail, NC",
    description:
      "Frameless showers, window installation, window repair, door installation, and commercial glass services in Indian Trail, North Carolina.",
  },
  "service-areas-stallings": {
    city: "Stallings",
    state: "North Carolina",
    name: "Glass and Door Services in Stallings, NC",
    description:
      "Frameless showers, window installation, window repair, and door installation in Stallings, North Carolina.",
  },
  "service-areas-wesley-chapel": {
    city: "Wesley Chapel",
    state: "North Carolina",
    name: "Glass and Door Services in Wesley Chapel, NC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Wesley Chapel, North Carolina.",
  },
  "service-areas-waxhaw": {
    city: "Waxhaw",
    state: "North Carolina",
    name: "Glass and Door Services in Waxhaw, NC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Waxhaw, North Carolina.",
  },
  "service-areas-matthews": {
    city: "Matthews",
    state: "North Carolina",
    name: "Glass and Door Services in Matthews, NC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Matthews, North Carolina.",
  },
  "service-areas-weddington": {
    city: "Weddington",
    state: "North Carolina",
    name: "Glass and Door Services in Weddington, NC",
    description:
      "Custom frameless shower doors, window installation, door installation, and window repair in Weddington, North Carolina.",
  },
  "service-areas-indian-land": {
    city: "Indian Land",
    state: "South Carolina",
    name: "Glass and Door Services in Indian Land, SC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Indian Land, South Carolina.",
  },
  "service-areas-fort-mill": {
    city: "Fort Mill",
    state: "South Carolina",
    name: "Glass and Door Services in Fort Mill, SC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Fort Mill, South Carolina.",
  },
  "service-areas-pineville": {
    city: "Pineville",
    state: "North Carolina",
    name: "Glass and Door Services in Pineville, NC",
    description:
      "Frameless shower doors, window installation, window repair, and door installation in Pineville, North Carolina.",
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
  if (slug === "areas-served-charlotte-nc") return "/service-areas/charlotte";
  if (slug === "areas-served-monroe-nc") return "/service-areas/monroe";
  if (slug.startsWith("service-areas-")) return `/service-areas/${slug.replace(/^service-areas-/, "")}`;
  if (slug.startsWith("areas-served-")) return `/areas-served/${slug.replace(/^areas-served-/, "")}`;
  return `/${slug}`;
}

export function getCmsSlugForPublicPath(pathname: string) {
  if (pathname === "/") return "home";

  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) return `services-${serviceMatch[1]}`;

  const serviceAreaMatch = pathname.match(/^\/service-areas\/([^/]+)$/);
  if (serviceAreaMatch) {
    if (serviceAreaMatch[1] === "charlotte") return "areas-served-charlotte-nc";
    if (serviceAreaMatch[1] === "monroe") return "areas-served-monroe-nc";
    return `service-areas-${serviceAreaMatch[1]}`;
  }

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

export function getGlassCityPageArea(slug: string) {
  const data = cityPageData[slug];
  return data ? { city: data.city, state: data.state } : null;
}

export function buildGlassLocalBusinessLd(
  siteUrl = GLASS_SITE_URL,
  area?: { city: string; state: string } | null,
): JsonLdObject {
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
    areaServed: area ? city(area.city, area.state) : buildGlassServiceAreaServed(),
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

  if (page.slug === "services") {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${absoluteGlassUrl("/services", siteUrl)}#service`,
      serviceType: "Glass and Door Services",
      name: "Glass and Door Services",
      description: page.seoDescription || undefined,
      provider: { "@id": GLASS_BUSINESS_ID },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Glass and Door Services",
        itemListElement: serviceHubOffers.map(([name, path]) => ({
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
  const explicitAreaServed = serviceData.schemaAreaServed?.map((name) => city(name));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteGlassUrl(getCmsPublicPath(page.slug), siteUrl)}#service`,
    serviceType: serviceData.serviceType,
    name: serviceData.name,
    description: serviceData.description || page.seoDescription || undefined,
    provider: { "@id": GLASS_BUSINESS_ID },
    areaServed: explicitAreaServed?.length === 1
      ? explicitAreaServed[0]
      : explicitAreaServed?.length
        ? explicitAreaServed
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

  if (page.slug.startsWith("areas-served-") || page.slug.startsWith("service-areas-")) {
    return [
      { name: "Home", url: `${siteUrl}/` },
      { name: "Service Areas", url: `${siteUrl}/service-areas` },
      { name: page.title, url: canonicalUrl },
    ];
  }

  return [
    { name: "Home", url: `${siteUrl}/` },
    { name: page.title, url: canonicalUrl },
  ];
}
