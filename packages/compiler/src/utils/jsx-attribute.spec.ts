import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { parse } from "@babel/parser";
import {
  getJsxAttributeValue,
  setJsxAttributeValue,
  getJsxAttributesMap,
} from "./jsx-attribute";
import { describe, it, expect } from "vitest";
import generate from "@babel/generator";

describe("JSX Attribute Value Utils", () => {
  function parseJSX(code: string): t.File {
    return parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  }

  function generateCode(ast: t.Node): string {
    return generate(ast).code;
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

  describe("getJsxAttributeValue", () => {
    it("should return undefined for non-existent attribute", () => {
      const path = getJSXElementPath("<div className='test'></div>");
      const value = getJsxAttributeValue(path, "id");
      expect(value).toBeUndefined();
    });

    it("should return string value for string attribute", () => {
      const path = getJSXElementPath("<div className='test'></div>");
      const value = getJsxAttributeValue(path, "className");
      expect(value).toBe("test");
    });

    it("should return boolean value for boolean attribute", () => {
      const path = getJSXElementPath("<div disabled></div>");
      const value = getJsxAttributeValue(path, "disabled");
      expect(value).toBe(true);
    });

    it("should return number value for numeric attribute", () => {
      const path = getJSXElementPath("<div tabIndex={5}></div>");
      const value = getJsxAttributeValue(path, "tabIndex");
      expect(value).toBe(5);
    });
  });

  describe("setJsxAttributeValue", () => {
    it("should add a new string attribute", () => {
      const path = getJSXElementPath("<div></div>");
      setJsxAttributeValue(path, "className", "test");

      const code = generateCode(path.node);

      expect(code).toBe('<div className="test"></div>');
    });

    it("should update an existing attribute", () => {
      const path = getJSXElementPath("<div className='old'></div>");
      setJsxAttributeValue(path, "className", "new");

      const code = generateCode(path.node);

      expect(code).toBe('<div className="new"></div>');
    });

    it("should add a boolean attribute", () => {
      const path = getJSXElementPath("<div></div>");
      setJsxAttributeValue(path, "disabled", true);

      const code = generateCode(path.node);

      expect(code).toBe("<div disabled={true}></div>");
    });

    it("should add a boolean attribute with null for presence-only", () => {
      const path = getJSXElementPath("<div></div>");
      setJsxAttributeValue(path, "disabled", null);

      const code = generateCode(path.node);

      expect(code).toBe("<div disabled></div>");
    });

    it("should handle numeric attributes", () => {
      const path = getJSXElementPath("<div></div>");
      setJsxAttributeValue(path, "tabIndex", 5);

      const code = generateCode(path.node);

      expect(code).toBe("<div tabIndex={5}></div>");
    });
  });

  describe("getAttributesMap", () => {
    it("should return an empty object for elements with no attributes", () => {
      const path = getJSXElementPath("<div></div>");
      const attrs = getJsxAttributesMap(path);
      expect(attrs).toEqual({});
    });

    it("should return all attributes as a map", () => {
      const path = getJSXElementPath(
        "<div className='test' id='main' disabled tabIndex={5}></div>",
      );
      const attrs = getJsxAttributesMap(path);

      expect(attrs).toEqual({
        className: "test",
        id: "main",
        disabled: true,
        tabIndex: 5,
      });
    });

    it("should return null for complex expressions", () => {
      const path = getJSXElementPath(
        "<div data-value={{complex: 'object'}}></div>",
      );
      const attrs = getJsxAttributesMap(path);

      expect(attrs).toHaveProperty("data-value");
      expect(attrs["data-value"]).toBeNull();
    });
  });
});
