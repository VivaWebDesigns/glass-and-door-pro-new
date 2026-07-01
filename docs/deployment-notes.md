# Deployment Notes — Migration & Production Rollout

## Pre-Deployment Checklist

1. **Environment variables**: Ensure all required variables are set (see `docs/runbooks/deployment.md`)
   - `SESSION_SECRET` must be a strong random string (not the dev default)
   - `DATABASE_URL` must point to the production PostgreSQL instance
   - `APP_URL` must be set for origin validation
   - `TRUSTED_ORIGINS` should include all valid origins (including preview URLs)

2. **Database migrations**: Migrations run automatically on production startup via `server/migrate.ts`. Review pending migrations before deploying:
   - Check the `migrations/` directory for new migration files (journal in `migrations/meta/`)
   - Verify migration SQL is non-destructive (no `DROP TABLE` or `DROP COLUMN` without backup)

3. **Stripe configuration**:
   - `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` must match the production Stripe account
   - Webhook endpoint URL must be updated in the Stripe dashboard to point to the production domain
   - Verify webhook events are configured for: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`

4. **R2 / file storage**:
   - R2 credentials must be for the production bucket
   - CORS configuration on the R2 bucket should allow the production domain

5. **Email (SendGrid)**:
   - `SENDGRID_API_KEY` must be for the production account
   - Sender domain must be verified in SendGrid
   - Check email templates exist in the database (seed if needed)

## Migration Notes

## CMS Seed Safety

Production startup runs system bootstrap, but bootstrap is default-safe for admin CMS content:

- Existing admin CMS pages are not drafted, noindexed, or structurally changed on every startup unless their content is explicitly marked system-retired.
- Existing CMS menus are not cleaned up, removed, or repointed on every startup unless the menu is explicitly system-managed.
- A menu is system-managed only when its name starts with `System - `. Admin-created menus should not use that prefix.
- Missing default legal pages, starter sections, system forms, docs, and email templates may still be created where the bootstrap service is create-only/default-safe.

The Glass public CMS seed command is also safe by default:

```bash
npm run seed:glass-public-cms
```

In safe mode, existing CMS pages, menus, branding settings, and global SEO settings are preserved. This protects admin edits to text, block content, image fields, focal points, alt text, captions, SEO fields, canonical URLs, page status, navigation, logos, colors, and company information.

Use force flags only when intentionally resetting a specific seeded area:

| Flag                                     | Use When                                                                                                                                  | May Overwrite                                                                                                                                                                                                      |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `GLASS_CMS_SEED_FORCE_PAGES=true`        | Reset seeded public pages from `scripts/seed-glass-public-cms.ts`, or delete deprecated seeded pages such as `services-commercial-glass`. | Page title, slug metadata, status, template, block structure, body text, hero/image/gallery URLs, focal positions, alt text, captions, SEO title/description/keywords, OG image, canonical URL, publish timestamp. |
| `GLASS_CMS_SEED_FORCE_MENUS=true`        | Reset seeded navigation menus by theme location.                                                                                          | Menu names, labels, URLs, nesting, location assignments, and duplicate menu location assignments.                                                                                                                  |
| `GLASS_CMS_SEED_FORCE_BRANDING=true`     | Reset seeded brand settings.                                                                                                              | Logo URLs, favicon, company name/address/phone, font selections, and brand/text color settings.                                                                                                                    |
| `GLASS_CMS_SEED_FORCE_SEO=true`          | Reset seeded global SEO defaults.                                                                                                         | Site name, title suffix, default meta description, site URL, default OG image, organization name, and organization logo.                                                                                           |
| `GLASS_CMS_SEED_OVERWRITE_EXISTING=true` | Legacy compatibility only. Prefer `GLASS_CMS_SEED_FORCE_PAGES=true`.                                                                      | Pages only. It is an alias for page force mode and does not force menus, branding, or SEO.                                                                                                                         |

Optional targeted page seeding is available with `GLASS_CMS_SEED_ONLY_SLUGS`, but targeted existing pages are still preserved unless page force mode is enabled:

```bash
GLASS_CMS_SEED_ONLY_SLUGS=services-frameless-showers npm run seed:glass-public-cms
GLASS_CMS_SEED_FORCE_PAGES=true GLASS_CMS_SEED_ONLY_SLUGS=services-frameless-showers npm run seed:glass-public-cms
```

Run `npm run seed:glass-public-cms -- --help` for command-line help.

## Local Development

- This project is linked to Railway. To run the full app locally with the live environment variables, start it from the project directory with:
  ```bash
  railway run npm run dev
  ```
- Running `npm run dev` directly will fail unless `DATABASE_URL` is already exported in the local shell. Railway provides `DATABASE_URL` in production, but a plain local terminal does not.
- The current Railway link points to the production environment for `Glass and Door Pro New`, so local runs through `railway run` can access production data. Use that for render verification only, and avoid admin/write actions unless you intentionally want to affect production.

### Database Schema

- Migrations are managed by Drizzle ORM and stored in `migrations/` directory (with journal metadata in `migrations/meta/`)
- On production startup, `runMigrations()` applies any pending migrations automatically
- Schema uses `varchar` IDs (UUID-style strings generated via `gen_random_uuid()`)
- Timestamps use PostgreSQL `timestamp` column type (via Drizzle's `timestamp()`) with `defaultNow()` for creation/update tracking

### Known Migration Considerations

- **Duplicate migration prefixes**: Some migration files share `0003_*` and `0004_*` prefixes. These run correctly but could cause confusion. Do not renumber existing migrations — only ensure new ones use unique sequential numbers.
- **Index creation**: Several indexes were added during stabilization. These create in the background on PostgreSQL and should not cause downtime, but may briefly increase CPU on large tables.

## Production Rollout Cautions

### Features to Monitor After Deploy

1. **Origin checking**: The `originCheck` middleware validates request origins in production. If users report 403 errors on form submissions:
   - Check that `APP_URL` matches the actual domain
   - Add any additional origins to `TRUSTED_ORIGINS`
   - The middleware logs blocked requests for debugging

2. **Rate limiting**: Rate limiters are active in production (disabled in dev). Monitor for legitimate users hitting limits:
   - Login: 10 attempts / 15 minutes
   - Registration: 5 attempts / hour
   - Global API: 300 requests / 15 minutes
   - Adjust limits if users report "Too many requests" errors

3. **JWT token expiry**: Tokens expire after 7 days. Users will be logged out and need to re-authenticate. There is no token refresh mechanism — consider adding one if session continuity is important.

4. **Stripe webhooks**: Verify webhook delivery in the Stripe dashboard after deploying. Failed webhooks will cause subscription state to drift from Stripe's records. The webhook endpoint must receive raw body (not JSON-parsed) — this is handled by the separate `express.raw()` middleware.

5. **CMS scheduled publishing**: The `scheduledPublishService` runs on a fixed interval to check for pages scheduled to publish. Verify it's running by checking logs for `[cms]` source entries.

6. **Session secret rotation**: If `SESSION_SECRET` is changed, all existing JWT tokens become invalid and all users will be logged out. Plan secret rotation during low-traffic windows.

### Rollback Plan

If a deployment causes issues:

1. Revert to the previous deployment version
2. Database migrations are forward-only — if a migration must be undone, write a new migration that reverses the changes
3. Stripe webhook processing is idempotent — replaying events is safe
4. User sessions (JWT tokens) are stateless — no session store to clear

### Performance Expectations

- **Cold start**: The Neon serverless database may take 1–3 seconds to wake from idle. The readiness probe (`/api/health/ready`) will return 503 until the database is connected.
- **Directory queries**: With current indexing, directory queries should complete in <100ms for tables under 10k rows. Monitor via the metrics endpoint if enabled.
- **Memory**: Typical RSS usage is 100–200 MB. The health endpoint reports memory usage for monitoring.
