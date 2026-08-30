export const GLASS_PRIMARY_SERVICE_AREAS = [
  { label: "Charlotte", href: "/service-areas/charlotte" },
  { label: "Pineville", href: "/service-areas/pineville" },
  { label: "Matthews", href: "/service-areas/matthews" },
  { label: "Weddington", href: "/service-areas/weddington" },
  { label: "Indian Trail", href: "/service-areas/indian-trail" },
  { label: "Wesley Chapel", href: "/service-areas/wesley-chapel" },
  { label: "Stallings", href: "/service-areas/stallings" },
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
