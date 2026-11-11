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

/** Give every titled block an anchor id so page section links can target it. */
export function prepareSectionAnchorBlocks<T extends { props: Record<string, unknown> }>(
  blocks: T[],
) {
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

export function getLocationSectionOrder<
  T extends { id?: string; type?: string; props: Record<string, unknown> },
>(blocks: T[]) {
  const serviceBlock = blocks.find(
    (block) => block.type === "cards-grid" && /^Our Services in /i.test(text(block.props.title)),
  );
  const introBlock = blocks.find((block) => block.type === "rich-text");
  const whyBlock = blocks.find(
    (block) =>
      block.type === "cards-grid" &&
      /^Why .+ Choose Glass (?:&|and) Door Pro$/i.test(text(block.props.title)),
  );
  const featured = [serviceBlock, introBlock, whyBlock].filter((block) => block !== undefined);
  const remainingBlocks = blocks.filter(
    (block) => !featured.some((item) => item === block || (item.id && item.id === block.id)),
  );
  return {
    serviceBlock,
    introBlock,
    whyBlock,
    remainingBlocks,
    orderedBlocks: [...featured, ...remainingBlocks],
  };
}
