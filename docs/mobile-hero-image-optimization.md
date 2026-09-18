# Mobile hero image optimization

Date: September 18, 2026. Baseline: `5bb401d`.

The latest user-reported official Google mobile PageSpeed runs still showed slow LCP: 6.54 s on the homepage, 6.77 s on Frameless Showers, and 7.07 s on Waxhaw. The LCP element in independent live Chromium traces was the hero image on all three pages. The earlier CMS-entry experiment was rolled back because it competed with those images for bandwidth.

This change adds 1280-pixel-wide, quality-75 WebP variants of the existing hero photos for viewports up to 640 CSS pixels wide. The CMS content and original images remain unchanged. The client selects one hero image URL for the current viewport, and the initial HTML preloads the matching file for mobile while preloading the original for larger viewports. The homepage video poster uses the selected URL rather than requesting a different poster asset.

| Page              | Original hero |   Mobile hero | Controlled median LCP before → after |
| ----------------- | ------------: | ------------: | -----------------------------------: |
| Homepage          |  94,182 bytes |  62,592 bytes |                     3,748 → 3,568 ms |
| Frameless Showers | 180,132 bytes |  33,230 bytes |                     4,104 → 3,584 ms |
| Waxhaw            | 309,268 bytes | 100,796 bytes |                     5,408 → 3,812 ms |

The comparison used the same captured CMS content with baseline and changed production builds on local preview servers. Three fresh Pixel 7 contexts per page and variant used 4x CPU slowdown, 150 ms latency, and 200,000 bytes/sec download. Third-party requests were left enabled. All 18 runs selected the intended hero and had no uncaught page errors. The measured benefit is a local transfer comparison, **not** a new Google PageSpeed result; production network variability remains outside it.

Mobile screenshots were checked for all three pages. The image still fills the original hero bounds, and the desktop image path remains unchanged. The production-bundle browser check verifies desktop and mobile source selection. The server test verifies mutually exclusive mobile and desktop preload hints. No page copy, CMS data, or analytics behavior changed.
