/**
 * Utilities for parsing and validating translation override attributes
 */

import type { JSXAttribute } from "@babel/types";
import * as t from "@babel/types";
import { logger } from "../../utils/logger.js";
import type { NodePath } from "@babel/traverse";

const OVERRIDE_ATTRIBUTE = "data-lingo-override";

/**
 * Parse the data-lingo-override attribute value
 * Supports object expression: data-lingo-override={{ de: "text", fr: "text" }}
 *
 * @param attr - The JSX attribute to parse
 * @returns Parsed overrides object or null if invalid
 */
export function parseOverrideAttribute(
  attr: JSXAttribute,
): Record<string, string> | null {
  if (!attr.value) {
    logger.warn(`${OVERRIDE_ATTRIBUTE} attribute has no value`);
    return null;
  }

  try {
    // Handle JSXExpressionContainer: {{ de: "...", fr: "..." }}
    if (t.isJSXExpressionContainer(attr.value)) {
      const result = parseObjectExpression(attr.value.expression);
      logger.debug(`[PARSE_OVERRIDE] Parsed JSXExpressionContainer:`, result);
      return result;
    }

    logger.warn(`${OVERRIDE_ATTRIBUTE} must be an object expression`);
    return null;
  } catch (error) {
    logger.warn(`Failed to parse ${OVERRIDE_ATTRIBUTE}:`, error);
    return null;
  }
}

/**
 * Parse object expression from JSX: {{ de: "text", fr: "text" }}
 */
function parseObjectExpression(
  expression: t.Expression | t.JSXEmptyExpression,
): Record<string, string> | null {
  if (t.isJSXEmptyExpression(expression)) {
    logger.warn(`${OVERRIDE_ATTRIBUTE} cannot be empty`);
    return null;
  }

  if (!t.isObjectExpression(expression)) {
    logger.warn(
      `${OVERRIDE_ATTRIBUTE} must be an object expression, got: ${expression.type}`,
    );
    return null;
  }

  const overrides: Record<string, string> = {};

  for (const prop of expression.properties) {
    // Skip spread properties
    if (t.isSpreadElement(prop)) {
      logger.warn(`${OVERRIDE_ATTRIBUTE} does not support spread properties`);
      continue;
    }

    // Only support ObjectProperty (not methods or getters/setters)
    if (!t.isObjectProperty(prop)) {
      logger.warn(`${OVERRIDE_ATTRIBUTE} only supports simple properties`);
      continue;
    }

    // Get the key (locale code)
    let key: string;
    if (t.isIdentifier(prop.key)) {
      key = prop.key.name;
    } else if (t.isStringLiteral(prop.key)) {
      key = prop.key.value;
    } else {
      logger.warn(
        `${OVERRIDE_ATTRIBUTE} keys must be identifiers or strings, got: ${prop.key.type}`,
      );
      continue;
    }

    // Get the value (translated text)
    let value: string;
    if (t.isStringLiteral(prop.value)) {
      value = prop.value.value;
      logger.debug(
        `[PARSE_OVERRIDE] Parsed string literal for ${key}: "${value}"`,
      );
    } else if (
      t.isTemplateLiteral(prop.value) &&
      prop.value.quasis.length === 1 &&
      prop.value.expressions.length === 0
    ) {
      // Support template literals with no expressions: `text`
      value = prop.value.quasis[0].value.cooked || "";
      logger.debug(
        `[PARSE_OVERRIDE] Parsed template literal for ${key}: "${value}"`,
      );
    } else {
      logger.warn(
        `${OVERRIDE_ATTRIBUTE} value for "${key}" must be a string literal, got: ${prop.value.type}`,
      );
      continue;
    }

    overrides[key] = value;
  }

  logger.debug(`[PARSE_OVERRIDE] Final overrides object:`, overrides);
  return Object.keys(overrides).length > 0 ? overrides : null;
}

/**
 * Validate override object
 * Checks:
 * - Is a plain object
 * - All keys are valid locale codes (basic check)
 * - All values are non-empty strings
 *
 * @param overrides - The overrides to validate
 * @returns true if valid, false otherwise
 */
export function validateOverrides(overrides: Record<string, string>): boolean {
  if (
    typeof overrides !== "object" ||
    overrides === null ||
    Array.isArray(overrides)
  ) {
    logger.warn("Overrides must be a plain object");
    return false;
  }

  const entries = Object.entries(overrides);
  if (entries.length === 0) {
    logger.warn("Overrides object is empty");
    return false;
  }

  for (const [locale, text] of entries) {
    // Basic locale code validation (2-letter code or with region)
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
      logger.warn(
        `Invalid locale code "${locale}" in overrides. Expected format: "en" or "en-US"`,
      );
      return false;
    }

    // Check value is non-empty string
    if (typeof text !== "string" || text.trim().length === 0) {
      logger.warn(`Override for locale "${locale}" must be a non-empty string`);
      return false;
    }
  }

  return true;
}

/**
 * Find the ${OVERRIDE_ATTRIBUTE} attribute in a JSX element
 *
 * @param attributes - Array of JSX attributes
 * @returns The override attribute or undefined
 */
export function findOverrideAttribute(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): JSXAttribute | undefined {
  const found = attributes.find(
    (attr): attr is JSXAttribute =>
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === OVERRIDE_ATTRIBUTE,
  );
  return found;
}

/**
 * Remove the ${OVERRIDE_ATTRIBUTE} attribute from a JSX element
 * (We don't want this to appear in the final transformed output)
 *
 * @param attributes - Array of JSX attributes
 * @returns Array with override attribute removed
 */
export function removeOverrideAttribute(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[],
): (t.JSXAttribute | t.JSXSpreadAttribute)[] {
  return attributes.filter(
    (attr) =>
      !(
        t.isJSXAttribute(attr) &&
        t.isJSXIdentifier(attr.name) &&
        attr.name.name === `${OVERRIDE_ATTRIBUTE}`
      ),
  );
}

export function processOverrideAttributes(
  path: NodePath<t.JSXElement | t.JSXFragment>,
): Record<string, string> | undefined {
  // Check for override attribute (only on JSXElement, not Fragment)
  let overrides: Record<string, string> | undefined;
  if (path.node.type === "JSXElement") {
    const overrideAttr = findOverrideAttribute(
      path.node.openingElement.attributes,
    );
    if (overrideAttr) {
      const parsedOverrides = parseOverrideAttribute(overrideAttr);
      if (parsedOverrides && validateOverrides(parsedOverrides)) {
        overrides = parsedOverrides;
        // Remove the override attribute from the output
        path.node.openingElement.attributes = removeOverrideAttribute(
          path.node.openingElement.attributes,
        );
      }
    }
  }
  return overrides;
}
