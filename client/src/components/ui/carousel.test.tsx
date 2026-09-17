// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { expect, it, vi } from "vitest";
import { Carousel } from "./carousel";

const { api, listeners } = vi.hoisted(() => {
  const listeners = new Map<string, Set<unknown>>();
  return {
    listeners,
    api: {
      canScrollPrev: () => false,
      canScrollNext: () => true,
      on: (event: string, listener: unknown) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(listener);
      },
      off: (event: string, listener: unknown) => {
        listeners.get(event)?.delete(listener);
      },
    },
  };
});

vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, api] }));

it("releases all carousel subscriptions during StrictMode replay and unmount", () => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
  const container = document.createElement("div");
  const root = createRoot(container);
  try {
    act(() =>
      root.render(
        <React.StrictMode>
          <Carousel />
        </React.StrictMode>,
      ),
    );
    expect(listeners.get("select")?.size).toBe(1);
    expect(listeners.get("reInit")?.size).toBe(1);
  } finally {
    act(() => root.unmount());
  }
  expect(listeners.get("select")?.size).toBe(0);
  expect(listeners.get("reInit")?.size).toBe(0);
});
