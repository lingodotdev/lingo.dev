import {
  composeMutations,
  createPayload,
  createOutput,
  CompilerParams,
  defaultParams,
} from "./_base";
import i18nDirectiveMutation from "./i18n-directive";
import jsxProviderMutation from "./jsx-provider";
import jsxRootFlagMutation from "./jsx-root-flag";
import jsxScopeFlagMutation from "./jsx-scope-flag";
import jsxAttributeFlagMutation from "./jsx-attribute-flag";
import path from "path";
import { rscDictionaryLoaderMutation } from "./rsc-dictionary-loader";
import { reactRouterDictionaryLoaderMutation } from "./react-router-dictionary-loader";
import { jsxFragmentMutation } from "./jsx-fragment";
import { jsxHtmlLangMutation } from "./jsx-html-lang";
import { jsxAttributeScopesExportMutation } from "./jsx-attribute-scopes-export";
import { jsxScopesExportMutation } from "./jsx-scopes-export";
import { lingoJsxAttributeScopeInjectMutation } from "./jsx-attribute-scope-inject";
import { lingoJsxScopeInjectMutation } from "./jsx-scope-inject";
import { jsxRemoveAttributesMutation } from "./jsx-remove-attributes";
import { clientDictionaryLoaderMutation } from "./client-dictionary-loader";
import _ from "lodash";

export default async function (this: any, source: string) {
  const callback = this.async();
  const options = this.getOptions();
  const id = this.resourcePath;

  const params: CompilerParams = _.merge({}, defaultParams, options);

  try {
    const result = _.chain({
      code: source,
      params,
      relativeFilePath: path
        .relative(path.resolve(process.cwd(), params.sourceRoot), id)
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
          jsxAttributeFlagMutation,
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

    callback(null, result.code, result.map ? JSON.stringify(result.map) : undefined);
  } catch (error) {
    console.error("⚠️  Lingo.dev compiler (Turbopack) failed to localize your app");
    console.error("⚠️  Details:", error);
    callback(error as Error);
  }
}
