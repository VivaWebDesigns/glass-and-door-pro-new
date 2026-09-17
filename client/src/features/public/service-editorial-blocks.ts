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

export function prepareServiceEditorialBlocks(blocks: BlockInstance[]) {
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
