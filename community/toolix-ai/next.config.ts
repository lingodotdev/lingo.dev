import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@thesysai/genui-sdk",
    "@crayonai/react-ui",
    "@crayonai/react-core",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "ja", "hi", "zh-Hans"],
    useDirective: false,
    models: "lingo.dev",
    dev: {
      usePseudotranslator: true,
    },
  });
}
