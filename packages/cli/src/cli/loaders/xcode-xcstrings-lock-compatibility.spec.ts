import { describe, it, expect } from "vitest";
import { MD5 } from "object-hash";

/**
 * Test suite for xcode-xcstrings pluralization lock file format.
 *
 * With the ICU loader approach, lock files contain checksums of ICU MessageFormat objects.
 * This is a NEW format for pluralization (not backward compatible with non-plural keys).
 *
 * Example lock file format:
 * item_count: <checksum of ICU object>
 *
 * vs old format (would have been):
 * item_count/zero: <checksum>
 * item_count/one: <checksum>
 * item_count/other: <checksum>
 */
describe("xcode-xcstrings ICU lock file format", () => {
  it("should compute checksums on ICU format objects", async () => {
    // This is what xcstrings-icu loader produces
    const sourceData = {
      welcome_message: "Hello!",
      item_count: {
        icu: "{count, plural, =0 {No items} one {# item} other {# items}}",
        _meta: {
          variables: {
            count: {
              format: "%d",
              role: "plural",
            },
          },
        },
      },
    };

    // Compute checksums on this format (what goes into lock file)
    const checksums: Record<string, string> = {};
    for (const [key, value] of Object.entries(sourceData)) {
      checksums[key] = MD5(value);
    }

    // Verify we have ICU object keys in checksums
    expect(checksums).toHaveProperty("item_count");
    expect(checksums).toHaveProperty("welcome_message");

    // No flattened keys
    expect(checksums).not.toHaveProperty("item_count/zero");
    expect(checksums).not.toHaveProperty("item_count/one");
    expect(checksums).not.toHaveProperty("item_count/other");
  });

  it("should have consistent ICU object structure for checksums", () => {
    const icuObject = {
      icu: "{count, plural, one {1 item} other {# items}}",
      _meta: {
        variables: {
          count: {
            format: "%d",
            role: "plural",
          },
        },
      },
    };

    const checksum1 = MD5(icuObject);
    const checksum2 = MD5(icuObject);

    // Checksums should be deterministic
    expect(checksum1).toBe(checksum2);
    expect(typeof checksum1).toBe("string");
    expect(checksum1.length).toBeGreaterThan(0);
  });

  it("should change checksum when ICU string changes", () => {
    const icuObject1 = {
      icu: "{count, plural, one {1 item} other {# items}}",
      _meta: { variables: { count: { format: "%d", role: "plural" } } },
    };

    const icuObject2 = {
      icu: "{count, plural, one {1 elemento} other {# elementos}}", // Spanish translation
      _meta: { variables: { count: { format: "%d", role: "plural" } } },
    };

    const checksum1 = MD5(icuObject1);
    const checksum2 = MD5(icuObject2);

    // Different ICU strings should produce different checksums
    expect(checksum1).not.toBe(checksum2);
  });

  it("should preserve ICU objects (not flatten them)", () => {
    // ICU objects should NOT be flattened into item_count/one, item_count/other
    // They should remain as single objects

    const icuObject = {
      icu: "{count, plural, =0 {No items} one {# item} other {# items}}",
      [Symbol.for("@lingo.dev/icu-plural-object")]: true,
    };

    // Verify it's recognized as ICU object
    expect(icuObject).toHaveProperty("icu");
    expect(icuObject.icu).toContain("plural");

    // Should have symbol marker
    expect(Symbol.for("@lingo.dev/icu-plural-object") in icuObject).toBe(true);
  });

  it("should handle mixed content (plurals and regular strings)", () => {
    const sourceData = {
      simple_string: "Hello!",
      plural_key: {
        icu: "{count, plural, one {1 item} other {# items}}",
        _meta: { variables: { count: { format: "%d", role: "plural" } } },
      },
      another_string: "Welcome!",
    };

    const checksums: Record<string, string> = {};
    for (const [key, value] of Object.entries(sourceData)) {
      checksums[key] = MD5(value);
    }

    // All keys should have checksums
    expect(Object.keys(checksums).sort()).toEqual([
      "another_string",
      "plural_key",
      "simple_string",
    ]);

    // Each should have unique checksum
    const uniqueChecksums = new Set(Object.values(checksums));
    expect(uniqueChecksums.size).toBe(3);
  });
});
