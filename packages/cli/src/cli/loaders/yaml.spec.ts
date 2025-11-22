import { describe, expect, it } from "vitest";
import createYamlLoader from "./yaml";

describe("yaml loader", () => {
  it("pull should parse valid YAML format", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");
    const yamlInput = `hello: Hello
world: World
nested:
  key: value`;

    const result = await loader.pull("en", yamlInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
      nested: {
        key: "value",
      },
    });
  });

  it("pull should handle empty input", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");
    const result = await loader.pull("en", "");
    expect(result).toEqual({});
  });

  it("pull should parse YAML with literal block scalars", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");
    const yamlInput = `description: |
  This is a multi-line
  description with
  - bullet points
  - and more items`;

    const result = await loader.pull("en", yamlInput);
    expect(result).toEqual({
      description:
        "This is a multi-line\ndescription with\n- bullet points\n- and more items\n",
    });
  });

  it("push should preserve literal block scalar format when input uses it", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Input with literal block scalar
    const yamlInput = `system_prompt: |
  You are a compliance expert.
  Standard Rules:
  1. **Rule One**
    - Do not make guarantees
    - Flag phrases: "guaranteed returns"
  2. **Rule Two**
    - Past performance disclaimer`;

    await loader.pull("en", yamlInput);

    const data = {
      system_prompt: `You are a compliance expert.
Standard Rules:
1. **Rule One**
  - Do not make guarantees
  - Flag phrases: "guaranteed returns"
2. **Rule Two**
  - Past performance disclaimer`,
    };

    const result = await loader.push("en", data, yamlInput);

    // Should NOT contain backslash escaping before dashes
    expect(result).not.toContain("\\  -");

    // Should use literal block scalar format (|- or |)
    expect(result).toMatch(/system_prompt:\s*\|[-+]?/);

    // Verify the content is correctly formatted
    expect(result).toContain("  - Do not make guarantees");
    expect(result).toContain("  - Flag phrases:");
    expect(result).toContain("  - Past performance disclaimer");
  });

  it("push should NOT use backslash escaping for indented dashes with literal block scalars", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Original input uses literal block scalar
    const originalInput = `content: |
  List of items:
  - First item
  - Second item
    - Nested item`;

    await loader.pull("en", originalInput);

    const data = {
      content: `List of items:
- First item
- Second item
  - Nested item`,
    };

    const result = await loader.push("en", data, originalInput);

    // Critical: Should NOT have backslash escaping
    expect(result).not.toMatch(/^\s*\\\s+-/m);
    expect(result).not.toContain("\\  -");

    // Should preserve literal block scalar
    expect(result).toMatch(/content:\s*\|[-+]?/);
  });

  it("push should use QUOTE_DOUBLE when original input has quoted strings", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Input with double-quoted strings (no literal block scalars)
    const yamlInput = `"hello": "Hello World"
"world": "Another string"`;

    await loader.pull("en", yamlInput);

    const data = {
      hello: "Hello World",
      world: "Another string",
    };

    const result = await loader.push("en", data, yamlInput);

    // Should use double quotes
    expect(result).toContain('"hello"');
    expect(result).toContain('"Hello World"');
  });

  it("push should default to PLAIN format when no style indicators", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    const yamlInput = `hello: Hello World
world: Another string`;

    await loader.pull("en", yamlInput);

    const data = {
      hello: "Hello World",
      world: "Another string",
    };

    const result = await loader.push("en", data, yamlInput);

    // Should use plain format (no quotes, no literal scalars for simple strings)
    expect(result).toContain("hello: Hello World");
    expect(result).toContain("world: Another string");
  });

  it("push should handle complex content with literal block scalars and quotes", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Input that has both literal block scalars and embedded quotes
    const yamlInput = `system_prompt: |
  Rules:
  1. **Rule**
    - Do not use "guaranteed" language
    - Flag: "no risk"
user_prompt: Simple text`;

    await loader.pull("en", yamlInput);

    const data = {
      system_prompt: `Rules:
1. **Rule**
  - Do not use "guaranteed" language
  - Flag: "no risk"`,
      user_prompt: "Simple text",
    };

    const result = await loader.push("en", data, yamlInput);

    // Should detect literal block scalar and use PLAIN format
    expect(result).toMatch(/system_prompt:\s*\|[-+]?/);

    // Should NOT have backslash escaping
    expect(result).not.toContain("\\  -");

    // Embedded quotes should be preserved in the content
    expect(result).toContain('"guaranteed"');
    expect(result).toContain('"no risk"');
  });

  it("pull should handle YAML with comments", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");
    const yamlInput = `# This is a comment
hello: Hello # inline comment
world: World`;

    const result = await loader.pull("en", yamlInput);
    expect(result).toEqual({
      hello: "Hello",
      world: "World",
    });
  });

  it("push should handle empty object", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");
    await loader.pull("en", "{}");

    const result = await loader.push("en", {});
    expect(result.trim()).toBe("{}");
  });

  it("push should handle arrays", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    const yamlInput = `items:
  - first
  - second
  - third`;

    await loader.pull("en", yamlInput);

    const data = {
      items: ["first", "second", "third"],
    };

    const result = await loader.push("en", data, yamlInput);

    // Verify it parses back correctly
    const reparsed = await loader.pull("en", result);
    expect(reparsed).toEqual(data);
  });
});
