// @vitest-environment jsdom

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PublicBlockRenderer } from "./public-block-renderer";
import { ServiceEditorialLayout } from "./service-editorial-layout";

const route = vi.hoisted(() => ({ path: "/services" }));
vi.mock("wouter", async (importOriginal) => ({
  ...(await importOriginal<typeof import("wouter")>()),
  useLocation: () => [route.path, vi.fn()],
}));
vi.mock("@tanstack/react-query", () => ({ useQuery: () => ({ data: null }) }));
vi.mock("@/components/shared/branding-provider", () => ({
  useBranding: () => ({ companyName: "Glass & Door Pro" }),
}));

describe("search snippet utility exclusions", () => {
  it.each([
    "/services",
    "/services/window-repair",
    "/services/door-installation",
    "/services/frameless-showers",
  ])("keeps phone links functional and scopes exclusions on %s", (path) => {
    globalThis.React = React;
    route.path = path;
    const html = renderToStaticMarkup(
      <>
        <Navbar />
        <PublicBlockRenderer
          block={{
            id: "hero",
            type: "hero",
            props: {
              heading: "Existing heading",
              subheading: "<p>Existing description.</p>",
              ctaText: "Get a Free Quote",
              ctaAction: "custom-link",
              ctaLink: "/#contact",
              ctaSecondaryText: "Call (704) 771-6111",
              ctaSecondaryAction: "custom-link",
              ctaSecondaryLink: "tel:+17047716111",
            },
          }}
        />
        <PublicBlockRenderer
          block={{
            id: "cta",
            type: "cta",
            props: {
              heading: "Existing closing heading",
              subheading: "<p>Existing closing copy.</p>",
              primaryText: "Get a Free Quote",
              primaryAction: "custom-link",
              primaryLink: "/#contact",
              secondaryText: "Call (704) 771-6111",
              secondaryAction: "custom-link",
              secondaryLink: "tel:+17047716111",
            },
          }}
        />
        <ServiceEditorialLayout
          blocks={[
            {
              id: "editorial-hero",
              type: "hero",
              props: {
                heading: "Existing heading",
                ctaText: "Get a Free Quote",
                ctaAction: "custom-link",
                ctaLink: "/#contact",
                ctaSecondaryText: "Call (704) 771-6111",
                ctaSecondaryAction: "custom-link",
                ctaSecondaryLink: "tel:+17047716111",
              },
            },
          ]}
        />
        <Footer />
      </>,
    );
    const doc = new DOMParser().parseFromString(html, "text/html");
    const excluded = path !== "/services/frameless-showers";
    const phoneLinks = [...doc.querySelectorAll('a[href="tel:+17047716111"]')];
    expect(phoneLinks.length).toBeGreaterThanOrEqual(6);
    phoneLinks.forEach((link) => {
      expect(Boolean(link.closest("[data-nosnippet]"))).toBe(excluded);
      expect(link.textContent).toContain("(704) 771-6111");
    });
    for (const p of doc.querySelectorAll("p")) {
      if (p.textContent?.startsWith("Existing")) expect(p.closest("[data-nosnippet]")).toBeNull();
    }
    if (!excluded) expect(doc.querySelector("[data-nosnippet]")).toBeNull();
  });
});
