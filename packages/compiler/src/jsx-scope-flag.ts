import { createCodeMutation } from "./_base";
import * as t from "@babel/types";
import { getAstKey } from "./utils/ast-key";
import { getJsxScopes } from "./utils/jsx-scope";

const jsxScopeFlagMutation = createCodeMutation((payload) => {
  const jsxScopes = getJsxScopes(payload.ast);

  for (const jsxScope of jsxScopes) {
    jsxScope.node.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("data-jsx-scope"),
        t.stringLiteral(getAstKey(jsxScope)),
      ),
    );
  }

  return {
    ...payload,
  };
});

export default jsxScopeFlagMutation;
