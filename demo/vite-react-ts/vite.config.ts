import react from "@vitejs/plugin-react";
import lingoCompiler from "lingo.dev/compiler";
import { defineConfig, type UserConfig } from "vite";

// https://vite.dev/config/
const viteConfig: UserConfig = {
  plugins: [react()],
};

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: "src",
    lingoDir: "lingo",
    sourceLocale: "en",
    targetLocales: ["es"],
    rsc: false,
    useDirective: false,
    debug: false,
    models: "lingo.dev",
  })(viteConfig),
);
