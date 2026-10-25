import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMobileHeroImageUrl } from "@shared/glass-hero-images";
import { GLASS_SERVICE_AREAS_HERO_IMAGE } from "@shared/glass-service-areas";
import type { CmsPage, SeoSettings } from "@shared/schema";

const heroPages = JSON.parse(
  readFileSync(new URL("../../e2e/mobile-hero-pages.json", import.meta.url), "utf8"),
) as Record<string, string>;

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
  it("keeps complete CMS copy available to readers without JavaScript", async () => {
    const comparison = `${"Custom shower layouts depend on the opening. ".repeat(12)}Compare the full enclosure options with Doug.`;
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      slug: "services-frameless-showers",
      content: {
        blocks: [
          ...Array.from({ length: 10 }, (_, index) => ({
            type: "rich-text",
            props: { content: `<p>Shower project detail ${index + 1}.</p>` },
          })),
          {
            type: "rich-text",
            props: {
              anchorId: "enclosure-options",
              title: "Enclosure options",
              content: comparison,
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/services/frameless-showers");

    expect(snapshot?.bodyHtml).toContain("Shower project detail 10.");
    expect(snapshot?.bodyHtml).toContain(`<p>${comparison}</p>`);
    expect(snapshot?.bodyHtml).toContain(
      `<section id="enclosure-options"><h2>Enclosure options</h2><p>${comparison}</p></section>`,
    );
  });

  it.each([null, "https://glassanddoorpro.com"])(
    "uses the crawled root URL for the homepage canonical with override %s",
    async (canonicalUrl) => {
      mockGetSeo.mockResolvedValue(seoSettings);
      mockGetPageBySlug.mockResolvedValue({ ...cmsPage, slug: "home", canonicalUrl });
      const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
        await import("../services/public-prerender.service");
      const snapshot = await getPublicHtmlSnapshot("/");
      expect(snapshot?.canonicalUrl).toBe("https://glassanddoorpro.com/");
      expect(injectPublicHtmlSnapshot("<head><!--APP_DYNAMIC_HEAD--></head>", snapshot)).toContain(
        '<link rel="canonical" href="https://glassanddoorpro.com/" />',
      );
    },
  );

  it("keeps anchored body copy and image captions out of heading tags", async () => {
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      slug: "home",
      content: {
        blocks: [
          {
            type: "rich-text",
            props: {
              anchorId: "intro",
              content: "Welcome to our local glass installation business.",
            },
          },
          {
            type: "image",
            props: { anchorId: "project", imageAlt: "A finished frameless shower in Charlotte." },
          },
          {
            type: "rich-text",
            props: {
              anchorId: "showers",
              title: "Frameless Showers",
              content: "Custom shower glass for your home.",
            },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/");
    expect(snapshot?.bodyHtml).toContain(
      '<section id="intro"><p>Welcome to our local glass installation business.</p>',
    );
    expect(snapshot?.bodyHtml).toContain(
      '<section id="project"><p>A finished frameless shower in Charlotte.</p>',
    );
    expect(snapshot?.bodyHtml).toContain('<section id="showers"><h2>Frameless Showers</h2>');
  });

  it.each(Object.entries(heroPages))(
    "preloads the matching mobile hero on %s",
    async (path, image) => {
      if (path !== "/service-areas") {
        mockGetPageBySlug.mockResolvedValue({
          ...cmsPage,
          content: {
            blocks: [
              {
                id: "hero",
                type: "hero",
                props: {
                  backgroundImageUrl: image,
                  variant: path === "/" ? "glass-home" : undefined,
                },
              },
            ],
          },
        });
      }
      const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
        await import("../services/public-prerender.service");
      const snapshot = await getPublicHtmlSnapshot(path);
      const head = injectPublicHtmlSnapshot("<head><!--APP_DYNAMIC_HEAD--></head>", snapshot);
      expect(head).toContain(
        `href="${getMobileHeroImageUrl(image, path === "/" ? "glass-home" : undefined)}" media="(max-width: 640px)" fetchpriority="high"`,
      );
      expect(head).toContain(`href="${image}" media="(min-width: 641px)" fetchpriority="high"`);
      expect(head.match(/rel="preload"/g)).toHaveLength(2);
    },
  );

  it("preloads the standalone service-area hero using the renderer's shared asset", async () => {
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetPageBySlug.mockResolvedValue(null);
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/service-areas");
    expect(snapshot?.heroImageUrl).toBe(GLASS_SERVICE_AREAS_HERO_IMAGE);
    const html = injectPublicHtmlSnapshot("<head><!--APP_DYNAMIC_HEAD--></head>", snapshot);
    expect(html).toContain(
      '<link rel="preload" as="image" href="/images/glass-door-pro/charming-suburban-home-hero-1920x1080-mobile-1280w.webp" media="(max-width: 640px)" fetchpriority="high" />',
    );
    expect(html).toContain(
      `<link rel="preload" as="image" href="${GLASS_SERVICE_AREAS_HERO_IMAGE}" media="(min-width: 641px)" fetchpriority="high" />`,
    );
    expect(html.match(/rel="preload"/g)).toHaveLength(2);
    const gallery = injectPublicHtmlSnapshot(
      "<head><!--APP_DYNAMIC_HEAD--></head>",
      await getPublicHtmlSnapshot("/gallery"),
    );
    expect(gallery).not.toContain('rel="preload"');
  });

  it("preloads only the leading static hero image in the document head", async () => {
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      content: {
        blocks: [
          {
            type: "hero",
            props: { backgroundImageUrl: "/images/glass-door-pro/city-waxhaw-hero.webp" },
          },
          {
            type: "hero",
            props: { backgroundImageUrl: "/images/glass-door-pro/reviews-hero-1920w.webp" },
          },
        ],
      },
    });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/custom-landing");
    const html = injectPublicHtmlSnapshot(
      "<html><head><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--></body></html>",
      snapshot,
    );
    const head = html.split("</head>")[0];
    expect(head).toContain(
      '<link rel="preload" as="image" href="/images/glass-door-pro/city-waxhaw-hero-mobile-1280w.webp" media="(max-width: 640px)" fetchpriority="high" />',
    );
    expect(head).toContain(
      '<link rel="preload" as="image" href="/images/glass-door-pro/city-waxhaw-hero.webp" media="(min-width: 641px)" fetchpriority="high" />',
    );
    expect(head.match(/rel="preload"/g)).toHaveLength(2);
    expect(head).not.toContain("reviews-hero-1920w.webp");
  });

  it.each([
    [],
    [
      { type: "text", props: {} },
      {
        type: "hero",
        props: { backgroundImageUrl: "/images/glass-door-pro/city-waxhaw-hero.webp" },
      },
    ],
    [{ type: "hero", props: {} }],
    [{ type: "hero", props: { backgroundImageUrl: '" onload="alert(1)' } }],
    [{ type: "hero", props: { backgroundImageUrl: "https://example.com/hero.webp" } }],
    [{ type: "hero", props: { backgroundImageUrl: "/uploads/cms/1781107243034-monroe.webp" } }],
  ])("does not preload non-leading, absent or unsupported hero assets (%j)", async (...blocks) => {
    mockGetPageBySlug.mockResolvedValue({ ...cmsPage, content: { blocks } });
    const { getPublicHtmlSnapshot, injectPublicHtmlSnapshot } =
      await import("../services/public-prerender.service");
    const html = injectPublicHtmlSnapshot(
      "<head><!--APP_DYNAMIC_HEAD--></head>",
      await getPublicHtmlSnapshot("/custom-landing"),
    );
    expect(html).not.toContain('rel="preload"');
  });

  it("renders a location title without the brand prefix and matches the shower heading", async () => {
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      slug: "service-areas-waxhaw",
      title: "Waxhaw, NC",
      content: {
        blocks: [
          {
            id: "hero",
            type: "hero",
            props: { heading: "Glass Shower Door Installer in Waxhaw, NC" },
          },
        ],
      },
      seoTitle: "Glass Shower Door Installation in Waxhaw, NC",
      seoDescription:
        "Custom frameless glass shower doors and enclosures, measured and installed for your Waxhaw bathroom. Call (704) 771-6111 for a free quote.",
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/service-areas/waxhaw");
    expect(snapshot?.title).toBe("Glass Shower Door Installation in Waxhaw, NC");
    expect(snapshot?.bodyHtml).toContain("<h1>Glass Shower Door Installer in Waxhaw, NC</h1>");
    expect(snapshot?.description).toContain("Call (704) 771-6111");
  });

  it("corrects the hub title without rewriting its description", async () => {
    mockGetSeo.mockResolvedValue(seoSettings);
    mockGetPageBySlug.mockResolvedValue({
      ...cmsPage,
      slug: "services",
      seoTitle: "Glass and Door Services in Charlotte & Monroe, NC",
      seoDescription: "Original description with Charlotte, Monroe and one phone: (704) 771-6111.",
    });
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const snapshot = await getPublicHtmlSnapshot("/services");
    expect(snapshot?.title).toBe("Glass & Door Pro | Glass and Door Services in Charlotte, NC");
    expect(snapshot?.description).toBe(
      "Original description with Charlotte, Monroe and one phone: (704) 771-6111.",
    );
  });

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
      "HomeAndConstructionBusiness",
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
    expect(snapshot?.bodyHtml).toContain(
      "<h2>Frequently Asked Questions</h2><h3>How long does installation take?</h3>",
    );
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
                {
                  label: "Email Doug",
                  url: "mailto:Doug@GlassandDoorPro.com",
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

    expect(snapshot?.bodyHtml).toContain(
      '<a href="/service-areas/charlotte" rel="noopener noreferrer">Charlotte</a>',
    );
    expect(snapshot?.bodyHtml).toContain(
      '<a href="/services/commercial-storefront-glass-installation">Commercial Storefront Glass Installation</a>',
    );
    expect(snapshot?.bodyHtml).toContain(
      '<a href="/service-areas/monroe" rel="noopener noreferrer">Monroe service area</a>',
    );
    expect(snapshot?.bodyHtml).toContain('<nav class="seo-prerender-footer"');
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/indian-trail">Indian Trail</a>');
    expect(snapshot?.bodyHtml).toContain(
      '<!--email_off--><a href="mailto:Doug@GlassandDoorPro.com">Email Doug</a><!--/email_off-->',
    );
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
      "Glass & Door Pro | Glass & Door Services in Charlotte & Monroe, NC",
    );
    expect(snapshot?.bodyHtml).toContain(
      "<h1>Greater Charlotte Shower Doors, Windows &amp; Doors</h1>",
    );
    expect(snapshot?.jsonLd?.map((schema) => schema["@type"])).toEqual([
      "WebSite",
      "HomeAndConstructionBusiness",
    ]);
    expect(snapshot?.jsonLd?.find((schema) => schema["@type"] === "WebSite")).toMatchObject({
      name: "Glass & Door Pro",
      alternateName: ["Glass and Door Pro", "glassanddoorpro.com"],
      url: "https://glassanddoorpro.com/",
    });
    expect(snapshot?.bodyHtml).toContain("We&#39;ve got your glass &amp; door needs covered.");
    expect(snapshot?.bodyHtml).not.toContain("cc1dbbbe");
    expect(snapshot?.bodyHtml).not.toContain("hero</p>");
    expect(snapshot?.bodyHtml).not.toContain("#contact");
    expect(snapshot?.ogImageUrl).toBe(
      "https://glassanddoorpro.com/images/glass-door-pro/home-exterior-share.jpg",
    );
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
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/pineville">Pineville</a>');
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/waxhaw">Waxhaw</a>');
    expect(snapshot?.bodyHtml).toContain('<a href="/service-areas/monroe">Monroe</a>');
    const breadcrumb = snapshot?.jsonLd?.find((schema) => schema["@type"] === "BreadcrumbList");
    expect((breadcrumb?.itemListElement as unknown[]) ?? []).toHaveLength(2);
    expect(snapshot?.jsonLd?.some((schema) => schema["@type"] === "ItemList")).toBe(false);
  });

  it("returns a service areas hub fallback snapshot with crawlable city links", async () => {
    const { getPublicHtmlSnapshot } = await import("../services/public-prerender.service");

    const snapshot = await getPublicHtmlSnapshot("/service-areas");

    expect(snapshot?.title).toContain("Service Areas");
    expect(snapshot?.description).toBe(
      "Explore Glass & Door Pro service areas across Charlotte, Union County, and nearby South Carolina for showers, windows, doors, repairs, and commercial glass.",
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
    expect(itemListSchema?.itemListElement?.map(({ name }) => name)).toEqual([
      "Charlotte",
      "Pineville",
      "Matthews",
      "Weddington",
      "Indian Trail",
      "Wesley Chapel",
      "Stallings",
      "Waxhaw",
      "Monroe",
      "Fort Mill",
      "Indian Land",
    ]);
    expect(itemListSchema?.itemListElement?.[0]).toEqual({
      "@type": "ListItem",
      position: 1,
      name: "Charlotte",
      url: "https://glassanddoorpro.com/service-areas/charlotte",
    });
    expect(itemListSchema?.itemListElement?.[10]).toEqual({
      "@type": "ListItem",
      position: 11,
      name: "Indian Land",
      url: "https://glassanddoorpro.com/service-areas/indian-land",
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

describe("public bootstrap payload", () => {
  it("embeds branding and menus safely for the first client render", async () => {
    const { injectPublicHtmlSnapshot } = await import("../services/public-prerender.service");
    const template =
      '<html><head><!--APP_DYNAMIC_HEAD--></head><body><!--APP_PRERENDER_CONTENT--><div id="root"></div></body></html>';
    const bootstrap = {
      branding: { companyName: "Name </script> here", companyPhoneNumbers: "(704) 555-0100" },
      menus: { main_navigation: { name: "Main", items: [] } },
    };
    const html = injectPublicHtmlSnapshot(template, null, null, bootstrap);
    const payload = html.match(
      /<script id="__PUBLIC_BOOTSTRAP__" type="application\/json">([\s\S]*?)<\/script>/,
    )?.[1];
    expect(payload).toBeDefined();
    expect(payload).not.toContain("<");
    expect(JSON.parse(payload!)).toEqual(bootstrap);
    expect(injectPublicHtmlSnapshot(template, null)).not.toContain("__PUBLIC_BOOTSTRAP__");
  });
});
