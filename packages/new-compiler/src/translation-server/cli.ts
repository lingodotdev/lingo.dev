#!/usr/bin/env node
/**
 * CLI entry point for running translation server as standalone process
 *
 * Requirements: Node.js 18.3.0 or higher (for parseArgs support)
 *
 * Usage:
 *   npx @lingo.dev/compiler/translation-server [options]
 *
 * Options:
 *   --port <number>              Port to start server on (default: 60000)
 *   --source-locale <string>     Source locale (default: "en")
 *   --target-locales <string>    Comma-separated target locales (default: "es,fr,de")
 *   --lingo-dir <string>         Lingo directory path (default: ".lingo")
 *   --source-root <string>       Source root directory (default: cwd)
 *   --models <string>            Models config: "lingo.dev" or "locale:provider:model" format
 *   --prompt <string>            Custom translation prompt
 *   --timeout <number>           Request timeout in ms (default: 30000)
 *   --use-pseudo                 Use pseudotranslator (default: false)
 *   --config <path>              Path to config file (JSON)
 *   --help                       Show this help message
 *
 * Examples:
 *   # Start with defaults
 *   npx @lingo.dev/compiler/translation-server
 *
 *   # Custom port and locales
 *   npx @lingo.dev/compiler/translation-server --port 3456 --target-locales "es,fr,de,ja"
 *
 *   # Use Lingo.dev Engine
 *   LINGODOTDEV_API_KEY=your-key npx @lingo.dev/compiler/translation-server --models lingo.dev
 *
 *   # Use custom LLM models
 *   npx @lingo.dev/compiler/translation-server --models "es:groq:llama3-70b,fr:google:gemini-pro"
 *
 *   # Load from config file
 *   npx @lingo.dev/compiler/translation-server --config ./lingo.config.json
 */

import { parseArgs } from "node:util";
import { access } from "fs/promises";
import { join } from "path";
import { pathToFileURL } from "url";
import type {
  LingoConfig,
  PartialLingoConfig,
  TranslationMiddlewareConfig,
} from "../types";
import type { LingoNextPluginOptions } from "../plugin/next";
import { logger } from "../utils/logger";
import { startOrGetTranslationServer } from "./translation-server";
import { createLingoConfig } from "../utils/config-factory";
import { type LocaleCode } from "lingo.dev/spec";
import { parseLocaleOrThrow } from "../utils/is-valid-locale";

interface CLIOptions {
  port?: number;
  sourceLocale?: LocaleCode;
  targetLocales?: LocaleCode[];
  lingoDir?: string;
  sourceRoot?: string;
  models?: "lingo.dev" | Record<string, string>;
  prompt?: string;
  timeout?: number;
  usePseudo?: boolean;
  config?: string;
  help?: boolean;
}

/**
 * Parse CLI arguments
 */
function parseCliArgs(): CLIOptions {
  const { values } = parseArgs({
    options: {
      port: { type: "string" },
      "source-locale": { type: "string" },
      "target-locales": { type: "string" },
      "lingo-dir": { type: "string" },
      "source-root": { type: "string" },
      models: { type: "string" },
      prompt: { type: "string" },
      timeout: { type: "string" },
      "use-pseudo": { type: "boolean" },
      config: { type: "string" },
      help: { type: "boolean" },
    },
    allowPositionals: false,
  });

  const parsedSourceLocale = parseLocaleOrThrow(values["source-locale"]);
  const parsedTargetLocales = values["target-locales"]
    ?.split(",")
    .map((s) => parseLocaleOrThrow(s));

  return {
    port: values.port ? parseInt(values.port, 10) : undefined,
    sourceLocale: parsedSourceLocale,
    targetLocales: parsedTargetLocales,
    lingoDir: values["lingo-dir"],
    sourceRoot: values["source-root"],
    models: values.models ? parseModelsString(values.models) : undefined,
    prompt: values.prompt,
    timeout: values.timeout ? parseInt(values.timeout, 10) : undefined,
    usePseudo: values["use-pseudo"],
    config: values.config,
    help: values.help,
  };
}

/**
 * Parse models string into config format
 * Supports:
 * - "lingo.dev" -> "lingo.dev"
 * - "es:groq:llama3-70b,fr:google:gemini-pro" -> { es: "groq:llama3-70b", fr: "google:gemini-pro" }
 */
function parseModelsString(
  modelsStr: string,
): "lingo.dev" | Record<string, string> {
  if (modelsStr === "lingo.dev") {
    return "lingo.dev";
  }

  const models: Record<string, string> = {};
  const pairs = modelsStr.split(",");

  for (const pair of pairs) {
    const parts = pair.trim().split(":");
    if (parts.length >= 3) {
      const [locale, provider, model] = parts;
      models[locale] = `${provider}:${model}`;
    } else {
      throw new Error(
        `Invalid models format: "${pair}". Expected format: "locale:provider:model"`,
      );
    }
  }

  return models;
}

/**
 * Detect and find bundler config file
 */
async function findBundlerConfig(
  cwd: string = process.cwd(),
): Promise<{ type: "next" | "vite"; path: string } | null> {
  // Next.js config files (in priority order)
  const nextConfigs = [
    "next.config.ts",
    "next.config.mjs",
    "next.config.js",
    "next.config.cjs",
  ];

  // Vite config files (in priority order)
  const viteConfigs = [
    "vite.config.ts",
    "vite.config.mts",
    "vite.config.js",
    "vite.config.mjs",
  ];

  // Check Next.js configs
  for (const configFile of nextConfigs) {
    const configPath = join(cwd, configFile);
    try {
      await access(configPath);
      return { type: "next", path: configPath };
    } catch {
      // File doesn't exist, continue
    }
  }

  // Check Vite configs
  for (const configFile of viteConfigs) {
    const configPath = join(cwd, configFile);
    try {
      await access(configPath);
      return { type: "vite", path: configPath };
    } catch {
      // File doesn't exist, continue
    }
  }

  return null;
}

/**
 * Extract Lingo configuration from Next.js config
 */
function extractNextLingoConfig(
  nextConfig: any,
): Partial<LingoNextPluginOptions> | null {
  // Next.js config is typically wrapped with withLingo(config, lingoOptions)
  // The withLingo function attaches the original lingoOptions to _lingoConfig

  if (nextConfig._lingoConfig) {
    logger.debug("Found _lingoConfig in Next.js config");
    return nextConfig._lingoConfig;
  }

  logger.debug("No _lingoConfig found in Next.js config");
  return null;
}

/**
 * Extract Lingo configuration from Vite config
 */
function extractViteLingoConfig(
  viteConfig: any,
): Partial<TranslationMiddlewareConfig> | null {
  // Vite config has plugins array
  if (!viteConfig.plugins || !Array.isArray(viteConfig.plugins)) {
    logger.debug("No plugins array found in Vite config");
    return null;
  }

  logger.debug(`Searching through ${viteConfig.plugins.length} Vite plugins`);

  // Find the lingo plugin
  for (const plugin of viteConfig.plugins) {
    if (
      plugin &&
      (plugin.name === "lingo-compiler" || plugin.name === "lingo")
    ) {
      logger.debug(`Found lingo plugin: ${plugin.name}`);
      // Plugin has config attached via _lingoConfig
      if (plugin._lingoConfig) {
        logger.debug("Found _lingoConfig in Vite plugin");
        return plugin._lingoConfig;
      }
    }
  }

  logger.debug("No lingo plugin with _lingoConfig found");
  return null;
}

/**
 * Load and parse bundler config file
 */
async function loadBundlerConfig(
  cwd: string = process.cwd(),
): Promise<PartialLingoConfig | null> {
  const detected = await findBundlerConfig(cwd);

  if (!detected) {
    logger.debug("No bundler config found");
    return null;
  }

  logger.info(`Found ${detected.type} config: ${detected.path}`);

  try {
    // Use dynamic import to load the config
    const configUrl = pathToFileURL(detected.path).href;
    const configModule = await import(configUrl);

    // Get the default export
    const config = configModule.default;

    // Handle async configs
    const resolvedConfig =
      typeof config === "function" ? await config() : config;

    // Extract Lingo configuration based on bundler type
    if (detected.type === "next") {
      const lingoConfig = extractNextLingoConfig(resolvedConfig);
      if (lingoConfig) {
        logger.info("Extracted Lingo configuration from Next.js config");
        return lingoConfig as PartialLingoConfig;
      }
    } else if (detected.type === "vite") {
      const lingoConfig = extractViteLingoConfig(resolvedConfig);
      if (lingoConfig) {
        logger.info("Extracted Lingo configuration from Vite config");
        return lingoConfig as PartialLingoConfig;
      }
    }

    logger.warn(
      `Found ${detected.type} config but could not extract Lingo configuration`,
    );
    logger.warn(
      "Please provide configuration via CLI options or ensure your config uses the Lingo plugin",
    );
    return null;
  } catch (error) {
    logger.error(`Failed to load bundler config:`, error);
    return null;
  }
}

/**
 * Merge CLI options with config file and defaults
 */
function buildConfig(
  cliOpts: CLIOptions,
  fileConfig?: PartialLingoConfig,
): LingoConfig {
  const sourceLocale = cliOpts.sourceLocale || fileConfig?.sourceLocale;
  const targetLocales = cliOpts.targetLocales || fileConfig?.targetLocales;
  if (!sourceLocale || !targetLocales) {
    throw new Error(
      `Missing required sourceLocale or targetLocales. Please provide via CLI options or ensure your config uses the Lingo plugin`,
    );
  }
  // Priority: CLI > config file > defaults
  return createLingoConfig({
    sourceLocale,
    targetLocales,
    lingoDir: cliOpts.lingoDir || fileConfig?.lingoDir,
    sourceRoot: cliOpts.sourceRoot || fileConfig?.sourceRoot || process.cwd(),
    models: cliOpts.models || fileConfig?.models,
    prompt: cliOpts.prompt || fileConfig?.prompt,
    dev: {
      usePseudotranslator:
        cliOpts.usePseudo ?? fileConfig?.dev?.usePseudotranslator,
      translationServerStartPort: fileConfig?.dev?.translationServerStartPort,
    },
  });
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
Translation Server CLI

Usage:
  npx @lingo.dev/compiler/translation-server [options]

Options:
  --port <number>              Port to start server on (default: 60000)
  --source-locale <string>     Source locale (default: "en")
  --target-locales <string>    Comma-separated target locales (default: "es,fr,de")
  --lingo-dir <string>         Lingo directory path (default: ".lingo")
  --source-root <string>       Source root directory (default: cwd)
  --models <string>            Models config: "lingo.dev" or "locale:provider:model"
  --prompt <string>            Custom translation prompt
  --timeout <number>           Request timeout in ms (default: 30000)
  --use-pseudo                 Use pseudotranslator (default: false)
  --config <path>              Path to config file (JSON)
  --help                       Show this help message

Examples:
  # Start with defaults
  npx @lingo.dev/compiler/translation-server

  # Custom port and locales
  npx @lingo.dev/compiler/translation-server --port 3456 --target-locales "es,fr,de,ja"

  # Use Lingo.dev Engine
  LINGODOTDEV_API_KEY=your-key npx @lingo.dev/compiler/translation-server --models lingo.dev

  # Use custom LLM models
  npx @lingo.dev/compiler/translation-server --models "es:groq:llama3-70b,fr:google:gemini-pro"

  # Load from config file
  npx @lingo.dev/compiler/translation-server --config ./lingo.config.json

Config File Format (JSON):
  {
    "sourceLocale": "en",
    "targetLocales": ["es", "fr", "de"],
    "lingoDir": ".lingo",
    "sourceRoot": ".",
    "models": "lingo.dev",
    "prompt": "Translate naturally, preserve formatting"
  }

Environment Variables:
  LINGODOTDEV_API_KEY         API key for Lingo.dev Engine
  GROQ_API_KEY                API key for Groq
  GOOGLE_API_KEY              API key for Google AI
  OPENROUTER_API_KEY          API key for OpenRouter
  MISTRAL_API_KEY             API key for Mistral
`);
}

/**
 * Check Node.js version
 */
function checkNodeVersion(): void {
  const nodeVersion = process.version;
  const major = parseInt(nodeVersion.slice(1).split(".")[0], 10);
  const minor = parseInt(nodeVersion.split(".")[1], 10);

  if (major < 18 || (major === 18 && minor < 3)) {
    console.error(
      `❌ Error: Node.js 18.3.0 or higher is required (found ${nodeVersion})`,
    );
    console.error(`   Please upgrade Node.js: https://nodejs.org/`);
    process.exit(1);
  }
}

/**
 * Main CLI entry point
 */
export async function main(): Promise<void> {
  try {
    // Check Node.js version first
    checkNodeVersion();

    const cliOpts = parseCliArgs();

    // Show help if requested
    if (cliOpts.help) {
      showHelp();
      process.exit(0);
    }

    // Try to auto-detect bundler config
    logger.info("Searching for bundler configuration...");
    const fileConfig: PartialLingoConfig | undefined =
      (await loadBundlerConfig()) || undefined;

    if (!fileConfig) {
      logger.info("No bundler config found, using defaults + CLI options");
    }

    // Build final configuration
    const config = buildConfig(cliOpts, fileConfig);

    // Determine final port: CLI option > config > default
    const startPort =
      cliOpts.port || config.dev?.translationServerStartPort || 60000;

    // Log configuration
    logger.info("Starting translation server with configuration:");
    logger.info(`  Port: ${startPort}`);
    logger.info(`  Source Locale: ${config.sourceLocale}`);
    logger.info(`  Target Locales: ${(config.targetLocales || []).join(", ")}`);
    logger.info(`  Lingo Directory: ${config.lingoDir}`);
    logger.info(`  Source Root: ${config.sourceRoot}`);
    logger.info(`  Models: ${JSON.stringify(config.models)}`);
    logger.info(`  Timeout: ${cliOpts.timeout || 30000}ms`);
    if (config.dev?.usePseudotranslator) {
      logger.info(`  Using: Pseudotranslator (dev mode)`);
    }

    // Start server
    const { server, url } = await startOrGetTranslationServer({
      startPort,
      config,
      // requestTimeout: cliOpts.timeout || 30000,
      onError: (err) => {
        logger.error("Translation server error:", err);
      },
      onReady: (port) => {
        logger.info(`Translation server ready on port ${port}`);
      },
    });

    logger.info(`✅ Translation server running at ${url}`);
    logger.info(`Press Ctrl+C to stop`);

    // Handle graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received, shutting down gracefully...`);
      try {
        await server.stop();
        logger.info("Server stopped successfully");
        process.exit(0);
      } catch (error) {
        logger.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error("Failed to start translation server:", error);
    process.exit(1);
  }
}

main();
