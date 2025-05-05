import { describe, expect, it } from "vitest";
import createTypescriptLoader from "./typescript";

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
      farewell: "Goodbye!"
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
      error: "Something went wrong"
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
      farewell: "Adiós!"
    };
    
    const result = await loader.push("es", data);
    
    expect(result).toContain("greeting: \"Hola, mundo!\"");
    expect(result).toContain("farewell: \"Adi");
    expect(result).toContain("number: 42");
  });
});
