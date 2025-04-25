import { describe, it, expect } from "vitest";
import { createMdxFormatLoader } from "./mdx";

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
});
