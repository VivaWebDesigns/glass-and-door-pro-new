// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from "vitest";

describe("lead tracking", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    window.dataLayer = [];
    vi.resetModules();
  });

  it("pushes the confirmed lead payload once", async () => {
    const { pushGlassDoorProLeadSuccess } = await import("./lead-tracking");

    const payload = {
      leadType: "contact",
      formName: "contact-form",
      leadEventId: "submission-123",
    };

    expect(pushGlassDoorProLeadSuccess(payload)).toBe(true);
    expect(pushGlassDoorProLeadSuccess(payload)).toBe(false);
    expect(window.dataLayer).toEqual([
      {
        event: "glass_door_pro_lead_success",
        lead_type: "contact",
        form_name: "contact-form",
        lead_event_id: "submission-123",
      },
    ]);
  });

  it("does not push without a server submission id", async () => {
    const { pushGlassDoorProLeadSuccess } = await import("./lead-tracking");

    expect(
      pushGlassDoorProLeadSuccess({
        leadType: "contact",
        formName: "contact-form",
        leadEventId: "",
      }),
    ).toBe(false);
    expect(window.dataLayer).toEqual([]);
  });

  it("deduplicates across module reloads using session storage", async () => {
    const firstModule = await import("./lead-tracking");
    const payload = {
      leadType: "contact",
      formName: "contact-form",
      leadEventId: "submission-456",
    };

    expect(firstModule.pushGlassDoorProLeadSuccess(payload)).toBe(true);
    vi.resetModules();
    const reloadedModule = await import("./lead-tracking");

    expect(reloadedModule.pushGlassDoorProLeadSuccess(payload)).toBe(false);
    expect(window.dataLayer).toHaveLength(1);
  });
});
