import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: [
    "src/index.ts",
    "src/react/index.ts",
    "src/react/client/*.tsx",
    "src/react/client/*.ts",
    "src/react/server/*.ts",
    "src/translate/index.ts",
    "src/plugin/loader.ts",
  ],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
});
