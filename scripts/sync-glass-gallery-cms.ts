import { pathToFileURL } from "url";

interface GalleryImage {
  url: string;
  alt: string;
  caption: string;
}

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
        url: "/images/glass-door-pro/gallery/doors/05.webp",
        alt: "Entry door installation in progress by Glass & Door Pro",
        caption: "Entry Door Installation - In Progress",
      },
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
        url: "/images/glass-door-pro/gallery/commercial-glass/06.webp",
        alt: "Commercial double glass door installation by Glass & Door Pro",
        caption: "Commercial Double Glass Door Installation",
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

export function mergeNewGalleryImages(content: unknown) {
  if (!isGalleryContent(content)) {
    throw new Error("Gallery CMS page does not contain builder blocks");
  }

  const nextContent = structuredClone(content);
  let addedImages = 0;
  let updatedCounts = 0;

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
    const missingImages = category.images.filter((image) => !existingUrls.has(image.url));

    if (missingImages.length > 0) {
      imageBlock.props.images = [...missingImages, ...currentImages];
      addedImages += missingImages.length;
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

  return { content: nextContent, addedImages, updatedCounts };
}

export async function syncGlassGalleryCms() {
  const { storage } = await import("../server/storage");
  const page = await storage.cmsPages.getPageBySlug("gallery");
  if (!page) {
    throw new Error("Gallery CMS page was not found");
  }

  const merged = mergeNewGalleryImages(page.content);
  if (merged.addedImages === 0 && merged.updatedCounts === 0) {
    console.log("Gallery CMS page already contains the new images.");
    return;
  }

  await storage.cmsPageRevisions.createRevision({
    pageId: page.id,
    title: page.title,
    content: page.content as Record<string, unknown>,
    status: page.status,
    changedBy: page.updatedBy ?? page.createdBy ?? undefined,
    changeNote: "Added July 2026 gallery image batch",
  });
  await storage.cmsPages.updatePage(page.id, { content: merged.content });

  console.log(
    `Updated gallery CMS page: ${merged.addedImages} images added, ${merged.updatedCounts} counts updated.`,
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
