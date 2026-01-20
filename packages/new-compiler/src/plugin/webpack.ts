/**
 * Webpack Plugin for Lingo.dev Compiler
 *
 * Usage:
 * ```js
 * // webpack.config.js
 * import { lingoCompilerPlugin } from '@lingo.dev/compiler/webpack';
 *
 * export default {
 *   plugins: [
 *     lingoCompilerPlugin({
 *       sourceLocale: 'en',
 *       targetLocales: ['es', 'fr'],
 *     }),
 *   ],
 * };
 * ```
 */

import { lingoUnplugin, type LingoPluginOptions } from "./unplugin";

export function lingoCompilerPlugin(options: LingoPluginOptions) {
  return lingoUnplugin.webpack(options);
}

export type { LingoPluginOptions };
