import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})