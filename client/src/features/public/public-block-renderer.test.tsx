// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it } from "vitest";
import { PublicBlockRenderer } from "./public-block-renderer";

it("preserves testimonial source DOM across parent renders", () => {
  globalThis.React = React;
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  const block = {
    id: "reviews",
    type: "testimonials",
    props: {
      variant: "google-carousel",
      items: [{ name: "Customer", quote: "Great service", source: "Google" }],
    },
  };
  try {
    act(() => root.render(<PublicBlockRenderer block={block} />));
    const icon = container.querySelector('svg[viewBox="0 0 48 48"]');
    expect(icon).not.toBeNull();
    act(() =>
      root.render(
        <PublicBlockRenderer
          block={{ ...block, props: { ...block.props, title: "Updated reviews" } }}
        />,
      ),
    );
    expect(container.querySelector('svg[viewBox="0 0 48 48"]')).toBe(icon);
  } finally {
    act(() => root.unmount());
  }
});

it("uses the still image without mounting the hero video on mobile", () => {
  globalThis.React = React;
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const originalMatchMedia = Object.getOwnPropertyDescriptor(window, "matchMedia");
  const block = {
    id: "hero",
    type: "hero",
    props: {
      heading: "Glass and Door Pro",
      backgroundImageUrl: "/images/glass-door-pro/gallery-shower1-1280w.webp",
      videoBackgroundUrl: "/videos/glass-door-pro/hero-video.mp4",
    },
  };

  try {
    for (const mobile of [true, false]) {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: (media: string) => ({
          matches: mobile && media.includes("max-width"),
          media,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }),
      });
      const container = document.createElement("div");
      const root = createRoot(container);
      try {
        act(() => root.render(<PublicBlockRenderer block={block} />));
        expect(container.querySelector("section img")).not.toBeNull();
        expect(container.querySelector("video") !== null).toBe(!mobile);
      } finally {
        act(() => root.unmount());
      }
    }
  } finally {
    if (originalMatchMedia) {
      Object.defineProperty(window, "matchMedia", originalMatchMedia);
    } else {
      Reflect.deleteProperty(window, "matchMedia");
    }
  }
});
