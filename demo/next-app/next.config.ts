import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const nextConfig: NextConfig = {
  /* config options here */
};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "ja", "fr", "ru", "de", "zh", "ar", "ko"],
  models: "lingo.dev",
  useDirective: true,
})(nextConfig);
