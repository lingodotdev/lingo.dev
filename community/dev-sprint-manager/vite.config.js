import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react'],
  },
  server: {
    proxy: {
      '/api/lingo': {
        target: 'https://engine.lingo.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lingo/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    }
  }
})
