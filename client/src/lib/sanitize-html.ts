import DOMPurify from "dompurify";

// CMS markup may contain embedded media, but embedded code must not inherit
// the application's origin or access its authenticated parent document.
DOMPurify.addHook?.("afterSanitizeAttributes", (node) => {
  if (node.tagName === "IFRAME") {
    if (!/^https:\/\//i.test(node.getAttribute("src") || "")) {
      node.remove();
      return;
    }
    node.setAttribute("sandbox", "allow-scripts allow-forms allow-popups");
    node.removeAttribute("srcdoc");
    if (!node.getAttribute("title")) node.setAttribute("title", "Embedded content");
  }
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export function sanitizeHtml(html: string): string {
  if (typeof DOMPurify.sanitize !== "function") return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["target", "allow", "allowfullscreen", "frameborder", "scrolling", "sandbox"],
    FORBID_ATTR: ["srcdoc"],
  });
}
