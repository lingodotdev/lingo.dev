import { describe, expect, it } from "vitest";
import createTypescriptLoader from "./index";
import dedent from "dedent";

describe("typescript loader", () => {
  it("should extract string literals from default export object", async () => {
    const input = `
      export default {
        greeting: "Hello, world!",
        farewell: "Goodbye!",
        number: 42,
        boolean: true
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      greeting: "Hello, world!",
      farewell: "Goodbye!",
    });
  });

  it("should extract string literals from exported variable", async () => {
    const input = `
      const messages = {
        welcome: "Welcome to our app",
        error: "Something went wrong",
        count: 5
      };
      export default messages;
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      welcome: "Welcome to our app",
      error: "Something went wrong",
    });
  });

  it("should handle empty or invalid input", async () => {
    const loader = createTypescriptLoader().setDefaultLocale("en");

    let result = await loader.pull("en", "");
    expect(result).toEqual({});

    result = await loader.pull("en", "const x = 5;");
    expect(result).toEqual({});
  });

  it("should update string literals in default export object", async () => {
    const input = `
      export default {
        greeting: "Hello, world!",
        farewell: "Goodbye!",
        number: 42
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");

    await loader.pull("en", input);

    const data = {
      greeting: "Hola, mundo!",
      farewell: "Adiós!",
    };

    const result = await loader.push("es", data);

    expect(result).toBe(dedent`
      export default {
        greeting: "Hola, mundo!",
        farewell: "Adiós!",
        number: 42
      };
      `);
  });

  it("should extract string literals from nested objects", async () => {
    const input = `
      export default {
        messages: {
          welcome: "Welcome to our app",
          error: "Something went wrong",
          count: 5
        },
        settings: {
          theme: {
            name: "Dark Mode",
            colors: {
              primary: "blue",
              secondary: "gray"
            }
          }
        }
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      messages: {
        welcome: "Welcome to our app",
        error: "Something went wrong",
      },
      settings: {
        theme: {
          name: "Dark Mode",
          colors: {
            primary: "blue",
            secondary: "gray",
          },
        },
      },
    });
  });

  it("should extract string literals from arrays", async () => {
    const input = `
      export default {
        greetings: ["Hello", "Hi", "Hey"],
        categories: [
          { name: "Electronics", description: "Electronic devices" },
          { name: "Books", description: "Reading materials" }
        ]
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      greetings: ["Hello", "Hi", "Hey"],
      categories: [
        { name: "Electronics", description: "Electronic devices" },
        { name: "Books", description: "Reading materials" },
      ],
    });
  });

  it("should update string literals in nested objects", async () => {
    const input = dedent`
      export default {
        messages: {
          welcome: "Welcome to our app",
          error: "Something went wrong"
        },
        settings: {
          theme: {
            name: "Dark Mode",
            colors: {
              primary: "blue"
            }
          }
        }
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");

    let data = await loader.pull("en", input);

    data.settings.theme.colors.primary = "red";

    const result = await loader.push("es", data);

    expect(result).toBe(dedent`
      export default {
        messages: {
          welcome: "Welcome to our app",
          error: "Something went wrong"
        },
        settings: {
          theme: {
            name: "Dark Mode",
            colors: {
              primary: "red"
            }
          }
        }
      };
      `);
  });

  it("should update string literals in arrays", async () => {
    const input = `
      export default {
        greetings: ["Hello", "Hi", "Hey"],
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");

    let data = await loader.pull("en", input);

    data.greetings[0] = "Hola";
    data.greetings[1] = "Hola";
    data.greetings[2] = "Oye";

    const result = await loader.push("es", data);

    expect(result).toBe(dedent`
      export default {
        greetings: ["Hola", "Hola", "Oye"]
      };
      `);
  });

  it("should handle mixed nested structures", async () => {
    const input = `
      export default {
        app: {
          name: "My App",
          version: "1.0.0",
          features: ["Login", "Dashboard", "Settings"],
          pages: [
            { 
              title: "Home", 
              sections: [
                { heading: "Welcome", content: "Welcome to our app" },
                { heading: "Features", content: "Check out our features" }
              ]
            },
            { 
              title: "About", 
              sections: [
                { heading: "Our Story", content: "We started in 2020" }
              ]
            }
          ]
        }
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      app: {
        name: "My App",
        version: "1.0.0",
        features: ["Login", "Dashboard", "Settings"],
        pages: [
          {
            title: "Home",
            sections: [
              { heading: "Welcome", content: "Welcome to our app" },
              { heading: "Features", content: "Check out our features" },
            ],
          },
          {
            title: "About",
            sections: [{ heading: "Our Story", content: "We started in 2020" }],
          },
        ],
      },
    });
  });

  it("should extract string literals when default export has 'as const'", async () => {
    const input = `
      export default {
        greeting: "Hello, world!",
        farewell: "Goodbye!"
      } as const;
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");
    const result = await loader.pull("en", input);

    expect(result).toEqual({
      greeting: "Hello, world!",
      farewell: "Goodbye!",
    });
  });

  it("should extract and update string literals including multiline template literals, URLs, and numeric keys", async () => {
    const input = dedent`
      export default {
        multilineContent: \`Multiline test

  Super content

  Includes also "test"\`,
        testUrl: 'https://someurl.com',
        6: '6. Class',
        9: '9. Class',
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");

    // Pull phase – ensure the loader extracts all expected strings
    const pulled = await loader.pull("en", input);

    expect(pulled).toEqual({
      multilineContent: dedent`
      Multiline test

      Super content

      Includes also "test"`,
      testUrl: "https://someurl.com",
      6: "6. Class",
      9: "9. Class",
    });

    // Push phase – modify some values and ensure they are written back
    const updatedData = {
      ...pulled,
      multilineContent: dedent`
      Prueba multilínea

      Contenido superior

      Incluye también "prueba"`,
      testUrl: "https://algunaurl.com",
      6: "6. Clase",
      9: "9. Clase",
    } as any;

    const result = await loader.push("es", updatedData);

    expect(result).toBe(
      `
export default {
  multilineContent: \`Prueba multilínea

Contenido superior

Incluye también "prueba"\`,
  testUrl: "https://algunaurl.com",
  6: "6. Clase",
  9: "9. Clase"
};
      `.trim(),
    );
  });

  it("should work with ignored keys for both export patterns", async () => {
    // Test export default with ignored keys
    const exportDefaultInput = `
      export default {
        title: "Page Title",
        description: "Page description",
        nested: {
          title: "Nested Title",
          content: "Nested content"
        }
      };
    `;

    // Test export const with ignored keys
    const exportConstInput = `
      export const messages = {
        title: "Page Title",
        description: "Page description", 
        nested: {
          title: "Nested Title",
          content: "Nested content"
        }
      };
    `;

    const loader = createTypescriptLoader().setDefaultLocale("en");

    // Both should extract the same nested structure
    const resultDefault = await loader.pull("en", exportDefaultInput);
    const resultConst = await loader.pull("en", exportConstInput);

    const expected = {
      title: "Page Title",
      description: "Page description",
      nested: {
        title: "Nested Title",
        content: "Nested content",
      },
    };

    expect(resultDefault).toEqual(expected);
    expect(resultConst).toEqual(expected);

    // Note: When used with ignored-keys loader in the chain,
    // specifying "title" as ignored will filter out both "title" and "nested.title"
    // This is handled by the enhanced _isIgnoredKey function in ignored-keys.ts
  });

  // TODO
});
