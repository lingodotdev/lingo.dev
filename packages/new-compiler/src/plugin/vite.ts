/**
 * Vite Plugin for Lingo.dev Compiler
 *
 * Usage:
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { lingoCompilerPlugin } from '@lingo.dev/compiler/vite';
 *
 * export default defineConfig({
 *   plugins: [
 *     lingoCompilerPlugin({
 *       sourceLocale: 'en',
 *       targetLocales: ['es', 'fr'],
 *     }),
 *   ],
 * });
 * ```
 */

import { type LingoPluginOptions, lingoUnplugin } from "./unplugin";

export function lingoCompilerPlugin(options: LingoPluginOptions) {
  return lingoUnplugin.vite(options);
}

export type { LingoPluginOptions };
