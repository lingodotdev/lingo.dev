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
import { setJsxAttributeValue } from "./utils/jsx-attribute";

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

    // Create new JSXElement with original attributes
    const newNode = t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier(lingoComponentImport.importedName),
        jsxScope.node.openingElement.attributes.slice(), // original attributes
        true, // selfClosing
      ),
      null, // no closing element
      [], // no children
      true, // selfClosing
    );

    // Create a NodePath wrapper for the new node to use setJsxAttributeValue
    const newNodePath = {
      node: newNode,
    } as any;

    // Add $as prop
    const as = /^[A-Z]/.test(originalJsxElementName)
      ? t.identifier(originalJsxElementName)
      : originalJsxElementName;
    setJsxAttributeValue(newNodePath, "$as", as);

    // Add $fileKey prop
    setJsxAttributeValue(newNodePath, "$fileKey", payload.relativeFilePath);

    // Add $entryKey prop
    setJsxAttributeValue(
      newNodePath,
      "$entryKey",
      getJsxScopeAttribute(jsxScope)!,
    );

    // Extract $variables from original JSX scope before lingo component was inserted
    const $variables = getJsxVariables(jsxScope);
    if ($variables.properties.length > 0) {
      setJsxAttributeValue(newNodePath, "$variables", $variables);
    }

    // Extract nested JSX elements
    const $elements = getNestedJsxElements(jsxScope);
    if ($elements.elements.length > 0) {
      setJsxAttributeValue(newNodePath, "$elements", $elements);
    }

    // Extract nested functions
    const $functions = getJsxFunctions(jsxScope);
    if ($functions.properties.length > 0) {
      setJsxAttributeValue(newNodePath, "$functions", $functions);
    }

    // Extract expressions
    const $expressions = getJsxExpressions(jsxScope);
    if ($expressions.elements.length > 0) {
      setJsxAttributeValue(newNodePath, "$expressions", $expressions);
    }

    if (mode === "server") {
      // Add $loadDictionary prop
      const loadDictionaryImport = getOrCreateImport(payload.ast, {
        exportedName: "loadDictionary",
        moduleName: ModuleId.ReactRSC,
      });
      setJsxAttributeValue(
        newNodePath,
        "$loadDictionary",
        t.arrowFunctionExpression(
          [t.identifier("locale")],
          t.callExpression(t.identifier(loadDictionaryImport.importedName), [
            t.identifier("locale"),
          ]),
        ),
      );
    }

    jsxScope.replaceWith(newNode);
  }

  return payload;
});
