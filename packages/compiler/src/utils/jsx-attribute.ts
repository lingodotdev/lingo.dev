import * as t from "@babel/types";
import { NodePath } from "@babel/traverse";
import _ from "lodash";

/**
 * Gets a map of all JSX attributes from a JSX element
 *
 * @param nodePath The JSX element node path
 * @returns A record mapping attribute names to their values
 */
export function getJsxAttributesMap(
  nodePath: NodePath<t.JSXElement>,
): Record<string, any> {
  const attributes = nodePath.node.openingElement.attributes;

  return _.reduce(
    attributes,
    (result, attr) => {
      if (attr.type !== "JSXAttribute" || attr.name.type !== "JSXIdentifier") {
        return result;
      }

      const name = attr.name.name;
      const value = extractAttributeValue(attr);

      return { ...result, [name]: value };
    },
    {} as Record<string, any>,
  );
}

/**
 * Gets the value of a JSX attribute from a JSX element
 *
 * @param nodePath The JSX element node path
 * @param attributeName The name of the attribute to get
 * @returns The attribute value or undefined if not found
 */
export function getJsxAttributeValue(
  nodePath: NodePath<t.JSXElement>,
  attributeName: string,
) {
  const attributes = nodePath.node.openingElement.attributes;
  const attribute = _.find(
    attributes,
    (attr): attr is t.JSXAttribute =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      attr.name.name === attributeName,
  );

  if (!attribute) {
    return undefined;
  }

  return extractAttributeValue(attribute);
}

/**
 * Sets the value of a JSX attribute on a JSX element
 *
 * @param nodePath The JSX element node path
 * @param attributeName The name of the attribute to set
 * @param value The value to set (string, number, boolean, expression, or null for boolean attributes)
 */
export function setJsxAttributeValue(
  nodePath: NodePath<t.JSXElement>,
  attributeName: string,
  value: any,
) {
  const attributes = nodePath.node.openingElement.attributes;
  const attributeIndex = _.findIndex(
    attributes,
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      attr.name.name === attributeName,
  );

  const jsxValue = createAttributeValue(value);
  const jsxAttribute = t.jsxAttribute(t.jsxIdentifier(attributeName), jsxValue);

  if (attributeIndex >= 0) {
    attributes[attributeIndex] = jsxAttribute;
  } else {
    attributes.push(jsxAttribute);
  }
}

/**
 * Extracts the value from a JSX attribute
 */
function extractAttributeValue(attribute: t.JSXAttribute) {
  if (!attribute.value) {
    return true; // Boolean attribute
  }

  if (attribute.value.type === "StringLiteral") {
    return attribute.value.value;
  }

  if (attribute.value.type === "JSXExpressionContainer") {
    const expression = attribute.value.expression;

    if (expression.type === "BooleanLiteral") {
      return expression.value;
    }

    if (expression.type === "NumericLiteral") {
      return expression.value;
    }

    if (expression.type === "StringLiteral") {
      return expression.value;
    }
  }
  // We could return the raw expression for other types
  return null;
}

/**
 * Creates an appropriate JSX attribute value based on the input value
 */
function createAttributeValue(
  value: any,
): t.StringLiteral | t.JSXExpressionContainer | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return t.stringLiteral(value);
  }

  if (typeof value === "boolean") {
    return t.jsxExpressionContainer(t.booleanLiteral(value));
  }

  if (typeof value === "number") {
    return t.jsxExpressionContainer(t.numericLiteral(value));
  }

  if (t.isExpression(value)) {
    return t.jsxExpressionContainer(value);
  }

  // For complex objects/arrays, convert to expression
  return t.jsxExpressionContainer(t.stringLiteral(JSON.stringify(value)));
}
