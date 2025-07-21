import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { parse } from "@babel/parser";
import { extractJsxContent } from "./jsx-content";
import { describe, it, expect } from "vitest";

describe("JSX Content Utils", () => {
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

  describe("extractJsxContent", () => {
    describe("plain", () => {
      it("should extract plain text content from JSX element", () => {
        const path = getJSXElementPath("<div>Hello world</div>");
        const content = extractJsxContent(path);
        expect(content).toBe("Hello world");
      });

      it("should return empty string for elements with no content", () => {
        const path = getJSXElementPath("<div></div>");
        const content = extractJsxContent(path);
        expect(content).toBe("");
      });
    });

    describe("whitespaces", () => {
      it("should handle multiple whitespaces", () => {
        const path = getJSXElementPath("<div>  Hello   world    </div>");
        const content = extractJsxContent(path);
        expect(content).toBe("Hello world");
      });

      it("should handle multi-line content with whitespaces", () => {
        const path = getJSXElementPath("<div>\n  Hello\n  crazy  world!</div>");
        const content = extractJsxContent(path);
        expect(content).toBe("Hello crazy world!");
      });

      it("should handle whitespaces between elements", () => {
        const path = getJSXElementPath(
          "<div>\n  Hello <strong>crazy</strong>  world! <Icons.Rocket /></div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "Hello <element:strong>crazy</element:strong> world! <element:Icons.Rocket></element:Icons.Rocket>",
        );
      });

      it("should handle explicit whitespaces", () => {
        const path = getJSXElementPath(
          '<div>\n  Hello{" "}<strong>crazy {" "}world</strong></div>',
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "Hello <element:strong>crazy  world</element:strong>",
        );
      });

      it("should handle new lines between elements and explicit whitespaces", () => {
        const path = getJSXElementPath(
          '<div>\n  Hello \n  <strong>crazy</strong>\n  <em>world</em>{" "}\n<u>forever</u></div>',
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "Hello<element:strong>crazy</element:strong><element:em>world</element:em> <element:u>forever</element:u>",
        );
      });
    });

    describe("variables", () => {
      it("should extract content with simple identifiers like {count}", () => {
        const path = getJSXElementPath("<div>Items: {count}</div>");
        const content = extractJsxContent(path);
        expect(content).toBe("Items: {count}");
      });

      it("should handle multiple expressions", () => {
        const path = getJSXElementPath(
          "<div>{count} items in {category}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe("{count} items in {category}");
      });

      it("should handle nested elements", () => {
        const path = getJSXElementPath(
          "<div>Total: <strong>{count}</strong> items</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "Total: <element:strong>{count}</element:strong> items",
        );
      });

      it("should handle object variables", () => {
        const path = getJSXElementPath(
          "<div>User: <strong>{user.profile.name}</strong> has {user.private.details.items.count} items</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "User: <element:strong>{user.profile.name}</element:strong> has {user.private.details.items.count} items",
        );
      });

      it("should handle dynamic variables", () => {
        const path = getJSXElementPath(
          "<div>User <strong>{data[currentUserType][currentUserIndex].name}</strong> has {items.counts[type]} items of type <em>{typeNames[type]}</em></div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "User <element:strong>{data[currentUserType][currentUserIndex].name}</element:strong> has {items.counts[type]} items of type <element:em>{typeNames[type]}</element:em>",
        );
      });
    });

    describe("nested elements", () => {
      it("should handle multiple nested elements with correct indices", () => {
        const path = getJSXElementPath(
          "<div><strong>Hello</strong> and <em>welcome</em> to <code>my app</code></div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<element:strong>Hello</element:strong> and <element:em>welcome</element:em> to <element:code>my app</element:code>",
        );
      });

      it("should handle deeply nested elements", () => {
        const path = getJSXElementPath(
          "<div><a>Hello <strong>wonderful <i><b>very</b>nested</i></strong> world</a> of the <u>universe</u></div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<element:a>Hello <element:strong>wonderful <element:i><element:b>very</element:b>nested</element:i></element:strong> world</element:a> of the <element:u>universe</element:u>",
        );
      });
    });

    describe("function calls", () => {
      it("should extract function calls with placeholders", () => {
        const path = getJSXElementPath(
          "<div>Hello {getName(user)} you have {getCount()} items</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "Hello <function:getName/> you have <function:getCount/> items",
        );
      });

      it("should handle mixed function calls and variables", () => {
        const path = getJSXElementPath(
          "<div>{user.name} called {getFunction()} and {getData(user.id)}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "{user.name} called <function:getFunction/> and <function:getData/>",
        );
      });

      it("should handle nested elements with function calls and variables", () => {
        const path = getJSXElementPath(
          '<div><strong>{formatName(getName(user))}</strong> has <a href="#"><em>{getCount()}</em> unread messages</a> and <em>{count} in total</em></div>',
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<element:strong><function:formatName/></element:strong> has <element:a><element:em><function:getCount/></element:em> unread messages</element:a> and <element:em>{count} in total</element:em>",
        );
      });

      it("should handle functions with chained names", () => {
        const path = getJSXElementPath(
          "<div>{getCount()} items: {user.details.products.items.map((item) => item.value).filter(value => value > 0)}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<function:getCount/> items: <function:user.details.products.items.map/>",
        );
      });

      it("should handle multiple usages of the same function", () => {
        const path = getJSXElementPath(
          "<div>{getCount(foo)} is more than {getCount(bar)}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<function:getCount/> is more than <function:getCount/>",
        );
      });

      it("should handle function calls on classes with 'new' keyword", () => {
        const path = getJSXElementPath(
          "<div>&copy; {new Date().getFullYear()} vitest</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe("© <function:Date.getFullYear/> vitest");
      });
    });

    describe("expressions", () => {
      it("should handle mixed content with expressions and text", () => {
        const path = getJSXElementPath(
          "<div>You have {count} new messages and {count * 2} total items.</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "You have {count} new messages and <expression/> total items.",
        );
      });

      it("should handle complex expressions", () => {
        const path = getJSXElementPath(
          "<div>{isAdmin ? 'Admin' : 'User'} - {items.filter(i => i.active).length > 0}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe("<expression/> - <expression/>");
      });

      it("should handle mixed variables, functions and expressions", () => {
        const path = getJSXElementPath(
          "<div>{count + 1} by {user.name}, processed by {getName()} {length > 0}</div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<expression/> by {user.name}, processed by <function:getName/> <expression/>",
        );
      });

      it("should handle expressions in nested elements", () => {
        const path = getJSXElementPath(
          "<div><p>Count: {items.length + offset}</p><span>Active: {items.filter(i => i.active).length > 0}</span></div>",
        );
        const content = extractJsxContent(path);
        expect(content).toBe(
          "<element:p>Count: <expression/></element:p><element:span>Active: <expression/></element:span>",
        );
      });
    });
  });
});
