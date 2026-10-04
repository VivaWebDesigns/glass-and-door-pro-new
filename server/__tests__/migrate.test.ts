import { readFileSync, existsSync } from "fs";
import path from "path";
import { describe, it, expect, vi } from "vitest";

vi.mock("../db", () => ({ db: {} }));
vi.mock("../utils/logger", () => ({
  logger: { app: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } },
}));

import { MIGRATION_BASELINE, needsMigrationBaseline } from "../migrate";

const migrationsFolder = path.resolve(process.cwd(), "migrations");
const journal = JSON.parse(
  readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf8"),
) as {
  entries: { tag: string; when: number }[];
};

describe("migration baseline", () => {
  it("points at a real journal entry with its exact timestamp", () => {
    const entry = journal.entries.find((e) => e.tag === MIGRATION_BASELINE.tag);
    expect(entry?.when).toBe(MIGRATION_BASELINE.when);
    expect(existsSync(path.join(migrationsFolder, `${MIGRATION_BASELINE.tag}.sql`))).toBe(true);
  });

  it("covers every migration that existed before it, so none of them re-run", () => {
    const before = journal.entries.slice(
      0,
      journal.entries.findIndex((e) => e.tag === MIGRATION_BASELINE.tag),
    );
    for (const entry of before) expect(entry.when).toBeLessThan(MIGRATION_BASELINE.when);
  });

  it("baselines an existing database with no applied migrations or older ones", () => {
    expect(needsMigrationBaseline(12, null)).toBe(true);
    expect(needsMigrationBaseline(12, MIGRATION_BASELINE.when - 1)).toBe(true);
  });

  it("leaves empty and already-baselined databases alone", () => {
    expect(needsMigrationBaseline(0, null)).toBe(false);
    expect(needsMigrationBaseline(12, MIGRATION_BASELINE.when)).toBe(false);
    expect(needsMigrationBaseline(12, MIGRATION_BASELINE.when + 1000)).toBe(false);
  });
});
