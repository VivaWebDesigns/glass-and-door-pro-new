const CORE_GOOGLE_FONT_VALUES = new Set(["inter", "nunito-sans", "eb-garamond"]);

const GOOGLE_FONT_FAMILY_BY_VALUE: Record<string, string> = {
  inter: "Inter:opsz,wght@14..32,100..900",
  roboto: "Roboto:wght@400;500;700",
  "open-sans": "Open Sans:wght@400;500;600;700",
  lato: "Lato:wght@400;700;900",
  montserrat: "Montserrat:wght@400;500;600;700;800",
  poppins: "Poppins:wght@400;500;600;700",
  "source-sans-3": "Source Sans 3:wght@400;500;600;700",
  "nunito-sans": "Nunito Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000",
  "work-sans": "Work Sans:wght@400;500;600;700",
  raleway: "Raleway:wght@400;500;600;700;800",
  merriweather: "Merriweather:wght@400;700;900",
  "playfair-display": "Playfair Display:wght@400..900",
  lora: "Lora:wght@400..700",
  "libre-baskerville": "Libre Baskerville:wght@400;700",
  "cormorant-garamond": "Cormorant Garamond:wght@400;500;600;700",
  "eb-garamond": "EB Garamond:ital,wght@0,400..800;1,400..800",
  "crimson-text": "Crimson Text:wght@400;600;700",
  "pt-serif": "PT Serif:wght@400;700",
  bitter: "Bitter:wght@400;500;600;700",
  "source-serif-4": "Source Serif 4:opsz,wght@8..60,400..900",
};

export function googleFontStylesheetHrefForBrandingOptions(
  values: Array<string | null | undefined>,
): string | null {
  const families = Array.from(
    new Set(
      values
        .filter((value): value is string => !!value && !CORE_GOOGLE_FONT_VALUES.has(value))
        .map((value) => GOOGLE_FONT_FAMILY_BY_VALUE[value])
        .filter(Boolean),
    ),
  );

  if (families.length === 0) return null;

  const params = new URLSearchParams();
  families.forEach((family) => params.append("family", family));
  params.set("display", "optional");
  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}
