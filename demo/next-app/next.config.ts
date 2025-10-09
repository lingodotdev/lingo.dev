import type { NextConfig } from "next";
import { withLingo } from "lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withLingo({
  sourceLocale: "en",
  targetLocales: ["es", "ja", "fr", "ru", "de", "zh", "ar", "ko"],
  models: "lingo.dev",
  useDirective: true,
})(nextConfig);
