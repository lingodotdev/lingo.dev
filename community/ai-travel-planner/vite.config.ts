import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

// Build mode can be controlled via LINGO_BUILD_MODE env variable
// - "translate": Generate translations during build (requires API key)
// - "cache-only": Use cached translations only (for CI/production)
// Default to "cache-only" in production (CI) to use pre-cached translations
const buildMode =
  (process.env.LINGO_BUILD_MODE as "translate" | "cache-only") ||
  (process.env.CI || process.env.VERCEL ? "cache-only" : "translate");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      lingoDir: ".lingo",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de", "ja", "zh"],
      useDirective: true,
      models: "lingo.dev",
      buildMode,
      dev: {
        usePseudotranslator: false,
      },
    }),
    tanstackRouter({
      target: "react",
    }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    // Dedupe React to ensure a single instance is used across all dependencies
    dedupe: ["react", "react-dom"],
  },
});
