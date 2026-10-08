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
  state?: "NC" | "SC";
  seoKeywords: string;
  /** A gallery job actually done in this city; leads the intro when set. */
  projectImage?: { url: string; alt: string };
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

const cleaningFaq: Faq = {
  question: "How do I keep my glass shower door clean?",
  answer:
    "<p>Squeegee it after each shower; that alone prevents most hard-water spots. Clean weekly with a non-abrasive glass cleaner. You can also order a factory-applied water-repellent coating when the glass is made.</p>",
};

const thicknessFaq: Faq = {
  question: 'Do I need 3/8" or 1/2" glass?',
  answer:
    '<p>3/8" tempered glass is right for most showers. We recommend 1/2" for panels over 36" wide, doors over 30" wide, or anyone who wants a heavier, more substantial door.</p>',
};

const HARDWARE_FINISHES =
  "chrome, brushed nickel, matte black, oil-rubbed bronze, polished and brushed gold, and polished brass";

const POPULAR_FINISHES_HTML =
  "Matte black and brushed gold have been the most popular finishes the last couple of years.";

function introOpener(city: string, state = "NC") {
  return `<p>Glass & Door Pro installs custom glass shower doors in ${city}, ${state}. Doug personally measures each opening and installs the finished door himself. There are no subcontractors and no handoffs.</p>`;
}

function ctaHtml(footer: string) {
  return `<p>Call, text or fill out the form for a free quote. Doug will come out personally and give you a clear written estimate.</p><p><strong>Mon–Sat, 7am–7pm | ${footer}</strong></p>`;
}

function measuredCard(detail: string): Card {
  return {
    icon: "CheckCircle",
    title: "Measured On-Site, Cut to Fit",
    description: `No standard sizes. Every panel is cut to your shower's exact measurements, ${detail}`,
  };
}

function hardwareCard(): Card {
  return {
    icon: "Star",
    title: "Hardware That Matches Your Home",
    description:
      "Every common finish, matched to your faucets and fixtures rather than whatever is in stock.",
  };
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

function keywords(place: string) {
  return `glass shower door installation ${place}, glass shower doors ${place}, frameless shower doors ${place}, shower door installer ${place}`;
}

const monroeCopy: CityShowerPageCopy = {
  key: "monroe",
  city: "Monroe",
  seoKeywords: keywords("Monroe NC"),
  projectImage: {
    url: "/images/glass-door-pro/gallery-shower2-1280w.webp",
    alt: "Modern frameless shower door with gold hardware installed by Glass & Door Pro in Monroe, NC",
  },
  introContent: [
    introOpener("Monroe"),
    "<p>Monroe homes cover every era, and so do their showers. Newer subdivisions off Highway 74 and around the Monroe Bypass often have primary baths with tiled walk-in showers that are ready for frameless glass. Historic homes downtown and around the Belk Heritage District tend to have older showers where the walls aren't quite plumb or square. Either way, the glass has to be cut to that exact opening.</p>",
    "<p>Frameless shower doors are especially popular in newer Monroe construction and in primary bath remodels. One recent Monroe job is a modern frameless shower door with gold hardware. Monroe is a regular part of our Union County schedule from our Charlotte home base, with no travel fees, and same-week and Saturday appointments are often available.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Monroe",
    "If your Monroe primary bath has marble or white tile, low-iron is often worth the upgrade.",
    `${POPULAR_FINISHES_HTML} Our recent Monroe job used gold hardware.`,
  ),
  whyCards: [
    measuredCard("including the out-of-plumb walls common in older Monroe homes."),
    {
      icon: "UserCheck",
      title: "Owner-Operator",
      description:
        "Doug measures, plans and installs every shower door personally. You won't get a sales rep followed by a subcontracted crew.",
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, Serving Monroe",
      description:
        "Monroe is a regular part of our Union County service area, with no travel surcharges.",
    },
    {
      icon: "BadgeCheck",
      title: "15+ Years of Experience",
      description:
        "From single-panel walk-ins to frameless steam shower enclosures, Doug has the experience to do the job right.",
    },
    {
      icon: "ShieldCheck",
      title: "Free, Clear Quotes",
      description:
        "We come out to your home, look at the shower and leave you with a clear written quote the same visit.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments",
      description:
        "We work Monday through Saturday, 7am to 7pm. Saturday quotes and installs are common.",
    },
  ],
  areasTitle: "Neighborhoods We Serve In & Around Monroe",
  areasContent: areasHtml(
    "We install glass shower doors throughout Monroe and the surrounding Union County communities, including:",
    [
      "Downtown Monroe and the historic district",
      "Belk Heritage District",
      "The neighborhoods around Sun Valley High School",
      "Subdivisions along Highway 74 and Highway 200",
      "The growing developments off the Monroe Bypass",
      "Indian Trail and Stallings",
      "Waxhaw and Weddington",
      "Wesley Chapel and Marvin",
      "Lake Park, Mineral Springs, and Unionville",
    ],
    'Not seeing your area listed? We almost certainly cover it. Call <a href="tel:+17047716111">(704) 771-6111</a> and we\'ll let you know.',
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Do you install shower doors in older Monroe homes, or just new construction?",
      answer:
        "<p>Both. We work in historic homes downtown and around the Belk Heritage District, mid-century homes on the south side, and new construction around the bypass. Older homes often have walls that aren't plumb, so every panel is measured on-site and cut to fit.</p>",
    },
    {
      question: "How quickly can you get out for a quote in Monroe?",
      answer:
        "<p>For Monroe addresses, we can usually get out for a free in-home quote within a few business days, and same-week appointments are common. Saturday appointments are available too.</p>",
    },
    {
      question: "Do you serve all of Union County or just Monroe city limits?",
      answer:
        "<p>All of Union County. We regularly work in Monroe, Indian Trail, Stallings, Waxhaw, Weddington, Wesley Chapel, Marvin, Lake Park, Mineral Springs and Unionville.</p>",
    },
    lowIronFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Monroe and Union County"),
};

const indianTrailCopy: CityShowerPageCopy = {
  key: "indian-trail",
  city: "Indian Trail",
  seoKeywords: keywords("Indian Trail NC"),
  introContent: [
    introOpener("Indian Trail"),
    "<p>Indian Trail has a lot of homes from the late 1990s and early 2000s, and many still have their original framed shower doors. Replacing them with frameless glass is the most common call we get here, usually as the finishing piece of a primary bath remodel. In newer Indian Trail homes, owners are often swapping the builder's standard shower door for custom glass.</p>",
    "<p>Indian Trail is one of our most consistent Union County service areas, and we work throughout town, from Bonterra and Chestnut Square to the Sun Valley area and east Indian Trail. Doug measures every opening himself and installs the finished door, so the person you meet for the quote is the person who does the work.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Indian Trail",
    "If your Indian Trail bath remodel uses white or marble-look tile, low-iron is often worth it.",
    `${POPULAR_FINISHES_HTML} Either one is an easy way to modernize a 2000s-era bathroom.`,
  ),
  whyCards: [
    measuredCard("so a new door fits the opening your original framed door left behind."),
    {
      icon: "UserCheck",
      title: "Owner On Every Job",
      description:
        "Doug measures, plans and installs every shower door personally. The person who quotes the job is the person who does it.",
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, Union County Service",
      description:
        "Indian Trail is one of our most consistent Union County service areas, with no travel fees.",
    },
    {
      icon: "ShieldCheck",
      title: "Honest, Written Quotes",
      description:
        "Every quote is clear and written before work begins. No surprises on the invoice and no pressure to upgrade.",
    },
    {
      icon: "BadgeCheck",
      title: "15+ Years of Experience",
      description:
        "Doug has been doing this work in Union County for over 15 years and knows the shower layouts in Indian Trail's homes.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments",
      description:
        "Mon–Sat, 7am–7pm. Saturday availability is the norm, because most homeowners can't take a weekday off for a quote.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Indian Trail",
  areasContent: areasHtml(
    "We install glass shower doors throughout Indian Trail and surrounding Union County communities, including:",
    [
      "Bonterra and the neighborhoods around Bonterra Town Center",
      "Chestnut Square and surrounding subdivisions",
      "The neighborhoods along Unionville-Indian Trail Road",
      "Stallings Road corridor and nearby communities",
      "Sun Valley High School area neighborhoods",
      "Sardis Church Road and east Indian Trail",
      "The growing developments off Wesley Chapel Road",
      "Crooked Creek and nearby subdivisions",
    ],
    'Not seeing your neighborhood? We almost certainly serve it. Call <a href="tel:+17047716111">(704) 771-6111</a> and we\'ll let you know.',
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Can you replace the original framed shower door in an older Indian Trail home?",
      answer:
        "<p>Yes. That's the most common shower door job we do in Indian Trail. Many late-1990s and early-2000s homes still have their original framed doors. We take out the old door and install custom glass cut to the opening.</p>",
    },
    {
      question: "Do you work on newer construction in Indian Trail?",
      answer:
        "<p>Yes. In newer Indian Trail homes we often replace the builder's standard shower door with custom frameless glass, measured on-site and cut to the opening.</p>",
    },
    {
      question: "How quickly can you get out to Indian Trail for a quote?",
      answer:
        "<p>We typically schedule within a few days, and Saturday appointments are available. Call or text (704) 771-6111 and we'll find a time that works.</p>",
    },
    cleaningFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Indian Trail and Union County"),
};

const stallingsCopy: CityShowerPageCopy = {
  key: "stallings",
  city: "Stallings",
  seoKeywords: keywords("Stallings NC"),
  introContent: [
    introOpener("Stallings"),
    "<p>Many Stallings homes from the early 2000s have tile showers with dated framed doors, and frameless glass is the upgrade we're asked for most here, usually as part of a primary bath remodel. In recently built homes, owners are often going past the builder standard with custom glass.</p>",
    "<p>Stallings is one of our closest and most regular service areas from our Charlotte home base. We work throughout town, from the neighborhoods along Stallings Road and NC-84 to Fairhaven and the areas bordering Matthews. Doug measures each opening himself, so nothing is ordered from a standard size.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Stallings",
    "If your Stallings bath remodel uses white or marble-look tile, low-iron is often worth it.",
    `${POPULAR_FINISHES_HTML} Chrome and brushed nickel are still easy matches for existing fixtures.`,
  ),
  whyCards: [
    measuredCard("so a new door fits the opening your old framed door left behind."),
    {
      icon: "UserCheck",
      title: "One Person, Start to Finish",
      description:
        "Doug handles the quote, the measurement and the installation. There's no handoff between sales and a crew you've never met.",
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, Regular Stallings Service",
      description:
        "Stallings is a regular part of our service area, with no travel surcharges and straightforward scheduling.",
    },
    {
      icon: "ShieldCheck",
      title: "Competitive, Upfront Pricing",
      description:
        "Lower overhead than a franchise means competitive quotes without cutting corners on glass or hardware.",
    },
    hardwareCard(),
    {
      icon: "CalendarDays",
      title: "Saturday Availability",
      description:
        "Mon–Sat, 7am–7pm. Saturday appointments are standard, because most of our Stallings clients work during the week.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in and Around Stallings",
  areasContent: areasHtml(
    "We install glass shower doors throughout Stallings and the nearby communities, including:",
    [
      "The neighborhoods along Stallings Road and NC-84",
      "Chestnut Square area and surrounding subdivisions",
      "The communities connecting Stallings to Indian Trail",
      "Fairhaven and nearby residential developments",
      "The subdivisions off Potter Road and Lawyers Road",
      "Neighborhoods near Stallings Elementary and Bain Elementary",
      "The residential areas bordering Matthews to the north",
    ],
    "Not seeing your street or subdivision? Call (704) 771-6111. We serve virtually all of Stallings and surrounding Union County.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Can you replace a dated framed shower door in a Stallings home?",
      answer:
        "<p>Yes. Many Stallings homes from the early 2000s have tile showers with framed doors that homeowners are ready to upgrade. We take out the old door and install custom frameless or semi-frameless glass cut to the opening.</p>",
    },
    {
      question: "How do I get a quote for a glass shower door in Stallings?",
      answer:
        "<p>Call or text (704) 771-6111 or fill out the contact form. Doug will schedule an in-home visit, because every shower opening is different, and you'll get a written quote during that visit.</p>",
    },
    {
      question: "Do you serve Stallings, or is it too far from Charlotte?",
      answer:
        "<p>Stallings is one of our most regular Union County service areas, and we're out there often. No travel fees and no minimum project size.</p>",
    },
    thicknessFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Stallings and Union County"),
};

const wesleyChapelCopy: CityShowerPageCopy = {
  key: "wesley-chapel",
  city: "Wesley Chapel",
  seoKeywords: keywords("Wesley Chapel NC"),
  introContent: [
    introOpener("Wesley Chapel"),
    "<p>Wesley Chapel is one of the fastest-growing parts of Union County, and many homeowners in its newer subdivisions are upgrading their primary baths above the builder standard. A custom glass shower door is often the piece that finishes that remodel, and it has to be cut to the exact opening, not adapted from a stock size.</p>",
    "<p>Brushed and polished gold hardware has become especially popular in Wesley Chapel's new construction. We work throughout the area, from the subdivisions along Wesley Chapel-Stouts Road to the developments off Weddington Road, and Doug handles every project personally from measurement to installation.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Wesley Chapel",
    "In Wesley Chapel's newer primary baths with white or marble-look tile, low-iron is often worth the upgrade.",
    "Brushed and polished gold have become some of the most requested finishes in Wesley Chapel's newer homes, with matte black close behind.",
  ),
  whyCards: [
    measuredCard("including the larger walk-ins and multi-panel layouts common in newer homes."),
    {
      icon: "UserCheck",
      title: "Owner Does Every Job",
      description:
        "Doug answers the phone, measures the opening and installs the door. You won't get a different person than the one who gave you the quote.",
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, Regular Local Service",
      description:
        "Charlotte is home base, and Wesley Chapel is right in our regular service rotation.",
    },
    hardwareCard(),
    {
      icon: "ShieldCheck",
      title: "Competitive Pricing",
      description:
        "Owner-operated means lower overhead, which translates into more competitive pricing than franchise operations.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments Available",
      description:
        "We schedule Mon–Sat, 7am–7pm. Saturday is available by default, not something you have to request or pay extra for.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Wesley Chapel",
  areasContent: areasHtml(
    "We install glass shower doors throughout Wesley Chapel and the surrounding Union County area, including:",
    [
      "The subdivisions along Wesley Chapel-Stouts Road",
      "Neighborhoods off Highway 74 in the Wesley Chapel corridor",
      "The growing developments off Weddington Road",
      "Communities near Wesley Chapel Middle and Parkwood High School",
      "The residential areas connecting Wesley Chapel to Waxhaw",
      "Neighborhoods near Antioch Church Road",
      "The developments along Unionville-Indian Trail Road",
    ],
    "Not seeing your neighborhood? Call (704) 771-6111. We cover all of Wesley Chapel and surrounding areas.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "How does the shower door quote process work in Wesley Chapel?",
      answer:
        "<p>Doug schedules an in-home visit to look at the shower and talk through glass thickness, hardware finish and door configuration. Every shower is different, so the measurement happens on-site, and you get a written quote from that visit.</p>",
    },
    {
      question: "Can you match the hardware finish to my existing bathroom fixtures?",
      answer: `<p>Yes. We offer ${HARDWARE_FINISHES}, so the new door hardware coordinates with your faucets and fixtures. Gold finishes have been especially popular in Wesley Chapel's newer homes.</p>`,
    },
    {
      question: "Do you come to Wesley Chapel regularly?",
      answer:
        "<p>Yes. Wesley Chapel is a regular part of our schedule. From our Charlotte home base we serve Union County without travel fees or minimum project requirements.</p>",
    },
    lowIronFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Wesley Chapel and Union County"),
};

const matthewsCopy: CityShowerPageCopy = {
  key: "matthews",
  city: "Matthews",
  seoKeywords: keywords("Matthews NC"),
  projectImage: {
    url: "/images/glass-door-pro/gallery/frameless-showers/12.webp",
    alt: "Frameless sliding shower door with gold hardware and wood vanity installed by Glass & Door Pro in Matthews, NC",
  },
  slidingDoorNote: " Our recent Matthews project, with gold hardware, uses one.",
  introContent: [
    introOpener("Matthews"),
    "<p>Matthews has a mix of established neighborhoods, older homes and updated properties, from mid-century ranches to newer construction. Showers in older Matthews homes often have walls that aren't quite plumb, and bathroom remodels here call for glass cut to the opening rather than a standard kit adapted to the space.</p>",
    "<p>One recent Matthews job is a frameless sliding shower door with gold hardware, paired with a wood vanity. We work throughout Matthews, from neighborhoods near downtown to homes along the Mecklenburg-Union County line, with no travel fees from our Charlotte home base.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Matthews",
    "If your Matthews bathroom has marble or white tile, low-iron is often worth the upgrade.",
    `${POPULAR_FINISHES_HTML} Our recent Matthews sliding door used gold hardware.`,
  ),
  whyCards: [
    {
      icon: "CheckCircle",
      title: "Precision Frameless Shower Work",
      description:
        "Custom glass installed to fit the exact dimensions of your shower, not a standard kit adapted to your space. Every panel is measured and ordered for the opening.",
    },
    {
      icon: "UserCheck",
      title: "Personal Service from an Owner-Operator",
      description:
        "Doug runs Glass & Door Pro himself. No franchisee, no rotating crews, and no one unfamiliar with your job showing up at your door.",
    },
    {
      icon: "BadgeCheck",
      title: "Experience in Established Neighborhoods",
      description:
        "Matthews homes range from mid-century ranches to newer construction, and Doug knows how to fit glass to each one.",
    },
    hardwareCard(),
    {
      icon: "MapPin",
      title: "No Travel Surcharges for Matthews",
      description:
        "Matthews is within our regular service area, with no additional fees for being in Mecklenburg County.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments Available",
      description:
        "We work Mon–Sat, 7am–7pm, and Saturday is a standard part of our schedule, not an exception.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Matthews",
  areasContent: areasHtml(
    "We install glass shower doors throughout Matthews and the surrounding area, including:",
    [
      "Downtown Matthews and the historic neighborhood area",
      "Stumptown Road and Idlewild Road corridors",
      "Matthews Township Greenway area neighborhoods",
      "The subdivisions along Monroe Road into Matthews",
      "Crews Road and surrounding communities",
      "Neighborhoods near Matthews Elementary and Crestdale Middle",
      "The residential areas near Matthews-Mint Hill Road",
      "Communities connecting Matthews to Stallings and Indian Trail",
    ],
    "Not seeing your neighborhood? We serve all of Matthews. Call (704) 771-6111.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Do you install sliding glass shower doors?",
      answer:
        "<p>Yes. Frameless sliding doors work well where a swinging door would hit a vanity or toilet. One recent Matthews job is a frameless sliding door with gold hardware.</p>",
    },
    {
      question: "Can you fit a glass shower door in an older Matthews home?",
      answer:
        "<p>Yes. Older Matthews homes often have shower walls that aren't plumb or square. Every panel is measured on-site and cut to the exact opening, so nothing has to be forced to fit.</p>",
    },
    {
      question: "Do you serve Matthews from Charlotte?",
      answer:
        "<p>Yes. Matthews is a regular part of our service area from our Charlotte home base, and we don't add travel fees for Mecklenburg County locations.</p>",
    },
    cleaningFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Matthews and the surrounding area"),
};

const weddingtonCopy: CityShowerPageCopy = {
  key: "weddington",
  city: "Weddington",
  seoKeywords: keywords("Weddington NC"),
  projectImage: {
    url: "/images/glass-door-pro/gallery/frameless-showers/06.webp",
    alt: "Corner frameless shower with gold hardware and blue accent walls installed by Glass & Door Pro in Weddington, NC",
  },
  introContent: [
    introOpener("Weddington"),
    "<p>Weddington homes tend to be larger and carefully maintained, and shower door work here leans custom. We install frameless enclosures in primary baths that are being properly renovated, often with multiple panels, knee walls or angled ceilings. Every panel is measured on-site and cut to the opening.</p>",
    "<p>One recent Weddington job is a corner frameless shower with gold hardware set against blue accent walls. Weddington is one of our most consistent Union County service areas, and we've worked throughout its neighborhoods for years, from Weddington Road and Weddington Chase to the Marvin area.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Weddington",
    "In Weddington's renovated primary baths with marble or natural stone, low-iron is often worth the upgrade.",
    `${POPULAR_FINISHES_HTML} Our recent Weddington corner shower used gold hardware.`,
  ),
  whyCards: [
    {
      icon: "CheckCircle",
      title: "Custom Work Done Right",
      description:
        "Weddington homes are finished carefully, and the glass should match. Every frameless enclosure is measured and ordered to fit the specific opening.",
    },
    {
      icon: "UserCheck",
      title: "Owner-Operated Accountability",
      description:
        "Doug is responsible for every project from the first call to the final walkthrough. No crew turnover and no subcontractors.",
    },
    {
      icon: "Star",
      title: "Hardware That Matches the Home",
      description: `We offer ${HARDWARE_FINISHES}, and help you choose hardware that works with your existing fixtures.`,
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, No Travel Fees",
      description:
        "Weddington is part of our regular Union County service area, with no additional charges for location.",
    },
    {
      icon: "ShieldCheck",
      title: "Transparent, Written Quotes",
      description:
        "Every quote is detailed and written before any work begins, so you know exactly what you're getting.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments",
      description:
        "Mon–Sat, 7am–7pm. Saturday is when most Weddington homeowners prefer to meet for project visits.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Weddington",
  areasContent: areasHtml(
    "We install glass shower doors throughout Weddington and surrounding Union County communities, including:",
    [
      "The established neighborhoods along Weddington Road",
      "Providence Road West corridor communities",
      "Weddington Chase and nearby subdivisions",
      "The neighborhoods near Weddington High School",
      "Marvin and the Marvin-Weddington area",
      "The residential communities along Rea Road in Weddington",
      "Kensington and nearby developments",
      "The communities connecting Weddington to Waxhaw and Ballantyne",
    ],
    "Not in one of these areas? Call (704) 771-6111. We cover all of Weddington.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "How custom can a frameless shower enclosure get?",
      answer:
        "<p>Very custom. We work with openings that have multiple panels, fixed and hinged combinations, knee walls, angled ceilings and non-standard proportions. Doug measures the space, talks through the configurations that work for it, and custom-orders the glass.</p>",
    },
    {
      question: "What hardware finishes do you offer?",
      answer: `<p>We offer ${HARDWARE_FINISHES}. Doug brings samples to the in-home visit so you can see the finishes against your existing fixtures before you commit.</p>`,
    },
    {
      question: "Do you work in Weddington regularly?",
      answer:
        "<p>Yes. Weddington is one of our most consistent Union County service areas, and we've worked throughout its neighborhoods for years. No travel fees and direct access to Doug on every project.</p>",
    },
    lowIronFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Weddington and Union County"),
};

const indianLandCopy: CityShowerPageCopy = {
  key: "indian-land",
  city: "Indian Land",
  state: "SC",
  seoKeywords: keywords("Indian Land SC"),
  introContent: [
    introOpener("Indian Land", "SC"),
    "<p>Indian Land has a lot of newer construction, and many homeowners here are upgrading their primary baths above the builder-standard shower surround. Homes that are now 10–15 years old are often ready for the same upgrade. Frameless glass is the most common way to finish those bathrooms, and every panel has to be cut to the exact opening.</p>",
    "<p>We're based in Charlotte, just across the state line, and Indian Land is a regular part of our service area with no border fee. We work throughout the area, from the neighborhoods along Highway 521 to the newer communities on Doby's Bridge Road.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Indian Land",
    "In Indian Land's newer primary baths with white or marble-look tile, low-iron is often worth the upgrade.",
    POPULAR_FINISHES_HTML,
  ),
  whyCards: [
    measuredCard("including the larger walk-ins common in newer Indian Land homes."),
    {
      icon: "UserCheck",
      title: "Owner-Operated",
      description:
        "Doug handles every project from measurement to installation. The person you meet for the quote is the person who installs the door.",
    },
    {
      icon: "MapPin",
      title: "No State Line Hassle",
      description:
        "We work in Indian Land regularly and treat it like any other part of our service area. No additional fees and no scheduling issues.",
    },
    {
      icon: "Droplets",
      title: "Frameless Shower Expertise",
      description:
        "Frameless glass is the most common way Indian Land homeowners finish a primary bath, and we install it correctly every time.",
    },
    {
      icon: "ShieldCheck",
      title: "Honest, Written Quotes",
      description:
        "Every quote is clear and in writing before any work starts. No surprise charges and no pressure to upgrade.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments Available",
      description: "Mon–Sat, 7am–7pm. Saturday is a standard option for Indian Land homeowners.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Indian Land",
  areasContent: areasHtml(
    "We install glass shower doors throughout Indian Land and the surrounding Lancaster County area, including:",
    [
      "The neighborhoods along Highway 521 in Indian Land",
      "Baxter Village and surrounding communities",
      "The subdivisions near Indian Land High School",
      "Rea Road extension communities crossing into SC",
      "Providence Road corridor into Indian Land",
      "Foxcroft and nearby established neighborhoods",
      "The new construction communities along Doby's Bridge Road",
      "Neighborhoods connecting Indian Land to Fort Mill",
    ],
    "Not seeing your community? Call (704) 771-6111. We cover all of Indian Land and surrounding areas.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Do you cross into South Carolina to serve Indian Land?",
      answer:
        "<p>Yes. Indian Land is a regular part of our service area. We're based in Charlotte, just across the state line, and there are no additional fees for the SC location.</p>",
    },
    {
      question: "Can you upgrade a builder-standard shower door in a newer Indian Land home?",
      answer:
        "<p>Yes. That's one of the most common shower door jobs we do in Indian Land. We replace the standard door with custom glass measured and cut to your opening.</p>",
    },
    lowIronFaq,
    cleaningFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Indian Land and Lancaster County"),
};

const fortMillCopy: CityShowerPageCopy = {
  key: "fort-mill",
  city: "Fort Mill",
  state: "SC",
  seoKeywords: keywords("Fort Mill SC"),
  introContent: [
    introOpener("Fort Mill", "SC"),
    "<p>Fort Mill has a large base of well-maintained homes where owners are making long-term improvements, and a frameless glass shower is often the project that finishes a primary bath upgrade. Many Fort Mill showers are multi-wall walk-ins with several fixed panels and one or more doors, and every piece has to be cut to the opening.</p>",
    "<p>We're based in South Charlotte, right across the state line, and Fort Mill is a regular part of our weekly schedule with no SC upcharge. We work throughout the area, from Baxter Village and Kingsley to the Tega Cay peninsula and the communities along Gold Hill Road.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Fort Mill",
    "In Fort Mill primary baths with marble or white tile, low-iron is often worth the upgrade.",
    POPULAR_FINISHES_HTML,
  ),
  whyCards: [
    {
      icon: "CheckCircle",
      title: "Frameless Shower Installations",
      description:
        "Fort Mill has strong demand for frameless glass in primary bath upgrades. We install it correctly: custom measured, properly supported and cleanly finished.",
    },
    {
      icon: "UserCheck",
      title: "Owner Does the Work",
      description:
        "Doug measures, orders the glass and installs it. You're not getting a different person for each step.",
    },
    {
      icon: "MapPin",
      title: "Charlotte-Based, Regular Fort Mill Service",
      description:
        "Fort Mill is a regular part of our weekly schedule from our South Charlotte home base.",
    },
    {
      icon: "ShieldCheck",
      title: "No SC Upcharge",
      description:
        "No additional fees, no travel charges and no minimum project requirements for Fort Mill.",
    },
    {
      icon: "BadgeCheck",
      title: "Clear Quotes, No Surprises",
      description:
        "Written quotes before any work begins, with no ambiguity about what's included and what it costs.",
    },
    {
      icon: "CalendarDays",
      title: "Saturday Appointments Available",
      description:
        "Mon–Sat, 7am–7pm. We work around Fort Mill homeowners' schedules, including Saturdays.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Fort Mill",
  areasContent: areasHtml(
    "We install glass shower doors throughout Fort Mill and the surrounding York County communities, including:",
    [
      "Downtown Fort Mill and the historic district",
      "Baxter Village and surrounding communities",
      "Kingsley and the neighborhoods along Carowinds Boulevard",
      "The Tega Cay peninsula communities",
      "Nation Ford Road and surrounding subdivisions",
      "Springfield neighborhood and nearby areas",
      "The communities along Gold Hill Road",
      "Neighborhoods connecting Fort Mill to Indian Land and Pineville",
    ],
    "Not seeing your community? Call (704) 771-6111. We cover all of Fort Mill and surrounding York County areas.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Can you install a frameless shower in a Fort Mill walk-in with multiple walls?",
      answer:
        "<p>Yes. Multi-wall showers with several fixed panels and one or more doors are something we handle regularly. Doug measures the configuration on-site and orders every panel to fit.</p>",
    },
    {
      question: "Do you serve Fort Mill even though you're based in North Carolina?",
      answer:
        "<p>Yes. Fort Mill is a regular part of our service area. We're based in Charlotte, just across the state line, and there are no additional fees for the SC location.</p>",
    },
    {
      question: "Is there a minimum project size?",
      answer:
        "<p>No. A single shower door or splash panel gets the same attention as a full multi-panel enclosure. There's no minimum anywhere in our service area.</p>",
    },
    lowIronFaq,
  ],
  ctaSubheading: ctaHtml("Charlotte-based, serving Fort Mill and York County"),
};

const pinevilleCopy: CityShowerPageCopy = {
  key: "pineville",
  city: "Pineville",
  seoKeywords: keywords("Pineville NC"),
  introContent: [
    introOpener("Pineville"),
    "<p>Pineville sits at the southern edge of Charlotte, with established neighborhoods where homeowners have been in place long enough to know what they want. Bathroom upgrades are a priority here, and a well-fitted frameless glass shower door is often the finishing piece.</p>",
    "<p>We're based in South Charlotte, a short drive from Pineville, and we work throughout the area, from the neighborhoods along Highway 51 and Pineville-Matthews Road to Quail Hollow and the communities near Carolina Place. Doug measures every opening himself and installs the finished door, so the person who quotes the job is the one who does it.</p>",
  ].join(""),
  optionsContent: optionsHtml(
    "Pineville",
    "If your Pineville bathroom has marble or white tile, low-iron is often worth the upgrade.",
    POPULAR_FINISHES_HTML,
  ),
  whyCards: [
    measuredCard("including the out-of-square openings common in older bathrooms."),
    {
      icon: "UserCheck",
      title: "Owner-Operated Personal Service",
      description:
        "Pineville homeowners deal with Doug directly. No account managers and no rotating installers.",
    },
    {
      icon: "BadgeCheck",
      title: "Consistent Quality",
      description:
        "The person measuring is the person installing, which means fewer errors and a better fit.",
    },
    {
      icon: "ShieldCheck",
      title: "No Franchise Overhead",
      description:
        "We serve Pineville without the overhead of a national franchise, which means more competitive pricing.",
    },
    hardwareCard(),
    {
      icon: "CalendarDays",
      title: "Saturday Appointments Are Standard",
      description:
        "Mon–Sat, 7am–7pm. Saturday is part of our regular schedule for Pineville and surrounding areas.",
    },
  ],
  areasTitle: "Neighborhoods We Serve in Pineville",
  areasContent: areasHtml(
    "We install glass shower doors throughout Pineville and the surrounding south Charlotte communities, including:",
    [
      "The neighborhoods along Highway 51 and Pineville-Matthews Road",
      "Pineville town center and surrounding residential areas",
      "The communities near Carolina Place Mall and south into Pineville",
      "Quail Hollow and surrounding south Charlotte neighborhoods",
      "The subdivisions along Elm Lane and Pineville-Indian Trail Road",
      "Neighborhoods connecting Pineville to Ballantyne and the south Charlotte corridor",
      "The residential areas near Pineville-Matthews and Rea Road",
      "Communities bordering Fort Mill and Indian Land to the south",
    ],
    "Not seeing your neighborhood? Call (704) 771-6111. We cover all of Pineville and surrounding south Charlotte areas.",
  ),
  faqItems: [
    installTimeFaq,
    framelessFaq,
    {
      question: "Do you serve Pineville from Charlotte?",
      answer:
        "<p>Yes. We're based in South Charlotte, and Pineville is a regular part of our service area. No travel fees and no difference in scheduling compared to anywhere else we serve.</p>",
    },
    thicknessFaq,
    lowIronFaq,
    cleaningFaq,
  ],
  ctaSubheading: ctaHtml("Based in South Charlotte, serving Pineville"),
};

const cityShowerPageCopy: Record<string, CityShowerPageCopy> = {
  "service-areas-waxhaw": waxhawCopy,
  "areas-served-charlotte-nc": charlotteCopy,
  "areas-served-monroe-nc": monroeCopy,
  "service-areas-indian-trail": indianTrailCopy,
  "service-areas-stallings": stallingsCopy,
  "service-areas-wesley-chapel": wesleyChapelCopy,
  "service-areas-matthews": matthewsCopy,
  "service-areas-weddington": weddingtonCopy,
  "service-areas-indian-land": indianLandCopy,
  "service-areas-fort-mill": fortMillCopy,
  "service-areas-pineville": pinevilleCopy,
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

  const projectImage = copy.projectImage;
  const galleryImages = Array.isArray(gallery?.props?.images)
    ? (gallery.props.images as unknown[]).filter(
        (image) => !projectImage || !isRecord(image) || image.url !== projectImage.url,
      )
    : [];
  const serviceCards = Array.isArray(services.props?.cards)
    ? (services.props.cards as unknown[])
        .filter((card) => !isRecord(card) || card.link !== FRAMELESS_SHOWERS_LINK)
        .map(linkCommercialCardToServicesHub)
    : [];
  const { city, key } = copy;
  const state = copy.state ?? "NC";

  const nextBlocks = [
    hero,
    withProps(intro, {
      title: `Custom Glass Shower Doors in ${city}, ${state}`,
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
    gallery
      ? withProps(gallery, {
          images: projectImage ? [projectImage, ...galleryImages] : galleryImages,
        })
      : undefined,
    testimonials,
    withProps(faq, { title: `Glass Shower Door FAQs — ${city}, ${state}`, items: copy.faqItems }),
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
