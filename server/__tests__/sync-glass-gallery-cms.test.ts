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
    for (const block of first.content.blocks.filter((item) => item.type === "image-grid")) {
      block.props.images = (block.props.images as Array<Record<string, unknown>>).map(
        (image) => ({
          alt: image.alt,
          url: image.url,
          caption: image.caption,
        }),
      );
    }
    const second = mergeNewGalleryImages(first.content);

    expect(first.addedImages).toBe(7);
    expect(first.replacedImages).toBe(0);
    expect(first.removedImages).toBe(0);
    expect(first.movedImages).toBe(0);
    expect(first.updatedCounts).toBe(4);
    expect(second.addedImages).toBe(0);
    expect(second.replacedImages).toBe(0);
    expect(second.removedImages).toBe(0);
    expect(second.movedImages).toBe(0);
    expect(second.updatedCounts).toBe(0);

    const imageCounts = first.content.blocks
      .filter((block) => block.type === "image-grid")
      .map((block) => (block.props.images as unknown[]).length);
    expect(imageCounts).toEqual([2, 4, 2, 3]);

    const cardsBlock = first.content.blocks.find((block) => block.type === "cards-grid");
    expect(cardsBlock?.props.cards).toEqual([
      { title: "Frameless Showers", buttonText: "2 Photos" },
      { title: "Windows", buttonText: "4 Photos" },
      { title: "Doors", buttonText: "2 Photos" },
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

    expect(merged.addedImages).toBe(6);
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

  it("removes retired gallery images and updates the affected count", () => {
    const fixture = galleryFixture();
    const doorBlock = fixture.blocks.find((block) => block.props.anchorId === "doors");
    doorBlock!.props.images = [
      {
        url: "/images/glass-door-pro/gallery/doors/05.webp",
        alt: "Entry door installation in progress by Glass & Door Pro",
        caption: "Entry Door Installation - In Progress",
      },
      ...(doorBlock!.props.images as unknown[]),
    ];

    const merged = mergeNewGalleryImages(fixture);
    const updatedDoorBlock = merged.content.blocks.find(
      (block) => block.props.anchorId === "doors",
    );
    const urls = (updatedDoorBlock?.props.images as Array<{ url: string }>).map(
      (image) => image.url,
    );

    expect(merged.removedImages).toBe(1);
    expect(urls).not.toContain("/images/glass-door-pro/gallery/doors/05.webp");
  });

  it("moves the glass entry door from doors to commercial glass", () => {
    const fixture = galleryFixture();
    const doorBlock = fixture.blocks.find((block) => block.props.anchorId === "doors");
    doorBlock!.props.images = [
      {
        url: "/images/glass-door-pro/gallery/doors/02.webp",
        alt: "Glass entry door installation by Glass & Door Pro",
        caption: "Glass Entry Door Installation",
      },
      ...(doorBlock!.props.images as unknown[]),
    ];

    const merged = mergeNewGalleryImages(fixture);
    const updatedDoorBlock = merged.content.blocks.find(
      (block) => block.props.anchorId === "doors",
    );
    const updatedCommercialBlock = merged.content.blocks.find(
      (block) => block.props.anchorId === "commercial-glass",
    );
    const doorUrls = (updatedDoorBlock?.props.images as Array<{ url: string }>).map(
      (image) => image.url,
    );
    const commercialUrls = (
      updatedCommercialBlock?.props.images as Array<{ url: string }>
    ).map((image) => image.url);

    expect(merged.movedImages).toBe(1);
    expect(doorUrls).not.toContain("/images/glass-door-pro/gallery/doors/02.webp");
    expect(commercialUrls).toContain(
      "/images/glass-door-pro/gallery/commercial-glass/commercial-glass-entry-door-installation.webp",
    );
  });
});
