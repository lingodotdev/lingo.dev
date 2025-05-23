import path from "path";
import { Biome, Distribution } from "@biomejs/js-api";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export type BiomeLoaderOptions = {
  parser: string;
  bucketPathPattern: string;
  stage?: "pull" | "push" | "both";
  alwaysFormat?: boolean;
};

export default function createBiomeLoader(
  options: BiomeLoaderOptions,
): ILoader<string, string> {
  const stage = options.stage || "both";
  return createLoader({
    async pull(locale, data) {
      if (!["pull", "both"].includes(stage)) {
        return data;
      }

      const draftPath = options.bucketPathPattern.replaceAll(
        "[locale]",
        locale,
      );
      const finalPath = path.resolve(draftPath);

      return await formatDataWithBiome(data, finalPath, options);
    },
    async push(locale, data) {
      if (!["push", "both"].includes(stage)) {
        return data;
      }

      const draftPath = options.bucketPathPattern.replaceAll(
        "[locale]",
        locale,
      );
      const finalPath = path.resolve(draftPath);

      return await formatDataWithBiome(data, finalPath, options);
    },
  });
}

async function formatDataWithBiome(
  data: string,
  filePath: string,
  options: BiomeLoaderOptions,
): Promise<string> {
  try {
    if (!data.trim()) {
      return data;
    }

    const biome = await Biome.create({
      distribution: Distribution.NODE,
    });

    try {
      const formattedPath = `file.${options.parser}`;
      
      const result = biome.formatContent(data, {
        filePath: formattedPath,
      });

      const hasErrors = result.diagnostics.some(
        (diag) => diag.severity === "fatal" || diag.severity === "error",
      );

      if (hasErrors) {
        return data; // Return original data if there are errors
      }

      return result.content;
    } finally {
      biome.shutdown();
    }
  } catch (error) {
    console.log();
    console.log(
      "⚠️  Biome formatting failed. Returning original content.",
    );
    console.log(error);
    
    return data;
  }
}
