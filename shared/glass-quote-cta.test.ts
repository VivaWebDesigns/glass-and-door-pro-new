import { describe, it, expect } from "vitest";
import {
  applyQuoteCtaRefresh,
  GLASS_CTA_HOURS_LINE,
  GLASS_QUOTE_CTA_TEXT,
} from "./glass-quote-cta";

describe("applyQuoteCtaRefresh", () => {
  it("unifies quote labels and shortens the closing hours line once", () => {
    const content = {
      blocks: [
        {
          type: "hero",
          props: { ctaText: "Call (704) 771-6111", ctaSecondaryText: "Request a Free Quote" },
        },
        {
          type: "cta",
          props: {
            subheading:
              "<p>Call, text, or fill out the form.</p><p><strong>Mon-Sat: 7am - 7pm | Serving Charlotte, Pineville, Matthews, and nearby areas</strong></p>",
            primaryText: "Call (704) 771-6111",
            secondaryText: "Get Your Free Estimate",
            secondaryModalTitle: "Request a Free Estimate",
          },
        },
        { type: "rich-text", props: { content: "<p>Request a Free Quote today.</p>" } },
      ],
    };

    const result = applyQuoteCtaRefresh(content)!;
    const [hero, cta, text] = result.blocks as { props: Record<string, string> }[];
    expect(hero.props.ctaSecondaryText).toBe(GLASS_QUOTE_CTA_TEXT);
    expect(hero.props.ctaText).toBe("Call (704) 771-6111");
    expect(cta.props.secondaryText).toBe(GLASS_QUOTE_CTA_TEXT);
    expect(cta.props.secondaryModalTitle).toBe(GLASS_QUOTE_CTA_TEXT);
    expect(cta.props.subheading).toBe(
      `<p>Call, text, or fill out the form.</p><p>${GLASS_CTA_HOURS_LINE}</p>`,
    );
    expect(text.props.content).toBe("<p>Request a Free Quote today.</p>");
    expect(applyQuoteCtaRefresh(result)).toBeNull();
  });

  it("skips pages without hero or CTA blocks", () => {
    expect(applyQuoteCtaRefresh({ blocks: [{ type: "rich-text", props: {} }] })).toBeNull();
  });
});
