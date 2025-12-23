# Translation Utilities

Translation utilities for compiler-beta, including pseudolocalization and caching.

## Pseudolocalization (Recommended: Config-based)

The easiest way to enable pseudolocalization is through the loader config:

```typescript
// next.config.ts
export default {
  turbopack: {
    rules: {
      "*.{tsx,jsx}": {
        loaders: [
          {
            loader: "@lingo.dev/compiler-beta/loader",
            options: {
              sourceRoot: "./app",
              lingoDir: ".lingo",
              sourceLocale: "en",
              translator: "pseudo", // 🎯 Enable automatic pseudolocalization
            },
          },
        ],
        as: "*.tsx",
      },
    },
  },
};
```

When `translator: "pseudo"` is set, the compiler automatically:

- Imports and sets up the cached pseudotranslator
- Injects it into all server components
- Caches translations to `.lingo/cache/` directory

**Example output:**

- `"Hello World"` → `"[Ĥéĺĺó Ŵóŕĺḍ          ]"`
- `"Welcome"` → `"[Ŵéĺçóṁé   ]"`

## Manual Pseudolocalization (Advanced)

For manual setup without config-based initialization:

```typescript
import { pseudoTranslate } from "@lingo.dev/compiler-beta/translate";

// Use as translation function
const t = await getServerTranslations({
  metadata: __lingoMetadata,
  sourceLocale: "en",
  translate: pseudoTranslate,
});
```

## Cached Translation

Wrap any translation function with caching to avoid re-translating:

```typescript
import {
  createCachedTranslator,
  pseudoTranslate,
} from "@lingo.dev/compiler-beta/translate";

// Create cached version
const cachedTranslate = createCachedTranslator(pseudoTranslate, {
  cacheDir: ".lingo",
  sourceRoot: "./app",
});

// Use in server components
const t = await getServerTranslations({
  metadata: __lingoMetadata,
  sourceLocale: "en",
  translate: cachedTranslate, // Will use cache/.json files
});
```

## Server-Side Cache

Direct cache management for server components:

```typescript
import { ServerTranslationCache } from "@lingo.dev/compiler-beta/translate";

const cache = new ServerTranslationCache({
  cacheDir: ".lingo",
  sourceRoot: "./app",
});

// Check if cached
const hasFrench = await cache.has("fr");

// Get translations
const translations = await cache.getTranslations("fr");

// Set translations
await cache.set("fr", dictionarySchema);

// Clear cache
await cache.clear("fr");
await cache.clearAll();
```

## Example: Automatic Setup (Config-based)

With `translator: "pseudo"` in your config, components are automatically transformed:

```typescript
// app/page.tsx - Your original code
export default function Home() {
  return <h1>Hello World</h1>;
}
```

The compiler transforms it to:

```typescript
// Transformed (automatic, no manual changes needed)
import { getServerTranslations } from '@lingo.dev/compiler-beta/react/server';
import { createCachedTranslator, pseudoTranslate } from '@lingo.dev/compiler-beta/translate';
import __lingoMetadata from './.lingo/metadata.json';

const __lingoTranslate = createCachedTranslator(pseudoTranslate, {
  cacheDir: '.lingo',
  sourceRoot: './app',
});

export default async function Home() {
  const t = await getServerTranslations({
    metadata: __lingoMetadata,
    sourceLocale: 'en',
    translate: __lingoTranslate,
  });

  return <h1>{t("63b8a9ec9544")}</h1>; // "[Ĥéĺĺó Ŵóŕĺḍ          ]"
}
```

## Example: Manual Setup (Advanced)

For cases where you need manual control:

```typescript
// app/layout.tsx
import { getServerTranslations } from '@lingo.dev/compiler-beta/react/server';
import { createCachedTranslator, pseudoTranslate } from '@lingo.dev/compiler-beta/translate';
import __lingoMetadata from './.lingo/metadata.json';

// Create cached translator
const translate = createCachedTranslator(pseudoTranslate, {
  cacheDir: '.lingo',
  sourceRoot: './app',
});

export default async function RootLayout({ children }) {
  const t = await getServerTranslations({
    metadata: __lingoMetadata,
    sourceLocale: 'en',
    translate,  // Pseudolocalize with caching
  });

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

## Cache Structure

Translations are cached in `<sourceRoot>/<cacheDir>/cache/<locale>.json`:

```
app/
  .lingo/
    metadata.json        # Source strings
    cache/
      en.json           # English (source)
      fr.json           # French translations
      pseudo.json       # Pseudolocalized
```

## Client Components

For client components, translations work differently:

- Use `useTranslation()` hook (auto-injected)
- Translations loaded via API or bundled
- Consider IndexedDB for browser caching (not implemented yet)

## Notes

- **Server Components**: Can use disk-based cache (fs operations allowed)
- **Client Components**: Need browser-based caching (IndexedDB, API endpoints)
- Cache is checked before calling translate function
- Pseudolocalization adds ~30% length to test layout issues
