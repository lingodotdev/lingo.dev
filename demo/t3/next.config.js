/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import lingoCompiler from "lingo.dev/compiler";

/** @type {import("next").NextConfig} */
const config = {};

export default lingoCompiler.next({
  sourceRoot: "src",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
})(config);
