import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts", "src/lingo-turbopack-loader.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  shims: true,
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
});
