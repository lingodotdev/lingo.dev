import path from "path";
import prettier, { Options } from "prettier";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

export type PrettierLoaderOptions = {
  parser: Options["parser"];
  bucketPathPattern: string;
  stage?: "pull" | "push" | "both";
  alwaysFormat?: boolean;
};

export default function createPrettierLoader(
  options: PrettierLoaderOptions,
): ILoader<string, string> {
  return createLoader({
    async pull(locale, data) {
      if (!["pull", "both"].includes(options.stage!)) {
        return data;
      }

      const draftPath = options.bucketPathPattern.replaceAll(
        "[locale]",
        locale,
      );
      const finalPath = path.resolve(draftPath);

      return await formatDataWithPrettier(data, finalPath, options);
    },
    async push(locale, data) {
      if (!["push", "both"].includes(options.stage!)) {
        return data;
      }

      const draftPath = options.bucketPathPattern.replaceAll(
        "[locale]",
        locale,
      );
      const finalPath = path.resolve(draftPath);

      return await formatDataWithPrettier(data, finalPath, options);
    },
  });
}

async function loadPrettierConfig(filePath: string) {
  try {
    const config = await prettier.resolveConfig(filePath);
    return config;
  } catch (error) {
    return {};
  }
}

async function formatDataWithPrettier(
  data: string,
  filePath: string,
  options: PrettierLoaderOptions,
): Promise<string> {
  const prettierConfig = await loadPrettierConfig(filePath);

  // Skip formatting if no config found and alwaysFormat is not enabled
  if (!prettierConfig && !options.alwaysFormat) {
    return data;
  }

  const config: Options = {
    ...(prettierConfig || { printWidth: 2500, bracketSameLine: false }),
    parser: options.parser,
    // For HTML parser, preserve comments and quotes
    ...(options.parser === "html"
      ? {
          htmlWhitespaceSensitivity: "ignore",
          singleQuote: false,
          embeddedLanguageFormatting: "off",
        }
      : {}),
  };

  try {
    // format with prettier
    return await prettier.format(data, config);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Cannot find package")
    ) {
      console.log();
      console.log(
        "⚠️  Prettier plugins are not installed. Formatting without plugins.",
      );
      console.log(
        "⚠️  To use prettier plugins install project dependencies before running Lingo.dev.",
      );

      config.plugins = [];

      // clear file system structure cache
      await prettier.clearConfigCache();

      // format again without plugins
      return await prettier.format(data, config);
    }

    throw error;
  }
}
