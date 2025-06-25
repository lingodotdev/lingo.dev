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

/**
 * Loads a dictionary for a specific locale
 */
export async function loadDictionary(options: {
  resourcePath: string;
  resourceQuery?: string;
  params: any;
  sourceRoot: string;
  lingoDir: string;
  isDev: boolean;
}) {
  const {
    resourcePath,
    resourceQuery = "",
    params,
    sourceRoot,
    lingoDir,
    isDev,
  } = options;
  const fullResourcePath = `${resourcePath}${resourceQuery}`;

  if (!resourcePath.match(LCP_DICTIONARY_FILE_NAME)) {
    return null; // Not a dictionary file
  }

  const moduleInfo = parseParametrizedModuleId(fullResourcePath);
  const locale = moduleInfo.params.locale;

  if (!locale) {
    return null; // No locale specified
  }

  const lcpParams = {
    sourceRoot,
    lingoDir,
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

  return dictionary;
}

/**
 * Transforms component code
 */
export function transformComponent(options: {
  code: string;
  params: any;
  resourcePath: string;
  sourceRoot: string;
}) {
  const { code, params, resourcePath, sourceRoot } = options;

  return _.chain({
    code,
    params,
    relativeFilePath: path
      .relative(path.resolve(process.cwd(), sourceRoot), resourcePath)
      .split(path.sep)
      .join("/"), // Always normalize for consistent dictionaries
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
}
