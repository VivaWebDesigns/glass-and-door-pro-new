import { describe, expect, it } from "vitest";
import {
  buildCityShowerPageContent,
  linkLocationCommercialCardToServicesHub,
  getCityShowerPageCopy,
} from "./glass-city-shower-pages";
import { GLASS_PRIMARY_SERVICE_AREAS } from "./glass-service-areas";
import { getCmsSlugForPublicPath } from "./glass-seo";
import { getGlassLocationSearchCopy } from "./glass-location-search";

const WAXHAW = "service-areas-waxhaw";
const buildWaxhawShowerPageContent = (content: unknown) =>
  buildCityShowerPageContent(WAXHAW, content as never);

function currentWaxhawContent() {
  return {
    _system: { showerSearchPositioning2026: true },
    blocks: [
      { id: "hero", type: "hero", props: { heading: "Glass Shower Door Installer in Waxhaw, NC" } },
      {
        id: "intro",
        type: "rich-text",
        props: {
          title: "Your Glass and Door Company in Waxhaw",
          content: "<p>Old copy.</p>",
          sectionBackgroundColor: "#ffffff",
        },
      },
      {
        id: "why",
        type: "cards-grid",
        props: { title: "Why Waxhaw Homeowners Choose Glass & Door Pro", cards: [] },
      },
      {
        id: "services",
        type: "cards-grid",
        props: {
          title: "Our Services in Waxhaw, NC",
          cards: [
            { title: "Frameless Showers", link: "/services/frameless-showers" },
            { title: "Window Installation", link: "/services/window-installation" },
            {
              title: "Commercial Services",
              link: "/services/commercial-storefront-glass-installation",
              buttonText: "Learn more about commercial services",
            },
          ],
        },
      },
      { id: "doug", type: "text-image", props: { title: "Meet Doug Adams" } },
      {
        id: "areas",
        type: "rich-text",
        props: { title: "Neighborhoods and Areas We Serve in and Around Waxhaw", content: "" },
      },
      {
        id: "gallery",
        type: "image-grid",
        props: {
          anchorId: "gallery",
          title: "Our Work in the Waxhaw Area",
          images: [{ url: "/images/glass-door-pro/gallery-shower2-1280w.webp", alt: "Old" }],
        },
      },
      { id: "reviews", type: "testimonials", props: { title: "What Our Clients Say" } },
      {
        id: "faq",
        type: "faq",
        props: {
          title: "Frequently Asked Questions — Waxhaw, NC",
          items: [{ question: "How do I know if my windows need replacement or just repair?" }],
        },
      },
      { id: "cta", type: "cta", props: { heading: "Ready to Get Started in Waxhaw?" } },
    ],
  };
}

function titles(content: unknown) {
  return (content as { blocks: Array<{ props: { title?: string; heading?: string } }> }).blocks.map(
    (block) => block.props.title ?? block.props.heading,
  );
}

describe("buildCityShowerPageContent", () => {
  it("leads with shower door sections and moves other services to the bottom", () => {
    const content = buildWaxhawShowerPageContent(currentWaxhawContent());

    expect(titles(content)).toEqual([
      "Glass Shower Door Installer in Waxhaw, NC",
      "Custom Glass Shower Doors in Waxhaw, NC",
      "Glass Shower Door Styles We Install in Waxhaw",
      "Glass and Hardware Options for Waxhaw Homes",
      "How a Glass Shower Door Install Works",
      "Why Waxhaw Homeowners Choose Glass & Door Pro",
      "Meet Doug Adams",
      "Neighborhoods We Serve in and Around Waxhaw",
      "Our Work in the Waxhaw Area",
      "What Our Clients Say",
      "Glass Shower Door FAQs — Waxhaw, NC",
      "Other Services in Waxhaw",
      "Ready for a New Glass Shower Door in Waxhaw?",
    ]);
  });

  it("keeps existing block ids, drops the shower card from other services and leads the gallery with the Waxhaw job", () => {
    const content = buildWaxhawShowerPageContent(currentWaxhawContent()) as {
      _system: Record<string, unknown>;
      blocks: Array<{ id: string; props: Record<string, unknown> }>;
    };
    const byId = Object.fromEntries(content.blocks.map((block) => [block.id, block]));

    expect(content._system).toEqual({ showerSearchPositioning2026: true });
    expect(byId.intro.props.sectionBackgroundColor).toBe("#ffffff");
    expect(byId.intro.props.content).toContain("Cureton");
    expect(byId.services.props.cards).toEqual([
      { title: "Window Installation", link: "/services/window-installation" },
      {
        title: "Commercial & Other Services",
        link: "/services",
        buttonText: "See all our services",
      },
    ]);
    expect(byId.gallery.props.images[0].url).toBe(
      "/images/glass-door-pro/gallery/frameless-showers/09.webp",
    );
    expect(byId.faq.props.items.map((item: { question: string }) => item.question)).not.toContain(
      "How do I know if my windows need replacement or just repair?",
    );
  });

  it("produces the same page when applied twice", () => {
    const once = buildWaxhawShowerPageContent(currentWaxhawContent());
    expect(buildWaxhawShowerPageContent(once)).toEqual(once);
  });

  it("points an already rebuilt page's commercial card at the services hub", () => {
    const content = {
      blocks: [
        {
          id: "services",
          type: "cards-grid",
          props: {
            title: "Other Services in Waxhaw",
            cards: [
              { title: "Window Repair", link: "/services/window-repair" },
              {
                title: "Commercial Services",
                link: "/services/commercial-storefront-glass-installation",
              },
            ],
          },
        },
      ],
    };

    const linked = linkLocationCommercialCardToServicesHub(content) as typeof content;
    expect(linked.blocks[0].props.cards[1]).toMatchObject({
      title: "Commercial & Other Services",
      link: "/services",
      buttonText: "See all our services",
    });
    expect(linkLocationCommercialCardToServicesHub(linked)).toBeNull();
  });

  it("rebuilds Charlotte with its own copy and keeps the business address", () => {
    const base = currentWaxhawContent();
    const charlotte = {
      ...base,
      blocks: base.blocks.map((block) =>
        block.id === "areas"
          ? {
              ...block,
              props: { ...block.props, title: "Charlotte Neighborhoods and Areas We Serve" },
            }
          : block.id === "why"
            ? {
                ...block,
                props: {
                  ...block.props,
                  title: "Why Charlotte Homeowners Choose Glass & Door Pro",
                },
              }
            : block,
      ),
    };
    const content = buildCityShowerPageContent("areas-served-charlotte-nc", charlotte as never) as {
      blocks: Array<{ id: string; props: Record<string, unknown> }>;
    };
    const byId = Object.fromEntries(content.blocks.map((block) => [block.id, block]));

    expect(byId.intro.props.title).toBe("Custom Glass Shower Doors in Charlotte, NC");
    expect(byId.intro.props.content).toContain("6135 Park South Drive");
    expect(byId["charlotte-shower-door-styles"]).toBeDefined();
    expect(byId.areas.props.title).toBe("Charlotte Neighborhoods We Serve");
    expect(byId.services.props.title).toBe("Other Services in Charlotte");
    expect(byId.cta.props.heading).toBe("Ready for a New Glass Shower Door in Charlotte?");
    expect((byId.gallery.props.images as Array<{ url: string }>)[0].url).toBe(
      "/images/glass-door-pro/gallery/frameless-showers/01.webp",
    );
    const rewritten = [
      "intro",
      "charlotte-shower-door-styles",
      "charlotte-shower-door-options",
      "charlotte-shower-door-process",
      "why",
      "areas",
      "faq",
      "services",
      "cta",
    ].map((id) => byId[id]);
    expect(JSON.stringify(rewritten)).not.toContain("Waxhaw");
  });

  it("has shower copy for every city page that keeps its search intro", () => {
    for (const { href } of GLASS_PRIMARY_SERVICE_AREAS) {
      const slug = getCmsSlugForPublicPath(href) ?? "";
      const copy = getCityShowerPageCopy(slug);
      expect(copy, slug).not.toBeNull();
      expect(copy?.introContent).toContain(getGlassLocationSearchCopy(slug)?.intro);
    }
  });

  it("leaves pages without shower copy untouched", () => {
    const content = currentWaxhawContent();
    expect(buildCityShowerPageContent("home", content as never)).toBe(content);
  });

  it("leaves unrecognized content untouched", () => {
    const content = { blocks: [{ id: "hero", type: "hero", props: {} }] };
    expect(buildWaxhawShowerPageContent(content)).toBe(content);
  });
});
