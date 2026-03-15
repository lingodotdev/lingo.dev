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

  it("push should preserve mixed value quoting (some quoted, some unquoted)", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Mixed quoting: some values quoted, some plain, some YAML references
    const yamlInput = `gender:
  f: "Feminine"
  m: "Masculine"
  female: :@f
  male: :@m`;

    await loader.pull("en", yamlInput);

    const data = {
      gender: {
        f: "Femenino",
        m: "Masculino",
        female: ":@f",
        male: ":@m",
      },
    };

    const result = await loader.push("en", data, yamlInput);

    // Quoted values should remain quoted
    expect(result).toContain('"Femenino"');
    expect(result).toContain('"Masculino"');

    // YAML references should remain unquoted
    expect(result).toContain("female: :@f");
    expect(result).toContain("male: :@m");

    // Should NOT quote all values globally
    expect(result).not.toMatch(/female:\s*":@f"/);
    expect(result).not.toMatch(/male:\s*":@m"/);
  });

  it("push should preserve mixed key quoting (some keys quoted, some unquoted)", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Mixed key quoting: one key quoted, others plain
    const yamlInput = `gender:
  f: Feminine
  "m": Masculine
  n: Neutral`;

    await loader.pull("en", yamlInput);

    const data = {
      gender: {
        f: "Femenino",
        m: "Masculino",
        n: "Neutro",
      },
    };

    const result = await loader.push("en", data, yamlInput);

    // Only 'm' key should be quoted
    expect(result).toMatch(/"m":\s*Masculino/);

    // Other keys should NOT be quoted
    expect(result).toMatch(/f:\s*Femenino/);
    expect(result).not.toContain('"f":');
    expect(result).toMatch(/n:\s*Neutro/);
    expect(result).not.toContain('"n":');

    // Root key should not be quoted
    expect(result).not.toContain('"gender":');
  });

  it("push should preserve both mixed key and value quoting simultaneously", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Complex scenario: mixed keys AND mixed values
    const yamlInput = `config:
  "special-key": "quoted value"
  normalKey: plain value
  anotherKey: "another quoted"`;

    await loader.pull("en", yamlInput);

    const data = {
      config: {
        "special-key": "valor citado",
        normalKey: "valor plano",
        anotherKey: "otro citado",
      },
    };

    const result = await loader.push("en", data, yamlInput);

    // Quoted key should remain quoted
    expect(result).toMatch(/"special-key":/);

    // Other keys should not be quoted
    expect(result).toMatch(/normalKey:/);
    expect(result).not.toContain('"normalKey"');
    expect(result).toMatch(/anotherKey:/);
    expect(result).not.toContain('"anotherKey"');

    // Quoted values should remain quoted
    expect(result).toContain('"valor citado"');
    expect(result).toContain('"otro citado"');

    // Plain value should remain plain
    expect(result).toMatch(/normalKey:\s*valor plano/);
  });

  it("push should preserve nested mixed quoting", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Nested structure with mixed quoting at different levels
    const yamlInput = `i18n:
  inflections:
    gender:
      f: "Feminine"
      "m": "Masculine"
      female: :@f`;

    await loader.pull("en", yamlInput);

    const data = {
      i18n: {
        inflections: {
          gender: {
            f: "Femenino",
            m: "Masculino",
            female: ":@f",
          },
        },
      },
    };

    const result = await loader.push("en", data, yamlInput);

    // Only 'm' key should be quoted
    expect(result).toMatch(/"m":/);
    expect(result).not.toContain('"f":');

    // Parent keys should not be quoted
    expect(result).not.toContain('"i18n":');
    expect(result).not.toContain('"inflections":');
    expect(result).not.toContain('"gender":');

    // Quoted value should be quoted, reference unquoted
    expect(result).toContain('"Femenino"');
    expect(result).toMatch(/female:\s*:@f/);
  });

  it("push should preserve quoting in yaml-root-key format (locale as root)", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    const yamlInput = `en:
  "greeting": "Hello!"
  message: Welcome`;

    await loader.pull("en", yamlInput);

    const data = {
      en: {
        greeting: "¡Hola!",
        message: "Bienvenido",
      },
    };

    const result = await loader.push("en", data, yamlInput);

    // The quoted key and value should remain quoted
    expect(result).toContain('"greeting":');
    expect(result).toContain('"¡Hola!"');

    // The unquoted key and value should remain unquoted
    expect(result).toMatch(/\smessage:\s/); // message key unquoted
    expect(result).not.toContain('"message"');
    expect(result).toMatch(/message:\s*Bienvenido/); // value unquoted
  });

  it("push should preserve quoting across different locale keys", async () => {
    const loader = createYamlLoader();
    loader.setDefaultLocale("en");

    // Source has 'en:' root key
    const yamlInput = `en:
  navigation:
    home: "Home"
  forms:
    "message_label": "Message"`;

    await loader.pull("en", yamlInput);

    // Target has 'es:' root key (different from source!)
    const data = {
      es: {
        navigation: {
          home: "Inicio",
        },
        forms: {
          message_label: "Mensaje",
        },
      },
    };

    const result = await loader.push("es", data, yamlInput);

    // Quoting should be preserved despite different root keys (en vs es)
    expect(result).toContain('home: "Inicio"');
    expect(result).toContain('"message_label":');
    expect(result).toContain('"Mensaje"');
  });
});
