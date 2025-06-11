import { createCodeMutation } from "./_base";
import { ModuleId } from "./_const";
import { getOrCreateImport } from "./utils";
import { findInvokations } from "./utils/invokations";
import * as t from "@babel/types";
import { getDictionaryPath } from "./_utils";
import { createLocaleImportMap } from "./utils/create-locale-import-map";

export const clientDictionaryLoaderMutation = createCodeMutation((payload) => {
  const invokations = findInvokations(payload.ast, {
    moduleName: ModuleId.ReactClient,
    functionName: "loadDictionary",
  });

  const allLocales = Array.from(
    new Set([payload.params.sourceLocale, ...payload.params.targetLocales]),
  );

  for (const invokation of invokations) {
    const internalDictionaryLoader = getOrCreateImport(payload.ast, {
      moduleName: ModuleId.ReactClient,
      exportedName: "loadDictionary_internal",
    });

    // Replace the function identifier with internal version
    if (t.isIdentifier(invokation.callee)) {
      invokation.callee.name = internalDictionaryLoader.importedName;
    }

    const dictionaryPath = getDictionaryPath({
      sourceRoot: payload.params.sourceRoot,
      lingoDir: payload.params.lingoDir,
      relativeFilePath: payload.relativeFilePath,
    });

    // Create locale import map object
    const localeImportMap = createLocaleImportMap(allLocales, dictionaryPath);

    // Add the locale import map as the second argument
    invokation.arguments.push(localeImportMap);
  }

  return payload;
});
