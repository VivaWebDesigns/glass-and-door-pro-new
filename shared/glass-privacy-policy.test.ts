import { describe, expect, it } from "vitest";
import {
  GLASS_PRIVACY_POLICY_HTML,
  GLASS_PRIVACY_POLICY_LEGACY_MARKER,
} from "./glass-privacy-policy";

describe("Glass & Door Pro privacy policy", () => {
  it("accurately documents analytics, lead tracking, SMS, and privacy contacts", () => {
    expect(GLASS_PRIVACY_POLICY_HTML).toContain("Google Analytics 4");
    expect(GLASS_PRIVACY_POLICY_HTML).toContain("Google Tag Manager");
    expect(GLASS_PRIVACY_POLICY_HTML).toContain("generate_lead");
    expect(GLASS_PRIVACY_POLICY_HTML).toContain("lead type, form name");
    expect(GLASS_PRIVACY_POLICY_HTML).toContain(
      "Submitting a website form does not by itself enroll you",
    );
    expect(GLASS_PRIVACY_POLICY_HTML).toContain("Doug@GlassandDoorPro.com");
    expect(GLASS_PRIVACY_POLICY_HTML).not.toContain(GLASS_PRIVACY_POLICY_LEGACY_MARKER);
    expect(GLASS_PRIVACY_POLICY_HTML).not.toContain("This data is aggregated");
  });
});
