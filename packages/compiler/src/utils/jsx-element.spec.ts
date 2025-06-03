import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { parse } from "@babel/parser";
import { getJsxElementName, getNestedJsxElements } from "./jsx-element";
import { describe, it, expect } from "vitest";
import generate from "@babel/generator";

function parseJSX(code: string): t.File {
  return parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
}

function getJSXElementPath(code: string): NodePath<t.JSXElement> {
  const ast = parseJSX(code);
  let elementPath: NodePath<t.JSXElement> | null = null;

  traverse(ast, {
    JSXElement(path) {
      elementPath = path;
      path.stop();
    },
  });

  if (!elementPath) {
    throw new Error("No JSX element found in the code");
  }

  return elementPath;
}

describe("JSX Element Utils", () => {
  describe("getJsxElementName", () => {
    it("should return element name for simple elements", () => {
      const path = getJSXElementPath("<div>Hello</div>");
      expect(getJsxElementName(path)).toBe("div");
    });

    it("should return element name for custom elements", () => {
      const path = getJSXElementPath("<MyComponent>Hello</MyComponent>");
      expect(getJsxElementName(path)).toBe("MyComponent");
    });
  });

  describe("getNestedJsxElements", () => {
    it("should transform single nested element into a function", () => {
      const path = getJSXElementPath("<div>Hello <b>world</b></div>");
      const result = getNestedJsxElements(path);

      expect(result.elements).toHaveLength(1);
      const generatedCode = generate(result.elements[0]).code;
      expect(generatedCode).toBe(`({
  children
}) => <b>{children}</b>`);
    });

    it("should handle multiple nested elements", () => {
      const path = getJSXElementPath(
        "<div><strong>Hello</strong> and <em>welcome</em> to <code>my app</code></div>",
      );
      const result = getNestedJsxElements(path);

      expect(result.elements).toHaveLength(3);
      const generatedCodes = result.elements.map((fn) => generate(fn).code);
      expect(generatedCodes).toEqual([
        `({
  children
}) => <strong>{children}</strong>`,
        `({
  children
}) => <em>{children}</em>`,
        `({
  children
}) => <code>{children}</code>`,
      ]);
    });

    it("should handle deeply nested elements", () => {
      const path = getJSXElementPath(
        "<div><a>Hello <strong>wonderful <i><b>very</b>nested</i></strong> world</a> of the <u>universe</u></div>",
      );
      const result = getNestedJsxElements(path);

      // expect(result).toHaveLength(4);
      const generatedCodes = result.elements.map((fn) => generate(fn).code);
      expect(generatedCodes).toEqual([
        `({
  children
}) => <a>{children}</a>`,
        `({
  children
}) => <strong>{children}</strong>`,
        `({
  children
}) => <i>{children}</i>`,
        `({
  children
}) => <b>{children}</b>`,
        `({
  children
}) => <u>{children}</u>`,
      ]);
    });

    it("should return empty array for elements with no nested JSX", () => {
      const path = getJSXElementPath("<div>Hello world</div>");
      const result = getNestedJsxElements(path);
      expect(result.elements).toHaveLength(0);
    });
  });
});
