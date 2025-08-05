import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: false, // Disable splitting to keep single bundle
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
  // Exclude data files from bundling to keep size small
  external: [/\.json$/],
  // Don't bundle JSON files - they'll be loaded dynamically
  noExternal: [],
});
