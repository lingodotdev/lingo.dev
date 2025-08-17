import { createUnplugin } from "unplugin";
import type { NextConfig } from "next";
import packageJson from "../package.json";
import _ from "lodash";
import dedent from "dedent";
import { defaultParams } from "./_base";
import { LCP_DICTIONARY_FILE_NAME } from "./_const";
import { LCPCache } from "./lib/lcp/cache";
import { getInvalidLocales } from "./utils/locales";
import {
  getGroqKeyFromEnv,
  getGroqKeyFromRc,
  getGoogleKeyFromEnv,
  getGoogleKeyFromRc,
  getMistralKeyFromEnv,
  getMistralKeyFromRc,
  getLingoDotDevKeyFromEnv,
  getLingoDotDevKeyFromRc,
} from "./utils/llm-api-key";
import { isRunningInCIOrDocker } from "./utils/env";
import { providerDetails } from "./lib/lcp/api/provider-details";
import { loadDictionary, transformComponent } from "./_loader-utils";
import trackEvent from "./utils/observability";

const keyCheckers: Record<
  string,
  {
    checkEnv: () => string | undefined;
    checkRc: () => string | undefined;
  }
> = {
  groq: {
    checkEnv: getGroqKeyFromEnv,
    checkRc: getGroqKeyFromRc,
  },
  google: {
    checkEnv: getGoogleKeyFromEnv,
    checkRc: getGoogleKeyFromRc,
  },
  mistral: {
    checkEnv: getMistralKeyFromEnv,
    checkRc: getMistralKeyFromRc,
  },
  "lingo.dev": {
    checkEnv: getLingoDotDevKeyFromEnv,
    checkRc: getLingoDotDevKeyFromRc,
  },
};

const alreadySentBuildEvent = { value: false };

function sendBuildEvent(framework: string, config: any, isDev: boolean) {
  if (alreadySentBuildEvent.value) return;
  alreadySentBuildEvent.value = true;
  trackEvent("compiler.build.start", {
    framework,
    configuration: config,
    isDevMode: isDev,
  });
}

const unplugin = createUnplugin<Partial<typeof defaultParams> | undefined>(
  (_params, _meta) => {
    console.log("ℹ️  Starting Lingo.dev compiler...");

    const params = _.defaults(_params, defaultParams);

    // Validate if not in CI or Docker
    if (!isRunningInCIOrDocker()) {
      if (params.models === "lingo.dev") {
        validateLLMKeyDetails(["lingo.dev"]);
      } else {
        const configuredProviders = getConfiguredProviders(params.models);
        validateLLMKeyDetails(configuredProviders);

        const invalidLocales = getInvalidLocales(
          params.models,
          params.sourceLocale,
          params.targetLocales,
        );
        if (invalidLocales.length > 0) {
          console.log(dedent`
            \n
            ⚠️  Lingo.dev Localization Compiler requires LLM model setup for the following locales: ${invalidLocales.join(
              ", ",
            )}.

            ⭐️ Next steps:
            1. Refer to documentation for help: https://lingo.dev/compiler
            2. If you want to use a different LLM, raise an issue in our open-source repo: https://lingo.dev/go/gh
            3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

            ✨
          `);
          process.exit(1);
        }
      }
    }

    LCPCache.ensureDictionaryFile({
      sourceRoot: params.sourceRoot,
      lingoDir: params.lingoDir,
    });

    const isDev: boolean =
      "dev" in _meta ? !!_meta.dev : process.env.NODE_ENV !== "production";
    sendBuildEvent("unplugin", params, isDev);

    return {
      name: packageJson.name,
      loadInclude: (id) => !!id.match(LCP_DICTIONARY_FILE_NAME),
      async load(id) {
        const dictionary = await loadDictionary({
          resourcePath: id,
          resourceQuery: "",
          params: {
            ...params,
            models: params.models,
            sourceLocale: params.sourceLocale,
            targetLocales: params.targetLocales,
          },
          sourceRoot: params.sourceRoot,
          lingoDir: params.lingoDir,
          isDev,
        });

        if (!dictionary) {
          return null;
        }

        return {
          code: `export default ${JSON.stringify(dictionary, null, 2)}`,
        };
      },
      transformInclude: (id) => id.endsWith(".tsx") || id.endsWith(".jsx"),
      enforce: "pre",
      transform(code, id) {
        try {
          const result = transformComponent({
            code,
            params,
            resourcePath: id,
            sourceRoot: params.sourceRoot,
          });

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
  /**
   * Initializes Lingo.dev Compiler for Next.js (App Router).
   *
   * @param compilerParams - The compiler parameters.
   *
   * @returns The Next.js configuration.
   *
   * @example Configuration for Next.js's default template
   * ```ts
   * import lingoCompiler from "lingo.dev/compiler";
   * import type { NextConfig } from "next";
   *
   * const nextConfig: NextConfig = {
   *   /* config options here *\/
   * };
   *
   * export default lingoCompiler.next({
   *   sourceRoot: "app",
   *   models: "lingo.dev",
   * })(nextConfig);
   * ```
   */
  next:
    (
      compilerParams?: Partial<typeof defaultParams> & {
        turbopack?: {
          enabled?: boolean | "auto";
          useLegacyTurbo?: boolean;
        };
      },
    ) =>
    (nextConfig: any = {}): NextConfig => {
      const mergedParams = _.merge(
        {},
        defaultParams,
        {
          rsc: true,
          turbopack: {
            enabled: "auto",
            useLegacyTurbo: false,
          },
        },
        compilerParams,
      );

      const isDev = process.env.NODE_ENV !== "production";
      sendBuildEvent("Next.js", mergedParams, isDev);

      let turbopackEnabled: boolean;
      if (mergedParams.turbopack?.enabled === "auto") {
        turbopackEnabled =
          process.env.TURBOPACK === "1" || process.env.TURBOPACK === "true";
      } else {
        turbopackEnabled = mergedParams.turbopack?.enabled === true;
      }

      const supportLegacyTurbo: boolean =
        mergedParams.turbopack?.useLegacyTurbo === true;

      const hasWebpackConfig = typeof nextConfig.webpack === "function";
      const hasTurbopackConfig = typeof nextConfig.turbopack === "function";
      if (hasWebpackConfig && turbopackEnabled) {
        console.warn(
          "⚠️  Turbopack is enabled in the Lingo.dev compiler, but you have webpack config. Lingo.dev will still apply turbopack configuration.",
        );
      }
      if (hasTurbopackConfig && !turbopackEnabled) {
        console.warn(
          "⚠️  Turbopack is disabled in the Lingo.dev compiler, but you have turbopack config. Lingo.dev will not apply turbopack configuration.",
        );
      }

      // Webpack
      const originalWebpack = nextConfig.webpack;
      nextConfig.webpack = (config: any, options: any) => {
        if (!turbopackEnabled) {
          console.log("Applying Lingo.dev webpack configuration...");
          config.plugins.unshift(unplugin.webpack(mergedParams));
        }

        if (typeof originalWebpack === "function") {
          return originalWebpack(config, options);
        }
        return config;
      };

      // Turbopack
      if (turbopackEnabled) {
        console.log("Applying Lingo.dev Turbopack configuration...");

        // Check if the legacy turbo flag is set
        let turbopackConfigPath = (nextConfig.turbopack ??= {});
        if (supportLegacyTurbo) {
          turbopackConfigPath = (nextConfig.experimental ??= {}).turbo ??= {};
        }

        turbopackConfigPath.rules ??= {};
        const rules = turbopackConfigPath.rules;

        // Regex for all relevant files for Lingo.dev
        const lingoGlob = `**/*.{ts,tsx,js,jsx}`;

        // The .cjs extension is required for Next.js v14
        const lingoLoaderPath = require.resolve("./lingo-turbopack-loader.cjs");

        rules[lingoGlob] = {
          loaders: [
            {
              loader: lingoLoaderPath,
              options: mergedParams,
            },
          ],
        };
      }

      return nextConfig;
    },
  /**
   * Initializes Lingo.dev Compiler for Vite.
   *
   * @param compilerParams - The compiler parameters.
   *
   * @returns The Vite configuration.
   *
   * @example Configuration for Vite's "react-ts" template
   * ```ts
   * import { defineConfig, type UserConfig } from "vite";
   * import react from "@vitejs/plugin-react";
   * import lingoCompiler from "lingo.dev/compiler";
   *
   * // https://vite.dev/config/
   * const viteConfig: UserConfig = {
   *   plugins: [react()],
   * };
   *
   * export default defineConfig(() =>
   *   lingoCompiler.vite({
   *     models: "lingo.dev",
   *   })(viteConfig)
   * );
   * ```
   *
   * @example Configuration for React Router's default template
   * ```ts
   * import { reactRouter } from "@react-router/dev/vite";
   * import tailwindcss from "@tailwindcss/vite";
   * import lingoCompiler from "lingo.dev/compiler";
   * import { defineConfig, type UserConfig } from "vite";
   * import tsconfigPaths from "vite-tsconfig-paths";
   *
   * const viteConfig: UserConfig = {
   *   plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
   * };
   *
   * export default defineConfig(() =>
   *   lingoCompiler.vite({
   *     sourceRoot: "app",
   *     models: "lingo.dev",
   *   })(viteConfig)
   * );
   * ```
   */
  vite: (compilerParams?: Partial<typeof defaultParams>) => (config: any) => {
    const mergedParams = _.merge(
      {},
      defaultParams,
      { rsc: false },
      compilerParams,
    );

    const isDev = process.env.NODE_ENV !== "production";
    const isReactRouter = config.plugins
      ?.flat()
      ?.some((plugin: any) => plugin.name === "react-router");
    const framework = isReactRouter ? "React Router" : "Vite";
    sendBuildEvent(framework, mergedParams, isDev);
    config.plugins.unshift(unplugin.vite(mergedParams));
    return config;
  },
};

/**
 * Extract a list of supported LLM provider IDs from the locale→model mapping.
 * @param models Mapping from locale to "<providerId>:<modelName>" strings.
 */
function getConfiguredProviders(models: Record<string, string>): string[] {
  return _.chain(Object.values(models))
    .map((modelString) => modelString.split(":")[0]) // Extract provider ID
    .filter(Boolean) // Remove empty strings
    .uniq() // Get unique providers
    .filter(
      (providerId) =>
        providerDetails.hasOwnProperty(providerId) &&
        keyCheckers.hasOwnProperty(providerId),
    ) // Only check for known and implemented providers
    .value();
}

/**
 * Print helpful information about where the LLM API keys for configured providers
 * were discovered. The compiler looks for the key first in the environment
 * (incl. .env files) and then in the user-wide configuration. Environment always wins.
 * @param configuredProviders List of provider IDs detected in the configuration.
 */
function validateLLMKeyDetails(configuredProviders: string[]): void {
  if (configuredProviders.length === 0) {
    // No LLM providers configured that we can validate keys for.
    return;
  }

  const keyStatuses: Record<
    string,
    {
      foundInEnv: boolean;
      foundInRc: boolean;
      details: (typeof providerDetails)[string];
    }
  > = {};
  const missingProviders: string[] = [];
  const foundProviders: string[] = [];

  for (const providerId of configuredProviders) {
    const details = providerDetails[providerId];
    const checkers = keyCheckers[providerId];
    if (!details || !checkers) continue; // Should not happen due to filter above

    const foundInEnv = !!checkers.checkEnv();
    const foundInRc = !!checkers.checkRc();

    keyStatuses[providerId] = { foundInEnv, foundInRc, details };

    if (!foundInEnv && !foundInRc) {
      missingProviders.push(providerId);
    } else {
      foundProviders.push(providerId);
    }
  }

  if (missingProviders.length > 0) {
    console.log(dedent`
      \n
      💡 Lingo.dev Localization Compiler is configured to use the following LLM provider(s): ${configuredProviders.join(
        ", ",
      )}.

      The compiler requires API keys for these providers to work, but the following keys are missing:
    `);

    for (const providerId of missingProviders) {
      const status = keyStatuses[providerId];
      if (!status) continue;
      console.log(dedent`
          ⚠️  ${status.details.name} API key is missing. Set ${
            status.details.apiKeyEnvVar
          } environment variable.

          👉 You can set the API key in one of the following ways:
          1. User-wide: Run npx lingo.dev@latest config set ${
            status.details.apiKeyConfigKey || "<config-key-not-available>"
          } <your-api-key>
          2. Project-wide: Add ${
            status.details.apiKeyEnvVar
          }=<your-api-key> to .env file in every project that uses Lingo.dev Localization Compiler
          3. Session-wide: Run export ${
            status.details.apiKeyEnvVar
          }=<your-api-key> in your terminal before running the compiler to set the API key for the current session

          ⭐️ If you don't yet have a ${
            status.details.name
          } API key, get one for free at ${status.details.getKeyLink}
        `);
    }

    console.log(dedent`
      \n
      ⭐️ Also:
      1. If you want to use a different LLM, update your configuration. Refer to documentation for help: https://lingo.dev/compiler
      2. If the model/provider you want to use isn't supported yet, raise an issue in our open-source repo: https://lingo.dev/go/gh
      3. If you have questions, feature requests, or would like to contribute, join our Discord: https://lingo.dev/go/discord

      ✨
    `);
    process.exit(1);
  } else if (foundProviders.length > 0) {
    console.log(dedent`
        \n
        🔑  LLM API keys detected for configured providers: ${foundProviders.join(
          ", ",
        )}.
      `);
    for (const providerId of foundProviders) {
      const status = keyStatuses[providerId];
      if (!status) continue;
      let sourceMessage = "";
      if (status.foundInEnv && status.foundInRc) {
        sourceMessage = `from both environment variables (${status.details.apiKeyEnvVar}) and your user-wide configuration. The key from the environment will be used because it has higher priority.`;
      } else if (status.foundInEnv) {
        sourceMessage = `from environment variables (${status.details.apiKeyEnvVar}).`;
      } else if (status.foundInRc) {
        sourceMessage = `from your user-wide configuration${
          status.details.apiKeyConfigKey
            ? ` (${status.details.apiKeyConfigKey})`
            : ""
        }.`;
      }
      console.log(dedent`
          • ${status.details.name} API key loaded ${sourceMessage}
        `);
    }
    console.log("✨");
  }
}
