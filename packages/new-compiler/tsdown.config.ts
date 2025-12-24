import { defineConfig } from "tsdown";

export default defineConfig({
  clean: true,
  target: "esnext",
  entry: [
    "src/index.ts",
    "src/react/server/index.ts",
    "src/react/client/index.ts",
    "src/virtual/config.ts",
    "src/virtual/locale/server.ts",
    "src/virtual/locale/client.ts",
    "src/react/server-only/index.ts",
    "src/react/next/client.tsx",
    "src/react/next/server.tsx",
    "src/plugin/next.ts",
    "src/plugin/vite.ts",
    "src/plugin/webpack.ts",
    "src/plugin/next-compiler-loader.ts",
    "src/plugin/next-config-loader.ts",
    "src/plugin/next-locale-server-loader.ts",
    "src/plugin/next-locale-client-loader.ts",
  ],
  external: [
    // Make external so plugins can resolve them dynamically
    /^@lingo\.dev\/compiler\/virtual\/config/,
    /^@lingo\.dev\/compiler\/virtual\/locale\//,
    "unplugin", // Keep unplugin external so webpack can resolve its internal loaders
  ],
  outDir: "build",
  format: ["cjs", "esm"],
  dts: true,
  // When bundling, components lose the directives. As far as I see in other projects, like next-intl, they also use `preserveModules` which is kinda similar.
  unbundle: true,
});
