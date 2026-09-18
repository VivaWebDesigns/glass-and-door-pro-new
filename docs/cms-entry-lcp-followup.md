# CMS startup follow-up

Date: September 18, 2026. This follows the [mobile LCP audit](./mobile-lcp-audit.md) and [site-wide hero preload audit](./sitewide-hero-preload-audit.md).

## Why the preload did not settle the PageSpeed result

The user's subsequent official mobile PageSpeed runs were 68/100 and 6.34 s LCP for the homepage, 71/100 and 6.72 s for Frameless Showers, and 67/100 and 7.45 s for Waxhaw. These single runs do not show a reliable production speed gain from the preload alone.

Fresh read-only Chromium traces of the live pages confirmed that the expected hero preload is present in the initial HTML and the image request begins within roughly 0.3 s. The observed HTML first byte was roughly 0.18–0.22 s. The hero image was downloaded once per page. Under these trace settings, the homepage hero finished before the dynamically imported CMS renderer was ready; Frameless Showers and Waxhaw spent more of their time transferring their 180 KB and 309 KB hero images. These browser traces use different conditions from PageSpeed and are diagnostic, not a replacement for its scores.

Preloading the CMS chunk in isolation did not improve the controlled local run. A static CMS renderer did improve the three CMS pages, but loading it on _every_ route delayed first paint on login and the standalone Service Areas page. The production build now has two browser entries: server-rendered CMS pages receive the entry with the CMS renderer statically imported; other routes keep the lazy entry. The server selects the entry from the CMS page already loaded for the HTML snapshot, without another database query.

## Controlled local comparison

The same production build was served with either entry and captured CMS page data. Pixel 7 emulation, fresh browser context per run, 4x CPU slowdown, 150 ms latency, 200,000 bytes/sec download, and blocked third-party requests. Each cell has two runs; all rendered their hero with no uncaught page errors. This small sample shows the direction of the local change, not a promised PageSpeed score.

| Page              |   Lazy entry LCP |    CMS entry LCP | Median change |
| ----------------- | ---------------: | ---------------: | ------------: |
| Homepage          | 3,212 / 3,156 ms | 2,820 / 2,756 ms | 396 ms faster |
| Frameless Showers | 3,312 / 3,268 ms | 2,976 / 2,984 ms | 310 ms faster |
| Waxhaw            | 3,588 / 3,588 ms | 3,576 / 3,576 ms |  12 ms faster |

The Waxhaw image finished at about 3.56 s in both variants and remains the sampled bottleneck. The code change does not alter the images, the CMS content, or server caching. The two HTML entries share the same CSS and core modules; non-CMS routes retain the original entry. The production-bundle browser test checks that the CMS entry renders a service page, the public entry excludes admin editor chunks, and the admin media and builder features still load.

`npm run check`, `npm run lint`, `npm run format`, `npm test` (210 tests across 59 files), `npm run build`, `npm run test:bundles:local`, and `npm run test:browser:local` passed. React Doctor 0.9.14 full uncached scan remained 58/100, zero errors, 154 warnings. Local database-backed route verification was unavailable because `DATABASE_URL` is not set. No new official PageSpeed score or Railway deployment result is claimed.
