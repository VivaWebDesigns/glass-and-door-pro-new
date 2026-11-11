export const GLASS_SERVICE_AREAS_HERO_IMAGE =
  "/images/glass-door-pro/charming-suburban-home-hero-1920x1080.webp";

export const GLASS_PRIMARY_SERVICE_AREAS = [
  { label: "Charlotte", href: "/service-areas/charlotte" },
  { label: "Pineville", href: "/service-areas/pineville" },
  { label: "Matthews", href: "/service-areas/matthews" },
  { label: "Weddington", href: "/service-areas/weddington" },
  { label: "Indian Trail", href: "/service-areas/indian-trail" },
  { label: "Wesley Chapel", href: "/service-areas/wesley-chapel" },
  { label: "Stallings", href: "/service-areas/stallings" },
  { label: "Waxhaw", href: "/service-areas/waxhaw" },
  { label: "Monroe", href: "/service-areas/monroe" },
  { label: "Fort Mill", href: "/service-areas/fort-mill" },
  { label: "Indian Land", href: "/service-areas/indian-land" },
] as const;

export const GLASS_PRIMARY_SERVICE_AREA_NAMES = GLASS_PRIMARY_SERVICE_AREAS.map(
  ({ label }) => label,
).join(", ");

export const GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML = GLASS_PRIMARY_SERVICE_AREAS.map(
  ({ label, href }) => `<a href="${href}">${label}</a>`,
).join(", ");

export const GLASS_LINKED_SERVICE_AREA_CONTENT = `<p>We serve homeowners and businesses throughout the greater Charlotte metro area, including: ${GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML}, and surrounding areas.</p>`;

export const GLASS_COMMERCIAL_LINKED_SERVICE_AREA_CONTENT = `<p>We serve businesses, property managers, general contractors, and commercial facilities throughout the greater Charlotte metro area, including ${GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML}, and surrounding areas.</p>`;

const serviceAreaDescriptions = {
  Charlotte: "Glass, window, door, shower, and commercial services across Charlotte.",
  Pineville: "Glass, window, door, and repair services for Pineville properties.",
  Matthews: "Residential and commercial glass, window, and door services in Matthews.",
  Weddington: "Custom glass, frameless showers, windows, and doors in Weddington.",
  "Indian Trail": "Frameless showers, windows, doors, repairs, and commercial glass.",
  "Wesley Chapel": "Custom shower glass, replacement windows, door installation, and repair.",
  Stallings: "Local glass and door installation and repair for Stallings homes and businesses.",
  Waxhaw: "Custom showers, replacement windows, doors, and glass repair for Waxhaw properties.",
  Monroe: "Owner-operated glass, window, door, and commercial services throughout Monroe.",
  "Fort Mill": "Frameless showers, windows, doors, and commercial glass in Fort Mill.",
  "Indian Land": "Glass and door service for Indian Land, SC homeowners and businesses.",
};

export const GLASS_SERVICE_AREA_HUB_CARDS = GLASS_PRIMARY_SERVICE_AREAS.map(
  ({ label, href }) => [label, href, serviceAreaDescriptions[label]] as const,
);

export function summarizeServiceArea(value: string) {
  const places = value
    .split(",")
    .map((place) => place.trim())
    .filter(Boolean);
  if (places.length <= 3) return null;
  return `${places[0]} and ${places.length - 1} nearby towns`;
}

export const GLASS_SERVICE_AREA_HUB = {
  heading: "Glass and Door Services Across Greater Charlotte",
  heroAlt: "Suburban home exterior with replacement windows installed",
  intro:
    "Glass & Door Pro serves Charlotte, Union County, and nearby South Carolina communities with frameless showers, window installation, door installation, window repair, and commercial glass services.",
  areasTitle: "Areas We Serve",
  areasIntro: "Choose your city to see local glass and door services.",
  areaLinkText: "View area",
  detailsTitle: "Serving the Greater Charlotte Area",
  detailsIntro:
    "Glass & Door Pro is based in Charlotte and serves homeowners and businesses across the greater Charlotte metro and nearby South Carolina communities. Doug handles measurements, planning, and installation personally, so you work directly with the person responsible for the finished result — no matter which city you're in.",
  detailsClosing:
    "From frameless showers and replacement windows to exterior doors, window repair, and commercial glass, every project starts with a clear in-home or on-site quote. Call Doug directly to get started in your area.",
  quoteTitle: "Ready to Get Started?",
  quoteIntro:
    "Call, text, or request a free quote. Doug will review your project personally and give you clear next steps — wherever you are in the Charlotte metro.",
  quoteHours:
    "Mon–Sat: 7am – 7pm | Serving Charlotte, Monroe, Union County, and nearby South Carolina communities",
};
