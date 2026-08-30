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
});
