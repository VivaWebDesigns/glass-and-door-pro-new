# Security Hardening & Environment Requirements

## Authentication

- **JWT tokens** stored in HTTP-only cookies (`gdp_token`)
- Token expiry: 7 days
- Password hashing: `bcryptjs` with 12 salt rounds
- Cookie settings: `httpOnly: true`, `secure: true` (production), `sameSite: lax`
- There is no public registration; the first admin is created via `/api/setup/admin` (optionally guarded by `SETUP_TOKEN`), and further users are created by admins.

## Secret Management

### Environment Variables

| Variable | Required In | Description |
|----------|------------|-------------|
| `SESSION_SECRET` | Production | JWT signing key; must not be the dev default |
| `DATABASE_URL` | Always | PostgreSQL connection string |
| `APP_URL` | Recommended (production) | Base URL for origin validation and links in emails |
| `TRUSTED_ORIGINS` | Optional | Comma-separated extra trusted origins |
| `SETUP_TOKEN` | Optional | Required token for first-admin setup when set |
| `CMS_PREVIEW_SECRET` | Optional | Signs CMS preview links (falls back to `SESSION_SECRET`) |
| `RESEND_API_KEY`, `RESEND_FROM` | Email | Resend delivery (first in the fallback chain) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Email | SMTP fallback |
| `CONTACT_FORM_RECIPIENTS` | Optional | Comma-separated recipients for form notifications |
| `UPLOADS_DIR` / `LOCAL_UPLOADS_DIR` / `RAILWAY_VOLUME_MOUNT_PATH` | Optional | Local uploads root |
| `BACKUP_R2_*`, `SYSTEM_BACKUP*` | Optional | Backup storage and schedule (see `docs/system-backups.md`) |

Cloudflare R2, Mailgun, Mailchimp, and GA4 credentials are stored in the `system_settings` table (managed from the admin Settings page), not in environment variables.

### Enforcement

- `enforceRequiredSecrets()` in `server/middleware/security.ts` runs at startup
- In production, missing `SESSION_SECRET` or `DATABASE_URL` causes immediate process exit
- Dev default `SESSION_SECRET` ("dev-secret-change-me") is rejected in production

## Request Security

### Helmet CSP

Content Security Policy directives are configured in `securityHeaders()`:
- Scripts: self + two inline-script hashes + Google Tag Manager + Cloudflare Insights
- Styles: self + unsafe-inline + Google Fonts
- Images: self + data/blob + R2
- Connections: self + Google Analytics / Tag Manager + Cloudflare Insights + R2
- Frames: self + Google Tag Manager
- Media: self + blob + R2
- Objects: none

### Rate Limiting

| Limiter | Window | Max Requests | Scope |
|---------|--------|-------------|-------|
| `apiLimiter` | 15 min | 300 | All `/api/*` |
| `loginLimiter` | 15 min | 10 | Login endpoint |
| `forgotPasswordLimiter` | 15 min | 5 | Password reset request |
| `resetPasswordLimiter` | 15 min | 10 | Password reset execution |

All rate limiters are skipped in development mode.

### Origin Checking

- `originCheck` middleware validates `Origin` or `Referer` headers for state-changing requests (POST, PUT, PATCH, DELETE)
- GET, HEAD, OPTIONS requests are exempt
- Trusted origins are derived from `APP_URL`, `TRUSTED_ORIGINS`, and the request `Host` header
- Skipped in development mode

### Request Body Limits

- JSON body: 1 MB limit
- URL-encoded body: 1 MB limit

## Role-Based Access Control

Two roles: `admin`, `editor` (`shared/types/index.ts`)

- `authenticateToken` — Requires valid JWT; attaches user to `req.user`
- `optionalAuth` — Attaches user if token present, continues regardless
- `requireRole(...roles)` — Checks `req.user.role` against allowed roles
- `requireAdminPermission(...permissions)` — Allows admins, or editors holding one of the listed permissions (`content`, `design`)
- The admin router applies `authenticateToken` to all `/api/admin/*` routes, then `requireRole` or `requireAdminPermission` per sub-router

## Logging Security

- Sensitive fields are redacted in request logs: passwords, tokens, secrets, emails, phone, address, SSN, DOB
- Long text fields (bio, content, body, description) are truncated to 100 chars
- Response bodies are truncated to 500 chars in logs
- Error stack traces limited to 5 lines
