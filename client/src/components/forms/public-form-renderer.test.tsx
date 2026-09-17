// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it } from "vitest";
import { PublicFormRenderer } from "./public-form-renderer";

it("labels public inputs and keeps radio choices isolated between form instances", () => {
  globalThis.React = React;
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(["/api/forms", "accessibility"], {
    name: "Request service",
    settings: {},
    fields: [
      { id: "email", key: "email", label: "Email address", type: "email" },
      {
        id: "choice",
        key: "choice",
        label: "Service",
        type: "image-choice",
        options: [
          { value: "glass", label: "Glass" },
          { value: "door", label: "Door" },
        ],
        config: { selectionMode: "single" },
      },
    ],
  });
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  try {
    act(() =>
      root.render(
        <QueryClientProvider client={client}>
          <PublicFormRenderer slug="accessibility" />
          <PublicFormRenderer slug="accessibility" />
        </QueryClientProvider>,
      ),
    );
    const emails = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="email"]'));
    expect(emails).toHaveLength(2);
    expect(emails[0].id).not.toBe(emails[1].id);
    for (const email of emails) expect(email.labels?.[0]?.textContent).toBe("Email address");
    const radios = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(radios).toHaveLength(4);
    expect(radios[0].name).toBe(radios[1].name);
    expect(radios[0].name).not.toBe(radios[2].name);
    expect(radios[0].labels?.[0]?.textContent).toContain("Glass");
    act(() => radios[0].click());
    act(() => radios[2].click());
    expect(radios[0].checked).toBe(true);
    expect(radios[2].checked).toBe(true);
    act(() => radios[1].click());
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
    expect(radios[2].checked).toBe(true);
  } finally {
    act(() => root.unmount());
    client.clear();
    container.remove();
  }
});

it("keeps answers during background schema refresh and resets when switching forms", async () => {
  globalThis.React = React;
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const form = {
    id: "original",
    name: "Service",
    settings: {},
    fields: [
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
  client.setQueryData(["/api/forms", "original"], form);
  client.setQueryData(["/api/forms", "other"], { ...form, id: "other" });
  const container = document.createElement("div");
  const root = createRoot(container);
  const render = (slug: string) => (
    <QueryClientProvider client={client}>
      <PublicFormRenderer slug={slug} />
    </QueryClientProvider>
  );
  try {
    act(() => root.render(render("original")));
    const selected = container.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1];
    act(() => selected.click());
    expect(selected.checked).toBe(true);
    await act(async () => {
      client.setQueryData(["/api/forms", "original"], {
        ...form,
        fields: [{ ...form.fields[0], label: "Updated service" }],
      });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(container.querySelectorAll<HTMLInputElement>('input[type="radio"]')[1].checked).toBe(
      true,
    );
    expect(container.textContent).not.toContain("Updated service");
    act(() => root.render(render("other")));
    expect(container.querySelectorAll("input:checked")).toHaveLength(0);
    act(() => root.render(render("original")));
    expect(container.textContent).toContain("Updated service");
    expect(container.querySelectorAll("input:checked")).toHaveLength(0);
  } finally {
    act(() => root.unmount());
    client.clear();
  }
});
