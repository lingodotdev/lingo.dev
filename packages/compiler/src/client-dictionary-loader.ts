import path from "path";
import { createCodeMutation } from "./_base";
import { LCP_DICTIONARY_FILE_NAME, ModuleId } from "./_const";
import { getOrCreateImport } from "./utils";
import { findInvokations } from "./utils/invokations";
import * as t from "@babel/types";

export const clientDictionaryLoaderMutation = createCodeMutation((payload) => {
  const lingoDir = path.resolve(
    process.cwd(),
    payload.params.sourceRoot,
    payload.params.lingoDir,
  );
  const currentDir = path.dirname(
    path.resolve(process.cwd(), payload.params.sourceRoot, payload.fileKey),
  );
  const relativeLingoPath = path.relative(currentDir, lingoDir);

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

    // Create locale import map object
    const localeImportMap = t.objectExpression(
      allLocales.map((locale) =>
        t.objectProperty(
          t.identifier(locale),
          t.arrowFunctionExpression(
            [],
            t.callExpression(t.identifier("import"), [
              t.stringLiteral(
                `./${relativeLingoPath}/${LCP_DICTIONARY_FILE_NAME}?locale=${locale}`,
              ),
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
