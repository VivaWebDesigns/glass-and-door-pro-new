# Service Detail Pages Design QA

## Comparison target

- Approved desktop direction: `/Users/matt/.codex/generated_images/01a0537c-6de8-74a0-8396-fce6057ea903/exec-cc3f8664-c32e-4b89-b908-7452958b39ba.png`
- Approved mobile direction: `/Users/matt/.codex/generated_images/01a0537c-6de8-74a0-8396-fce6057ea903/exec-dff4ecd5-8480-41fe-ad96-41e14c39327e.png`
- Residential implementation, desktop: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/20-window-installation-desktop.jpg`
- Commercial implementation, desktop: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/21-commercial-storefront-desktop.jpg`
- Commercial implementation, mobile: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/22-commercial-storefront-mobile.jpg`
- Residential implementation, mobile: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/24-window-installation-mobile.jpg`
- Desktop side-by-side, approved direction left / commercial implementation right: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/25-commercial-desktop-comparison.png`
- Mobile side-by-side, approved direction left / residential implementation right: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/service-pages-audit/26-window-mobile-comparison.png`

## Scope and state

- Applied the approved editorial layout to all nine service-detail routes: four residential and five commercial.
- The `/services` overview was explicitly checked and remains on its existing layout.
- All page headings, body copy, card copy, FAQ copy, calls to action, images, and links continue to come from the existing CMS blocks without rewriting.
- The only layout-authored visible utility label remains `On this page`.
- Desktop viewport: 1440 × 1024 at device scale factor 1.
- Mobile viewport: 390 × 844 at device scale factor 1.
- Local preview used the live production CMS API because a local database URL was not available.

## Full-view comparison evidence

- Residential and commercial pages both preserve the selected direction's full-width photographic hero, strong left-aligned promise, teal conversion action, white editorial reading surface, narrow desktop guide, generous section spacing, dividers, and lightweight benefit rows.
- Long commercial headings wrap cleanly in the hero and section guide without clipping or horizontal overflow.
- The desktop guide stays visually subordinate to the article and keeps the page's existing primary and phone actions available.
- On mobile, every section becomes a single readable column and the desktop guide becomes an expandable 48px-height page guide.
- Existing gallery, FAQ, related-service, closing CTA, and footer content retain their original ordering and copy.

## Required fidelity surfaces

- Typography: existing Inter body and Manrope heading fonts, brand weights, and hierarchy are preserved.
- Spacing: the 48rem reading measure and wide section rhythm carry consistently across both short and long content sets.
- Color: existing navy, teal, white, slate, border, and focus tokens are unchanged.
- Assets: every hero and gallery image is the page's existing CMS asset; no placeholders or substitute art were introduced.
- Responsive behavior: mobile pages use one column, 16px page gutters, stacked hero actions, and an expandable section guide.

## Route and interaction checks

- Confirmed the shared guide and page-specific H1 on all nine service-detail routes.
- Confirmed `/services` does not render the editorial service-detail guide.
- Opened the mobile `On this page` control on the commercial storefront page and confirmed all section links were exposed.
- The primary quote and phone actions remain the existing CMS-configured controls.
- Browser inspection showed no new layout failures. The previously documented development-only React warning about `fetchPriority` casing remains unrelated to this work.

## Findings

- No actionable P0, P1, or P2 findings remain.
- P3: particularly long service names naturally wrap over more hero lines on mobile, but remain readable, unobscured, and inside the viewport.
- P3: the approved concept includes invented trust/testimonial copy; those regions remain intentionally omitted to honor the no-copy-change requirement.

final result: passed
