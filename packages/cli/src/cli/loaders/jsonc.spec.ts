import { describe, expect, it } from "vitest";
import createJsoncLoader from "./jsonc";

describe("jsonc loader", () => {
  it("pull should parse valid JSONC format with comments", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsoncInput = `{
      // Comments are allowed in JSONC
      "hello": "Hello",
      "world": "World", // Trailing comment
      /* Block comment */
      "nested": {
        "key": "value"
      }
    }`;

    const result = await loader.pull("en", jsoncInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
      nested: {
        key: "value",
      },
    });
  });

  it("pull should parse JSONC with trailing commas", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsoncInput = `{
      "hello": "Hello",
      "world": "World",
      "array": [
        "item1",
        "item2",
      ],
    }`;

    const result = await loader.pull("en", jsoncInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
      array: ["item1", "item2"],
    });
  });

  it("pull should parse regular JSON as valid JSONC", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsonInput = '{"hello": "Hello", "world": "World"}';

    const result = await loader.pull("en", jsonInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("pull should handle empty input", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", "");
    expect(result).toEqual({});
  });

  it("pull should handle null/undefined input", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", null as any);
    expect(result).toEqual({});
  });

  it("pull should handle JSONC with mixed comment styles", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsoncInput = `{
      // Line comment
      "title": "Hello",
      /* 
       * Multi-line
       * block comment
       */
      "description": "World",
      "version": "1.0.0" // Another line comment
    }`;

    const result = await loader.pull("en", jsoncInput);
    expect(result).toEqual({
      title: "Hello",
      description: "World",
      version: "1.0.0",
    });
  });

  it("pull should throw error for invalid JSONC", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const invalidInput = `{
      "hello": "Hello"
      "world": "World" // missing comma
      invalid: syntax
    }`;

    await expect(loader.pull("en", invalidInput)).rejects.toThrow(
      "Failed to parse JSONC",
    );
  });

  it("push should serialize data to JSON format", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "{}");

    const data = {
      hello: "Hello",
      world: "World",
      nested: {
        key: "value",
      },
    };

    const result = await loader.push("en", data);
    const expectedOutput = `{
  "hello": "Hello",
  "world": "World",
  "nested": {
    "key": "value"
  }
}`;

    expect(result).toBe(expectedOutput);
  });

  it("push should handle empty object", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "{}");

    const result = await loader.push("en", {});
    expect(result).toBe("{}");
  });

  it("push should handle complex nested data", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "{}");

    const data = {
      strings: ["hello", "world"],
      numbers: [1, 2, 3],
      nested: {
        deep: {
          key: "value",
        },
      },
    };

    const result = await loader.push("en", data);

    // Parse the result back to verify it's valid JSON
    const parsed = JSON.parse(result);
    expect(parsed).toEqual(data);
  });

  it("pull should handle JSONC with Unicode escape sequences", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsoncInput = `{
      // Unicode characters
      "unicode": "\\u0048\\u0065\\u006c\\u006c\\u006f",
      "emoji": "🚀"
    }`;

    const result = await loader.pull("en", jsoncInput);
    expect(result).toEqual({
      unicode: "Hello",
      emoji: "🚀",
    });
  });

  it("pullHints should extract comments from JSONC", async () => {
    const loader = createJsoncLoader();
    loader.setDefaultLocale("en");
    const jsoncInput = `{
      "key1": "value1", // This is a comment for key1
      "key2": "value2" /* This is a comment for key2 */,
      // This is a comment for key3
      "key3": "value3",
      /* This is a block comment for key4 */
      "key4": "value4",
      /*
       This is a comment for key5
      */
      "key5": "value5",
      // This is a comment for key6
      "key6": {
        // This is a comment for key7
        "key7": "value7"
      }
    }`;

    const comments = await loader.pullHints(jsoncInput);

    expect(comments).toEqual({
      key1: { hint: "This is a comment for key1" },
      key2: { hint: "This is a comment for key2" },
      key3: { hint: "This is a comment for key3" },
      key4: { hint: "This is a block comment for key4" },
      key5: { hint: "This is a comment for key5" },
      key6: {
        hint: "This is a comment for key6",
        key7: { hint: "This is a comment for key7" },
      },
    });
  });
});
