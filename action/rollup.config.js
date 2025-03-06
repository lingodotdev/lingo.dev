import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const config = [
  {
    input: "src/index.ts",
    output: {
      file: "build/action.cjs",
      format: "cjs",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        outDir: "build",
      }),
      json(),
    ],
  },
];
export default config;
