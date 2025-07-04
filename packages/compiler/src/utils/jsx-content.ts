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
  // Handle single-line content
  if (!input.includes("\n")) {
    // For single-line content, only trim if it appears to be formatting whitespace
    // (e.g., "   hello world   " should be trimmed to "hello world")
    // But preserve meaningful leading/trailing spaces (e.g., " hello" should stay " hello")

    // If the content is mostly whitespace with some text, it's likely formatting
    const trimmed = input.trim();
    if (trimmed.length === 0) return "";

    // Check if we have excessive whitespace (more than 1 space on each side)
    const leadingMatch = input.match(/^\s*/);
    const trailingMatch = input.match(/\s*$/);
    const leadingSpaces = leadingMatch ? leadingMatch[0].length : 0;
    const trailingSpaces = trailingMatch ? trailingMatch[0].length : 0;

    if (leadingSpaces > 1 || trailingSpaces > 1) {
      // This looks like formatting whitespace, collapse it
      return input.replace(/\s+/g, " ").trim();
    } else {
      // This looks like meaningful whitespace, preserve it but collapse internal spaces
      return input.replace(/\s{2,}/g, " ");
    }
  }

  // Handle multi-line content
  const lines = input.split("\n");
  let result = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === "") continue;

    // Check if this line contains a placeholder (explicit whitespace)
    if (trimmedLine.includes(WHITESPACE_PLACEHOLDER)) {
      // For lines with placeholders, preserve the original spacing
      result += trimmedLine;
    } else if (
      trimmedLine.startsWith("<element:") ||
      trimmedLine.startsWith("<function:") ||
      trimmedLine.startsWith("{") ||
      trimmedLine.startsWith("<expression/>")
    ) {
      // When we encounter an element/function/expression
      // Add space only when:
      // 1. We have existing content AND
      // 2. Result doesn't already end with space or placeholder AND
      // 3. The result ends with a word character (indicating text) AND
      // 4. The element content starts with a space (indicating word continuation)
      const shouldAddSpace =
        result &&
        !result.endsWith(" ") &&
        !result.endsWith(WHITESPACE_PLACEHOLDER) &&
        /\w$/.test(result) &&
        // Check if element content starts with space by looking for "> " pattern
        trimmedLine.includes("> ");

      if (shouldAddSpace) {
        result += " ";
      }
      result += trimmedLine;
    } else {
      // For regular text content, ensure proper spacing
      // Only add space if the result doesn't already end with a space or placeholder
      if (
        result &&
        !result.endsWith(" ") &&
        !result.endsWith(WHITESPACE_PLACEHOLDER)
      ) {
        result += " ";
      }
      result += trimmedLine;
    }
  }

  // Collapse multiple spaces but preserve single spaces around placeholders
  result = result.replace(/\s{2,}/g, " ");
  return result.trim();
}
