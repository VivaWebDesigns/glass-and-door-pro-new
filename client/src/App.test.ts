import { describe, expect, it } from "vitest";
import { pathRequiresSetupStatus, shouldRedirectToSetup } from "./App";

describe("setup route guarding", () => {
  it("does not run setup gating for public service pages", () => {
    expect(pathRequiresSetupStatus("/services/frameless-showers")).toBe(false);
    expect(shouldRedirectToSetup("/services/frameless-showers", true)).toBe(false);
  });

  it("redirects protected setup-managed routes when initial setup is required", () => {
    expect(pathRequiresSetupStatus("/admin")).toBe(true);
    expect(pathRequiresSetupStatus("/auth/login")).toBe(true);
    expect(shouldRedirectToSetup("/admin", true)).toBe(true);
    expect(shouldRedirectToSetup("/auth/login", true)).toBe(true);
    expect(shouldRedirectToSetup("/setup", true)).toBe(false);
  });
});
