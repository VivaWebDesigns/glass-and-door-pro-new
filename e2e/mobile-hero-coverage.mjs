import assert from "node:assert/strict";
import console from "node:console";
import { readFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { preview } from "vite";

// Captured public CMS hero assignments are fixtures; the test serves the current
// production build locally so no deployed site or database is needed.
const heroPages = JSON.parse(
  await readFile(new globalThis.URL("./mobile-hero-pages.json", import.meta.url), "utf8"),
);
const origin = "http://127.0.0.1:4178";
const server = await preview({ preview: { host: "127.0.0.1", port: 4178, strictPort: true } });
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
  const page = await context.newPage();
  let activePath = "/";
  const failures = [];
  page.on("pageerror", (error) => failures.push(`${activePath}: ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(origin)) {
      failures.push(`${activePath}: HTTP ${response.status()} ${response.url()}`);
    }
  });
  await page.route("**/api/**", async (route) => {
    const pathname = new globalThis.URL(route.request().url()).pathname;
    if (pathname.startsWith("/api/cms/pages/by-slug/")) {
      const slug = decodeURIComponent(pathname.split("/").at(-1));
      return route.fulfill({
        json: {
          id: `fixture-${slug}`,
          slug,
          title: `Hero fixture: ${activePath}`,
          status: "published",
          content: {
            version: 1,
            blocks: [
              {
                id: "hero",
                type: "hero",
                props: {
                  heading: `Hero fixture: ${activePath}`,
                  backgroundImageUrl: heroPages[activePath],
                },
              },
            ],
          },
        },
      });
    }
    if (pathname === "/api/setup/status") return route.fulfill({ json: { needsSetup: false } });
    return route.fulfill({ json: pathname === "/api/auth/me" ? null : [] });
  });

  for (const [path, original] of Object.entries(heroPages)) {
    activePath = path;
    const mobile = original.replace(/\.webp$/, "-mobile-1280w.webp");
    assert.notEqual(mobile, original, `${path}: unsupported source format`);
    const response = await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
    assert.equal(response?.status(), 200, `${path}: document failed`);
    const image = page.locator(".public-hero-pattern img").first();
    await image.waitFor({ state: "visible" });
    await image.evaluate(
      async (img) =>
        await new Promise((resolve, reject) => {
          if (img.complete) return img.naturalWidth ? resolve() : reject(new Error("Image failed"));
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", () => reject(new Error("Image failed")), { once: true });
        }),
    );
    const rendered = await image.evaluate((img) => new globalThis.URL(img.currentSrc).pathname);
    assert.equal(rendered, mobile, `${path}: wrong mobile hero`);
  }

  // The standalone overview and a CMS detail page also retain desktop originals.
  await page.setViewportSize({ width: 1280, height: 800 });
  for (const path of ["/service-areas", "/services/window-installation"]) {
    activePath = path;
    await page.goto(`${origin}${path}`, { waitUntil: "domcontentloaded" });
    const image = page.locator(".public-hero-pattern img").first();
    await image.waitFor({ state: "visible" });
    assert.equal(
      await image.evaluate((img) => new globalThis.URL(img.currentSrc).pathname),
      heroPages[path],
      `${path}: wrong desktop hero`,
    );
  }

  assert.deepEqual(failures, []);
  console.log(
    `Mobile hero coverage passed: ${Object.keys(heroPages).length} public pages load their mobile image; standalone and CMS desktop sources remain original.`,
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}
