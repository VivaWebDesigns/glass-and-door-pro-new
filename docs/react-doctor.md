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
advisory report. The command disables telemetry/remote scoring and Socket.dev
supply-chain checks, so no numerical health score is requested. Source diagnostics
still run. To opt into dependency checks, append `--supply-chain`.
No CI workflow or Git hook was installed. Existing rules have not been suppressed.

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
