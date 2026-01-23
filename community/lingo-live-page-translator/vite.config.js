import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // popup: resolve(__dirname, "src/popup.html"),
        background: resolve(__dirname, "src/background.js")
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background.js";
          return "[name].js";
        }
      }
    }
  }
});
