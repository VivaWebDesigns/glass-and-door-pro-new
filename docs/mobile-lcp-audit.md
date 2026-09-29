# Mobile LCP audit: homepage, frameless showers and Waxhaw

Date: September 18, 2026. Baseline commit: `53cb836`.

## Live findings before the change

Read-only Chromium mobile traces of the three public URLs, Pixel 7 emulation, cold contexts, 4x CPU slowdown, 150 ms latency and 200,000 bytes/sec download. These are diagnostic browser traces, not official Google PageSpeed scores. Each live page was sampled once; the user's PageSpeed results remain separate measurements.

| Page                                                                        | LCP element                                        | Image dimensions | Image bytes | HTML first byte | Image request starts |      LCP |
| --------------------------------------------------------------------------- | -------------------------------------------------- | ---------------- | ----------: | --------------: | -------------------: | -------: |
| [Homepage](https://glassanddoorpro.com/)                                    | `gallery-shower1-1280w.webp` hero/poster           | 1280 × 853       |      94,182 |          354 ms |             3,437 ms | 5,180 ms |
| [Frameless showers](https://glassanddoorpro.com/services/frameless-showers) | `modern-frameless-shower-hero-1920x1080.webp` hero | 1920 × 1080      |     180,132 |          270 ms |             3,386 ms | 6,192 ms |
| [Waxhaw](https://glassanddoorpro.com/service-areas/waxhaw)                  | `city-waxhaw-hero.webp` hero                       | 1920 × 1080      |     309,268 |          253 ms |             3,333 ms | 5,972 ms |

All three rendered hero images already had `loading="eager"` and `fetchpriority="high"`. Their URLs appeared in embedded CMS JSON, but there was no image preload in the initial head; JSON does not cause an image request. The image requests started about three seconds after the HTML arrived, when the React page rendered. Server response time was not the dominant delay in these samples. The homepage also requests several large body/gallery images concurrently with its hero.

The sum of observed long-task time above 50 ms was 72/57/60 ms respectively. This is not Lighthouse TBT: sampling conditions and measurement windows differ. The previously reported 441 ms service-page blocking result was not reproduced here and does not justify a speculative JavaScript rewrite. Third-party scripts and run-to-run differences remain possible contributors.

## Fix

`server/services/public-prerender.service.ts` now emits one high-priority image preload in the initial document head when the first CMS block is a hero using a static `/images/glass-door-pro/` asset. The hint matches the rendered image URL and the homepage video poster. It is derived from current CMS content, not hardcoded per route.

The intentionally narrow path/extension check skips absent images, later heroes, external/upload URLs and malformed values. Uploaded legacy assets may be remapped in the client, so guessing their preload URL could waste bandwidth. No image quality, page layout, tracking, database content or cache policy was changed.

Seven regression cases exercise the emitted head and omissions, including multiple heroes, non-leading heroes and unsafe URLs.

## Validation and limits

The controlled comparison replays captured public page HTML and embedded CMS content against local production assets. Both variants mock API data and block external fonts/analytics. The preload is the only HTML difference between variants. It omits live server latency and third-party work, so it isolates image discovery rather than predicting an official PageSpeed score.

| Page              | Before: median LCP | With preload: median LCP | Image start before → after |
| ----------------- | -----------------: | -----------------------: | -------------------------: |
| Homepage          |           5,476 ms |                 3,096 ms |             2,584 → 190 ms |
| Frameless showers |           4,932 ms |                 3,288 ms |             2,659 → 220 ms |
| Waxhaw            |           4,328 ms |                 3,620 ms |             2,608 → 205 ms |

Three fresh browser contexts per page/variant (18 samples total), with normal within-navigation caching. Every sample downloaded the hero exactly once and reported no uncaught page errors or unexpected HTTP failures. The initial forced-cache-off replay was rejected because it artificially duplicated preload downloads; only the corrected runs are reported here.

The preload improves all three controlled medians. Waxhaw still spends more time transferring its larger hero, so responsive image sizing remains a possible follow-up after live measurement of this change. No new Google PageSpeed score is claimed, and the saved CRM audit was not modified.

`npm run check`, `npm run lint`, `npm run format`, `npm test` (209 tests across 59 files), and `npm run build` passed. The existing PostCSS source-metadata warning remains. Database-backed local route handling and post-push Railway deployment were not verified. The measured browser replay used captured public CMS content and local assets rather than a live database.

[Per-run measurements](./mobile-lcp-measurements.json) retain the accepted local samples. React Doctor 0.9.14's full uncached scan remains 58/100, zero errors and 154 warnings, with no skipped checks or disabled rules.
