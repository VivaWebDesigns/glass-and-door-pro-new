import { useState } from "react";

interface RowKeys<T> {
  items: readonly T[];
  keys: string[];
  next: number;
}

// Keep UI identity outside submitted/CMS data. Unchanged object references survive
// inserts, removals and reorders; a replaced object in the same slot is an edit.
export function reconcileRowKeys<T>(previous: RowKeys<T>, items: readonly T[]): RowKeys<T> {
  const used = new Set<number>();
  let next = previous.next;
  const matches = items.map((item) => {
    const match = previous.items.findIndex((old, index) => old === item && !used.has(index));
    if (match >= 0) used.add(match);
    return match;
  });
  const keys = matches.map((match, index) => {
    if (match >= 0) return previous.keys[match];
    if (items.length === previous.items.length && !used.has(index)) {
      used.add(index);
      return previous.keys[index];
    }
    return `row-${next++}`;
  });
  return { items, keys, next };
}

export function useRowKeys<T>(items: readonly T[]): string[] {
  const [state, setState] = useState<RowKeys<T>>(() =>
    reconcileRowKeys({ items: [], keys: [], next: 0 }, items),
  );
  if (
    items.length !== state.items.length ||
    items.some((item, index) => item !== state.items[index])
  ) {
    const next = reconcileRowKeys(state, items);
    setState(next);
    return next.keys;
  }
  return state.keys;
}
