import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { Expression } from "@babel/types";

export const getJsxExpressions = (nodePath: NodePath<t.JSXElement>) => {
  const expressions: Expression[] = [];
  nodePath.traverse({
    JSXOpeningElement(path) {
      path.skip();
    },
    JSXExpressionContainer(path) {
      const expr = path.node.expression;

      // Skip empty expressions, identifiers (variables), member expressions (object paths), and function calls
      if (
        !t.isJSXEmptyExpression(expr) &&
        !t.isIdentifier(expr) &&
        !t.isMemberExpression(expr) &&
        !t.isCallExpression(expr) &&
        !(t.isStringLiteral(expr) && expr.value === " ") // whitespace
      ) {
        expressions.push(expr);
      }
      path.skip();
    },
  });

  return t.arrayExpression(expressions);
};
