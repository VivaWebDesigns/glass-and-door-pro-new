// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { JsonLd } from "./json-ld";

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you serve Monroe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes.",
      },
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://glassanddoorpro.com/#business",
  name: "Glass and Door Pro",
  priceRange: "$$",
};

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => {
    root?.unmount();
  });
  root = null;
  container?.remove();
  container = null;
  document.head.innerHTML = "";
  document.body.innerHTML = "";
});

function renderJsonLd(schemas = [faqSchema]) {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => {
    root?.render(<JsonLd schemas={schemas} />);
  });
}

function jsonLdScripts() {
  return Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
}

describe("JsonLd", () => {
  it("replaces matching prerendered schema instead of duplicating it", () => {
    const prerendered = document.createElement("script");
    prerendered.type = "application/ld+json";
    prerendered.textContent = JSON.stringify(faqSchema);
    document.head.appendChild(prerendered);

    renderJsonLd();

    const scripts = jsonLdScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toMatch(/^ld-json-/);
    expect(JSON.parse(scripts[0].textContent || "{}")).toEqual(faqSchema);
  });

  it("replaces equivalent prerendered schema when non-identity fields differ", () => {
    const prerendered = document.createElement("script");
    prerendered.type = "application/ld+json";
    prerendered.textContent = JSON.stringify({
      ...localBusinessSchema,
      priceRange: "$",
    });
    document.head.appendChild(prerendered);

    renderJsonLd([localBusinessSchema]);

    const scripts = jsonLdScripts();
    expect(scripts).toHaveLength(1);
    expect(scripts[0].id).toMatch(/^ld-json-/);
    expect(JSON.parse(scripts[0].textContent || "{}")).toEqual(localBusinessSchema);
  });
});
