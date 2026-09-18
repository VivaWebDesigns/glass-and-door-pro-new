import assert from "node:assert/strict";
import console from "node:console";
import { readFile } from "node:fs/promises";
import { preview } from "vite";
import { chromium, expect } from "@playwright/test";

// Exercise the actual production chunks with local fixtures, never a live backend.
const server = await preview({ preview: { host: "127.0.0.1", port: 4177, strictPort: true } });
let browser;
const origin = "http://127.0.0.1:4177";
const asset = {
  id: "local-image",
  originalName: "test.webp",
  assetKind: "image",
  mimeType: "image/webp",
  url: "/images/glass-door-pro/gallery-shower1-1280w.webp",
  fileSize: 10000,
  isManaged: true,
  usageCount: 0,
  usageRefs: [],
  liveUsageCount: 0,
  createdAt: "2026-01-01T00:00:00Z",
};
try {
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  const scripts = [];
  let replacementBytes = 0;
  let cmsHome = false;
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (new globalThis.URL(response.url()).pathname.endsWith(".js")) scripts.push(response.url());
  });
  await page.route("**/*", async (route) => {
    const url = new globalThis.URL(route.request().url());
    if (url.origin !== origin) return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    let data = [];
    if (url.pathname === "/api/auth/me")
      data = {
        id: "local-admin",
        role: "admin",
        firstName: "Local",
        email: "admin@example.test",
        adminPermissions: [],
      };
    if (url.pathname === "/api/setup/status") data = { needsSetup: false };
    if (url.pathname === "/api/branding") data = {};
    if (url.pathname.includes("/cms/pages/by-slug/")) {
      return route.fulfill(
        cmsHome
          ? {
              json: {
                id: "local-home",
                slug: "home",
                title: "Local CMS homepage",
                status: "published",
                content: {
                  version: 1,
                  blocks: [{ id: "hero", type: "hero", props: { heading: "Local CMS homepage" } }],
                },
              },
            }
          : { status: 404, json: {} },
      );
    }
    if (url.pathname === "/api/admin/cms/media") data = [asset];
    if (url.pathname === "/api/admin/cms/media/local-image/source") {
      return route.fulfill({
        contentType: "image/webp",
        body: await readFile(`dist/public${asset.url}`),
      });
    }
    if (url.pathname === "/api/admin/cms/media/local-image/replace") {
      assert.equal(route.request().method(), "POST");
      replacementBytes = route.request().postDataBuffer()?.length || 0;
      data = asset;
    }
    if (url.pathname.includes("editor-locks"))
      data = { status: "acquired", ownedByCurrentUser: true, lock: null };
    await route.fulfill({ json: data });
  });
  await page.goto(origin);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Glass and Door Pro: Charlotte Glass, Door & Window Services",
  );
  await page.waitForLoadState("networkidle");
  assert(
    !scripts.some((url) =>
      /image-editor-|editor-panels-|tiptap-|prosemirror-|cms-page-editor-page-|cms-media-page-/.test(
        url,
      ),
    ),
    "Homepage eagerly requested editor chunks",
  );

  cmsHome = true;
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Local CMS homepage");
  await page.waitForLoadState("networkidle");
  assert(
    !scripts.some((url) =>
      /image-editor-|editor-panels-|tiptap-|prosemirror-|cms-page-editor-page-|cms-media-page-/.test(
        url,
      ),
    ),
    "CMS homepage eagerly requested editor chunks",
  );

  await page.goto(`${origin}/admin/cms/media`);
  await page.getByTestId("media-asset-local-image").click();
  await page.getByTestId("button-crop-image").click();
  await expect(page.getByTestId("button-apply-crop")).toBeEnabled();
  await page.getByTestId("button-apply-crop").click();
  await expect(page.getByText("Media file updated", { exact: true })).toBeVisible();
  assert(replacementBytes > 100, "Cropping and compression did not produce a file");
  assert(
    scripts.some((url) => /image-editor-/.test(url)),
    "Media tools did not request the image editor chunk",
  );

  await page.goto(`${origin}/admin/cms/pages/new`);
  await expect(page.getByTestId("text-editor-title")).toBeVisible();
  await expect(page.locator("[data-panel-group]").first()).toBeVisible();
  assert(
    scripts.some((url) => /editor-panels-/.test(url)),
    "Builder did not request its panel chunk",
  );
  await page.getByTestId("button-cancel-template").click();
  await expect(page.getByTestId("dialog-template-picker")).toHaveCount(0);
  const handle = page.locator("[data-panel-resize-handle-id]").first();
  const priorSize = await handle.getAttribute("aria-valuenow");
  await handle.focus();
  await handle.press("ArrowRight");
  await expect(handle).not.toHaveAttribute("aria-valuenow", priorSize);
  assert.deepEqual(errors, []);
  console.log(
    "Production bundle checks passed: homepage excludes editor chunks; admin crop/compression and builder panels load.",
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
