import { describe, it, expect } from "vitest";
import { isICUPluralObject, isPluralFormsObject } from "./xcode-xcstrings-icu";

/**
 * Safety tests to ensure ICU type guards don't falsely match normal data
 * from other bucket types (android, json, yaml, etc.)
 */
describe("ICU type guards - Safety for other bucket types", () => {
  describe("isICUPluralObject", () => {
    it("should return false for regular strings", () => {
      expect(isICUPluralObject("Hello world")).toBe(false);
      expect(isICUPluralObject("")).toBe(false);
      expect(isICUPluralObject("a string with {braces}")).toBe(false);
    });

    it("should return false for numbers", () => {
      expect(isICUPluralObject(42)).toBe(false);
      expect(isICUPluralObject(0)).toBe(false);
      expect(isICUPluralObject(-1)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isICUPluralObject([])).toBe(false);
      expect(isICUPluralObject(["one", "two"])).toBe(false);
      expect(isICUPluralObject([{ icu: "fake" }])).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isICUPluralObject(null)).toBe(false);
      expect(isICUPluralObject(undefined)).toBe(false);
    });

    it("should return false for plain objects (json, yaml data)", () => {
      expect(isICUPluralObject({ name: "John", age: 30 })).toBe(false);
      expect(isICUPluralObject({ key: "value" })).toBe(false);
      expect(isICUPluralObject({ nested: { data: "here" } })).toBe(false);
    });

    it("should return false for objects with 'icu' property but wrong format", () => {
      // Must have valid ICU MessageFormat pattern
      expect(isICUPluralObject({ icu: "not valid icu" })).toBe(false);
      expect(isICUPluralObject({ icu: "{just braces}" })).toBe(false);
      expect(isICUPluralObject({ icu: "plain text" })).toBe(false);
    });

    it("should return false for android plurals format", () => {
      // Android uses different structure
      expect(
        isICUPluralObject({
          quantity: {
            one: "1 item",
            other: "%d items",
          },
        }),
      ).toBe(false);
    });

    it("should return false for stringsdict format", () => {
      // iOS stringsdict uses different structure
      expect(
        isICUPluralObject({
          NSStringFormatSpecTypeKey: "NSStringPluralRuleType",
          NSStringFormatValueTypeKey: "d",
        }),
      ).toBe(false);
    });

    it("should return TRUE only for valid ICU plural objects", () => {
      // Valid ICU object
      expect(
        isICUPluralObject({
          icu: "{count, plural, one {1 item} other {# items}}",
          _meta: {
            variables: {
              count: {
                format: "%d",
                role: "plural",
              },
            },
          },
        }),
      ).toBe(true);

      // Valid ICU object without metadata
      expect(
        isICUPluralObject({
          icu: "{count, plural, one {1 item} other {# items}}",
        }),
      ).toBe(true);
    });
  });

  describe("isPluralFormsObject", () => {
    it("should return false for regular strings", () => {
      expect(isPluralFormsObject("Hello world")).toBe(false);
      expect(isPluralFormsObject("")).toBe(false);
    });

    it("should return false for numbers", () => {
      expect(isPluralFormsObject(42)).toBe(false);
      expect(isPluralFormsObject(0)).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isPluralFormsObject([])).toBe(false);
      expect(isPluralFormsObject(["one", "two"])).toBe(false);
    });

    it("should return false for null/undefined", () => {
      expect(isPluralFormsObject(null)).toBe(false);
      expect(isPluralFormsObject(undefined)).toBe(false);
    });

    it("should return false for plain objects (json, yaml data)", () => {
      expect(isPluralFormsObject({ name: "John", age: 30 })).toBe(false);
      expect(isPluralFormsObject({ key: "value" })).toBe(false);
      expect(isPluralFormsObject({ nested: { data: "here" } })).toBe(false);
    });

    it("should return false for objects with non-CLDR keys", () => {
      expect(isPluralFormsObject({ quantity: "one" })).toBe(false);
      expect(isPluralFormsObject({ count: "1", total: "10" })).toBe(false);
      expect(isPluralFormsObject({ first: "a", second: "b" })).toBe(false);
    });

    it("should return false for objects with CLDR keys but non-string values", () => {
      expect(isPluralFormsObject({ one: 1, other: 2 })).toBe(false);
      expect(isPluralFormsObject({ one: { nested: "obj" } })).toBe(false);
      expect(isPluralFormsObject({ one: ["array"] })).toBe(false);
    });

    it("should return false for objects missing 'other' form", () => {
      // 'other' is required in all locales per CLDR
      expect(isPluralFormsObject({ one: "1 item" })).toBe(false);
      expect(isPluralFormsObject({ zero: "0 items", one: "1 item" })).toBe(
        false,
      );
    });

    it("should return TRUE only for valid CLDR plural objects", () => {
      // Valid with required 'other' form
      expect(
        isPluralFormsObject({
          one: "1 item",
          other: "# items",
        }),
      ).toBe(true);

      // Valid with multiple CLDR forms
      expect(
        isPluralFormsObject({
          zero: "No items",
          one: "1 item",
          few: "A few items",
          many: "Many items",
          other: "# items",
        }),
      ).toBe(true);
    });
  });

  describe("Real-world bucket type data", () => {
    it("JSON bucket - should not match ICU guards", () => {
      const jsonData = {
        welcome: "Welcome!",
        user: {
          name: "John",
          greeting: "Hello {name}",
        },
        count: 42,
      };

      expect(isICUPluralObject(jsonData)).toBe(false);
      expect(isICUPluralObject(jsonData.user)).toBe(false);
      expect(isPluralFormsObject(jsonData)).toBe(false);
      expect(isPluralFormsObject(jsonData.user)).toBe(false);
    });

    it("YAML bucket - should not match ICU guards", () => {
      const yamlData = {
        app: {
          title: "My App",
          description: "An awesome app",
        },
        messages: {
          error: "Something went wrong",
          success: "Operation completed",
        },
      };

      expect(isICUPluralObject(yamlData.app)).toBe(false);
      expect(isICUPluralObject(yamlData.messages)).toBe(false);
      expect(isPluralFormsObject(yamlData.app)).toBe(false);
      expect(isPluralFormsObject(yamlData.messages)).toBe(false);
    });

    it("Android bucket - should not match ICU guards", () => {
      const androidData = {
        app_name: "MyApp",
        welcome_message: "Welcome %s!",
        item_count: {
          // Android format, not CLDR
          "@quantity": "plural",
          one: "1 item",
          other: "%d items",
        },
      };

      expect(isICUPluralObject(androidData["item_count"])).toBe(false);
      // This might match isPluralFormsObject if it has 'other' - that's intentional
      // Android plurals ARE CLDR plural forms
    });

    it("Properties bucket - should not match ICU guards", () => {
      const propertiesData = {
        "app.title": "My Application",
        "app.version": "1.0.0",
        "user.greeting": "Hello {0}",
      };

      for (const value of Object.values(propertiesData)) {
        expect(isICUPluralObject(value)).toBe(false);
        expect(isPluralFormsObject(value)).toBe(false);
      }
    });
  });
});
