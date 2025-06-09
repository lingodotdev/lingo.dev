import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { getJsxElementName } from "./jsx-element";

export function collectJsxScopes(ast: t.Node) {
  const jsxScopes: NodePath<t.JSXElement>[] = [];

  traverse(ast, {
    JSXElement: (path) => {
      if (!hasJsxScopeAttribute(path)) return;

      path.skip();
      jsxScopes.push(path);
    },
  });

  return jsxScopes;
}

export function getJsxScopes(node: t.Node) {
  const result: NodePath<t.JSXElement>[] = [];

  traverse(node, {
    JSXElement(path) {
      // Skip if the element is LingoProvider
      if (getJsxElementName(path) === "LingoProvider") {
        return;
      }
      // Check if element has any non-empty JSXText siblings
      const hasNonEmptyTextSiblings = path
        .getAllPrevSiblings()
        .concat(path.getAllNextSiblings())
        .some(
          (sibling) =>
            t.isJSXText(sibling.node) && sibling.node.value?.trim() !== "",
        );

      if (hasNonEmptyTextSiblings) {
        return;
      }

      // Check if element has at least one non-empty JSXText DIRECT child
      const hasNonEmptyTextChild = path
        .get("children")
        .some(
          (child) => t.isJSXText(child.node) && child.node.value?.trim() !== "",
        );

      if (hasNonEmptyTextChild) {
        result.push(path);
        path.skip(); // Skip traversing children since we found a scope
      }
    },
  });

  return result;
}

export function hasJsxScopeAttribute(path: NodePath<t.JSXElement>) {
  return !!getJsxScopeAttribute(path);
}

export function getJsxScopeAttribute(path: NodePath<t.JSXElement>) {
  const attribute = path.node.openingElement.attributes.find(
    (attr) =>
      attr.type === "JSXAttribute" && attr.name.name === "data-jsx-scope",
  );
  return attribute &&
    t.isJSXAttribute(attribute) &&
    t.isStringLiteral(attribute.value)
    ? attribute.value.value
    : undefined;
}
