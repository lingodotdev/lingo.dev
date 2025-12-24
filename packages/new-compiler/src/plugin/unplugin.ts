import { createUnplugin } from "unplugin";
import { transformComponent } from "./transform";
import type {
  LingoConfig,
  LingoInternalFields,
  PartialLingoConfig,
} from "../types";
import {
  startTranslationServer,
  type TranslationServer,
} from "../translation-server";
import {
  cleanupExistingMetadata,
  getMetadataPath as rawGetMetadataPath,
  MetadataManager,
} from "../metadata/manager";
import { createLingoConfig } from "../utils/config-factory";
import { logger } from "../utils/logger";
import { useI18nRegex } from "./transform/use-i18n";
import {
  generateClientLocaleModule,
  generateConfigModule,
  generateServerLocaleModule,
} from "../virtual/code-generator";
import { processBuildTranslations } from "./build-translator";
import { registerCleanupOnCurrentProcess } from "./cleanup";
import path from "path";
import fs from "fs";

export type LingoPluginOptions = PartialLingoConfig;

let translationServer: TranslationServer;

const PLUGIN_NAME = "lingo-compiler";

function tryLocalOrReturnVirtual(
  config: LingoConfig,
  fileName: string,
  virtualName: string,
) {
  const customPath = path.join(config.sourceRoot, config.lingoDir, fileName);
  if (fs.existsSync(customPath)) {
    return customPath;
  }
  return virtualName;
}

/**
 * Single source of truth for virtual modules
 * Each entry defines both resolver (import path → virtual ID) and loader (virtual ID → code)
 *
 * If customFileCheck is defined, the specified file will be first searched for, and if not found virtual module will be used.
 */
const virtualModules = {
  "@lingo.dev/compiler/virtual/config": {
    virtualId: "\0virtual:lingo-config",
    loader: (config: LingoConfig) => generateConfigModule(config),
    customFileCheck: undefined,
  },
  "@lingo.dev/compiler/virtual/locale/server": {
    virtualId: "\0virtual:locale-resolver.server" as const,
    loader: (config: LingoConfig) => generateServerLocaleModule(config),
    customFileCheck: "locale-resolver.server.ts" as const,
  },
  "@lingo.dev/compiler/virtual/locale/client": {
    virtualId: "\0virtual:locale-resolver.client" as const,
    loader: (config: LingoConfig) => generateClientLocaleModule(config),
    customFileCheck: "locale-resolver.client.ts" as const,
  },
} as const;

// Derive resolver and loader maps from the single source
const virtualModulesResolvers = Object.fromEntries(
  Object.entries(virtualModules).map(([importPath, module]) => [
    importPath,
    (config: LingoConfig) =>
      module.customFileCheck
        ? tryLocalOrReturnVirtual(
            config,
            module.customFileCheck,
            module.virtualId,
          )
        : module.virtualId,
  ]),
);

const virtualModulesLoaders = Object.fromEntries(
  Object.values(virtualModules).map((value) => [value.virtualId, value.loader]),
);

/**
 * Universal plugin for Lingo.dev compiler
 * Supports Vite, Webpack
 */
export const lingoUnplugin = createUnplugin<
  LingoPluginOptions & Partial<Pick<LingoConfig, LingoInternalFields>>
>((options) => {
  const config = createLingoConfig(options);

  // Won't work for webpack most likely. Use mode there to set correct environment in configs.
  const isDev = config.environment === "development";
  const startPort = config.dev.translationServerStartPort;

  // For webpack: store the actual mode and use it to compute the correct metadata path
  let webpackMode: "development" | "production" | undefined;
  // Should be dynamic, because webpack only tells us the mode inside the plugin, not inside the config.
  const getMetadataPath = () => {
    return rawGetMetadataPath(
      webpackMode ? { ...config, environment: webpackMode } : config,
    );
  };

  async function startServer() {
    const server = await startTranslationServer({
      startPort,
      onError: (err) => {
        logger.error("Translation server error:", err);
      },
      onReady: (port) => {
        logger.info(`Translation server started successfully on port: ${port}`);
      },
      config,
    });
    // I don't like this quite a lot. But starting server inside the loader seems lame.
    config.dev.translationServerUrl = server.getUrl();
    registerCleanupOnCurrentProcess({
      asyncCleanup: async () => {
        await translationServer.stop();
      },
    });
    return server;
  }

  return {
    name: PLUGIN_NAME,
    enforce: "pre", // Run before other plugins (especially before React plugin)

    vite: {
      // Vite handles deep merge
      config() {
        // Required for custom virtual like modules to be resolved; otherwise they are bundled with raw source code.
        return {
          optimizeDeps: {
            exclude: ["@lingo.dev/compiler"],
          },
        };
      },
      async buildStart() {
        const metadataFilePath = getMetadataPath();

        cleanupExistingMetadata(metadataFilePath);
        registerCleanupOnCurrentProcess({
          cleanup: () => cleanupExistingMetadata(metadataFilePath),
        });

        if (isDev && !translationServer) {
          translationServer = await startServer();
        }
      },

      async buildEnd() {
        const metadataFilePath = getMetadataPath();
        if (!isDev) {
          try {
            await processBuildTranslations({
              config,
              publicOutputPath: "public/translations",
              metadataFilePath,
            });
          } catch (error) {
            logger.error("Build-time translation processing failed:", error);
          }
        }
      },
    },

    webpack(compiler) {
      webpackMode =
        compiler.options.mode === "development" ? "development" : "production";
      const metadataFilePath = getMetadataPath();
      // Yes, this is dirty play, but webpack runs only for this plugin, and this way we save people from using wrong config
      config.environment = webpackMode;

      compiler.hooks.initialize.tap(PLUGIN_NAME, () => {
        cleanupExistingMetadata(metadataFilePath);
        registerCleanupOnCurrentProcess({
          cleanup: () => cleanupExistingMetadata(metadataFilePath),
        });
      });

      compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
        if (webpackMode === "development" && !translationServer) {
          translationServer = await startServer();
        }
      });

      compiler.hooks.additionalPass.tapPromise(PLUGIN_NAME, async () => {
        if (webpackMode === "production") {
          try {
            await processBuildTranslations({
              config,
              publicOutputPath: "public/translations",
              metadataFilePath,
            });
          } catch (error) {
            logger.error("Build-time translation processing failed:", error);
            throw error;
          }
        }
      });

      // Duplicates the cleanup process handlers does, but won't hurt since cleanup is idempotent.
      compiler.hooks.shutdown.tapPromise(PLUGIN_NAME, async () => {
        cleanupExistingMetadata(metadataFilePath);
        await translationServer?.stop();
      });
    },

    resolveId(id) {
      const handler = virtualModulesResolvers[id];
      if (handler) {
        return handler(config);
      }
      return null;
    },

    load: {
      filter: {
        // Without the filter webpack goes mad
        id: /virtual:/,
      },
      handler(id: string) {
        const handler = virtualModulesLoaders[id];
        if (handler) {
          return handler(config);
        }
        return null;
      },
    },

    transform: {
      filter: {
        id: {
          include: [/\.[tj]sx$/],
          exclude: /node_modules/,
        },
        // If useDirective is enabled, only process files with "use i18n"
        // This is more efficient than checking in the handler
        code: config.useDirective ? useI18nRegex : undefined,
      },
      async handler(code, id) {
        try {
          // Transform the component
          const result = transformComponent({
            code,
            filePath: id,
            config,
          });

          // If no transformation occurred, return original code
          if (!result.transformed) {
            logger.debug(`No transformation needed for ${id}`);
            return null;
          }
          const metadataManager = new MetadataManager(getMetadataPath());

          // Update metadata with new entries (thread-safe)
          if (result.newEntries && result.newEntries.length > 0) {
            await metadataManager.saveMetadataWithEntries(result.newEntries);

            logger.debug(
              `Found ${result.newEntries.length} translatable text(s) in ${id}`,
            );
          }

          logger.debug(`Returning transformed code for ${id}`);
          return {
            code: result.code,
            map: result.map,
          };
        } catch (error) {
          logger.error(`Transform error in ${id}:`, error);
          return null;
        }
      },
    },
  };
});
