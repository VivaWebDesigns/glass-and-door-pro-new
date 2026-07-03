export function normalizeSeoDescription(description: string): string;
export function normalizeSeoDescription(description: null): null;
export function normalizeSeoDescription(description: undefined): undefined;
export function normalizeSeoDescription(description: string | null): string | null;
export function normalizeSeoDescription(description: string | undefined): string | undefined;
export function normalizeSeoDescription(
  description: string | null | undefined,
): string | null | undefined;
export function normalizeSeoDescription(description: string | null | undefined) {
  if (description == null) return description;

  const normalized = description
    .replace(/^\s*meta\s+description\s*:\s*(?:\\n|\r?\n)*/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return normalized;
}
