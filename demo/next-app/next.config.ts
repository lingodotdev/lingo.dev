import type { NextConfig } from "next";

// Compiler: add import
import lingoCompiler from "lingo.dev/compiler";

const nextConfig: NextConfig = {
  /* config options here */
};

// Compiler: wrap config with lingoCompiler.next
export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
  models: {
    "*:*": "groq:mistral-saba-24b",
  },
})(nextConfig);
// export default nextConfig;
