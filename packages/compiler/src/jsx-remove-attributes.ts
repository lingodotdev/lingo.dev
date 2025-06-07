import { createCodeMutation, CompilerPayload } from "./_base";
import * as t from "@babel/types";
import traverse from "@babel/traverse";
import { NodePath } from "@babel/traverse";

/**
 * This mutation identifies JSX elements with data-jsx-* attributes and removes them
 */
export const jsxRemoveAttributesMutation = createCodeMutation(
  (payload: CompilerPayload) => {
    const ATTRIBUTES_TO_REMOVE = [
      "data-jsx-root",
      "data-jsx-scope",
      "data-jsx-attribute-scope",
    ];

    traverse(payload.ast, {
      JSXElement(path: NodePath<t.JSXElement>) {
        const openingElement = path.node.openingElement;
        openingElement.attributes = openingElement.attributes.filter((attr) => {
          const removeAttr =
            t.isJSXAttribute(attr) &&
            t.isJSXIdentifier(attr.name) &&
            ATTRIBUTES_TO_REMOVE.includes(attr.name.name as string);
          return !removeAttr;
        });
      },
    });

    return {
      ...payload,
    };
  },
);
