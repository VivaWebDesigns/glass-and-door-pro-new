const DEFAULT_SEPARATOR = " | ";

function cleanBrand(value: string | null | undefined, fallbackBrand: string) {
  const cleaned = (value || "")
    .trim()
    .replace(/^[|–—-]\s*/, "")
    .replace(/\s*[|–—-]$/, "")
    .trim();

  return cleaned || fallbackBrand;
}

export function formatBrandFirstTitle(
  rawTitle: string | null | undefined,
  titleSuffix: string | null | undefined,
  fallbackBrand = "Glass & Door Pro",
) {
  const title = (rawTitle || "").trim();
  const brand = cleanBrand(titleSuffix, fallbackBrand);

  if (!title) return brand;
  if (title === brand) return title;

  const separators = [" | ", " - ", " – ", " — "];
  if (separators.some((separator) => title.startsWith(`${brand}${separator}`))) {
    return title;
  }

  for (const separator of separators) {
    const brandSuffix = `${separator}${brand}`;
    if (title.endsWith(brandSuffix)) {
      return `${brand}${separator}${title.slice(0, -brandSuffix.length).trim()}`;
    }
  }

  return `${brand}${DEFAULT_SEPARATOR}${title}`;
}
