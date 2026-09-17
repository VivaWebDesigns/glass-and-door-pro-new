# Editor and browser-reliability follow-up

Baseline: `eda627e`. Same pinned React Doctor 0.9.14, schema 3, full uncached scans, all default categories, remote scoring enabled, supply-chain disabled. Both scans completed with no skipped checks.

| Measure                             | Before |  After |
| ----------------------------------- | -----: | -----: |
| Health score                        | 57/100 | 58/100 |
| Errors                              |      0 |      0 |
| Warnings                            |    178 |    154 |
| Mixed component/helper exports      |     21 |      0 |
| Event-only state findings addressed |      3 |      0 |

The existing JSON-clone fallback diagnostic moved unchanged from `page-builder-support.tsx` to `block-helpers.ts`; it is not a new behavior or newly introduced risk. No rules were disabled. Remaining warnings still include architectural observations and previously reviewed detector limitations.

## Changes

- Form drag type/ID and wizard initialization bookkeeping now use refs. They are read by event handlers only. Snapshot the drag ID before scheduling a state update so later cleanup cannot change the value consumed by the update. Rendered drop highlighting and selected blocks stay reactive.
- Extracted style variants, setup routing, CMS validation, fallback block definitions, block helpers, section-style values, display text and editorial block preparation into separate modules. Updated all internal imports and existing tests. A token-level comparison verified that 35 moved declarations retain their implementation, excluding export placement and whitespace. Production CSS asset hashes are unchanged.
- Added a separate, explicitly local Playwright configuration and fixture that imports the real application components. `npm run test:browser:local` starts its own Vite fixture server and runs desktop/Pixel 7 Chromium coverage. Fixtures never enter the production build; API writes are intercepted and external network requests blocked.
- Added `npm run measure:mobile:local`, a repeatable production-preview measurement script that rejects non-local hostnames. API responses use a fixed CMS page fixture; third-party requests are blocked.

## Browser coverage

Four scenarios run on both desktop and mobile emulation:

1. A rejected public-form submission displays the server message, retains answers, retries successfully and resets after success.
2. Space/arrow radio navigation works independently in two form instances; a background schema refresh preserves entered values and the active form session.
3. Wizard block choices survive back/next, creation uses those choices, reopening resets the wizard, and Escape dismisses the dialog after it is interactive.
4. Admin edits survive background refresh; adding a field via drag works; canceling a drag clears its payload; moving an existing field does not create an extra field. A React Profiler assertion verifies that drag-start alone produces no extra editor commit.

Drag tests dispatch native drag events with DataTransfer, including on mobile emulation. This verifies handlers and payload lifecycle; it is not a physical-device touch-gesture test. A fixture-only mobile failure was caused by displaying the serialized page JSON in the document, which distorted the viewport after creation. The assertion payload is now hidden from layout. The test also waits for dialog dismissal and normal input actionability; the wizard scenario passed three consecutive runs per browser project. The default browser configuration excludes these local-fixture tests.

## Controlled mobile measurements

Three cold-cache runs per build, Pixel 7 emulation, 4x CPU slowdown, 150 ms simulated network latency, 200,000 bytes/sec download, built `/services/door-installation`, fixed API fixture. Backend/database latency and server prerendering are not represented. These are local lab samples, not production Core Web Vitals or Lighthouse scores.

| Measure                                     | Baseline median |  Final median |
| ------------------------------------------- | --------------: | ------------: |
| Largest contentful paint                    |        3,504 ms |      3,532 ms |
| First contentful paint                      |        1,740 ms |      1,744 ms |
| Sum of task time above 50 ms until sampling |            0 ms |          0 ms |
| FAQ click-to-visible automation duration    |           48 ms |         76 ms |
| Maximum sampled layout shift                |               0 |             0 |
| Encoded JavaScript downloaded               |   288,698 bytes | 288,509 bytes |

There is **no demonstrated page-loading speed improvement** in this small sample. FAQ automation timings include test overhead and are not INP. No horizontal overflow or page errors occurred in any of the six runs. The hero image was the LCP element and largest individual resource (~169 kB); initial vendor JavaScript was ~132 kB encoded. Network transfer and late image discovery merit a separate production/prerender-aware investigation before changing image delivery. This pass does not speculate on those changes.

Reproduce the local measurements in two terminals:

```sh
npm run build
npx vite preview --host 127.0.0.1 --port 4176 --strictPort
```

```sh
PERF_OUTPUT=/tmp/glass-mobile-performance.json npm run measure:mobile:local
```

## Validation and limits

- `npm run check`: passed.
- `npm run lint`: passed, including both Playwright configurations and fixtures.
- `npm run format`: passed; new browser harness/config files also pass explicit Prettier checks.
- `npm test`: 202 tests pass across 59 files.
- `npm run build`: passed; the previously diagnosed PostCSS source-metadata warning remains.
- `npm run test:browser:local`: 8 desktop/mobile checks pass.
- Full React Doctor: 58/100, zero errors, 154 warnings; complete coverage, no skipped checks.

Real database writes, production CMS contents, authentication against a live backend, live email delivery, physical mobile hardware, and Railway deployment were not verified. No production requests or post-push deployment monitoring are part of this task.
