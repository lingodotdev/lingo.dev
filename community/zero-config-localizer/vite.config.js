const hasGroqKey = Boolean(process.env.GROQ_API_KEY);
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lingoCompiler from 'lingo.dev/compiler';

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: 'src',
    sourceLocale: 'en',
    targetLocales: ['es', 'fr', 'de', 'ja', 'zh'],
    
    ...(hasGroqKey && {
            models: {
              '*:*': 'groq:llama-3.3-70b-versatile'
            },
          }),
    
    dev: {
      usePseudotranslator: true, // Fast dev
    },
    
    buildMode: hasGroqKey ? 'translate' : 'cache-only', // Use cache-only if no API key
  })({
    plugins: [react()],
  })
);