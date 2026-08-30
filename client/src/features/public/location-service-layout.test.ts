import { describe, expect, it } from "vitest";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";
import { prepareLocationServiceBlocks } from "./location-service-layout";

describe("prepareLocationServiceBlocks", () => {
  it("adds navigation anchors without changing location-page copy", () => {
    const blocks = [
      {
        id: "services",
        type: "cards-grid",
        props: {
          title: "Our Services in Indian Trail, NC",
          subtitle: "Keep this location copy exactly as written.",
          cards: [{ title: "Frameless Showers", description: "Existing service copy." }],
        },
      },
    ] as BlockInstance[];

    const prepared = prepareLocationServiceBlocks(blocks);

    expect(prepared[0].props).toEqual({
      title: "Our Services in Indian Trail, NC",
      subtitle: "Keep this location copy exactly as written.",
      cards: [{ title: "Frameless Showers", description: "Existing service copy." }],
      anchorId: "our-services-in-indian-trail-nc",
    });
    expect(blocks[0].props.anchorId).toBeUndefined();
  });

  it("supports location headings without rewriting them", () => {
    const blocks = [
      {
        id: "charlotte-intro",
        type: "rich-text",
        props: {
          title: "Your Charlotte-Based Glass & Door Company",
          content: "<p>Existing Charlotte copy.</p>",
        },
      },
      {
        id: "fort-mill-services",
        type: "cards-grid",
        props: {
          title: "Our Services in Fort Mill, SC",
          subtitle: "Existing Fort Mill copy.",
        },
      },
    ] as BlockInstance[];

    const prepared = prepareLocationServiceBlocks(blocks);

    expect(prepared.map((block) => block.props.title)).toEqual([
      "Your Charlotte-Based Glass & Door Company",
      "Our Services in Fort Mill, SC",
    ]);
    expect(prepared[0].props.content).toBe("<p>Existing Charlotte copy.</p>");
  });
});
