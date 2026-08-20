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
  // Flat buckets join nesting with "/" and encode each segment, so these are the
  // keys --key is filtering against.
  const sourceData = {
    "auth/login/title": "Title",
    "auth/login/button": "Go",
    "auth/login_url": "https://example.com",
    "sign-in": "Sign in",
    "sign-in-error": "Wrong password",
  };

  it("keeps only delta-changed keys", () => {
    const result = computeProcessableData(
      sourceData,
      delta(["auth/login/title"], ["sign-in"]),
      false,
      [],
    );
    expect(Object.keys(result)).toEqual(["auth/login/title", "sign-in"]);
  });

  it("keeps everything with force", () => {
    const result = computeProcessableData(sourceData, delta(), true, []);
    expect(Object.keys(result)).toEqual(Object.keys(sourceData));
  });

  it("returns empty when nothing changed", () => {
    expect(computeProcessableData(sourceData, delta(), false, [])).toEqual({});
  });

  // The CLI encodes each --key value at parse time, so patterns arrive encoded.
  it.each([
    ["auth/login", ["auth/login/title", "auth/login/button"]],
    ["auth", ["auth/login/title", "auth/login/button", "auth/login_url"]],
    ["auth/login/*", ["auth/login/title", "auth/login/button"]],
    ["auth/login/title", ["auth/login/title"]],
    ["sign-in", ["sign-in"]],
  ])("narrows to %s", (pattern, expected) => {
    const result = computeProcessableData(sourceData, delta(), true, [
      encodeURIComponent(pattern),
    ]);
    expect(Object.keys(result)).toEqual(expected);
  });
});
