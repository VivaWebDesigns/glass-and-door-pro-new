import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetSetting = vi.fn();
const mockUpsertSetting = vi.fn();
const mockGetSeo = vi.fn();
const mockUpsertSeo = vi.fn();

vi.mock("../storage", () => ({
  storage: {
    settings: {
      getSetting: mockGetSetting,
      upsertSetting: mockUpsertSetting,
    },
    seoSettings: {
      get: mockGetSeo,
      upsert: mockUpsertSeo,
    },
  },
}));

describe("ensureSystemBranding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSeo.mockResolvedValue(undefined);
  });

  it.each([null, "2341 Waverly Dr\nMonroe, NC 28112"])(
    "sets the current address when the stored value is %s",
    async (storedAddress) => {
      mockGetSetting.mockResolvedValue(storedAddress);

      const mod = await import("../services/system-branding.service");
      await mod.ensureSystemBranding();

      expect(mockUpsertSetting).toHaveBeenCalledWith(
        "company_address",
        "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210",
        "branding",
        false,
      );
    },
  );

  it("preserves a custom address", async () => {
    mockGetSetting.mockResolvedValue("A different admin-managed address");

    const mod = await import("../services/system-branding.service");
    await mod.ensureSystemBranding();

    expect(mockUpsertSetting).not.toHaveBeenCalled();
  });

  it("migrates the former display name in branding and SEO settings", async () => {
    mockGetSetting.mockImplementation(async (key: string) =>
      key === "company_address" ? "A different admin-managed address" : "Glass & Door Pro",
    );
    mockGetSeo.mockResolvedValue({
      siteName: "Glass & Door Pro",
      organizationName: "Glass & Door Pro",
      titleSuffix: " | Glass & Door Pro",
    });

    const mod = await import("../services/system-branding.service");
    await mod.ensureSystemBranding();

    expect(mockUpsertSetting).toHaveBeenCalledWith(
      "company_name",
      "Glass and Door Pro",
      "branding",
      false,
    );
    expect(mockUpsertSeo).toHaveBeenCalledWith({
      siteName: "Glass and Door Pro",
      organizationName: "Glass and Door Pro",
      titleSuffix: " | Glass and Door Pro",
    });
  });
});
