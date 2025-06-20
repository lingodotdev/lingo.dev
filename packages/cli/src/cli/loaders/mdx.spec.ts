import { describe, it, expect } from "vitest";
import {
  createMdxFormatLoader,
  createDoubleSerializationLoader,
  createMdxStructureLoader,
} from "./mdx";

// Helper to traverse mdast tree
function traverse(node: any, visitor: (n: any) => void) {
  visitor(node);
  if (node && Array.isArray(node.children)) {
    node.children.forEach((child: any) => traverse(child, visitor));
  }
}

describe("mdx loader", () => {
  const mdxSample = `\n# Heading\n\nHere is some code:\n\n\u0060\u0060\u0060js\nconsole.log("hello");\n\u0060\u0060\u0060\n\nSome inline \u0060world\u0060 and more text.\n`;

  describe("createMdxFormatLoader", () => {
    it("should strip values of code and inlineCode nodes on pull", async () => {
      const loader = createMdxFormatLoader();
      loader.setDefaultLocale("en");

      const ast = await loader.pull("en", mdxSample);

      // Assert that every code or inlineCode node now has an empty value
      traverse(ast, (node) => {
        if (node?.type === "code" || node?.type === "inlineCode") {
          expect(node.value).toBe("");
        }
      });
    });

    it("should preserve original code & inlineCode content on push when incoming value is empty", async () => {
      const loader = createMdxFormatLoader();
      loader.setDefaultLocale("en");

      const pulledAst = await loader.pull("en", mdxSample);
      const output = await loader.push("es", pulledAst);

      // The serialized output must still contain the original code and inline code content
      expect(output).toContain('console.log("hello");');
      expect(output).toMatch(/`world`/);
    });
  });

  describe("createDoubleSerializationLoader", () => {
    it("should return the same content on pull", async () => {
      const loader = createDoubleSerializationLoader();
      loader.setDefaultLocale("en");
      const input = "# Hello";
      const output = await loader.pull("en", input);
      expect(output).toBe(input);
    });

    it("should reformat markdown on push", async () => {
      const loader = createDoubleSerializationLoader();
      loader.setDefaultLocale("en");
      const input = "#  Hello   ";
      const expectedOutput = "# Hello\n";
      await loader.pull("en", input);
      const output = await loader.push("en", input);
      expect(output).toBe(expectedOutput);
    });
  });

  describe("createMdxStructureLoader", () => {
    it("should extract values from keys ending with /value on pull", async () => {
      const loader = createMdxStructureLoader();
      loader.setDefaultLocale("en");
      const input = {
        "title/value": "Hello",
        "title/type": "string",
        "content/value": "Some content",
        unrelated: "field",
      };
      const output = await loader.pull("en", input);
      expect(output).toEqual({
        "title/value": "Hello",
        "content/value": "Some content",
      });
    });

    it("should merge translated data with non-value keys on push, should not include untranslated keys from originalInput", async () => {
      const loader = createMdxStructureLoader();
      loader.setDefaultLocale("en");
      const originalInput = {
        "title/value": "Hello",
        "title/type": "string",
        "content/value": "Some content",
        "untranslated/value": "untranslated",
        unrelated: "field",
      };
      await loader.pull("en", originalInput);
      const translatedData = {
        "title/value": "Hola",
        "content/value": "Algun contenido",
      };
      const output = await loader.push("es", translatedData);
      expect(output).toEqual({
        "title/value": "Hola",
        "title/type": "string",
        "content/value": "Algun contenido",
        unrelated: "field",
      });
    });
  });
});
