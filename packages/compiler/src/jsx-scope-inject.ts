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

    // Get the original JSX element name
    const originalJsxElementName = getJsxElementName(jsxScope);
    if (!originalJsxElementName) {
      continue;
    }

    // Check if this is a component (uppercase or member expression)
    const isMemberExpression = originalJsxElementName.includes(".");
    const isComponent = /^[A-Z]/.test(originalJsxElementName);
    const isReactComponent = isMemberExpression || isComponent;

    // Import LingoComponent based on the module execution mode
    const packagePath =
      mode === "client" ? ModuleId.ReactClient : ModuleId.ReactRSC;
    const lingoComponentImport = getOrCreateImport(payload.ast, {
      moduleName: packagePath,
      exportedName: "LingoComponent",
    });

    if (isReactComponent) {
      // For React components, wrap children instead of replacing the component
      // This preserves the component type for React.Children APIs
      const lingoTextImport = getOrCreateImport(payload.ast, {
        moduleName: packagePath,
        exportedName: "LingoText",
      });

      // Create LingoText element with translation data
      const lingoTextNode = t.jsxElement(
        t.jsxOpeningElement(
          t.jsxIdentifier(lingoTextImport.importedName),
          [],
          true,
        ),
        null,
        [],
        true,
      );

      const lingoTextNodePath = { node: lingoTextNode } as any;

      // Add translation metadata to LingoText
      setJsxAttributeValue(lingoTextNodePath, "$fileKey", payload.relativeFilePath);
      setJsxAttributeValue(lingoTextNodePath, "$entryKey", getJsxScopeAttribute(jsxScope)!);

      const $variables = getJsxVariables(jsxScope);
      if ($variables.properties.length > 0) {
        setJsxAttributeValue(lingoTextNodePath, "$variables", $variables);
      }

      const $functions = getJsxFunctions(jsxScope);
      if ($functions.properties.length > 0) {
        setJsxAttributeValue(lingoTextNodePath, "$functions", $functions);
      }

      const $expressions = getJsxExpressions(jsxScope);
      if ($expressions.elements.length > 0) {
        setJsxAttributeValue(lingoTextNodePath, "$expressions", $expressions);
      }

      if (mode === "server") {
        const loadDictionaryImport = getOrCreateImport(payload.ast, {
          exportedName: "loadDictionary",
          moduleName: ModuleId.ReactRSC,
        });
        setJsxAttributeValue(
          lingoTextNodePath,
          "$loadDictionary",
          t.arrowFunctionExpression(
            [t.identifier("locale")],
            t.callExpression(t.identifier(loadDictionaryImport.importedName), [
              t.identifier("locale"),
            ]),
          ),
        );
      }

      // Replace only the text children with LingoText, keeping the component wrapper
      jsxScope.node.children = [lingoTextNode];
    } else {
      // For HTML elements, use the existing approach (replace entire element)
      const newNode = t.jsxElement(
        t.jsxOpeningElement(
          t.jsxIdentifier(lingoComponentImport.importedName),
          jsxScope.node.openingElement.attributes.slice(),
          true,
        ),
        null,
        [],
        true,
      );

      const newNodePath = { node: newNode } as any;

      setJsxAttributeValue(newNodePath, "$as", originalJsxElementName);
      setJsxAttributeValue(newNodePath, "$fileKey", payload.relativeFilePath);
      setJsxAttributeValue(newNodePath, "$entryKey", getJsxScopeAttribute(jsxScope)!);

      const $variables = getJsxVariables(jsxScope);
      if ($variables.properties.length > 0) {
        setJsxAttributeValue(newNodePath, "$variables", $variables);
      }

      const $elements = getNestedJsxElements(jsxScope);
      if ($elements.elements.length > 0) {
        setJsxAttributeValue(newNodePath, "$elements", $elements);
      }

      const $functions = getJsxFunctions(jsxScope);
      if ($functions.properties.length > 0) {
        setJsxAttributeValue(newNodePath, "$functions", $functions);
      }

      const $expressions = getJsxExpressions(jsxScope);
      if ($expressions.elements.length > 0) {
        setJsxAttributeValue(newNodePath, "$expressions", $expressions);
      }

      if (mode === "server") {
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
  }

  return payload;
});
