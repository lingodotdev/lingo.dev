import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";

export function getJsxElementName(nodePath: NodePath<t.JSXElement>) {
  const openingElement = nodePath.node.openingElement;

  // elements with simple (string) name
  if (t.isJSXIdentifier(openingElement.name)) {
    return openingElement.name.name;
  }

  // elements with dots in name
  if (t.isJSXMemberExpression(openingElement.name)) {
    const memberExpr = openingElement.name;
    const parts: string[] = [];

    // Traverse the member expression to collect all parts
    let current: t.JSXMemberExpression | t.JSXIdentifier = memberExpr;
    while (t.isJSXMemberExpression(current)) {
      parts.unshift(current.property.name);
      current = current.object;
    }

    // Add the base identifier
    if (t.isJSXIdentifier(current)) {
      parts.unshift(current.name);
    }

    return parts.join(".");
  }
  return null;
}

export function getNestedJsxElements(nodePath: NodePath<t.JSXElement>) {
  const nestedElements: t.JSXElement[] = [];

  nodePath.traverse({
    JSXElement(path) {
      if (path.node !== nodePath.node) {
        nestedElements.push(path.node);
      }
    },
  });

  const arrayOfElements = nestedElements.map((element, index) => {
    // Create a function that takes children as param and returns the JSX element
    const param = t.identifier("children");

    // Replace the original children with the param
    const clonedElement = t.cloneNode(element);
    clonedElement.children = [t.jsxExpressionContainer(param)];

    return t.arrowFunctionExpression(
      [t.objectPattern([t.objectProperty(param, param, false, true)])],
      clonedElement,
    );
  });
  const result = t.arrayExpression(arrayOfElements);
  return result;
}
