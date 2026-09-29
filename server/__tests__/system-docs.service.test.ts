import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  getDocBySlug: vi.fn(),
  getAllDocs: vi.fn(),
  createDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
}));
vi.mock("../storage", () => ({ storage: { docs: mocks } }));
vi.mock("../utils/logger", () => ({ logger: { app: { info: vi.fn() } } }));

import { ensureSystemDocs } from "../services/system-docs.service";

describe("ensureSystemDocs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getDocBySlug.mockResolvedValue({ id: "existing" });
  });

  it("removes system docs whose markdown file is gone but keeps admin-authored docs", async () => {
    mocks.getAllDocs.mockResolvedValue([
      { id: "current", slug: "operations", createdBy: null },
      { id: "stale", slug: "admin-blog-workflow", createdBy: null },
      { id: "authored", slug: "my-notes", createdBy: "admin-1" },
    ]);

    const result = await ensureSystemDocs({ refreshExisting: false });

    expect(mocks.deleteDoc).toHaveBeenCalledTimes(1);
    expect(mocks.deleteDoc).toHaveBeenCalledWith("stale");
    expect(result.removed).toBe(1);
  });
});
