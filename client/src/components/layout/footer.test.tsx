// @vitest-environment jsdom

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./footer";

vi.mock("@tanstack/react-query", () => ({
  useQuery: () => ({ data: null }),
}));

vi.mock("@/components/shared/branding-provider", () => ({
  useBranding: () => ({
    frontendLogoUrl: null,
    companyAddress: null,
    companyName: "Glass & Door Pro",
    companyPhoneNumbers: null,
  }),
}));

describe("Footer", () => {
  it("uses the requested nine-location order in fallback navigation", () => {
    globalThis.React = React;
    const html = renderToStaticMarkup(<Footer />);
    const doc = new DOMParser().parseFromString(html, "text/html");
    expect(
      Array.from(doc.querySelectorAll('a[href^="/service-areas/"]')).map(
        (link) => link.textContent,
      ),
    ).toEqual([
      "Charlotte",
      "Pineville",
      "Matthews",
      "Weddington",
      "Indian Trail",
      "Wesley Chapel",
      "Stallings",
      "Fort Mill",
      "Indian Land",
    ]);
  });

  it("renders a crawlable Viva Web Designs attribution link", () => {
    globalThis.React = React;
    const html = renderToStaticMarkup(<Footer />);

    expect(html).toContain("Website by");
    expect(html).toContain('href="https://vivawebdesigns.com/" target="_blank" rel="noopener"');
    expect(html).toContain(">Viva Web Designs</a>");
    expect(html).not.toContain('rel="nofollow"');
    expect(html).not.toContain("Powered by");
  });
});
