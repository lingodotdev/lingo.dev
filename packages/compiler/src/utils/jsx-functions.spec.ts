import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import { getJsxFunctions } from "./jsx-functions";
import { describe, expect, it } from "vitest";

function parseJSX(code: string) {
  return parse(code, {
    plugins: ["jsx"],
    sourceType: "module",
  });
}

describe("getJsxFunctions", () => {
  it("extracts simple function calls", () => {
    const ast = parseJSX("<div>{getName()}</div>");
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result).code).toBe('{\n  "getName": [getName()]\n}');
  });

  it("extracts function calls with arguments", () => {
    const ast = parseJSX("<div>{getName(user, 123)}</div>");
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result).code).toBe(
      '{\n  "getName": [getName(user, 123)]\n}',
    );
  });

  it("extracts multiple function calls", () => {
    const ast = parseJSX("<div>{getName(user)} {getCount()}</div>");
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result).code).toBe(
      '{\n  "getName": [getName(user)],\n  "getCount": [getCount()]\n}',
    );
  });

  it("ignores non-function expressions", () => {
    const ast = parseJSX("<div>{user.name} {getCount()}</div>");
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result).code).toBe('{\n  "getCount": [getCount()]\n}');
  });

  it("extracts function with chained names", () => {
    const ast = parseJSX(
      "<div>{getCount()} {user.details.products.items.map((item) => item.value).filter(value => value > 0)}</div>",
    );
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe(
      '{\n  "getCount": [getCount()],\n  "user.details.products.items.map": [user.details.products.items.map(item => item.value).filter(value => value > 0)]\n}',
    );
  });

  it("extracts multiple usages of the same function", () => {
    const ast = parseJSX(
      "<div>{getCount(foo)} is more than {getCount(bar)} but less than {getCount(baz)}</div>",
    );
    let result;

    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe(
      '{\n  "getCount": [getCount(foo), getCount(bar), getCount(baz)]\n}',
    );
  });

  it("should extract function calls on classes with 'new' keyword", () => {
    const ast = parseJSX("<div>&copy; {new Date().getFullYear()} vitest</div>");
    let result;
    traverse(ast, {
      JSXElement(path) {
        result = getJsxFunctions(path);
        path.stop();
      },
    });

    expect(generate(result!).code).toBe(
      '{\n  "Date.getFullYear": [new Date().getFullYear()]\n}',
    );
  });
});
