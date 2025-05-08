import { parse } from "@babel/parser";
import _ from "lodash";
import babelTraverseModule from "@babel/traverse";
import type { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import babelGenerateModule from "@babel/generator";
import { ILoader } from "../_types";
import { createLoader } from "../_utils";
import { resolveCjsExport } from "./cjs-interop";

const traverse = resolveCjsExport(babelTraverseModule, "@babel/traverse");
const generate = resolveCjsExport(babelGenerateModule, "@babel/generator");

export default function createTypescriptLoader(): ILoader<
  string,
  Record<string, any>
> {
  return createLoader({
    pull: async (locale, input) => {
      if (!input) {
        return {};
      }

      const ast = parseTypeScript(input);
      const extractedStrings = extractStringsFromDefaultExport(ast);
      return extractedStrings;
    },
    push: async (
      locale,
      data,
      originalInput,
      defaultLocale,
      pullInput,
      pullOutput,
    ) => {
      const ast = parseTypeScript(originalInput || "");
      const finalData = _.merge({}, pullOutput, data);
      updateStringsInDefaultExport(ast, finalData);

      const { code } = generate(ast, {
        jsescOption: {
          minimal: true,
        },
      });
      return code;
    },
  });
}

/**
 * Parse TypeScript code into an AST
 */
function parseTypeScript(input: string) {
  return parse(input, {
    sourceType: "module",
    plugins: ["typescript"],
  });
}

/**
 * Extract the localizable (string literal) content from the default export
 * and return it as a nested object that mirrors the original structure.
 */
function extractStringsFromDefaultExport(ast: t.File): Record<string, any> {
  let extracted: Record<string, any> = {};

  traverse(ast, {
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      const { declaration } = path.node;

      const decl = unwrapTSAsExpression(declaration);

      if (t.isObjectExpression(decl)) {
        extracted = objectExpressionToObject(decl);
      } else if (t.isArrayExpression(decl)) {
        extracted = arrayExpressionToArray(decl) as unknown as Record<
          string,
          any
        >;
      } else if (t.isIdentifier(decl)) {
        // Handle: const foo = {...}; export default foo;
        const binding = path.scope.bindings[decl.name];
        if (
          binding &&
          t.isVariableDeclarator(binding.path.node) &&
          binding.path.node.init
        ) {
          const initRaw = binding.path.node.init;
          const init = initRaw ? unwrapTSAsExpression(initRaw) : initRaw;
          if (t.isObjectExpression(init)) {
            extracted = objectExpressionToObject(init);
          } else if (t.isArrayExpression(init)) {
            extracted = arrayExpressionToArray(init) as unknown as Record<
              string,
              any
            >;
          }
        }
      }
    },
  });

  return extracted;
}

/**
 * Helper: unwraps nested TSAsExpression nodes (e.g. `obj as const`)
 * to get to the underlying expression/node we care about.
 */
function unwrapTSAsExpression<T extends t.Node>(node: T): t.Node {
  let current: t.Node = node;
  // TSAsExpression is produced for `expr as const` assertions.
  // We want to get to the underlying expression so that the rest of the
  // loader logic can work unchanged.
  // There could theoretically be multiple nested `as const` assertions, so we
  // unwrap in a loop.
  // eslint-disable-next-line no-constant-condition
  while (t.isTSAsExpression(current)) {
    current = current.expression;
  }
  return current;
}

/**
 * Recursively converts an `ObjectExpression` into a plain JavaScript object that
 * only contains the string-literal values we care about. Non-string primitives
 * (numbers, booleans, etc.) are ignored.
 */
function objectExpressionToObject(
  objectExpression: t.ObjectExpression,
): Record<string, any> {
  const obj: Record<string, any> = {};

  objectExpression.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop)) return;

    const key = getPropertyKey(prop);

    if (t.isStringLiteral(prop.value)) {
      obj[key] = prop.value.value;
    } else if (t.isObjectExpression(prop.value)) {
      const nested = objectExpressionToObject(prop.value);
      if (Object.keys(nested).length > 0) {
        obj[key] = nested;
      }
    } else if (t.isArrayExpression(prop.value)) {
      const arr = arrayExpressionToArray(prop.value);
      if (arr.length > 0) {
        obj[key] = arr;
      }
    }
  });

  return obj;
}

/**
 * Recursively converts an `ArrayExpression` into a JavaScript array that
 * contains string literals and nested objects/arrays when relevant.
 */
function arrayExpressionToArray(arrayExpression: t.ArrayExpression): any[] {
  const arr: any[] = [];

  arrayExpression.elements.forEach((element) => {
    if (!element) return; // holes in the array

    if (t.isStringLiteral(element)) {
      arr.push(element.value);
    } else if (t.isObjectExpression(element)) {
      const nestedObj = objectExpressionToObject(element);
      arr.push(nestedObj);
    } else if (t.isArrayExpression(element)) {
      arr.push(arrayExpressionToArray(element));
    }
  });

  return arr;
}

// ------------------ updating helpers (nested data) ------------------------

function updateStringsInDefaultExport(
  ast: t.File,
  data: Record<string, any>,
): boolean {
  let modified = false;

  traverse(ast, {
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      const { declaration } = path.node;

      const decl = unwrapTSAsExpression(declaration);

      if (t.isObjectExpression(decl)) {
        modified = updateStringsInObjectExpression(decl, data) || modified;
      } else if (t.isArrayExpression(decl)) {
        if (Array.isArray(data)) {
          modified = updateStringsInArrayExpression(decl, data) || modified;
        }
      } else if (t.isIdentifier(decl)) {
        modified = updateStringsInExportedIdentifier(path, data) || modified;
      }
    },
  });

  return modified;
}

function updateStringsInObjectExpression(
  objectExpression: t.ObjectExpression,
  data: Record<string, any>,
): boolean {
  let modified = false;

  objectExpression.properties.forEach((prop) => {
    if (!t.isObjectProperty(prop)) return;

    const key = getPropertyKey(prop);
    const incomingVal = data?.[key];

    if (incomingVal === undefined) {
      // nothing to update for this key
      return;
    }

    if (t.isStringLiteral(prop.value) && typeof incomingVal === "string") {
      if (prop.value.value !== incomingVal) {
        prop.value.value = incomingVal;
        modified = true;
      }
    } else if (
      t.isObjectExpression(prop.value) &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal)
    ) {
      const subModified = updateStringsInObjectExpression(
        prop.value,
        incomingVal,
      );
      modified = subModified || modified;
    } else if (t.isArrayExpression(prop.value) && Array.isArray(incomingVal)) {
      const subModified = updateStringsInArrayExpression(
        prop.value,
        incomingVal,
      );
      modified = subModified || modified;
    }
  });

  return modified;
}

function updateStringsInArrayExpression(
  arrayExpression: t.ArrayExpression,
  incoming: any[],
): boolean {
  let modified = false;

  arrayExpression.elements.forEach((element, index) => {
    if (!element) return;

    const incomingVal = incoming?.[index];
    if (incomingVal === undefined) return;

    if (t.isStringLiteral(element) && typeof incomingVal === "string") {
      if (element.value !== incomingVal) {
        element.value = incomingVal;
        modified = true;
      }
    } else if (
      t.isObjectExpression(element) &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal)
    ) {
      const subModified = updateStringsInObjectExpression(element, incomingVal);
      modified = subModified || modified;
    } else if (t.isArrayExpression(element) && Array.isArray(incomingVal)) {
      const subModified = updateStringsInArrayExpression(element, incomingVal);
      modified = subModified || modified;
    }
  });

  return modified;
}

function updateStringsInExportedIdentifier(
  path: NodePath<t.ExportDefaultDeclaration>,
  data: Record<string, any>,
): boolean {
  const exportName = (path.node.declaration as t.Identifier).name;
  const binding = path.scope.bindings[exportName];

  if (!binding || !binding.path.node) return false;

  if (t.isVariableDeclarator(binding.path.node) && binding.path.node.init) {
    const initRaw = binding.path.node.init;
    const init = initRaw ? unwrapTSAsExpression(initRaw) : initRaw;
    if (t.isObjectExpression(init)) {
      return updateStringsInObjectExpression(init, data);
    } else if (t.isArrayExpression(init)) {
      return updateStringsInArrayExpression(init, data as any[]);
    }
  }

  return false;
}

/**
 * Get the string key from an object property
 */
function getPropertyKey(prop: t.ObjectProperty): string {
  if (t.isIdentifier(prop.key)) {
    return prop.key.name;
  } else if (t.isStringLiteral(prop.key)) {
    return prop.key.value;
  }
  return String(prop.key);
}
