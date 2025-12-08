import _traverse, { NodePath } from "@babel/traverse";
import _generate, { GeneratorResult } from "@babel/generator";

// Handle ESM/CJS interop - these packages may export differently
// @ts-expect-error - Handle both default and named exports
const traverse = typeof _traverse == "function" ? _traverse : _traverse.default;
// @ts-expect-error - Handle both default and named exports
const generate = typeof _generate == "function" ? _generate : _generate.default;

export type { NodePath };
export type { GeneratorResult };

export { traverse, generate };
