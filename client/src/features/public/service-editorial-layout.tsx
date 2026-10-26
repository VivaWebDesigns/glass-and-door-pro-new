import { ChevronDown } from "lucide-react";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "@/features/admin/cms/builder/block-registry";
import { prepareSectionAnchorBlocks } from "./section-anchor-blocks";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function PageSectionLinks({ blocks }: { blocks: BlockInstance[] }) {
  const links = blocks.flatMap((block) => {
    const title = text(block.props.title);
    const anchorId = text(block.props.anchorId);
    return title && anchorId ? [{ title, anchorId }] : [];
  });

  return (
    <nav aria-label="Page sections">
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

function MobilePageGuide({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <details className="service-editorial-mobile-guide rounded-lg border border-slate-200 bg-white lg:hidden">
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

export function ServiceEditorialLayout({ blocks }: { blocks: BlockInstance[] }) {
  const hero = blocks[0];
  if (!hero || hero.type !== "hero") {
    return <PublicPageRenderer blocks={blocks} />;
  }

  const contentBlocks = prepareSectionAnchorBlocks(blocks.slice(1));
  const closingCta = contentBlocks.at(-1)?.type === "cta" ? contentBlocks.at(-1) : undefined;
  const editorialBlocks = closingCta ? contentBlocks.slice(0, -1) : contentBlocks;
  const featuredIndex = editorialBlocks.findIndex(
    (block) => block.props.variant === "featured-project",
  );
  const leadingBlocks =
    featuredIndex >= 0 ? editorialBlocks.slice(0, featuredIndex) : editorialBlocks;
  const featuredBlock = featuredIndex >= 0 ? editorialBlocks[featuredIndex] : undefined;

  return (
    <div className="service-editorial-page">
      <div className="service-editorial-hero">
        <PublicPageRenderer blocks={[hero]} />
      </div>
      <div className="service-editorial-shell">
        <MobilePageGuide blocks={editorialBlocks} />
        <div className="service-editorial-grid">
          <div className="service-editorial-content">
            <PublicPageRenderer blocks={leadingBlocks} />
          </div>
        </div>
        {featuredBlock && (
          <>
            <div className="service-editorial-content mt-14 border-t border-slate-200 pt-10">
              <PublicPageRenderer blocks={[featuredBlock]} />
            </div>
            <div className="service-editorial-grid">
              <div className="service-editorial-content border-t border-slate-200 pt-10">
                <PublicPageRenderer blocks={editorialBlocks.slice(featuredIndex + 1)} />
              </div>
            </div>
          </>
        )}
      </div>
      {closingCta ? (
        <div className="service-editorial-closing-cta">
          <PublicPageRenderer blocks={[closingCta]} />
        </div>
      ) : null}
    </div>
  );
}
