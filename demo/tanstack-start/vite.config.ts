import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import lingoCompiler from "lingo.dev/compiler";
import { type UserConfig } from "vite";

const baseConfig: UserConfig = {
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({ customViteReactPlugin: true }),
    viteReact(),
  ],
};

const withLingo = lingoCompiler.vite({
  sourceRoot: "src",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: false,
  useDirective: false,
  debug: true,
  models: "lingo.dev",
});

export default defineConfig(withLingo(baseConfig));
