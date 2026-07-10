import { expect, test } from "@playwright/test";

function schemaIdentity(schema: Record<string, unknown>) {
  const type = schema["@type"];
  if (typeof type !== "string") return null;

  const id = schema["@id"];
  if (typeof id === "string" && id) return `${type}:id:${id}`;

  const url = schema.url;
  if (typeof url === "string" && url) return `${type}:url:${url}`;

  if (type === "BreadcrumbList") {
    const items = schema.itemListElement;
    if (Array.isArray(items)) {
      const last = items[items.length - 1] as { item?: unknown } | undefined;
      if (typeof last?.item === "string" && last.item) return `${type}:item:${last.item}`;
    }
  }

  if (type === "FAQPage") return type;

  const name = schema.name;
  return typeof name === "string" && name ? `${type}:name:${name}` : null;
}

test("public service page renders content and non-duplicated schema", async ({ page }) => {
  await page.goto("/services/door-installation", { waitUntil: "networkidle" });

  await expect(page).toHaveTitle(/door installation/i);
  await expect(page.locator("h1")).toContainText(/door installation/i);
  await expect(page.locator("body")).toContainText(/Glass and Door Pro/i);

  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /\/services\/door-installation$/);

  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute("content", /door/i);

  const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
    scripts
      .map((script) => {
        try {
          return JSON.parse(script.textContent || "{}") as Record<string, unknown>;
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  );

  const identities = schemas.map((schema) => schemaIdentity(schema)).filter(Boolean);
  expect(identities.length).toBe(new Set(identities).size);
  expect(schemas.some((schema) => schema["@type"] === "LocalBusiness")).toBe(true);
  expect(schemas.some((schema) => schema["@type"] === "Service")).toBe(true);
  expect(schemas.some((schema) => schema["@type"] === "BreadcrumbList")).toBe(true);
});
