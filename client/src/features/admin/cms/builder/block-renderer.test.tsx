// @vitest-environment jsdom

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlockRenderer } from "./block-renderer";

describe("CardsGridBlock", () => {
  it("renders service actions as crawlable links", () => {
    globalThis.React = React;
    const markup = renderToStaticMarkup(
      <BlockRenderer
        block={{
          id: "services",
          type: "cards-grid",
          props: {
            title: "What We Offer",
            cards: [
              {
                icon: "Droplets",
                title: "Frameless Showers",
                description: "Custom frameless shower enclosures.",
                link: "/services/frameless-showers",
                buttonText: "Learn More",
              },
              {
                icon: "Building2",
                title: "Commercial Window Replacement",
                description: "Commercial window replacement.",
                link: "https://example.com/commercial-windows",
                buttonText: "Learn More",
                openInNewTab: true,
              },
            ],
          },
        }}
      />,
    );

    document.body.innerHTML = markup;

    expect(
      document.querySelector('a[href="/services/frameless-showers"]')?.textContent,
    ).toContain("Learn More");
    expect(
      document.querySelector('a[href="https://example.com/commercial-windows"]'),
    ).toMatchObject({ target: "_blank", rel: "noopener noreferrer" });
  });
});
