import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { Expression, V8IntrinsicIdentifier } from "@babel/types";

export const getJsxFunctions = (nodePath: NodePath<t.JSXElement>) => {
  const functions = new Map<string, t.CallExpression[]>();
  let fnCounter = 0;

  nodePath.traverse({
    JSXOpeningElement(path) {
      path.skip();
    },
    JSXExpressionContainer(path) {
      if (t.isCallExpression(path.node.expression)) {
        let key = "";
        if (t.isIdentifier(path.node.expression.callee)) {
          key = `${path.node.expression.callee.name}`;
        } else if (t.isMemberExpression(path.node.expression.callee)) {
          let firstCallee: Expression | V8IntrinsicIdentifier =
            path.node.expression.callee;
          while (
            t.isMemberExpression(firstCallee) &&
            t.isCallExpression(firstCallee.object)
          ) {
            firstCallee = firstCallee.object.callee;
          }

          let current: Expression | V8IntrinsicIdentifier = firstCallee;
          const parts: string[] = [];

          while (t.isMemberExpression(current)) {
            if (t.isIdentifier(current.property)) {
              parts.unshift(current.property.name);
            }
            current = current.object;
          }

          if (t.isIdentifier(current)) {
            parts.unshift(current.name);
          }

          if (
            t.isMemberExpression(firstCallee) &&
            t.isNewExpression(firstCallee.object) &&
            t.isIdentifier(firstCallee.object.callee)
          ) {
            parts.unshift(firstCallee.object.callee.name);
          }

          key = parts.join(".");
        }
        const existing = functions.get(key) ?? [];
        functions.set(key, [...existing, path.node.expression]);
        fnCounter++;
      }
      path.skip();
    },
  });

  const properties = Array.from(functions.entries()).map(([name, callExpr]) =>
    t.objectProperty(t.stringLiteral(name), t.arrayExpression(callExpr)),
  );

  return t.objectExpression(properties);
};
