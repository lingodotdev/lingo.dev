import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";
import { sourceLocale } from "./supported-locales";
import { targetLocales } from "@/supported-locales";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    lingoDir: ".lingo",
    sourceLocale,
    targetLocales,
    useDirective: false, // Set to true to require 'use i18n' directive
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
    buildMode: "cache-only",
    // Use custom path-based locale resolver instead of cookies
    localePersistence: {
      type: "custom",
    },
  });
}
