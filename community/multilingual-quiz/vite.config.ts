import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lingo': {
        target: 'https://api.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingo/, ''),
        secure: true,
      },
      '/engine/lingo': {
        target: 'https://engine.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/engine\/lingo/, ''),
        secure: true,
      }
    }
  }
})
