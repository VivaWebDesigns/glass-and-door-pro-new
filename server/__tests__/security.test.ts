import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import { describe, expect, it } from "vitest";
import { securityHeaders } from "../middleware/security";

describe("securityHeaders", () => {
  it("allows every inline JavaScript bootstrap by its exact CSP hash", async () => {
    const html = await readFile(new URL("../../client/index.html", import.meta.url), "utf8");
    const bootstrapScripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g), (match) => match[1]);

    expect(bootstrapScripts).toHaveLength(2);

    const bootstrapHashes = bootstrapScripts.map((script) =>
      createHash("sha256").update(script).digest("base64"),
    );
    const app = express();
    app.use(securityHeaders());
    app.get("/", (_request, response) => response.sendStatus(204));

    const server = createServer(app);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

    try {
      const { port } = server.address() as AddressInfo;
      const response = await fetch(`http://127.0.0.1:${port}/`);
      const contentSecurityPolicy = response.headers.get("content-security-policy");
      const scriptSourceDirective = contentSecurityPolicy
        ?.split(";")
        .find((directive) => directive.trimStart().startsWith("script-src"));

      for (const bootstrapHash of bootstrapHashes) {
        expect(scriptSourceDirective).toContain(`'sha256-${bootstrapHash}'`);
      }
      expect(scriptSourceDirective).not.toContain("'unsafe-inline'");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
