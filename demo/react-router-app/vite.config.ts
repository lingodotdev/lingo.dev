import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Compiler: import
import lingoCompiler from "lingo.dev/compiler";

export default defineConfig(({ isSsrBuild }) =>
  lingoCompiler.vite({
    sourceRoot: "app",
    targetLocales: ["es", "fr", "de"],
    useDirective: false,
    models: "lingo.dev",
  })({
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  }),
);
