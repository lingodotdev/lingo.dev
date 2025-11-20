import type { NextConfig } from "next";

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
            loader: "@lingo.dev/_compiler-beta/loader",
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
};

export default nextConfig;
