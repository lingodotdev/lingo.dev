import { createCodeMutation } from "./_base";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { getOrCreateImport } from "./utils";
import { CompilerPayload } from "./_base";

export function jsxFragmentMutation(
  payload: CompilerPayload,
): CompilerPayload | null {
  const { ast } = payload;

  let foundFragments = false;

  let fragmentImportName: string | null = null;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== "react") return;

      for (const specifier of path.node.specifiers) {
        if (
          t.isImportSpecifier(specifier) &&
          t.isIdentifier(specifier.imported) &&
          specifier.imported.name === "Fragment"
        ) {
          fragmentImportName = specifier.local.name;
          path.stop();
        }
      }
    },
  });

  traverse(ast, {
    JSXFragment(path) {
      foundFragments = true;

      if (!fragmentImportName) {
        const result = getOrCreateImport(ast, {
          exportedName: "Fragment",
          moduleName: ["react"],
        });
        fragmentImportName = result.importedName;
      }

      const fragmentElement = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier(fragmentImportName), [], false),
        t.jsxClosingElement(t.jsxIdentifier(fragmentImportName)),
        path.node.children,
        false,
      );

      path.replaceWith(fragmentElement);
    },
  });

  return payload;
}

export function transformFragmentShorthand(ast: t.Node): boolean {
  let transformed = false;

  let fragmentImportName: string | null = null;

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value !== "react") return;

      for (const specifier of path.node.specifiers) {
        if (
          t.isImportSpecifier(specifier) &&
          t.isIdentifier(specifier.imported) &&
          specifier.imported.name === "Fragment"
        ) {
          fragmentImportName = specifier.local.name;
          path.stop();
        }
      }
    },
  });

  traverse(ast, {
    JSXFragment(path) {
      transformed = true;

      if (!fragmentImportName) {
        const result = getOrCreateImport(ast, {
          exportedName: "Fragment",
          moduleName: ["react"],
        });
        fragmentImportName = result.importedName;
      }

      const fragmentElement = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier(fragmentImportName), [], false),
        t.jsxClosingElement(t.jsxIdentifier(fragmentImportName)),
        path.node.children,
        false,
      );

      path.replaceWith(fragmentElement);
    },
  });

  return transformed;
}
