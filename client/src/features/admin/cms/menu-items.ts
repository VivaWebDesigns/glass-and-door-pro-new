import type { MenuItem } from "@shared/schema";

/** Move a sibling under its predecessor without mutating either snapshot. */
export function indentMenuItem(items: MenuItem[], id: string): MenuItem[] {
  const index = items.findIndex((item) => item.id === id);
  if (index <= 0) return items;
  const previous = items[index - 1];
  return [
    ...items.slice(0, index - 1),
    { ...previous, children: [...previous.children, items[index]] },
    ...items.slice(index + 1),
  ];
}
