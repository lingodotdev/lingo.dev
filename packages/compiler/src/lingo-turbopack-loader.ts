import _ from "lodash";
import path from "path";
import { composeMutations, createOutput, createPayload } from "./_base";
import { LCP_DICTIONARY_FILE_NAME } from "./_const";
import { clientDictionaryLoaderMutation } from "./client-dictionary-loader";
import i18nDirectiveMutation from "./i18n-directive";
import jsxAttributeFlagMutation from "./jsx-attribute-flag";
import { lingoJsxAttributeScopeInjectMutation } from "./jsx-attribute-scope-inject";
import { jsxAttributeScopesExportMutation } from "./jsx-attribute-scopes-export";
import { jsxFragmentMutation } from "./jsx-fragment";
import { jsxHtmlLangMutation } from "./jsx-html-lang";
import jsxProviderMutation from "./jsx-provider";
import { jsxRemoveAttributesMutation } from "./jsx-remove-attributes";
import jsxRootFlagMutation from "./jsx-root-flag";
import jsxScopeFlagMutation from "./jsx-scope-flag";
import { lingoJsxScopeInjectMutation } from "./jsx-scope-inject";
import { jsxScopesExportMutation } from "./jsx-scopes-export";
import { LCP } from "./lib/lcp";
import { LCPServer } from "./lib/lcp/server";
import { reactRouterDictionaryLoaderMutation } from "./react-router-dictionary-loader";
import { rscDictionaryLoaderMutation } from "./rsc-dictionary-loader";
import { parseParametrizedModuleId } from "./utils/module-params";

// This single loader handles both component transformations and dictionary generation.
export default async function (this: any, source: string) {
  const callback = this.async();
  const params = this.getOptions();
  const fullResourcePath = `${this.resourcePath}${this.resourceQuery || ""}`;

  try {
    // --- Dictionary Loading Logic ---
    if (this.resourcePath.endsWith(LCP_DICTIONARY_FILE_NAME)) {
      const moduleInfo = parseParametrizedModuleId(fullResourcePath);
      const locale = moduleInfo.params.locale;

      if (!locale) {
        return callback(null, source); // Return original if no locale
      }

      const isDev = process.env.NODE_ENV !== "production";
      const lcpParams = {
        sourceRoot: params.sourceRoot,
        lingoDir: params.lingoDir,
        isDev,
      };

      await LCP.ready(lcpParams);
      const lcp = LCP.getInstance(lcpParams);

      const dictionaries = await LCPServer.loadDictionaries({
        ...params,
        lcp: lcp.data,
      });

      const dictionary = dictionaries[locale];
      if (!dictionary) {
        throw new Error(
          `Lingo.dev: Dictionary for locale "${locale}" could not be generated.`,
        );
      }

      const code = `export default ${JSON.stringify(dictionary, null, 2)};`;
      return callback(null, code);
    }

    // --- Component Transformation Logic ---
    const result = _.chain({
      code: source,
      params,
      relativeFilePath: path
        .relative(
          path.resolve(process.cwd(), params.sourceRoot),
          this.resourcePath,
        )
        .split(path.sep)
        .join("/"),
    })
      .thru(createPayload)
      .thru(
        composeMutations(
          i18nDirectiveMutation,
          jsxFragmentMutation,
          jsxAttributeFlagMutation,
          jsxProviderMutation,
          jsxHtmlLangMutation,
          jsxRootFlagMutation,
          jsxScopeFlagMutation,
          jsxAttributeScopesExportMutation,
          jsxScopesExportMutation,
          lingoJsxAttributeScopeInjectMutation,
          lingoJsxScopeInjectMutation,
          rscDictionaryLoaderMutation,
          reactRouterDictionaryLoaderMutation,
          jsxRemoveAttributesMutation,
          clientDictionaryLoaderMutation,
        ),
      )
      .thru(createOutput)
      .value();

    return callback(
      null,
      result.code,
      result.map ? JSON.stringify(result.map) : undefined,
    );
  } catch (error) {
    console.error(
      `⚠️  Lingo.dev compiler (Turbopack) failed for ${this.resourcePath}:`,
    );
    console.error("⚠️  Details:", error);
    callback(error as Error);
  }
}
