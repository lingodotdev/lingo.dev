import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Compiler: public export path
import { lingo } from "lingo.dev/compiler/vite";

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    // Place Lingo.dev first so it runs before other transforms
    lingo({
      sourceRoot: "src",
      targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
      models: "lingo.dev",
    }),
    react(),
  ],
}));
