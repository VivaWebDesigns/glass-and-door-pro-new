function contentKeyBase(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item);
  try {
    return JSON.stringify(item) ?? "item";
  } catch {
    return "item";
  }
}

/**
 * Wraps a `.map()` callback for read-only content lists that have no ids,
 * passing a React key derived from the item's content (deduplicated for
 * repeated items) so keys follow the content when items are reordered.
 */
export function withContentKeys<T, R>(render: (item: T, index: number, key: string) => R) {
  const seen = new Map<string, number>();
  return (item: T, index: number): R => {
    const base = contentKeyBase(item);
    const occurrence = seen.get(base) ?? 0;
    seen.set(base, occurrence + 1);
    return render(item, index, occurrence === 0 ? base : `${base}#${occurrence}`);
  };
}
