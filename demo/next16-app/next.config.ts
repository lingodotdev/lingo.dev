import type { NextConfig } from "next";
import { LingoWebpackPlugin } from "@lingo.dev/_compiler-beta/plugin";

const nextConfig: NextConfig = {
  /* config options here */

  // Enable Turbopack (required for Next.js 16)
  // Note: In Next.js 16, Turbopack is the default bundler
  turbopack: {
    rules: {
      // Configure compiler-beta loader for React components
      "*.{tsx,jsx}": {
        loaders: [
          {
            loader: "@lingo.dev/_compiler-beta/next/loader",
            options: {
              sourceRoot: "./app",
              lingoDir: ".lingo",
              sourceLocale: "en",
              useDirective: false, // Set to true to require 'use i18n' directive
              isDev: process.env.NODE_ENV !== "production",
              translator: { type: "pseudo" }, // Enable pseudolocalization for testing
            },
          },
        ],
      },
    },
  },

  // Add webpack configuration for production builds
  webpack: (config, { isServer }) => {
    // Only add plugin to server build to avoid duplicates
    if (isServer) {
      config.plugins.push(
        new LingoWebpackPlugin({
          sourceRoot: "./app",
          lingoDir: ".lingo",
          sourceLocale: "en",
          targetLocales: ["de", "fr"],
          translator: { type: "pseudo" }, // Use the same translator as loader
          outputDir: "./public/translations",
        }),
      );
    }
    return config;
  },
};

export default nextConfig;
