import { describe, expect, it } from "vitest";
import createJson5Loader from "./json5";

describe("json5 loader", () => {
  it("pull should parse valid JSON5 format", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const json5Input = `{
      // Comments are allowed in JSON5
      hello: "Hello",
      'single-quotes': 'work too',
      unquoted: 'keys work',
      trailing: 'comma is ok',
    }`;

    const result = await loader.pull("en", json5Input);
    expect(result).toEqual({
      hello: "Hello",
      "single-quotes": "work too",
      unquoted: "keys work",
      trailing: "comma is ok",
    });
  });

  it("pull should parse regular JSON as fallback", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const jsonInput = '{"hello": "Hello", "world": "World"}';

    const result = await loader.pull("en", jsonInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("pull should handle empty input", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", "");
    expect(result).toEqual({});
  });

  it("pull should handle null/undefined input", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", null as any);
    expect(result).toEqual({});
  });

  it("pull should handle JSON5 with multiline strings", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const json5Input = `{
      multiline: "This is a \\
long string that \\
spans multiple lines"
    }`;

    const result = await loader.pull("en", json5Input);
    expect(result).toEqual({
      multiline: "This is a long string that spans multiple lines",
    });
  });

  it("pull should handle JSON5 with hexadecimal numbers", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const json5Input = `{
      hex: 0xdecaf,
      positive: +123,
      negative: -456
    }`;

    const result = await loader.pull("en", json5Input);
    expect(result).toEqual({
      hex: 0xdecaf,
      positive: 123,
      negative: -456,
    });
  });

  it("pull should throw error for invalid JSON5", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    const invalidInput = `{
      hello: "Hello"
      world: "World" // missing comma
      invalid: syntax
    }`;

    await expect(loader.pull("en", invalidInput)).rejects.toThrow();
  });

  it("push should serialize data to JSON5 format", async () => {
    const loader = createJson5Loader();
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
  hello: 'Hello',
  world: 'World',
  nested: {
    key: 'value',
  },
}`;

    expect(result).toBe(expectedOutput);
  });

  it("push should handle empty object", async () => {
    const loader = createJson5Loader();
    loader.setDefaultLocale("en");
    // Need to call pull first to initialize the loader state
    await loader.pull("en", "{}");

    const result = await loader.push("en", {});
    expect(result).toBe("{}");
  });

  it("push should handle complex nested data", async () => {
    const loader = createJson5Loader();
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

    // Parse the result back to verify it's valid JSON5
    const JSON5 = await import("json5");
    const parsed = JSON5.default.parse(result);
    expect(parsed).toEqual(data);
  });
});
