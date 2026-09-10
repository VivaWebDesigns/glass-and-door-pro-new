import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/forms/public-form-renderer", () => ({
  PublicFormRenderer: () => <div>Form</div>,
}));

import { ContactFormBlock } from "./public-dynamic-blocks";

describe("ContactFormBlock", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("leaves the contact anchor ID on its section-style wrapper", () => {
    vi.stubGlobal("React", React);
    const html = renderToStaticMarkup(
      <ContactFormBlock props={{ variant: "split-contact", anchorId: "contact" }} />,
    );

    expect(html).not.toContain('id="contact"');
    expect(html).toContain('data-testid="dynamic-contact-form"');
  });
});
