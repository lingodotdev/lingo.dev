import traverse from "@babel/traverse";
import * as t from "@babel/types";
import _ from "lodash";

import { NodePath } from "@babel/traverse";
import { getJsxAttributeValue, setJsxAttributeValue } from "./jsx-attribute";

// "root" is a JSXElement node that is the root of the JSX tree,
// meaning it doesn't have JSXElement nodes among its ancestors.
export function getJsxRoots(node: t.Node) {
  const result: NodePath<t.JSXElement>[] = [];

  // skip traversing the node if it's a root node
  traverse(node, {
    JSXElement(path) {
      result.push(path);
      path.skip();
    },
  });

  return result;
}

export function isGoodJsxText(path: NodePath<t.JSXText>) {
  return path.node.value?.trim() !== "";
}

export function getOrCreateImport(
  ast: t.Node,
  params: {
    exportedName: string;
    moduleName: string;
  },
): { importedName: string } {
  let importedName = params.exportedName;
  let existingImport = findExistingImport(
    ast,
    params.exportedName,
    params.moduleName,
  );

  if (existingImport) {
    return { importedName: existingImport };
  }

  // Find a unique import name if needed
  importedName = generateUniqueImportName(ast, params.exportedName);

  // Create the import declaration
  createImportDeclaration(
    ast,
    importedName,
    params.exportedName,
    params.moduleName,
  );

  return { importedName };
}

function findExistingImport(
  ast: t.Node,
  exportedName: string,
  moduleName: string,
): string | null {
  let result: string | null = null;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== moduleName) {
        return;
      }

      for (const specifier of path.node.specifiers) {
        if (
          t.isImportSpecifier(specifier) &&
          ((t.isIdentifier(specifier.imported) &&
            specifier.imported.name === exportedName) ||
            (specifier.importKind === "value" &&
              t.isIdentifier(specifier.local) &&
              specifier.local.name === exportedName))
        ) {
          result = specifier.local.name;
          path.stop();
          return;
        }
      }
    },
  });

  return result;
}

function generateUniqueImportName(ast: t.Node, baseName: string): string {
  const usedNames = new Set<string>();

  // Collect all identifiers in scope
  traverse(ast, {
    Identifier(path) {
      usedNames.add(path.node.name);
    },
  });

  // If the base name is available, use it
  if (!usedNames.has(baseName)) {
    return baseName;
  }

  // Otherwise, append a number until we find an unused name
  let counter = 1;
  let candidateName = `${baseName}${counter}`;

  while (usedNames.has(candidateName)) {
    counter++;
    candidateName = `${baseName}${counter}`;
  }

  return candidateName;
}

function createImportDeclaration(
  ast: t.Node,
  localName: string,
  exportedName: string,
  moduleName: string,
): void {
  traverse(ast, {
    Program(path) {
      // Create the import specifier
      const importSpecifier = t.importSpecifier(
        t.identifier(localName),
        t.identifier(exportedName),
      );

      // Check if we already have an import from this module
      const existingImport = path
        .get("body")
        .find(
          (nodePath) =>
            t.isImportDeclaration(nodePath.node) &&
            nodePath.node.source.value === moduleName,
        );

      if (existingImport && t.isImportDeclaration(existingImport.node)) {
        // Add to existing import declaration
        existingImport.node.specifiers.push(importSpecifier);
      } else {
        // Create a new import declaration
        const importDeclaration = t.importDeclaration(
          [importSpecifier],
          t.stringLiteral(moduleName),
        );

        // Add it at the top of the file, after any existing imports
        const lastImportIndex = findLastImportIndex(path);
        path.node.body.splice(lastImportIndex + 1, 0, importDeclaration);
      }

      path.stop();
    },
  });
}

function findLastImportIndex(programPath: NodePath<t.Program>): number {
  const body = programPath.node.body;

  for (let i = body.length - 1; i >= 0; i--) {
    if (t.isImportDeclaration(body[i])) {
      return i;
    }
  }

  return -1;
}

function _hasFileDirective(ast: t.Node, directiveValue: string): boolean {
  let hasDirective = false;

  traverse(ast, {
    Directive(path) {
      if (path.node.value.value === directiveValue) {
        hasDirective = true;
        path.stop(); // Stop traversal as soon as we find the directive
      }
    },
  });

  return hasDirective;
}

export function hasI18nDirective(ast: t.Node): boolean {
  return _hasFileDirective(ast, "use i18n");
}

export function hasClientDirective(ast: t.Node): boolean {
  return _hasFileDirective(ast, "use client");
}

export function hasServerDirective(ast: t.Node): boolean {
  return _hasFileDirective(ast, "use server");
}

export function getModuleExecutionMode(
  ast: t.Node,
  rscEnabled: boolean,
): "client" | "server" {
  // if rscEnabled is true, then server mode is the default
  // if rscEnabled is false, then client mode is the default
  // default mode is when there is no directive

  if (rscEnabled) {
    if (hasClientDirective(ast)) {
      return "client";
    } else {
      return "server";
    }
  } else {
    return "client";
  }
}

export { getJsxAttributeValue, setJsxAttributeValue };
