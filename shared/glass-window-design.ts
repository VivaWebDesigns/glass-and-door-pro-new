export const WINDOW_INSTALLATION_STEPS = [
  {
    icon: "Ruler",
    title: "In-Home Measurement",
    description:
      "Doug measures every opening on-site before ordering. Accurate measurements help prevent gaps, air leaks, and callbacks.",
  },
  {
    icon: "CheckCircle",
    title: "Window Sourcing & Selection",
    description:
      "The right window for your home's style, ventilation needs, and budget — without unnecessary upselling.",
  },
  {
    icon: "Wrench",
    title: "Old Window Removal",
    description:
      "Old windows are carefully removed and disposed of. We inspect the opening and frame before installing replacements.",
  },
  {
    icon: "BadgeCheck",
    title: "Professional Installation",
    description:
      "Each window is set level, plumb, and square, with proper flashing, sealant, and neatly finished trim.",
  },
  {
    icon: "ShieldCheck",
    title: "Energy Efficiency Upgrades",
    description:
      "Double-pane insulated glass comes standard, helping improve comfort when replacing single-pane windows.",
  },
  {
    icon: "Sparkles",
    title: "Cleanup & Walkthrough",
    description:
      "We leave the site clean and walk through every window with you. If something isn't right, we fix it before leaving.",
  },
];

export const WINDOW_TYPES = [
  {
    title: "Double-Hung Windows",
    image: "double-hung",
    description:
      "Both sashes move up and down for easy cleaning and ventilation. A versatile choice for most rooms.",
  },
  {
    title: "Casement Windows",
    image: "casement",
    description:
      "Side-hinged windows open with a crank, providing airflow and a tight seal when closed.",
  },
  {
    title: "Sliding Windows",
    image: "sliding",
    description:
      "One sash slides horizontally past the other. A clean, low-profile choice for wider openings.",
  },
  {
    title: "Picture Windows",
    image: "picture",
    description:
      "Fixed windows that frame the view and let in light. Often paired with windows that open.",
  },
  {
    title: "Bay & Bow Windows",
    image: "bay",
    description:
      "Windows that project outward, creating more dimension and a shelf or seating area inside.",
  },
  {
    title: "Awning Windows",
    image: "awning",
    description:
      "Hinged at the top and opening outward from the bottom. A useful choice for basements.",
  },
].map(({ image, ...card }) => ({
  ...card,
  imageUrl: `/images/glass-door-pro/window-types/${image}.webp`,
}));

export const WINDOW_TRUST_REASONS = [
  {
    icon: "UserCheck",
    title: "Owner Does the Work",
    description: "Doug handles your project personally — measurement, sourcing, and installation.",
  },
  {
    icon: "BadgeCheck",
    title: "Honest, Itemized Quotes",
    description:
      "A clear written quote before work begins. No surprise charges or pressure to upgrade.",
  },
  {
    icon: "CheckCircle",
    title: "Correct Fit, Every Time",
    description: "We take our own measurements and inspect the opening before installation.",
  },
  {
    icon: "CalendarDays",
    title: "Saturday Appointments Available",
    description: "Mon–Sat, 7am–7pm. Make time for your project without taking a weekday off.",
  },
  {
    icon: "MapPin",
    title: "Local, Not a Franchise",
    description: "Charlotte-based and owner-operated. When you call, Doug answers.",
  },
];

export const WINDOW_DESIGN_SECTIONS = [
  {
    legacyTitle: "What's Included in Our Window Installation Service",
    props: {
      variant: "window-installation-steps",
      title: "Window installation, handled from start to finish.",
      eyebrow: "Our window installation service",
      subtitle:
        "From accurate measurements to a clean final walkthrough, we handle every step so your new windows fit, perform, and look great.",
      imageUrl: "/images/glass-door-pro/window-repair-living-1280w.webp",
      imageAlt: "Bright living room with large windows overlooking the garden",
      cards: WINDOW_INSTALLATION_STEPS,
    },
  },
  {
    legacyTitle: "Window Types We Install",
    props: {
      variant: "window-type-catalog",
      title: "Find your window style.",
      eyebrow: "Popular window styles",
      subtitle:
        "Not every window works in every opening. Here are the types we regularly install and replace.",
      cards: WINDOW_TYPES,
    },
  },
  {
    legacyTitle: "Why Charlotte Homeowners Choose Glass & Door Pro for Window Installation",
    props: {
      variant: "window-trust-band",
      title: "Why Charlotte homeowners choose Glass & Door Pro",
      experienceValue: "15+",
      experienceTitle: "Years of Experience",
      experienceDescription:
        "Doug has been installing windows in the Charlotte metro area for over 15 years — with hands-on experience in all kinds of openings.",
      cards: WINDOW_TRUST_REASONS,
    },
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Refresh only the approved window sections once; future CMS edits stay authoritative.
export function applyWindowDesign(slug: string, content: unknown) {
  if (
    slug !== "services-window-installation" ||
    !isRecord(content) ||
    !Array.isArray(content.blocks)
  )
    return null;
  const meta = isRecord(content._system) ? content._system : {};
  if (meta.windowFieldGuide2026 === true) return null;
  let changed = false;
  const blocks = content.blocks.map((block: unknown) => {
    if (!isRecord(block) || !isRecord(block.props)) return block;
    const title = String(block.props.title ?? "").replace(/’/g, "'");
    const section = WINDOW_DESIGN_SECTIONS.find((item) => item.legacyTitle === title);
    if (!section || !["cards-grid", "rich-text"].includes(String(block.type))) return block;
    changed = true;
    return {
      ...block,
      type: "cards-grid",
      props: {
        ...block.props,
        ...section.props,
        sectionHeadingAlignment: "left",
        sectionBackgroundColor: "#ffffff",
      },
    };
  });
  return changed ? { ...content, blocks, _system: { ...meta, windowFieldGuide2026: true } } : null;
}
