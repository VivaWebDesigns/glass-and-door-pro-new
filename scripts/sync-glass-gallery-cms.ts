import { pathToFileURL } from "url";
import { mergeNewGalleryImages } from "../shared/glass-gallery-sync";

export { mergeNewGalleryImages };

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
    changeNote: "Synchronized gallery updates",
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
