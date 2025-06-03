import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";
import { parse } from "@babel/parser";
import { getJsxVariables } from "./jsx-variables";
import { describe, it, expect } from "vitest";

describe("JSX Variables Utils", () => {
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

  describe("getJsxVariables", () => {
    it("should extract single variable from JSX element", () => {
      const path = getJSXElementPath(
        "<div>You have {count} new messages.</div>",
      );
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(1);

      const property = result.properties[0] as t.ObjectProperty;
      expect((property.key as t.StringLiteral).value).toBe("count");
      expect((property.value as t.Identifier).name).toBe("count");
    });

    it("should extract multiple variables from JSX element", () => {
      const path = getJSXElementPath("<div>{count} items in {category}</div>");
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(2);

      const propertyNames = result.properties
        .map((prop) => (prop as t.ObjectProperty).key as t.StringLiteral)
        .map((key) => key.value);

      expect(propertyNames).toContain("count");
      expect(propertyNames).toContain("category");
    });

    it("should extract variables from nested elements", () => {
      const path = getJSXElementPath(
        "<div>Total: <strong>{count}</strong> in <span>{category}</span></div>",
      );
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(2);

      const propertyNames = result.properties
        .map((prop) => (prop as t.ObjectProperty).key as t.StringLiteral)
        .map((key) => key.value);

      expect(propertyNames).toContain("count");
      expect(propertyNames).toContain("category");
    });

    it("should return empty object expression when no variables present", () => {
      const path = getJSXElementPath("<div>Hello world</div>");
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(0);
    });

    it("should handle duplicate variables by including them only once", () => {
      const path = getJSXElementPath(
        "<div>{count} items ({count} total)</div>",
      );
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(1);

      const property = result.properties[0] as t.ObjectProperty;
      expect((property.key as t.StringLiteral).value).toBe("count");
      expect((property.value as t.Identifier).name).toBe("count");
    });

    it("should handle variables from objects", () => {
      const path = getJSXElementPath(
        "<div>user {user.name} has {user.profile.details.private.items.count} items</div>",
      );
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(2);

      const userNameProperty = result.properties[0] as t.ObjectProperty;
      expect((userNameProperty.key as t.StringLiteral).value).toBe("user.name");
      expect((userNameProperty.value as t.Identifier).name).toBe("user.name");

      const countProperty = result.properties[1] as t.ObjectProperty;
      expect((countProperty.key as t.StringLiteral).value).toBe(
        "user.profile.details.private.items.count",
      );
      expect((countProperty.value as t.Identifier).name).toBe(
        "user.profile.details.private.items.count",
      );
    });

    it("should handle nested dynamic vatiables", () => {
      const path = getJSXElementPath(
        "<div>User {data[currentUserType][currentUserIndex].name} has {items.counts[type]} items of type {typeNames[type]}</div>",
      );
      const result = getJsxVariables(path);

      expect(result.type).toBe("ObjectExpression");
      expect(result.properties).toHaveLength(3);

      const userNameProperty = result.properties[0] as t.ObjectProperty;
      expect((userNameProperty.key as t.StringLiteral).value).toBe(
        "data[currentUserType][currentUserIndex].name",
      );
      expect((userNameProperty.value as t.Identifier).name).toBe(
        "data[currentUserType][currentUserIndex].name",
      );

      const countProperty = result.properties[1] as t.ObjectProperty;
      expect((countProperty.key as t.StringLiteral).value).toBe(
        "items.counts[type]",
      );
      expect((countProperty.value as t.Identifier).name).toBe(
        "items.counts[type]",
      );

      const typeProperty = result.properties[2] as t.ObjectProperty;
      expect((typeProperty.key as t.StringLiteral).value).toBe(
        "typeNames[type]",
      );
      expect((typeProperty.value as t.Identifier).name).toBe("typeNames[type]");
    });
  });
});
