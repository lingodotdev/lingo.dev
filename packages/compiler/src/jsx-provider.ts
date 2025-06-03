import traverse, { NodePath } from "@babel/traverse";
import * as t from "@babel/types";
import { CompilerPayload, createCodeMutation } from "./_base";
import { getJsxElementName } from "./utils/jsx-element";
import { getModuleExecutionMode, getOrCreateImport } from "./utils";
import { ModuleId } from "./_const";

/**
 * This mutation is used to wrap the html component with the LingoProvider component.
 * It only works with server components.
 */
const jsxProviderMutation = createCodeMutation((payload) => {
  traverse(payload.ast, {
    JSXElement: (path) => {
      if (getJsxElementName(path)?.toLowerCase() === "html") {
        const mode = getModuleExecutionMode(payload.ast, payload.params.rsc);
        if (mode === "client") {
          return;
        }

        // TODO: later
        // replaceHtmlComponent(payload, path);

        const lingoProviderImport = getOrCreateImport(payload.ast, {
          moduleName: ModuleId.ReactRSC,
          exportedName: "LingoProvider",
        });
        const loadDictionaryImport = getOrCreateImport(payload.ast, {
          moduleName: ModuleId.ReactRSC,
          exportedName: "loadDictionary",
        });

        const loadDictionaryArrow = t.arrowFunctionExpression(
          [t.identifier("locale")],
          t.callExpression(t.identifier(loadDictionaryImport.importedName), [
            t.identifier("locale"),
          ]),
        );

        const providerProps = [
          t.jsxAttribute(
            t.jsxIdentifier("loadDictionary"),
            t.jsxExpressionContainer(loadDictionaryArrow),
          ),
        ];

        const provider = t.jsxElement(
          t.jsxOpeningElement(
            t.jsxIdentifier(lingoProviderImport.importedName),
            providerProps,
            false,
          ),
          t.jsxClosingElement(
            t.jsxIdentifier(lingoProviderImport.importedName),
          ),
          [path.node],
          false,
        );

        path.replaceWith(provider);
        path.skip();
      }
    },
  });

  return payload;
});

export default jsxProviderMutation;

function replaceHtmlComponent(
  payload: CompilerPayload,
  path: NodePath<t.JSXElement>,
) {
  // Find the parent function and make it async since locale is retrieved from cookies asynchronously
  const parentFunction = path.findParent(
    (p): p is NodePath<t.FunctionDeclaration | t.ArrowFunctionExpression> =>
      t.isFunctionDeclaration(p.node) || t.isArrowFunctionExpression(p.node),
  );
  if (
    parentFunction?.node.type === "FunctionDeclaration" ||
    parentFunction?.node.type === "ArrowFunctionExpression"
  ) {
    parentFunction.node.async = true;
  }

  // html lang attribute
  const loadLocaleFromCookiesImport = getOrCreateImport(payload.ast, {
    moduleName: ModuleId.ReactRSC,
    exportedName: "loadLocaleFromCookies",
  });
  let langAttribute = path.node.openingElement.attributes.find(
    (attr) => attr.type === "JSXAttribute" && attr.name.name === "lang",
  );
  if (!t.isJSXAttribute(langAttribute)) {
    (langAttribute = t.jsxAttribute(
      t.jsxIdentifier("lang"),
      t.stringLiteral(""),
    )),
      path.node.openingElement.attributes.push(langAttribute);
  }
  langAttribute.value = t.jsxExpressionContainer(
    t.awaitExpression(
      t.callExpression(
        t.identifier(loadLocaleFromCookiesImport.importedName),
        [],
      ),
    ),
  );
}
