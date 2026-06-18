import { createBlock, type BlockInstance } from "./block-registry";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "starter" | "marketing" | "content";
  blockCount: number;
  blocks: () => BlockInstance[];
}

function block(type: string, overrides?: Record<string, unknown>): BlockInstance {
  const nextBlock = createBlock(type);
  if (overrides) {
    nextBlock.props = { ...nextBlock.props, ...overrides };
  }
  return nextBlock;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty canvas",
    icon: "FileText",
    category: "starter",
    blockCount: 0,
    blocks: () => [],
  },
  {
    id: "glass-service-landing",
    name: "Glass Service Landing",
    description: "Simple Glass & Door Pro service page starter with hero, benefits, FAQ, and CTA",
    icon: "Sparkles",
    category: "marketing",
    blockCount: 6,
    blocks: () => [
      block("hero", {
        heading: "Glass & Door Services in the Charlotte Area",
        subheading: "Residential and commercial glass, window, door, shower, and storefront services from Glass & Door Pro.",
        ctaText: "Get a Free Quote",
        ctaLink: "/#contact",
        ctaSecondaryText: "Call (704) 771-6111",
        ctaSecondaryLink: "tel:+17047716111",
        minHeight: "520",
      }),
      block("trust-bar", {
        items: [
          { icon: "UserCheck", label: "Owner-operated" },
          { icon: "MapPin", label: "Charlotte metro area" },
          { icon: "Ruler", label: "Measured carefully" },
        ],
      }),
      block("cards-grid", {
        title: "What We Help With",
        columns: "3",
        cards: [
          { icon: "Droplets", title: "Frameless Showers", description: "Custom shower glass measured and installed for the opening." },
          { icon: "Grid3X3", title: "Windows & Doors", description: "Residential installation and repair with clean finish details." },
          { icon: "Building2", title: "Commercial Glass", description: "Storefront glass, commercial doors, and facility glass replacement." },
        ],
      }),
      block("rich-text", {
        content:
          "<p>Use this section to describe the service, the types of projects you handle, and the areas you serve. Keep the copy specific to Glass & Door Pro and the Charlotte metro area.</p>",
      }),
      block("faq", {
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What areas do you serve?",
            answer: "Glass & Door Pro serves Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby communities.",
          },
          {
            question: "Can I request a quote online?",
            answer: "Yes. Use the contact form or call (704) 771-6111 to describe your project and request an estimate.",
          },
        ],
      }),
      block("cta", {
        heading: "Ready to Talk Through Your Project?",
        subheading: "Send the project details and Glass & Door Pro will follow up with next steps.",
        primaryText: "Get a Free Quote",
        primaryLink: "/#contact",
        variant: "dark",
      }),
    ],
  },
];

export interface LandingPageGoal {
  id: string;
  label: string;
  description: string;
}

export const LANDING_PAGE_GOALS: LandingPageGoal[] = [
  { id: "quote-request", label: "Get quote requests", description: "Encourage visitors to contact Glass & Door Pro" },
  { id: "service-detail", label: "Explain a service", description: "Describe a specific residential or commercial service" },
  { id: "general", label: "General landing page", description: "Flexible page for a service, offer, or campaign" },
];

export interface AudienceOption {
  id: string;
  label: string;
}

export const AUDIENCE_OPTIONS: AudienceOption[] = [
  { id: "homeowners", label: "Homeowners" },
  { id: "businesses", label: "Businesses" },
  { id: "property-managers", label: "Property Managers" },
  { id: "general", label: "General Audience" },
];

export interface WizardBlockOption {
  id: string;
  type: string;
  label: string;
  description: string;
  recommended: boolean;
}

export function getRecommendedBlocks(goalId: string): WizardBlockOption[] {
  const all: WizardBlockOption[] = [
    { id: "hero", type: "hero", label: "Hero Section", description: "Full-width hero with heading and CTA buttons", recommended: true },
    { id: "trust-bar", type: "trust-bar", label: "Trust Bar", description: "Row of trust signals", recommended: false },
    { id: "features", type: "cards-grid", label: "Service Cards", description: "Icon + text cards", recommended: false },
    { id: "details", type: "rich-text", label: "Service Details", description: "Long-form supporting copy", recommended: false },
    { id: "faq", type: "faq", label: "FAQ", description: "Frequently asked questions", recommended: false },
    { id: "cta", type: "cta", label: "Call to Action", description: "Quote request CTA section", recommended: true },
  ];

  const goalRecommendations: Record<string, string[]> = {
    "quote-request": ["hero", "trust-bar", "features", "cta"],
    "service-detail": ["hero", "details", "features", "faq", "cta"],
    general: ["hero", "features", "cta"],
  };

  const recommended = goalRecommendations[goalId] ?? goalRecommendations.general;
  return all.map((item) => ({ ...item, recommended: recommended!.includes(item.id) }));
}

const AUDIENCE_LABELS: Record<string, string> = {
  homeowners: "homeowners",
  businesses: "businesses",
  "property-managers": "property managers",
  general: "customers",
};

function buildAudienceSubheading(audiences: string[], fallback: string): string {
  if (!audiences.length) return fallback;
  const labels = audiences.map((audience) => AUDIENCE_LABELS[audience] ?? audience);
  if (labels.length === 1) return `Built for ${labels[0]} in the Charlotte metro area.`;
  const last = labels.pop();
  return `Built for ${labels.join(", ")} and ${last} in the Charlotte metro area.`;
}

export function generateLandingPageBlocks(
  goalId: string,
  headline: string,
  subheadline: string,
  audiences: string[],
  selectedBlockIds: string[],
  ctaText: string,
  ctaLink: string,
): BlockInstance[] {
  const blockOptions = getRecommendedBlocks(goalId);
  const blocks: BlockInstance[] = [];
  const audienceDescription = buildAudienceSubheading(audiences, "");

  for (const id of selectedBlockIds) {
    const option = blockOptions.find((item) => item.id === id);
    if (!option) continue;

    if (option.type === "hero") {
      blocks.push(block("hero", {
        heading: headline || "Glass & Door Services in the Charlotte Area",
        subheading: subheadline || audienceDescription || "Tell Glass & Door Pro about your glass, window, door, shower, or commercial project.",
        ctaText: ctaText || "Get a Free Quote",
        ctaLink: ctaLink || "/#contact",
        ctaSecondaryText: "",
        ctaSecondaryLink: "",
        minHeight: "520",
      }));
    } else if (option.type === "cta") {
      blocks.push(block("cta", {
        heading: "Ready to Get Started?",
        subheading: subheadline || audienceDescription || "Send the project details and Glass & Door Pro will follow up with next steps.",
        primaryText: ctaText || "Get a Free Quote",
        primaryLink: ctaLink || "/#contact",
        variant: "dark",
      }));
    } else {
      blocks.push(block(option.type));
    }
  }

  return blocks;
}
