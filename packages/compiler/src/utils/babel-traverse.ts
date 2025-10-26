import * as TraverseNS from "@babel/traverse";

// Re-export types for convenience
export type { NodePath } from "@babel/traverse";

// Normalize CJS/ESM interop across bundlers (tsup/esbuild, Vite/Rollup SSR)
// Some toolchains expose @babel/traverse as a callable default export,
// others as a namespace object with the function at .default.
const traverse: unknown = (TraverseNS as any).default ?? (TraverseNS as any);

type TraverseFn = typeof import("@babel/traverse")["default"];
export default traverse as TraverseFn;
