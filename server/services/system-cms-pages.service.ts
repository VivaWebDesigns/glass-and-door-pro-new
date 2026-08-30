import { randomUUID } from "crypto";
import { storage } from "../storage";
import { normalizeSeoDescription } from "@shared/seo-description";
import { correctGlassSearchTitle } from "@shared/glass-search-snippets";
import { GLASS_HOMEPAGE_SERVICE_CARDS } from "@shared/glass-homepage-services";
import { glassGoogleReviewDate } from "@shared/glass-review-dates";
import { isGlassLegalNoindexSlug } from "@shared/glass-seo";
import {
  GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML,
  GLASS_PRIMARY_SERVICE_AREA_NAMES,
} from "@shared/glass-service-areas";
import {
  GLASS_NEW_GOOGLE_REVIEWS,
  GLASS_NEW_HOMEPAGE_REVIEWS,
  RETIRED_GLASS_GOOGLE_REVIEW_NAMES,
} from "@shared/glass-new-reviews";
import {
  GLASS_PRIVACY_POLICY_HTML,
  GLASS_PRIVACY_POLICY_LEGACY_MARKER,
} from "@shared/glass-privacy-policy";
import type { InsertCmsPage } from "@shared/schema";

function id() {
  return randomUUID();
}

function buildPrivacyPolicyContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Privacy Policy",
          subtitle:
            "How Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content: GLASS_PRIVACY_POLICY_HTML,
        },
      },
    ],
  };
}

function buildTermsOfServiceContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Terms of Service",
          subtitle:
            "Website terms for Glass & Door Pro estimates, service information, third-party links, and use of site content.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content:
            '<p><strong>Last updated:</strong> June 9, 2026</p><h2>1. About This Website</h2><p>This website is operated by Glass &amp; Door Pro, located at 6135 Park South Drive Suite 542, Charlotte, NC 28210. By accessing or using this website, you agree to these terms. If you do not agree, please do not use the site.</p><h2>2. Informational Purpose Only</h2><p>The content on this website, including service descriptions, pricing references, process descriptions, project photos, reviews, and any other information, is provided for general informational purposes only. Nothing on this website constitutes a binding estimate, quote, contract, warranty, or commitment to perform any service.</p><p>All project details, pricing, scope of work, scheduling, and warranty terms are established directly between Glass &amp; Door Pro and the customer through a separate estimate and service agreement process. No website content creates or modifies that agreement.</p><h2>3. Estimates and Service Agreements</h2><p>Submitting a contact form or requesting an estimate through this website does not create a service agreement or obligate Glass &amp; Door Pro to perform any work. A binding service agreement is formed only when both parties have agreed in writing to a specific scope of work, pricing, and terms.</p><p>Free estimates are offered as a courtesy and do not guarantee availability, pricing, or scheduling. Glass &amp; Door Pro reserves the right to decline any project at its discretion.</p><h2>4. Accuracy of Information</h2><p>Glass &amp; Door Pro makes reasonable efforts to keep the information on this website accurate and current. However, we do not warrant that all content is complete, accurate, or up to date at all times. Service offerings, product availability, hours, service areas, and other details may change. Confirm current information directly with Glass &amp; Door Pro before making decisions based on website content.</p><h2>5. Intellectual Property</h2><p>All content on this website, including text, photography, graphics, logos, and page structure, is the property of Glass &amp; Door Pro or is used with permission. You may not reproduce, distribute, republish, or use any content from this website for commercial purposes without express written permission from Glass &amp; Door Pro.</p><p>Customer reviews displayed on this website are reproduced with the understanding that they were submitted as public reviews. If you believe your content has been used in error, contact us and we will address it promptly.</p><h2>6. Third-Party Links</h2><p>This website may contain links to third-party websites, including Google Maps, Google Business Profile, manufacturer websites, review platforms, and other external services. These links are provided for convenience only. Glass &amp; Door Pro does not control third-party sites and is not responsible for their content, accuracy, or privacy practices. Accessing a third-party site from a link on our website is at your own risk. See our Privacy Policy for more information about how we handle information submitted through this website.</p><h2>7. Limitation of Liability</h2><p>To the fullest extent permitted by applicable law, Glass &amp; Door Pro and its owners, employees, contractors, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or reliance on any information contained herein.</p><h2>8. Disclaimer of Warranties</h2><p>This website is provided "as is" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Glass &amp; Door Pro does not warrant that the website will be available without interruption or free from errors.</p><h2>9. Governing Law</h2><p>These terms are governed by the laws of the State of North Carolina, without regard to its conflict of law provisions. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Union County, North Carolina.</p><h2>10. Changes to These Terms</h2><p>Glass &amp; Door Pro reserves the right to update or modify these terms at any time without prior notice. The date at the top of this page reflects the most recent update. Continued use of the website after changes are posted constitutes acceptance of the updated terms.</p><h2>11. Contact</h2><p>Questions about these terms can be directed to Glass &amp; Door Pro:</p><p>Glass &amp; Door Pro<br>6135 Park South Drive<br>Suite 542<br>Charlotte, NC 28210<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
        },
      },
    ],
  };
}

function buildDisclaimerContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Legal",
          title: "Disclaimer",
          subtitle:
            "Important context about website information, estimates, repair recommendations, warranty references, pricing, and commercial glass work.",
          alignment: "left",
          headingLevel: "h1",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          alignment: "left",
          content:
            '<p><strong>Last updated:</strong> June 9, 2026</p><h2>General Information Only</h2><p>The content published on this website is provided for general informational purposes only. It describes the types of services Glass &amp; Door Pro typically offers and the general conditions under which those services are performed. It does not constitute professional advice, a formal assessment, or a recommendation specific to any individual property, window, glass unit, door, shower enclosure, commercial opening, or building condition.</p><h2>Conditions Vary by Property</h2><p>Glass, window, door, shower, and commercial glass recommendations depend heavily on the specific condition of the product, the installation, the surrounding structure, and factors that can only be assessed through an in-person inspection. Information on this website, including descriptions of repair versus replacement criteria, typical repair processes, and expected outcomes, reflects general experience and may not apply to your specific situation. No assessment or recommendation is valid without a direct evaluation by Glass &amp; Door Pro.</p><h2>Manufacturer Warranty Coverage</h2><p>References to manufacturer warranties, warranty service, product defects, or product eligibility on this website are general in nature. Warranty coverage for any specific product depends on the manufacturer&apos;s warranty terms, the product&apos;s eligibility, proof of purchase, installation documentation, the nature of the defect or failure, and other factors determined by the manufacturer. Glass &amp; Door Pro cannot confirm warranty coverage or eligibility without reviewing the product and documentation directly. Any manufacturer or product reference does not guarantee that a specific claim will be approved by the manufacturer. Contact Glass &amp; Door Pro for project-specific questions.</p><h2>Pricing and Availability</h2><p>Any pricing references, ranges, or cost comparisons on this website are general in nature and do not constitute a quote or estimate for any specific project. Actual pricing depends on product specifications, site conditions, measurements, finish selections, hardware, parts availability, access requirements, and other factors assessed at the time of the estimate. Availability of services, scheduling, and parts is subject to change without notice. See our Terms of Service for additional information about estimates and service agreements.</p><h2>Commercial Work</h2><p>Descriptions of commercial glass services on this website are general in nature. Commercial project scope, access requirements, permitting, insurance requirements, and applicable code standards vary significantly by property type, location, and jurisdiction. No description on this website should be relied upon as a complete characterization of what a commercial project will require.</p><h2>No Liability</h2><p>Glass &amp; Door Pro makes reasonable efforts to ensure the accuracy of information on this website but does not warrant that all content is current, complete, or error-free. Glass &amp; Door Pro and its owners, employees, contractors, and agents are not liable for any decisions made or actions taken in reliance on information published on this website.</p><h2>Contact</h2><p>If you have questions about a specific project or situation, contact us directly rather than relying on website content.</p><p>Glass &amp; Door Pro<br>6135 Park South Drive<br>Suite 542<br>Charlotte, NC 28210<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
        },
      },
    ],
  };
}

type CmsContentBlock = {
  id?: string;
  type?: string;
  props?: Record<string, unknown>;
};

type CmsBuilderContent = {
  blocks?: CmsContentBlock[];
  [key: string]: unknown;
};

const commercialDoorInstallationSlug = "services-commercial-door-installation";
const SYSTEM_RETIRED_PAGE_MARKERS = ["systemRetired", "isSystemRetired"];

const residentialServicePageUrlsBySlug: Record<string, string> = {
  "services-window-installation": "/services/window-installation",
  "services-door-installation": "/services/door-installation",
  "services-window-repair": "/services/window-repair",
};

const residentialServiceLinks = [
  {
    label: "Frameless Showers",
    description: "Custom frameless glass shower doors and enclosures.",
    url: "/services/frameless-showers",
  },
  {
    label: "Window Installation",
    description: "For whole-bathroom or whole-home remodels.",
    url: "/services/window-installation",
  },
  {
    label: "Door Installation",
    description: "Entry, patio, and interior doors.",
    url: "/services/door-installation",
  },
  {
    label: "Window Repair",
    description: "Foggy glass, broken panes, seal failures, and hardware.",
    url: "/services/window-repair",
  },
];

const commercialServiceLinks = [
  {
    label: "Commercial Storefront Glass Installation",
    description:
      "Aluminum framing, fixed glass panels, and storefront doors for new construction, tenant buildouts, and commercial renovations.",
    url: "/services/commercial-storefront-glass-installation",
  },
  {
    label: "Commercial Storefront Glass Replacement & Repair",
    description:
      "Emergency board-up, broken panel replacement, and storefront glass repair for Charlotte businesses.",
    url: "/services/commercial-storefront-glass-replacement-repair",
  },
  {
    label: "Commercial Door Replacement & Repair",
    description:
      "Broken glass panels, hardware failure, misaligned frames, and worn closers repaired or replaced fast.",
    url: "/services/commercial-door-replacement-repair",
  },
  {
    label: "Commercial Window Replacement",
    description: "Apartment and multi-family window replacement with fast mobilization.",
    url: "/services/commercial-window-replacement",
  },
];

function buildRelatedServicesBlock(currentUrl: string): CmsContentBlock {
  return {
    id: id(),
    type: "link-list",
    props: {
      title: "Related Services",
      columns: "1",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "md",
      sectionPaddingBottom: "md",
      links: residentialServiceLinks.filter((link) => link.url !== currentUrl),
    },
  };
}

function buildRelatedCommercialServicesBlock(): CmsContentBlock {
  return {
    id: id(),
    type: "link-list",
    props: {
      title: "Related Commercial Services",
      subtitle:
        "More commercial glass, storefront, door, and window services for Charlotte businesses.",
      columns: "2",
      sectionBackgroundColor: "#ffffff",
      sectionPaddingTop: "md",
      sectionPaddingBottom: "md",
      links: commercialServiceLinks,
    },
  };
}

function hasLinkListBlock(content: unknown, title: string) {
  if (!content || typeof content !== "object") return false;
  const builderContent = content as CmsBuilderContent;
  return Boolean(
    builderContent.blocks?.some(
      (block) => block.type === "link-list" && block.props?.title === title,
    ),
  );
}

function insertBlockBeforeCta(content: unknown, blockToInsert: CmsContentBlock) {
  if (!content || typeof content !== "object") return null;

  const builderContent = content as CmsBuilderContent;
  if (!Array.isArray(builderContent.blocks)) return null;

  const ctaIndex = builderContent.blocks.findLastIndex((block) => block.type === "cta");
  const nextBlocks =
    ctaIndex >= 0
      ? [
          ...builderContent.blocks.slice(0, ctaIndex),
          blockToInsert,
          ...builderContent.blocks.slice(ctaIndex),
        ]
      : [...builderContent.blocks, blockToInsert];

  return {
    ...builderContent,
    blocks: nextBlocks,
  };
}

function addRelatedCommercialServicesBlock(content: unknown) {
  if (hasLinkListBlock(content, "Related Commercial Services")) return null;

  return insertBlockBeforeCta(content, buildRelatedCommercialServicesBlock());
}

function addRelatedServicesBlock(content: unknown, currentUrl: string) {
  if (hasLinkListBlock(content, "Related Services")) return null;

  return insertBlockBeforeCta(content, buildRelatedServicesBlock(currentUrl));
}

function ensureHomepageServiceCards(content: unknown) {
  if (!isRecord(content) || !Array.isArray(content.blocks)) return null;

  const serviceBlockIndex = content.blocks.findIndex(
    (block) =>
      isRecord(block) &&
      block.type === "cards-grid" &&
      isRecord(block.props) &&
      block.props.anchorId === "services",
  );
  if (serviceBlockIndex < 0) return null;

  const serviceBlock = content.blocks[serviceBlockIndex];
  if (!isRecord(serviceBlock) || !isRecord(serviceBlock.props)) return null;

  const currentCards = Array.isArray(serviceBlock.props.cards) ? serviceBlock.props.cards : [];
  const currentLinks = currentCards.map((card) => (isRecord(card) ? card.link : undefined));
  const expectedLinks = GLASS_HOMEPAGE_SERVICE_CARDS.map((card) => card.link);
  if (
    currentLinks.length === expectedLinks.length &&
    currentLinks.every((link, index) => link === expectedLinks[index])
  ) {
    return null;
  }

  const blocks = [...content.blocks];
  blocks[serviceBlockIndex] = {
    ...serviceBlock,
    props: {
      ...serviceBlock.props,
      cards: GLASS_HOMEPAGE_SERVICE_CARDS,
    },
  };

  return { ...content, blocks };
}

function ensureGoogleReviewItems(content: unknown, homepage: boolean) {
  if (!isRecord(content) || !Array.isArray(content.blocks)) return null;

  const testimonialIndex = content.blocks.findIndex(
    (block) =>
      isRecord(block) &&
      block.type === "testimonials" &&
      isRecord(block.props) &&
      block.props.anchorId === "reviews",
  );
  if (testimonialIndex < 0) return null;

  const testimonialBlock = content.blocks[testimonialIndex];
  if (!isRecord(testimonialBlock) || !isRecord(testimonialBlock.props)) return null;

  const currentItems = Array.isArray(testimonialBlock.props.items)
    ? testimonialBlock.props.items.filter(isRecord)
    : [];
  const featuredItems = homepage ? GLASS_NEW_HOMEPAGE_REVIEWS : GLASS_NEW_GOOGLE_REVIEWS;
  const featuredNames = new Set(featuredItems.map((item) => item.name));
  const retainedItems = currentItems
    .filter((item) => {
      const name = typeof item.name === "string" ? item.name : "";
      return !featuredNames.has(name) && !RETIRED_GLASS_GOOGLE_REVIEW_NAMES.has(name);
    })
    .map((item) => {
      const name = typeof item.name === "string" ? item.name : "";
      const reviewDate = glassGoogleReviewDate(name);
      return reviewDate && item.reviewDate !== reviewDate ? { ...item, reviewDate } : item;
    });
  const items = [...featuredItems, ...retainedItems];

  if (JSON.stringify(items) === JSON.stringify(currentItems)) return null;

  const blocks = [...content.blocks];
  blocks[testimonialIndex] = {
    ...testimonialBlock,
    props: {
      ...testimonialBlock.props,
      items,
    },
  };
  return { ...content, blocks };
}

const businessHoursReplacements = [
  ["7am - 6pm", "7am - 7pm"],
  ["7am – 6pm", "7am – 7pm"],
  ["7am–6pm", "7am–7pm"],
  ["7 AM to 6 PM", "7 AM to 7 PM"],
] as const;

const businessAddressReplacements = [
  [
    "2341 Waverly Dr<br>Monroe, NC 28112",
    "6135 Park South Drive<br>Suite 542<br>Charlotte, NC 28210",
  ],
  ["2341 Waverly Dr\nMonroe, NC 28112", "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210"],
  ["2341 Waverly Dr, Monroe, NC 28112", "6135 Park South Drive Suite 542, Charlotte, NC 28210"],
] as const;

type TextReplacement = readonly [string, string];

const cityPositioningUpdates: Record<
  string,
  {
    seoDescription: string;
    legacySeoDescriptions: readonly string[];
    replacements: readonly TextReplacement[];
  }
> = {
  "areas-served-monroe-nc": {
    seoDescription:
      "Charlotte-based, owner-operated glass and door services for Monroe, NC. Frameless showers, windows, doors, repairs, and commercial glass. Call (704) 771-6111.",
    legacySeoDescriptions: [
      "Owner-operated glass and door services in Monroe, NC. Frameless showers, window installation, door installation and window repair by Doug.",
      "Monroe, NC's local glass and door company. Frameless showers, window installation, door installation, window repair, and commercial glass. Owner-operator with 15+ years of experience. Call (704) 771-6111.",
    ],
    replacements: [
      ["your Monroe-based owner-operator", "your Charlotte-based owner-operator"],
      [
        "Your Local Glass & Door Company in Monroe",
        "Charlotte-Based Glass & Door Service for Monroe",
      ],
      [
        "<p>Glass and Door Pro is based right here in Monroe. Doug Adams lives and works in Union County, and Monroe homeowners are some of our most valued clients — many have become repeat customers and personal friends.</p><p>Being local matters more than most people realize. When you call a Monroe-area company for a frameless shower install, you're not waiting for a Charlotte-based crew to fit you into a route. We answer the phone, get out for a quote quickly, and don't add a travel premium to Union County projects the way some competitors quietly do. We're also the only local glass and door specialist working Saturdays.</p><p>Whether you're remodeling a master bathroom in one of the newer subdivisions off Highway 74, repairing a foggy bedroom window in a 1990s home near Sun Valley, or replacing the entry door on a historic home near downtown Monroe, this is the kind of work I do every week.</p>",
        "<p>Glass and Door Pro is based in Charlotte and serves Monroe and the surrounding Union County communities regularly. Monroe homeowners are some of our most valued clients, and many have become repeat customers and personal referrals.</p><p>Doug handles every quote, measurement, and installation personally. Monroe is part of our normal service area, so there are no added travel premiums for Union County projects. Same-week and Saturday appointments are often available.</p><p>Whether you're remodeling a master bathroom in one of the newer subdivisions off Highway 74, repairing a foggy bedroom window in a 1990s home near Sun Valley, or replacing the entry door on a historic home near downtown Monroe, this is the kind of work I do every week.</p>",
      ],
      ["Truly Local", "Charlotte-Based, Serving Monroe"],
      [
        "Based in Monroe, not Charlotte. Faster response, no travel surcharges, and a genuine personal stake in our reputation around town.",
        "Monroe is a regular part of our Union County service area, with no travel surcharges and direct, owner-operated service from Doug.",
      ],
      [
        "Based in Monroe. Serving Union County, Charlotte, and surrounding areas.",
        "Based in Charlotte. Serving Monroe, Union County, and the greater Charlotte area.",
      ],
      ["Are you actually based in Monroe, NC?", "Do you still serve Monroe, NC?"],
      [
        "<p>Yes. Glass and Door Pro is based right here in Monroe. Doug lives and works in Union County, which means shorter response times for Monroe homeowners and a real local presence — not a Charlotte-based company driving an hour into Union County for a quote.</p>",
        "<p>Yes. Monroe remains a regular part of our service area. Doug works throughout Union County, including Monroe, and handles every quote and installation personally.</p>",
      ],
      [
        "Mon–Sat: 7am – 7pm | Based in Monroe, NC",
        "Mon–Sat: 7am – 7pm | Charlotte-based, serving Monroe and Union County",
      ],
    ],
  },
  "areas-served-charlotte-nc": {
    seoDescription:
      "Charlotte-based, owner-operated glass and door company serving Charlotte, NC. Frameless showers, windows, doors, repairs, and commercial glass. Call (704) 771-6111.",
    legacySeoDescriptions: [
      "Owner-operated glass and door services in Charlotte, NC. Frameless showers, window installation, door installation and window repair by Doug.",
      "Personal, owner-operated glass and door services for Charlotte, NC homeowners. Frameless showers, window installation, door installation, window repair, and commercial glass. 15+ years of experience. Call (704) 771-6111.",
    ],
    replacements: [
      [
        "Personal, owner-operated frameless shower doors, window and door installation, window repair, and commercial glass — for homeowners and businesses throughout Charlotte, NC.",
        "Charlotte-based, owner-operated frameless shower doors, window and door installation, window repair, and commercial glass.",
      ],
      [
        "Owner-Operated Glass & Door Service in Charlotte",
        "Your Charlotte-Based Glass & Door Company",
      ],
      ["Personal Service for Charlotte Homeowners", "Your Charlotte-Based Glass & Door Company"],
      [
        "<p>Charlotte has no shortage of glass and door companies — but most of them have something in common: when you call, you talk to a salesperson. When the crew shows up, they're subcontractors. When something needs follow-up, you're calling a 1-800 number.</p><p>Glass and Door Pro is different. I'm Doug — owner, operator, and the person who'll actually come measure your project, plan it with you, and install it myself. I've been doing this work in the greater Charlotte area for 15+ years, and the reason I keep getting referrals is simple: the person who quotes the job is the person who does the job.</p><p>We're based in Monroe, just 30-40 minutes from most Charlotte addresses, and the greater Charlotte metro is our primary service area. Whether you're remodeling a master bathroom in SouthPark, replacing a foggy bedroom window in NoDa, or putting a new entry door on a craftsman bungalow in Dilworth, this is the work I do every week.</p>",
        "<p>Glass and Door Pro is based in South Charlotte, with a business address at 6135 Park South Drive, Suite 542, Charlotte, NC 28210. Charlotte and the surrounding metro are our primary service area.</p><p>I'm Doug — owner, operator, and the person who'll actually come measure your project, plan it with you, and install it myself. I've been doing this work in the greater Charlotte area for 15+ years, and the reason I keep getting referrals is simple: the person who quotes the job is the person who does the job.</p><p>Whether you're remodeling a master bathroom in SouthPark, replacing a foggy bedroom window in NoDa, or putting a new entry door on a craftsman bungalow in Dilworth, this is the work I do every week. Saturday appointments are available.</p>",
      ],
      [
        "Based in Monroe. Serving Charlotte and surrounding areas.",
        "Based in Charlotte. Serving the greater Charlotte metro and surrounding areas.",
      ],
      [
        "Do you actually come into Charlotte, or do you stay in Union County?",
        "Where is Glass and Door Pro based?",
      ],
      [
        "<p>We work throughout Charlotte regularly. Glass and Door Pro is based in Monroe, but the greater Charlotte metro is our primary service area. We have clients across South Charlotte, Ballantyne, SouthPark, Myers Park, Dilworth, Cotswold, and most other Charlotte neighborhoods. We're typically less than 40 minutes from any Charlotte address.</p>",
        "<p>Glass and Door Pro is based in South Charlotte at 6135 Park South Drive, Suite 542, Charlotte, NC 28210. Charlotte and the greater Charlotte metro are our primary service area, including South Charlotte, Ballantyne, SouthPark, Myers Park, Dilworth, Cotswold, and surrounding neighborhoods.</p>",
      ],
      [
        "Why would I choose a Monroe-based company over a Charlotte-based one?",
        "Why choose Glass and Door Pro over a larger Charlotte glass company?",
      ],
      [
        "<p>Three reasons most clients tell us. First, Doug personally handles every project — no sales reps, no subcontracted crews. Second, our pricing tends to be more competitive than the larger Charlotte shops because our overhead is lower. Third, Saturday availability — we work Monday through Saturday. The Monroe location is only a disadvantage if you assume we don't actually work in Charlotte, which we do, every week.</p>",
        "<p>Three reasons most clients tell us. First, Doug personally handles every project — no sales reps, no subcontracted crews. Second, our pricing tends to be more competitive than larger shops because our overhead is lower. Third, Saturday availability — we work Monday through Saturday.</p>",
      ],
      [
        "Mon–Sat: 7am – 7pm | Serving the greater Charlotte metro",
        "Mon–Sat: 7am – 7pm | Based in South Charlotte",
      ],
    ],
  },
};

const legacyMonroeBaseReplacements: readonly TextReplacement[] = [
  ["Monroe-Based, Truly Local", "Charlotte-Based, Union County Service"],
  ["Charlotte-Based, Truly Local", "Charlotte-Based, Union County Service"],
  ["Truly Local", "Charlotte-Based, Regular Stallings Service"],
  ["Monroe-Based, Genuinely Local", "Charlotte-Based, Regular Local Service"],
  ["Charlotte-Based, Genuinely Local", "Charlotte-Based, Regular Local Service"],
  ["Monroe-Based, Short Drive Away", "Charlotte-Based, Regular Indian Land Service"],
  ["Charlotte-Based, Short Drive Away", "Charlotte-Based, Regular Indian Land Service"],
  ["Monroe-Based, Right Across the Border", "Charlotte-Based, Regular Fort Mill Service"],
  ["Charlotte-Based, Right Across the Border", "Charlotte-Based, Regular Fort Mill Service"],
  [
    "<p>Indian Trail has grown fast — and with that growth comes a lot of homeowners upgrading aging houses, finishing bathrooms that were never quite done, and putting real money into properties that now sit at real values. The glass and door work that gets done in Indian Trail reflects that — more frameless shower enclosures, more window replacements in homes from the late 90s and early 2000s, more entry door upgrades as people put finishing touches on homes they plan to stay in.</p><p>Glass and Door Pro is based in Monroe, which means Indian Trail is right in our backyard. Doug handles every project personally — there's no subcontractor showing up, no crew you haven't met. When you call for a quote, you're talking to the person who will measure the job and install the work. That's a different experience than calling a franchise and getting whoever is available.</p><p>Whether you're adding a frameless glass enclosure to a master bath remodel, replacing foggy windows in a guest room, or installing a new entry door before a home sale, the process starts with a clear quote and ends with work you're happy with. Saturday appointments are available for homeowners who can't take a weekday off.</p>",
    "<p>Indian Trail has grown fast — and with that growth comes a lot of homeowners upgrading aging houses, finishing bathrooms that were never quite done, and putting real money into properties that now sit at real values. The glass and door work that gets done in Indian Trail reflects that — more frameless shower enclosures, more window replacements in homes from the late 90s and early 2000s, more entry door upgrades as people put finishing touches on homes they plan to stay in.</p><p>Glass and Door Pro is based in Charlotte and serves Indian Trail regularly. Doug handles every project personally — there's no subcontractor showing up, no crew you haven't met. When you call for a quote, you're talking to the person who will measure the job and install the work. That's a different experience than calling a franchise and getting whoever is available.</p><p>Whether you're adding a frameless glass enclosure to a master bath remodel, replacing foggy windows in a guest room, or installing a new entry door before a home sale, the process starts with a clear quote and ends with work you're happy with. Saturday appointments are available for homeowners who can't take a weekday off.</p>",
  ],
  [
    "We're not a Charlotte company that occasionally drives to Union County. Glass and Door Pro is based in Monroe and Indian Trail is one of our most consistent service areas.",
    "Glass and Door Pro is based in Charlotte, and Indian Trail is one of our most consistent Union County service areas.",
  ],
  [
    "Are you actually based near Indian Trail, or do you come from Charlotte?",
    "Do you serve Indian Trail from Charlotte?",
  ],
  [
    "<p>Glass and Door Pro is based in Monroe, NC — which puts us right in Indian Trail's backyard. We work in Indian Trail regularly and don't charge travel fees for Union County service areas. When you call, you're getting a local company, not a Charlotte franchise routing work to whoever is closest.</p>",
    "<p>Yes. Glass and Door Pro is based in Charlotte and works in Indian Trail regularly. We don't charge travel fees for Union County service areas, and every project is handled directly by Doug.</p>",
  ],
  [
    "Based in Monroe, we're closer to Stallings than most Charlotte-based glass companies. No travel surcharges, no scheduling delays because we're booked out across the metro.",
    "Stallings is a regular part of our service area, with no travel surcharges and straightforward scheduling from our Charlotte home base.",
  ],
  [
    "We're not a large Charlotte operation that services Union County when it's convenient. Monroe is home base, and Wesley Chapel is right in our regular service rotation.",
    "We're not a large operation routing you to whoever is available. Charlotte is home base, and Wesley Chapel is right in our regular service rotation.",
  ],
  [
    "<p>Wesley Chapel is a regular part of our schedule — we're out there multiple times a week. Based in Monroe, we cover all of Union County without travel fees or minimum project requirements.</p>",
    "<p>Wesley Chapel is a regular part of our schedule. From our Charlotte home base, we serve Union County without travel fees or minimum project requirements.</p>",
  ],
  [
    "We're based right next door in Monroe. Waxhaw is a regular part of our weekly schedule, not an occasional out-of-area trip.",
    "Waxhaw is a regular part of our weekly schedule from our Charlotte home base, not an occasional out-of-area trip.",
  ],
  [
    "Do you serve Matthews even though you're based in Monroe?",
    "Do you serve Matthews from Charlotte?",
  ],
  [
    "<p>Yes. Matthews is a regular part of our service area — we're out there consistently and don't add travel fees for Mecklenburg County locations. Monroe is close enough that Matthews is a short drive, and we schedule Matthews visits the same way as any other area.</p>",
    "<p>Yes. Matthews is a regular part of our service area from our Charlotte home base. We work there consistently and don't add travel fees for Mecklenburg County locations.</p>",
  ],
  [
    "Monroe is right across the border from Indian Land. We're closer to many Indian Land neighborhoods than most Charlotte-based glass companies.",
    "Indian Land is a regular part of our service area from our South Charlotte home base, with no additional location fees.",
  ],
  [
    "We're closer to Fort Mill than most Charlotte glass companies. Monroe is just across the state line, and Fort Mill is a regular part of our weekly schedule.",
    "Fort Mill is a regular part of our weekly schedule from our South Charlotte home base, with no additional location fees.",
  ],
  ["Monroe is home base", "Charlotte is home base"],
  ["Monroe-Based", "Charlotte-Based"],
  ["Monroe-based", "Charlotte-based"],
  ["based in Monroe, NC", "based in Charlotte, NC"],
  ["Based in Monroe, NC", "Based in Charlotte, NC"],
  ["based in Monroe", "based in Charlotte"],
  ["Based in Monroe", "Based in Charlotte"],
];

function replaceStoredStrings(value: unknown, replacements: readonly TextReplacement[]): unknown {
  if (typeof value === "string") {
    return replacements.reduce(
      (text, [currentValue, newValue]) => text.replaceAll(currentValue, newValue),
      value,
    );
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const updated = replaceStoredStrings(item, replacements);
      if (updated !== item) changed = true;
      return updated;
    });
    return changed ? next : value;
  }

  if (isRecord(value)) {
    let changed = false;
    const next = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const updated = replaceStoredStrings(item, replacements);
        if (updated !== item) changed = true;
        return [key, updated];
      }),
    );
    return changed ? next : value;
  }

  return value;
}

function updateStoredBusinessDetails(value: unknown): unknown {
  return replaceStoredStrings(value, [
    ...businessHoursReplacements,
    ...businessAddressReplacements,
  ]);
}

// Migrate only the two previously published complete link lists, preserving
// surrounding copy and any independently edited/custom lists.
const legacyServiceAreaListReplacements: TextReplacement[] = [
  [
    "Charlotte",
    "Monroe",
    "Indian Trail",
    "Stallings",
    "Wesley Chapel",
    "Waxhaw",
    "Matthews",
    "Weddington",
    "Pineville",
    "Fort Mill",
    "Indian Land",
  ],
  [
    "Charlotte",
    "Matthews",
    "Indian Trail",
    "Monroe",
    "Waxhaw",
    "Fort Mill",
    "Indian Land",
    "Pineville",
    "Weddington",
    "Wesley Chapel",
    "Stallings",
  ],
].map((labels) => [
  labels
    .map(
      (label) =>
        `<a href="/service-areas/${label.toLowerCase().replaceAll(" ", "-")}">${label}</a>`,
    )
    .join(", "),
  GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML,
]);

const legacyPlainServiceAreaListReplacements: TextReplacement[] = [
  "Charlotte, Monroe, Indian Trail, Stallings, Wesley Chapel, Waxhaw, Matthews, Weddington, Indian Land, Fort Mill, Pineville",
  "Charlotte, Monroe, Indian Trail, Stallings, Wesley Chapel, Waxhaw, Matthews, Weddington, Pineville, Fort Mill, Indian Land",
  "Charlotte, Monroe, Indian Trail, Matthews, Waxhaw",
  "Monroe, Charlotte, Indian Trail, Matthews, Waxhaw",
  "Charlotte, Monroe, Indian Trail",
].map((list) => [list, GLASS_PRIMARY_SERVICE_AREA_NAMES]);

function shouldEnsureRelatedCommercialServicesBlock(content: unknown) {
  if (!isRecord(content)) return false;
  const systemMeta = content._system ?? content.system;
  return isRecord(systemMeta) && systemMeta.ensureRelatedCommercialServices === true;
}

async function ensureCommercialDoorInstallationRelatedServicesBlock() {
  const page = await storage.cmsPages.getPageBySlug(commercialDoorInstallationSlug);
  if (!page) return;
  if (!shouldEnsureRelatedCommercialServicesBlock(page.content)) return;

  const content = addRelatedCommercialServicesBlock(page.content);
  if (!content) return;

  await storage.cmsPages.updatePage(page.id, {
    content,
    updatedBy: page.updatedBy,
  });
}

async function normalizeStoredCmsPages() {
  const pages = await storage.cmsPages.getAllPages();

  for (const page of pages) {
    const updates: {
      seoTitle?: string;
      seoDescription?: string | null;
      content?: InsertCmsPage["content"];
      noindex?: boolean;
      updatedBy?: string | null;
    } = {};
    const correctedTitle = correctGlassSearchTitle(page.slug, page.seoTitle);
    if (correctedTitle && correctedTitle !== page.seoTitle) {
      updates.seoTitle = correctedTitle;
    }
    const normalized = normalizeSeoDescription(page.seoDescription);
    if (normalized !== page.seoDescription) {
      updates.seoDescription = normalized;
    }

    if (isGlassLegalNoindexSlug(page.slug) && page.noindex !== true) {
      updates.noindex = true;
    }

    const currentResidentialUrl = residentialServicePageUrlsBySlug[page.slug];
    if (currentResidentialUrl) {
      const content = addRelatedServicesBlock(page.content, currentResidentialUrl);
      if (content) updates.content = content as InsertCmsPage["content"];
    }

    if (page.slug === "home") {
      const content = ensureHomepageServiceCards(page.content);
      if (content) updates.content = content as InsertCmsPage["content"];

      const contentWithReviews = ensureGoogleReviewItems(updates.content ?? page.content, true);
      if (contentWithReviews) updates.content = contentWithReviews as InsertCmsPage["content"];
    }

    if (page.slug === "reviews") {
      const content = ensureGoogleReviewItems(page.content, false);
      if (content) updates.content = content as InsertCmsPage["content"];
    }

    if (
      page.slug === "privacy-policy" &&
      JSON.stringify(page.content).includes(GLASS_PRIVACY_POLICY_LEGACY_MARKER)
    ) {
      updates.content = buildPrivacyPolicyContent();
    }

    const cityPositioningUpdate = cityPositioningUpdates[page.slug];
    if (cityPositioningUpdate) {
      const currentSeoDescription = updates.seoDescription ?? page.seoDescription;
      if (
        currentSeoDescription &&
        cityPositioningUpdate.legacySeoDescriptions.includes(currentSeoDescription)
      ) {
        updates.seoDescription = cityPositioningUpdate.seoDescription;
      }

      const positionedContent = replaceStoredStrings(
        updates.content ?? page.content,
        cityPositioningUpdate.replacements,
      );
      if (positionedContent !== (updates.content ?? page.content)) {
        updates.content = positionedContent as InsertCmsPage["content"];
      }
    }

    const currentSeoDescription = updates.seoDescription ?? page.seoDescription;
    const seoDescriptionWithoutLegacyMonroeBase = replaceStoredStrings(
      currentSeoDescription,
      legacyMonroeBaseReplacements,
    );
    if (seoDescriptionWithoutLegacyMonroeBase !== currentSeoDescription) {
      updates.seoDescription = seoDescriptionWithoutLegacyMonroeBase as string;
    }

    const contentWithoutLegacyMonroeBase = replaceStoredStrings(
      updates.content ?? page.content,
      legacyMonroeBaseReplacements,
    );
    if (contentWithoutLegacyMonroeBase !== (updates.content ?? page.content)) {
      updates.content = contentWithoutLegacyMonroeBase as InsertCmsPage["content"];
    }

    const contentWithCurrentBusinessDetails = updateStoredBusinessDetails(
      updates.content ?? page.content,
    );
    if (contentWithCurrentBusinessDetails !== (updates.content ?? page.content)) {
      updates.content = contentWithCurrentBusinessDetails as InsertCmsPage["content"];
    }

    const contentWithServiceAreaOrder = replaceStoredStrings(
      updates.content ?? page.content,
      legacyServiceAreaListReplacements,
    );
    if (contentWithServiceAreaOrder !== (updates.content ?? page.content)) {
      updates.content = contentWithServiceAreaOrder as InsertCmsPage["content"];
    }

    const contentWithPlainServiceAreaOrder = replaceStoredStrings(
      updates.content ?? page.content,
      legacyPlainServiceAreaListReplacements,
    );
    if (contentWithPlainServiceAreaOrder !== (updates.content ?? page.content)) {
      updates.content = contentWithPlainServiceAreaOrder as InsertCmsPage["content"];
    }

    if (Object.keys(updates).length > 0) {
      await storage.cmsPages.updatePage(page.id, {
        ...updates,
        updatedBy: page.updatedBy,
      });
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isSystemRetiredCmsPageContent(content: unknown) {
  if (!isRecord(content)) return false;

  if (SYSTEM_RETIRED_PAGE_MARKERS.some((key) => content[key] === true)) {
    return true;
  }

  const systemMeta = content._system ?? content.system;
  return (
    isRecord(systemMeta) && SYSTEM_RETIRED_PAGE_MARKERS.some((key) => systemMeta[key] === true)
  );
}

export async function ensureSystemCmsPages() {
  await normalizeStoredCmsPages();

  for (const retiredSlug of [
    "about",
    "contact",
    "directory",
    "events",
    "insights",
    "join",
    "recordings",
  ]) {
    const existingPage = await storage.cmsPages.getPageBySlug(retiredSlug);
    if (
      existingPage &&
      isSystemRetiredCmsPageContent(existingPage.content) &&
      (existingPage.status !== "draft" || existingPage.noindex !== true)
    ) {
      await storage.cmsPages.updatePage(existingPage.id, {
        status: "draft",
        noindex: true,
        updatedBy: existingPage.updatedBy,
      });
    }
  }

  await ensureCommercialDoorInstallationRelatedServicesBlock();

  const existingPrivacyPolicy = await storage.cmsPages.getPageBySlug("privacy-policy");
  if (!existingPrivacyPolicy) {
    await storage.cmsPages.createPage({
      title: "Privacy Policy",
      slug: "privacy-policy",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildPrivacyPolicyContent(),
      seoTitle: "Privacy Policy | Glass & Door Pro",
      seoDescription:
        "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
      seoKeywords:
        "Glass & Door Pro privacy policy, Charlotte glass company privacy, customer information",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: true,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }

  const existingTermsOfService = await storage.cmsPages.getPageBySlug("terms-of-service");
  if (!existingTermsOfService) {
    await storage.cmsPages.createPage({
      title: "Terms of Service",
      slug: "terms-of-service",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildTermsOfServiceContent(),
      seoTitle: "Terms of Service | Glass & Door Pro",
      seoDescription:
        "Review Glass & Door Pro website terms for estimates, service information, third-party links, and site content.",
      seoKeywords:
        "Glass & Door Pro terms of service, Charlotte glass company terms, website terms",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: true,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }

  const existingDisclaimer = await storage.cmsPages.getPageBySlug("disclaimer");
  if (!existingDisclaimer) {
    await storage.cmsPages.createPage({
      title: "Disclaimer",
      slug: "disclaimer",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildDisclaimerContent(),
      seoTitle: "Disclaimer | Glass & Door Pro",
      seoDescription:
        "Review Glass & Door Pro disclaimers about website information, estimates, repair recommendations, pricing, and commercial work.",
      seoKeywords:
        "Glass & Door Pro disclaimer, glass service disclaimer, Charlotte glass company disclaimer",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: false,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  }
}
