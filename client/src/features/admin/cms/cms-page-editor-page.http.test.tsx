// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, it, vi } from "vitest";
import CmsPageEditorPage from "./cms-page-editor-page";

vi.mock("wouter", async (importOriginal) => ({
  ...(await importOriginal<typeof import("wouter")>()),
  useParams: () => ({ id: "page-1" }),
  useLocation: () => ["/admin/cms/pages/page-1", () => {}],
}));
vi.mock("@/features/admin/admin-sidebar", () => ({
  AdminSidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/hooks/use-editor-lock", () => ({ useEditorLock: () => ({}) }));
vi.mock("@/hooks/use-lock-conflict-guard", () => ({ useLockConflictGuard: () => {} }));

it.each([403, 404])(
  "keeps HTTP %i responses out of the page editor and offers retry",
  async (status) => {
    globalThis.React = React;
    (
      globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
    ).IS_REACT_ACT_ENVIRONMENT = true;
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ message: "Page unavailable" }), {
          status,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    client.setQueryData(["/api/admin/cms/sidebars"], []);
    const container = document.createElement("div");
    const root = createRoot(container);
    try {
      await act(async () =>
        root.render(
          <QueryClientProvider client={client}>
            <CmsPageEditorPage />
          </QueryClientProvider>,
        ),
      );
      await vi.waitFor(async () => {
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 10));
        });
        expect(container.querySelector('[role="alert"]')?.textContent).toContain(
          "Page unavailable",
        );
      });
      expect(client.getQueryData(["/api/admin/cms/pages", "page-1"])).toBeUndefined();
      expect(client.getQueryState(["/api/admin/cms/pages", "page-1", "revisions"])?.status).toBe(
        "error",
      );
      expect(container.querySelector('[data-testid="button-save-page"]')).toBeNull();
      const retry = Array.from(container.querySelectorAll("button")).find(
        (button) => button.textContent === "Try again",
      );
      expect(retry).toBeDefined();
      const initialCalls = fetchMock.mock.calls.length;
      await act(async () => retry!.click());
      expect(fetchMock.mock.calls.length).toBeGreaterThan(initialCalls);
    } finally {
      act(() => root.unmount());
      client.clear();
      vi.unstubAllGlobals();
    }
  },
);
