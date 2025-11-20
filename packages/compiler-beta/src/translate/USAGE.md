# Translation API Usage Guide

This guide shows how to use the refactored Translator interface in compiler-beta.

## Overview

The translation system now uses the `Translator` interface consistently across all components:

```typescript
interface Translator<Config> {
  config: Config;
  translate: (locale: string, entry: TranslatableEntry) => Promise<string>;
  batchTranslate: (
    locale: string,
    entriesMap: Record<string, TranslatableEntry>,
  ) => Promise<Record<string, string>>;
}
```

## Available Translators

### 1. PseudoTranslator (Testing)

For development and testing without real translations:

```typescript
import { PseudoTranslator } from "@lingo.dev/_compiler-beta/translate";

const translator = new PseudoTranslator({});

// Single translation
const result = await translator.translate("es", {
  text: "Hello World",
  context: {},
});
// Output: "es/[Ĥéĺĺó Ŵóŕĺḍ          ]"

// Batch translation
const batch = await translator.batchTranslate("fr", {
  hash1: { text: "Dashboard", context: {} },
  hash2: { text: "Settings", context: {} },
});
```

### 2. LCPTranslator (Production)

For real AI-powered translations:

```typescript
import { LCPTranslator } from "@lingo.dev/_compiler-beta/translate";

// Using Lingo.dev Engine
const translator = new LCPTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Using custom LLM providers
const customTranslator = new LCPTranslator({
  models: {
    "en:es": "google:gemini-2.0-flash",
    "en:fr": "groq:llama3-70b-8192",
    "*:*": "openrouter:anthropic/claude-3.5-sonnet",
  },
  sourceLocale: "en",
  prompt: "Translate professionally for software UI",
});

// Translate
const result = await translator.batchTranslate("es", {
  hash1: { text: "Welcome", context: {} },
  hash2: { text: "Sign In", context: {} },
});
```

## Adding Caching

Wrap any translator with caching:

```typescript
import {
  LCPTranslator,
  createCachedTranslator,
} from "@lingo.dev/_compiler-beta/translate";

const translator = new LCPTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Add disk-based caching
const cachedTranslator = createCachedTranslator(translator, {
  cacheDir: ".lingo",
  sourceRoot: "./app",
});

// Now translations are cached
await cachedTranslator.batchTranslate("es", entriesMap);
// Second call uses cache
await cachedTranslator.batchTranslate("es", entriesMap); // Fast!
```

## Using in Server Components

### Option 1: Pre-loaded Translations (Recommended)

```typescript
import { getServerTranslations } from "@lingo.dev/_compiler-beta/react/server";
import metadata from "./.lingo/metadata.json";
import esTranslations from "./.lingo/cache/es.json";

export default async function Page() {
  const t = await getServerTranslations({
    metadata,
    locale: "es",
    sourceLocale: "en",
    translations: extractTranslations(esTranslations), // Flat hash->translation map
  });

  return <h1>{t("hash123")}</h1>;
}
```

### Option 2: Using Translator (Runtime Translation)

```typescript
import { getServerTranslations } from "@lingo.dev/_compiler-beta/react/server";
import { LCPTranslator, createCachedTranslator } from "@lingo.dev/_compiler-beta/translate";
import metadata from "./.lingo/metadata.json";

const translator = createCachedTranslator(
  new LCPTranslator({
    models: "lingo.dev",
    sourceLocale: "en",
  }),
  {
    cacheDir: ".lingo",
    sourceRoot: "./app",
  }
);

export default async function Page() {
  const t = await getServerTranslations({
    metadata,
    locale: "es",
    sourceLocale: "en",
    translator, // Will translate on-demand
  });

  return <h1>{t("hash123")}</h1>;
}
```

### Option 3: Translation Server (Development)

```typescript
import { getServerTranslations } from "@lingo.dev/_compiler-beta/react/server";
import metadata from "./.lingo/metadata.json";

export default async function Page() {
  const t = await getServerTranslations({
    metadata,
    locale: "es",
    sourceLocale: "en",
    serverPort: 60000, // Fetches from local translation server
  });

  return <h1>{t("hash123")}</h1>;
}
```

## Creating Custom Translators

Implement the `Translator` interface:

```typescript
import type {
  Translator,
  TranslatableEntry,
} from "@lingo.dev/_compiler-beta/translate";

class MyCustomTranslator implements Translator<MyConfig> {
  constructor(readonly config: MyConfig) {}

  async translate(locale: string, entry: TranslatableEntry): Promise<string> {
    // Translate single entry
    return myTranslationService(entry.text, locale);
  }

  async batchTranslate(
    locale: string,
    entriesMap: Record<string, TranslatableEntry>,
  ): Promise<Record<string, string>> {
    // Translate multiple entries efficiently
    const results: Record<string, string> = {};
    for (const [hash, entry] of Object.entries(entriesMap)) {
      results[hash] = await this.translate(locale, entry);
    }
    return results;
  }
}

// Use it
const translator = new MyCustomTranslator({ apiKey: "..." });
const cachedTranslator = createCachedTranslator(translator, {
  cacheDir: ".lingo",
});
```

## Migration from Old API

### Before (TranslateFunction)

```typescript
const translateFn: TranslateFunction = async (
  models,
  sourceDictionary,
  sourceLocale,
  targetLocale,
  prompt,
) => {
  // Translation logic
  return translatedDictionary;
};

const cached = createCachedTranslator(translateFn, cacheConfig);
```

### After (Translator Interface)

```typescript
const translator = new LCPTranslator({
  models,
  sourceLocale,
  prompt,
});

const cached = createCachedTranslator(translator, cacheConfig);
```

## Benefits of the Refactor

1. **Type Safety**: Stronger typing with interface
2. **Consistency**: Same API across all translators
3. **Composability**: Easy to wrap and extend
4. **State Management**: Config stored in translator instance
5. **Testing**: Easy to mock and test
6. **Caching**: Uniform caching wrapper for all translators

## Environment Variables

For LCP translator, set your API keys:

```env
# Recommended
LINGODOTDEV_API_KEY=your_key_here

# Or direct LLM providers
GOOGLE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
```

## Complete Example

```typescript
// translator.ts
import {
  LCPTranslator,
  createCachedTranslator,
} from "@lingo.dev/_compiler-beta/translate";

export const translator = createCachedTranslator(
  new LCPTranslator({
    models: "lingo.dev",
    sourceLocale: "en",
  }),
  {
    cacheDir: ".lingo",
    sourceRoot: "./app",
  }
);

// app/layout.tsx
import { getServerTranslations } from "@lingo.dev/_compiler-beta/react/server";
import { translator } from "./translator";
import metadata from "./.lingo/metadata.json";

export default async function RootLayout({ children }) {
  const t = await getServerTranslations({
    metadata,
    translator,
  });

  return (
    <html>
      <body>
        <nav>
          <a href="/">{t("home_link")}</a>
          <a href="/about">{t("about_link")}</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
```
