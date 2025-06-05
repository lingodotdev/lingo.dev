import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { getJsxExpressions } from "./jsx-expressions";
import { describe, expect, it } from "vitest";
import * as t from "@babel/types";

function parseJSX(code: string) {
  return parse(code, {
    plugins: ["jsx"],
    sourceType: "module",
  });
}

describe("getJsxExpressions", () => {
  it("extracts simple expressions", () => {
    const ast = parseJSX("<div>{count + 1}</div>");
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe("[count + 1]");
  });

  it("extracts multiple expressions", () => {
    const ast = parseJSX('<div>{count * 2} items in {category + "foo"}</div>');
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe('[count * 2, category + "foo"]');
  });

  it("extracts complex expressions", () => {
    const ast = parseJSX('<div>{isAdmin ? "Admin" : user.role}</div>');
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe('[isAdmin ? "Admin" : user.role]');
  });

  it("skips variables and member expressions", () => {
    const ast = parseJSX("<div>{count} items in {category.type}</div>");
    let result: t.ArrayExpression | undefined;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe("[]");
  });

  it("skips function calls", () => {
    const ast = parseJSX("<div>{getName(user)} has {getCount()} items</div>");
    let result: t.ArrayExpression | undefined;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe("[]");
  });

  it("extracts only expressions while skipping variables and functions", () => {
    const ast = parseJSX(
      '<div>{count + 1} by {user.name}, processed at {new Date().getTime() > 1000 ? "late" : "early"}</div>',
    );
    let result: t.ArrayExpression | undefined;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxExpressions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe(
      '[count + 1, new Date().getTime() > 1000 ? "late" : "early"]',
    );
  });
});
