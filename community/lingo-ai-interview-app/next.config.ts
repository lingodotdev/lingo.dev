import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "hi", "ja"],
    useDirective: false,
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true, // Use pseudotranslation for demo purposes without API key
    },
    buildMode: "cache-only",
  });
}
