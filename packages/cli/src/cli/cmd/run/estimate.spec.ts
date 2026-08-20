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

// Flat buckets flatten with "/" and encode each segment, so these are the keys
// --key is actually filtering against. The dot-separated fixtures above are not.
describe("computeProcessableData with the keys flat buckets produce", () => {
  const sourceData = {
    "auth/login/title": "Sign in",
    "auth/login/button": "Go",
    "auth/logout/title": "Sign out",
    "auth/login_url": "https://example.com",
  };
  const encoded = (pattern: string) => encodeURIComponent(pattern);

  it("matches a prefix on the separator the keys actually use", () => {
    const result = computeProcessableData(sourceData, delta(), true, [
      encoded("auth/login"),
    ]);
    expect(Object.keys(result)).toEqual([
      "auth/login/title",
      "auth/login/button",
    ]);
  });

  it("still honours an explicit glob", () => {
    const result = computeProcessableData(sourceData, delta(), true, [
      encoded("auth/login/*"),
    ]);
    expect(Object.keys(result)).toEqual([
      "auth/login/title",
      "auth/login/button",
    ]);
  });

  it("matches an exact key", () => {
    const result = computeProcessableData(sourceData, delta(), true, [
      encoded("auth/logout/title"),
    ]);
    expect(Object.keys(result)).toEqual(["auth/logout/title"]);
  });
});
