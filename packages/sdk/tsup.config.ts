import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: true,
  esbuildOptions(options) {
    options.legalComments = "none";
    options.absWorkingDir = process.cwd();
  },
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
});
