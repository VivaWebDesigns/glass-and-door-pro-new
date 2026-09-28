import { useCallback, useState } from "react";

let nextListKey = 0;
function createListKey() {
  nextListKey += 1;
  return `list-item-${nextListKey}`;
}

/**
 * Stable React keys for an editable list whose items have no ids.
 * Keys follow items through removals (call `removeKey` alongside the removal);
 * appended items get fresh keys automatically.
 */
export function useListKeys(count: number) {
  const [keys, setKeys] = useState<string[]>(() => Array.from({ length: count }, createListKey));

  let currentKeys = keys;
  if (keys.length !== count) {
    currentKeys =
      keys.length > count
        ? keys.slice(0, count)
        : [...keys, ...Array.from({ length: count - keys.length }, createListKey)];
    setKeys(currentKeys);
  }

  const removeKey = useCallback((index: number) => {
    setKeys((previous) => previous.filter((_, keyIndex) => keyIndex !== index));
  }, []);

  const moveKey = useCallback((from: number, to: number) => {
    setKeys((previous) => {
      const next = [...previous];
      const [moved] = next.splice(from, 1);
      if (moved !== undefined) next.splice(to, 0, moved);
      return next;
    });
  }, []);

  return { keys: currentKeys, removeKey, moveKey };
}

/** Pair list items with keys from `useListKeys` for rendering. */
export function pairWithKeys<T>(items: readonly T[], keys: readonly string[]) {
  return items.map((item, position) => ({ item, key: keys[position] ?? `list-item-extra-${position}` }));
}
