# Location Detail Pages Design QA

## Comparison target

- Source visual truth: `/Users/matt/.codex/generated_images/01a0537c-6de8-74a0-8396-fce6057ea903/exec-0fc6f93b-4b73-4650-acbb-fc0b061d4c01.png`
- Charlotte desktop implementation: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/01-charlotte-desktop.jpg`
- Fort Mill desktop implementation: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/02-fort-mill-desktop.jpg`
- Fort Mill mobile implementation: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/03-fort-mill-mobile.jpg`
- Charlotte mobile page guide open: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/04-charlotte-mobile-guide-open.jpg`
- Charlotte comparison, source left / implementation right: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/05-charlotte-comparison.png`
- Fort Mill comparison, source left / implementation right: `/Users/matt/.codex/visualizations/2026/08/30/01a0537c-6de8-74a0-8396-fce6057ea903/all-location-pages-qa/06-fort-mill-comparison.png`

## Scope, viewport, and normalization

- Applied the approved service-first layout to all 11 published location-detail routes: Charlotte, Monroe, Indian Trail, Stallings, Wesley Chapel, Waxhaw, Matthews, Weddington, Indian Land, Fort Mill, and Pineville.
- The `/service-areas` overview was explicitly checked and remains on its existing layout.
- Source pixels: 862 × 1824 at density 1.
- Desktop CSS viewport: 1440 × 1024 at density 1. Full-page implementation captures exclude the 15px scrollbar.
- Desktop comparisons normalize the first 3015 implementation pixels to 862 × 1824, matching the source width and upper-page composition.
- Mobile CSS viewport: 390 × 844 at density 1. Fort Mill full-page implementation capture is 375 × 10619 pixels.
- State: published CMS pages, default theme, unauthenticated, top-of-page for desktop comparisons.
- The source uses Indian Trail content; Charlotte and Fort Mill comparisons evaluate the shared layout system while retaining each page's authoritative local copy and imagery.

## Full-view comparison evidence

- Every route matches the selected service-first hierarchy: full-width local hero, services first, restrained desktop guide, icon-and-divider service rows, local story paired with an existing project image, then the local proof section.
- Charlotte verifies the longest metropolitan content and a city-specific skyline hero. Fort Mill verifies South Carolina copy, a longer local-intro heading, and a different project image.
- The remaining production sections follow in their original relative order: owner story, neighborhoods, client review, FAQ, closing CTA, and footer.
- Mobile converts the guide to an expandable control, makes the service directory one column, stacks the local image and story, and preserves the complete CMS payload without horizontal overflow.
- All 11 routes were checked in the browser for their page-specific H1, service-first order, location guide, and local project image.

## Focused-region comparison evidence

- Hero: each page's production location image, exact title, subheading, and two CMS-configured actions are retained. The crop, overlay, and left-aligned composition follow the selected direction.
- Service directory: exact service names, descriptions, icons, links, and button labels render as editorial rows. Headings are left-aligned, descriptions cap at 32rem, and dividers replace card borders and shadows.
- Local story: the first existing gallery image for each location is reused beside the unchanged first rich-text narrative. The hidden gallery block remains hidden, preventing duplicated content.
- Mobile guide: opening `On this page` exposes the page-specific section headings in a 48px minimum target.

## Required fidelity surfaces

- Fonts and typography: existing Manrope headings and Inter body typography are preserved. Hierarchy, line height, wrapping, and readable measures follow the selected target.
- Spacing and layout rhythm: pages use a 48rem primary column, 15–17rem guide, 5rem editorial transitions, and row dividers instead of dense card gaps.
- Colors and visual tokens: existing navy, teal, white, slate, border, and focus tokens remain unchanged.
- Image quality and asset fidelity: every page reuses its production hero and first CMS gallery asset. No placeholder, generated replacement, CSS drawing, or custom SVG was introduced.
- Copy and content: all marketing copy, service descriptions, links, reviews, FAQs, neighborhood names, and CTAs come unchanged from CMS blocks. Only the utility label `On this page` is layout-authored.

## Findings

- No actionable P0, P1, or P2 findings remain.
- P3: page-specific copy creates natural differences in line wrapping and total page length. Preserving production copy is the controlling requirement.
- P3: a pre-existing development-only React warning reports the hero image's `fetchPriority` prop casing. It predates this layout and does not affect rendering or interactions.

## Comparison history

1. The original Indian Trail implementation comparison found the service heading centered and service descriptions wider/denser than the selected editorial directory.
   - Fix: left-aligned the heading group and capped description measure at 32rem.
   - Post-fix evidence carried into all routes and remains visible in both final comparison images.

## Primary interactions tested

- Mobile `On this page` expands and exposes location-specific section links.
- Existing service links retain their production destinations.
- Existing quote and phone actions remain present in each hero and closing CTA.
- All 11 routes render the shared guide, service-first order, H1, and local imagery.
- The service-area overview remains outside the detail-page layout.
- Desktop and mobile representative routes render without horizontal overflow.
- Browser console checked; only the named pre-existing `fetchPriority` development warning was present.

final result: passed
