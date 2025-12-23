import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "de", "ru"],
    useDirective: false, // Set to true to require 'use i18n' directive
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
    buildMode: "cache-only",
  });
}
