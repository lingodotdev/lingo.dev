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
  try {
    const biome = await Biome.create({
      distribution: Distribution.NODE,
    });

    // Load config from biome.json/biome.jsonc if exists
    const configPath = await findBiomeConfig(filePath);
    if (!configPath && !options.alwaysFormat) {
      return data; // Skip if no config and not forced
    }

    if (configPath) {
      const configContent = await fs.readFile(configPath, "utf-8");
      biome.applyConfiguration(JSON.parse(configContent));
    }

    const formatted = biome.formatContent(data, {
      filePath,
    });

    return formatted.content;
  } catch (error) {
    if (error instanceof Error) {
      console.log();
      console.log("⚠️  Biome formatting failed:", error.message);
    }
    return data; // Fallback to unformatted
  }
}
