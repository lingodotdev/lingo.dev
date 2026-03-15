import traverseDefault from "@babel/traverse";
import generateDefault from "@babel/generator";

// Handle ESM/CJS interop - these packages may export differently
const traverse: typeof traverseDefault =
  // @ts-expect-error - Handle both default and named exports
  traverseDefault.default ?? traverseDefault;
const generate: typeof generateDefault =
  // @ts-expect-error - Handle both default and named exports
  generateDefault.default ?? generateDefault;

export { traverse, generate };
