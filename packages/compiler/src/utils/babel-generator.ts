import * as GeneratorNS from "@babel/generator";

// Re-export types for convenience in callers
export type { GeneratorResult } from "@babel/generator";

function resolveGenerate(ns: any): any {
  const candidates = [
    ns,
    ns?.default,
    ns?.default?.default,
    ns?.generate,
    ns?.default?.generate,
  ];
  for (const c of candidates) {
    if (typeof c === "function") return c;
  }
  throw new Error("Failed to resolve @babel/generator default export");
}

const generate: unknown = resolveGenerate(GeneratorNS as any);

type GenerateFn = typeof import("@babel/generator")["default"];
export default generate as GenerateFn;

