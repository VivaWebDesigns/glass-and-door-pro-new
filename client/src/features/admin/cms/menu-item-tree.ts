import type { MenuItem } from "@shared/schema";

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

export function createMenuItem(): MenuItem {
  return {
    id: generateId(),
    label: "",
    url: "/",
    openInNewTab: false,
    children: [],
  };
}

export function updateMenuItem(
  items: MenuItem[],
  id: string,
  updates: Partial<MenuItem>,
): MenuItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

export function removeMenuItem(items: MenuItem[], id: string): MenuItem[] {
  return items.filter((item) => item.id !== id);
}

/** Swap an item with its previous or next sibling. */
export function moveMenuItem(items: MenuItem[], id: string, direction: "up" | "down"): MenuItem[] {
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Make an item the last child of its previous sibling. */
export function indentMenuItem(items: MenuItem[], id: string): MenuItem[] {
  const index = items.findIndex((item) => item.id === id);
  if (index <= 0) return items;
  const next = [...items];
  const [item] = next.splice(index, 1);
  const previousSibling = next[index - 1];
  next[index - 1] = { ...previousSibling, children: [...previousSibling.children, item] };
  return next;
}

/** Move an item out of its parent so it follows the parent as a sibling. */
export function outdentMenuItem(items: MenuItem[], id: string): MenuItem[] {
  return items.flatMap((parent) => {
    const child = parent.children.find((candidate) => candidate.id === id);
    if (child) {
      return [{ ...parent, children: removeMenuItem(parent.children, id) }, { ...child }];
    }
    return [{ ...parent, children: outdentMenuItem(parent.children, id) }];
  });
}

export function countMenuItems(items: MenuItem[]): number {
  return items.reduce((count, item) => count + 1 + countMenuItems(item.children ?? []), 0);
}
