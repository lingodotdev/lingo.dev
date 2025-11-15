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
    models: {
      es: "groq:llama-3.3-70b-versatile",
      fr: "groq:llama-3.3-70b-versatile",
      ru: "groq:llama-3.3-70b-versatile",
      de: "groq:llama-3.3-70b-versatile",
      ja: "groq:llama-3.3-70b-versatile",
      zh: "groq:llama-3.3-70b-versatile",
      ar: "groq:llama-3.3-70b-versatile",
      ko: "groq:llama-3.3-70b-versatile",
    } as any,
  })(viteConfig),
);
