import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { getJsxElementName } from "./jsx-element";
import _ from "lodash";

const WHITESPACE_PLACEHOLDER = "[lingo-whitespace-placeholder]";

export function extractJsxContent(
  nodePath: NodePath<t.JSXElement>,
  replaceWhitespacePlaceholders = true, // do not replace when called recursively
) {
  const chunks: string[] = [];

  nodePath.traverse({
    JSXElement(path) {
      if (path.parent === nodePath.node) {
        const content = extractJsxContent(path, false);
        const name = getJsxElementName(path);
        chunks.push(`<element:${name}>${content}</element:${name}>`);
        path.skip();
      }
    },
    JSXText(path) {
      chunks.push(path.node.value);
    },
    JSXExpressionContainer(path) {
      if (path.parent !== nodePath.node) {
        return;
      }

      const expr = path.node.expression;
      if (t.isCallExpression(expr)) {
        let key = "";
        if (t.isIdentifier(expr.callee)) {
          key = `${expr.callee.name}`;
        } else if (t.isMemberExpression(expr.callee)) {
          let firstCallee: t.Expression | t.V8IntrinsicIdentifier = expr.callee;
          while (
            t.isMemberExpression(firstCallee) &&
            t.isCallExpression(firstCallee.object)
          ) {
            firstCallee = firstCallee.object.callee;
          }

          let current: t.Expression | t.V8IntrinsicIdentifier = firstCallee;
          const parts: string[] = [];

          while (t.isMemberExpression(current)) {
            if (t.isIdentifier(current.property)) {
              parts.unshift(current.property.name);
            }
            current = current.object;
          }

          if (t.isIdentifier(current)) {
            parts.unshift(current.name);
          }

          if (
            t.isMemberExpression(firstCallee) &&
            t.isNewExpression(firstCallee.object) &&
            t.isIdentifier(firstCallee.object.callee)
          ) {
            parts.unshift(firstCallee.object.callee.name);
          }

          key = parts.join(".");
        }

        chunks.push(`<function:${key}/>`);
      } else if (t.isIdentifier(expr)) {
        chunks.push(`{${expr.name}}`);
      } else if (t.isMemberExpression(expr)) {
        let current: t.MemberExpression | t.Identifier = expr;
        const parts = [];

        while (t.isMemberExpression(current)) {
          if (t.isIdentifier(current.property)) {
            if (current.computed) {
              parts.unshift(`[${current.property.name}]`);
            } else {
              parts.unshift(current.property.name);
            }
          }
          current = current.object as t.MemberExpression | t.Identifier;
        }

        if (t.isIdentifier(current)) {
          parts.unshift(current.name);
          chunks.push(`{${parts.join(".").replaceAll(".[", "[")}}`);
        }
      } else if (isWhitespace(path)) {
        chunks.push(WHITESPACE_PLACEHOLDER);
      } else if (isExpression(path)) {
        chunks.push("<expression/>");
      }
      path.skip();
    },
  });

  const result = chunks.join("");
  const normalized = normalizeJsxWhitespace(result);

  if (replaceWhitespacePlaceholders) {
    return normalized.replaceAll(WHITESPACE_PLACEHOLDER, " ");
  }
  return normalized;
}

const compilerProps = ["data-jsx-attribute-scope", "data-jsx-scope"];

function isExpression(nodePath: NodePath<t.JSXExpressionContainer>) {
  const isCompilerExpression =
    !_.isArray(nodePath.container) &&
    t.isJSXAttribute(nodePath.container) &&
    t.isJSXIdentifier(nodePath.container.name) &&
    compilerProps.includes(nodePath.container.name.name);
  return (
    !isCompilerExpression && !t.isJSXEmptyExpression(nodePath.node.expression)
  );
}

function isWhitespace(nodePath: NodePath<t.JSXExpressionContainer>) {
  const expr = nodePath.node.expression;
  return t.isStringLiteral(expr) && expr.value === " ";
}

function normalizeJsxWhitespace(input: string) {
  const lines = input.split("\n");
  let result = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    if (
      i > 0 &&
      (line.startsWith("<element:") ||
        line.startsWith("<function:") ||
        line.startsWith("{") ||
        line.startsWith("<expression/>"))
    ) {
      result += line;
    } else {
      if (result && !result.endsWith(" ")) result += " ";
      result += line;
    }
  }
  // Collapse multiple spaces
  result = result.replace(/\s+/g, " ");
  return result.trim();
}
