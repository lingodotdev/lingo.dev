import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { lingoCompilerPlugin } from '@lingo.dev/compiler/vite';

export default defineConfig({
  plugins: [
    react(),
    lingoCompilerPlugin({
      sourceRoot: 'src',
      sourceLocale: 'en',
      targetLocales: ['es', 'fr', 'de', 'ja', 'ar'],
      models: 'lingo.dev',
      dev: {
        usePseudotranslator: true,
      },
    }),
  ],
});
