import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import lingoCompiler from "lingo.dev/compiler";
import { type UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const viteConfig: UserConfig = {
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
};

const withLingo = lingoCompiler.vite({
  sourceRoot: "app",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: false,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
});

export default withLingo(viteConfig);
