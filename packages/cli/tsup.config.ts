import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: {
    cli: "src/cli/index.ts",
    sdk: "src/sdk/index.ts",
    spec: "src/spec/index.ts",
    react: "src/react/index.ts",
    "react/client": "src/react/client.ts",
    "react/rsc": "src/react/rsc.ts",
    "react/react-router": "src/react/react-router.ts",
    compiler: "src/compiler/index.ts",
    "locale-codes": "src/locale-codes/index.ts",
  },
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: true,
  bundle: true,
  sourcemap: true,
  external: ["readline/promises", "@babel/traverse", "node-machine-id"],
  outExtension: (ctx) => ({
    js: ctx.format === "cjs" ? ".cjs" : ".mjs",
  }),
});
