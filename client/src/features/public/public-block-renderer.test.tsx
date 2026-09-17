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
