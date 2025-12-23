# Translation API Usage Guide

This guide shows how to use the refactored Translator interface in compiler-beta.

## Overview

The translation system now uses the `Translator` interface consistently across all components:

```typescript
interface Translator<Config> {
  config: Config;
  translate: (
    locale: LocaleCode,
    entriesMap: Record<string, TranslatableEntry>,
  ) => Promise<Record<string, string>>;
}
```

The `translate()` method handles batch translation - you can translate one or many entries at once.

## Available Translators

### 1. PseudoTranslator (Testing)

For development and testing without real translations:

```typescript
import { PseudoTranslator } from "@lingo.dev/compiler-beta/translate";

const translator = new PseudoTranslator({});

// Single entry
const result = await translator.translate("es", {
  temp: { text: "Hello World", context: {} },
});
// Output: { temp: "es/Ĥéĺĺó Ŵóŕĺḍ          " }

// Multiple entries
const batch = await translator.translate("fr", {
  hash1: { text: "Dashboard", context: {} },
  hash2: { text: "Settings", context: {} },
});
// Output: { hash1: "fr/Ḍáśĥḅóáŕḍ     ", hash2: "fr/Śéţţíñĝś    " }
```

### 2. lingoTranslator (Production)

For real AI-powered translations:

```typescript
import { lingoTranslator } from "@lingo.dev/compiler-beta/translate";

// Using Lingo.dev Engine
const translator = new lingoTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Using custom LLM providers
const customTranslator = new lingoTranslator({
  models: {
    "en:es": "google:gemini-2.0-flash",
    "en:fr": "groq:llama3-70b-8192",
    "*:*": "openrouter:anthropic/claude-3.5-sonnet",
  },
  sourceLocale: "en",
  prompt: "Translate professionally for software UI",
});

// Translate
const result = await translator.translate("es", {
  hash1: { text: "Welcome", context: {} },
  hash2: { text: "Sign In", context: {} },
});
```

## Adding Caching

Wrap any translator with caching:

```typescript
import {
  lingoTranslator,
  createCachedTranslator,
} from "@lingo.dev/compiler-beta/translate";

const translator = new lingoTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Add disk-based caching
const cachedTranslator = createCachedTranslator(translator, {
  cacheDir: ".lingo",
  sourceRoot: "./app",
});

// Now translations are cached
await cachedTranslator.translate("es", entriesMap);
// Second call uses cache
await cachedTranslator.translate("es", entriesMap); // Fast!
```

## Using in Server Components

### Option 1: Pre-loaded Translations (Recommended)

```typescript
import { getServerTranslations } from "@lingo.dev/compiler-beta/react/server";
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
import { getServerTranslations } from "@lingo.dev/compiler-beta/react/server";
import { lingoTranslator, createCachedTranslator } from "@lingo.dev/compiler-beta/translate";
import metadata from "./.lingo/metadata.json";

const translator = createCachedTranslator(
  new lingoTranslator({
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
import { getServerTranslations } from "@lingo.dev/compiler-beta/react/server";
import metadata from "./.lingo/metadata.json";

export default async function Page() {
  const t = await getServerTranslations({
    metadata,
    locale: "es",
    sourceLocale: "en",
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
} from "@lingo.dev/compiler-beta/translate";

class MyCustomTranslator implements Translator<MyConfig> {
  constructor(readonly config: MyConfig) {}

  async translate(
    locale: LocaleCode,
    entriesMap: Record<string, TranslatableEntry>,
  ): Promise<Record<string, string>> {
    // Translate multiple entries
    const results: Record<string, string> = {};
    for (const [hash, entry] of Object.entries(entriesMap)) {
      results[hash] = await myTranslationService(entry.text, locale);
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
const translator = new lingoTranslator({
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

For lingo translator, set your API keys:

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
  LingoTranslator,
  createCachedTranslator,
} from "@lingo.dev/compiler-beta/translate";

export const translator = createCachedTranslator(
  new LingoTranslator({
    models: "lingo.dev",
    sourceLocale: "en",
  }),
  {
    cacheDir: ".lingo",
    sourceRoot: "./app",
  }
);

// app/layout.tsx
import { getServerTranslations } from "@lingo.dev/compiler-beta/react/server";
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
