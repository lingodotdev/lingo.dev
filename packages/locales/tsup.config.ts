import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: false,
  // Bundle iso-639-3 since it's ESM-only and can't be required in CJS
  noExternal: ["iso-639-3"],
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
});
