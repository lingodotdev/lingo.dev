import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
});