# Lingo.dev Compiler (Legacy)

> **DEPRECATED:** This package (`@lingo.dev/_compiler`) is deprecated. Please migrate to `@lingo.dev/compiler` (the new compiler).

## Migration

Install the new compiler:

```bash
npm install @lingo.dev/compiler
```

Update your configuration:

**Next.js (before):**
```ts
import lingoCompiler from "@lingo.dev/_compiler";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default lingoCompiler.next({
  sourceRoot: "app",
  models: "lingo.dev",
})(nextConfig);
```

**Next.js (after):**
```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

**Vite (before):**
```ts
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import lingoCompiler from "@lingo.dev/_compiler";

const viteConfig: UserConfig = {
  plugins: [react()],
};

export default defineConfig(() =>
  lingoCompiler.vite({
    models: "lingo.dev",
  })(viteConfig)
);
```

**Vite (after):**
```ts
import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { withLingo } from "@lingo.dev/compiler/vite";

const viteConfig: UserConfig = {
  plugins: [react()],
};

export default defineConfig(async () =>
  await withLingo(viteConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  })
);
```

## New Compiler Features

The new compiler (`@lingo.dev/compiler`) offers:

- Advanced virtual module system for better code splitting
- Built-in development translation server
- Pluralization detection with ICU MessageFormat support
- Improved metadata management for better caching
- Thread-safe concurrent build support

## Documentation

Full documentation: [lingo.dev/compiler](https://lingo.dev/compiler)
