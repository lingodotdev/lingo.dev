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

    expect(result).toContain('greeting: "Hola, mundo!"');
    expect(result).toContain('farewell: "Adi');
    expect(result).toContain("number: 42");
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
});
