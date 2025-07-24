import { defineConfig, type UserConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'
import lingoCompiler from 'lingo.dev/compiler'

const viteConfig: UserConfig = {
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
}

export default defineConfig(() =>
  lingoCompiler.vite({
    sourceRoot: 'inertia',
    lingoDir: 'lingo',
    sourceLocale: 'en',
    targetLocales: ['es'],
    rsc: false,
    useDirective: false,
    debug: true,
    models: 'lingo.dev',
  })(viteConfig)
)
