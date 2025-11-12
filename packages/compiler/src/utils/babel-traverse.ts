import * as TraverseNS from "@babel/traverse";

// Re-export types for convenience
export type { NodePath } from "@babel/traverse";

// Normalize CJS/ESM interop across bundlers (tsup/esbuild, Vite/Rollup SSR)
// Some toolchains expose @babel/traverse as a callable default export,
// others as a namespace object with the function at .default.
function resolveTraverse(ns: any): any {
  const candidates = [
    ns,
    ns?.default,
    ns?.default?.default,
    ns?.traverse,
    ns?.default?.traverse,
  ];
  for (const c of candidates) {
    if (typeof c === "function") return c;
  }
  throw new Error("Failed to resolve @babel/traverse function export");
}

const traverse: unknown = resolveTraverse(TraverseNS as any);

type TraverseFn = typeof import("@babel/traverse")["default"];
export default traverse as TraverseFn;
