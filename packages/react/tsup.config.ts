import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: ["src/**/*"],
  bundle: false,
  outDir: "build",
  format: ["esm"],
  dts: true,
  sourcemap: true,
  cjsInterop: true,
  splitting: true,
  external: ["react", "next"],
  onSuccess:
    "tsc --project tsconfig.json --emitDeclarationOnly --declarationMap --outDir build",
});
