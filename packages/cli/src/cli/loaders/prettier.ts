import path from "path";
import prettier, { Options } from "prettier";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

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

      const result = prettier.format(data, {
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
      });

      return result;
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
