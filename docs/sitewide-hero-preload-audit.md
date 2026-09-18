# Site-wide hero preload coverage

Audit date: September 18, 2026. Baseline: `684ef78`. Scope: all 26 sitemap URLs, the two omitted legal pages, and the linked contact form, with internal page links followed during discovery. Total: **29 public pages**. Admin, authentication and unpublished pages are outside this public-page audit.

Every discovered page returned HTTP 200 and rendered in mobile Chromium (Pixel 7 emulation) without uncaught browser errors or horizontal overflow. These were unthrottled functional inspections, not 29 Google PageSpeed tests or comparable performance grades. The gallery and contact form use different heading markup; their initial generic heading wait was replaced with page-specific readiness checks before accepting their results.

## Findings and change

- All 23 CMS pages with leading hero images already emitted the correct high-priority preload from the previous shared fix. Each preload matched the successfully loaded rendered hero URL.
- `/service-areas` uses a standalone React page, so it bypassed the CMS-only preload. Its server snapshot now emits the same image hint. A shared asset constant in `shared/glass-service-areas.ts` is used by both the page and server to prevent URL drift.
- The gallery and three legal pages had text as their sampled LCP element, not leading hero imagery. The contact form has no hero; its small brand logo was the sampled LCP element. No speculative hero preload was added to these five pages.

## Page ledger

| Page                                                                                                                                            | Disposition                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [/](https://glassanddoorpro.com/)                                                                                                               | Existing preload matches rendered hero  |
| [/disclaimer](https://glassanddoorpro.com/disclaimer)                                                                                           | No leading hero; no hero preload needed |
| [/forms/contact-form](https://glassanddoorpro.com/forms/contact-form)                                                                           | No leading hero; no hero preload needed |
| [/gallery](https://glassanddoorpro.com/gallery)                                                                                                 | No leading hero; no hero preload needed |
| [/privacy-policy](https://glassanddoorpro.com/privacy-policy)                                                                                   | No leading hero; no hero preload needed |
| [/reviews](https://glassanddoorpro.com/reviews)                                                                                                 | Existing preload matches rendered hero  |
| [/service-areas](https://glassanddoorpro.com/service-areas)                                                                                     | Added standalone hero preload           |
| [/service-areas/charlotte](https://glassanddoorpro.com/service-areas/charlotte)                                                                 | Existing preload matches rendered hero  |
| [/service-areas/fort-mill](https://glassanddoorpro.com/service-areas/fort-mill)                                                                 | Existing preload matches rendered hero  |
| [/service-areas/indian-land](https://glassanddoorpro.com/service-areas/indian-land)                                                             | Existing preload matches rendered hero  |
| [/service-areas/indian-trail](https://glassanddoorpro.com/service-areas/indian-trail)                                                           | Existing preload matches rendered hero  |
| [/service-areas/matthews](https://glassanddoorpro.com/service-areas/matthews)                                                                   | Existing preload matches rendered hero  |
| [/service-areas/monroe](https://glassanddoorpro.com/service-areas/monroe)                                                                       | Existing preload matches rendered hero  |
| [/service-areas/pineville](https://glassanddoorpro.com/service-areas/pineville)                                                                 | Existing preload matches rendered hero  |
| [/service-areas/stallings](https://glassanddoorpro.com/service-areas/stallings)                                                                 | Existing preload matches rendered hero  |
| [/service-areas/waxhaw](https://glassanddoorpro.com/service-areas/waxhaw)                                                                       | Existing preload matches rendered hero  |
| [/service-areas/weddington](https://glassanddoorpro.com/service-areas/weddington)                                                               | Existing preload matches rendered hero  |
| [/service-areas/wesley-chapel](https://glassanddoorpro.com/service-areas/wesley-chapel)                                                         | Existing preload matches rendered hero  |
| [/services](https://glassanddoorpro.com/services)                                                                                               | Existing preload matches rendered hero  |
| [/services/commercial-door-installation](https://glassanddoorpro.com/services/commercial-door-installation)                                     | Existing preload matches rendered hero  |
| [/services/commercial-door-replacement-repair](https://glassanddoorpro.com/services/commercial-door-replacement-repair)                         | Existing preload matches rendered hero  |
| [/services/commercial-storefront-glass-installation](https://glassanddoorpro.com/services/commercial-storefront-glass-installation)             | Existing preload matches rendered hero  |
| [/services/commercial-storefront-glass-replacement-repair](https://glassanddoorpro.com/services/commercial-storefront-glass-replacement-repair) | Existing preload matches rendered hero  |
| [/services/commercial-window-replacement](https://glassanddoorpro.com/services/commercial-window-replacement)                                   | Existing preload matches rendered hero  |
| [/services/door-installation](https://glassanddoorpro.com/services/door-installation)                                                           | Existing preload matches rendered hero  |
| [/services/frameless-showers](https://glassanddoorpro.com/services/frameless-showers)                                                           | Existing preload matches rendered hero  |
| [/services/window-installation](https://glassanddoorpro.com/services/window-installation)                                                       | Existing preload matches rendered hero  |
| [/services/window-repair](https://glassanddoorpro.com/services/window-repair)                                                                   | Existing preload matches rendered hero  |
| [/terms-of-service](https://glassanddoorpro.com/terms-of-service)                                                                               | No leading hero; no hero preload needed |

## Verification

`npm run check`, `npm run lint`, `npm run format`, `npm test` (210 tests across 59 files), and `npm run build` pass. The new regression case checks the service-area overview preload and ensures the gallery does not receive it. The existing PostCSS source-metadata warning remains.

Live inspection occurred before this task’s push. The new standalone-page change was verified locally; its deployment is not claimed. No real form submission, database mutation, private-page audit or CRM audit update was performed.

## Standalone overview measurement

Three fresh local mobile contexts per variant, 4x CPU slowdown, 150 ms latency and 200,000 bytes/sec download. The overview hero request moved from a median 1,767 ms to 175 ms. Median LCP improved from 5,256 ms to 4,916 ms. Each run downloaded the hero once with no page errors or unexpected HTTP failures. This is a local comparison, not a new Google score.

The overview hero is 648,168 bytes, so download size remains a meaningful bottleneck despite earlier discovery. This pass applies the existing preload optimization; it does not change image quality or claim that every page now meets mobile performance targets.

Production bundle regression checks also passed. React Doctor 0.9.14's full uncached scan remains 58/100, zero errors and 154 warnings, with complete coverage and no skipped checks or disabled rules.
