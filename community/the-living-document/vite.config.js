import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lingo': {
        target: 'https://engine.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingo/, ''),
      },
    },
  },
})
