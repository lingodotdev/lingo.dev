import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { lingo } from "lingo.dev/compiler/vite";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
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
