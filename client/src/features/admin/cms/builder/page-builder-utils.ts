import type { BlockCategory, BlockDef, BlockInstance } from "./block-registry";
import { getBlockDef } from "./block-registry";

export const BLOCK_CATEGORY_LABELS: Record<BlockCategory, string> = {
  hero: "Hero",
  layout: "Layout",
  content: "Content",
  media: "Media",
  "social-proof": "Social Proof",
  conversion: "Conversion",
  data: "Data / Live",
  dynamic: "Dynamic / Interactive",
};

const BLOCK_CATEGORY_ORDER: BlockCategory[] = [
  "hero",
  "layout",
  "content",
  "media",
  "social-proof",
  "conversion",
  "data",
  "dynamic",
];

export function groupBlocksByCategory(
  blocks: BlockDef[],
): { category: BlockCategory; label: string; items: BlockDef[] }[] {
  const grouped = new Map<BlockCategory, BlockDef[]>();
  for (const block of blocks) {
    const category = block.category;
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category)!.push(block);
  }

  return BLOCK_CATEGORY_ORDER.filter((category) => grouped.has(category)).map((category) => ({
    category,
    label: BLOCK_CATEGORY_LABELS[category],
    items: grouped.get(category)!,
  }));
}

function cloneProps<T>(value: T): T {
  return structuredClone(value);
}

export function duplicateBlockInstance(block: BlockInstance): BlockInstance {
  return {
    id: crypto.randomUUID(),
    type: block.type,
    props: cloneProps(block.props),
  };
}

export function getBlockSummary(block: BlockInstance) {
  const candidates = [
    block.props.title,
    block.props.heading,
    block.props.sectionEyebrow,
    block.props.badge,
    block.props.ctaText,
  ];
  const summary = candidates.find(
    (candidate) => typeof candidate === "string" && candidate.trim().length > 0,
  );
  return typeof summary === "string" ? summary : "";
}

export function insertBlocksAt(blocks: BlockInstance[], index: number, inserted: BlockInstance[]) {
  const next = [...blocks];
  next.splice(index, 0, ...inserted);
  return next;
}

export function toggleBlockActiveInList(blocks: BlockInstance[], id: string) {
  return blocks.map((block) =>
    block.id === id
      ? { ...block, props: { ...block.props, isActive: block.props.isActive === false } }
      : block,
  );
}

/** Swap a block with its neighbour; returns null when it cannot move. */
export function moveBlockInList(blocks: BlockInstance[], id: string, direction: "up" | "down") {
  const index = blocks.findIndex((block) => block.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= blocks.length) return null;
  const next = [...blocks];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reorderBlockList(
  blocks: BlockInstance[],
  sourceId: string,
  targetId: string,
  position: "before" | "after",
) {
  if (sourceId === targetId) return null;
  const sourceIndex = blocks.findIndex((block) => block.id === sourceId);
  const targetIndex = blocks.findIndex((block) => block.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return null;

  const next = [...blocks];
  const [movedBlock] = next.splice(sourceIndex, 1);
  const adjustedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(position === "before" ? adjustedTargetIndex : adjustedTargetIndex + 1, 0, movedBlock);
  return next;
}

/** The block to select after removing `id`: the next one, else the previous one. */
export function selectionAfterRemoval(blocks: BlockInstance[], id: string) {
  const index = blocks.findIndex((block) => block.id === id);
  return blocks[index + 1]?.id ?? blocks[index - 1]?.id ?? null;
}

export function filterBlocksBySearch(blocks: BlockInstance[], search: string) {
  const term = search.trim().toLowerCase();
  if (!term) return blocks;
  return blocks.filter((block) => {
    const label = getBlockDef(block.type)?.label.toLowerCase() ?? "";
    return (
      block.type.toLowerCase().includes(term) ||
      label.includes(term) ||
      getBlockSummary(block).toLowerCase().includes(term)
    );
  });
}

export function filterBlockGroupsBySearch(blocks: BlockDef[], search: string) {
  const term = search.trim().toLowerCase();
  const grouped = groupBlocksByCategory(blocks);
  if (!term) return grouped;

  return grouped
    .map(({ category, label, items }) => ({
      category,
      label,
      items: items.filter((definition) =>
        [
          definition.label,
          definition.description,
          definition.type,
          BLOCK_CATEGORY_LABELS[definition.category],
        ]
          .join(" ")
          .toLowerCase()
          .includes(term),
      ),
    }))
    .filter(({ items }) => items.length > 0);
}
