import { ChevronDown, Phone } from "lucide-react";
import { FormModalButton } from "@/components/forms/form-modal-button";
import { PublicPageRenderer } from "@/features/public/public-block-renderer";
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

export function prepareFramelessServiceBlocks(blocks: BlockInstance[]) {
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

function DesktopPageGuide({ blocks, hero }: { blocks: BlockInstance[]; hero: BlockInstance }) {
  return (
    <aside
      className="frameless-service-guide hidden lg:block"
      aria-label="Frameless shower page guide"
    >
      <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">On this page</h2>
        <div className="mt-4 border-b border-slate-200 pb-5">
          <PageSectionLinks blocks={blocks} />
        </div>
        <div className="mt-5 space-y-3">
          <FormModalButton
            label={text(hero.props.ctaText)}
            action={hero.props.ctaAction}
            href={hero.props.ctaLink}
            openInNewTab={hero.props.ctaOpenInNewTab}
            formSlug={hero.props.ctaFormSlug}
            modalTitle={hero.props.ctaModalTitle}
            modalDescription={hero.props.ctaModalDescription}
            className="min-h-11 w-full bg-[#1a8ead] text-white hover:bg-[#167f9b]"
            testId="frameless-guide-quote"
          />
          <a
            href={text(hero.props.ctaSecondaryLink)}
            className="flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#1a8ead] px-4 text-sm font-bold text-[#167f9b] hover:bg-[#1a8ead]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a8ead]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {text(hero.props.ctaSecondaryText)}
          </a>
        </div>
      </div>
    </aside>
  );
}

function MobilePageGuide({ blocks }: { blocks: BlockInstance[] }) {
  return (
    <details className="frameless-service-mobile-guide rounded-lg border border-slate-200 bg-white lg:hidden">
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

export function FramelessServiceLayout({ blocks }: { blocks: BlockInstance[] }) {
  const hero = blocks[0];
  if (!hero || hero.type !== "hero") {
    return <PublicPageRenderer blocks={blocks} />;
  }

  const contentBlocks = prepareFramelessServiceBlocks(blocks.slice(1));
  const closingCta = contentBlocks.at(-1)?.type === "cta" ? contentBlocks.at(-1) : undefined;
  const editorialBlocks = closingCta ? contentBlocks.slice(0, -1) : contentBlocks;

  return (
    <div className="frameless-service-page">
      <div className="frameless-service-hero">
        <PublicPageRenderer blocks={[hero]} />
      </div>
      <div className="frameless-service-editorial-shell">
        <MobilePageGuide blocks={editorialBlocks} />
        <div className="frameless-service-editorial-grid">
          <div className="frameless-service-content">
            <PublicPageRenderer blocks={editorialBlocks} />
          </div>
          <DesktopPageGuide blocks={editorialBlocks} hero={hero} />
        </div>
      </div>
      {closingCta ? (
        <div className="frameless-service-closing-cta">
          <PublicPageRenderer blocks={[closingCta]} />
        </div>
      ) : null}
    </div>
  );
}
