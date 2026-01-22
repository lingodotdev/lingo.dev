import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      lingoDir: ".lingo",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de", "ja"],
      useDirective: false,
      models: "lingo.dev",
      buildMode: "translate",
      dev: {
        usePseudotranslator: true,
      },
    }),
    react(),
  ],
});
