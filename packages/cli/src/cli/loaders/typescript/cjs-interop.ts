/**
 * @fileoverview Helpers for CommonJS ⇆ ES Module inter-op quirks.
 */

/**
 * Resolve the actual default export value of a CommonJS module that has been
 * imported via an ES-module `import` statement.
 *
 * Why is this needed?
 * -------------------
 * When a package that is published as **CommonJS** (for example, `@babel/traverse`)
 * is imported inside native **ESM** code (or via a bundler in ESM mode) the
 * runtime value you receive is not consistent across environments:
 *
 *   • **Node.js** (native ESM) wraps the CJS module in an object like
 *     `{ default: moduleExports, …namedReExports }`.
 *   • **esbuild / Vite / Vitest** may decide to mimic TypeScript's
 *     `esModuleInterop` behaviour and give you `moduleExports` directly.
 *   • Other tools can produce yet different shapes.
 *
 * If you blindly assume one shape, you will hit runtime errors such as
 * `TypeError: traverse is not a function` when the actual function lives on the
 * `.default` property — or the opposite, depending on the environment.
 *
 * This helper inspects the imported value at runtime and returns what looks like
 * the real default export regardless of how it was wrapped.  It hides the ugly
 * `typeof mod === "function" ? … : mod.default` branching behind a single call
 * site.
 *
 * Example
 * -------
 * ```ts
 * import traverseModule from "@babel/traverse";
 * import { resolveCjsExport } from "../utils/cjs-interop";
 *
 * const traverse = resolveCjsExport<typeof traverseModule>(
 *   traverseModule,
 *   "@babel/traverse",
 * );
 * ```
 *
 * @template T Expected type of the resolved export.
 * @param mod  The runtime value returned by the `import` statement.
 * @param name Friendly name of the module (for error messages).
 * @returns    The resolved default export value.
 */
export function resolveCjsExport<T = any>(mod: T, name: string = "module"): T {
  // If the module value itself is callable or clearly not an object, assume it's
  // already the export we want (covers most bundler scenarios).
  if (typeof mod === "function" || typeof mod !== "object" || mod === null) {
    return mod as T;
  }

  // Otherwise, look for a `.default` property which is common in Node's CJS->ESM
  // wrapper as well as in Babel's `interopRequireDefault` helpers.
  if ("default" in mod && typeof mod.default !== "undefined") {
    return mod.default as T;
  }

  // Give up: log the mysterious shape and throw to fail fast.
  /* eslint-disable no-console */
  console.error(
    `[resolveCjsExport] Unable to determine default export for ${name}.`,
    "Received value:",
    mod,
  );
  throw new Error(`Failed to resolve default export for ${name}.`);
}
