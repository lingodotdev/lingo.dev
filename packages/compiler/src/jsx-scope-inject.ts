import { createCodeMutation } from "./_base";
import {
  getJsxAttributeValue,
  getModuleExecutionMode,
  getOrCreateImport,
} from "./utils";
import * as t from "@babel/types";
import _ from "lodash";
import { ModuleId } from "./_const";
import { getJsxElementName, getNestedJsxElements } from "./utils/jsx-element";
import { getJsxVariables } from "./utils/jsx-variables";
import { getJsxFunctions } from "./utils/jsx-functions";
import { getJsxExpressions } from "./utils/jsx-expressions";
import { collectJsxScopes, getJsxScopeAttribute } from "./utils/jsx-scope";

export const lingoJsxScopeInjectMutation = createCodeMutation((payload) => {
  const mode = getModuleExecutionMode(payload.ast, payload.params.rsc);
  const jsxScopes = collectJsxScopes(payload.ast);

  for (const jsxScope of jsxScopes) {
    const skip = getJsxAttributeValue(jsxScope, "data-lingo-skip");
    if (skip) {
      continue;
    }

    // Import LingoComponent based on the module execution mode
    const packagePath =
      mode === "client" ? ModuleId.ReactClient : ModuleId.ReactRSC;
    const lingoComponentImport = getOrCreateImport(payload.ast, {
      moduleName: packagePath,
      exportedName: "LingoComponent",
    });

    // Preserve original scope before he JSX element is replaced with the lingo component
    const originalJsxScope = _.cloneDeep(jsxScope);

    // Get the original JSX element name
    const originalJsxElementName = getJsxElementName(jsxScope);
    if (!originalJsxElementName) {
      continue;
    }

    // Replace the name with the lingo component
    jsxScope.node.openingElement.name = t.jsxIdentifier(
      lingoComponentImport.importedName,
    );
    if (jsxScope.node.closingElement) {
      jsxScope.node.closingElement = null;
      jsxScope.node.children = [];
      jsxScope.node.selfClosing = true;
      jsxScope.node.openingElement.selfClosing = true;
    }

    // Add $as prop
    const as = /^[A-Z]/.test(originalJsxElementName)
      ? t.jsxExpressionContainer(t.identifier(originalJsxElementName))
      : t.stringLiteral(originalJsxElementName);
    jsxScope.node.openingElement.attributes.push(
      t.jsxAttribute(t.jsxIdentifier("$as"), as),
    );

    // Add $fileKey prop
    jsxScope.node.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("$fileKey"),
        t.stringLiteral(payload.fileKey),
      ),
    );

    // Add $entryKey prop
    jsxScope.node.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("$entryKey"),
        t.stringLiteral(getJsxScopeAttribute(jsxScope)!),
      ),
    );

    // Extract $variables from original JSX scope before lingo component was inserted
    const $variables = getJsxVariables(originalJsxScope);
    if ($variables.properties.length > 0) {
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$variables"),
          t.jsxExpressionContainer($variables),
        ),
      );
    }

    // Extract nested JSX elements
    const $elements = getNestedJsxElements(originalJsxScope);
    if ($elements.elements.length > 0) {
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$elements"),
          t.jsxExpressionContainer($elements),
        ),
      );
    }

    // Extract nested functions
    const $functions = getJsxFunctions(originalJsxScope);
    if ($functions.properties.length > 0) {
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$functions"),
          t.jsxExpressionContainer($functions),
        ),
      );
    }

    // Extract expressions
    const $expressions = getJsxExpressions(originalJsxScope);
    if ($expressions.elements.length > 0) {
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$expressions"),
          t.jsxExpressionContainer($expressions),
        ),
      );
    }

    if (mode === "server") {
      // Add $loadDictionary prop
      const loadDictionaryImport = getOrCreateImport(payload.ast, {
        exportedName: "loadDictionary",
        moduleName: ModuleId.ReactRSC,
      });
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$loadDictionary"),
          t.jsxExpressionContainer(
            t.arrowFunctionExpression(
              [t.identifier("locale")],
              t.callExpression(
                t.identifier(loadDictionaryImport.importedName),
                [t.identifier("locale")],
              ),
            ),
          ),
        ),
      );
    }
  }

  return payload;
});
