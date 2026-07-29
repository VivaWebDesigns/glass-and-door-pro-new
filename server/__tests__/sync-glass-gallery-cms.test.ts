import { describe, expect, it } from "vitest";
import { mergeNewGalleryImages } from "../../scripts/sync-glass-gallery-cms";

function galleryFixture() {
  return {
    blocks: [
      {
        id: "categories",
        type: "cards-grid",
        props: {
          cards: [
            { title: "Frameless Showers", buttonText: "1 Photos" },
            { title: "Windows", buttonText: "1 Photos" },
            { title: "Doors", buttonText: "1 Photos" },
            { title: "Commercial Glass", buttonText: "1 Photos" },
          ],
        },
      },
      ...[
        ["frameless-showers", "/existing/shower.webp"],
        ["windows", "/existing/window.webp"],
        ["doors", "/existing/door.webp"],
        ["commercial-glass", "/existing/commercial.webp"],
      ].map(([anchorId, url]) => ({
        id: anchorId,
        type: "image-grid",
        props: {
          anchorId,
          images: [{ url, alt: "Existing", caption: "Existing" }],
        },
      })),
    ],
  };
}

describe("mergeNewGalleryImages", () => {
  it("adds the new batch, updates category counts, and remains idempotent", () => {
    const first = mergeNewGalleryImages(galleryFixture());
    const second = mergeNewGalleryImages(first.content);

    expect(first.addedImages).toBe(8);
    expect(first.replacedImages).toBe(0);
    expect(first.updatedCounts).toBe(4);
    expect(second.addedImages).toBe(0);
    expect(second.replacedImages).toBe(0);
    expect(second.updatedCounts).toBe(0);

    const imageCounts = first.content.blocks
      .filter((block) => block.type === "image-grid")
      .map((block) => (block.props.images as unknown[]).length);
    expect(imageCounts).toEqual([2, 4, 3, 3]);

    const cardsBlock = first.content.blocks.find((block) => block.type === "cards-grid");
    expect(cardsBlock?.props.cards).toEqual([
      { title: "Frameless Showers", buttonText: "2 Photos" },
      { title: "Windows", buttonText: "4 Photos" },
      { title: "Doors", buttonText: "3 Photos" },
      { title: "Commercial Glass", buttonText: "3 Photos" },
    ]);
  });

  it("replaces the legacy numeric commercial filename without adding a duplicate", () => {
    const fixture = galleryFixture();
    const commercialBlock = fixture.blocks.find(
      (block) => block.props.anchorId === "commercial-glass",
    );
    commercialBlock!.props.images = [
      {
        url: "/images/glass-door-pro/gallery/commercial-glass/06.webp",
        alt: "Legacy",
        caption: "Legacy",
      },
    ];

    const merged = mergeNewGalleryImages(fixture);
    const updatedCommercialBlock = merged.content.blocks.find(
      (block) => block.props.anchorId === "commercial-glass",
    );
    const urls = (updatedCommercialBlock?.props.images as Array<{ url: string }>).map(
      (image) => image.url,
    );

    expect(merged.addedImages).toBe(7);
    expect(merged.replacedImages).toBe(1);
    expect(urls).toContain(
      "/images/glass-door-pro/gallery/commercial-glass/commercial-double-glass-door-installation.webp",
    );
    expect(urls).not.toContain("/images/glass-door-pro/gallery/commercial-glass/06.webp");
    expect(
      (updatedCommercialBlock?.props.images as Array<Record<string, unknown>>).some(
        (image) => "legacyUrls" in image,
      ),
    ).toBe(false);
  });
});
