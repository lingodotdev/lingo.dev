import lingoCompiler from "lingo.dev/compiler";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withLingo = lingoCompiler.next({
  sourceRoot: "app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
});

export default withLingo(nextConfig);
