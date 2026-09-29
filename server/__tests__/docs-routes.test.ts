import express from "express";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { describe, it, expect, vi } from "vitest";
const mocks = vi.hoisted(() => ({ createDoc: vi.fn(), updateDoc: vi.fn() }));
vi.mock("../storage/index", () => ({ storage: { docs: mocks } }));
vi.mock("../services/system-docs.service", () => ({ ensureSystemDocs: vi.fn() }));
vi.mock("../middleware/auth", () => ({
  authenticateToken: (req: express.Request, _res: express.Response, next: express.NextFunction) => {
    req.user = { id: "authenticated-admin" } as Express.User;
    next();
  },
  requireRole: () => (_req: express.Request, _res: express.Response, next: express.NextFunction) =>
    next(),
}));
import router from "../routes/docs.routes";

describe("document write boundary", () => {
  it("rejects invalid content and strips ownership and database-managed fields", async () => {
    mocks.createDoc.mockResolvedValue({ id: "doc" });
    mocks.updateDoc.mockResolvedValue({ id: "doc" });
    const app = express();
    app.use(express.json());
    app.use(router);
    const server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    const request = (method: string, path: string, body: unknown) =>
      fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    try {
      expect((await request("POST", "/", { title: 42 })).status).toBe(400);
      expect(mocks.createDoc).not.toHaveBeenCalled();
      expect(
        (
          await request("POST", "/", {
            title: "Title",
            slug: "test",
            category: "General",
            content: "Body",
            id: "injected",
            createdBy: "attacker",
          })
        ).status,
      ).toBe(201);
      expect(mocks.createDoc).toHaveBeenCalledWith({
        title: "Title",
        slug: "test",
        category: "General",
        content: "Body",
        createdBy: "authenticated-admin",
      });
      expect(
        (
          await request("PUT", "/doc", {
            title: "Updated",
            createdBy: "attacker",
            id: "other",
            updatedAt: "2020-01-01",
          })
        ).status,
      ).toBe(200);
      expect(mocks.updateDoc).toHaveBeenCalledWith("doc", { title: "Updated" });
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
