import type { InsertCmsPage } from "./schema";

export const WAXHAW_SHOWER_PAGE_SLUG = "service-areas-waxhaw";

export const WAXHAW_SHOWER_SEO_KEYWORDS =
  "glass shower door installation Waxhaw NC, glass shower doors Waxhaw NC, frameless shower doors Waxhaw NC, shower door installer Waxhaw NC";

const WAXHAW_PROJECT_IMAGE = {
  url: "/images/glass-door-pro/gallery/frameless-showers/09.webp",
  alt: "Frameless sliding glass shower door with marble walls installed by Glass & Door Pro in Waxhaw, NC",
};

const introTitle = "Custom Glass Shower Doors in Waxhaw, NC";
const introContent = [
  "<p>Glass & Door Pro installs custom glass shower doors in Waxhaw, NC. Doug personally measures each opening and installs the finished door himself. There are no subcontractors and no handoffs.</p>",
  "<p>Waxhaw bathrooms tend to be built for glass. Newer homes in Cureton and Millbridge often have large primary baths, floor-to-ceiling tile and walk-in showers where a stock framed door would look out of place. Older homes near downtown Waxhaw often have showers with walls that aren't quite plumb, which an off-the-shelf door can't fit. In both cases, the glass has to be cut to that exact opening.</p>",
  "<p>Doug has installed frameless shower doors in Cureton, Millbridge and throughout Waxhaw. One recent example is a frameless sliding door set against marble walls and a patterned tile floor. Every door is measured in your bathroom and cut to fit, which is how you get even gaps, a door that swings straight and a seal that keeps water in.</p>",
].join("");

const stylesBlock = {
  id: "waxhaw-shower-door-styles",
  type: "cards-grid",
  props: {
    title: "Glass Shower Door Styles We Install in Waxhaw",
    subtitle: "Whatever the shape of your shower, we can enclose it in glass.",
    columns: "3",
    variant: "service-links",
    sectionBackgroundColor: "#f8fafc",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
    cards: [
      {
        icon: "DoorOpen",
        title: "Frameless Hinged Doors",
        description:
          "Heavy 3/8\" or 1/2\" tempered glass held by hinges and clamps, with no metal frame. It's the cleanest look, and with no tracks there's nowhere for soap scum to collect.",
      },
      {
        icon: "Droplets",
        title: "Frameless Sliding Doors",
        description:
          "A good choice where a swinging door would hit a vanity or toilet. Our Waxhaw marble-wall project uses one.",
      },
      {
        icon: "ShieldCheck",
        title: "Semi-Frameless Doors",
        description:
          'A thin metal channel on the door edge only, with lighter 3/16" or 1/4" glass. It costs less and still looks modern.',
      },
      {
        icon: "Grid3X3",
        title: "In-Line Enclosures",
        description:
          "A door and a fixed panel in a straight line. This is the most common layout in alcove showers.",
      },
      {
        icon: "CheckCircle",
        title: "Corner & Neo-Angle Enclosures",
        description: "For corner showers with square or angled fronts.",
      },
      {
        icon: "Star",
        title: "Steam Showers, Walk-Ins & Splash Panels",
        description:
          "Sealed steam enclosures with a transom panel above the door, single fixed walk-in panels, and tub splash panels that replace a shower curtain.",
        link: "/services/frameless-showers",
        buttonText: "Learn more about our frameless shower doors",
      },
    ],
  },
};

const optionsBlock = {
  id: "waxhaw-shower-door-options",
  type: "rich-text",
  props: {
    title: "Glass and Hardware Options for Waxhaw Homes",
    alignment: "left",
    sectionBackgroundColor: "#ffffff",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "md",
    content: [
      "<h3>Glass thickness</h3>",
      '<p>3/8" tempered glass is our standard and suits most Waxhaw showers. We recommend 1/2" for panels over 36" wide, doors over 30" wide, or anyone who wants a door with a heavier, more solid feel. Both are tempered to the same safety standard.</p>',
      "<h3>Clear vs. low-iron glass</h3>",
      "<p>Standard glass has a slight green tint that mostly shows on the edges. Low-iron glass removes it, so marble, natural stone and white tile behind it show their true color. In Waxhaw's many marble and white-tile baths, low-iron is often worth the upgrade.</p>",
      "<h3>Hardware finishes</h3>",
      "<p>We offer chrome, brushed nickel, matte black, oil-rubbed bronze, polished and brushed gold, and polished brass. In Waxhaw's newer homes, brushed and polished gold have become some of the most requested finishes, with matte black close behind. Doug will help you match the hardware to your faucets and fixtures.</p>",
      '<p><a href="/services/frameless-showers">See all frameless shower door options</a></p>',
    ].join(""),
  },
};

const processBlock = {
  id: "waxhaw-shower-door-process",
  type: "cards-grid",
  props: {
    title: "How a Glass Shower Door Install Works",
    subtitle:
      "Most Waxhaw projects take 2–3 weeks from first call to finished shower. We confirm a target install date the day we measure.",
    columns: "4",
    variant: "service-links",
    sectionBackgroundColor: "#f8fafc",
    sectionPaddingTop: "lg",
    sectionPaddingBottom: "lg",
    cards: [
      {
        icon: "Phone",
        title: "1. Free Consultation",
        description:
          "Doug comes to your Waxhaw home, looks at your bathroom and walks you through layout, glass and hardware finishes. You get a clear written estimate during the same visit.",
      },
      {
        icon: "Search",
        title: "2. Final Measurement",
        description:
          "Once you approve and the tile and plumbing rough-in are done, Doug takes exact measurements.",
      },
      {
        icon: "ShieldCheck",
        title: "3. Fabrication",
        description:
          "Your glass is cut to those measurements and the edges are polished, usually in 1–2 weeks.",
      },
      {
        icon: "Wrench",
        title: "4. Installation",
        description:
          "Doug installs the door himself in 2–4 hours, checks the alignment and seals it, then shows you how to care for it.",
      },
    ],
  },
};

const whyCards = [
  {
    icon: "CheckCircle",
    title: "Measured On-Site, Cut to Fit",
    description:
      "No standard sizes. Every panel is cut to your shower's exact measurements, including out-of-plumb walls, knee walls and angled fronts.",
  },
  {
    icon: "UserCheck",
    title: "One Installer, Start to Finish",
    description: "The person who quotes your shower door is the person who installs it.",
  },
  {
    icon: "BadgeCheck",
    title: "Attention to Detail",
    description:
      "Waxhaw homes are finished carefully. We match that with straight hinges, even gaps and clean caulk lines.",
  },
  {
    icon: "Star",
    title: "Hardware That Matches Your Home",
    description:
      "Every common finish, matched to your faucets and fixtures rather than whatever is in stock.",
  },
  {
    icon: "MapPin",
    title: "Charlotte-Based, No Travel Fees",
    description:
      "Waxhaw is a regular part of our weekly schedule, not an occasional out-of-area trip.",
  },
  {
    icon: "CalendarDays",
    title: "Saturday Appointments Are Standard",
    description:
      "We work Monday–Saturday, 7am–7pm, for Waxhaw homeowners who can't do weekday appointments.",
  },
];

const areasTitle = "Neighborhoods We Serve in and Around Waxhaw";
const areasContent = `<p>We install glass shower doors throughout Waxhaw and southern Union County, including:</p><ul>${[
  "Cureton and Cureton West",
  "Millbridge and nearby communities",
  "Downtown Waxhaw and the historic district",
  "Providence Downs South area",
  "Neighborhoods along Waxhaw-Indian Trail Road",
  "The Waxhaw-Marvin Road corridor",
  "Communities off New Town Road and Kensington Drive",
  "The Rea Road extension and nearby neighborhoods",
]
  .map((area) => `<li>${area}</li>`)
  .join(
    "",
  )}</ul><p>Not seeing your neighborhood? We serve all of Waxhaw. Call (704) 771-6111 and we'll confirm.</p>`;

const faqTitle = "Glass Shower Door FAQs — Waxhaw, NC";
const faqItems = [
  {
    question: "How long does it take to install a glass shower door?",
    answer:
      "<p>The installation itself takes 2–4 hours. Because the glass is custom-cut, the whole process from first call to finished shower usually runs 2–3 weeks. We confirm a target install date the day we measure.</p>",
  },
  {
    question: "Should I choose frameless or semi-frameless?",
    answer:
      "<p>Frameless uses heavier glass with no metal edge, so it looks cleaner, is easier to clean and adds more resale value. Semi-frameless costs less and still looks modern. We install both, and Doug will give you an honest recommendation for your bathroom.</p>",
  },
  {
    question: "Can you fit a shower with angled walls or an unusual layout?",
    answer:
      "<p>Yes. Angled walls, knee walls, offset drains and odd proportions are common, especially in custom Waxhaw homes. Every panel is cut to your opening, so nothing has to be forced to fit.</p>",
  },
  {
    question: "Is low-iron glass worth it?",
    answer:
      "<p>If your shower has marble, natural stone or white tile, usually yes. Low-iron glass removes the green tint so the stone and tile show their true color. With gray or dark tile, standard glass is fine.</p>",
  },
  {
    question: "How do I keep my glass shower door clean?",
    answer:
      "<p>Squeegee it after each shower; that alone prevents most hard-water spots. Clean weekly with a non-abrasive glass cleaner. You can also order a factory-applied water-repellent coating when the glass is made.</p>",
  },
  {
    question: "Do you work in Waxhaw regularly?",
    answer:
      "<p>Yes. Waxhaw is one of our most consistent service areas, with jobs in Cureton, Millbridge and throughout town. There are no travel fees and no minimum project size.</p>",
  },
];

const otherServicesTitle = "Other Services in Waxhaw";
const ctaHeading = "Ready for a New Glass Shower Door in Waxhaw?";
const ctaSubheading =
  "<p>Call, text or fill out the form for a free quote. Doug will come out personally and give you a clear written estimate.</p><p><strong>Mon–Sat, 7am–7pm | Charlotte-based, serving Waxhaw and Union County</strong></p>";

type Block = { id?: unknown; type?: unknown; props?: Record<string, unknown> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function title(block: Block) {
  return typeof block.props?.title === "string" ? block.props.title.trim() : "";
}

function withProps(block: Block, props: Record<string, unknown>): Block {
  return { ...block, props: { ...block.props, ...props } };
}

/**
 * Rebuilds the Waxhaw location page around glass shower door installation.
 * Existing blocks (hero, Meet Doug, gallery, review, CTA) keep their ids and
 * styling; new shower sections are inserted after the intro and the general
 * services grid moves near the bottom as "Other Services in Waxhaw".
 */
export function buildWaxhawShowerPageContent(
  content: InsertCmsPage["content"],
): InsertCmsPage["content"] {
  if (!isRecord(content) || !Array.isArray(content.blocks)) return content;
  const blocks = content.blocks.filter(isRecord) as Block[];

  const hero = blocks.find((block) => block.type === "hero");
  const intro = blocks.find((block) => block.type === "rich-text");
  const why = blocks.find(
    (block) => block.type === "cards-grid" && /^Why .+ Choose Glass/i.test(title(block)),
  );
  const services = blocks.find(
    (block) => block.type === "cards-grid" && /^(Our|Other) Services in /i.test(title(block)),
  );
  const doug = blocks.find((block) => block.type === "text-image");
  const areas = blocks.find(
    (block) => block.type === "rich-text" && /^Neighborhoods/i.test(title(block)),
  );
  const gallery = blocks.find((block) => block.type === "image-grid");
  const testimonials = blocks.find((block) => block.type === "testimonials");
  const faq = blocks.find((block) => block.type === "faq");
  const cta = blocks.find((block) => block.type === "cta");

  if (!hero || !intro || !why || !services || !faq || !cta) return content;

  const galleryImages = Array.isArray(gallery?.props?.images)
    ? (gallery.props.images as unknown[]).filter(
        (image) => !isRecord(image) || image.url !== WAXHAW_PROJECT_IMAGE.url,
      )
    : [];
  const serviceCards = Array.isArray(services.props?.cards)
    ? (services.props.cards as unknown[]).filter(
        (card) => !isRecord(card) || card.link !== "/services/frameless-showers",
      )
    : [];

  const nextBlocks = [
    hero,
    withProps(intro, { title: introTitle, content: introContent }),
    stylesBlock,
    optionsBlock,
    processBlock,
    withProps(why, { cards: whyCards }),
    doug,
    areas ? withProps(areas, { title: areasTitle, content: areasContent }) : undefined,
    gallery ? withProps(gallery, { images: [WAXHAW_PROJECT_IMAGE, ...galleryImages] }) : undefined,
    testimonials,
    withProps(faq, { title: faqTitle, items: faqItems }),
    withProps(services, {
      title: otherServicesTitle,
      cards: serviceCards,
      columns: "2",
      sectionBackgroundColor: "#ffffff",
    }),
    withProps(cta, { heading: ctaHeading, subheading: ctaSubheading }),
  ].filter((block): block is Block => Boolean(block));

  return { ...content, blocks: nextBlocks } as InsertCmsPage["content"];
}
