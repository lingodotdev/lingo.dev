import path from "path";
import fs from "fs/promises";
import { Biome, Distribution } from "@biomejs/js-api";
import { parse as parseJsonc } from "jsonc-parser";
import { ILoader } from "../_types";
import { createBaseFormatterLoader } from "./_base";

export type BiomeLoaderOptions = {
  bucketPathPattern: string;
  stage?: "pull" | "push" | "both";
  alwaysFormat?: boolean;
};

export default function createBiomeLoader(options: BiomeLoaderOptions): ILoader<string, string> {
  return createBaseFormatterLoader(options, async (data, filePath) => {
    return await formatDataWithBiome(data, filePath, options);
  });
}

async function findBiomeConfig(startPath: string): Promise<string | null> {
  let currentDir = path.dirname(startPath);
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    for (const configName of ["biome.json", "biome.jsonc"]) {
      const configPath = path.join(currentDir, configName);
      try {
        await fs.access(configPath);
        return configPath;
      } catch {
        // Config file doesn't exist, continue searching
      }
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  return null;
}

export async function formatDataWithBiome(
  data: string,
  filePath: string,
  options: BiomeLoaderOptions,
): Promise<string> {
  let configPath: string | null = null;

  try {
    const biome = await Biome.create({
      distribution: Distribution.NODE,
    });

    // Open a project (required in v3.0.0+)
    const openResult = biome.openProject(".");
    const projectKey = openResult.projectKey;

    // Load config from biome.json/biome.jsonc if exists
    configPath = await findBiomeConfig(filePath);
    if (!configPath && !options.alwaysFormat) {
      console.log();
      console.log(`⚠️  Biome config not found for ${path.basename(filePath)} - skipping formatting`);
      return data;
    }

    if (configPath) {
      const configContent = await fs.readFile(configPath, "utf-8");
      let config: Record<string, unknown>;
      try {
        // Parse JSONC (JSON with comments) properly using jsonc-parser
        config = parseJsonc(configContent);
      } catch (parseError) {
        throw new Error(
          `Invalid Biome configuration in ${configPath}: ${parseError instanceof Error ? parseError.message : "JSON parse error"}`,
        );
      }

      // WORKAROUND: Biome JS API v3 has a bug where applying the full config
      // causes formatter settings to be ignored. Apply only relevant sections.
      // Exclude $schema, vcs, and files. Also exclude `plugins`: grit plugins are
      // a Biome CLI-only feature that the embedded js-api `applyConfiguration`
      // rejects on every Biome version (2.3.7–2.5.x). An unhandled rejection here
      // silently disabled formatting entirely, so the project's configured quote
      // style was dropped and files were committed reformatted to defaults.
      const { $schema, vcs, files, plugins, ...relevantConfig } = config;

      applyFormatterConfig(biome, projectKey, relevantConfig, configPath);
    }

    const formatted = biome.formatContent(projectKey, data, {
      filePath,
    });

    return formatted.content;
  } catch (error) {
    // Extract error message from Biome
    const errorMessage =
      error instanceof Error ? error.message || (error as any).stackTrace?.toString().split("\n")[0] : "";

    if (errorMessage?.includes("does not exist in the workspace")) {
      // Biome says "file does not exist in workspace" for unsupported formats - skip
    } else {
      console.log(`⚠️  Biome skipped ${path.basename(filePath)}`);
      if (errorMessage) {
        console.log(`   ${errorMessage}`);
      }
    }

    return data; // Fallback to unformatted
  }
}

// Apply the config, but never let one unsupported/unknown section disable
// formatting for the whole file. `applyConfiguration` throws hard on any key the
// embedded Biome doesn't recognize (this has repeatedly broken users whose
// biome.jsonc uses newer/CLI-only keys). If the full config is rejected, retry
// with a formatter-only subset so the project's quote style and other formatter
// settings are still honored.
function applyFormatterConfig(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  biome: any,
  projectKey: unknown,
  config: Record<string, unknown>,
  configPath: string,
): void {
  try {
    biome.applyConfiguration(projectKey, config);
  } catch {
    const formatterOnly = pickFormatterConfig(config);
    biome.applyConfiguration(projectKey, formatterOnly);
    console.log(
      `⚠️  Biome: ${path.basename(configPath)} has a section the bundled Biome can't apply; used formatter-only settings so formatting still runs.`,
    );
  }
}

// The subset of a Biome config that governs formatting output (quotes, indent,
// etc.). Safe to apply on any Biome version — excludes linter/assist/plugin
// sections that may carry keys the embedded js-api rejects.
function pickFormatterConfig(config: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of ["formatter", "javascript", "json", "css", "graphql"] as const) {
    const section = config[key] as Record<string, unknown> | undefined;
    if (!section) continue;
    if (key === "formatter") {
      out[key] = section;
    } else if (section.formatter) {
      // Keep only the language's formatter block, drop linter/assist/parser bits.
      out[key] = { formatter: section.formatter };
    }
  }
  return out;
}
