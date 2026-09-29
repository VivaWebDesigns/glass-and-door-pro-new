# Quality Gates

This document describes the quality checks available in the Glass & Door Pro codebase and how to use them.

## Available Scripts

| Script           | Command              | Purpose                                          |
| ---------------- | -------------------- | ------------------------------------------------ |
| Type-check       | `npm run check`      | Runs `tsc` to validate TypeScript types           |
| Lint             | `npm run lint`       | Runs ESLint across client, server, and shared code |
| Format (check)   | `npm run format`     | Runs Prettier in check mode (reports issues only)  |
| Test             | `npm test`           | Runs Vitest unit tests                            |
| Browser tests    | `npm run test:browser` | Runs Playwright specs in `e2e/` (`test:browser:local` uses the local config) |

## Running Checks Locally

Before pushing code, run the full quality suite:

```bash
npm run check
npm run lint
npm run format
npm test
```

All four commands should pass cleanly before pushing to `main`.

## Lint

ESLint is configured in `eslint.config.js` using the flat config format with:

- ESLint recommended rules
- TypeScript-ESLint recommended rules
- Unused variable warnings (with `_` prefix exceptions)
- Explicit `any` warnings (not errors)

To auto-fix lint issues:

```bash
npx eslint --fix client/src server shared
```

## Format

Prettier is configured in `.prettierrc` and runs in **check-only mode** by default (no auto-rewriting). Files in `node_modules`, `dist`, `build`, and `migrations` are excluded via `.prettierignore`.

To auto-format files:

```bash
npx prettier --write client/src server shared
```

## Tests

Tests use [Vitest](https://vitest.dev/) and are mostly co-located with the source files they test (e.g., `server/utils/logger.test.ts`); some server tests live in `server/__tests__/`.

Test files are included in type validation via `tsconfig.test.json`, which extends the main `tsconfig.json` but adds `**/*.test.ts` to its include list.

Playwright browser specs and local measurement scripts (`measure:mobile:local`, `test:bundles:local`, `test:heroes:local`) live in `e2e/`.

### Adding New Tests

1. Create a file named `*.test.ts` (or `*.test.tsx`) next to the module you want to test.
2. Import `describe`, `it`, `expect` (and `vi` for mocks) from `vitest`.
3. Keep tests pure and fast — no database or network calls in unit tests.
4. Run `npm test` to verify your tests pass.

### Running Tests in Watch Mode

```bash
npx vitest --watch
```

## CI Workflow

There is currently no CI workflow in the repository (no `.github/workflows/`). Railway builds and deploys from `main` on push, running only `npm run build`, so type-check, lint, format, and tests must be run locally before pushing.

## Conventions

- **Do not disable lint rules** without a comment explaining why.
- **Prefer `warn` over `error`** for rules that are aspirational rather than critical.
- **Test file naming**: `<module>.test.ts` co-located with the source file.
- **No mocked/stubbed database tests** in unit test files — those belong in integration tests (out of scope for now).
