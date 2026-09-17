import { describe, expect, it } from "vitest";
import type { MenuItem } from "@shared/schema";
import { indentMenuItem } from "./menu-items";

function item(id: string, children: MenuItem[] = []): MenuItem {
  return { id, label: id, url: `/${id}`, openInNewTab: false, children };
}

function freezeTree(items: MenuItem[]): MenuItem[] {
  for (const node of items) {
    freezeTree(node.children);
    Object.freeze(node);
  }
  Object.freeze(items);
  return items;
}

describe("indentMenuItem", () => {
  it("can replay against frozen previous state without duplicating children", () => {
    const previous = freezeTree([item("first", [item("existing")]), item("second"), item("third")]);
    const result = indentMenuItem(previous, "second");
    expect(result.map((node) => node.id)).toEqual(["first", "third"]);
    expect(result[0].children.map((node) => node.id)).toEqual(["existing", "second"]);
    expect(previous[0].children.map((node) => node.id)).toEqual(["existing"]);
    expect(indentMenuItem(previous, "second")).toEqual(result);
    expect(result[1]).toBe(previous[2]);
  });

  it("handles nested sibling lists and ignores a first or missing item", () => {
    const parent = item("parent", freezeTree([item("first"), item("second")]));
    expect(indentMenuItem(parent.children, "second")[0].children[0].id).toBe("second");
    expect(indentMenuItem(parent.children, "first")).toBe(parent.children);
    expect(indentMenuItem(parent.children, "missing")).toBe(parent.children);
  });
});
