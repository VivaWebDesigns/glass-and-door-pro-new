import { describe, expect, it } from "vitest";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";
import { prepareServiceEditorialBlocks } from "./service-editorial-layout";

describe("prepareServiceEditorialBlocks", () => {
  it("adds navigation anchors without changing CMS copy", () => {
    const blocks = [
      {
        id: "comparison",
        type: "rich-text",
        props: {
          title: "Frameless vs. Semi-Frameless: Which Is Right for You?",
          content: "<p>Keep this copy exactly as written.</p>",
        },
      },
      {
        id: "gallery",
        type: "image-grid",
        props: {
          anchorId: "gallery",
          title: "Our Frameless Shower Work",
        },
      },
    ] as BlockInstance[];

    const prepared = prepareServiceEditorialBlocks(blocks);

    expect(prepared[0].props).toEqual({
      title: "Frameless vs. Semi-Frameless: Which Is Right for You?",
      content: "<p>Keep this copy exactly as written.</p>",
      anchorId: "frameless-vs-semi-frameless-which-is-right-for-you",
    });
    expect(prepared[1].props.anchorId).toBe("gallery");
    expect(blocks[0].props.anchorId).toBeUndefined();
  });
});
