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

export default function createBiomeLoader(
  options: BiomeLoaderOptions,
): ILoader<string, string> {
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

async function formatDataWithBiome(
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
      console.log(
        `⚠️  Biome config not found for ${path.basename(filePath)} - skipping formatting`,
      );
      return data;
    }

    if (configPath) {
      const configContent = await fs.readFile(configPath, "utf-8");
      try {
        // Parse JSONC (JSON with comments) properly using jsonc-parser
        const config = parseJsonc(configContent);

        // WORKAROUND: Biome JS API v3 has a bug where applying the full config
        // causes formatter settings to be ignored. Apply only relevant sections.
        // Specifically, exclude $schema, vcs, and files from the config.
        const { $schema, vcs, files, ...relevantConfig } = config;

        biome.applyConfiguration(projectKey, relevantConfig);
      } catch (parseError) {
        throw new Error(
          `Invalid Biome configuration in ${configPath}: ${parseError instanceof Error ? parseError.message : "JSON parse error"}`,
        );
      }
    }

    const formatted = biome.formatContent(projectKey, data, {
      filePath,
    });

    return formatted.content;
  } catch (error) {
    // Extract error message from Biome
    const errorMessage =
      error instanceof Error
        ? error.message || (error as any).stackTrace?.toString().split("\n")[0]
        : "";

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
