import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
};

// for Lingo.dev Compiler configuration see https://lingo.dev/en/compiler/frameworks/nextjs
export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["hi", "ja", "fr", "es", "ar"],
  models: "lingo.dev",
})(nextConfig);
