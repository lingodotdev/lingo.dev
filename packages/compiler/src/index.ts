import { createUnplugin } from "unplugin";
import type { NextConfig } from "next";
import packageJson from "../package.json";
import _ from "lodash";
import dedent from "dedent";
import {
  composeMutations,
  createPayload,
  createOutput,
  defaultParams,
} from "./_base";
import i18nDirectiveMutation from "./i18n-directive";
import jsxProviderMutation from "./jsx-provider";
import jsxRootFlagMutation from "./jsx-root-flag";
import jsxScopeFlagMutation from "./jsx-scope-flag";
import jsxAttributeFlagMutation from "./jsx-attribute-flag";
import path from "path";
import fs from "fs";
import { parseParametrizedModuleId } from "./utils/module-params";
import { LCP } from "./lib/lcp";
import { LCPServer } from "./lib/lcp/server";
import { rscDictionaryLoaderMutation } from "./rsc-dictionary-loader";
import { reactRouterDictionaryLoaderMutation } from "./react-router-dictionary-loader";
import { jsxFragmentMutation } from "./jsx-fragment";
import { jsxHtmlLangMutation } from "./jsx-html-lang";
import { jsxAttributeScopesExportMutation } from "./jsx-attribute-scopes-export";
import { jsxScopesExportMutation } from "./jsx-scopes-export";
import { lingoJsxAttributeScopeInjectMutation } from "./jsx-attribute-scope-inject";
import { lingoJsxScopeInjectMutation } from "./jsx-scope-inject";
import { jsxRemoveAttributesMutation } from "./jsx-remove-attributes";
import { LCP_DICTIONARY_FILE_NAME } from "./_const";
import { LCPCache } from "./lib/lcp/cache";
import { getInvalidLocales } from "./utils/locales";
import { clientDictionaryLoaderMutation } from "./client-dictionary-loader";
import { getGroqKeyFromEnv, getGroqKeyFromRc } from "./utils/llm-api-key";
import { isRunningInCIOrDocker } from "./utils/env";

const unplugin = createUnplugin<Partial<typeof defaultParams> | undefined>(
  (_params, _meta) => {
    console.log("ℹ️  Starting Lingo.dev compiler...");

    // Validate if not in CI or Docker
    if (!isRunningInCIOrDocker()) {
      validateGroqKeyDetails();
    }
    // Continue
    const params = _.defaults(_params, defaultParams);

    const invalidLocales = getInvalidLocales(
      params.models,
      params.sourceLocale,
      params.targetLocales,
    );
    if (invalidLocales.length > 0) {
      console.log(dedent`
        \n
        ⚠️  Lingo.dev Localization Compiler requires LLM model setup for the following locales: ${invalidLocales.join(", ")}.

        ⭐️ Next steps:
        1. Refer to documentation for help: https://docs.lingo.dev/
        2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
        3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

        ✨
      `);
      process.exit(1);
    }

    LCPCache.ensureDictionaryFile({
      sourceRoot: params.sourceRoot,
      lingoDir: params.lingoDir,
    });

    return {
      name: packageJson.name,
      loadInclude: (id) => !!id.match(LCP_DICTIONARY_FILE_NAME),
      async load(id) {
        const moduleInfo = parseParametrizedModuleId(id);

        const lcpParams = {
          sourceRoot: params.sourceRoot,
          lingoDir: params.lingoDir,
        };

        // wait for LCP file to be generated
        await LCP.ready(lcpParams);
        const lcp = LCP.getInstance(lcpParams);

        const dictionaries = await LCPServer.loadDictionaries({
          models: params.models,
          lcp: lcp.data,
          sourceLocale: params.sourceLocale,
          targetLocales: params.targetLocales,
          sourceRoot: params.sourceRoot,
          lingoDir: params.lingoDir,
        });
        const dictionary = dictionaries[moduleInfo.params.locale];

        return {
          code: `export default ${JSON.stringify(dictionary, null, 2)}`,
        };
      },
      transformInclude: (id) => id.endsWith(".tsx") || id.endsWith(".jsx"),
      enforce: "pre",
      transform(code, id) {
        try {
          const result = _.chain({
            code,
            params,
            fileKey: path
              .relative(path.resolve(process.cwd(), params.sourceRoot), id)
              .split(path.sep)
              .join("/"), // Always normalize for consistent dictionaries
          })
            .thru(createPayload)
            .thru(
              composeMutations(
                i18nDirectiveMutation,
                jsxFragmentMutation,
                jsxAttributeFlagMutation,

                // log here to see transformedfiles
                // (input) => {
                //   console.log(`transform ${id}`);
                //   return input;
                // },

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

          return result;
        } catch (error) {
          console.error("⚠️  Lingo.dev compiler failed to localize your app");
          console.error("⚠️  Details:", error);

          return code;
        }
      },
    };
  },
);

export default {
  next:
    (compilerParams?: Partial<typeof defaultParams>) =>
    (nextConfig: any): NextConfig => ({
      ...nextConfig,
      // what if we already have a webpack config?
      webpack: (config, { isServer }) => {
        config.plugins.unshift(
          unplugin.webpack(
            _.merge({}, defaultParams, { rsc: true }, compilerParams),
          ),
        );
        return config;
      },
    }),
  vite: (compilerParams?: Partial<typeof defaultParams>) => (config: any) => {
    config.plugins.unshift(
      unplugin.vite(_.merge({}, defaultParams, { rsc: false }, compilerParams)),
    );
    return config;
  },
};

/**
 * Print helpful information about where the GROQ API key was discovered.
 * The compiler looks for the key first in the environment (incl. .env files)
 * and then in the user-wide configuration. Environment always wins.
 */
function validateGroqKeyDetails(): void {
  const groq = {
    fromEnv: getGroqKeyFromEnv(),
    fromRc: getGroqKeyFromRc(),
  };

  if (!groq.fromEnv && !groq.fromRc) {
    console.log(dedent`
      \n
      💡 You're using Lingo.dev Localization Compiler in your project, which requires a GROQ API key to work.

      👉 You can set the API key in one of the following ways:
      1. User-wide: Run npx lingo.dev@latest config set llm.groqApiKey <your-api-key>
      2. Project-wide: Add GROQ_API_KEY=<your-api-key> to .env file in every project that uses Lingo.dev Localization Compiler
      3. Session-wide: Run export GROQ_API_KEY=<your-api-key> in your terminal before running the compiler to set the API key for the current session

      ⭐️ Also:
      1. If you don't yet have a GROQ API key, get one for free at https://groq.com
      2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
      3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

      ✨
    `);
    process.exit(1);
  } else if (groq.fromEnv && groq.fromRc) {
    console.log(
      dedent`
        🔑  GROQ API key detected in both environment variables and your user-wide configuration.

        👉  The compiler will use the key from the environment because it has higher priority.

        • To update the user-wide key run: npx lingo.dev@latest config set llm.groqApiKey <your-api-key>
        • To remove it run: npx lingo.dev@latest config unset llm.groqApiKey
        • To remove the env variable from the current session run: unset GROQ_API_KEY
      `,
    );
  } else if (groq.fromEnv && !groq.fromRc) {
    console.log(
      dedent`
        🔑  GROQ API key loaded from environment variables.

        • You can also save the key user-wide with: npx lingo.dev@latest config set llm.groqApiKey <your-api-key>
        • Or remove the env variable from the current session with: unset GROQ_API_KEY
      `,
    );
  } else if (!groq.fromEnv && groq.fromRc) {
    console.log(
      dedent`
        🔑  GROQ API key loaded from your user-wide configuration.
      `,
    );
  }
}
