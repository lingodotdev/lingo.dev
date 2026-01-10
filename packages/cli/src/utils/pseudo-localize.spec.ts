import { describe, it, expect } from "vitest";
import { pseudoLocalize, pseudoLocalizeObject } from "./pseudo-localize";

describe("pseudoLocalize", () => {
  it("should replace characters with accented versions", () => {
    const result = pseudoLocalize("hello", { addMarker: false });
    expect(result).toBe("ĥèļļø");
  });

  it("should add marker by default", () => {
    const result = pseudoLocalize("hello");
    expect(result).toBe("ĥèļļø⚡");
  });

  it("should not add marker when disabled", () => {
    const result = pseudoLocalize("hello", { addMarker: false });
    expect(result).not.toContain("⚡");
  });

  it("should handle uppercase letters", () => {
    const result = pseudoLocalize("HELLO", { addMarker: false });
    expect(result).toBe("ĤÈĻĻØ");
  });

  it("should preserve non-alphabetic characters", () => {
    const result = pseudoLocalize("Hello123!", { addMarker: false });
    expect(result).toBe("Ĥèļļø123!");
  });

  it("should handle empty strings", () => {
    const result = pseudoLocalize("");
    expect(result).toBe("");
  });

  it("should handle strings with spaces", () => {
    const result = pseudoLocalize("Hello World", { addMarker: false });
    expect(result).toBe("Ĥèļļø Ŵøŕļð");
  });

  it("should add length expansion when enabled", () => {
    const original = "hello";
    const result = pseudoLocalize(original, {
      addMarker: false,
      addLengthMarker: true,
      lengthExpansion: 30,
    });
    // 30% expansion of 5 chars = 2 extra chars (rounded up)
    expect(result.length).toBeGreaterThan("ĥèļļø".length);
  });

  it("should handle example from feature proposal", () => {
    const result = pseudoLocalize("Submit");
    expect(result).toContain("⚡");
    expect(result.startsWith("Š")).toBe(true);
  });

  it("should handle longer text", () => {
    const result = pseudoLocalize("Welcome back!");
    expect(result).toBe("Ŵèļçømè ƀãçķ!⚡");
  });
});

describe("pseudoLocalizeObject", () => {
  it("should pseudo-localize string values", () => {
    const obj = { greeting: "hello" };
    const result = pseudoLocalizeObject(obj, { addMarker: false });
    expect(result.greeting).toBe("ĥèļļø");
  });

  it("should handle nested objects", () => {
    const obj = {
      en: {
        greeting: "hello",
        farewell: "goodbye",
      },
    };
    const result = pseudoLocalizeObject(obj, { addMarker: false });
    expect(result.en.greeting).toBe("ĥèļļø");
    expect(result.en.farewell).toContain("ĝ");
  });

  it("should handle arrays", () => {
    const obj = {
      messages: ["hello", "world"],
    };
    const result = pseudoLocalizeObject(obj, { addMarker: false });
    expect(Array.isArray(result.messages)).toBe(true);
    expect(result.messages[0]).toBe("ĥèļļø");
  });

  it("should preserve non-string values", () => {
    const obj = {
      greeting: "hello",
      count: 42,
      active: true,
      nothing: null,
    };
    const result = pseudoLocalizeObject(obj, { addMarker: false });
    expect(result.greeting).toBe("ĥèļļø");
    expect(result.count).toBe(42);
    expect(result.active).toBe(true);
    expect(result.nothing).toBe(null);
  });

  it("should handle complex nested structures", () => {
    const obj = {
      ui: {
        buttons: {
          submit: "Submit",
          cancel: "Cancel",
        },
        messages: ["error", "warning"],
      },
    };
    const result = pseudoLocalizeObject(obj, { addMarker: false });
    expect(result.ui.buttons.submit).toContain("Š");
    expect(result.ui.messages[0]).toContain("è");
  });

  it("should handle empty objects", () => {
    const result = pseudoLocalizeObject({}, { addMarker: false });
    expect(result).toEqual({});
  });
});
