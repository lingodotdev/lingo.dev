import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lingoCompiler from 'lingo.dev/compiler';

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: 'src',
    sourceLocale: 'en',
    targetLocales: ['es', 'fr', 'de', 'ja', 'zh'],
    
    models: {
      '*:*': 'groq:llama-3.3-70b-versatile'
    },
    
    dev: {
      usePseudotranslator: true, // Fast dev
    },
    
    buildMode: 'translate', // Real translations
  })({
    plugins: [react()],
  })
);