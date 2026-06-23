import type { BuilderContent } from "./block-registry";

export const mixedBuilderFixture: BuilderContent = {
  blocks: [
    {
      id: "hero-block",
      type: "hero",
      props: {
        heading: "Glass & Door Pro",
        subheading: "<p>Glass, door, and window service for the Charlotte area.</p>",
        layout: "stacked",
      },
    },
    {
      id: "cta-legacy-block",
      type: "call-to-action",
      props: {
        heading: "Ready to start your project?",
        body: "<p>Request a quote from Glass & Door Pro.</p>",
        ctaText: "Get a Free Quote",
      },
    },
    {
      id: "faq-block",
      type: "faq",
      props: {
        heading: "Common Questions",
        items: [
          { question: "How do I apply?", answer: "<p>Use the application form.</p>" },
        ],
      },
    },
    {
      id: "cards-block",
      type: "cards-grid",
      props: {
        heading: "Popular Services",
      },
    },
  ],
};

export const fixtureWithBrokenPreview: BuilderContent = {
  blocks: [
    ...mixedBuilderFixture.blocks,
    {
      id: "broken-preview-block",
      type: "unknown-preview",
      props: {
        heading: "Unsupported Block",
      },
    },
  ],
};
