const DEFAULT_SEPARATOR = " | ";

function cleanBrand(value: string | null | undefined, fallbackBrand: string) {
  const cleaned = (value || "")
    .trim()
    .replace(/^[|–—-]\s*/, "")
    .replace(/\s*[|–—-]$/, "")
    .trim();

  return cleaned || fallbackBrand;
}

function brandAliases(brand: string) {
  const aliases = new Set([brand]);

  if (brand.includes("&")) {
    aliases.add(brand.replace(/\s*&\s*/g, " and "));
  }
  if (/\sand\s/i.test(brand)) {
    aliases.add(brand.replace(/\s+and\s+/gi, " & "));
  }

  return [...aliases];
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
  for (const alias of brandAliases(brand)) {
    if (separators.some((separator) => title.startsWith(`${alias}${separator}`))) {
      return alias === brand ? title : `${brand}${title.slice(alias.length)}`;
    }
  }

  for (const alias of brandAliases(brand)) {
    for (const separator of separators) {
      const brandSuffix = `${separator}${alias}`;
      if (title.endsWith(brandSuffix)) {
        return `${brand}${separator}${title.slice(0, -brandSuffix.length).trim()}`;
      }
    }
  }

  return `${brand}${DEFAULT_SEPARATOR}${title}`;
}

export function formatBrandLastTitle(
  rawTitle: string | null | undefined,
  titleSuffix: string | null | undefined,
  fallbackBrand = "Glass & Door Pro",
) {
  let title = (rawTitle || "").trim();
  const brand = cleanBrand(titleSuffix, fallbackBrand);

  if (!title) return brand;
  if (title === brand) return title;

  const separators = [" | ", " - ", " – ", " — "];
  for (const alias of brandAliases(brand)) {
    for (const separator of separators) {
      const brandPrefix = `${alias}${separator}`;
      if (title.startsWith(brandPrefix)) {
        title = title.slice(brandPrefix.length).trim();
      }

      const brandSuffix = `${separator}${alias}`;
      if (title.endsWith(brandSuffix)) {
        title = title.slice(0, -brandSuffix.length).trim();
      }
    }
  }

  if (!title) return brand;
  return `${title}${DEFAULT_SEPARATOR}${brand}`;
}
