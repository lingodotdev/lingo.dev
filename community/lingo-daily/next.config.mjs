// import { withLingo } from "@lingo.dev/compiler/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

// To enable Lingo.dev compiler:
// 1. Ensure @lingo.dev/compiler is built: cd ../../packages/new-compiler && pnpm install && pnpm build
// 2. Uncomment the import above
// 3. Replace the export with:
/*
export default async function () {
  return await withLingo(nextConfig, {
    sourceRoot: "./src/app",
    lingoDir: ".lingo",
    sourceLocale: "en",
    targetLocales: ["es", "de", "fr", "ja"],
    useDirective: false,
    models: "lingo.dev",
    buildMode: "cache-only",
    dev: {
      usePseudotranslator: true,
    },
    pluralization: {
      enabled: true,
      model: "groq:llama-3.1-8b-instant"
    }
  });
}
*/
