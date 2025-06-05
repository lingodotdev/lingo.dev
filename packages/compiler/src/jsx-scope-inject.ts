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

    // Get the original JSX element name
    const originalJsxElementName = getJsxElementName(jsxScope);
    if (!originalJsxElementName) {
      continue;
    }

    // Build new attributes array, preserving all original attributes
    const originalAttributes = jsxScope.node.openingElement.attributes.slice();

    // Add $as prop
    const as = /^[A-Z]/.test(originalJsxElementName)
      ? t.jsxExpressionContainer(t.identifier(originalJsxElementName))
      : t.stringLiteral(originalJsxElementName);
    originalAttributes.push(t.jsxAttribute(t.jsxIdentifier("$as"), as));
    // Add $fileKey prop
    originalAttributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("$fileKey"),
        t.stringLiteral(payload.fileKey),
      ),
    );
    // Add $entryKey prop
    originalAttributes.push(
      t.jsxAttribute(
        t.jsxIdentifier("$entryKey"),
        t.stringLiteral(getJsxScopeAttribute(jsxScope)!),
      ),
    );

    // Extract $variables from original JSX scope before lingo component was inserted
    const $variables = getJsxVariables(jsxScope);
    if ($variables.properties.length > 0) {
      originalAttributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$variables"),
          t.jsxExpressionContainer($variables),
        ),
      );
    }
    // Extract nested JSX elements
    const $elements = getNestedJsxElements(jsxScope);
    if ($elements.elements.length > 0) {
      originalAttributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$elements"),
          t.jsxExpressionContainer($elements),
        ),
      );
    }
    // Extract nested functions
    const $functions = getJsxFunctions(jsxScope);
    if ($functions.properties.length > 0) {
      originalAttributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$functions"),
          t.jsxExpressionContainer($functions),
        ),
      );
    }
    // Extract expressions
    const $expressions = getJsxExpressions(jsxScope);
    if ($expressions.elements.length > 0) {
      originalAttributes.push(
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
      originalAttributes.push(
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

    // Create new JSXElement (self-closing)
    const newNode = t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier(lingoComponentImport.importedName),
        originalAttributes,
        true, // selfClosing
      ),
      null, // no closing element
      [], // no children
      true, // selfClosing
    );

    jsxScope.replaceWith(newNode);
  }

  return payload;
});
