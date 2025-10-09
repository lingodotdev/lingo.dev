import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Compiler: public export path
import { lingo } from "lingo.dev/compiler/vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    // Place Lingo.dev first so it runs before other transforms
    lingo({
      sourceRoot: "app",
      targetLocales: ["es", "fr", "de"],
      useDirective: false,
      models: "lingo.dev",
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
}));
