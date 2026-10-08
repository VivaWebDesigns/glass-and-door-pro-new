import type { InsertCmsPage } from "./schema";

type Card = {
  icon: string;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
};
type Faq = { question: string; answer: string };

export type CityShowerPageCopy = {
  key: string;
  city: string;
  seoKeywords: string;
  projectImage: { url: string; alt: string };
  introContent: string;
  slidingDoorNote?: string;
  optionsContent: string;
  whyCards: Card[];
  areasTitle: string;
  areasContent: string;
  faqItems: Faq[];
  ctaSubheading: string;
};

const FRAMELESS_SHOWERS_LINK = "/services/frameless-showers";
const COMMERCIAL_CARD_LINK = "/services/commercial-storefront-glass-installation";

const installTimeFaq: Faq = {
  question: "How long does it take to install a glass shower door?",
  answer:
    "<p>The installation itself takes 2–4 hours. Because the glass is custom-cut, the whole process from first call to finished shower usually runs 2–3 weeks. We confirm a target install date the day we measure.</p>",
};

const framelessFaq: Faq = {
  question: "Should I choose frameless or semi-frameless?",
  answer:
    "<p>Frameless uses heavier glass with no metal edge, so it looks cleaner, is easier to clean and adds more resale value. Semi-frameless costs less and still looks modern. We install both, and Doug will give you an honest recommendation for your bathroom.</p>",
};

const lowIronFaq: Faq = {
  question: "Is low-iron glass worth it?",
  answer:
    "<p>If your shower has marble, natural stone or white tile, usually yes. Low-iron glass removes the green tint so the stone and tile show their true color. With gray or dark tile, standard glass is fine.</p>",
};

const glassThicknessHtml =
  '<h3>Glass thickness</h3><p>3/8" tempered glass is our standard and suits most CITY showers. We recommend 1/2" for panels over 36" wide, doors over 30" wide, or anyone who wants a door with a heavier, more solid feel. Both are tempered to the same safety standard.</p>';

function optionsHtml(city: string, lowIronHtml: string, hardwareHtml: string) {
  return [
    glassThicknessHtml.replace("CITY", city),
    `<h3>Clear vs. low-iron glass</h3><p>Standard glass has a slight green tint that mostly shows on the edges. Low-iron glass removes it, so marble, natural stone and white tile behind it show their true color. ${lowIronHtml}</p>`,
    `<h3>Hardware finishes</h3><p>We offer chrome, brushed nickel, matte black, oil-rubbed bronze, polished and brushed gold, and polished brass. ${hardwareHtml} Doug will help you match the hardware to your faucets and fixtures.</p>`,
    `<p><a href="${FRAMELESS_SHOWERS_LINK}">See all frameless shower door options</a></p>`,
  ].join("");
}

function areasHtml(intro: string, areas: string[], closing: string) {
  return `<p>${intro}</p><ul>${areas.map((area) => `<li>${area}</li>`).join("")}</ul><p>${closing}</p>`;
}

const waxhawCopy: CityShowerPageCopy = {
  key: "waxhaw",
  city: "Waxhaw",
  seoKeywords:
    "glass shower door installation Waxhaw NC, glass shower doors Waxhaw NC, frameless shower doors Waxhaw NC, shower door installer Waxhaw NC",
  projectImage: {
    url: "/images/glass-door-pro/gallery/frameless-showers/09.webp",
    alt: "Frameless sliding glass shower door with marble walls installed by Glass & Door Pro in Waxhaw, NC",
  },
  introContent: [
    "<p>Glass & Door Pro installs custom glass shower doors in Waxhaw, NC. Doug personally measures each opening and installs the finished door himself. There are no subcontractors and no handoffs.</p>",
    "<p>Waxhaw bathrooms tend to be built for glass. Newer homes in Cureton and Millbridge often have large primary baths, floor-to-ceiling tile and walk-in showers where a stock framed door would look out of place. Older homes near downtown Waxhaw often have showers with walls that aren't quite plumb, which an off-the-shelf door can't fit. In both cases, the glass has to be cut to that exact opening.</p>",
    "<p>Doug has installed frameless shower doors in Cureton, Millbridge and throughout Waxhaw. One recent example is a frameless sliding door set against marble walls and a patterned tile floor. Every door is measured in your bathroom and cut to fit, which is how you get even gaps, a door that swings straight and a seal that keeps water in.</p>",
  ].join(""),
  slidingDoorNote: " Our Waxhaw marble-wall project uses one.",
  optionsContent: optionsHtml(
    "Waxhaw",
    "In Waxhaw's many marble and white-tile baths, low-iron is often worth the upgrade.",
    "In Waxhaw's newer homes, brushed and polished gold have become some of the most requested finishes, with matte black close behind.",
  ),
  whyCards: [
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
  ],
  areasTitle: "Neighborhoods We Serve in and Around Waxhaw",
  areasContent: areasHtml(
    "We install glass shower doors throughout Waxhaw and southern Union County, including:",
    [
      "Cureton and Cureton West",
      "Millbridge and nearby communities",
      "Downtown Waxhaw and the historic district",
      "Providence Downs South area",
      "Neighborhoods along Waxhaw-Indian Trail Road",
      "The Waxhaw-Marvin Road corridor",
      "Communities off New Town Road and Kensington Drive",
      "The Rea Road extension and nearby neighborhoods",
    ],
    "Not seeing your neighborhood? We serve all of Waxhaw. Call (704) 771-6111 and we'll confirm.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Can you fit a shower with angled walls or an unusual layout?",
      answer:
        "<p>Yes. Angled walls, knee walls, offset drains and odd proportions are common, especially in custom Waxhaw homes. Every panel is cut to your opening, so nothing has to be forced to fit.</p>",
    },
    lowIronFaq,
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
  ],
  ctaSubheading:
    "<p>Call, text or fill out the form for a free quote. Doug will come out personally and give you a clear written estimate.</p><p><strong>Mon–Sat, 7am–7pm | Charlotte-based, serving Waxhaw and Union County</strong></p>",
};

const charlotteCopy: CityShowerPageCopy = {
  key: "charlotte",
  city: "Charlotte",
  seoKeywords:
    "glass shower door installation Charlotte NC, glass shower doors Charlotte NC, frameless shower doors Charlotte NC, shower door installer Charlotte NC",
  projectImage: {
    url: "/images/glass-door-pro/gallery/frameless-showers/01.webp",
    alt: "Frameless glass shower enclosure with marble walls and built-in bench installed by Glass & Door Pro in Myers Park, Charlotte, NC",
  },
  introContent: [
    "<p>Glass & Door Pro installs custom glass shower doors in Charlotte, NC. Doug personally measures each opening and installs the finished door himself. There are no subcontractors and no handoffs.</p>",
    "<p>We're based in South Charlotte at 6135 Park South Drive, Suite 542, Charlotte, NC 28210, and Charlotte is our home market. Frameless shower doors are our most-requested service here, especially in SouthPark, Ballantyne and Myers Park, where primary bath remodels with floor-to-ceiling tile and walk-in showers call for custom glass rather than a stock framed door.</p>",
    "<p>Charlotte's older neighborhoods bring their own challenges. Showers in historic Dilworth, Myers Park and Plaza Midwood homes often have walls that aren't plumb or square, so every panel has to be cut to the exact opening. Recent Charlotte jobs include a frameless enclosure with marble walls and a built-in bench in Myers Park, a glass enclosure beside a freestanding tub in SouthPark, a frameless shower with barn-door-style hardware in Dilworth, and a black-framed door against dark tile in Plaza Midwood.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Charlotte",
    "In the marble and natural-stone primary baths common in SouthPark and Myers Park, low-iron is often worth the upgrade.",
    "Matte black and brushed gold have been the most popular finishes in Charlotte the last couple of years, and polished brass is often the right period choice for historic Dilworth and Myers Park renovations.",
  ),
  whyCards: [
    {
      icon: "CheckCircle",
      title: "Measured On-Site, Cut to Fit",
      description:
        "No standard sizes. Every panel is cut to your shower's exact measurements, including the out-of-plumb walls common in older Charlotte homes.",
    },
    {
      icon: "UserCheck",
      title: "Owner On Every Job",
      description:
        "Doug personally measures, plans and installs every shower door. You don't get a salesperson followed by a subcontracted crew.",
    },
    {
      icon: "MapPin",
      title: "Based in South Charlotte",
      description:
        "Our office is on Park South Drive, so Charlotte is our home market. No travel fees for Charlotte addresses.",
    },
    {
      icon: "BadgeCheck",
      title: "15+ Years of Experience",
      description:
        "From single-panel walk-ins to frameless steam shower enclosures, we have the experience to do the job right.",
    },
    {
      icon: "ShieldCheck",
      title: "Honest Pricing",
      description:
        "Our overhead is lower than the larger Charlotte shops, which means competitive quotes on equivalent quality.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments",
      description:
        "Mon–Sat, 7am–7pm. Saturday availability is one of the most common reasons Charlotte clients choose us.",
    },
  ],
  areasTitle: "Charlotte Neighborhoods We Serve",
  areasContent: areasHtml(
    "We install glass shower doors throughout Charlotte and the greater metro area, including:",
    [
      "South Charlotte: SouthPark, Ballantyne, Pineville, Quail Hollow",
      "Historic neighborhoods: Myers Park, Dilworth, Eastover, Plaza Midwood",
      "East Charlotte: Cotswold, Elizabeth, Matthews-adjacent",
      "North Charlotte: NoDa, Optimist Park, Plaza Hills",
      "Uptown and South End",
      "Matthews, Mint Hill, Pineville",
      "Huntersville, Cornelius, and Davidson",
      "Concord and Harrisburg",
      "Across the SC line: Fort Mill, Indian Land, Tega Cay, Rock Hill",
    ],
    'Not seeing your neighborhood? We almost certainly cover it. Call <a href="tel:+17047716111">(704) 771-6111</a> and we\'ll let you know.',
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Can you fit a glass shower door in an older Charlotte home?",
      answer:
        "<p>Yes. Showers in historic Dilworth, Myers Park and Plaza Midwood homes often have walls that aren't plumb or square. Every panel is measured on-site and cut to the exact opening, so nothing has to be forced to fit.</p>",
    },
    lowIronFaq,
    {
      question: "What hardware finishes do you offer?",
      answer:
        "<p>Chrome, brushed nickel, matte black, oil-rubbed bronze, polished and brushed gold, and polished brass. Matte black and brushed gold have been the most popular lately, and polished brass suits historic Charlotte renovations.</p>",
    },
    {
      question: "Where is Glass & Door Pro based?",
      answer:
        "<p>Glass & Door Pro is based in South Charlotte at 6135 Park South Drive, Suite 542, Charlotte, NC 28210. Charlotte and the greater Charlotte metro are our primary service area, including South Charlotte, Ballantyne, SouthPark, Myers Park, Dilworth, Cotswold, and surrounding neighborhoods.</p>",
    },
    {
      question: "Is there a travel fee for working in Charlotte?",
      answer:
        "<p>No. Our quotes for Charlotte addresses include everything. There are no separate travel fees or service-area surcharges.</p>",
    },
    {
      question: "How quickly can you get out for a quote in Charlotte?",
      answer:
        "<p>Usually within a few business days. Saturday appointments are available, which is one of the most common reasons Charlotte homeowners choose us.</p>",
    },
  ],
  ctaSubheading:
    "<p>Call, text or fill out the form for a free in-home quote. Doug will come out personally and give you a clear written estimate.</p><p><strong>Mon–Sat, 7am–7pm | Based in South Charlotte</strong></p>",
};

const cityShowerPageCopy: Record<string, CityShowerPageCopy> = {
  "service-areas-waxhaw": waxhawCopy,
  "areas-served-charlotte-nc": charlotteCopy,
};

export function getCityShowerPageCopy(slug: string) {
  return cityShowerPageCopy[slug] ?? null;
}

function stylesCards(copy: CityShowerPageCopy): Card[] {
  return [
    {
      icon: "DoorOpen",
      title: "Frameless Hinged Doors",
      description:
        "Heavy 3/8\" or 1/2\" tempered glass held by hinges and clamps, with no metal frame. It's the cleanest look, and with no tracks there's nowhere for soap scum to collect.",
    },
    {
      icon: "Droplets",
      title: "Frameless Sliding Doors",
      description: `A good choice where a swinging door would hit a vanity or toilet.${copy.slidingDoorNote ?? ""}`,
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
      link: FRAMELESS_SHOWERS_LINK,
      buttonText: "Learn more about our frameless shower doors",
    },
  ];
}

function processCards(city: string): Card[] {
  return [
    {
      icon: "Phone",
      title: "1. Free Consultation",
      description: `Doug comes to your ${city} home, looks at your bathroom and walks you through layout, glass and hardware finishes. You get a clear written estimate during the same visit.`,
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
  ];
}

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

function linkCommercialCardToServicesHub(card: unknown) {
  if (!isRecord(card) || card.link !== COMMERCIAL_CARD_LINK) return card;
  return {
    ...card,
    title: "Commercial & Other Services",
    link: "/services",
    buttonText: "See all our services",
  };
}

/**
 * Points a location page's commercial service card at the services hub
 * instead of the storefront glass page. Returns null when nothing changes.
 */
export function linkLocationCommercialCardToServicesHub(
  content: InsertCmsPage["content"],
): InsertCmsPage["content"] | null {
  if (!isRecord(content) || !Array.isArray(content.blocks)) return null;
  let changed = false;
  const blocks = content.blocks.map((block: unknown) => {
    if (!isRecord(block) || block.type !== "cards-grid" || !isRecord(block.props)) return block;
    const props = block.props;
    if (
      typeof props.title !== "string" ||
      !/^(Our|Other) Services in /i.test(props.title.trim()) ||
      !Array.isArray(props.cards)
    ) {
      return block;
    }
    const cards = props.cards.map(linkCommercialCardToServicesHub);
    if (cards.every((card, index) => card === (props.cards as unknown[])[index])) return block;
    changed = true;
    return { ...block, props: { ...props, cards } };
  });
  return changed ? ({ ...content, blocks } as InsertCmsPage["content"]) : null;
}

/**
 * Rebuilds a location page around glass shower door installation. Existing
 * blocks (hero, Meet Doug, gallery, review, CTA) keep their ids and styling;
 * new shower sections are inserted after the intro and the general services
 * grid moves near the bottom as "Other Services in {city}".
 */
export function buildCityShowerPageContent(
  slug: string,
  content: InsertCmsPage["content"],
): InsertCmsPage["content"] {
  const copy = getCityShowerPageCopy(slug);
  if (!copy || !isRecord(content) || !Array.isArray(content.blocks)) return content;
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
    (block) => block.type === "rich-text" && /Neighborhoods/i.test(title(block)),
  );
  const gallery = blocks.find((block) => block.type === "image-grid");
  const testimonials = blocks.find((block) => block.type === "testimonials");
  const faq = blocks.find((block) => block.type === "faq");
  const cta = blocks.find((block) => block.type === "cta");

  if (!hero || !intro || !why || !services || !faq || !cta) return content;

  const galleryImages = Array.isArray(gallery?.props?.images)
    ? (gallery.props.images as unknown[]).filter(
        (image) => !isRecord(image) || image.url !== copy.projectImage.url,
      )
    : [];
  const serviceCards = Array.isArray(services.props?.cards)
    ? (services.props.cards as unknown[])
        .filter((card) => !isRecord(card) || card.link !== FRAMELESS_SHOWERS_LINK)
        .map(linkCommercialCardToServicesHub)
    : [];
  const { city, key } = copy;

  const nextBlocks = [
    hero,
    withProps(intro, {
      title: `Custom Glass Shower Doors in ${city}, NC`,
      content: copy.introContent,
    }),
    {
      id: `${key}-shower-door-styles`,
      type: "cards-grid",
      props: {
        title: `Glass Shower Door Styles We Install in ${city}`,
        subtitle: "Whatever the shape of your shower, we can enclose it in glass.",
        columns: "3",
        variant: "service-links",
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        cards: stylesCards(copy),
      },
    },
    {
      id: `${key}-shower-door-options`,
      type: "rich-text",
      props: {
        title: `Glass and Hardware Options for ${city} Homes`,
        alignment: "left",
        sectionBackgroundColor: "#ffffff",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "md",
        content: copy.optionsContent,
      },
    },
    {
      id: `${key}-shower-door-process`,
      type: "cards-grid",
      props: {
        title: "How a Glass Shower Door Install Works",
        subtitle: `Most ${city} projects take 2–3 weeks from first call to finished shower. We confirm a target install date the day we measure.`,
        columns: "4",
        variant: "service-links",
        sectionBackgroundColor: "#f8fafc",
        sectionPaddingTop: "lg",
        sectionPaddingBottom: "lg",
        cards: processCards(city),
      },
    },
    withProps(why, { cards: copy.whyCards }),
    doug,
    areas ? withProps(areas, { title: copy.areasTitle, content: copy.areasContent }) : undefined,
    gallery ? withProps(gallery, { images: [copy.projectImage, ...galleryImages] }) : undefined,
    testimonials,
    withProps(faq, { title: `Glass Shower Door FAQs — ${city}, NC`, items: copy.faqItems }),
    withProps(services, {
      title: `Other Services in ${city}`,
      subtitle: "",
      cards: serviceCards,
      columns: "2",
      sectionBackgroundColor: "#ffffff",
    }),
    withProps(cta, {
      heading: `Ready for a New Glass Shower Door in ${city}?`,
      subheading: copy.ctaSubheading,
    }),
  ].filter((block): block is Block => Boolean(block));

  return { ...content, blocks: nextBlocks } as InsertCmsPage["content"];
}
