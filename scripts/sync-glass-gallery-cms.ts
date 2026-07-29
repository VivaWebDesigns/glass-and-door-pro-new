import { pathToFileURL } from "url";

interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
  legacyUrls?: string[];
}

type CmsGalleryImage = Omit<GalleryImage, "legacyUrls">;

const RETIRED_GALLERY_URLS = new Set([
  "/images/glass-door-pro/gallery/doors/05.webp",
]);

const GALLERY_CATEGORY_MOVES = [
  {
    fromUrl: "/images/glass-door-pro/gallery/doors/02.webp",
    toAnchorId: "commercial-glass",
    image: {
      url: "/images/glass-door-pro/gallery/commercial-glass/commercial-glass-entry-door-installation.webp",
      alt: "Commercial glass entry door installation by Glass & Door Pro",
      caption: "Commercial Glass Entry Door Installation",
    },
  },
];

interface GalleryCategory {
  anchorId: string;
  cardTitle: string;
  images: GalleryImage[];
}

interface GalleryContent {
  blocks: Array<{
    type: string;
    props: Record<string, unknown>;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

const NEW_GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    anchorId: "frameless-showers",
    cardTitle: "Frameless Showers",
    images: [
      {
        url: "/images/glass-door-pro/gallery/frameless-showers/18.webp",
        alt: "Frameless shower door installation by Glass & Door Pro",
        caption: "Frameless Shower Door Installation",
      },
    ],
  },
  {
    anchorId: "windows",
    cardTitle: "Windows",
    images: [
      {
        url: "/images/glass-door-pro/gallery/windows/10.webp",
        alt: "Residential picture window installation by Glass & Door Pro",
        caption: "Residential Picture Window Installation",
      },
      {
        url: "/images/glass-door-pro/gallery/windows/11.webp",
        alt: "Double-hung window installation by Glass & Door Pro",
        caption: "Double-Hung Window Installation",
      },
      {
        url: "/images/glass-door-pro/gallery/windows/12.webp",
        alt: "Dormer window installation by Glass & Door Pro",
        caption: "Dormer Window Installation",
      },
    ],
  },
  {
    anchorId: "doors",
    cardTitle: "Doors",
    images: [
      {
        url: "/images/glass-door-pro/gallery/doors/06.webp",
        alt: "Sliding patio door installation by Glass & Door Pro",
        caption: "Sliding Patio Door Installation",
      },
    ],
  },
  {
    anchorId: "commercial-glass",
    cardTitle: "Commercial Glass",
    images: [
      {
        url: "/images/glass-door-pro/gallery/commercial-glass/commercial-double-glass-door-installation.webp",
        alt: "Commercial double glass door installation by Glass & Door Pro",
        caption: "Commercial Double Glass Door Installation",
        legacyUrls: ["/images/glass-door-pro/gallery/commercial-glass/06.webp"],
      },
      {
        url: "/images/glass-door-pro/gallery/commercial-glass/07.webp",
        alt: "Commercial glass door installation by Glass & Door Pro",
        caption: "Commercial Glass Door Installation",
      },
    ],
  },
];

function isGalleryContent(value: unknown): value is GalleryContent {
  if (!value || typeof value !== "object") return false;
  return Array.isArray((value as { blocks?: unknown }).blocks);
}

function galleryImageUrl(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const url = (value as { url?: unknown }).url;
  return typeof url === "string" ? url : null;
}

function cmsGalleryImage(image: GalleryImage): CmsGalleryImage {
  return {
    url: image.url,
    alt: image.alt,
    caption: image.caption,
  };
}

function isSameCmsGalleryImage(value: unknown, image: CmsGalleryImage) {
  if (!value || typeof value !== "object") return false;
  const current = value as Record<string, unknown>;
  const allowedKeys = new Set(["url", "alt", "caption"]);
  return (
    current.url === image.url &&
    current.alt === image.alt &&
    current.caption === image.caption &&
    Object.keys(current).every((key) => allowedKeys.has(key))
  );
}

export function mergeNewGalleryImages(content: unknown) {
  if (!isGalleryContent(content)) {
    throw new Error("Gallery CMS page does not contain builder blocks");
  }

  const nextContent = structuredClone(content);
  let addedImages = 0;
  let replacedImages = 0;
  let removedImages = 0;
  let movedImages = 0;
  let updatedCounts = 0;

  for (const block of nextContent.blocks.filter((item) => item.type === "image-grid")) {
    if (!Array.isArray(block.props.images)) continue;
    const visibleImages = block.props.images.filter(
      (image) => !RETIRED_GALLERY_URLS.has(galleryImageUrl(image) ?? ""),
    );
    removedImages += block.props.images.length - visibleImages.length;
    block.props.images = visibleImages;
  }

  for (const move of GALLERY_CATEGORY_MOVES) {
    const imageBlocks = nextContent.blocks.filter((item) => item.type === "image-grid");
    const targetBlock = imageBlocks.find(
      (block) => block.props.anchorId === move.toAnchorId,
    );
    if (!targetBlock) {
      throw new Error(`Gallery image block not found: ${move.toAnchorId}`);
    }

    let removedFromSource = false;
    for (const block of imageBlocks) {
      if (!Array.isArray(block.props.images)) continue;
      const retainedImages = block.props.images.filter((image) => {
        if (galleryImageUrl(image) !== move.fromUrl) return true;
        removedFromSource = true;
        return false;
      });
      block.props.images = retainedImages;
    }

    const targetImages = Array.isArray(targetBlock.props.images)
      ? targetBlock.props.images
      : [];
    const targetIndex = targetImages.findIndex(
      (image) => galleryImageUrl(image) === move.image.url,
    );
    if (targetIndex >= 0) {
      const normalizedImage = cmsGalleryImage(move.image);
      if (!isSameCmsGalleryImage(targetImages[targetIndex], normalizedImage)) {
        targetImages[targetIndex] = normalizedImage;
        replacedImages += 1;
      }
    } else if (removedFromSource) {
      targetBlock.props.images = [cmsGalleryImage(move.image), ...targetImages];
      movedImages += 1;
    }
  }

  for (const category of NEW_GALLERY_CATEGORIES) {
    const imageBlock = nextContent.blocks.find(
      (block) =>
        block.type === "image-grid" &&
        block.props.anchorId === category.anchorId,
    );
    if (!imageBlock) {
      throw new Error(`Gallery image block not found: ${category.anchorId}`);
    }

    const currentImages = Array.isArray(imageBlock.props.images)
      ? imageBlock.props.images
      : [];
    const existingUrls = new Set(currentImages.map(galleryImageUrl).filter(Boolean));
    const missingImages: CmsGalleryImage[] = [];
    for (const image of category.images) {
      const currentIndex = currentImages.findIndex(
        (currentImage) => galleryImageUrl(currentImage) === image.url,
      );
      if (currentIndex >= 0) {
        const normalizedImage = cmsGalleryImage(image);
        if (!isSameCmsGalleryImage(currentImages[currentIndex], normalizedImage)) {
          currentImages[currentIndex] = normalizedImage;
          replacedImages += 1;
        }
        continue;
      }

      const legacyIndex = currentImages.findIndex((currentImage) => {
        const currentUrl = galleryImageUrl(currentImage);
        return Boolean(currentUrl && image.legacyUrls?.includes(currentUrl));
      });
      if (legacyIndex >= 0) {
        currentImages[legacyIndex] = cmsGalleryImage(image);
        replacedImages += 1;
      } else {
        missingImages.push(cmsGalleryImage(image));
      }
    }

    if (missingImages.length > 0) {
      imageBlock.props.images = [...missingImages, ...currentImages];
      addedImages += missingImages.length;
    } else {
      imageBlock.props.images = currentImages;
    }

    const imageCount = (imageBlock.props.images as unknown[]).length;
    const cardsBlock = nextContent.blocks.find((block) => block.type === "cards-grid");
    const cards = cardsBlock && Array.isArray(cardsBlock.props.cards)
      ? cardsBlock.props.cards
      : [];
    const categoryCard = cards.find(
      (card) =>
        card &&
        typeof card === "object" &&
        (card as { title?: unknown }).title === category.cardTitle,
    ) as Record<string, unknown> | undefined;
    const nextButtonText = `${imageCount} Photos`;

    if (categoryCard && categoryCard.buttonText !== nextButtonText) {
      categoryCard.buttonText = nextButtonText;
      updatedCounts += 1;
    }
  }

  return {
    content: nextContent,
    addedImages,
    replacedImages,
    removedImages,
    movedImages,
    updatedCounts,
  };
}

export async function syncGlassGalleryCms() {
  const { storage } = await import("../server/storage");
  const page = await storage.cmsPages.getPageBySlug("gallery");
  if (!page) {
    throw new Error("Gallery CMS page was not found");
  }

  const merged = mergeNewGalleryImages(page.content);
  if (
    merged.addedImages === 0 &&
    merged.replacedImages === 0 &&
    merged.removedImages === 0 &&
    merged.movedImages === 0 &&
    merged.updatedCounts === 0
  ) {
    console.log("Gallery CMS page already contains the new images.");
    return;
  }

  await storage.cmsPageRevisions.createRevision({
    pageId: page.id,
    title: page.title,
    content: page.content as Record<string, unknown>,
    status: page.status,
    changedBy: page.updatedBy ?? page.createdBy ?? undefined,
    changeNote: "Synchronized July 2026 gallery updates",
  });
  await storage.cmsPages.updatePage(page.id, { content: merged.content });

  console.log(
    `Updated gallery CMS page: ${merged.addedImages} images added, ${merged.replacedImages} references replaced, ${merged.removedImages} images removed, ${merged.movedImages} images moved, ${merged.updatedCounts} counts updated.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncGlassGalleryCms()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
