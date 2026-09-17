import type { BlockCategory, BlockDef, BlockInstance } from "./block-registry";
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
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
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
