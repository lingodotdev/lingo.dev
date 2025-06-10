import path from "path";
import { createCodeMutation } from "./_base";
import { LCP_DICTIONARY_FILE_NAME, ModuleId } from "./_const";
import { getModuleExecutionMode, getOrCreateImport } from "./utils";
import { findInvokations } from "./utils/invokations";
import * as t from "@babel/types";

export const rscDictionaryLoaderMutation = createCodeMutation((payload) => {
  const mode = getModuleExecutionMode(payload.ast, payload.params.rsc);
  if (mode === "client") {
    return payload;
  }

  const invokations = findInvokations(payload.ast, {
    moduleName: ModuleId.ReactRSC,
    functionName: "loadDictionary",
  });

  const allLocales = Array.from(
    new Set([payload.params.sourceLocale, ...payload.params.targetLocales]),
  );

  for (const invokation of invokations) {
    const internalDictionaryLoader = getOrCreateImport(payload.ast, {
      moduleName: ModuleId.ReactRSC,
      exportedName: "loadDictionary_internal",
    });

    // Replace the function identifier with internal version
    if (t.isIdentifier(invokation.callee)) {
      invokation.callee.name = internalDictionaryLoader.importedName;
    }

    const relativePath = path.relative(
      payload.fileKey,
      path.resolve(
        payload.params.sourceRoot,
        payload.params.lingoDir,
        LCP_DICTIONARY_FILE_NAME,
      ),
    );

    // Create locale import map object
    const localeImportMap = t.objectExpression(
      allLocales.map((locale) =>
        t.objectProperty(
          t.identifier(locale),
          t.arrowFunctionExpression(
            [],
            t.callExpression(t.identifier("import"), [
              t.stringLiteral(`${relativePath}?locale=${locale}`),
            ]),
          ),
        ),
      ),
    );

    // Add the locale import map as the second argument
    invokation.arguments.push(localeImportMap);
  }

  return payload;
});
