import lingoCompiler from "lingo.dev/compiler"

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
}

const blitzConfig = withBlitz(nextConfig)

export default lingoCompiler.next({
  sourceRoot: "src",
  lingoDir: "lingo",
  sourceLocale: "en",
  targetLocales: ["es"],
  rsc: true,
  useDirective: false,
  debug: false,
  models: "lingo.dev",
})(blitzConfig)
