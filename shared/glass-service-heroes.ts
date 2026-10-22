// Approved hero copy and CTA order for the public service pages. The CMS seed
// and the startup CMS sync both read from here so seed and live content match.

export const GLASS_CALL_CTA_TEXT = "Call (704) 771-6111";
export const GLASS_CALL_CTA_LINK = "tel:+17047716111";

type GlassServiceHero = {
  heading?: string;
  subheading: string;
  quoteText: string;
};

export const GLASS_SERVICE_HEROES: Record<string, GlassServiceHero> = {
  "services-frameless-showers": {
    heading: "Frameless Shower Doors",
    subheading:
      "Custom glass shower doors and enclosures, measured and installed to fit your bathroom.",
    quoteText: "Get a Free Quote",
  },
  "services-window-installation": {
    heading: "Window Installation & Replacement",
    subheading:
      "New and replacement windows fitted for single rooms, whole-home upgrades, and everything in between.",
    quoteText: "Get a Free Quote",
  },
  "services-door-installation": {
    heading: "Door Installation",
    subheading:
      "Entry, patio, and storm doors installed for a secure fit and reliable weather protection.",
    quoteText: "Get a Free Quote",
  },
  "services-window-repair": {
    heading: "Window Repair",
    subheading:
      "Repair foggy glass, cracked panes, broken seals, and stuck sashes—often without replacing the whole window.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-storefront-glass-installation": {
    heading: "Storefront Glass Installation",
    subheading:
      "Aluminum framing, glass panels, and storefront doors installed for new construction, buildouts, and renovations.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-storefront-glass-replacement-repair": {
    heading: "Storefront Glass Replacement & Repair",
    subheading:
      "Board-up and glass replacement to secure your storefront and restore damaged windows and doors.",
    quoteText: "Request a Quote",
  },
  "services-commercial-door-installation": {
    heading: "Commercial Door Installation",
    subheading:
      "Aluminum and glass entrance systems installed for new construction, business renovations, and tenant buildouts.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-door-replacement-repair": {
    heading: "Commercial Door Replacement & Repair",
    subheading:
      "Repair or replace damaged glass, worn hardware, and misaligned doors to keep your entrance secure and working properly.",
    quoteText: "Request a Quote",
  },
  "services-commercial-window-replacement": {
    heading: "Apartment & Multi-Family Window Replacement",
    subheading:
      "Window replacement for apartment and multi-family projects, including damaged units and construction setbacks.",
    quoteText: "Request a Quote",
  },
};

// Call is the primary hero button; the quote form is secondary.
export function getGlassServiceHeroCtaProps(quoteText: string) {
  return {
    ctaText: GLASS_CALL_CTA_TEXT,
    ctaAction: "custom-link",
    ctaLink: GLASS_CALL_CTA_LINK,
    ctaSecondaryText: quoteText,
    ctaSecondaryAction: "form-modal",
    ctaSecondaryLink: "",
    ctaSecondaryFormSlug: "contact-form",
    ctaSecondaryModalTitle: "Get a Free Quote",
    ctaSecondaryModalDescription:
      "Tell us a little about your project and Doug will follow up with next steps.",
  };
}
