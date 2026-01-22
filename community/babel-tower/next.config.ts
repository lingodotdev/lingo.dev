import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: ".",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "ja", "zh", "ko", "ar", "hi", "pt", "ru"],
    useDirective: false,
    models: "lingo.dev",
    dev: {
      usePseudotranslator: false,
    },
  });
}
