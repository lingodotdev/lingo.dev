import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [ lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "de", "fr"],
      models: "lingo.dev",
      dev: {
        usePseudotranslator: true,
      },
    }),
    react(), 
    tailwindcss()],
})
