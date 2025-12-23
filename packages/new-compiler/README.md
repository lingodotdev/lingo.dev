# @lingo.dev/compiler

See the main [README](../../README.md) for general information.

Lingo.dev compiler with automatic translation support for React applications.

This package provides plugins for multiple bundlers (Vite, Webpack) and Next.js that
automatically transforms React components to inject translation calls.

## Features

- **Automatic JSX text transformation** - Automatically detects and transforms translatable text in JSX
- **Opt-in or automatic** - Configure whether to require `'use i18n'` directive or transform all files
- **Multi-bundler support** - Works with Vite, Webpack and Next.js (both Webpack and Turbopack builds)
- **Translation server** - On-demand translation generation during development
- **AI-powered translations** - Support for multiple LLM providers (OpenAI, Anthropic, Google Gemini, Groq, Mistral, OpenRouter, Ollama) and Lingo.dev Engine
- **Manual overrides** - Override AI translations for specific locales using `data-lingo-override` attribute
- **Custom locale resolvers** - Provide your own locale detection and persistence logic
- **Automatic pluralization** - Detects and converts messages to ICU MessageFormat

## Getting started

Install the package - `pnpm install @lingo.dev/compiler`

### Vite

- Configure the plugin in your vite config.

  ```ts
  import { defineConfig } from "vite";
  import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

  export default defineConfig({
    plugins: [
      lingoCompilerPlugin({
        sourceRoot: "src",
        sourceLocale: "en",
        targetLocales: ["es", "de", "fr"],
        models: "lingo.dev",
        dev: {
          usePseudotranslator: true,
        },
      }), // ...other plugins
    ],
  });
  ```

- Wrap your app with `LingoProvider`. It should be used as early as possible in your app.
  e.g. in vite example with tanstack-router `LingoProvider` should be above `RouterProvider`, otherwise code-splitting breaks contexts.
  ```tsx
  // Imports and other tanstack router setup
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <LingoProvider>
          <RouterProvider router={router} />
        </LingoProvider>
      </StrictMode>,
    );
  }
  ```

See `demo/new-compiler-vite-react-spa` for the working example

### Next.js

- Use `withLingo` function to wrap your existing next config. You will have to make your config async.

  ```ts
  import type { NextConfig } from "next";
  import { withLingo } from "@lingo.dev/compiler/next";

  const nextConfig: NextConfig = {};

  export default async function (): Promise<NextConfig> {
    return await withLingo(nextConfig, {
      sourceRoot: "./app",
      sourceLocale: "en",
      targetLocales: ["es", "de", "ru"],
      models: "lingo.dev",
      dev: {
        usePseudotranslator: true,
      },
      buildMode: "cache-only",
    });
  }
  ```

- Wrap your app with `LingoProvider`. It should be used as early as possible in your app, root `Layout` is a good place.
  ```tsx
  export default function RootLayout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <LingoProvider>
        <html>
          <body className="antialiased">{children}</body>
        </html>
      </LingoProvider>
    );
  }
  ```

See `demo/new-compiler-next16` for the working example

## Configuration Options

### Core Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceRoot` | `string` | `"src"` | Root directory of the source code |
| `lingoDir` | `string` | `"lingo"` | Directory for lingo files (`.lingo/`) |
| `sourceLocale` | `LocaleCode` | **(required)** | Source locale (e.g., `"en"`, `"en-US"`) |
| `targetLocales` | `LocaleCode[]` | **(required)** | Target locales to translate to |
| `useDirective` | `boolean` | `false` | Whether to require `'use i18n'` directive |
| `models` | `string \| Record<string, string>` | `"lingo.dev"` | Model configuration (see below) |
| `prompt` | `string` | `undefined` | Custom translation prompt |
| `buildMode` | `"translate" \| "cache-only"` | `"translate"` | Build mode (see below) |

### Development Configuration

Configure development-specific behavior via the `dev` option:

```ts
{
  dev: {
    // Use pseudotranslator (fake translations) instead of real AI
    usePseudotranslator: boolean;  // default: false

    // Starting port for translation server
    translationServerStartPort: number;  // default: 60000

    // Custom translation server URL (advanced)
    translationServerUrl?: string;
  }
}
```

### Locale Persistence

Configure how locale changes are persisted:

```ts
{
  localePersistence: {
    type: "cookie",
    config: {
      name: string;    // default: "locale"
      maxAge: number;  // default: 31536000 (1 year)
    }
  }
}
```

### Pluralization

Configure automatic pluralization detection:

```ts
{
  pluralization: {
    enabled: boolean;  // default: true
    model: string;     // default: "groq:llama-3.1-8b-instant"
  }
}
```

## Using LLMs for Translation

### Lingo.dev Engine (Recommended)

The simplest way to get started is using Lingo.dev Engine:

```ts
{
  models: "lingo.dev"
}
```

Set your API key in `.env`:

```bash
LINGODOTDEV_API_KEY=your_api_key_here
```

Get your API key at [lingo.dev](https://lingo.dev)

### Direct LLM Providers

You can use any supported LLM provider directly. Configure using locale-pair mapping:

```ts
{
  models: {
    // Specific locale pair
    "en:es": "google:gemini-2.0-flash",

    // Wildcard patterns
    "*:de": "groq:llama3-8b-8192",         // All translations to German
    "en:*": "openai:gpt-4o",               // All translations from English
    "*:*": "anthropic:claude-3-5-sonnet"   // Fallback for all other pairs
  }
}
```

**Supported Providers:**

| Provider | Model String Format | Environment Variable | Get API Key |
|----------|---------------------|---------------------|-------------|
| **OpenAI** | `openai:gpt-4o` | `OPENAI_API_KEY` | [platform.openai.com](https://platform.openai.com/account/api-keys) |
| **Anthropic** | `anthropic:claude-3-5-sonnet` | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/get-api-key) |
| **Google** | `google:gemini-2.0-flash` | `GOOGLE_API_KEY` | [ai.google.dev](https://ai.google.dev/) |
| **Groq** | `groq:llama3-8b-8192` | `GROQ_API_KEY` | [groq.com](https://groq.com) |
| **Mistral** | `mistral:mistral-large` | `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai) |
| **OpenRouter** | `openrouter:anthropic/claude-3.5-sonnet` | `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) |
| **Ollama** | `ollama:llama2` | *(none required)* | [ollama.com/download](https://ollama.com/download) |

**Example with multiple providers:**

```ts
{
  sourceLocale: "en",
  targetLocales: ["es", "de", "fr", "ja"],
  models: {
    "en:es": "groq:llama3-8b-8192",        // Fast & cheap for Spanish
    "en:de": "google:gemini-2.0-flash",    // Good for German
    "*:*": "openai:gpt-4o"                 // High quality for everything else
  }
}
```

### Custom Translation Prompts

Customize the translation prompt using placeholders:

```ts
{
  models: "lingo.dev",
  prompt: "Translate from {SOURCE_LOCALE} to {TARGET_LOCALE}. Use a formal tone and preserve all technical terms."
}
```

## Manual Translation Overrides

Override AI-generated translations for specific text using the `data-lingo-override` attribute:

```tsx
export function Welcome() {
  return (
    <div>
      {/* Override translations for brand name */}
      <h1 data-lingo-override={{ de: "Lingo.dev", fr: "Lingo.dev", es: "Lingo.dev" }}>
        Lingo.dev
      </h1>

      {/* Override only specific locales */}
      <p data-lingo-override={{ de: "Professionelle Übersetzung" }}>
        Professional translation
      </p>

      {/* Works with rich text and interpolations */}
      <p data-lingo-override={{
        de: "Willkommen <strong0>{name}</strong0>",
        fr: "Bienvenue <strong0>{name}</strong0>"
      }}>
        Welcome <strong>{name}</strong>
      </p>
    </div>
  );
}
```

The `data-lingo-override` attribute:
- Accepts an object with locale codes as keys
- Supports partial overrides (only specify locales you want to override)
- Is automatically removed from the final output
- Works with locale region codes (e.g., `en-US`, `en-GB`)
- Supports rich text with component placeholders (e.g., `<strong0>`)

**Use cases:**
- Brand names that shouldn't be translated
- Technical terms requiring specific translations
- Legal text requiring certified translations
- Marketing copy that needs human review

## Build Modes

Control how translations are handled at build time:

### `translate` (default)

Generate missing translations at build time using configured LLM:

```ts
{
  buildMode: "translate"
}
```

- Generates translations for any missing entries
- Fails build if translation fails
- Best for: Development and CI pipelines with API keys

### `cache-only`

Only use existing cached translations:

```ts
{
  buildMode: "cache-only"
}
```

- No API calls made during build
- Fails build if translations are missing
- Best for: Production builds without API keys
- Requires translations to be pre-generated (during dev or in CI)

**Environment Variable Override:**

```bash
LINGO_BUILD_MODE=cache-only npm run build
```

**Recommended Workflow:**

1. **Development**: Use `translate` mode with `usePseudotranslator: true`
2. **CI**: Generate real translations with `buildMode: "translate"` and real API keys
3. **Production Build**: Use `buildMode: "cache-only"` (no API keys needed)

## Custom Locale Resolvers

Customize how locales are detected and persisted by providing custom resolver files:

### Custom Server Locale Resolver

Create `.lingo/locale-resolver.server.ts` (Next.js):

```ts
// Custom server-side locale detection
export async function getServerLocale(): Promise<string> {
  // Your custom logic - e.g., from database, headers, etc.
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');

  // Parse and return locale
  return acceptLanguage?.split(',')[0]?.split('-')[0] || 'en';
}
```

### Custom Client Locale Resolver

Create `.lingo/locale-resolver.client.ts`:

```ts
// Custom client-side locale detection and persistence
export function getClientLocale(): string {
  // Your custom logic - e.g., from localStorage, URL params, etc.
  return localStorage.getItem('user-locale') || 'en';
}

export function persistLocale(locale: string): void {
  localStorage.setItem('user-locale', locale);
  // Optionally update URL, etc.
}
```

If these files don't exist, the compiler uses the default cookie-based implementation.

## Development

`pnpm install` from project root
`pnpm turbo dev --filter=@lingo.dev/compile` to compile and watch for compiler changes

Choose the demo you want to work with and run it from the corresponding folder.
`tsdown` in compiler is configured to cleanup the output folder before compilation, which works fine with next, but vite
seems to be dead every time and has to be restarted.

## Structure

The compiler is organized into several key modules:

### Core Directories

#### `src/plugin/` - Build-time transformation

- **`transform/`** - Babel AST transformation logic for JSX text extraction
- **`unplugin.ts`** - Universal plugin implementation (Vite, Webpack)
- **`next.ts`** - Next.js-specific plugin with Turbopack and Webpack support
- **`build-translator.ts`** - Batch translation generation at build time
- **`virtual-modules-code-generator.ts`** - Generates code for virtual modules, dev config and locale resolvers for client and server

#### `src/metadata/` - Translation metadata management

- **`manager.ts`** - CRUD operations for `.lingo/metadata.json`
- Thread-safe metadata file operations with file locking
- Manages translation entries with hash-based identifiers

#### `src/translators/` - Translation provider abstraction

- **`lcp/`** - Lingo.dev Engine integration
- **`pseudotranslator/`** - Development-mode fake translator
- **`pluralization/`** - Automatic ICU MessageFormat detection
- **`translator-factory.ts`** - Provider selection and initialization

#### `src/translation-server/` - Development server

- **`translation-server.ts`** - HTTP server for on-demand translations
- **`cli.ts`** - Standalone CLI for translation generation
- WebSocket support for real-time dev widget updates
- Port management (60000-60099 range)

#### `src/react/` - Runtime translation hooks

- **`client/`** - Client-side Context-based hooks
- **`server/`** - Server component cache-based hooks (isomorphic)
- **`server-only/`** - Async server-only API (`getServerTranslations`)
- **`shared/`** - Shared utilities (RichText rendering, Context)
- **`next/`** - Next.js-specific middleware and locale switcher

#### `src/utils/` - Shared utilities

- **`hash.ts`** - Stable hash generation for translation keys
- **`config-factory.ts`** - Configuration defaults and merging
- **`logger.ts`** - Structured logging utilities
- **`path-helpers.ts`** - File path resolution

#### `src/widget/` - Development widget

- In-browser translation editor overlay for development mode

### Support Directories

#### `tests/` - End-to-end testing

- **`e2e/`** - Playwright tests for full build workflows
- **`fixtures/`** - Test applications (Vite, Next.js)
- **`helpers/`** - Test utilities and assertions

#### `benchmarks/` - Performance benchmarks

- Translation speed benchmarks
- Metadata I/O performance tests

#### `old-docs/` - Legacy documentation

- Historical design documents and notes

### Entry Points

- **`src/index.ts`** - Main package exports (plugins, types)
- **`src/types.ts`** - Core TypeScript types

## Contributing

This is a beta package under active development. Feedback and contributions are welcome!

## License

ISC
