# Deployment & Environment Setup Runbook

## Prerequisites

- Node.js (LTS recommended)
- PostgreSQL database (Railway Postgres in production)
- Optional: Cloudflare R2 bucket for media storage (credentials are entered in Admin → Settings, not env vars; without R2, uploads use local disk)
- Optional: an email provider — Resend or SMTP via env vars, or Mailgun via Admin → Settings

## Environment Variables

### Required for Production

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Strong random string for JWT signing. Must not be "dev-secret-change-me" |
| `DATABASE_URL` | PostgreSQL connection string |

### Optional

| Variable | Feature | Description |
|----------|---------|-------------|
| `APP_URL` | Security / links | Canonical base URL; trusted origin for the CSRF check |
| `TRUSTED_ORIGINS` | Security | Comma-separated list of additional trusted origins |
| `SETUP_TOKEN` | Setup | Token required by `/api/setup/admin` when set |
| `CMS_PREVIEW_SECRET` | CMS | Preview-token signing secret (falls back to `SESSION_SECRET`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Email | Resend API key and sender address |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Email | SMTP transport (port defaults to 587) |
| `CONTACT_FORM_RECIPIENTS` | Forms | Comma-separated recipients for contact-form notifications |
| `UPLOADS_DIR` / `LOCAL_UPLOADS_DIR` / `RAILWAY_VOLUME_MOUNT_PATH` | Uploads | Local upload root when R2 is not configured (checked in that order; default `./uploads`) |
| `SYSTEM_BACKUPS_ENABLED`, `SYSTEM_BACKUP_*`, `BACKUP_R2_*` | Backups | See [System Backups](../system-backups.md) |
| `DASHBOARD_ANALYTICS_CACHE_TTL` | Admin | Dashboard analytics cache TTL in seconds (default 300) |
| `METRICS_ENABLED` | Metrics | Set to "true" to enable the metrics endpoint in production |
| `LOG_LEVEL` | Logging | Pino log level (default: "info") |
| `PORT` | Server | Listen port (default 5000) |

## Build & Deploy

### Development

```bash
npm run dev
```

Starts Express + Vite dev server on port 5000.

### Production Build

```bash
npm run build
```

Runs `script/build.ts`: builds the Vite frontend, bundles the server to `dist/index.cjs` with esbuild, and copies migrations.

### Production Start

```bash
npm start
```

Runs the compiled server. On startup:
1. `enforceRequiredSecrets()` checks for required environment variables
2. Database migrations run automatically via `server/migrate.ts`
3. System bootstrap runs (`system-bootstrap.service.ts`)
4. Scheduled publish service (CMS timed publishing) and system backup service start
5. Express server starts on port 5000 (or `PORT` env var)

On Railway, `railway.toml` runs `npm run build` / `npm start` and health-checks `/api/health`.

## Database Management

### Push Schema Changes (Development)

```bash
npm run db:push
```

### Run Type Check

```bash
npm run check
```

### Run Linter

```bash
npm run lint
```

### Run Tests

```bash
npm test
```

## Initial Setup

On first deployment, navigate to `/setup` to create the initial admin account. The setup route is only available when no admin users exist in the database.

To seed the Glass & Door Pro public CMS pages, menus, branding, and SEO, run `npm run seed:glass-public-cms` (safe mode by default; see the `GLASS_CMS_SEED_*` flags in `scripts/seed-glass-public-cms.ts`).

## Post-Deployment Verification

1. Check `/api/health` returns `{ status: "ok" }`
2. Check `/api/health/ready` returns `{ status: "ready", database: "connected" }`
3. Navigate to the home page to verify CMS rendering
4. Test login with the admin account
5. Check `/robots.txt` and `/sitemap.xml` are generated correctly
