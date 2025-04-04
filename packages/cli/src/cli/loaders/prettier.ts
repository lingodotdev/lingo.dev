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
        const result = await prettier.format(data, config);
        return result;
      } catch (error) {
        if (error instanceof Error && error.message.startsWith("Cannot find package")) {
          console.log();
          console.log("Prettier is missing some dependecies - installing all project dependencies");

          // prettier is missing dependencies - install all project dependencies
          installDependencies();

          // clear file system structure cache to find newly installed dependencies
          await prettier.clearConfigCache();

          // try to format again
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

// install all dependencies using package manager
async function installDependencies() {
  const packageManager = await getPackageManager();
  console.log(`Installing dependencies using ${packageManager}`);
  execSync(`${packageManager} install --frozen-lockfile`, { stdio: "inherit" });
  console.log(`Dependencies installed`);
}

// determine if yarn or pnpm is used based on lockfile, otherwise use npm
async function getPackageManager() {
  const yarnLockfile = path.resolve(process.cwd(), "yarn.lock");
  if (fs.existsSync(yarnLockfile)) {
    return "yarn";
  }

  const pnpmLockfile = path.resolve(process.cwd(), "pnpm-lock.yaml");
  if (fs.existsSync(pnpmLockfile)) {
    return "pnpm";
  }

  const bunLockfile = path.resolve(process.cwd(), "bun.lock");
  if (fs.existsSync(bunLockfile)) {
    return "bun";
  }

  return "npm";
}
