import { describe, expect, it } from "vitest";
import { putCallButtonFirst } from "./glass-call-first";

describe("putCallButtonFirst", () => {
  it("swaps a quote-first hero so the call button leads", () => {
    expect(
      putCallButtonFirst("hero", {
        heading: "Keep",
        ctaText: "Request a Free Quote",
        ctaAction: "form-modal",
        ctaLink: "",
        ctaFormSlug: "contact-form",
        ctaSecondaryText: "Call (704) 771-6111",
        ctaSecondaryAction: "custom-link",
        ctaSecondaryLink: "tel:+17047716111",
      }),
    ).toEqual({
      heading: "Keep",
      ctaText: "Call (704) 771-6111",
      ctaAction: "custom-link",
      ctaLink: "tel:+17047716111",
      ctaSecondaryText: "Request a Free Quote",
      ctaSecondaryAction: "form-modal",
      ctaSecondaryLink: "",
      ctaSecondaryFormSlug: "contact-form",
    });
  });

  it("swaps CTA block buttons", () => {
    expect(
      putCallButtonFirst("cta", {
        primaryText: "Get Your Free Estimate",
        primaryAction: "form-modal",
        secondaryText: "Call (704) 771-6111",
        secondaryLink: "tel:+17047716111",
      }),
    ).toEqual({
      primaryText: "Call (704) 771-6111",
      primaryLink: "tel:+17047716111",
      secondaryText: "Get Your Free Estimate",
      secondaryAction: "form-modal",
    });
  });

  it("adds a call button ahead of a lone quote button", () => {
    expect(
      putCallButtonFirst("hero", {
        ctaText: "Get a Free Quote",
        ctaLink: "#contact",
        ctaAction: "internal-link",
        ctaSecondaryText: "",
        ctaSecondaryLink: "",
      }),
    ).toEqual({
      ctaText: "Call (704) 771-6111",
      ctaAction: "custom-link",
      ctaLink: "tel:+17047716111",
      ctaSecondaryText: "Get a Free Quote",
      ctaSecondaryLink: "#contact",
      ctaSecondaryAction: "internal-link",
    });
  });

  it("leaves call-first, call-free, and non-button blocks alone", () => {
    const callFirst = { ctaText: "Call", ctaLink: "tel:+17047716111", ctaSecondaryText: "Quote" };
    const reviews = { ctaText: "Read all reviews", ctaSecondaryText: "Request a Free Estimate" };
    const richText = { content: "<p>Hi</p>" };
    expect(putCallButtonFirst("hero", callFirst)).toBe(callFirst);
    expect(putCallButtonFirst("hero", reviews)).toBe(reviews);
    expect(putCallButtonFirst("rich-text", richText)).toBe(richText);
  });
});
