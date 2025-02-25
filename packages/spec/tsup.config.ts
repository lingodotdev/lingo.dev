import { defineConfig } from "tsup";
import buildJsonSchema from "./src/json-schema";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/index.ts"],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: true,
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
  onSuccess: async () => {
    buildJsonSchema();
  },
});
