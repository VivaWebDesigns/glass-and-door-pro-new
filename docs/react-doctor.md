# React Doctor

Installed from https://github.com/millionco/react-doctor at pinned CLI version **0.9.14**.
The upstream `react-doctor` Codex skill is also installed locally at
`~/.codex/skills/react-doctor`; it becomes available on the next turn. That local
skill installation is not part of the repository checkout.

## Running it

```sh
npm run doctor
npm run doctor -- --verbose
npm run doctor -- --scope changed --base HEAD
npm run doctor -- --json --json-out /tmp/react-doctor.json --blocking none
```

The default command fails on error-level findings. `--blocking none` produces an
advisory report. The command enables remote health scoring and telemetry, as requested. Socket.dev
supply-chain checks remain disabled. To opt into dependency checks, append
`--supply-chain`. To run locally without a score, append `--no-telemetry`.
No CI workflow or Git hook was installed. Existing rules have not been suppressed.

## Editor and browser-reliability follow-up

Latest complete uncached audit: **58/100 (Critical), zero errors, 154 warnings**.
This pass removes 21 mixed-export warnings and three event-only state findings
without disabling rules. All 202 unit tests and eight new local desktop/mobile
browser checks pass. The mobile lab comparison shows essentially unchanged
loading times; no page-speed gain is claimed.

See [the follow-up report](./react-doctor-followup.md) for exact scope, browser
coverage, measurements, commands and verification limits.

## Complete warning and formatting review

The preceding complete uncached scan was **57/100 (Critical), zero errors and 178
warnings**, compared with 37/100, two errors and 241 warnings at the start of this
pass. All baseline findings and every remaining diagnostic have an individual
entry in [the complete review](./react-doctor-complete-review.md). Retained
architectural suggestions and detector exceptions remain enabled and visible.

Fixed security boundaries, editor-state/focus issues, shared context values,
accessibility and bundle splitting. All 87 baseline ESLint warnings and all 213
baseline formatting failures are resolved. Dependency migrations reduce npm audit
from 36 vulnerabilities to zero; React Doctor remains pinned at 0.9.14.

Validation: `npm run check`, `npm run lint`, `npm run format`, `npm test`
(**202 tests / 59 files**), `npm run build`, and `npm audit` pass. The build retains
one diagnosed upstream PostCSS source-metadata warning; the affected generated
content declarations contain no asset URLs. A built-site Chromium smoke test
with mocked APIs passed. Real database/admin workflows, external video playback,
email delivery and Railway deployment were not verified. New HTML sanitization
removes executable CMS markup, and encrypted settings require an explicit key;
compatibility notes and evidence are in the complete review.

## Form and menu correctness follow-up

The next complete uncached scan (CLI 0.9.14, full scope, default categories,
remote scoring enabled, supply-chain disabled) covered 352 files with no skipped
checks: **37/100 (Critical), 2 errors and 241 warnings**. Compared with the prior
pass, one test-only error and four warnings were removed, with no new file/rule
findings. The rounded score did not change.

Confirmed fixes:

- Menu indentation now replaces the preceding item immutably at both root and
  nested levels. It previously wrote through a shallow array copy into the old
  state, which could duplicate children when React replayed the updater. A shared
  helper is tested against deeply frozen state and repeated invocations. New
  menu IDs are generated in the event handler rather than a replayable updater.
- Public forms keep one schema snapshot for the current form session. A background
  refetch no longer resets answers or the current step. Switching form slug/ID
  mounts a fresh session; a new visit uses the latest fetched schema. This
  intentionally defers mid-session schema changes until a fresh session. Server
  validation remains authoritative when a form changes while someone fills it in.
- CMS page and revision requests now use the existing HTTP-status-checking request
  helper. A page-load failure displays an alert and retry/back actions instead of
  interpreting an error payload as editable page data. Integration tests exercise
  403 and 404 responses and retry with the actual query/request path.
- The unsaved-changes test harness exposes its hook API via `useImperativeHandle`
  after commit instead of calling a prop callback during render. Its existing
  behavioral tests remain intact. This resolves the remaining test-only error;
  the artifact placeholder and development encryption fallback findings remain.

Validation: `npm run check`, `npm run lint` (existing warnings), `npm test`
(**192 tests in 55 files**), and `npm run build` passed. `npm run format` still
reports the same 213 preexisting files. No rules were disabled. This pass used DOM
and mocked HTTP regression tests; authenticated browser flows, real database
requests, and Railway deployment were not verified.

## Accessibility and React correctness follow-up

The scored baseline was **35/100 (Critical)** with 3 errors and 330 warnings.
After this pass, a complete uncached scan of 349 files reports **37/100 (Critical)**,
3 errors and 245 warnings: **85 fewer warnings**. Both scans use CLI 0.9.14,
full scope, all default categories, remote scoring enabled and supply-chain checks
disabled. No rules were disabled. An intermediate cached scan omitted the known
artifact placeholder finding; the uncached result is the authoritative final count.
The same three error findings remain as explained below.

Changes:

- Named icon controls across public navigation, sliders, CMS editing, media,
  menus, settings and user administration; named color/date/select controls and
  video frames. Expand/collapse controls expose expanded state.
- Public forms now associate labels with input IDs unique to each form instance;
  composite name/address inputs have persistent accessible names. Image choices
  use native labelled radio/checkbox inputs. Radio names are unique per group,
  enabling arrow navigation without interfering with other form instances.
- Avatar upload supports Enter/Space. CMS upload uses a native browse button
  alongside the library picker and drop area. Notifications use links or buttons,
  and recent CMS page titles use links. SEO preview uses one linked control
  instead of nesting a button inside a link.
- Hoisted testimonial source components in public and editor renderers so React
  retains their DOM across parent updates. Stabilized the page-builder empty
  blocks array and included stable form-reset functions in profile effect deps.
- `npm run doctor` now requests the health score by default.

Validation: `npm run check`, `npm run lint` (existing warnings remain),
`npm test` (187 tests / 53 files), and `npm run build` passed. New regression tests
cover form label association, independent radio groups, and testimonial DOM
identity. `npm run format` still reports the same 213 preexisting files.

A local Vite fixture using the real form and slider components passed Chromium
keyboard checks: Space/ArrowRight radio selection, isolation of two copies of a
form, and Enter activation of the next-slide control. The accessibility snapshot
confirmed names and roles. Desktop (1280px) and mobile (390px) screenshots were
inspected; no browser errors or horizontal overflow occurred. The temporary
fixture was removed. Full authenticated admin flows, database-backed submissions,
screen-reader software, and Railway deployment were not verified.

Reviewed exceptions/backlog: rich-text container click handling delegates to native
anchors (keyboard Enter already dispatches their clicks); the editor-lock loading
reset is already in a `finally` block. These were left intact with rules enabled.
Other dependency warnings, component complexity, index keys and potential HTML
sinks still require focused review. The score is not a runtime-speed measurement.

## Initial audit and fixes

Full-project, all default categories, React 18 / Vite, schema version 3.
The initial scan completed over 346 files with 8 errors and 331 warnings.
After fixes and a new regression test, the same full scan completed over 347 files
with **3 errors and 330 warnings**, with no skipped lint checks. Both scores are
null because remote scoring is disabled. The source diagnostic comparison found
no new findings; rebuilding changes the filename of the same flagged artifact.

Confirmed React fixes:

- `client/src/components/ui/carousel.tsx`: release the `reInit` subscription as
  well as `select`; verified cleanup during StrictMode replay and unmount.
- `client/src/components/shared/rich-text-editor.tsx`: update the send callback
  after commit; expose the external handle through `useImperativeHandle`, which
  also clears it on unmount.
- `client/src/features/admin/docs-page.tsx` and `forms-page.tsx`: publish save
  feedback refs after commit instead of during render.
- `client/src/features/admin/forms-page.tsx`: generate the new field and update
  selection in the event handler, keeping the draft state updater pure.

## Remaining error triage

| Finding | Evidence and disposition |
| --- | --- |
| `no-prop-callback-in-render` in `use-unsaved-changes-guard.test.tsx` | Test harness passes its hook result to the test during render; no production component uses this harness. Retained as test-only cleanup backlog, not a production failure. |
| `artifact-secret-leak` in the built settings page | The flagged text is the `ga4_reporting_private_key` input placeholder, `-----BEGIN PRIVATE KEY-----`, not an embedded private key. Rejected as a credential leak for this occurrence; rule remains enabled. |
| `secret-in-fallback` in `server/storage/settings.storage.ts` | Development encryption uses a fixed fallback when `SESSION_SECRET` is absent. Production `server/index.ts` calls `enforceRequiredSecrets()` before serving, rejecting a missing secret or that default. Development hardening remains open; changing encryption key behavior needs a separate compatibility review for existing local encrypted settings. |

The warning backlog includes accessibility labels, array-index keys, complex
components, effect dependencies, HTML sinks, and performance hypotheses. These
require occurrence-specific review; a static flag alone does not establish a
runtime bug or measured slowness. This setup pass does not claim a clean audit.

## Verification

- `npm run check`: passed before and after React edits.
- `npm run lint`: passed before and after React edits.
- `npm test`: 184 tests passed before; 185 tests in 51 files passed after.
- `npm run build`: passed before and after.
- `npm run format`: failed before and after with the same 213 preexisting files;
  no repository-wide formatting changes were made.
- Full React Doctor scan: complete; 3 errors / 330 warnings remain as above.
- npm installation reported 36 dependency advisories (3 low, 8 moderate, 24 high,
  1 critical); these were not a dependency-security remediation pass.
- Browser interaction/runtime profiling, database-backed route verification, and
  Railway deployment verification were not performed. No speedup is claimed.

## Remaining diagnostics by rule

Counts below are scanner output, not independently confirmed defects.

| Rule | Count |
| --- | ---: |
| `react-doctor/no-array-index-as-key` | 63 |
| `react-doctor/shadcn-icon-button-requires-label` | 36 |
| `react-doctor/no-high-complexity-react-function` | 24 |
| `react-doctor/only-export-components` | 21 |
| `react-doctor/duplicate-jsx-subtree` | 20 |
| `react-doctor/exhaustive-deps` | 16 |
| `react-doctor/dangerous-html-sink` | 15 |
| `react-doctor/no-giant-component` | 15 |
| `react-doctor/control-has-associated-label` | 14 |
| `react-doctor/no-adjust-state-on-prop-change` | 13 |
| `react-doctor/async-await-in-loop` | 12 |
| `react-doctor/click-events-have-key-events` | 6 |
| `react-doctor/no-static-element-interactions` | 6 |
| `react-doctor/rerender-state-only-in-handlers` | 6 |
| `react-doctor/js-set-map-lookups` | 5 |
| `react-doctor/jsx-no-constructed-context-values` | 5 |
| `react-doctor/no-transition-all` | 5 |
| `react-doctor/query-mutation-missing-invalidation` | 5 |
| `react-doctor/iframe-has-title` | 4 |
| `react-doctor/no-nested-component-definition` | 4 |
| `react-doctor/no-unstable-nested-components` | 4 |
| `react-doctor/iframe-missing-sandbox` | 3 |
| `react-doctor/no-fetch-response-used-without-status-check` | 3 |
| `react-doctor/js-hoist-intl` | 2 |
| `react-doctor/no-reset-all-state-on-prop-change` | 2 |
| `react-doctor/server-sequential-independent-await` | 2 |
| `react-doctor/anchor-target-exists` | 1 |
| `react-doctor/artifact-secret-leak` | 1 |
| `react-doctor/js-index-maps` | 1 |
| `react-doctor/no-create-object-url-without-revoke` | 1 |
| `react-doctor/no-derived-state` | 1 |
| `react-doctor/no-effect-chain` | 1 |
| `react-doctor/no-fetch-in-effect` | 1 |
| `react-doctor/no-json-parse-stringify-clone` | 1 |
| `react-doctor/no-loading-flag-reset-outside-finally` | 1 |
| `react-doctor/no-pass-data-to-parent` | 1 |
| `react-doctor/no-pass-live-state-to-parent` | 1 |
| `react-doctor/no-prop-callback-in-effect` | 1 |
| `react-doctor/no-prop-callback-in-render` | 1 |
| `react-doctor/no-redundant-roles` | 1 |
| `react-doctor/no-side-effect-in-state-updater-function` | 1 |
| `react-doctor/prefer-dynamic-import` | 1 |
| `react-doctor/prefer-tag-over-role` | 1 |
| `react-doctor/public-env-secret-name` | 1 |
| `react-doctor/radio-input-missing-name` | 1 |
| `react-doctor/request-body-mass-assignment` | 1 |
| `react-doctor/rerender-lazy-state-init` | 1 |
| `react-doctor/secret-in-fallback` | 1 |
