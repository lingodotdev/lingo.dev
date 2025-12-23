# Lingo Translator

Real AI-powered translation using various LLM providers for compiler-beta.

## Overview

The lingo Translator implements the `Translator` interface and provides real translation capabilities using:

- **Lingo.dev Engine** (recommended) - Optimized for localization
- **Direct LLM providers** - Google, Groq, OpenRouter, Ollama, Mistral

## Features

- ✅ Implements standard `Translator` interface
- ✅ Both single and batch translation
- ✅ Multiple LLM provider support
- ✅ Automatic chunking for large dictionaries
- ✅ Few-shot learning for better accuracy
- ✅ Custom prompts support
- ✅ Locale-specific model selection

## Installation

The required dependencies are already included in compiler-beta:

- `ai` - Vercel AI SDK
- `@ai-sdk/google`, `@ai-sdk/groq`, `@ai-sdk/mistral` - LLM providers
- `@openrouter/ai-sdk-provider` - OpenRouter
- `ollama-ai-provider` - Ollama
- `@lingo.dev/_sdk` - Lingo.dev Engine
- `fast-xml-parser` - XML serialization
- `dotenv` - Environment variables

## Usage

### Basic Usage with Lingo.dev Engine (Recommended)

```typescript
import { lingoTranslator } from "@lingo.dev/compiler-beta/translate";

const translator = new lingoTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Single entry translation
const result = await translator.translate("es", {
  temp: { text: "Hello World", context: {} },
});
console.log(result); // { temp: "Hola Mundo" }

// Multiple entries translation
const batch = await translator.translate("fr", {
  hash1: { text: "Dashboard", context: {} },
  hash2: { text: "Settings", context: {} },
});
console.log(batch);
// { hash1: "Tableau de bord", hash2: "Paramètres" }
```

### Using Direct LLM Providers

```typescript
const translator = new lingoTranslator({
  models: {
    "en:es": "google:gemini-2.0-flash",
    "en:fr": "groq:llama3-8b-8192",
    "*:*": "openrouter:anthropic/claude-3.5-sonnet",
  },
  sourceLocale: "en",
});

await translator.translate("es", {
  text: "Welcome to our app",
  context: {},
});
```

### With Custom Prompts

```typescript
const translator = new lingoTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
  prompt: `
    Translate from {SOURCE_LOCALE} to {TARGET_LOCALE}.
    Use formal language.
    Keep technical terms in English.
  `,
});
```

### With Caching

```typescript
import {
  lingoTranslator,
  createCachedTranslator,
} from "@lingo.dev/compiler-beta/translate";

const translator = new lingoTranslator({
  models: "lingo.dev",
  sourceLocale: "en",
});

// Wrap with caching
const cachedTranslator = createCachedTranslator(translator, {
  cacheDir: ".lingo",
  sourceRoot: "./app",
});
```

## Configuration

### lingoTranslatorConfig

```typescript
interface lingoTranslatorConfig {
  // Model configuration
  models: "lingo.dev" | Record<string, string>;

  // Source locale (e.g., "en")
  sourceLocale: string;

  // Optional custom prompt
  prompt?: string | null;
}
```

### Model Configuration Patterns

The `models` field supports flexible locale-to-model mapping:

```typescript
{
  // Exact locale pair
  "en:es": "google:gemini-2.0-flash",

  // Any source to Spanish
  "*:es": "groq:llama3-70b-8192",

  // English to any target
  "en:*": "openrouter:anthropic/claude-3.5-sonnet",

  // Fallback for any pair
  "*:*": "ollama:llama2",
}
```

The translator will check in this order:

1. `sourceLocale:targetLocale`
2. `*:targetLocale`
3. `sourceLocale:*`
4. `*:*`

## Supported Providers

### 1. Lingo.dev Engine (Recommended)

```typescript
models: "lingo.dev";
```

**Environment variable:** `LINGODOTDEV_API_KEY`

- Optimized specifically for software localization
- Handles technical terms, variables, and expressions
- Best accuracy for UI translations

### 2. Google Gemini

```typescript
models: {
  "*:*": "google:gemini-2.0-flash"
}
```

**Environment variable:** `GOOGLE_API_KEY`

### 3. Groq

```typescript
models: {
  "*:*": "groq:llama3-8b-8192"
}
```

**Environment variable:** `GROQ_API_KEY`

### 4. OpenRouter

```typescript
models: {
  "*:*": "openrouter:anthropic/claude-3.5-sonnet"
}
```

**Environment variable:** `OPENROUTER_API_KEY`

### 5. Ollama (Local)

```typescript
models: {
  "*:*": "ollama:llama2"
}
```

No API key required. Requires local Ollama installation.

### 6. Mistral

```typescript
models: {
  "*:*": "mistral:mistral-large-latest"
}
```

**Environment variable:** `MISTRAL_API_KEY`

## Environment Variables

Set API keys in `.env` file:

```env
# Lingo.dev Engine (recommended)
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers
GOOGLE_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
OPENROUTER_API_KEY=your_key_here
MISTRAL_API_KEY=your_key_here
```

## Advanced Features

### Automatic Chunking

The translator automatically splits large dictionaries into chunks of 100 entries to avoid token limits:

```typescript
// Handles 1000s of entries automatically
const result = await translator.translate("es", largeEntriesMap);
```

### Few-Shot Learning

The translator uses example translations to improve accuracy. Examples are defined in `shots.ts` and automatically included in prompts.

### XML Serialization

Translation data is serialized to XML for better LLM understanding:

- Clear structure
- Preserves nesting
- Maintains hash relationships

## API Reference

### `lingoTranslator` class

```typescript
class LingoTranslator implements Translator<lingoTranslatorConfig> {
  constructor(config: lingoTranslatorConfig);

  // Translate one or more entries
  translate(
    locale: LocaleCode,
    entriesMap: Record<string, TranslatableEntry>,
  ): Promise<Record<string, string>>;
}
```

### `TranslatableEntry` interface

```typescript
interface TranslatableEntry {
  text: string;
  context: Record<string, any>;
}
```

## Comparison with PseudoTranslator

| Feature           | lingoTranslator | PseudoTranslator    |
| ----------------- | --------------- | ------------------- |
| Real translations | ✅ Yes          | ❌ No (fake)        |
| Requires API key  | ✅ Yes          | ❌ No               |
| Cost              | 💰 Varies       | 🆓 Free             |
| Use case          | Production      | Testing/development |
| Accuracy          | 🎯 High         | 🎪 N/A              |

## Error Handling

The translator throws descriptive errors:

```typescript
try {
  await translator.translate("es", entry);
} catch (error) {
  // Common errors:
  // - Missing API key
  // - Invalid provider/model
  // - LLM API failures
  // - Network issues
}
```

## Performance

- **Batch translation**: Much faster than multiple single translations
- **Chunking**: Prevents token limit issues
- **Caching**: Combine with `createCachedTranslator` to avoid re-translation

## Examples

See `lingo-translator.test.ts` for working examples.

## Related

- `PseudoTranslator` - For testing without real translations
- `createCachedTranslator` - Add disk caching
- `ServerTranslationCache` - Manual cache management
