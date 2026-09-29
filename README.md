# Glass & Door Pro

Marketing website for **Glass & Door Pro**, a glass, window, and door contractor serving the Charlotte, NC area.

**Residential:** frameless showers, window installation, window repair, door installation.
**Commercial:** commercial glass, storefront glass installation and repair, commercial window replacement, commercial door installation and repair.

Public pages are managed through a built-in CMS (block-based page builder, media library, forms, navigation) behind an admin dashboard.

> The codebase was started from an internal starter template ("Core Platform"). Some older docs under `docs/` still describe that template's features (directory, subscriptions, events) and may not apply to this site.

## Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS + shadcn/ui, wouter, TanStack Query
- **Backend:** Express (TypeScript), Pino logging, Helmet + rate limiting
- **Database:** PostgreSQL via Drizzle ORM (migrations in `migrations/`, applied on production startup)
- **Media:** uploads processed with Sharp; stored in Cloudflare R2 or local uploads dir
- **Hosting:** Railway (`railway.toml` — builds with `npm run build`, health check at `/api/health`)

## Layout

```
client/src/features/   public/, admin/, auth/ (UI by area)
server/routes/         API routes (admin/ holds CMS + admin endpoints)
server/services/       business logic, including public page prerendering
shared/                schema and types shared by client and server
scripts/               CMS seed/sync scripts for Glass & Door content
e2e/                   Playwright tests and mobile performance checks
docs/                  architecture notes, runbooks, audits
```

## Local development

```bash
npm install
npm run dev
```

Required environment variables: `DATABASE_URL`, `SESSION_SECRET`, `APP_URL`. See `docs/runbooks/deployment.md` for the full list (email, backups, trusted origins, etc.).

Note: Railway may inject a private internal Postgres hostname into `DATABASE_URL` that does not resolve outside Railway. Use a reachable database URL for local work.

## Checks

```bash
npm run check    # typecheck
npm run lint
npm test         # vitest
npm run build
npm run test:browser   # Playwright
```

## Further reading

- `AGENTS.md` — working rules for this repo (commit/push policy, legacy URL handling)
- `docs/deployment-notes.md`, `docs/runbooks/` — deployment, operations, backups, security
- `docs/admin/` — CMS and admin how-tos
- `docs/changelog.md`, `docs/roadmap.md`
