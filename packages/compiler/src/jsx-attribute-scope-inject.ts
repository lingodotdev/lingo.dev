import { createCodeMutation } from "./_base";
import { getModuleExecutionMode, getOrCreateImport } from "./utils";
import * as t from "@babel/types";
import _ from "lodash";
import { ModuleId } from "./_const";
import { getJsxElementName, getNestedJsxElements } from "./utils/jsx-element";
import { collectJsxAttributeScopes } from "./utils/jsx-attribute-scope";

export const lingoJsxAttributeScopeInjectMutation = createCodeMutation(
  (payload) => {
    const mode = getModuleExecutionMode(payload.ast, payload.params.rsc);
    const jsxAttributeScopes = collectJsxAttributeScopes(payload.ast);

    for (const [jsxScope, attributes] of jsxAttributeScopes) {
      // Import LingoComponent based on the module execution mode
      const packagePath =
        mode === "client" ? ModuleId.ReactClient : ModuleId.ReactRSC;
      const lingoComponentImport = getOrCreateImport(payload.ast, {
        moduleName: packagePath,
        exportedName: "LingoAttributeComponent",
      });

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
        jsxScope.node.closingElement.name = t.jsxIdentifier(
          lingoComponentImport.importedName,
        );
      }

      // Add $attrAs ($as) prop
      const as = /^[A-Z]/.test(originalJsxElementName)
        ? t.jsxExpressionContainer(t.identifier(originalJsxElementName))
        : t.stringLiteral(originalJsxElementName);

      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(t.jsxIdentifier("$attrAs"), as),
      );

      // Add $fileKey prop
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$fileKey"),
          t.stringLiteral(payload.fileKey),
        ),
      );

      // Add $attributes prop
      jsxScope.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("$attributes"),
          t.jsxExpressionContainer(
            t.objectExpression(
              attributes.map((attributeDefinition) => {
                const [attribute, key = ""] = attributeDefinition.split(":");
                return t.objectProperty(
                  t.stringLiteral(attribute),
                  t.stringLiteral(key),
                );
              }),
            ),
          ),
        ),
      );

      // // Extract $variables from original JSX scope
      // const $variables = getJsxVariables(originalJsxScope);
      // if ($variables.properties.length > 0) {
      //   jsxScope.node.openingElement.attributes.push(
      //     t.jsxAttribute(
      //       t.jsxIdentifier("$variables"),
      //       t.jsxExpressionContainer($variables),
      //     ),
      //   );
      // }

      // // Extract nested JSX elements
      // const $elements = getNestedJsxElements(originalJsxScope);
      // if ($elements.elements.length > 0) {
      //   jsxScope.node.openingElement.attributes.push(
      //     t.jsxAttribute(
      //       t.jsxIdentifier("$elements"),
      //       t.jsxExpressionContainer($elements),
      //     ),
      //   );
      // }

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
  },
);
