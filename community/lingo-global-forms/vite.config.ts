import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/lingo': {
        target: 'https://engine.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingo/, ''),
      },
    },
  },
});
