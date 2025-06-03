import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";

export function getJsxElementName(nodePath: NodePath<t.JSXElement>) {
  const openingElement = nodePath.node.openingElement;
  if (t.isJSXIdentifier(openingElement.name)) {
    return openingElement.name.name;
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
