/**
 * Vite Plugin for Lingo.dev Compiler
 *
 * Provides:
 * 1. Dev server middleware for on-demand translation generation
 * 2. Build-time pre-generation of translations
 * 3. Babel transformation of JSX
 */

import fs from "fs/promises";
import path from "path";
import { transformComponent } from "./transform";
import type { LoaderConfig } from "../types";
import { handleTranslationRequest } from "./shared-middleware";

// Import types conditionally to avoid build errors
type Plugin = any;
type ViteDevServer = any;

export interface LingoPluginOptions extends Omit<LoaderConfig, "isDev"> {
  /**
   * Locales to pre-generate during build
   * @default [] - Generate none at build time
   */
  preGenerateLocales?: string[];
}

/**
 * Vite plugin for Lingo.dev compiler
 */
export function lingoPlugin(options: LingoPluginOptions): Plugin {
  let server: ViteDevServer | undefined;
  const config: LoaderConfig = {
    ...options,
    isDev: false, // Will be set correctly in configResolved
  };

  return {
    name: "lingo-compiler",

    configResolved(resolvedConfig: any) {
      config.isDev = resolvedConfig.mode === "development";
    },

    configureServer(devServer: any) {
      server = devServer;

      // Add middleware for translation API in dev mode
      devServer.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url;

        // Handle /api/translations/:locale
        const match = url?.match(/^\/api\/translations\/(\w+)$/);
        if (!match) {
          return next();
        }

        const locale = match[1];

        // Use shared middleware handler
        const response = await handleTranslationRequest(locale, {
          sourceRoot: config.sourceRoot,
          lingoDir: config.lingoDir,
          sourceLocale: config.sourceLocale,
          translator: config.translator,
          allowProductionGeneration: true, // Always allow in dev mode
        });

        // Adapt response to Vite middleware format
        res.statusCode = response.status;
        Object.entries(response.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.end(response.body);
      });
    },

    async transform(code: string, id: string) {
      // Only transform .tsx and .jsx files
      if (!id.match(/\.(tsx|jsx)$/)) {
        return null;
      }

      // Skip node_modules
      if (id.includes("node_modules")) {
        return null;
      }

      try {
        // Get relative path from sourceRoot
        const relativePath = path.relative(
          path.join(process.cwd(), config.sourceRoot),
          id,
        );

        // Load or initialize metadata
        const metadataPath = path.join(
          process.cwd(),
          config.sourceRoot,
          config.lingoDir,
          "metadata.json",
        );

        let metadata: any;
        try {
          const metadataContent = await fs.readFile(metadataPath, "utf-8");
          metadata = JSON.parse(metadataContent);
        } catch {
          metadata = {
            version: "0.1",
            entries: {},
            stats: {
              totalEntries: 0,
              lastUpdated: new Date().toISOString(),
            },
          };
        }

        // Transform the code
        const result = transformComponent({
          code,
          filePath: id,
          config,
          metadata,
        });

        // Save updated metadata
        if (result.newEntries && result.newEntries.length > 0) {
          await fs.mkdir(path.dirname(metadataPath), { recursive: true });
          await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        }

        return {
          code: result.code,
          map: result.map,
        };
      } catch (error) {
        console.error(`[lingo.dev/vite] Transform error in ${id}:`, error);
        return null;
      }
    },

    async buildEnd() {
      // Pre-generate translations for specified locales during build
      if (!config.isDev && options.preGenerateLocales?.length) {
        console.log(
          "[lingo.dev/vite] Pre-generating translations for build...",
        );

        for (const locale of options.preGenerateLocales) {
          try {
            // Use shared middleware handler to generate translations
            const response = await handleTranslationRequest(locale, {
              sourceRoot: config.sourceRoot,
              lingoDir: config.lingoDir,
              sourceLocale: config.sourceLocale,
              translator: config.translator,
              allowProductionGeneration: true, // Allow generation during build
            });

            if (response.status !== 200) {
              console.error(
                `[lingo.dev/vite] Failed to pre-generate ${locale}: ${response.body}`,
              );
            }
          } catch (error) {
            console.error(
              `[lingo.dev/vite] Failed to pre-generate ${locale}:`,
              error,
            );
          }
        }
      }
    },
  };
}
