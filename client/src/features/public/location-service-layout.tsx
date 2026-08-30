import { ChevronDown } from "lucide-react";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import { resolveCmsAssetUrl } from "@/features/admin/cms/builder/block-renderer.shared";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sectionId(title: string, index: number) {
  const normalized = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `section-${index + 1}`;
}

export function prepareLocationServiceBlocks(blocks: BlockInstance[]) {
  return blocks.map((block, index) => {
    const title = text(block.props.title);
    const existingAnchor = text(block.props.anchorId);
    const anchorId = existingAnchor || (title ? sectionId(title, index) : "");

    return anchorId
      ? {
          ...block,
          props: {
            ...block.props,
            anchorId,
          },
        }
      : block;
  });
}

function PageSectionLinks({ blocks }: { blocks: BlockInstance[] }) {
  const links = blocks.flatMap((block) => {
    const title = text(block.props.title);
    const anchorId = text(block.props.anchorId);
    return title && anchorId ? [{ title, anchorId }] : [];
  });

  return (
    <nav aria-label="Location page sections">
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.anchorId}>
            <a
              href={`#${link.anchorId}`}
              className="block rounded-md px-3 py-2 text-sm font-semibold leading-snug text-slate-600 hover:bg-slate-100 hover:text-[#1a8ead] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a8ead]"
            >
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function DesktopPageGuide({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <aside className="location-service-guide hidden lg:block" aria-label="Location page guide">
      <div className="sticky top-28 border-l-2 border-[#1a8ead] pl-5">
        <h2 className="font-heading text-xl font-bold text-slate-900">On this page</h2>
        <div className="mt-4">
          <PageSectionLinks blocks={blocks} />
        </div>
      </div>
    </aside>
  );
}

function MobilePageGuide({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <details className="location-service-mobile-guide rounded-lg border border-slate-200 bg-white lg:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-heading text-base font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1a8ead]">
        On this page
        <ChevronDown className="h-5 w-5 shrink-0 text-[#1a8ead]" aria-hidden="true" />
      </summary>
      <div className="border-t border-slate-200 p-2">
        <PageSectionLinks blocks={blocks} />
      </div>
    </details>
  );
}

function firstGalleryImage(galleryBlock?: BlockInstance) {
  const images = Array.isArray(galleryBlock?.props.images) ? galleryBlock.props.images : [];
  const image = images[0];
  if (!image || typeof image !== "object") return null;
  const item = image as Record<string, unknown>;
  const url = text(item.url);
  if (!url) return null;
  return { url: resolveCmsAssetUrl(url), alt: text(item.alt) };
}

export function LocationServiceLayout({
  blocks,
  galleryBlock,
}: {
  blocks: BlockInstance[];
  galleryBlock?: BlockInstance;
}) {
  const hero = blocks[0];
  if (!hero || hero.type !== "hero") {
    return <PublicPageRenderer blocks={blocks} />;
  }

  const contentBlocks = prepareLocationServiceBlocks(blocks.slice(1));
  const closingCta = contentBlocks.at(-1)?.type === "cta" ? contentBlocks.at(-1) : undefined;
  const pageBlocks = closingCta ? contentBlocks.slice(0, -1) : contentBlocks;
  const serviceBlock = pageBlocks.find(
    (block) => block.type === "cards-grid" && /^Our Services in /i.test(text(block.props.title)),
  );
  const localIntroBlock = pageBlocks.find((block) => block.type === "rich-text");
  const whyBlock = pageBlocks.find(
    (block) =>
      block.type === "cards-grid" &&
      /^Why .+ Choose Glass and Door Pro$/i.test(text(block.props.title)),
  );
  const featuredIds = new Set(
    [serviceBlock?.id, localIntroBlock?.id, whyBlock?.id].filter(Boolean),
  );
  const remainingBlocks = pageBlocks.filter((block) => !featuredIds.has(block.id));
  const orderedBlocks = [serviceBlock, localIntroBlock, whyBlock, ...remainingBlocks].filter(
    (block): block is BlockInstance => Boolean(block),
  );
  const image = firstGalleryImage(galleryBlock);

  return (
    <div className="location-service-page">
      <div className="location-service-hero">
        <PublicPageRenderer blocks={[hero]} />
      </div>
      <div className="location-service-shell">
        <MobilePageGuide blocks={orderedBlocks} />
        {serviceBlock ? (
          <div className="location-service-primary-grid">
            <div className="location-service-directory">
              <PublicPageRenderer blocks={[serviceBlock]} />
            </div>
            <DesktopPageGuide blocks={orderedBlocks} />
          </div>
        ) : null}
        {localIntroBlock ? (
          <div className="location-service-local-intro">
            {image ? <img src={image.url} alt={image.alt} loading="lazy" decoding="async" /> : null}
            <div className="location-service-local-copy">
              <PublicPageRenderer blocks={[localIntroBlock]} />
            </div>
          </div>
        ) : null}
        {whyBlock ? (
          <div className="location-service-proof-list">
            <PublicPageRenderer blocks={[whyBlock]} />
          </div>
        ) : null}
        {remainingBlocks.length > 0 ? (
          <div className="location-service-supporting-content">
            <PublicPageRenderer blocks={remainingBlocks} />
          </div>
        ) : null}
      </div>
      {closingCta ? (
        <div className="location-service-closing-cta">
          <PublicPageRenderer blocks={[closingCta]} />
        </div>
      ) : null}
    </div>
  );
}
