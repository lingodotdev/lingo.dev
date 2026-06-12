import { describe, it, expect } from "vitest";
import { countTranslatableChars } from "./estimate";
import { computeProcessableData } from "./_utils";
import { Delta } from "../../utils/delta";

const delta = (added: string[] = [], updated: string[] = []): Delta => ({
  added,
  removed: [],
  updated,
  renamed: [],
  hasChanges: !!added.length || !!updated.length,
});

describe("countTranslatableChars", () => {
  it("sums the lengths of string leaf values only", () => {
    expect(
      countTranslatableChars({
        greeting: "Hello", // 5
        farewell: "Bye", // 3
        count: 42,
        flag: true,
      }),
    ).toBe(8);
  });

  it("returns 0 for empty data", () => {
    expect(countTranslatableChars({})).toBe(0);
  });
});

describe("computeProcessableData", () => {
  const sourceData = {
    "a.title": "Title",
    "a.body": "Body",
    "b.title": "Other",
  };

  it("keeps only delta-changed keys", () => {
    const result = computeProcessableData(
      sourceData,
      delta(["a.title"], ["b.title"]),
      false,
      [],
    );
    expect(Object.keys(result)).toEqual(["a.title", "b.title"]);
  });

  it("keeps everything with force", () => {
    const result = computeProcessableData(sourceData, delta(), true, []);
    expect(Object.keys(result)).toEqual(Object.keys(sourceData));
  });

  it("narrows by key patterns", () => {
    const result = computeProcessableData(sourceData, delta(), true, ["a.*"]);
    expect(Object.keys(result)).toEqual(["a.title", "a.body"]);
  });

  it("returns empty when nothing changed", () => {
    expect(computeProcessableData(sourceData, delta(), false, [])).toEqual({});
  });
});
