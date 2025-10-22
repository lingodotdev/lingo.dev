import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import { lingo } from 'lingo.dev/compiler/vite'
import { type UserConfig } from 'vite'

const viteConfig: UserConfig = {
  plugins: [
    lingo({
      sourceRoot: 'inertia',
      lingoDir: 'lingo',
      sourceLocale: 'en',
      targetLocales: ['es'],
      rsc: false,
      useDirective: false,
      debug: false,
      models: 'lingo.dev',
    }),
    inertia({
      ssr: {
        enabled: true,
        entrypoint: 'inertia/app/ssr.tsx',
      },
    }),
    react(),
    adonisjs({
      entrypoints: ['inertia/app/app.tsx'],
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
}

export default viteConfig
