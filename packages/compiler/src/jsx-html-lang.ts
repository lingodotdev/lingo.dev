import traverse from "@babel/traverse";
import * as t from "@babel/types";
import { createCodeMutation } from "./_base";
import { getJsxElementName } from "./utils/jsx-element";
import { getModuleExecutionMode, getOrCreateImport } from "./utils";
import { ModuleId } from "./_const";

export const jsxHtmlLangMutation = createCodeMutation((payload) => {
  traverse(payload.ast, {
    JSXElement: (path) => {
      if (getJsxElementName(path)?.toLowerCase() === "html") {
        const mode = getModuleExecutionMode(payload.ast, payload.params.rsc);
        const packagePath =
          mode === "client" ? ModuleId.ReactClient : ModuleId.ReactRSC;
        const lingoHtmlComponentImport = getOrCreateImport(payload.ast, {
          moduleName: packagePath,
          exportedName: "LingoHtmlComponent",
        });

        path.node.openingElement.name = t.jsxIdentifier(
          lingoHtmlComponentImport.importedName,
        );
        if (path.node.closingElement) {
          path.node.closingElement.name = t.jsxIdentifier(
            lingoHtmlComponentImport.importedName,
          );
        }

        path.skip();
      }
    },
  });

  return payload;
});
