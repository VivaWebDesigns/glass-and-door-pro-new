// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize-html";

describe("CMS HTML boundaries", () => {
  it("keeps editorial formatting while removing active content", () => {
    const html = sanitizeHtml(
      '<p style="color:red"><strong>Hello</strong><img src="/photo.jpg" onerror="alert(1)"></p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>',
    );
    expect(html).toContain("<strong>Hello</strong>");
    expect(html).toContain('src="/photo.jpg"');
    expect(html).not.toMatch(/onerror|<script|javascript:/);
  });
  it("sandboxes HTTPS embeds and rejects executable iframe sources", () => {
    const html = sanitizeHtml(
      '<iframe src="https://player.vimeo.com/video/123" sandbox="allow-same-origin" srcdoc="evil"></iframe><iframe src="javascript:alert(1)"></iframe>',
    );
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelectorAll("iframe")).toHaveLength(1);
    expect(root.querySelector("iframe")?.getAttribute("sandbox")).toBe(
      "allow-scripts allow-forms allow-popups",
    );
    expect(html).not.toContain("srcdoc");
  });
  it("protects links opening new windows", () => {
    expect(sanitizeHtml('<a href="https://example.com" target="_blank">Link</a>')).toContain(
      'rel="noopener noreferrer"',
    );
  });
});
