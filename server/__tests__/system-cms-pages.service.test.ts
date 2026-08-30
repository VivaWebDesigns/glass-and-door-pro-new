import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML,
  GLASS_PRIMARY_SERVICE_AREA_NAMES,
} from "@shared/glass-service-areas";

const mockGetPageBySlug = vi.fn();
const mockGetAllPages = vi.fn();
const mockCreatePage = vi.fn();
const mockUpdatePage = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    cmsPages: {
      getAllPages: mockGetAllPages,
      getPageBySlug: mockGetPageBySlug,
      createPage: mockCreatePage,
      updatePage: mockUpdatePage,
    },
  },
}));

vi.mock("../utils/logger", () => ({
  logger: {
    app: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  },
}));

describe("ensureSystemCmsPages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAllPages.mockResolvedValue([]);
  });

  it("updates homepage contact areas and services hero/CTA plain-text lists without altering other copy", async () => {
    const pages = [
      {
        id: "home-id",
        slug: "home",
        seoDescription: null,
        updatedBy: "editor",
        content: {
          blocks: [
            {
              id: "contact",
              type: "contact-form",
              props: {
                heading: "Ready to start your project?",
                contactItems: [
                  {
                    label: "Service Area",
                    value:
                      "Charlotte, Monroe, Indian Trail, Stallings, Wesley Chapel, Waxhaw, Matthews, Weddington, Indian Land, Fort Mill, Pineville",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        id: "services-id",
        slug: "services",
        seoDescription: null,
        updatedBy: "editor",
        content: {
          blocks: [
            {
              id: "hero",
              type: "hero",
              props: {
                heading: "Glass and Door Services",
                subheading:
                  "<p>Services across Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby communities.</p>",
              },
            },
            {
              id: "cta",
              type: "cta",
              props: {
                subheading:
                  "<p><strong>Mon-Sat: 7am - 7pm | Serving Charlotte, Monroe, Indian Trail, Matthews, Waxhaw, and nearby areas</strong></p>",
              },
            },
            {
              id: "custom",
              type: "rich-text",
              props: { content: "A project in Monroe. Another in Waxhaw." },
            },
          ],
        },
      },
    ];
    mockGetAllPages.mockResolvedValue(pages);
    mockGetPageBySlug.mockResolvedValue({ content: { blocks: [] } });
    const { ensureSystemCmsPages } = await import("../services/system-cms-pages.service");
    await ensureSystemCmsPages();
    expect(mockUpdatePage).toHaveBeenCalledTimes(2);
    const home = mockUpdatePage.mock.calls.find(([id]) => id === "home-id")![1];
    expect(home.content.blocks[0].props.contactItems[0].value).toBe(
      GLASS_PRIMARY_SERVICE_AREA_NAMES,
    );
    const services = mockUpdatePage.mock.calls.find(([id]) => id === "services-id")![1];
    expect(services.content.blocks).toEqual([
      {
        ...pages[1].content.blocks[0],
        props: {
          heading: "Glass and Door Services",
          subheading: `<p>Services across ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby communities.</p>`,
        },
      },
      {
        ...pages[1].content.blocks[1],
        props: {
          subheading: `<p><strong>Mon-Sat: 7am - 7pm | Serving ${GLASS_PRIMARY_SERVICE_AREA_NAMES}, and nearby areas</strong></p>`,
        },
      },
      pages[1].content.blocks[2],
    ]);
    mockUpdatePage.mockClear();
    mockGetAllPages.mockResolvedValue([
      { ...pages[0], ...home },
      { ...pages[1], ...services },
    ]);
    await ensureSystemCmsPages();
    expect(mockUpdatePage).not.toHaveBeenCalled();
  });

  it.each([
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
  ])(
    "migrates a published complete service-area list without changing other copy (%s)",
    async (...labels) => {
      const oldLinks = labels
        .map(
          (label) =>
            `<a href="/service-areas/${label.toLowerCase().replaceAll(" ", "-")}">${label}</a>`,
        )
        .join(", ");
      const page = {
        id: "service-page-id",
        slug: "services-frameless-showers",
        seoDescription: null,
        updatedBy: "admin-id",
        content: {
          blocks: [
            {
              id: "area-list",
              type: "rich-text",
              props: {
                title: "Serving the Greater Charlotte Area",
                content: `<p>Original introduction: ${oldLinks}, and surrounding areas.</p>`,
                customCopy: "Monroe and Waxhaw projects remain welcome.",
              },
            },
          ],
        },
      };
      mockGetAllPages.mockResolvedValue([page]);
      mockGetPageBySlug.mockResolvedValue({ content: { blocks: [] } });
      const { ensureSystemCmsPages } = await import("../services/system-cms-pages.service");
      await ensureSystemCmsPages();

      expect(mockUpdatePage).toHaveBeenCalledTimes(1);
      const update = mockUpdatePage.mock.calls[0][1];
      expect(update.content.blocks[0]).toEqual({
        ...page.content.blocks[0],
        props: {
          ...page.content.blocks[0].props,
          content: `<p>Original introduction: ${GLASS_PRIMARY_SERVICE_AREA_LINKS_HTML}, and surrounding areas.</p>`,
        },
      });
      expect(update.updatedBy).toBe("admin-id");

      mockUpdatePage.mockClear();
      mockGetAllPages.mockResolvedValue([{ ...page, ...update }]);
      await ensureSystemCmsPages();
      expect(mockUpdatePage).not.toHaveBeenCalled();
    },
  );

  it("does not draft or noindex existing public pages on every startup unless marked system-retired", async () => {
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).not.toHaveBeenCalled();
    expect(mockCreatePage).not.toHaveBeenCalled();
  });

  it("drafts and noindexes retired pages only when they are explicitly marked system-retired", async () => {
    mockGetPageBySlug.mockImplementation(async (slug: string) => {
      if (slug === "about") {
        return {
          id: "about-id",
          slug,
          status: "published",
          noindex: false,
          content: { _system: { systemRetired: true } },
          updatedBy: "admin-id",
        };
      }

      return {
        id: `${slug}-id`,
        slug,
        status: "published",
        noindex: false,
        content: { blocks: [] },
        updatedBy: "admin-id",
      };
    });

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    expect(mockUpdatePage).toHaveBeenCalledWith("about-id", {
      status: "draft",
      noindex: true,
      updatedBy: "admin-id",
    });
  });

  it("normalizes pasted meta description labels on existing CMS pages", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "charlotte-id",
        seoDescription:
          "Meta Description:\nOwner-operated glass and door services in Charlotte, NC.",
        updatedBy: "admin-id",
      },
      {
        id: "clean-id",
        seoDescription: "Already clean.",
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    expect(mockUpdatePage).toHaveBeenCalledWith("charlotte-id", {
      seoDescription: "Owner-operated glass and door services in Charlotte, NC.",
      updatedBy: "admin-id",
    });
  });

  it("noindexes existing privacy and terms pages", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "privacy-id",
        slug: "privacy-policy",
        seoDescription: "Privacy description.",
        noindex: false,
        content: { blocks: [] },
        updatedBy: "admin-id",
      },
      {
        id: "terms-id",
        slug: "terms-of-service",
        seoDescription: "Terms description.",
        noindex: false,
        content: { blocks: [] },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: slug === "privacy-policy" || slug === "terms-of-service",
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(2);
    expect(mockUpdatePage).toHaveBeenCalledWith("privacy-id", {
      noindex: true,
      updatedBy: "admin-id",
    });
    expect(mockUpdatePage).toHaveBeenCalledWith("terms-id", {
      noindex: true,
      updatedBy: "admin-id",
    });
  });

  it("replaces only the legacy Glass & Door Pro privacy policy", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "privacy-id",
        slug: "privacy-policy",
        seoDescription: "Existing privacy description.",
        content: {
          blocks: [
            {
              id: "legacy-policy",
              type: "rich-text",
              props: {
                content:
                  "Our website may use cookies and analytics tools, such as Google Analytics",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [pageId, update] = mockUpdatePage.mock.calls[0];
    expect(pageId).toBe("privacy-id");
    expect(update.updatedBy).toBe("admin-id");
    expect(JSON.stringify(update.content)).toContain("Google Analytics 4");
    expect(JSON.stringify(update.content)).toContain("generate_lead");
    expect(JSON.stringify(update.content)).not.toContain("This data is aggregated");
  });

  it("updates published CMS hours in nested CTA and FAQ content", async () => {
    const unchangedBlock = { id: "intro", type: "rich-text", props: { content: "Unchanged" } };
    mockGetAllPages.mockResolvedValue([
      {
        id: "service-id",
        slug: "services-commercial-storefront-glass-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            unchangedBlock,
            {
              id: "faq",
              type: "faq",
              props: {
                items: [{ question: "When are you open?", answer: "Mon–Sat, 7am–6pm." }],
              },
            },
            {
              id: "cta",
              type: "cta",
              props: { footerLine: "Mon-Sat: 7am - 6pm | Charlotte, NC" },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [, update] = mockUpdatePage.mock.calls[0];
    expect(update.content.blocks[0]).toBe(unchangedBlock);
    expect(update.content.blocks[1].props.items[0].answer).toBe("Mon–Sat, 7am–7pm.");
    expect(update.content.blocks[2].props.footerLine).toBe("Mon-Sat: 7am - 7pm | Charlotte, NC");
  });

  it("updates the former business address in stored CMS content", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "terms-id",
        slug: "terms-of-service",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            {
              id: "terms",
              type: "rich-text",
              props: {
                content:
                  "Located at 2341 Waverly Dr, Monroe, NC 28112.<br>Glass &amp; Door Pro<br>2341 Waverly Dr<br>Monroe, NC 28112",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [, update] = mockUpdatePage.mock.calls[0];
    expect(update.content.blocks[0].props.content).toContain(
      "6135 Park South Drive Suite 542, Charlotte, NC 28210",
    );
    expect(update.content.blocks[0].props.content).toContain(
      "6135 Park South Drive<br>Suite 542<br>Charlotte, NC 28210",
    );
    expect(update.content.blocks[0].props.content).not.toContain("2341 Waverly");
  });

  it("moves the Charlotte home-base positioning off the Monroe page and onto Charlotte", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "monroe-id",
        slug: "areas-served-monroe-nc",
        seoDescription:
          "Owner-operated glass and door services in Monroe, NC. Frameless showers, window installation, door installation and window repair by Doug.",
        content: {
          blocks: [
            {
              id: "monroe-intro",
              type: "rich-text",
              props: {
                title: "Your Local Glass & Door Company in Monroe",
                content:
                  "<p>Glass and Door Pro is based right here in Monroe. Doug Adams lives and works in Union County, and Monroe homeowners are some of our most valued clients — many have become repeat customers and personal friends.</p><p>Being local matters more than most people realize. When you call a Monroe-area company for a frameless shower install, you're not waiting for a Charlotte-based crew to fit you into a route. We answer the phone, get out for a quote quickly, and don't add a travel premium to Union County projects the way some competitors quietly do. We're also the only local glass and door specialist working Saturdays.</p><p>Whether you're remodeling a master bathroom in one of the newer subdivisions off Highway 74, repairing a foggy bedroom window in a 1990s home near Sun Valley, or replacing the entry door on a historic home near downtown Monroe, this is the kind of work I do every week.</p>",
              },
            },
            {
              id: "monroe-faq",
              type: "faq",
              props: {
                items: [
                  {
                    question: "Are you actually based in Monroe, NC?",
                    answer:
                      "<p>Yes. Glass and Door Pro is based right here in Monroe. Doug lives and works in Union County, which means shorter response times for Monroe homeowners and a real local presence — not a Charlotte-based company driving an hour into Union County for a quote.</p>",
                  },
                ],
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "charlotte-id",
        slug: "areas-served-charlotte-nc",
        seoDescription:
          "Owner-operated glass and door services in Charlotte, NC. Frameless showers, window installation, door installation and window repair by Doug.",
        content: {
          blocks: [
            {
              id: "charlotte-intro",
              type: "rich-text",
              props: {
                title: "Owner-Operated Glass & Door Service in Charlotte",
                content:
                  "<p>Charlotte has no shortage of glass and door companies — but most of them have something in common: when you call, you talk to a salesperson. When the crew shows up, they're subcontractors. When something needs follow-up, you're calling a 1-800 number.</p><p>Glass and Door Pro is different. I'm Doug — owner, operator, and the person who'll actually come measure your project, plan it with you, and install it myself. I've been doing this work in the greater Charlotte area for 15+ years, and the reason I keep getting referrals is simple: the person who quotes the job is the person who does the job.</p><p>We're based in Monroe, just 30-40 minutes from most Charlotte addresses, and the greater Charlotte metro is our primary service area. Whether you're remodeling a master bathroom in SouthPark, replacing a foggy bedroom window in NoDa, or putting a new entry door on a craftsman bungalow in Dilworth, this is the work I do every week.</p>",
              },
            },
            {
              id: "charlotte-faq",
              type: "faq",
              props: {
                items: [
                  {
                    question:
                      "Do you actually come into Charlotte, or do you stay in Union County?",
                    answer:
                      "<p>We work throughout Charlotte regularly. Glass and Door Pro is based in Monroe, but the greater Charlotte metro is our primary service area. We have clients across South Charlotte, Ballantyne, SouthPark, Myers Park, Dilworth, Cotswold, and most other Charlotte neighborhoods. We're typically less than 40 minutes from any Charlotte address.</p>",
                  },
                ],
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(2);
    const monroeUpdate = mockUpdatePage.mock.calls.find(([id]) => id === "monroe-id")?.[1];
    const charlotteUpdate = mockUpdatePage.mock.calls.find(([id]) => id === "charlotte-id")?.[1];
    const monroeContent = JSON.stringify(monroeUpdate.content);
    const charlotteContent = JSON.stringify(charlotteUpdate.content);

    expect(monroeUpdate.seoDescription).toContain("Charlotte-based");
    expect(monroeContent).toContain("Charlotte-Based Glass & Door Service for Monroe");
    expect(monroeContent).toContain("Do you still serve Monroe, NC?");
    expect(monroeContent).not.toContain("based right here in Monroe");
    expect(charlotteUpdate.seoDescription).toContain("Charlotte-based");
    expect(charlotteContent).toContain("Your Charlotte-Based Glass & Door Company");
    expect(charlotteContent).toContain("6135 Park South Drive");
    expect(charlotteContent).toContain("Where is Glass and Door Pro based?");
    expect(charlotteContent).not.toContain("We're based in Monroe");
  });

  it("removes legacy Monroe home-base claims from every stored CMS page", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "services-id",
        slug: "services",
        seoDescription: "A Monroe-based glass company serving Charlotte.",
        content: {
          blocks: [
            {
              id: "services-intro",
              type: "rich-text",
              props: {
                content:
                  "<p>Glass & Door Pro is based in Monroe and serves homeowners and businesses throughout the greater Charlotte area.</p>",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "indian-trail-id",
        slug: "service-areas-indian-trail",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            {
              id: "indian-trail-benefit",
              type: "cards-grid",
              props: {
                title: "Monroe-Based, Truly Local",
                description:
                  "We're not a Charlotte company that occasionally drives to Union County. Glass and Door Pro is based in Monroe and Indian Trail is one of our most consistent service areas.",
              },
            },
            {
              id: "indian-trail-faq",
              type: "faq",
              props: {
                question:
                  "Are you actually based near Indian Trail, or do you come from Charlotte?",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "matthews-id",
        slug: "service-areas-matthews",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            {
              id: "matthews-faq",
              type: "faq",
              props: {
                question: "Do you serve Matthews even though you're based in Monroe?",
                answer:
                  "<p>Yes. Matthews is a regular part of our service area — we're out there consistently and don't add travel fees for Mecklenburg County locations. Monroe is close enough that Matthews is a short drive, and we schedule Matthews visits the same way as any other area.</p>",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "fort-mill-id",
        slug: "service-areas-fort-mill",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            {
              id: "fort-mill-benefit",
              type: "cards-grid",
              props: {
                title: "Monroe-Based, Right Across the Border",
                description:
                  "We're closer to Fort Mill than most Charlotte glass companies. Monroe is just across the state line, and Fort Mill is a regular part of our weekly schedule.",
              },
            },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(4);
    const updates = JSON.stringify(mockUpdatePage.mock.calls);
    expect(updates).not.toMatch(/Monroe[- ]based|based in Monroe|Monroe is close|Monroe is just/i);
    expect(updates).toContain("Charlotte-based glass company");
    expect(updates).toContain("Do you serve Indian Trail from Charlotte?");
    expect(updates).toContain("Charlotte-Based, Union County Service");
    expect(updates).toContain("Do you serve Matthews from Charlotte?");
    expect(updates).toContain("Charlotte-Based, Regular Fort Mill Service");
    expect(updates).toContain("South Charlotte home base");
  });

  it("adds missing related services blocks to residential service pages", async () => {
    mockGetAllPages.mockResolvedValue([
      {
        id: "window-installation-id",
        slug: "services-window-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            { id: "intro", type: "rich-text", props: { title: "Intro" } },
            { id: "cta", type: "cta", props: { heading: "Ready?" } },
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "door-installation-id",
        slug: "services-door-installation",
        seoDescription: "Already clean.",
        content: {
          blocks: [
            { id: "related", type: "link-list", props: { title: "Related Services" } },
            { id: "cta", type: "cta", props: { heading: "Ready?" } },
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockImplementation(async (slug: string) => ({
      id: `${slug}-id`,
      slug,
      status: "published",
      noindex: false,
      content: { blocks: [] },
      updatedBy: "admin-id",
    }));

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [pageId, update] = mockUpdatePage.mock.calls[0];
    expect(pageId).toBe("window-installation-id");
    expect(update.updatedBy).toBe("admin-id");
    expect(update.content.blocks.map((block: { type: string }) => block.type)).toEqual([
      "rich-text",
      "link-list",
      "cta",
    ]);
    expect(update.content.blocks[1]).toMatchObject({
      type: "link-list",
      props: {
        title: "Related Services",
        columns: "1",
      },
    });
    expect(update.content.blocks[1].props.links).toEqual([
      expect.objectContaining({ label: "Frameless Showers", url: "/services/frameless-showers" }),
      expect.objectContaining({ label: "Door Installation", url: "/services/door-installation" }),
      expect.objectContaining({ label: "Window Repair", url: "/services/window-repair" }),
    ]);
  });

  it("adds every service page to the homepage service cards without replacing other blocks", async () => {
    const heroBlock = { id: "hero", type: "hero", props: { heading: "Existing hero" } };
    const faqBlock = { id: "faq", type: "faq", props: { items: [{ question: "Existing FAQ" }] } };
    mockGetAllPages.mockResolvedValue([
      {
        id: "home-id",
        slug: "home",
        seoDescription: "Existing homepage description.",
        content: {
          blocks: [
            heroBlock,
            {
              id: "services",
              type: "cards-grid",
              props: {
                anchorId: "services",
                title: "What We Offer",
                cards: [
                  {
                    title: "Frameless Showers",
                    link: "/services/frameless-showers",
                  },
                ],
              },
            },
            faqBlock,
          ],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    expect(mockUpdatePage).toHaveBeenCalledTimes(1);
    const [pageId, update] = mockUpdatePage.mock.calls[0];
    expect(pageId).toBe("home-id");
    expect(update.updatedBy).toBe("admin-id");
    expect(update.content.blocks[0]).toEqual(heroBlock);
    expect(update.content.blocks[2]).toEqual(faqBlock);
    expect(update.content.blocks[1].props.cards.map((card: { link: string }) => card.link)).toEqual(
      [
        "/services/frameless-showers",
        "/services/window-installation",
        "/services/door-installation",
        "/services/window-repair",
        "/services/commercial-storefront-glass-installation",
        "/services/commercial-storefront-glass-replacement-repair",
        "/services/commercial-door-installation",
        "/services/commercial-door-replacement-repair",
        "/services/commercial-window-replacement",
      ],
    );
  });

  it("syncs written Google reviews, dates, and the two newest homepage reviews", async () => {
    const testimonialBlock = (items: Array<Record<string, unknown>>) => ({
      id: "reviews",
      type: "testimonials",
      props: { anchorId: "reviews", items },
    });
    mockGetAllPages.mockResolvedValue([
      {
        id: "reviews-id",
        slug: "reviews",
        seoDescription: "Reviews.",
        content: {
          blocks: [
            testimonialBlock([
              { name: "Frankie23 “Patricia”", quote: "Removed review" },
              { name: "Noah Clark", quote: "Existing Noah review" },
              { name: "Tapan Patel", quote: "Removed review" },
            ]),
          ],
        },
        updatedBy: "admin-id",
      },
      {
        id: "home-id",
        slug: "home",
        seoDescription: "Home.",
        content: {
          blocks: [testimonialBlock([{ name: "Noah Clark", quote: "Existing Noah review" }])],
        },
        updatedBy: "admin-id",
      },
    ]);
    mockGetPageBySlug.mockResolvedValue(null);

    const mod = await import("../services/system-cms-pages.service");
    await mod.ensureSystemCmsPages();

    const reviewsUpdate = mockUpdatePage.mock.calls.find(([id]) => id === "reviews-id")?.[1];
    const reviewItems = reviewsUpdate.content.blocks[0].props.items;
    expect(reviewItems.slice(0, 5).map((item: { name: string }) => item.name)).toEqual([
      "Lisa M",
      "Konstantin Kozhemyakov",
      "van orcutt",
      "Jeff Zwally",
      "Chuck Preslar",
    ]);
    expect(reviewItems.map((item: { name: string }) => item.name)).not.toContain(
      "Frankie23 “Patricia”",
    );
    expect(reviewItems.map((item: { name: string }) => item.name)).not.toContain("Tapan Patel");
    expect(reviewItems.find((item: { name: string }) => item.name === "Noah Clark")).toMatchObject({
      reviewDate: "2026-07-07",
    });

    const homeUpdate = mockUpdatePage.mock.calls.find(([id]) => id === "home-id")?.[1];
    expect(
      homeUpdate.content.blocks[0].props.items.map((item: { name: string }) => item.name),
    ).toEqual(["Lisa M", "Konstantin Kozhemyakov", "Noah Clark"]);
  });
});
