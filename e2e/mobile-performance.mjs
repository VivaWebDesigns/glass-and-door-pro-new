import process from "node:process";
import console from "node:console";
import { chromium, devices } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const baseURL = process.env.PERF_BASE_URL || "http://127.0.0.1:4176";
if (!["127.0.0.1", "localhost"].includes(new globalThis.URL(baseURL).hostname)) {
  throw new Error("This measurement harness requires a local production preview.");
}
const pageName = process.env.PERF_PAGE || "door-installation";
if (!["home", "door-installation"].includes(pageName)) {
  throw new Error("PERF_PAGE must be home or door-installation.");
}
const isHome = pageName === "home";
const routePath = isHome ? "/" : "/services/door-installation";
const heading = isHome
  ? "Glass and Door Pro: Charlotte Glass, Door & Window Services"
  : "Door Installation";
const output = process.env.PERF_OUTPUT || "/tmp/glass-mobile-performance.json";
const pageFixture = {
  id: "local-performance-page",
  slug: isHome ? "home" : "services-door-installation",
  title: heading,
  status: "published",
  content: {
    version: 1,
    blocks: [
      {
        id: "hero",
        type: "hero",
        props: {
          heading,
          subheading: "<p>Residential and commercial door service in the Charlotte area.</p>",
          backgroundImageUrl: isHome
            ? "/images/glass-door-pro/gallery-shower1-1280w.webp"
            : "/images/glass-door-pro/storefront-door-installation-hero.webp",
          minHeight: "520",
          ctaText: "Request a quote",
          ctaLink: "/#contact",
        },
      },
      {
        id: "faq",
        type: "faq",
        props: {
          title: "Frequently asked questions",
          items: [
            {
              question: "Where do you work?",
              answer: "<p>Charlotte and the surrounding communities.</p>",
            },
          ],
        },
      },
    ],
  },
};
const browser = await chromium.launch();
const runs = [];
try {
  for (let run = 0; run < 3; run++) {
    const context = await browser.newContext({ ...devices["Pixel 7"] });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", async (route) => {
      const url = new globalThis.URL(route.request().url());
      if (url.origin !== new globalThis.URL(baseURL).origin) return route.abort();
      if (!url.pathname.startsWith("/api/")) return route.continue();
      let data = {};
      if (url.pathname.includes("/cms/pages/by-slug/")) data = pageFixture;
      else if (url.pathname === "/api/cms/menus") data = [];
      else if (url.pathname === "/api/auth/me") return route.fulfill({ status: 401, json: {} });
      await route.fulfill({ json: data });
    });
    await page.addInitScript(() => {
      globalThis.__performanceSample = { lcp: 0, cls: 0, longTasks: [], lcpElement: "" };
      new globalThis.PerformanceObserver((list) => {
        const entry = list.getEntries().at(-1);
        if (entry) {
          globalThis.__performanceSample.lcp = entry.startTime;
          globalThis.__performanceSample.lcpElement = entry.element?.tagName || "";
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new globalThis.PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (!entry.hadRecentInput) globalThis.__performanceSample.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
      new globalThis.PerformanceObserver((list) => {
        globalThis.__performanceSample.longTasks.push(
          ...list.getEntries().map((entry) => entry.duration),
        );
      }).observe({ type: "longtask", buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 150,
      downloadThroughput: 200000,
      uploadThroughput: 93750,
      connectionType: "cellular4g",
    });
    await page.goto(`${baseURL}${routePath}`);
    await page.getByRole("heading", { level: 1, name: heading }).waitFor();
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => globalThis.document.fonts.ready);
    const sample = await page.evaluate(() => ({
      ...globalThis.__performanceSample,
      fcp: globalThis.performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null,
      resources: globalThis.performance
        .getEntriesByType("resource")
        .filter((item) => /\.(js|css|webp|woff2?)(\?|$)/.test(item.name))
        .map((item) => ({
          url: new globalThis.URL(item.name).pathname,
          bytes: item.encodedBodySize,
          decodedBytes: item.decodedBodySize,
          duration: item.duration,
        })),
      overflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    }));
    const start = globalThis.performance.now();
    await page.getByRole("button", { name: "Where do you work?" }).click();
    await page.getByText("Charlotte and the surrounding communities.", { exact: true }).waitFor();
    const faqActionMs = globalThis.performance.now() - start;
    runs.push({ ...sample, faqActionMs, errors });
    await context.close();
  }
} finally {
  await browser.close();
}
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const report = {
  conditions: {
    route: routePath,
    viewport: "Pixel 7 emulation",
    cpuSlowdown: 4,
    latencyMs: 150,
    downloadBytesPerSecond: 200000,
    coldCache: true,
    api: "fixed local CMS fixture",
    thirdParties: "blocked",
    runs: 3,
  },
  summary: {
    medianEncodedJsBytes: median(
      runs.map((run) =>
        run.resources
          .filter((item) => item.url.endsWith(".js"))
          .reduce((sum, item) => sum + item.bytes, 0),
      ),
    ),
    medianDecodedJsBytes: median(
      runs.map((run) =>
        run.resources
          .filter((item) => item.url.endsWith(".js"))
          .reduce((sum, item) => sum + item.decodedBytes, 0),
      ),
    ),
    medianLcpMs: median(runs.map((run) => run.lcp)),
    medianFcpMs: median(runs.map((run) => run.fcp)),
    medianBlockingMs: median(
      runs.map((run) =>
        run.longTasks.reduce((sum, duration) => sum + Math.max(0, duration - 50), 0),
      ),
    ),
    medianFaqActionMs: median(runs.map((run) => run.faqActionMs)),
    maxCls: Math.max(...runs.map((run) => run.cls)),
  },
  runs,
};
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
if (runs.some((run) => run.errors.length || run.overflow)) process.exitCode = 1;
