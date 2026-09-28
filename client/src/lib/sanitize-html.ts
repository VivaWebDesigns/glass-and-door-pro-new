import DOMPurify from "dompurify";

const EMBED_TAGS = ["iframe"];
const EMBED_ATTRIBUTES = ["allow", "allowfullscreen", "frameborder", "scrolling", "loading", "referrerpolicy"];

let hooksInstalled = false;

function ensureHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/** Sanitize CMS rich text (headings, paragraphs, lists, links, inline formatting). */
export function sanitizeRichHtml(value: string): string {
  if (!value) return "";
  ensureHooks();
  return DOMPurify.sanitize(value, { ADD_ATTR: ["target"] });
}

/** Sanitize admin-authored embed code: rich text plus iframes (maps, video). */
export function sanitizeEmbedHtml(value: string): string {
  if (!value) return "";
  ensureHooks();
  return DOMPurify.sanitize(value, {
    ADD_TAGS: EMBED_TAGS,
    ADD_ATTR: ["target", ...EMBED_ATTRIBUTES],
  });
}
