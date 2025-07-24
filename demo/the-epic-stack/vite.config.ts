import { reactRouter } from '@react-router/dev/vite'
import {
	type SentryReactRouterBuildOptions,
	sentryReactRouter,
} from '@sentry/react-router'
import tailwindcss from '@tailwindcss/vite'
import lingoCompiler from 'lingo.dev/compiler'
import { reactRouterDevTools } from 'react-router-devtools'
import { defineConfig, type UserConfig } from 'vite'
import { envOnlyMacros } from 'vite-env-only'
import { iconsSpritesheet } from 'vite-plugin-icons-spritesheet'

const MODE = process.env.NODE_ENV

const sentryConfig: SentryReactRouterBuildOptions = {
	authToken: process.env.SENTRY_AUTH_TOKEN,
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,

	unstable_sentryVitePluginOptions: {
		release: {
			name: process.env.COMMIT_SHA,
			setCommits: {
				auto: true,
			},
		},
		sourcemaps: {
			filesToDeleteAfterUpload: ['./build/**/*.map', '.server-build/**/*.map'],
		},
	},
}

const viteConfig: UserConfig = {
	build: {
		target: 'es2022',
		cssMinify: MODE === 'production',

		rollupOptions: {
			external: [/node:.*/, 'fsevents'],
		},

		assetsInlineLimit: (source: string) => {
			if (
				source.endsWith('favicon.svg') ||
				source.endsWith('apple-touch-icon.png')
			) {
				return false
			}
		},

		sourcemap: true,
	},
	server: {
		watch: {
			ignored: ['**/playwright-report/**'],
		},
	},
	plugins: [
		envOnlyMacros(),
		tailwindcss(),
		reactRouterDevTools(),

		iconsSpritesheet({
			inputDir: './other/svg-icons',
			outputDir: './app/components/ui/icons',
			fileName: 'sprite.svg',
			withTypes: true,
			iconNameTransformer: (name) => name,
		}),
		// it would be really nice to have this enabled in tests, but we'll have to
		// wait until https://github.com/remix-run/remix/issues/9871 is fixed
		MODE === 'test' ? null : reactRouter(),
	],
	test: {
		include: ['./app/**/*.test.{ts,tsx}'],
		setupFiles: ['./tests/setup/setup-test-env.ts'],
		globalSetup: ['./tests/setup/global-setup.ts'],
		restoreMocks: true,
		coverage: {
			include: ['app/**/*.{ts,tsx}'],
			all: true,
		},
	},
}

export default defineConfig((config) => {
	const configWithSentry = {
		...viteConfig,
		plugins: [
			...viteConfig.plugins!.filter(Boolean),
			MODE === 'production' && process.env.SENTRY_AUTH_TOKEN
				? sentryReactRouter(sentryConfig, config)
				: null,
		].filter(Boolean),
	}

	return lingoCompiler.vite({
		sourceRoot: 'app',
		lingoDir: 'lingo',
		sourceLocale: 'en',
		targetLocales: ['es'],
		rsc: false,
		useDirective: false,
		debug: false,
		models: 'lingo.dev',
	})(configWithSentry)
})
