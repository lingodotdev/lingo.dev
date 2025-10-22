import _ from "lodash";
import type { NextConfig } from "next";
import { defaultParams } from "./_base";
import { unplugin } from "./unplugin";
import { sendBuildEvent } from "./utils/build-event";

/**
 * Initializes Lingo.dev Compiler for Next.js (App Router).
 *
 * Curried wrapper matching the typical Next.js plugin shape.
 * Usage:
 *   import { withLingo } from "lingo.dev/compiler/next";
 *   export default withLingo(options)(nextConfig);
 */
export function withLingo(
  compilerParams?: Partial<typeof defaultParams> & {
    turbopack?: {
      enabled?: boolean | "auto";
      useLegacyTurbo?: boolean;
    };
  },
) {
  return (nextConfig: any = {}): NextConfig => {
    const mergedParams = _.merge(
      {},
      defaultParams,
      {
        rsc: true,
        turbopack: {
          enabled: "auto",
          useLegacyTurbo: false,
        },
      },
      compilerParams,
    );

    const isDev = process.env.NODE_ENV !== "production";
    sendBuildEvent("Next.js", mergedParams, isDev);

    let turbopackEnabled: boolean;
    if (mergedParams.turbopack?.enabled === "auto") {
      turbopackEnabled =
        process.env.TURBOPACK === "1" || process.env.TURBOPACK === "true";
    } else {
      turbopackEnabled = mergedParams.turbopack?.enabled === true;
    }

    const supportLegacyTurbo: boolean =
      mergedParams.turbopack?.useLegacyTurbo === true;

    const hasWebpackConfig = typeof nextConfig.webpack === "function";
    const hasTurbopackConfig = typeof nextConfig.turbopack === "function";
    if (hasWebpackConfig && turbopackEnabled) {
      console.warn(
        "⚠️  Turbopack is enabled in the Lingo.dev compiler, but you have webpack config. Lingo.dev will still apply turbopack configuration.",
      );
    }
    if (hasTurbopackConfig && !turbopackEnabled) {
      console.warn(
        "⚠️  Turbopack is disabled in the Lingo.dev compiler, but you have turbopack config. Lingo.dev will not apply turbopack configuration.",
      );
    }

    // Webpack
    const originalWebpack = nextConfig.webpack;
    nextConfig.webpack = (config: any, options: any) => {
      if (!turbopackEnabled) {
        console.log("Applying Lingo.dev webpack configuration...");
        config.plugins = config.plugins || [];
        config.plugins.unshift(unplugin.webpack(mergedParams));
      }

      if (typeof originalWebpack === "function") {
        return originalWebpack(config, options);
      }
      return config;
    };

    // Turbopack
    if (turbopackEnabled) {
      console.log("Applying Lingo.dev Turbopack configuration...");

      // Check if the legacy turbo flag is set
      let turbopackConfigPath = (nextConfig.turbopack ??= {});
      if (supportLegacyTurbo) {
        turbopackConfigPath = (nextConfig.experimental ??= {}).turbo ??= {};
      }

      turbopackConfigPath.rules ??= {};
      const rules = turbopackConfigPath.rules;

      // Regex for all relevant files for Lingo.dev
      const lingoGlob = `**/*.{ts,tsx,js,jsx}`;

      // The .cjs extension is required for Next.js v14
      const lingoLoaderPath = require.resolve("./lingo-turbopack-loader.cjs");

      rules[lingoGlob] = {
        loaders: [
          {
            loader: lingoLoaderPath,
            options: mergedParams,
          },
        ],
      };
    }

    return nextConfig;
  };
}

export default withLingo;
// Back-compat alias for tests or accidental imports
export { withLingo as lingo };
