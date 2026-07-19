import { randomUUID } from "crypto";
import { storage } from "../storage";
import { normalizeSeoDescription } from "@shared/seo-description";
import { GLASS_HOMEPAGE_SERVICE_CARDS } from "@shared/glass-homepage-services";
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
          content:
            '<p><strong>Last updated:</strong> June 9, 2026</p><p>Glass &amp; Door Pro is a glass, window, and door company located at 2341 Waverly Dr, Monroe, NC 28112. Our website address is <a href="https://glassanddoorpro.com">glassanddoorpro.com</a>.</p><h2>Information We Collect</h2><p>We collect information you provide directly when you contact us, including your name, phone number, email address, service address if provided, and a description of your glass, window, door, shower, or commercial glass project. This information is used solely to respond to your inquiry, provide an estimate, schedule service, document warranty or service history, and communicate with you about your project.</p><p>If you submit our contact form, we receive and store the information contained in the form submission. This information is used only to respond to your request and manage the service relationship. We do not sell or share this information with third parties for marketing purposes.</p><h2>Cookies &amp; Analytics</h2><p>Our website may use cookies and analytics tools, such as Google Analytics, to understand how visitors find and use the site. This data is aggregated and used to improve the website, measure performance, and understand which services visitors are interested in. We do not use analytics data to personally identify individual visitors. You can disable cookies in your browser settings at any time.</p><h2>Third-Party Services</h2><p>Our website may embed maps from Google Maps or link to third-party services such as Google Business Profile, phone links, review platforms, or other tools used to help customers contact or locate us. These third-party services are subject to their own privacy policies. We do not control their data practices.</p><h2>Data Retention</h2><p>We retain contact form submissions, estimate details, project notes, customer records, and related communications for the duration of our business relationship and as needed for warranty, service documentation, accounting, and legal recordkeeping purposes. We do not retain customer payment card information on this website.</p><p>You may contact us at any time to request access to, correction of, or deletion of personal information we hold about you, subject to any records we are required or permitted to retain for legitimate business, warranty, accounting, or legal purposes.</p><h2>Changes to This Policy</h2><p>We may update this privacy policy from time to time. The date at the top of this page reflects the most recent update.</p><h2>Contact Us</h2><p>Questions about this privacy policy can be directed to Glass &amp; Door Pro at <a href="tel:+17047716111">(704) 771-6111</a>, through our contact page, or by mail to 2341 Waverly Dr, Monroe, NC 28112.</p>',
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
            '<p><strong>Last updated:</strong> June 9, 2026</p><h2>1. About This Website</h2><p>This website is operated by Glass &amp; Door Pro, located at 2341 Waverly Dr, Monroe, NC 28112. By accessing or using this website, you agree to these terms. If you do not agree, please do not use the site.</p><h2>2. Informational Purpose Only</h2><p>The content on this website, including service descriptions, pricing references, process descriptions, project photos, reviews, and any other information, is provided for general informational purposes only. Nothing on this website constitutes a binding estimate, quote, contract, warranty, or commitment to perform any service.</p><p>All project details, pricing, scope of work, scheduling, and warranty terms are established directly between Glass &amp; Door Pro and the customer through a separate estimate and service agreement process. No website content creates or modifies that agreement.</p><h2>3. Estimates and Service Agreements</h2><p>Submitting a contact form or requesting an estimate through this website does not create a service agreement or obligate Glass &amp; Door Pro to perform any work. A binding service agreement is formed only when both parties have agreed in writing to a specific scope of work, pricing, and terms.</p><p>Free estimates are offered as a courtesy and do not guarantee availability, pricing, or scheduling. Glass &amp; Door Pro reserves the right to decline any project at its discretion.</p><h2>4. Accuracy of Information</h2><p>Glass &amp; Door Pro makes reasonable efforts to keep the information on this website accurate and current. However, we do not warrant that all content is complete, accurate, or up to date at all times. Service offerings, product availability, hours, service areas, and other details may change. Confirm current information directly with Glass &amp; Door Pro before making decisions based on website content.</p><h2>5. Intellectual Property</h2><p>All content on this website, including text, photography, graphics, logos, and page structure, is the property of Glass &amp; Door Pro or is used with permission. You may not reproduce, distribute, republish, or use any content from this website for commercial purposes without express written permission from Glass &amp; Door Pro.</p><p>Customer reviews displayed on this website are reproduced with the understanding that they were submitted as public reviews. If you believe your content has been used in error, contact us and we will address it promptly.</p><h2>6. Third-Party Links</h2><p>This website may contain links to third-party websites, including Google Maps, Google Business Profile, manufacturer websites, review platforms, and other external services. These links are provided for convenience only. Glass &amp; Door Pro does not control third-party sites and is not responsible for their content, accuracy, or privacy practices. Accessing a third-party site from a link on our website is at your own risk. See our Privacy Policy for more information about how we handle information submitted through this website.</p><h2>7. Limitation of Liability</h2><p>To the fullest extent permitted by applicable law, Glass &amp; Door Pro and its owners, employees, contractors, and agents shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of this website or reliance on any information contained herein.</p><h2>8. Disclaimer of Warranties</h2><p>This website is provided "as is" without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement. Glass &amp; Door Pro does not warrant that the website will be available without interruption or free from errors.</p><h2>9. Governing Law</h2><p>These terms are governed by the laws of the State of North Carolina, without regard to its conflict of law provisions. Any disputes arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Union County, North Carolina.</p><h2>10. Changes to These Terms</h2><p>Glass &amp; Door Pro reserves the right to update or modify these terms at any time without prior notice. The date at the top of this page reflects the most recent update. Continued use of the website after changes are posted constitutes acceptance of the updated terms.</p><h2>11. Contact</h2><p>Questions about these terms can be directed to Glass &amp; Door Pro:</p><p>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
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
            '<p><strong>Last updated:</strong> June 9, 2026</p><h2>General Information Only</h2><p>The content published on this website is provided for general informational purposes only. It describes the types of services Glass &amp; Door Pro typically offers and the general conditions under which those services are performed. It does not constitute professional advice, a formal assessment, or a recommendation specific to any individual property, window, glass unit, door, shower enclosure, commercial opening, or building condition.</p><h2>Conditions Vary by Property</h2><p>Glass, window, door, shower, and commercial glass recommendations depend heavily on the specific condition of the product, the installation, the surrounding structure, and factors that can only be assessed through an in-person inspection. Information on this website, including descriptions of repair versus replacement criteria, typical repair processes, and expected outcomes, reflects general experience and may not apply to your specific situation. No assessment or recommendation is valid without a direct evaluation by Glass &amp; Door Pro.</p><h2>Manufacturer Warranty Coverage</h2><p>References to manufacturer warranties, warranty service, product defects, or product eligibility on this website are general in nature. Warranty coverage for any specific product depends on the manufacturer&apos;s warranty terms, the product&apos;s eligibility, proof of purchase, installation documentation, the nature of the defect or failure, and other factors determined by the manufacturer. Glass &amp; Door Pro cannot confirm warranty coverage or eligibility without reviewing the product and documentation directly. Any manufacturer or product reference does not guarantee that a specific claim will be approved by the manufacturer. Contact Glass &amp; Door Pro for project-specific questions.</p><h2>Pricing and Availability</h2><p>Any pricing references, ranges, or cost comparisons on this website are general in nature and do not constitute a quote or estimate for any specific project. Actual pricing depends on product specifications, site conditions, measurements, finish selections, hardware, parts availability, access requirements, and other factors assessed at the time of the estimate. Availability of services, scheduling, and parts is subject to change without notice. See our Terms of Service for additional information about estimates and service agreements.</p><h2>Commercial Work</h2><p>Descriptions of commercial glass services on this website are general in nature. Commercial project scope, access requirements, permitting, insurance requirements, and applicable code standards vary significantly by property type, location, and jurisdiction. No description on this website should be relied upon as a complete characterization of what a commercial project will require.</p><h2>No Liability</h2><p>Glass &amp; Door Pro makes reasonable efforts to ensure the accuracy of information on this website but does not warrant that all content is current, complete, or error-free. Glass &amp; Door Pro and its owners, employees, contractors, and agents are not liable for any decisions made or actions taken in reliance on information published on this website.</p><h2>Contact</h2><p>If you have questions about a specific project or situation, contact us directly rather than relying on website content.</p><p>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112<br><a href="tel:+17047716111">(704) 771-6111</a></p>',
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

const businessHoursReplacements = [
  ["7am - 6pm", "7am - 7pm"],
  ["7am – 6pm", "7am – 7pm"],
  ["7am–6pm", "7am–7pm"],
  ["7 AM to 6 PM", "7 AM to 7 PM"],
] as const;

function updateBusinessHours(value: unknown): unknown {
  if (typeof value === "string") {
    return businessHoursReplacements.reduce(
      (text, [currentHours, newHours]) => text.replaceAll(currentHours, newHours),
      value,
    );
  }

  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const updated = updateBusinessHours(item);
      if (updated !== item) changed = true;
      return updated;
    });
    return changed ? next : value;
  }

  if (isRecord(value)) {
    let changed = false;
    const next = Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const updated = updateBusinessHours(item);
        if (updated !== item) changed = true;
        return [key, updated];
      }),
    );
    return changed ? next : value;
  }

  return value;
}

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
      seoDescription?: string | null;
      content?: InsertCmsPage["content"];
      updatedBy?: string | null;
    } = {};
    const normalized = normalizeSeoDescription(page.seoDescription);
    if (normalized !== page.seoDescription) {
      updates.seoDescription = normalized;
    }

    const currentResidentialUrl = residentialServicePageUrlsBySlug[page.slug];
    if (currentResidentialUrl) {
      const content = addRelatedServicesBlock(page.content, currentResidentialUrl);
      if (content) updates.content = content as InsertCmsPage["content"];
    }

    if (page.slug === "home") {
      const content = ensureHomepageServiceCards(page.content);
      if (content) updates.content = content as InsertCmsPage["content"];
    }

    const contentWithCurrentHours = updateBusinessHours(updates.content ?? page.content);
    if (contentWithCurrentHours !== (updates.content ?? page.content)) {
      updates.content = contentWithCurrentHours as InsertCmsPage["content"];
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
      noindex: false,
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
      noindex: false,
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
