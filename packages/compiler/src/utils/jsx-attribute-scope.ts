import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { NodePath } from "@babel/traverse";

export function collectJsxAttributeScopes(
  node: t.Node,
): Array<[NodePath<t.JSXElement>, string[]]> {
  const result: Array<[NodePath<t.JSXElement>, string[]]> = [];

  traverse(node, {
    JSXElement(path: NodePath<t.JSXElement>) {
      if (!hasJsxAttributeScopeAttribute(path)) return;

      const localizableAttributes = getJsxAttributeScopeAttribute(path);
      if (!localizableAttributes) return;

      result.push([path, localizableAttributes]);
    },
  });

  return result;
}

export function getJsxAttributeScopes(
  node: t.Node,
): Array<[NodePath<t.JSXElement>, string[]]> {
  const result: Array<[NodePath<t.JSXElement>, string[]]> = [];

  // List of attributes that should be considered localizable
  const LOCALIZABLE_ATTRIBUTES = [
    "title",
    "aria-label",
    "aria-description",
    "alt",
    "label",
    "description",
    "placeholder",
    "content",
    "subtitle",
  ];

  traverse(node, {
    JSXElement(path: NodePath<t.JSXElement>) {
      const openingElement = path.node.openingElement;

      // Only process lowercase HTML elements (not components)
      const elementName = openingElement.name;
      if (!t.isJSXIdentifier(elementName) || !elementName.name) {
        return;
      }

      const hasAttributeScope = openingElement.attributes.find(
        (attr) =>
          t.isJSXAttribute(attr) &&
          attr.name.name === "data-jsx-attribute-scope",
      );
      if (hasAttributeScope) {
        return;
      }

      // Find all localizable attributes
      const localizableAttrs = openingElement.attributes
        .filter(
          (
            attr: t.JSXAttribute | t.JSXSpreadAttribute,
          ): attr is t.JSXAttribute => {
            if (!t.isJSXAttribute(attr) || !t.isStringLiteral(attr.value)) {
              return false;
            }

            const name = attr.name.name;
            return (
              typeof name === "string" && LOCALIZABLE_ATTRIBUTES.includes(name)
            );
          },
        )
        .map((attr: t.JSXAttribute) => attr.name.name as string);

      // Only add the element if we found localizable attributes
      if (localizableAttrs.length > 0) {
        result.push([path, localizableAttrs]);
      }
    },
  });

  return result;
}

export function hasJsxAttributeScopeAttribute(path: NodePath<t.JSXElement>) {
  return !!getJsxAttributeScopeAttribute(path);
}

export function getJsxAttributeScopeAttribute(path: NodePath<t.JSXElement>) {
  const attribute = path.node.openingElement.attributes.find(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.name === "data-jsx-attribute-scope",
  );

  if (!attribute || !t.isJSXAttribute(attribute)) {
    return undefined;
  }

  // Handle array of string literals
  if (
    t.isJSXExpressionContainer(attribute.value) &&
    t.isArrayExpression(attribute.value.expression)
  ) {
    const arrayExpr = attribute.value.expression;
    return arrayExpr.elements
      .filter((el): el is t.StringLiteral => t.isStringLiteral(el))
      .map((el) => el.value);
  }

  // Fallback for single string literal
  if (t.isStringLiteral(attribute.value)) {
    return [attribute.value.value];
  }

  return undefined;
}
