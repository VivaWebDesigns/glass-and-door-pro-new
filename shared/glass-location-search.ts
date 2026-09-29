import type { InsertCmsPage } from "./schema";

const locationPlaces: Record<string, string> = {
  "areas-served-charlotte-nc": "Charlotte, NC",
  "areas-served-monroe-nc": "Monroe, NC",
  "service-areas-indian-trail": "Indian Trail, NC",
  "service-areas-stallings": "Stallings, NC",
  "service-areas-wesley-chapel": "Wesley Chapel, NC",
  "service-areas-waxhaw": "Waxhaw, NC",
  "service-areas-matthews": "Matthews, NC",
  "service-areas-weddington": "Weddington, NC",
  "service-areas-indian-land": "Indian Land, SC",
  "service-areas-fort-mill": "Fort Mill, SC",
  "service-areas-pineville": "Pineville, NC",
};

export function getGlassLocationSearchCopy(slug: string) {
  const place = locationPlaces[slug];
  if (!place) return null;

  return {
    place,
    title: `Glass Shower Door Installation in ${place}`,
    heading: `Glass Shower Door Installer in ${place}`,
    subheading: `<p>Custom glass shower door installation in ${place}. Doug personally measures and installs every door. 15+ years of experience and Saturday appointments available.</p>`,
    description: `Custom glass shower door installation in ${place}. Doug personally measures and installs every door. Call (704) 771-6111 for a free quote.`,
    intro: `Glass and Door Pro installs custom glass shower doors in ${place}. Doug personally measures each opening and installs the finished door himself.`,
  };
}

export function updateGlassLocationSearchContent(
  slug: string,
  content: InsertCmsPage["content"],
): InsertCmsPage["content"] {
  const copy = getGlassLocationSearchCopy(slug);
  if (!copy || !isRecord(content) || !Array.isArray(content.blocks)) {
    return content;
  }

  let changed = false;
  let introUpdated = false;
  const blocks = content.blocks.map((block: unknown) => {
    if (!isRecord(block) || !isRecord(block.props)) return block;

    if (block.type === "hero" && typeof block.props.heading === "string") {
      if (block.props.heading === copy.heading && block.props.subheading === copy.subheading) {
        return block;
      }
      changed = true;
      return {
        ...block,
        props: { ...block.props, heading: copy.heading, subheading: copy.subheading },
      };
    }

    if (!introUpdated && block.type === "rich-text" && typeof block.props.content === "string") {
      introUpdated = true;
      if (block.props.content.includes(copy.intro)) return block;
      changed = true;
      return {
        ...block,
        props: { ...block.props, content: `<p>${copy.intro}</p>${block.props.content}` },
      };
    }

    return block;
  });

  return changed ? ({ ...content, blocks } as InsertCmsPage["content"]) : content;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
