import path from "path";
import fs from "fs/promises";
import { Biome, Distribution } from "@biomejs/js-api";
import { ILoader } from "../_types";
import { createBaseFormatterLoader } from "./_base";

export type BiomeLoaderOptions = {
  bucketPathPattern: string;
  stage?: "pull" | "push" | "both";
  alwaysFormat?: boolean;
};

// Track warnings shown per file extension to avoid spam
const shownWarnings = new Set<string>();

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
      return data; // Skip if no config and not forced
    }

    if (configPath) {
      const configContent = await fs.readFile(configPath, "utf-8");
      try {
        const config = JSON.parse(configContent);
        biome.applyConfiguration(projectKey, config);
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
    const ext = path.extname(filePath);

    // Only show warning once per file extension
    if (!shownWarnings.has(ext)) {
      shownWarnings.add(ext);

      console.log();
      console.log(
        `⚠️  Biome does not support ${ext} files - skipping formatting`,
      );

      if (error instanceof Error && error.message) {
        console.log(`   ${error.message}`);
      }
    }

    return data; // Fallback to unformatted
  }
}
