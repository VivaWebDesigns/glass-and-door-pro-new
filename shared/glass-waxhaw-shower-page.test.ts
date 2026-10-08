import { describe, expect, it } from "vitest";
import { buildWaxhawShowerPageContent } from "./glass-waxhaw-shower-page";

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

describe("buildWaxhawShowerPageContent", () => {
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

  it("leaves unrecognized content untouched", () => {
    const content = { blocks: [{ id: "hero", type: "hero", props: {} }] };
    expect(buildWaxhawShowerPageContent(content)).toBe(content);
  });
});
