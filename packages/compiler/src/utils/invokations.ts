import * as t from "@babel/types";
import traverse, { NodePath } from "@babel/traverse";

export function findInvokations(
  ast: t.File,
  params: {
    moduleName: string[];
    functionName: string;
  },
) {
  const result: t.CallExpression[] = [];

  traverse(ast, {
    ImportDeclaration(path) {
      if (!params.moduleName.includes(path.node.source.value)) return;

      const importNames = new Map<string, boolean | string>();
      const specifiers = path.node.specifiers;

      specifiers.forEach((specifier) => {
        if (
          t.isImportSpecifier(specifier) &&
          t.isIdentifier(specifier.imported) &&
          specifier.imported.name === params.functionName
        ) {
          importNames.set(specifier.local.name, true);
        } else if (
          t.isImportDefaultSpecifier(specifier) &&
          params.functionName === "default"
        ) {
          importNames.set(specifier.local.name, true);
        } else if (t.isImportNamespaceSpecifier(specifier)) {
          importNames.set(specifier.local.name, "namespace");
        }
      });

      collectCallExpressions(path, importNames, result, params.functionName);
    },
  });

  return result;
}

function collectCallExpressions(
  path: NodePath<t.ImportDeclaration>,
  importNames: Map<string, boolean | string>,
  result: t.CallExpression[],
  functionName: string,
) {
  const program = path.findParent((p): p is NodePath<t.Program> =>
    p.isProgram(),
  );

  if (!program) return;

  program.traverse({
    CallExpression(callPath: NodePath<t.CallExpression>) {
      const callee = callPath.node.callee;

      if (t.isIdentifier(callee) && importNames.has(callee.name)) {
        result.push(callPath.node);
      } else if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        importNames.get(callee.object.name) === "namespace" &&
        t.isIdentifier(callee.property) &&
        callee.property.name === functionName
      ) {
        result.push(callPath.node);
      }
    },
  });
}
