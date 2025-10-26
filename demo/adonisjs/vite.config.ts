import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import adonisjs from '@adonisjs/vite/client'
import react from '@vitejs/plugin-react'
import lingoCompiler from 'lingo.dev/compiler'
import { type UserConfig, type PluginOption } from 'vite'

const viteConfig: UserConfig = {
  plugins: [
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
    }) as unknown as PluginOption,
  ],
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
}

const withLingo = lingoCompiler.vite({
  sourceRoot: 'inertia',
  lingoDir: 'lingo',
  sourceLocale: 'en',
  targetLocales: ['es'],
  rsc: false,
  useDirective: false,
  debug: false,
  models: 'lingo.dev',
})

export default withLingo(viteConfig)
