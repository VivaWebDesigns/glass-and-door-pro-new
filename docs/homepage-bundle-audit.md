# Homepage bundle isolation audit

Baseline: `7981181`. Local production builds, no production requests or database writes.

## Finding and fix

Admin routes were already lazy. However, `vite.config.ts` placed most dependencies in a single `vendor` chunk, causing the homepage to download `react-image-crop`, `browser-image-compression`, and `react-resizable-panels`. The generated module graph confirmed all three were bundled in public vendor JavaScript despite only being consumed by image-editing tools and the CMS page builder.

The build now places the two image libraries in `image-editor` and the panel library in `editor-panels`. Both depend only on the React runtime in the inspected build. Public routes do not request these chunks; admin routes request them when needed. Application behavior and dependencies are unchanged. Public rendering helpers that live under the admin source directory are still shared intentionally; the directory name alone does not imply the full editor is loaded.

## Controlled homepage measurements

`PERF_PAGE=home npm run measure:mobile:local` now measures `/` with fixed local CMS hero/FAQ data. Three fresh Pixel 7 contexts per build, 4x CPU slowdown, 150 ms network latency, 200,000 bytes/sec download, no cache, external requests blocked. This uses the real production frontend with synthetic CMS responses, not a copy of the live homepage. Backend latency, production compression policy and server prerendering are not represented.

| Measure | Before | After |
|---|---:|---:|
| Encoded JavaScript downloaded | 288,509 bytes | 254,544 bytes |
| Decoded JavaScript downloaded | 903,523 bytes | 808,854 bytes |
| Median largest contentful paint | 3,136 ms | 2,964 ms |
| Median first contentful paint | 1,732 ms | 1,556 ms |
| Maximum sampled layout shift | 0 | 0 |
| Page errors / horizontal overflow | None | None |

The repeatable payload reduction is 33,965 encoded bytes (11.8%) and 94,669 decoded bytes (10.5%). Loading-time changes are small-sample lab observations, not a production speed guarantee. These measurements do not verify the separate claim of 1.23 MB to 433 KB; that claim's baseline, page contents and byte definition are unknown.

## Regression checks

`npm run test:bundles:local` starts its own localhost-only Vite preview of the existing build. All API responses and writes are intercepted; third-party network requests are blocked. It checks:

- Both the fallback homepage and a CMS-rendered homepage render without requesting image editor, panel, rich-text editor or admin page chunks.
- The media page loads its image library, crops a local image, compresses it and submits a nonempty replacement file to a mocked endpoint.
- The page builder loads its panel library and keyboard resizing changes the panel size after dismissing the template picker.
- No uncaught browser errors occur.

Run `npm run build` before `npm run test:bundles:local`. For mobile measurements, start `npx vite preview --host 127.0.0.1 --port 4176 --strictPort` in another terminal, then run `PERF_PAGE=home PERF_OUTPUT=/tmp/home-mobile.json npm run measure:mobile:local`. The original door-installation measurement remains the default when `PERF_PAGE` is omitted. Reports now distinguish encoded and decoded JavaScript bytes.

Validation: typecheck, lint (including a separate check of `vite.config.ts`), formatting, all 202 unit tests, eight desktop/mobile interaction tests, production build and production bundle regression checks pass. React Doctor 0.9.14 full uncached scan remains 58/100, zero errors, 154 warnings, with complete coverage and no skipped checks. No rules were disabled. The previously documented PostCSS source-metadata warning remains.

Real authentication, database persistence, live CMS content, physical mobile devices and Railway deployment were not verified. No deployment monitoring follows the push.
