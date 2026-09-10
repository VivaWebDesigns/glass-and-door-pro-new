import { storage } from "../storage";

export const GLASS_COMPANY_ADDRESS = "6135 Park South Drive\nSuite 542\nCharlotte, NC 28210";
export const GLASS_COMPANY_NAME = "Glass and Door Pro";

const LEGACY_GLASS_COMPANY_ADDRESSES = new Set([
  "2341 Waverly Dr\nMonroe, NC 28112",
  "2341 Waverly Dr, Monroe, NC 28112",
]);

export async function ensureSystemBranding() {
  const [currentAddress, currentName, currentSeo] = await Promise.all([
    storage.settings.getSetting("company_address"),
    storage.settings.getSetting("company_name"),
    storage.seoSettings.get(),
  ]);

  if (currentName === null || currentName.trim() === "Glass & Door Pro") {
    await storage.settings.upsertSetting("company_name", GLASS_COMPANY_NAME, "branding", false);
  }

  if (currentAddress === null || LEGACY_GLASS_COMPANY_ADDRESSES.has(currentAddress.trim())) {
    await storage.settings.upsertSetting(
      "company_address",
      GLASS_COMPANY_ADDRESS,
      "branding",
      false,
    );
  }

  if (currentSeo) {
    const updates = {
      ...(currentSeo.siteName === "Glass & Door Pro" ? { siteName: GLASS_COMPANY_NAME } : {}),
      ...(currentSeo.organizationName === "Glass & Door Pro"
        ? { organizationName: GLASS_COMPANY_NAME }
        : {}),
      ...(currentSeo.titleSuffix === " | Glass & Door Pro"
        ? { titleSuffix: ` | ${GLASS_COMPANY_NAME}` }
        : {}),
    };

    if (Object.keys(updates).length > 0) {
      await storage.seoSettings.upsert(updates);
    }
  }
}
