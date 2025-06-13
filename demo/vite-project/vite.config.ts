import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Compiler: add import
import lingoCompiler from "lingo.dev/compiler";

const viteConfig = {
  plugins: [react()],
};

// https://vite.dev/config/
export default defineConfig(() =>
  // Compiler: add lingoCompiler.vite
  lingoCompiler.vite({
    sourceRoot: "src",
    targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
    models: "lingo.dev",
  })(viteConfig),
);
// export default defineConfig({
//   plugins: [react()],
// })
