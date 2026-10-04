import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./db";
import { logger } from "./utils/logger";
import { sql } from "drizzle-orm";
import path from "path";

// Drizzle records applied migrations in drizzle.__drizzle_migrations and runs every
// journal entry newer than the newest recorded `created_at`.
const MIGRATIONS_SCHEMA = "drizzle";
const MIGRATIONS_TABLE = "__drizzle_migrations";

// Existing databases were provisioned with drizzle push plus startup code, and the old
// runner never applied migrations to them. Every journal entry up to and including this
// one is treated as already applied there; only migrations added after it run.
export const MIGRATION_BASELINE = { tag: "0020_event_slugs", when: 1776079800000 } as const;

// An existing database needs the baseline marker when it has tables and nothing at or
// after the baseline is recorded. An empty database runs every migration instead.
export function needsMigrationBaseline(publicTableCount: number, lastAppliedAt: number | null) {
  if (publicTableCount === 0) return false;
  return lastAppliedAt === null || lastAppliedAt < MIGRATION_BASELINE.when;
}

async function countPublicTables() {
  const result = await db.execute(sql`
    SELECT COUNT(*)::int AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name <> ${MIGRATIONS_TABLE}
  `);
  const row = result.rows[0] as { count?: number } | undefined;
  return Number(row?.count ?? 0);
}

async function ensureMigrationsTable() {
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(MIGRATIONS_SCHEMA)}`);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)} (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);
}

async function getLastAppliedAt() {
  const result = await db.execute(sql`
    SELECT MAX(created_at) AS last
    FROM ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)}
  `);
  const row = result.rows[0] as { last?: string | number | null } | undefined;
  return row?.last == null ? null : Number(row.last);
}

async function recordMigrationBaseline() {
  await db.execute(sql`
    INSERT INTO ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)} (hash, created_at)
    VALUES (${`baseline:${MIGRATION_BASELINE.tag}`}, ${MIGRATION_BASELINE.when})
  `);
}

// Starter-template messaging tables with no remaining code. Dropped idempotently at
// startup because they predate the migration baseline.
const RETIRED_STARTER_TABLES = ["direct_messages", "conversations", "guest_messages"];

async function dropRetiredStarterTables() {
  for (const table of RETIRED_STARTER_TABLES) {
    try {
      await db.execute(sql`DROP TABLE IF EXISTS ${sql.identifier(table)}`);
    } catch (err) {
      logger.app.warn(`Could not drop retired table ${table}`, { error: String(err) });
    }
  }
}

export async function runMigrations() {
  const migrationsFolder = path.resolve(
    process.env.NODE_ENV === "production" ? __dirname : process.cwd(),
    "migrations",
  );

  try {
    const publicTableCount = await countPublicTables();
    await ensureMigrationsTable();

    if (needsMigrationBaseline(publicTableCount, await getLastAppliedAt())) {
      await recordMigrationBaseline();
      logger.app.info("Recorded migration baseline for existing database", {
        baseline: MIGRATION_BASELINE.tag,
      });
    }

    logger.app.info("Running database migrations...");
    await migrate(db, {
      migrationsFolder,
      migrationsSchema: MIGRATIONS_SCHEMA,
      migrationsTable: MIGRATIONS_TABLE,
    });
    await dropRetiredStarterTables();
    logger.app.info("Database migrations completed successfully");
  } catch (err) {
    logger.app.error("Database migration failed", err);
    throw err;
  }
}
