import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CmsPage, SeoSettings } from "@shared/schema";

const mockGetSeo = vi.fn();
const mockGetSetting = vi.fn();
const mockGetPageBySlug = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    seoSettings: {
      get: mockGetSeo,
    },
    settings: {
      getSetting: mockGetSetting,
    },
    cmsPages: {
      getPageBySlug: mockGetPageBySlug,
    },
  },
}));

const seoSettings: SeoSettings = {
  id: "seo-1",
  siteName: "Glass & Door Pro",
  siteUrl: "https://glassanddoorpro.com",
  titleSuffix: " | Glass & Door Pro",
  defaultMetaDescription: "Default description",
  defaultOgImageUrl: "https://glassanddoorpro.com/og.jpg",
  defaultRobotsNoindex: false,
  organizationName: "Glass & Door Pro",
  organizationLogoUrl: null,
  facebookUrl: null,
  instagramUrl: null,
  linkedinUrl: null,
  twitterHandle: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const cmsPage: CmsPage = {
  id: "page-1",
  title: "Custom Landing Page",
  slug: "custom-landing",
  status: "published",
  pageType: "system",
  template: "full-width",
  sidebarId: null,
  content: {
    blocks: [
      {
        id: "b1",
        type: "hero",
        props: { title: "Glass Services", subtitle: "Schedule local glass and door service." },
      },
    ],
  },
  seoTitle: null,
  seoDescription: "Learn about local glass and door service.",
  seoKeywords: null,
  ogImageUrl: null,
  canonicalUrl: null,
  noindex: false,
  createdBy: null,
  updatedBy: null,
  scheduledAt: null,
  publishedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("public-prerender.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetSetting.mockResolvedValue(null);
    mockGetPageBySlug.mockResolvedValue(undefined);
  });

  it("returns a prerender snapshot for published CMS pages", async () => {
    mockGetPageBySlug.mockResolvedValue(cmsPage);
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/custom-landing");

    expect(snapshot?.title).toContain("Custom Landing Page");
    expect(snapshot?.bodyHtml).toContain("Glass Services");
    expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/custom-landing");
  });

  it("strips pasted meta description labels from CMS prerender output", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      seoDescription: "Meta Description:\nOwner-operated glass and door services in Charlotte, NC.",
    });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/custom-landing");
    const html = injectPublicHtmlSnapshot(
      '<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id="root"></div></body></html>',
      snapshot,
    );

    expect(snapshot?.description).toBe("Owner-operated glass and door services in Charlotte, NC.");
    expect(snapshot?.cmsPage?.seoDescription).toBe(
      "Owner-operated glass and door services in Charlotte, NC.",
    );
    expect(html).toContain(
      '<meta name="description" content="Owner-operated glass and door services in Charlotte, NC." />',
    );
    expect(html).not.toContain("Meta Description:");
  });

  it("emits noindex,follow for legal CMS pages and their fallbacks", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      slug: "privacy-policy",
      title: "Privacy Policy",
      noindex: true,
    });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/privacy-policy");
    const html = injectPublicHtmlSnapshot(
      '<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id="root"></div></body></html>',
      snapshot,
    );

    expect(snapshot?.robots).toBe("noindex,follow");
    expect(html).toContain('<meta name="robots" content="noindex,follow" />');

    mockGetPageBySlug.mockResolvedValue(undefined);
    const fallbackSnapshot = await getPublicHtmlSnapshot("/terms-of-service");
    expect(fallbackSnapshot?.robots).toBe("noindex,follow");
  });

  it("emits CMS FAQPage schema and maps nested public routes to CMS slugs", async () => {
    mockGetSeo.mockResolvedValue({
      ...seoSettings,
      siteName: "Glass & Door Pro",
      siteUrl: "https://glassanddoorpro.com",
      titleSuffix: " | Glass & Door Pro",
      organizationName: "Glass & Door Pro",
    });
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Frameless Showers",
      slug: "services-frameless-showers",
      pageType: "service",
      ogImageUrl: "/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp",
      canonicalUrl: "https://glassanddoorpro.com/services/frameless-showers",
      content: {
        blocks: [
          {
            id: "faq-1",
            type: "faq",
            props: {
              items: [
                {
                  question: "How long does installation take?",
                  answer: "<p>Most frameless shower installations are completed in 2-4 hours.</p>",
                },
              ],
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/services/frameless-showers");
    const html = injectPublicHtmlSnapshot(
      '<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id="root"></div></body></html>',
      snapshot,
    );

    expect(mockGetPageBySlug).toHaveBeenCalledWith("services-frameless-showers");
    expect(snapshot?.title).toBe("Frameless Shower Doors Charlotte NC | Glass & Door Pro");
    expect(snapshot?.jsonLd?.map((schema) => schema["@type"])).toEqual([
      "LocalBusiness",
      "Service",
      "BreadcrumbList",
      "FAQPage",
    ]);
    const serviceSchema = snapshot?.jsonLd?.find((schema) => schema["@type"] === "Service");
    expect(serviceSchema?.areaServed).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Charlotte" }),
        expect.objectContaining({ name: "Monroe" }),
      ]),
    );
    expect(snapshot?.ogImageUrl).toBe(
      "https://glassanddoorpro.com/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp",
    );
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain(
      'property="og:image" content="https://glassanddoorpro.com/images/glass-door-pro/modern-frameless-shower-hero-1920x1080.webp"',
    );
    expect(html).toContain('"priceRange":"$$"');
    expect(html).not.toContain('"priceRange":"$"');
    expect(html).toContain('id="__CMS_PRERENDER_PAGE__" type="application/json"');
    expect(html).toContain('"slug":"services-frameless-showers"');
    expect(snapshot?.bodyHtml).toContain('class="seo-prerender-faqs"');
    expect(snapshot?.bodyHtml).toContain("How long does installation take?");
    expect(html).toContain("Most frameless shower installations are completed in 2-4 hours.");
  });

  it("emits real body anchors for linked CMS content and priority site links", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Commercial Door Replacement & Repair",
      slug: "services-commercial-door-replacement-repair",
      pageType: "service",
      content: {
        blocks: [
          {
            id: "linked-rich-text",
            type: "rich-text",
            props: {
              content:
                '<p>Serving <a href="/service-areas/charlotte">Charlotte</a> and nearby cities.</p>',
            },
          },
          {
            id: "related-links",
            type: "link-list",
            props: {
              links: [
                {
                  label: "Commercial Storefront Glass Installation",
                  url: "/services/commercial-storefront-glass-installation",
                  description: "Storefront installation for Charlotte businesses.",
                },
              ],
            },
          },
          {
            id: "linked-faq",
            type: "faq",
            props: {
              items: [
                {
                  question: "Do you serve Monroe?",
                  answer:
                    '<p>Yes, see our <a href="/service-areas/monroe">Monroe service area</a>.</p>',
                },
              ],
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/services/commercial-door-replacement-repair");

    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/charlotte">Charlotte</a>');
    expect(snapshot?.bodyHtml).toContain(
      '<a href="/services/commercial-storefront-glass-installation">Commercial Storefront Glass Installation</a>',
    );
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/monroe">Monroe service area</a>');
    expect(snapshot?.bodyHtml).toContain('<nav class="seo-prerender-footer"');
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/indian-trail">Indian Trail</a>');
  });

  it("keeps CMS internals out of the home prerender body", async () => {
    mockGetSeo.mockResolvedValue({
      ...seoSettings,
      siteName: "Glass & Door Pro",
      siteUrl: "https://glassanddoorpro.com",
      titleSuffix: " | Glass & Door Pro",
      organizationName: "Glass & Door Pro",
    });
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      title: "Home",
      slug: "home",
      pageType: "home",
      seoTitle: "Glass & Door Services in Charlotte & Monroe, NC",
      seoDescription:
        "Glass & Door Pro serves Charlotte and Monroe, NC with frameless shower doors, window installation, door replacement, window repair, and commercial glass.",
      content: {
        blocks: [
          {
            id: "cc1dbbbe-906e-4e1d-8731-62c3f9d3f993",
            type: "hero",
            props: {
              anchorId: "hero",
              variant: "glass-home",
              heading: "We've got your glass & door needs covered.",
              subheading: "<p>Specializing in frameless glass showers, windows, and doors.</p>",
              ctaText: "Get a Free Quote",
              ctaLink: "#contact",
              ctaAction: "internal-link",
              backgroundImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/");

    expect(snapshot?.title).toBe(
      "Glass & Door Services in Charlotte & Monroe, NC | Glass & Door Pro",
    );
    expect(snapshot?.bodyHtml).toContain(
      "<h1>Glass &amp; Door Services in Charlotte &amp; Monroe, NC</h1>",
    );
    expect(snapshot?.bodyHtml).toContain("We&#39;ve got your glass &amp; door needs covered.");
    expect(snapshot?.bodyHtml).not.toContain("cc1dbbbe");
    expect(snapshot?.bodyHtml).not.toContain("hero</p>");
    expect(snapshot?.bodyHtml).not.toContain("#contact");
    expect(snapshot?.bodyHtml).not.toContain("glass-home");
    expect(snapshot?.bodyHtml).not.toContain("internal-link");
  });

  it("returns a gallery fallback snapshot when the CMS gallery page is not seeded", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/gallery");

    expect(snapshot?.title).toContain("Gallery");
    expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/gallery");
    expect(snapshot?.bodyHtml).toContain("Glass &amp; Door Pro project photos");
  });

  it("returns a reviews fallback snapshot when the CMS reviews page is not seeded", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/reviews");

    expect(snapshot?.title).toContain("Customer Reviews");
    expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/reviews");
    expect(snapshot?.bodyHtml).toContain("Glass &amp; Door Pro customer reviews");
  });

  it("returns a services fallback snapshot when the CMS services hub is not seeded", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/services");

    expect(snapshot?.title).toContain("Glass and Door Services");
    expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/services");
    expect(snapshot?.bodyHtml).toContain("frameless shower doors");
    expect(snapshot?.bodyHtml).toContain(
      '<a href="/services/window-installation">Window Installation</a>',
    );
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/monroe">Monroe</a>');
    expect(snapshot?.jsonLd?.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(false);
    expect(snapshot?.jsonLd?.some((schema) => schema["@type"] === "ItemList")).toBe(false);
  });

  it("returns a service areas hub fallback snapshot with crawlable city links", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/service-areas");

    expect(snapshot?.title).toContain("Service Areas");
    expect(snapshot?.description).toBe(
      "Glass & Door Pro serves Charlotte, Union County, and nearby South Carolina communities with frameless showers, window installation, door installation, window repair, and commercial glass services.",
    );
    expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/service-areas");
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/charlotte">Charlotte</a>');
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/fort-mill">Fort Mill</a>');
    expect(snapshot?.bodyHtml).toContain(
      '<a href="/services/frameless-showers">Frameless Showers</a>',
    );

    const breadcrumbSchema = snapshot?.jsonLd?.find(
      (schema) => schema["@type"] === "BreadcrumbList",
    ) as { itemListElement?: Array<{ position: number; name: string; item: string }> } | undefined;
    const itemListSchema = snapshot?.jsonLd?.find((schema) => schema["@type"] === "ItemList") as
      | { itemListElement?: Array<{ position: number; name: string; url: string }> }
      | undefined;

    expect(breadcrumbSchema?.itemListElement).toEqual([
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://glassanddoorpro.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Service Areas",
        item: "https://glassanddoorpro.com/service-areas",
      },
    ]);
    expect(itemListSchema?.itemListElement).toHaveLength(11);
    expect(itemListSchema?.itemListElement?.[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Charlotte",
      url: "https://glassanddoorpro.com/service-areas/charlotte",
    });
    expect(itemListSchema?.itemListElement?.[10]).toEqual({
      "@type": "ListItem",
      position: 11,
      name: "Pineville",
      url: "https://glassanddoorpro.com/service-areas/pineville",
    });
  });

  it("does not prerender retired legacy public sections", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const aboutSnapshot = await getPublicHtmlSnapshot("/about");
    const contactSnapshot = await getPublicHtmlSnapshot("/contact");
    const directorySnapshot = await getPublicHtmlSnapshot("/directory");
    const postSnapshot = await getPublicHtmlSnapshot("/insights/old-post");
    const eventSnapshot = await getPublicHtmlSnapshot("/events/old-event");
    const recordingsSnapshot = await getPublicHtmlSnapshot("/recordings");

    expect(aboutSnapshot).toBeNull();
    expect(contactSnapshot).toBeNull();
    expect(directorySnapshot).toBeNull();
    expect(postSnapshot).toBeNull();
    expect(eventSnapshot).toBeNull();
    expect(recordingsSnapshot).toBeNull();
  });

  it("does not prerender the retired public search route", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/search", "?query=frameless+shower");

    expect(snapshot).toBeNull();
  });

  it("retrieves and injects custom public head additions", async () => {
    mockGetSetting.mockResolvedValue('<meta name="custom-test" content="enabled" />');
    const { getPublicHeadAdditions, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");
    const template =
      '<html><head><title>Default</title><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id="root"></div></body></html>';

    const headHtml = await getPublicHeadAdditions();
    const html = injectPublicHtmlSnapshot(template, null, headHtml);

    expect(headHtml).toBe('<meta name="custom-test" content="enabled" />');
    expect(html).toContain('<meta name="custom-test" content="enabled" />');
  });

  it("repairs malformed closing script tags in custom head additions", async () => {
    mockGetSetting.mockResolvedValue(
      [
        '<script async src="https://www.googletagmanager.com/gtag/js?id=G-TEST"></script',
        "<script>window.dataLayer = window.dataLayer || [];</script",
      ].join("\n"),
    );
    const { getPublicHeadAdditions } = await import("../services/public-prerender.service");

    const headHtml = await getPublicHeadAdditions();

    expect(headHtml).toContain("</script>");
    expect(headHtml).not.toContain("</script\n");
    expect(headHtml).not.toContain("</script<");
  });
});
