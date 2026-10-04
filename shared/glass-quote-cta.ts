// One label for every quote button, and a short hours line for the closing CTA band.
// The CMS seed uses these directly; the startup CMS sync applies them once to stored pages.

export const GLASS_QUOTE_CTA_TEXT = "Get a Free Quote";
export const GLASS_CTA_HOURS_LINE = "Mon–Sat, 7am–7pm · Serving Charlotte and nearby towns";

const LEGACY_QUOTE_LABELS = new Set([
  "Get Your Free Estimate",
  "Get a Free Estimate",
  "Request a Free Estimate",
  "Request a Free Quote",
  "Request a Commercial Quote",
]);

const QUOTE_LABEL_PROPS = [
  "ctaText",
  "ctaSecondaryText",
  "ctaModalTitle",
  "ctaSecondaryModalTitle",
  "primaryText",
  "secondaryText",
  "primaryModalTitle",
  "secondaryModalTitle",
];

// Matches "<p><strong>Mon-Sat: 7am - 7pm | Serving …</strong></p>" with or without <strong>.
const LEGACY_HOURS_LINE =
  /<p>\s*(?:<strong>)?\s*Mon\s*[-–]\s*Sat:?\s*7\s*am\s*[-–]\s*7\s*pm\s*\|\s*Serving[^<]*(?:<\/strong>)?\s*<\/p>/gi;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function refreshBlockProps(type: string, props: Record<string, unknown>) {
  if (type !== "hero" && type !== "cta") return props;
  let next = props;
  for (const key of QUOTE_LABEL_PROPS) {
    const value = next[key];
    if (typeof value === "string" && LEGACY_QUOTE_LABELS.has(value.trim())) {
      next = { ...next, [key]: GLASS_QUOTE_CTA_TEXT };
    }
  }
  if (type === "cta" && typeof next.subheading === "string") {
    const subheading = next.subheading.replace(LEGACY_HOURS_LINE, `<p>${GLASS_CTA_HOURS_LINE}</p>`);
    if (subheading !== next.subheading) next = { ...next, subheading };
  }
  return next;
}

// Returns updated content, or null when there is nothing to change. Once a page has been
// updated, the _system marker keeps later admin edits to these fields from being replaced.
export function applyQuoteCtaRefresh(content: unknown) {
  if (!isRecord(content) || !Array.isArray(content.blocks)) return null;
  const systemMeta = isRecord(content._system) ? content._system : {};
  if (systemMeta.quoteCtaRefresh2026 === true) return null;
  if (!content.blocks.some((b) => isRecord(b) && (b.type === "hero" || b.type === "cta"))) {
    return null;
  }

  let changed = false;
  const blocks = content.blocks.map((block) => {
    if (!isRecord(block) || typeof block.type !== "string" || !isRecord(block.props)) return block;
    const props = refreshBlockProps(block.type, block.props);
    if (props === block.props) return block;
    changed = true;
    return { ...block, props };
  });
  if (!changed) return null;

  return { ...content, blocks, _system: { ...systemMeta, quoteCtaRefresh2026: true } };
}
