import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath, URL } from "node:url";
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    devtools(),
    lingoCompilerPlugin({
      sourceRoot: "src",
      lingoDir: ".lingo",
      sourceLocale: "en",
      targetLocales: ["es", "de", "fr"],
      useDirective: true, // Set to true to require 'use i18n' directive
      models: "lingo.dev",
      buildMode: "cache-only",
      dev: {
        usePseudotranslator: true,
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
  },
});
