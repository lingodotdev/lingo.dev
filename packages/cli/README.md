<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev - Open-source i18n toolkit for LLM-powered localization</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •
  <a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •
  <a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## Quick Start

| Tool                               | Use Case                                            | Quick Command                      |
| ---------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | AI-assisted i18n setup for React apps               | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Translate JSON, YAML, markdown, CSV, PO files       | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Automated translation pipeline in GitHub Actions    | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Runtime translation for dynamic content             | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Build-time React localization without i18n wrappers | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol server that enables AI coding assistants to set up i18n infrastructure in React applications through natural language prompts.

**Supported IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Supported frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Usage:**

After configuring the MCP server in your IDE ([see quickstart guides](https://lingo.dev/en/mcp)), prompt your assistant:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

The assistant will:

1. Configure locale-based routing (e.g., `/en`, `/es`, `/pt-BR`)
2. Set up language switching components
3. Implement automatic locale detection
4. Generate necessary configuration files

**Note:** AI-assisted code generation is non-deterministic. Review generated code before committing.

[Read the docs →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Open-source CLI for translating apps and content with AI. Supports all industry-standard formats including JSON, YAML, CSV, PO files, and markdown.

**Setup:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**How it works:**

1. Extracts translatable content from configured files
2. Sends content to LLM provider for translation
3. Writes translated content back to filesystem
4. Creates `i18n.lock` file to track completed translations (avoids redundant processing)

**Configuration:**

The `init` command generates an `i18n.json` file. Configure locales and buckets:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

The `provider` field is optional (defaults to Lingo.dev Engine). For custom LLM providers:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Supported LLM providers:**

- Lingo.dev Engine (recommended)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Read the docs →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Automated translation workflows for CI/CD pipelines. Prevents incomplete translations from reaching production.

**Supported platforms:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions setup:**

Create `.github/workflows/translate.yml`:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Setup requirements:**

1. Add `LINGODOTDEV_API_KEY` to repository secrets (Settings > Secrets and variables > Actions)
2. For PR workflows: Enable "Allow GitHub Actions to create and approve pull requests" in Settings > Actions > General

**Workflow options:**

Commit translations directly:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Create pull requests with translations:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Available inputs:**

| Input                | Default                                        | Description                              |
| -------------------- | ---------------------------------------------- | ---------------------------------------- |
| `api-key`            | (required)                                     | Lingo.dev API key                        |
| `pull-request`       | `false`                                        | Create PR instead of committing directly |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Custom commit message                    |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Custom PR title                          |
| `working-directory`  | `"."`                                          | Directory to run in                      |
| `parallel`           | `false`                                        | Enable parallel processing               |

[Read the docs →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Runtime translation library for dynamic content. Available for JavaScript, PHP, Python, and Ruby.

**Installation:**

```bash
npm install lingo.dev
```

**Usage:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**Available SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[Read the docs →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

Build-time translation system that makes React apps multilingual without modifying components. Operates during build rather than runtime.

**Installation:**

```bash
pnpm install @lingo.dev/compiler
```

**Authentication:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Configuration (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**Configuration (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Provider setup:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**Language switcher:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Development:** `npm run dev` (uses pseudotranslator, no API calls)

**Production:** Set `usePseudotranslator: false`, then `next build`

Commit the `.lingo/` directory to version control.

**Key features:**

- Zero runtime performance cost
- No translation keys or JSON files
- No `t()` functions or `<T>` wrapper components
- Automatic detection of translatable text in JSX
- TypeScript support
- ICU MessageFormat for plurals
- Manual overrides via `data-lingo-override` attribute
- Built-in translation editor widget

**Build modes:**

- `pseudotranslator`: Development mode with placeholder translations (no API costs)
- `real`: Generate actual translations using LLMs
- `cache-only`: Production mode using pre-generated translations from CI (no API calls)

**Supported frameworks:**

- Next.js (App Router with React Server Components)
- Vite + React (SPA and SSR)

Additional framework support planned.

[Read the docs →](https://lingo.dev/en/compiler)

---

## Contributing

Contributions welcome. Please follow these guidelines:

1. **Issues:** [Report bugs or request features](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Submit changes](https://github.com/lingodotdev/lingo.dev/pulls)
   - Every PR requires a changeset: `pnpm new` (or `pnpm new:empty` for non-release changes)
   - Ensure tests pass before submitting
3. **Development:** This is a pnpm + turborepo monorepo
   - Install dependencies: `pnpm install`
   - Run tests: `pnpm test`
   - Build: `pnpm build`

**Support:** [Discord community](https://lingo.dev/go/discord)

## Star History

If you find Lingo.dev useful, give us a star and help us reach 10,000 stars!

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Localized Documentation

**Available translations:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Adding a new language:**

1. Add locale code to [`i18n.json`](./i18n.json) using [BCP-47 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Submit a pull request

**BCP-47 locale format:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- Examples: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
