import { describe, expect, it } from "vitest";
import createXcodeStringsLoader from "./xcode-strings";

describe("xcode-strings loader", () => {
  it("should parse single-line entries", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"hello" = "Hello";
"world" = "World";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("should parse multi-line string values", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"greeting" = "Hello";
"multiline" = "This is line one
This is line two
This is line three";
"another" = "Another value";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      greeting: "Hello",
      multiline: "This is line one\nThis is line two\nThis is line three",
      another: "Another value",
    });
  });

  it("should handle multi-line string with placeholders", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"add_new_reference_share_text" = "Hi!
Could you stop by quickly and tell us what you thought of our experience together? Your words will be super important to boost my profile on Worldpackers!
[url]
";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      add_new_reference_share_text:
        "Hi!\nCould you stop by quickly and tell us what you thought of our experience together? Your words will be super important to boost my profile on Worldpackers!\n[url]\n",
    });
  });

  it("should skip comments", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `// This is a comment
"hello" = "Hello";
// Another comment
"world" = "World";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("should skip empty lines", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"hello" = "Hello";

"world" = "World";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("should handle escaped characters in single-line values", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"escaped_quote" = "He said \\"Hello\\"";
"escaped_newline" = "Line 1\\nLine 2";
"escaped_backslash" = "Path: C:\\\\Users";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      escaped_quote: 'He said "Hello"',
      escaped_newline: "Line 1\nLine 2",
      escaped_backslash: "Path: C:\\Users",
    });
  });

  it("should handle empty values", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"empty" = "";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      empty: "",
    });
  });

  it("push should convert object to .strings format", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "");

    const payload = {
      hello: "Hello",
      world: "World",
    };

    const result = await loader.push("en", payload);
    expect(result).toBe(`"hello" = "Hello";
"world" = "World";`);
  });

  it("push should escape special characters", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "");

    const payload = {
      escaped_quote: 'He said "Hello"',
      escaped_newline: "Line 1\nLine 2",
      escaped_backslash: "Path: C:\\Users",
    };

    const result = await loader.push("en", payload);
    expect(result).toBe(
      `"escaped_quote" = "He said \\"Hello\\"";
"escaped_newline" = "Line 1\\nLine 2";
"escaped_backslash" = "Path: C:\\\\Users";`,
    );
  });

  it("push should handle multi-line values by escaping newlines", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "");

    const payload = {
      multiline: "This is line one\nThis is line two\nThis is line three",
    };

    const result = await loader.push("en", payload);
    expect(result).toBe(
      `"multiline" = "This is line one\\nThis is line two\\nThis is line three";`,
    );
  });

  it("should handle mixed single-line and multi-line entries", async () => {
    const loader = createXcodeStringsLoader();
    loader.setDefaultLocale("en");
    const input = `"single1" = "Value 1";
"multi" = "Line 1
Line 2";
"single2" = "Value 2";`;

    const result = await loader.pull("en", input);
    expect(result).toEqual({
      single1: "Value 1",
      multi: "Line 1\nLine 2",
      single2: "Value 2",
    });
  });
});
