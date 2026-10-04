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
    heading: "Frameless Glass Shower Doors in Charlotte, NC",
    subheading:
      "Custom frameless shower doors and enclosures for bathroom remodels and upgrades across the Charlotte area. Measured and installed personally by Doug — no subcontractors.",
    quoteText: "Get a Free Quote",
  },
  "services-window-installation": {
    subheading:
      "Replacement windows for single openings, full rooms, and whole-home upgrades across the Charlotte area. Measured, fitted, and installed personally by Doug — the same person who gives you the quote.",
    quoteText: "Get a Free Quote",
  },
  "services-door-installation": {
    subheading:
      "Entry, patio, and storm doors installed level, plumb, and weather-tight across the Charlotte area. Doug handles every door personally, from measurement through installation.",
    quoteText: "Get a Free Quote",
  },
  "services-window-repair": {
    subheading:
      "Foggy glass, broken seals, cracked panes, and stuck sashes repaired across the Charlotte area — often without replacing the whole window. Doug gives you a straight answer on repair versus replacement.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-storefront-glass-installation": {
    subheading:
      "Aluminum storefront framing, fixed glass panels, and storefront doors installed for new construction, tenant buildouts, and renovations across Charlotte. One point of contact from quote through completion.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-storefront-glass-replacement-repair": {
    subheading:
      "Broken storefront glass boarded up, secured, and permanently replaced for Charlotte businesses — whether it's vandalism, an accident, or a failed panel. One call handles the whole job.",
    quoteText: "Request a Quote",
  },
  "services-commercial-door-installation": {
    subheading:
      "Aluminum entry doors, glass storefront doors, and commercial entrance systems installed for new construction, tenant buildouts, and business renovations across Charlotte. Direct contact with the person doing the work — from scope through installation.",
    quoteText: "Get a Free Quote",
  },
  "services-commercial-door-replacement-repair": {
    subheading:
      "Broken glass, failed hardware, misaligned frames, and doors that won't close or lock — repaired or replaced fast for Charlotte businesses. Honest assessments and same-week scheduling.",
    quoteText: "Request a Quote",
  },
  "services-commercial-window-replacement": {
    subheading:
      "Window replacement for apartment and multi-family projects across Charlotte — wrong windows ordered, units damaged mid-construction, or a deadline that can't move. Doug mobilizes fast and handles each project personally.",
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
