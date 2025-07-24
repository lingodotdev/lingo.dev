import lingoCompiler from "lingo.dev/compiler";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default lingoCompiler.next({
  sourceRoot: "app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
})(nextConfig);
