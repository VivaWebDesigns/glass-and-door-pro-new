const root = "/images/glass-door-pro/";
const images: Record<string, [string, string]> = {
  "frameless-showers": ["services-shower.webp", "Frameless glass shower in a marble bathroom"],
  "window-installation": [
    "services-window.webp",
    "Black-framed residential windows overlooking trees",
  ],
  "door-installation": ["services-door-v2.webp", "Wood and glass entry door with stone surround"],
  "window-repair": [
    "service-cards/window-repair.webp",
    "Clear glass in white residential window frames",
  ],
  "commercial-storefront-glass-installation": [
    "service-cards/storefront-installation.webp",
    "Modern glass storefront with black aluminum framing",
  ],
  "commercial-storefront-glass-replacement-repair": [
    "service-cards/storefront-repair.webp",
    "Clear storefront glass panels in a brick facade",
  ],
  "commercial-door-installation": [
    "service-cards/commercial-door-installation.webp",
    "Commercial glass double doors with a stone surround",
  ],
  "commercial-door-replacement-repair": [
    "service-cards/commercial-door-repair.webp",
    "Commercial glass doors with metal handles and overhead closer",
  ],
  "commercial-window-replacement": [
    "service-cards/commercial-window-replacement.webp",
    "Black-framed commercial windows in a landscaped building",
  ],
};

export function getServiceImage(href?: string) {
  if (!href) return undefined;
  const path = href
    .replace(/^https?:\/\/(?:www\.)?glassanddoorpro\.com(?=\/)/, "")
    .split(/[?#]/)[0]
    .replace(/\/$/, "");
  if (path === "/services")
    return {
      src: root + "service-cards/all-services-v3.webp",
      alt: "Sunlit home entrance with a wood door, glass sidelights, and black-framed windows",
    };
  const entry = path.startsWith("/services/") ? images[path.slice(10)] : undefined;
  return entry ? { src: root + entry[0], alt: entry[1] } : undefined;
}

export const GLASS_ALL_SERVICES_CARD = {
  title: "Explore All Services",
  description:
    "Glass, windows, and doors for your home or business. Explore everything we install, replace, and repair.",
  href: "/services",
  buttonText: "View All Services",
};

export function hasGlassAllServicesCard(title: unknown, links: { url?: string }[]) {
  return (
    links.length === 4 &&
    typeof title === "string" &&
    /^Related Commercial Services$/i.test(title.trim()) &&
    links.every((link) => getServiceImage(link.url))
  );
}
