import traverse from "@babel/traverse";
import { createCodeMutation } from "./_base";
import { getJsxRoots } from "./utils";
import * as t from "@babel/types";

const jsxRootFlagMutation = createCodeMutation((payload) => {
  const jsxRoots = getJsxRoots(payload.ast);

  for (const jsxElementPath of jsxRoots) {
    jsxElementPath.node.openingElement.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("data-jsx-root"), null),
    );
  }

  return {
    ...payload,
  };
});

export default jsxRootFlagMutation;
