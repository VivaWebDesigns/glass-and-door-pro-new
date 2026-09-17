import { expect, test, type Page } from "@playwright/test";

const form = {
  id: "form-local",
  slug: "request",
  name: "Request service",
  kind: "custom",
  isActive: true,
  settings: { submitButtonText: "Send request" },
  fields: [
    { id: "email", key: "email", label: "Email address", type: "email", required: true },
    {
      id: "service",
      key: "service",
      label: "Service",
      type: "radio",
      options: [
        { value: "glass", label: "Glass" },
        { value: "door", label: "Door" },
      ],
    },
  ],
};

async function mockLocalApi(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.hostname !== "127.0.0.1") return route.abort();
    if (!url.pathname.startsWith("/api/")) return route.continue();
    let data: unknown = [];
    if (url.pathname === "/api/forms/request") data = form;
    if (url.pathname === "/api/admin/forms") data = [{ ...form, isSystem: false }];
    if (url.pathname === "/api/auth/me")
      data = {
        id: "local-admin",
        role: "admin",
        firstName: "Local",
        email: "admin@example.test",
        adminPermissions: [],
      };
    if (url.pathname.includes("editor-locks"))
      data = { status: "acquired", ownedByCurrentUser: true, lock: null };
    if (url.pathname === "/api/branding") data = {};
    await route.fulfill({ json: data });
  });
  return errors;
}

test("submission errors preserve answers and allow a successful retry", async ({ page }) => {
  const errors = await mockLocalApi(page);
  let attempts = 0;
  let submitted: unknown;
  await page.route("**/api/forms/request/submit", async (route) => {
    submitted = route.request().postDataJSON();
    attempts++;
    await route.fulfill({
      status: attempts === 1 ? 422 : 200,
      json:
        attempts === 1
          ? { message: "Please choose a different appointment." }
          : { message: "Request received" },
    });
  });
  await page.goto("/");
  const first = page.getByTestId("public-form-request").first();
  await first.getByLabel("Email address").fill("customer@example.test");
  await first.getByLabel("Door", { exact: true }).check();
  await first.getByRole("button", { name: "Send request" }).click();
  await expect(
    page.getByText("Please choose a different appointment.", { exact: true }).first(),
  ).toBeVisible();
  await expect(first.getByLabel("Email address")).toHaveValue("customer@example.test");
  await expect(first.getByLabel("Door", { exact: true })).toBeChecked();
  await first.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByText("Request received", { exact: true }).first()).toBeVisible();
  await expect(first.getByLabel("Email address")).toHaveValue("");
  expect(submitted).toMatchObject({ email: "customer@example.test", service: "door" });
  expect(attempts).toBe(2);
  expect(errors).toEqual([]);
});

test("keyboard radio groups remain independent and answers survive a schema refresh", async ({
  page,
}) => {
  const errors = await mockLocalApi(page);
  let reads = 0;
  await page.route("**/api/forms/request", (route) => {
    reads++;
    return route.fulfill({
      json:
        reads === 1
          ? form
          : {
              ...form,
              name: "Refreshed server form",
              fields: form.fields.map((field) => ({ ...field, label: `Updated ${field.label}` })),
            },
    });
  });
  await page.goto("/");
  const first = page.getByTestId("public-form-request").first();
  const second = page.getByTestId("public-form-request").nth(1);
  await first.getByLabel("Email address").fill("draft@example.test");
  await first.getByLabel("Glass", { exact: true }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await expect(first.getByLabel("Door", { exact: true })).toBeChecked();
  await second.getByLabel("Glass", { exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(first.getByLabel("Door", { exact: true })).toBeChecked();
  await expect(second.getByLabel("Glass", { exact: true })).toBeChecked();
  await page.getByRole("button", { name: "Refresh server data" }).click();
  await expect.poll(() => reads).toBe(2);
  await expect(first.getByLabel("Email address")).toHaveValue("draft@example.test");
  await expect(first.getByLabel("Door", { exact: true })).toBeChecked();
  await expect(first.getByText("Updated Email address")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("wizard selections survive back/next and reset when reopened", async ({ page }) => {
  const errors = await mockLocalApi(page);
  await page.goto("/?view=wizard");
  await page.getByRole("button", { name: "Open landing wizard" }).click();
  await page.getByTestId("goal-quote-request").click();
  await page.getByTestId("input-wizard-headline").fill("Local test page");
  await page.getByTestId("button-wizard-next").click();
  await page.getByTestId("audience-homeowners").click();
  await page.getByTestId("button-wizard-next").click();
  await page.getByTestId("block-option-hero").click();
  await page.getByTestId("button-wizard-back").click();
  await page.getByTestId("button-wizard-next").click();
  await page.getByTestId("button-wizard-next").click();
  await page.getByTestId("button-wizard-create").click();
  const created = JSON.parse((await page.getByTestId("created-page").textContent())!);
  expect(created.content.blocks.some((block: { type: string }) => block.type === "hero")).toBe(
    false,
  );
  await expect(page.getByTestId("dialog-landing-wizard")).toHaveCount(0);
  await page.getByRole("button", { name: "Open landing wizard" }).click();
  await expect(page.getByTestId("wizard-step-0")).toBeFocused();
  await expect(page.getByTestId("input-wizard-headline")).toHaveValue("");
  await expect(page.getByTestId("button-wizard-next")).toBeDisabled();
  await page.getByTestId("input-wizard-headline").click();
  await page.getByTestId("input-wizard-headline").press("Escape");
  await expect(page.getByTestId("dialog-landing-wizard")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("admin draft survives background refresh and drag payload stays usable", async ({ page }) => {
  const errors = await mockLocalApi(page);
  let reads = 0;
  let saved: { name?: string; fields?: { id: string; type: string }[] } = {};
  await page.route("**/api/admin/forms", (route) => {
    reads++;
    return route.fulfill({
      json: [
        { ...form, name: reads === 1 ? "Request service" : "Server refresh", isSystem: false },
      ],
    });
  });
  await page.route("**/api/admin/forms/form-local", (route) => {
    saved = route.request().postDataJSON();
    return route.fulfill({ json: { ...form, ...saved } });
  });
  await page.goto("/?view=editor");
  await expect(page.getByRole("button", { name: "Save Form", exact: true })).toBeEnabled();
  // The first form-setting textbox is the editable name; find it by its initial value.
  const nameInput = page.locator("input").filter({ hasNot: page.locator('[type="checkbox"]') });
  const index = await nameInput.evaluateAll((inputs) =>
    inputs.findIndex((input) => (input as HTMLInputElement).value === "Request service"),
  );
  expect(index).toBeGreaterThanOrEqual(0);
  const editableName = nameInput.nth(index);
  await editableName.fill("Unsaved local draft");
  await page.getByRole("button", { name: "Refresh server data" }).click();
  await expect.poll(() => reads).toBe(2);
  await expect(editableName).toHaveValue("Unsaved local draft");
  // Native HTML drag events exercise the production handlers even on touch emulation.
  const source = page.getByRole("button", { name: /Single Line Text/ }).last();
  const transfer = await page.evaluateHandle(() => new DataTransfer());
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const commits = await page.locator("body").getAttribute("data-editor-commits");
  await source.dispatchEvent("dragstart", { dataTransfer: transfer });
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await expect(page.locator("body")).toHaveAttribute("data-editor-commits", commits!);
  const target = page.locator('div[draggable="true"]').first();
  await target.dispatchEvent("dragover", { dataTransfer: transfer });
  await target.dispatchEvent("drop", { dataTransfer: transfer });
  await source.dispatchEvent("dragend", { dataTransfer: transfer });
  // Cancel a new-field drag, then reorder an existing field: the cancelled type
  // must not leak into the next drop and accidentally insert another field.
  await source.dispatchEvent("dragstart", { dataTransfer: transfer });
  await source.dispatchEvent("dragend", { dataTransfer: transfer });
  const rows = page.locator('div[draggable="true"]');
  await expect(rows).toHaveCount(3);
  await rows.last().dispatchEvent("dragstart", { dataTransfer: transfer });
  await rows.first().dispatchEvent("drop", { dataTransfer: transfer });
  await rows.first().dispatchEvent("dragend", { dataTransfer: transfer });
  await page.getByRole("button", { name: "Save Form", exact: true }).click();
  await expect.poll(() => saved.name).toBe("Unsaved local draft");
  expect(saved.fields?.some((field) => field.type === "text")).toBe(true);
  expect(saved.fields).toHaveLength(3);
  expect(saved.fields?.[0].id).toBe("service");
  expect(errors).toEqual([]);
});
