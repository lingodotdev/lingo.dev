import { parse } from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

/**
 * Creates a TypeScript loader that extracts string literals from default exports
 */
export default function createTypescriptLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    pull: async (locale, input) => {
      if (!input) {
        return {};
      }

      try {
        const ast = parseTypeScript(input);
        return extractStringsFromDefaultExport(ast);
      } catch (error) {
        console.error("Error parsing TypeScript file:", error);
        return {};
      }
    },
    push: async (locale, data, originalInput, defaultLocale, pullInput, pullOutput) => {
      if (!data) {
        return "";
      }
      
      const input = originalInput as string;
      
      try {
        const ast = parseTypeScript(input);
        const modified = updateStringsInDefaultExport(ast, data);

        if (!modified) {
          return input;
        }

        const generate = require('@babel/generator').default;
        const { code } = generate(ast);
        return code;
      } catch (error) {
        console.error("Error updating TypeScript file:", error);
        return input;
      }
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
 * Extract string literals from a default export in TypeScript
 */
function extractStringsFromDefaultExport(ast: t.File): Record<string, string> {
  const result: Record<string, string> = {};

  traverse(ast, {
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      if (t.isObjectExpression(path.node.declaration)) {
        extractStringsFromObjectExpression(path.node.declaration, result);
      } else if (t.isIdentifier(path.node.declaration)) {
        extractStringsFromExportedIdentifier(path, result);
      }
    }
  });

  return result;
}

/**
 * Extract string literals from an object expression
 */
function extractStringsFromObjectExpression(
  objectExpression: t.ObjectExpression, 
  result: Record<string, string>
): void {
  objectExpression.properties.forEach((prop) => {
    if (t.isObjectProperty(prop)) {
      const key = getPropertyKey(prop);
      
      if (t.isStringLiteral(prop.value)) {
        result[key] = prop.value.value;
      }
    }
  });
}

/**
 * Extract string literals from an exported identifier (variable)
 */
function extractStringsFromExportedIdentifier(
  path: NodePath<t.ExportDefaultDeclaration>,
  result: Record<string, string>
): void {
  const exportName = (path.node.declaration as t.Identifier).name;
  const binding = path.scope.bindings[exportName];
  
  if (binding && binding.path.node) {
    const bindingPath = binding.path;
    
    if (
      t.isVariableDeclarator(bindingPath.node) && 
      bindingPath.node.init && 
      t.isObjectExpression(bindingPath.node.init)
    ) {
      extractStringsFromObjectExpression(bindingPath.node.init, result);
    }
  }
}

/**
 * Update string literals in a default export with new values
 */
function updateStringsInDefaultExport(
  ast: t.File, 
  data: Record<string, string>
): boolean {
  let modified = false;

  traverse(ast, {
    ExportDefaultDeclaration(path: NodePath<t.ExportDefaultDeclaration>) {
      if (t.isObjectExpression(path.node.declaration)) {
        modified = updateStringsInObjectExpression(path.node.declaration, data) || modified;
      } else if (t.isIdentifier(path.node.declaration)) {
        modified = updateStringsInExportedIdentifier(path, data) || modified;
      }
    }
  });

  return modified;
}

/**
 * Update string literals in an object expression with new values
 */
function updateStringsInObjectExpression(
  objectExpression: t.ObjectExpression, 
  data: Record<string, string>
): boolean {
  let modified = false;

  objectExpression.properties.forEach((prop) => {
    if (t.isObjectProperty(prop)) {
      const key = getPropertyKey(prop);
      
      if (t.isStringLiteral(prop.value) && data[key] !== undefined) {
        prop.value.value = data[key];
        modified = true;
      }
    }
  });

  return modified;
}

/**
 * Update string literals in an exported identifier (variable) with new values
 */
function updateStringsInExportedIdentifier(
  path: NodePath<t.ExportDefaultDeclaration>,
  data: Record<string, string>
): boolean {
  let modified = false;
  const exportName = (path.node.declaration as t.Identifier).name;
  const binding = path.scope.bindings[exportName];
  
  if (binding && binding.path.node) {
    const bindingPath = binding.path;
    
    if (
      t.isVariableDeclarator(bindingPath.node) && 
      bindingPath.node.init && 
      t.isObjectExpression(bindingPath.node.init)
    ) {
      modified = updateStringsInObjectExpression(bindingPath.node.init, data) || modified;
    }
  }

  return modified;
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
