import { describe, it, expect } from "vitest";
import { extractJsxContent } from "./jsx-content";
import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { parse } from "@babel/parser";

describe("Whitespace Issue Test", () => {
  function parseJSX(code: string): t.File {
    return parse(code, {
      plugins: ["jsx"],
      sourceType: "module",
    });
  }

  function getJSXElementPath(code: string): NodePath<t.JSXElement> {
    const ast = parseJSX(code);
    let result: NodePath<t.JSXElement>;

    traverse(ast, {
      JSXElement(path) {
        result = path;
        path.stop();
      },
    });

    return result!;
  }

  it("should preserve leading space in nested elements", () => {
    const path = getJSXElementPath(`
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Hello World
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"> From Lingo.dev Compiler</span>
      </h1>
    `);

    const content = extractJsxContent(path);
    console.log("Extracted content:", JSON.stringify(content));

    // Let's also check the raw JSX structure to understand what's happening
    let jsxTexts: string[] = [];
    path.traverse({
      JSXText(textPath) {
        jsxTexts.push(JSON.stringify(textPath.node.value));
      },
    });
    console.log("JSXText nodes found:", jsxTexts);

    // The span should have " From Lingo.dev Compiler" with the leading space
    expect(content).toContain(
      "<element:span> From Lingo.dev Compiler</element:span>",
    );
  });

  it("should handle explicit whitespace correctly", () => {
    const path = getJSXElementPath(`
      <div>
        Hello{" "}
        <span> World</span>
      </div>
    `);

    const content = extractJsxContent(path);
    console.log("Explicit whitespace test:", JSON.stringify(content));

    // Should preserve both the explicit space and the leading space in span
    expect(content).toContain("Hello <element:span> World</element:span>");
  });

  it("should preserve space before nested bold element like in HeroSubtitle", () => {
    const path = getJSXElementPath(`
      <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
        Localize your React app in every language in minutes. Scale to millions
        <b> from day one</b>.
      </p>
    `);

    const content = extractJsxContent(path);
    console.log("HeroSubtitle test content:", JSON.stringify(content));

    // Let's also check the raw JSX structure
    let jsxTexts: string[] = [];
    path.traverse({
      JSXText(textPath) {
        jsxTexts.push(JSON.stringify(textPath.node.value));
      },
    });
    console.log("HeroSubtitle JSXText nodes found:", jsxTexts);

    // The bold element should have " from day one" with the leading space
    expect(content).toContain("<element:b> from day one</element:b>");
    // The full content should preserve the space between "millions" and the bold element
    expect(content).toContain("millions <element:b> from day one</element:b>");
  });
});
