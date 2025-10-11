import { describe, it, expect } from "vitest";
import {
  matchesKeyPattern,
  filterEntriesByPattern,
  formatDisplayValue,
} from "./key-matching";

describe("matchesKeyPattern", () => {
  it("should match keys with prefix matching", () => {
    const patterns = ["api", "settings"];

    expect(matchesKeyPattern("api/users", patterns)).toBe(true);
    expect(matchesKeyPattern("api/posts", patterns)).toBe(true);
    expect(matchesKeyPattern("settings/theme", patterns)).toBe(true);
    expect(matchesKeyPattern("other/key", patterns)).toBe(false);
  });

  it("should match keys with glob patterns", () => {
    const patterns = ["api/*/users", "settings/*"];

    expect(matchesKeyPattern("api/v1/users", patterns)).toBe(true);
    expect(matchesKeyPattern("api/v2/users", patterns)).toBe(true);
    expect(matchesKeyPattern("settings/theme", patterns)).toBe(true);
    expect(matchesKeyPattern("settings/notifications", patterns)).toBe(true);
    expect(matchesKeyPattern("api/users", patterns)).toBe(false);
  });

  it("should return false for empty patterns", () => {
    expect(matchesKeyPattern("any/key", [])).toBe(false);
  });

  it("should handle complex glob patterns", () => {
    const patterns = ["steps/*/type", "learningGoals/*/goal"];

    expect(matchesKeyPattern("steps/0/type", patterns)).toBe(true);
    expect(matchesKeyPattern("steps/1/type", patterns)).toBe(true);
    expect(matchesKeyPattern("learningGoals/0/goal", patterns)).toBe(true);
    expect(matchesKeyPattern("steps/0/name", patterns)).toBe(false);
  });
});

describe("filterEntriesByPattern", () => {
  it("should filter entries that match patterns", () => {
    const entries: [string, any][] = [
      ["api/users", "Users API"],
      ["api/posts", "Posts API"],
      ["settings/theme", "Dark"],
      ["other/key", "Value"],
    ];
    const patterns = ["api", "settings"];

    const result = filterEntriesByPattern(entries, patterns);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      ["api/users", "Users API"],
      ["api/posts", "Posts API"],
      ["settings/theme", "Dark"],
    ]);
  });

  it("should return empty array when no matches", () => {
    const entries: [string, any][] = [
      ["key1", "value1"],
      ["key2", "value2"],
    ];
    const patterns = ["nonexistent"];

    const result = filterEntriesByPattern(entries, patterns);

    expect(result).toHaveLength(0);
  });
});

describe("formatDisplayValue", () => {
  it("should return short strings as-is", () => {
    expect(formatDisplayValue("Hello")).toBe("Hello");
    expect(formatDisplayValue("Short text")).toBe("Short text");
  });

  it("should truncate long strings", () => {
    const longString = "a".repeat(100);
    const result = formatDisplayValue(longString);

    expect(result).toHaveLength(53); // 50 chars + "..."
    expect(result.endsWith("...")).toBe(true);
  });

  it("should use custom max length", () => {
    const text = "Hello, World!";
    const result = formatDisplayValue(text, 5);

    expect(result).toBe("Hello...");
  });

  it("should stringify non-string values", () => {
    expect(formatDisplayValue(42)).toBe("42");
    expect(formatDisplayValue(true)).toBe("true");
    expect(formatDisplayValue({ key: "value" })).toBe('{"key":"value"}');
    expect(formatDisplayValue(null)).toBe("null");
  });

  it("should handle arrays", () => {
    expect(formatDisplayValue([1, 2, 3])).toBe("[1,2,3]");
  });
});
