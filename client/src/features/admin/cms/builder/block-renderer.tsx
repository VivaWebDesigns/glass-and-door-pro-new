import { Lock } from "lucide-react";
import { PublicBlockRenderer, PublicPageRenderer } from "@/features/public/public-block-renderer";
import type { BlockInstance } from "./block-registry";
import { getBlockDef, isDynamicBlock } from "./block-registry";
import { BlockIcon } from "./page-builder-support";
import { getSectionPaddingClasses } from "./section-style";
import { SectionStyleWrapper } from "./section-style-wrapper";
import { resolveCmsAssetUrl, str } from "./block-renderer.shared";

function DynamicPlaceholderAdmin({ block }: { block: BlockInstance }) {
  const def = getBlockDef(block.type);
  const label = def?.label ?? block.type;
  const iconName = def?.iconName ?? "Lock";

  return (
    <div
      className="rounded-lg border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 p-8 text-center"
      data-testid={`dynamic-placeholder-${block.type}`}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <BlockIcon name={iconName} className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
      <p className="font-semibold text-sm text-amber-800 dark:text-amber-300">{label}</p>
      <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
        This section is managed automatically and displays live data on the public site.
      </p>
    </div>
  );
}

/**
 * Builder preview of a single block. Renders through the public renderer so the
 * canvas matches the live site; dynamic blocks show a placeholder in the builder.
 */
export function BlockRenderer({
  block,
  isAdminPreview,
  disableSectionStyleWrap = false,
}: {
  block: BlockInstance;
  isAdminPreview?: boolean;
  disableSectionStyleWrap?: boolean;
}) {
  if (!isAdminPreview || !isDynamicBlock(block.type)) {
    return (
      <PublicBlockRenderer
        block={block}
        disableSectionStyleWrap={disableSectionStyleWrap}
        renderInactive
      />
    );
  }

  const placeholder = <DynamicPlaceholderAdmin block={block} />;
  if (disableSectionStyleWrap) {
    return placeholder;
  }

  return (
    <SectionStyleWrapper
      id={str(block.props.anchorId) || undefined}
      props={block.props}
      resolveAssetUrl={resolveCmsAssetUrl}
      contentClassName={getSectionPaddingClasses(block.props)}
    >
      {placeholder}
    </SectionStyleWrapper>
  );
}

export const PageRenderer = PublicPageRenderer;
