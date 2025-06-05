import { createCodeMutation, CompilerPayload } from "./_base";
import * as t from "@babel/types";
import { getJsxAttributeScopes } from "./utils/jsx-attribute-scope";
import { getAstKey } from "./utils/ast-key";

/**
 * This mutation identifies JSX elements with localizable attributes
 * and adds a data-jsx-attributes attribute with an array of the attribute names
 */
const jsxAttributeFlagMutation = createCodeMutation(
  (payload: CompilerPayload) => {
    const jsxScopes = getJsxAttributeScopes(payload.ast);

    for (const [jsxScope, attributes] of jsxScopes) {
      const scopeKey = getAstKey(jsxScope);
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("data-jsx-attribute-scope"),
          t.jsxExpressionContainer(
            t.arrayExpression(
              attributes.map((attr) =>
                t.stringLiteral(`${attr}:${scopeKey}-${attr}`),
              ),
            ),
          ),
        ),
      );
    }

    return {
      ...payload,
    };
  },
);

export default jsxAttributeFlagMutation;
