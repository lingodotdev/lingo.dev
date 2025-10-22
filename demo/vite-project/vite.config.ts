import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { lingo } from "lingo.dev/compiler/vite";

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    lingo({
      sourceRoot: "src",
      targetLocales: ["es", "fr", "ru", "de", "ja", "zh", "ar", "ko"],
      models: "lingo.dev",
    }),
    react(),
  ],
}));
