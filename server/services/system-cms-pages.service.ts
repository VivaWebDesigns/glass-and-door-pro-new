import { randomUUID } from "crypto";
import { storage } from "../storage";
import { mergeJoinHeroBlocks, type CmsBuilderBlock } from "@shared/cms-blocks";
import type { SidebarWidget } from "@shared/schema";

function id() {
  return randomUUID();
}

function buildInsightsContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "section-header",
        props: {
          eyebrow: "Core Platform Blog",
          title: "Insights & Articles",
          subtitle: "Explore articles, research, and insights on Third Culture Kid mental health and cross-cultural counseling.",
          alignment: "center",
        },
      },
      {
        id: id(),
        type: "blog-featured-post",
        props: {
          title: "Featured Article",
          layout: "split",
        },
      },
      {
        id: id(),
        type: "blog-post-feed",
        props: {
          title: "All Articles",
          postsPerPage: 9,
          gridColumns: "3",
          feedStyle: "pagination",
          showSearch: true,
          showCategoryFilter: true,
          showTagFilter: true,
        },
      },
    ],
  };
}

function buildEventsContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "events-archive",
        props: {
          heading: "Upcoming Events",
          subheading:
            "We offer quarterly Core Platform-informed trainings for professional providers. All of our members get free registration to the events below.",
          defaultView: "list",
          showViewToggle: true,
        },
      },
    ],
  };
}

function buildRecordingsContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "video-archives",
        props: {
          heading: "Video Archives",
          subheading: "Browse our collection of past trainings and webinars.",
          showSearch: true,
          showYearFilter: true,
          showAccessFilter: true,
        },
      },
    ],
  };
}

function buildDirectoryContent() {
  return {
    blocks: [
      {
        id: id(),
        type: "directory-browser",
        props: {
          heading: "Find a Mental Health Professional",
          subheading:
            "Search for Core Platform-informed care by specialty, location, language, or session format, then explore results on the map.",
          showCategoryChips: true,
          showMap: true,
        },
      },
      {
        id: id(),
        type: "text-image",
        props: {
          heading: "Why Core Platform Informed?",
          body:
            "Traditional therapy models were developed within a single cultural framework. When Core Platforms bring their experiences to these frameworks, important aspects of their story can be misunderstood or pathologized. A Core Platform-informed mental health professional understands concepts like ambiguous loss, hidden immigrants, cultural marginality, and grief of place. They recognize that growing up across cultures creates both remarkable strengths and unique challenges — and they know how to work with both.",
          imageUrl:
            "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&h=1200&fit=crop&crop=faces",
          imageAlt: "Core Platform-informed counseling",
          imagePosition: "left",
        },
      },
      {
        id: id(),
        type: "rich-text",
        props: {
          title: 'What does it mean to be "vetted"?',
          subtitle: 'And just as importantly, what it does not mean.',
          content:
            "<h3>What does it mean to be &ldquo;vetted&rdquo;?</h3><ul><li>Every mental health professional completes a detailed application process</li><li>Credentials and licensure are verified</li><li>Training or lived experience with Core Platform/cross-cultural populations is required</li><li>Profiles are reviewed by our team before being published</li></ul><h3>What does it NOT mean to be &ldquo;vetted&rdquo;?</h3><ul><li>We are not a licensing or credentialing body</li><li>We do not provide clinical supervision</li><li>Listing does not constitute an endorsement of specific therapeutic outcomes</li><li>We do not guarantee a therapeutic match, but we make finding one easier</li></ul>",
          alignment: "left",
          sectionBackgroundColor: "#f6f7f5",
          sectionShowRadialGradient: true,
          sectionRadialGradientPosition: "bottom",
        },
      },
    ],
  };
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

function buildDefaultBlogSidebarWidgets(): SidebarWidget[] {
  return [
    {
      id: id(),
      type: "search",
      title: "Search",
      settings: {},
    },
    {
      id: id(),
      type: "recent-posts",
      title: "Recent Posts",
      settings: { limit: 5 },
    },
    {
      id: id(),
      type: "categories",
      title: "Categories",
      settings: {},
    },
    {
      id: id(),
      type: "tag-cloud",
      title: "Popular Topics",
      settings: {},
    },
    {
      id: id(),
      type: "newsletter",
      title: "Stay Connected",
      settings: {
        description: "Get Core Platform-informed articles, events, and resources in your inbox.",
        buttonText: "Sign Up",
        formSlug: "newsletter-signup",
      },
    },
  ];
}

function contentWithMergedJoinHero(rawContent: unknown): Record<string, unknown> | null {
  if (!rawContent || typeof rawContent !== "object") return null;

  const content = rawContent as Record<string, unknown>;
  if (!Array.isArray(content.blocks)) return null;

  const blocks = content.blocks as CmsBuilderBlock[];
  const mergedBlocks = mergeJoinHeroBlocks(blocks);

  if (JSON.stringify(blocks) === JSON.stringify(mergedBlocks)) {
    return null;
  }

  return {
    ...content,
    blocks: mergedBlocks,
  };
}

export async function ensureSystemCmsPages() {
  const defaultBlogSidebar = await storage.cmsSidebars.getDefault();
  if (!defaultBlogSidebar) {
    await storage.cmsSidebars.create({
      name: "Blog Sidebar",
      description: "Default sidebar for Insights & Articles and blog posts.",
      isDefault: true,
      widgets: buildDefaultBlogSidebarWidgets(),
    });
  }

  const existingInsights = await storage.cmsPages.getPageBySlug("insights");
  if (!existingInsights) {
    await storage.cmsPages.createPage({
      title: "Insights & Articles",
      slug: "insights",
      pageType: "custom",
      template: "with-sidebar",
      status: "published",
      content: buildInsightsContent(),
      seoTitle: "Insights & Articles | Core Platform",
      seoDescription: "Explore articles, research, and insights on Third Culture Kid mental health and cross-cultural counseling.",
      seoKeywords: "",
      ogImageUrl: "",
      canonicalUrl: "",
      noindex: false,
      publishedAt: new Date(),
      scheduledAt: null,
      createdBy: null,
      updatedBy: null,
      sidebarId: null,
    });
  } else if (existingInsights.template !== "with-sidebar") {
    await storage.cmsPages.updatePage(existingInsights.id, {
      template: "with-sidebar",
      updatedBy: existingInsights.updatedBy,
    });
  }

  const existingEvents = await storage.cmsPages.getPageBySlug("events");
  if (!existingEvents) {
    await storage.cmsPages.createPage({
      title: "Events",
      slug: "events",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildEventsContent(),
      seoTitle: "Upcoming Events | Core Platform",
      seoDescription: "Explore upcoming Core Platform trainings, workshops, and community events.",
      seoKeywords: "",
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

  const existingRecordings = await storage.cmsPages.getPageBySlug("recordings");
  if (!existingRecordings) {
    await storage.cmsPages.createPage({
      title: "Video Archives",
      slug: "recordings",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildRecordingsContent(),
      seoTitle: "Video Archives | Core Platform",
      seoDescription: "Watch past Core Platform trainings and webinars from the video archives.",
      seoKeywords: "",
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

  const existingDirectory = await storage.cmsPages.getPageBySlug("directory");
  if (!existingDirectory) {
    await storage.cmsPages.createPage({
      title: "Find a Mental Health Professional",
      slug: "directory",
      pageType: "custom",
      template: "full-width",
      status: "published",
      content: buildDirectoryContent(),
      seoTitle: "Find a Mental Health Professional | Core Platform",
      seoDescription: "Browse Core Platform-informed mental health professionals by location, specialty, language, and more.",
      seoKeywords: "",
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

  const existingJoin = await storage.cmsPages.getPageBySlug("join");
  if (existingJoin) {
    const mergedContent = contentWithMergedJoinHero(existingJoin.content);
    if (mergedContent) {
      await storage.cmsPages.updatePage(existingJoin.id, {
        content: mergedContent,
        updatedBy: existingJoin.updatedBy,
      });
    }
  }

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
      seoDescription: "Review how Glass & Door Pro handles contact form details, service inquiries, cookies, analytics, and customer records.",
      seoKeywords: "Glass & Door Pro privacy policy, Charlotte glass company privacy, customer information",
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
      seoDescription: "Review Glass & Door Pro website terms for estimates, service information, third-party links, and site content.",
      seoKeywords: "Glass & Door Pro terms of service, Charlotte glass company terms, website terms",
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
      seoDescription: "Review Glass & Door Pro disclaimers about website information, estimates, repair recommendations, pricing, and commercial work.",
      seoKeywords: "Glass & Door Pro disclaimer, glass service disclaimer, Charlotte glass company disclaimer",
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
