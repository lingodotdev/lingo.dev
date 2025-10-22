import type { NextConfig } from "next";
import { lingo as viteLingo } from "./vite";
import { withLingo as nextLingo } from "./next";

/**
 * Backward-compatible API surface for existing users.
 */
const lingoCompiler = {
  /**
   * Initializes Lingo.dev Compiler for Next.js (App Router).
   *
   * @deprecated Use `import { lingo } from "lingo.dev/compiler/next"`.
   */
  next:
    (compilerParams?: Parameters<typeof nextLingo>[0]) =>
    (nextConfig: any = {}): NextConfig => {
      return nextLingo(compilerParams)(nextConfig);
    },

  /**
   * Initializes Lingo.dev Compiler for Vite.
   *
   * @deprecated Use `import { lingo } from "lingo.dev/compiler/vite"`.
   */
  vite: (compilerParams?: Parameters<typeof viteLingo>[0]) => (config: any) => {
    const plugin = viteLingo(compilerParams);
    config.plugins = config.plugins || [];
    config.plugins.unshift(plugin);
    return config;
  },
};

export default lingoCompiler;
