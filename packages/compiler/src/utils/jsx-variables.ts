import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { Expression } from "@babel/types";

export const getJsxVariables = (nodePath: NodePath<t.JSXElement>) => {
  /*
    example input:

    <div>You have {count} new messages.</div>

    example output:

    t.objectExpression([
      t.objectProperty(t.identifier("count"), t.identifier("count")),
    ])
  */

  const variables = new Set<string>();

  nodePath.traverse({
    JSXOpeningElement(path) {
      path.skip();
    },
    JSXExpressionContainer(path) {
      if (t.isIdentifier(path.node.expression)) {
        variables.add(path.node.expression.name);
      } else if (t.isMemberExpression(path.node.expression)) {
        // Handle nested expressions like object.property.value
        let current: Expression = path.node.expression;
        const parts: string[] = [];

        while (t.isMemberExpression(current)) {
          if (t.isIdentifier(current.property)) {
            if (current.computed) {
              parts.unshift(`[${current.property.name}]`);
            } else {
              parts.unshift(current.property.name);
            }
          }
          current = current.object;
        }

        if (t.isIdentifier(current)) {
          parts.unshift(current.name);
          variables.add(parts.join(".").replaceAll(".[", "["));
        }
      }
      // Skip traversing inside the expression
      path.skip();
    },
  });

  const properties = Array.from(variables).map((name) =>
    t.objectProperty(t.stringLiteral(name), t.identifier(name)),
  );

  const result = t.objectExpression(properties);
  return result;
};
