import { defineConfig } from "tsup";

export default defineConfig([
  // 🔹 Library build (React hook)
  {
    entry: {
      index: "src/index.ts",
    },
    format: ["esm", "cjs"],
    dts: true,
    clean: true,
    target: "es2020",
    external: ["react"],
  },

  // 🔹 CLI build (Node, ESM only)
  {
    entry: {
      cli: "src/cli.ts",
    },
    format: ["esm"],
    dts: false,
    clean: false,
    target: "node18",
    platform: "node",
  },
]);
