# CMS entry rollback after live mobile comparison

Date: September 18, 2026. Reverts the route-specific eager CMS client entry introduced in `66ee7a8` while retaining the earlier hero preloads and bundle isolation work.

The user's fresh official Google mobile PageSpeed runs after that deployment were 56/100 with 6.54 s LCP for the homepage, 62/100 with 6.77 s for Frameless Showers, and 68/100 with 7.07 s for Waxhaw. Those individual scores vary; they did not confirm the local benefit predicted in the [earlier CMS startup experiment](https://github.com/VivaWebDesigns/glass-and-door-pro-new/blob/66ee7a8/docs/cms-entry-lcp-followup.md).

To isolate the change on the live site, Chromium loaded each page with the deployed HTML and assets, alternating the deployed eager CMS entry and the previous lazy entry by substituting only the HTML entry-script URL. Each variant had three fresh Pixel 7 contexts with 4x CPU slowdown, 150 ms latency, and 200,000 bytes/sec download. Third-party requests were left enabled. These are controlled diagnostic traces, not Google PageSpeed runs.

| Page              | Eager CMS entry median LCP | Previous lazy entry median LCP |  Eager change |
| ----------------- | -------------------------: | -----------------------------: | ------------: |
| Homepage          |                   3,576 ms |                       3,736 ms | 160 ms faster |
| Frameless Showers |                   4,876 ms |                       3,980 ms | 896 ms slower |
| Waxhaw            |                   6,052 ms |                       5,700 ms | 352 ms slower |

All 18 requests returned HTTP 200 and had no uncaught page errors. The eager entry competed with the preloaded hero image for bandwidth: median hero completion was about 3.08 versus 2.60 s on the homepage, 4.85 versus 3.97 s on Frameless Showers, and 5.98 versus 5.69 s on Waxhaw. The earlier local fixture had suggested a modest benefit on service pages; live network conditions exposed the opposite result. The small homepage gain did not outweigh the regressions on the other two pages or establish an official PageSpeed improvement.

The rollback restores the prior lazy entry for all pages. The existing image preloads remain in place. The 180 KB Frameless Showers and 309 KB Waxhaw hero transfers still limit LCP; further changes should be tested against live-like bandwidth and official PageSpeed rather than inferred from local entry timing. This rollback does not claim a new production PageSpeed score.
