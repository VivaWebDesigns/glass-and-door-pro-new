# Site-wide mobile hero rollout

Date: September 18, 2026. Baseline: `965d5df`.

The [public-page inventory](sitewide-hero-preload-audit.md) includes 29 pages. Twenty-four have a leading hero image; three unique hero images already had mobile variants. This rollout adds 19 more variants, covering the other 20 image-hero pages. The five pages without a leading image hero (gallery, contact form, and three legal pages) remain unchanged.

Each new variant is a 1280-pixel-wide, quality-75 WebP made from the existing original. The 19 originals total 5,347,528 bytes; their mobile counterparts total 2,012,400 bytes, a 62% reduction in unique image bytes. Individual savings range from 20% to 76%. The originals remain available to desktop visitors. The service-area overview now uses the same mobile image selection as CMS-rendered pages.

The shared hero list in `shared/glass-hero-images.ts` governs both rendered image selection and the server's mutually exclusive mobile/desktop preload hints. The URL and source-photo assignments captured for the 24 pages are kept in `e2e/mobile-hero-pages.json`. Run `npm run test:heroes:local` after a production build to check that every page renders and loads its intended mobile image; the server test checks the paired preload hints for the same page list.

Local verification passed: TypeScript, lint, format, build, 234 unit tests, the 24-page mobile hero browser check, bundle isolation, and the eight-test desktop/mobile interaction suite. One unrelated admin interaction test failed once on a commit-count timing assertion, then passed in isolation and on a full-suite rerun. React Doctor's full pinned scan remains 58/100 with zero errors and 154 warnings; its changed-file scan found no new issues.

This is a transfer-size and functional result, **not** a new Google mobile PageSpeed score or proof that all pages now meet a particular LCP target. Live Google scores vary and will need a fresh post-deployment test to establish the user-facing effect. No live deployment check was performed as part of this rollout.
