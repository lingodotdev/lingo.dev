import fs from "fs";
import path from "path";
import prettier, { Options } from "prettier";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";
import { execSync } from "child_process";

export type PrettierLoaderOptions = {
  parser: Options["parser"];
  bucketPathPattern: string;
  alwaysFormat?: boolean;
};

export default function createPrettierLoader(options: PrettierLoaderOptions): ILoader<string, string> {
  return createLoader({
    async pull(locale, data) {
      return data;
    },
    async push(locale, data) {
      const draftPath = options.bucketPathPattern.replaceAll("[locale]", locale);
      const finalPath = path.resolve(draftPath);

      const prettierConfig = await loadPrettierConfig(finalPath);
      if (!prettierConfig) {
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
        const result = await prettier.format(data, config);
        return result;
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("Cannot find package")) {
          console.log();
          console.log("⚠️  Prettier plugins are not installed. Formatting without plugins.");
          console.log("⚠️  To use prettier plugins install project dependencies before running Lingo.dev.");

          config.plugins = [];

          // clear file system structure cache
          await prettier.clearConfigCache();

          // format again without plugins
          const result = await prettier.format(data, config);
          return result;
        } else {
          throw error;
        }
      }
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
