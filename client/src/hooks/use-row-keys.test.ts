import { describe, expect, it } from "vitest";
import { reconcileRowKeys } from "./use-row-keys";

describe("editable row identity", () => {
  it("preserves surviving rows through edits, removal, insertion and reorder", () => {
    const a = {},
      b = {},
      c = {};
    const initial = reconcileRowKeys({ items: [], keys: [], next: 0 }, [a, b]);
    const edited = reconcileRowKeys(initial, [a, c]);
    expect(edited.keys).toEqual(initial.keys);
    const removed = reconcileRowKeys(edited, [c]);
    expect(removed.keys).toEqual([initial.keys[1]]);
    const added = reconcileRowKeys(removed, [a, c]);
    expect(added.keys[1]).toBe(initial.keys[1]);
    expect(added.keys[0]).not.toBe(initial.keys[0]);
    expect(reconcileRowKeys(added, [c, a]).keys).toEqual([...added.keys].reverse());
  });
});
