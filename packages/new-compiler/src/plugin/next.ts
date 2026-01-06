import type { NextConfig } from "next";
import type {
  NextJsWebpackConfig,
  TurbopackOptions,
  WebpackConfigContext,
} from "next/dist/server/config-shared";
import { createLingoConfig } from "../utils/config-factory";
import { logger } from "../utils/logger";
import type { LingoConfig, PartialLingoConfig } from "../types";
import { processBuildTranslations } from "./build-translator";
import { startOrGetTranslationServer } from "../translation-server/translation-server";
import { cleanupExistingMetadata, getMetadataPath } from "../metadata/manager";
import { registerCleanupOnCurrentProcess } from "./cleanup";
import { useI18nRegex } from "./transform/use-i18n";
import { TranslationService } from "../translators";

export type LingoNextPluginOptions = PartialLingoConfig;

type RuleKey = "compiler" | "devConfig" | "localeServer" | "localeClient";

function loaders({
  lingoConfig,
  metadataFilePath,
  translationServerUrl,
}: {
  lingoConfig: LingoConfig;
  metadataFilePath: string;
  translationServerUrl?: string;
}): Record<RuleKey, { turbopack?: any; webpack?: any }> {
  const common = {
    sourceRoot: lingoConfig.sourceRoot,
    lingoDir: lingoConfig.lingoDir,
    sourceLocale: lingoConfig.sourceLocale,
  };

  // TODO (AleksandrSl 14/12/2025): Type options.
  const compilerLoader = {
    loader: "@lingo.dev/compiler/next-compiler-loader",
    options: {
      ...common,
      useDirective: lingoConfig.useDirective,
      metadataFilePath,
    },
  };

  const configLoader = {
    loader: "@lingo.dev/compiler/next-config-loader",
    options: {
      ...common,
      dev: {
        translationServerUrl,
        ...lingoConfig.dev,
      },
    },
  };
  const localeServerLoader = {
    loader: "@lingo.dev/compiler/next-locale-server-loader",
    options: {
      ...common,
      localePersistence: lingoConfig.localePersistence,
    },
  };

  const localeClientLoader = {
    loader: "@lingo.dev/compiler/next-locale-client-loader",
    options: {
      ...common,
      localePersistence: lingoConfig.localePersistence,
    },
  };

  return {
    compiler: {
      turbopack: {
        pattern: "*.{tsx,jsx}",
        config: {
          condition: {
            content: lingoConfig.useDirective ? useI18nRegex : undefined,
          },
          loaders: [compilerLoader],
        },
      },
      webpack: {
        enforce: "pre",
        test: /\.(tsx|jsx)$/i,
        exclude: /node_modules/,
        use: [compilerLoader],
      },
    },

    devConfig: translationServerUrl
      ? {
          turbopack: {
            pattern: "**/virtual/config.mjs",
            config: {
              loaders: [configLoader],
            },
          },
          webpack: {
            enforce: "pre",
            test: /virtual\/config\.mjs$/i,
            use: [configLoader],
          },
        }
      : {},

    localeServer: {
      turbopack: {
        pattern: "**/virtual/locale/server.mjs",
        config: {
          loaders: [localeServerLoader],
        },
      },
      webpack: {
        enforce: "pre",
        test: /virtual\/locale[\\/]server\.mjs$/i,
        use: [localeServerLoader],
      },
    },

    localeClient: {
      turbopack: {
        pattern: "**/virtual/locale/client.mjs",
        config: {
          loaders: [localeClientLoader],
        },
      },
      webpack: {
        enforce: "pre",
        test: /virtual\/locale[\\/]client\.mjs$/i,
        use: [localeClientLoader],
      },
    },
  };
}

/**
 * Check if Next.js supports stable turbopack config (Next.js 16+)
 */
function hasStableTurboConfig(): boolean {
  try {
    const nextPackage = require("next/package.json");
    const majorVersion = parseInt(nextPackage.version.split(".")[0], 10);
    return majorVersion >= 16;
  } catch {
    return false;
  }
}

function getTurbopackConfig(userConfig: NextConfig): TurbopackOptions {
  return (
    (hasStableTurboConfig()
      ? userConfig?.turbopack?.rules
      : // @ts-expect-error - experimental.turbo for Next.js <16
        userConfig?.experimental?.turbo) || {}
  );
}

/**
 * Merge Turbopack rules without mutating original
 */
function mergeTurbopackRules(
  existingRules: Record<string, any>,
  newRules: ({ pattern: string; config: any } | undefined)[],
): Record<string, any> {
  const mergedRules = { ...existingRules };

  for (const newRule of newRules) {
    if (!newRule) continue;
    const { pattern, config } = newRule;

    if (mergedRules[pattern]) {
      if (Array.isArray(mergedRules[pattern])) {
        mergedRules[pattern] = [...mergedRules[pattern], config];
      } else {
        mergedRules[pattern] = [mergedRules[pattern], config];
      }
    } else {
      mergedRules[pattern] = config;
    }
  }

  return mergedRules;
}

// Next read config several times. Once in the main runner,
// and ~ twice in the build workers which cannot get the config otherwise, because it's not serializable.
// Workers start in separate processed by get most of the env from the main loader
function isMainRunner() {
  return (
    !process.env.NEXT_PRIVATE_BUILD_WORKER &&
    !process.env.IS_NEXT_WORKER &&
    !process.env.NEXT_PRIVATE_WORKER
  );
}

export async function withLingo(
  nextConfig: NextConfig = {},
  lingoOptions: LingoNextPluginOptions,
): Promise<NextConfig> {
  const lingoConfig = createLingoConfig(lingoOptions);
  let metadataFilePath = getMetadataPath(lingoConfig);
  const isDev = lingoConfig.environment === "development";

  logger.debug(
    `Initializing Lingo.dev compiler. Is dev mode: ${isDev}. Is main runner: ${isMainRunner()}`,
  );

  // Try to start up the translation server once.
  // We have two barriers, a simple one here and a more complex one inside the startTranslationServer which doesn't start the server if it can find one running.
  // We do not use isMainRunner here, because we need to start the server as early as possible, so the loaders get the translation server url. The main runner in dev mode runs after a dev server process is started.
  if (isDev && !process.env.LINGO_TRANSLATION_SERVER_URL) {
    const translationServer = await startOrGetTranslationServer({
      translationService: new TranslationService(lingoConfig, logger),
      onError: (err) => {
        logger.error("Translation server error:", err);
      },
      onReady: (port) => {
        logger.info(`Translation server started successfully on port: ${port}`);
      },
      config: lingoConfig,
    });
    process.env.LINGO_TRANSLATION_SERVER_URL = translationServer.url;
    if (translationServer.server) {
      // We start the server in the same process, so we should be fine without any sync cleanup. Server should be killed with the process.
      registerCleanupOnCurrentProcess({
        asyncCleanup: async () => {
          await translationServer.server.stop();
        },
      });
    }
  }

  const translationServerUrl = process.env.LINGO_TRANSLATION_SERVER_URL;

  if (isMainRunner()) {
    // We need to cleaup the file only once, to avoid having extra translation introduced into the build, or old translation to pile up.
    cleanupExistingMetadata(metadataFilePath);

    registerCleanupOnCurrentProcess({
      cleanup: () => {
        cleanupExistingMetadata(metadataFilePath);
      },
    });
  }

  const existingTurbopackConfig = getTurbopackConfig(nextConfig);
  let mergedRules = mergeTurbopackRules(
    existingTurbopackConfig.rules ?? {},
    Object.values(
      loaders({ lingoConfig, metadataFilePath, translationServerUrl }),
    ).map((rules) => rules.turbopack),
  );

  const existingResolveAlias = existingTurbopackConfig.resolveAlias;
  const mergedResolveAlias = {
    ...existingResolveAlias,
    // TODO (AleksandrSl 08/12/2025): Describe what have to be done to support custom resolvers
  };

  let turbopackConfig: Partial<NextConfig>;
  if (hasStableTurboConfig()) {
    turbopackConfig = {
      turbopack: {
        ...nextConfig.turbopack, // Preserve existing turbopack options
        rules: mergedRules,
        resolveAlias: mergedResolveAlias,
      },
    };
  } else {
    turbopackConfig = {
      experimental: {
        ...nextConfig.experimental, // Preserve ALL experimental options
        // @ts-expect-error - turbo for Next.js <16
        turbo: {
          // @ts-expect-error - turbo for Next.js <16
          ...nextConfig.experimental?.turbo, // Preserve existing turbo options
          rules: mergedRules,
          resolveAlias: mergedResolveAlias,
        },
      },
    };
  }

  const runAfterProductionCompile = async ({
    distDir,
    projectDir,
  }: {
    distDir: string;
    projectDir: string;
  }) => {
    if (typeof nextConfig.compiler?.runAfterProductionCompile === "function") {
      await nextConfig.compiler.runAfterProductionCompile({
        distDir,
        projectDir,
      });
    }

    logger.info("Running post-build translation generation...");

    try {
      await processBuildTranslations({
        config: lingoConfig,
        publicOutputPath: distDir,
        metadataFilePath,
      });
    } catch (error) {
      logger.error(
        "Translation generation failed:",
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  };

  const webpack: NextJsWebpackConfig = (
    config: any,
    options: WebpackConfigContext,
  ) => {
    // Apply user's webpack config first if it exists
    let modifiedConfig = config;
    if (typeof nextConfig.webpack === "function") {
      modifiedConfig = nextConfig.webpack(config, options);
    }

    const lingoRules = Object.values(
      loaders({ lingoConfig, metadataFilePath, translationServerUrl }),
    )
      .map((rules) => rules.webpack)
      .filter(Boolean);

    // I tried using plugin from unplugin, but with all the loaders stuff it works poorly.
    // Failing with weird errors which appear on the later compilations, probably something with the cache and virtual modules
    modifiedConfig.module.rules.unshift(...lingoRules);

    return modifiedConfig;
  };

  return {
    ...nextConfig,
    ...turbopackConfig,
    compiler: {
      ...nextConfig.compiler,
      runAfterProductionCompile,
    },
    webpack,
  };
}
