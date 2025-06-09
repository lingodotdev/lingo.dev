import { describe, it, expect } from "vitest";
import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import {
  collectJsxScopes,
  getJsxScopes,
  hasJsxScopeAttribute,
  getJsxScopeAttribute,
} from "./jsx-scope";

function parseJSX(code: string): t.File {
  return parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
}

function getJSXElementPaths(ast: t.File): NodePath<t.JSXElement>[] {
  const paths: NodePath<t.JSXElement>[] = [];
  traverse(ast, {
    JSXElement(path) {
      paths.push(path);
    },
  });
  return paths;
}

describe("jsx-scope utils", () => {
  describe("collectJsxScopes", () => {
    it("collects elements with data-jsx-scope attribute", () => {
      const ast = parseJSX(`
        <div>
          <span data-jsx-scope="foo">A</span>
          <b>B</b>
          <section data-jsx-scope="bar">C</section>
        </div>
      `);
      const scopes = collectJsxScopes(ast);
      expect(scopes).toHaveLength(2);
      expect(getJsxScopeAttribute(scopes[0])).toBe("foo");
      expect(getJsxScopeAttribute(scopes[1])).toBe("bar");
    });
    it("returns empty if no elements have data-jsx-scope", () => {
      const ast = parseJSX(`<div><span>A</span></div>`);
      const scopes = collectJsxScopes(ast);
      expect(scopes).toHaveLength(0);
    });
  });

  describe("getJsxScopes", () => {
    it("finds elements with non-empty JSXText children and no non-empty siblings", () => {
      const ast = parseJSX(`
        <div>
          <span>Text</span>
          <b></b>
          <section>  </section>
          <div>
            <span>Text</span> and <b>Bold</b>
          </div>
          <p>
            <span>Text</span> here
          </p>
        </div>
      `);
      const scopes = getJsxScopes(ast);
      const scopeNames = scopes.map(
        (scope) => (scope.node.openingElement.name as t.JSXIdentifier).name,
      );
      expect(scopes).toHaveLength(3);
      expect(scopeNames).toEqual(["span", "div", "p"]);
    });
    it("skips LingoProvider component", () => {
      const ast = parseJSX(`
        <div>
          <LingoProvider>ShouldSkip</LingoProvider>
          <span>Text</span>
        </div>
      `);
      const scopes = getJsxScopes(ast);
      expect(scopes).toHaveLength(1);
      expect((scopes[0].node.openingElement.name as t.JSXIdentifier).name).toBe(
        "span",
      );
    });
  });

  describe("hasJsxScopeAttribute", () => {
    it("returns true if data-jsx-scope attribute exists", () => {
      const ast = parseJSX(`<div data-jsx-scope="foo">A</div>`);
      const [path] = getJSXElementPaths(ast);
      expect(hasJsxScopeAttribute(path)).toBe(true);
    });
    it("returns false if data-jsx-scope attribute does not exist", () => {
      const ast = parseJSX(`<div>A</div>`);
      const [path] = getJSXElementPaths(ast);
      expect(hasJsxScopeAttribute(path)).toBe(false);
    });
  });

  describe("getJsxScopeAttribute", () => {
    it("returns the value of data-jsx-scope attribute", () => {
      const ast = parseJSX(`<div data-jsx-scope="bar">B</div>`);
      const [path] = getJSXElementPaths(ast);
      expect(getJsxScopeAttribute(path)).toBe("bar");
    });
    it("returns undefined if data-jsx-scope attribute does not exist", () => {
      const ast = parseJSX(`<div>B</div>`);
      const [path] = getJSXElementPaths(ast);
      expect(getJsxScopeAttribute(path)).toBeUndefined();
    });
  });
});
