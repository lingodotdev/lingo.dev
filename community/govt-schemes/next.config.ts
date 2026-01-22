import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    lingoDir: "../src/lingo",
    sourceLocale: "en",
    targetLocales: [
      "hi",
      "bn",
      "te",
      "mr",
      "ta",
      "gu",
      "ur",
      // "kn",
      // "ml",
      "pa",
      // "or",
      "as",
      "ks",
      "mai",
    ] as any,
    useDirective: false,
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
    buildMode: "cache-only",
  });
}
