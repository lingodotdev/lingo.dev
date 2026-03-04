#!/usr/bin/env node

import { parseArgs } from "node:util";
import type { LingoConfig } from "../types";
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
  env?: "development" | "production";
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
      env: { type: "string" },
    },
    allowPositionals: false,
  });

  const parsedSourceLocale = values["source-locale"]
    ? parseLocaleOrThrow(values["source-locale"])
    : undefined;
  const parsedTargetLocales = values["target-locales"]
    ?.split(",")
    .map((s) => parseLocaleOrThrow(s));

  const env = values.env as "development" | "production" | undefined;
  if (env && env !== "development" && env !== "production") {
    throw new Error(
      `Invalid --env value: "${env}". Must be "development" or "production"`,
    );
  }

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
    env,
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
 * Merge CLI options with config file and defaults
 */
function buildConfig(cliOpts: CLIOptions): LingoConfig {
  const sourceLocale = cliOpts.sourceLocale;
  const targetLocales = cliOpts.targetLocales;
  if (!sourceLocale || !targetLocales) {
    throw new Error(
      `Missing required sourceLocale or targetLocales. Please provide via CLI options or ensure your config uses the Lingo plugin`,
    );
  }
  return createLingoConfig({
    sourceLocale,
    targetLocales,
    lingoDir: cliOpts.lingoDir,
    sourceRoot: cliOpts.sourceRoot || process.cwd(),
    models: cliOpts.models,
    prompt: cliOpts.prompt,
    environment: cliOpts.env || "development",
    dev: {
      usePseudotranslator: cliOpts.usePseudo,
      translationServerStartPort: cliOpts.port,
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
  # Run script from the project root where next or vite configuration is present.
  pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts [options]

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
  --env <string>               Environment: "development" or "production" (default: "development")
  --config <path>              Path to config file (JSON)
  --help                       Show this help message

Examples:
  # Run script from the project root where next or vite configuration is present.
  # Start with defaults
  pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts --port 3456 --target-locales "es,fr,de,ja"

  # Custom port and locales
  pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts --port 3456 --target-locales "es,fr,de,ja" --port 3456 --target-locales "es,fr,de,ja"

  # Use Lingo.dev Engine
  LINGODOTDEV_API_KEY=your-key pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts --port 3456 --target-locales "es,fr,de,ja" --models lingo.dev

  # Use custom LLM models
  pnpm tsx ../../packages/new-compiler/src/translation-server/cli.ts --port 3456 --target-locales "es,fr,de,ja" --models "es:groq:llama3-70b,fr:google:gemini-pro"

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
    checkNodeVersion();

    const cliOpts = parseCliArgs();

    if (cliOpts.help) {
      showHelp();
      process.exit(0);
    }

    // Build final configuration
    const config = buildConfig(cliOpts);

    // Determine final port: CLI option > config > default
    const startPort =
      cliOpts.port || config.dev?.translationServerStartPort || 60000;

    // Log configuration
    logger.info("Starting translation server with configuration:");
    logger.info(`  Port: ${startPort}`);
    logger.info(`  Environment: ${config.environment}`);
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
      config,
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
    logger.error(
      "Failed to start the translation server:",
      error instanceof Error ? error.message : "Unknown error",
    );
    process.exit(1);
  }
}

main();
