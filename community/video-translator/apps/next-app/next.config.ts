import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const withLingo = lingoCompiler.next({
  sourceRoot: "app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es", "hi", "ja", "fr", "de"],
  rsc: true,
  useDirective: false,
  debug: false,
  // models: "lingo.dev",
  models: {
    "*:*": "google:gemini-2.5-flash",
  },
});

const nextConfig: NextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (arg0: string) => any } }) =>
        rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    LINGODOTDEV_API_KEY: process.env.LINGODOTDEV_API_KEY,
  },
};

// export default nextConfig;
export default withLingo(nextConfig);
