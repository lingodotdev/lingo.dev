import { describe, expect, it } from "vitest";
import createTypescriptLoader from ".";

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
      "messages/welcome": "Welcome to our app",
      "messages/error": "Something went wrong",
      "settings/theme/name": "Dark Mode",
      "settings/theme/colors/primary": "blue",
      "settings/theme/colors/secondary": "gray",
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
      "greetings/0": "Hello",
      "greetings/1": "Hi",
      "greetings/2": "Hey",
      "categories/0/name": "Electronics",
      "categories/0/description": "Electronic devices",
      "categories/1/name": "Books",
      "categories/1/description": "Reading materials",
    });
  });

  it("should update string literals in nested objects", async () => {
    const input = `
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

    await loader.pull("en", input);

    const data = {
      "messages/welcome": "Bienvenido a nuestra aplicación",
      "messages/error": "Algo salió mal",
      "settings/theme/name": "Modo Oscuro",
      "settings/theme/colors/primary": "azul",
    };

    const result = await loader.push("es", data);

    const resultStr = JSON.stringify(result);
    expect(resultStr).toContain("Bienvenido a nuestra aplicaci");
    expect(resultStr).toContain("Algo sali");
    expect(resultStr).toContain("Modo Oscuro");
    expect(resultStr).toContain("azul");
  });

  it("should update string literals in arrays", async () => {
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

    await loader.pull("en", input);

    const data = {
      "greetings/0": "Hola",
      "greetings/1": "Hola",
      "greetings/2": "Oye",
      "categories/0/name": "Electrónica",
      "categories/0/description": "Dispositivos electrónicos",
      "categories/1/name": "Libros",
      "categories/1/description": "Materiales de lectura",
    };

    const result = await loader.push("es", data);

    const resultStr = JSON.stringify(result);
    expect(resultStr).toContain("Hola");
    expect(resultStr).toContain("Oye");
    expect(resultStr).toContain("Electr");
    expect(resultStr).toContain("Dispositivos electr");
    expect(resultStr).toContain("Libros");
    expect(resultStr).toContain("Materiales de lectura");
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
      "app/name": "My App",
      "app/version": "1.0.0",
      "app/features/0": "Login",
      "app/features/1": "Dashboard",
      "app/features/2": "Settings",
      "app/pages/0/title": "Home",
      "app/pages/0/sections/0/heading": "Welcome",
      "app/pages/0/sections/0/content": "Welcome to our app",
      "app/pages/0/sections/1/heading": "Features",
      "app/pages/0/sections/1/content": "Check out our features",
      "app/pages/1/title": "About",
      "app/pages/1/sections/0/heading": "Our Story",
      "app/pages/1/sections/0/content": "We started in 2020",
    });
  });
});
