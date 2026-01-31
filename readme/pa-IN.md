<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev - LLM-ਸੰਚਾਲਿਤ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਲਈ ਓਪਨ-ਸੋਰਸ i18n ਟੂਲਕਿੱਟ</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## ਤੁਰੰਤ ਸ਼ੁਰੂਆਤ

| ਟੂਲ                                | ਵਰਤੋਂ ਦਾ ਮਾਮਲਾ                                       | ਤੁਰੰਤ ਕਮਾਂਡ                        |
| ---------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ਐਪਸ ਲਈ AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ i18n ਸੈੱਟਅੱਪ           | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ਫਾਈਲਾਂ ਦਾ ਅਨੁਵਾਦ ਕਰੋ   | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions ਵਿੱਚ ਸਵੈਚਲਿਤ ਅਨੁਵਾਦ ਪਾਈਪਲਾਈਨ          | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ਡਾਇਨਾਮਿਕ ਸਮੱਗਰੀ ਲਈ ਰਨਟਾਈਮ ਅਨੁਵਾਦ                     | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrappers ਤੋਂ ਬਿਨਾਂ ਬਿਲਡ-ਟਾਈਮ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol ਸਰਵਰ ਜੋ AI ਕੋਡਿੰਗ ਸਹਾਇਕਾਂ ਨੂੰ ਕੁਦਰਤੀ ਭਾਸ਼ਾ ਪ੍ਰੌਂਪਟਸ ਰਾਹੀਂ React ਐਪਲੀਕੇਸ਼ਨਾਂ ਵਿੱਚ i18n ਬੁਨਿਆਦੀ ਢਾਂਚਾ ਸੈੱਟਅੱਪ ਕਰਨ ਦੇ ਯੋਗ ਬਣਾਉਂਦਾ ਹੈ।

**ਸਮਰਥਿਤ IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**ਸਮਰਥਿਤ ਫਰੇਮਵਰਕ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ਵਰਤੋਂ:**

ਆਪਣੇ IDE ਵਿੱਚ MCP ਸਰਵਰ ਨੂੰ ਸੰਰਚਿਤ ਕਰਨ ਤੋਂ ਬਾਅਦ ([ਕੁਇੱਕਸਟਾਰਟ ਗਾਈਡਾਂ ਦੇਖੋ](https://lingo.dev/en/mcp)), ਆਪਣੇ ਸਹਾਇਕ ਨੂੰ ਪ੍ਰੌਂਪਟ ਕਰੋ:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

ਸਹਾਇਕ ਇਹ ਕਰੇਗਾ:

1. ਲੋਕੇਲ-ਅਧਾਰਿਤ ਰਾਊਟਿੰਗ ਸੰਰਚਿਤ ਕਰੋ (ਜਿਵੇਂ ਕਿ `/en`, `/es`, `/pt-BR`)
2. ਭਾਸ਼ਾ ਸਵਿਚਿੰਗ ਕੰਪੋਨੈਂਟਸ ਸੈੱਟਅੱਪ ਕਰੋ
3. ਆਟੋਮੈਟਿਕ ਲੋਕੇਲ ਡਿਟੈਕਸ਼ਨ ਲਾਗੂ ਕਰੋ
4. ਲੋੜੀਂਦੀਆਂ ਸੰਰਚਨਾ ਫਾਈਲਾਂ ਜਨਰੇਟ ਕਰੋ

**ਨੋਟ:** AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕੋਡ ਜਨਰੇਸ਼ਨ ਗੈਰ-ਨਿਰਧਾਰਕ ਹੈ। ਕਮਿਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਜਨਰੇਟ ਕੀਤੇ ਕੋਡ ਦੀ ਸਮੀਖਿਆ ਕਰੋ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI ਨਾਲ ਐਪਸ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰਨ ਲਈ ਓਪਨ-ਸੋਰਸ CLI। JSON, YAML, CSV, PO ਫਾਈਲਾਂ, ਅਤੇ markdown ਸਮੇਤ ਸਾਰੇ ਉਦਯੋਗ-ਮਿਆਰੀ ਫਾਰਮੈਟਾਂ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।

**ਸੈੱਟਅੱਪ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ:**

1. ਸੰਰਚਿਤ ਫਾਈਲਾਂ ਤੋਂ ਅਨੁਵਾਦਯੋਗ ਸਮੱਗਰੀ ਐਕਸਟਰੈਕਟ ਕਰਦਾ ਹੈ
2. ਅਨੁਵਾਦ ਲਈ LLM ਪ੍ਰੋਵਾਈਡਰ ਨੂੰ ਸਮੱਗਰੀ ਭੇਜਦਾ ਹੈ
3. ਅਨੁਵਾਦਿਤ ਸਮੱਗਰੀ ਨੂੰ ਫਾਈਲਸਿਸਟਮ ਵਿੱਚ ਵਾਪਸ ਲਿਖਦਾ ਹੈ
4. ਪੂਰੇ ਹੋਏ ਅਨੁਵਾਦਾਂ ਨੂੰ ਟਰੈਕ ਕਰਨ ਲਈ `i18n.lock` ਫਾਈਲ ਬਣਾਉਂਦਾ ਹੈ (ਬੇਲੋੜੀ ਪ੍ਰੋਸੈਸਿੰਗ ਤੋਂ ਬਚਦਾ ਹੈ)

**ਸੰਰਚਨਾ:**

`init` ਕਮਾਂਡ ਇੱਕ `i18n.json` ਫਾਈਲ ਜਨਰੇਟ ਕਰਦੀ ਹੈ। ਲੋਕੇਲਾਂ ਅਤੇ ਬਕੇਟਾਂ ਨੂੰ ਸੰਰਚਿਤ ਕਰੋ:

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

`provider` ਫੀਲਡ ਵਿਕਲਪਿਕ ਹੈ (ਡਿਫੌਲਟ Lingo.dev Engine ਹੈ)। ਕਸਟਮ LLM ਪ੍ਰੋਵਾਈਡਰਾਂ ਲਈ:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ਸਮਰਥਿਤ LLM ਪ੍ਰੋਵਾਈਡਰ:**

- Lingo.dev Engine (ਸਿਫਾਰਸ਼ਿਤ)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD ਪਾਈਪਲਾਈਨਾਂ ਲਈ ਆਟੋਮੇਟਿਡ ਅਨੁਵਾਦ ਵਰਕਫਲੋਅ। ਅਧੂਰੇ ਅਨੁਵਾਦਾਂ ਨੂੰ ਪ੍ਰੋਡਕਸ਼ਨ ਤੱਕ ਪਹੁੰਚਣ ਤੋਂ ਰੋਕਦਾ ਹੈ।

**ਸਮਰਥਿਤ ਪਲੇਟਫਾਰਮ:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions ਸੈੱਟਅੱਪ:**

`.github/workflows/translate.yml` ਬਣਾਓ:

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

**ਸੈੱਟਅੱਪ ਲੋੜਾਂ:**

1. ਰਿਪੋਜ਼ਿਟਰੀ ਸੀਕਰੇਟਸ ਵਿੱਚ `LINGODOTDEV_API_KEY` ਸ਼ਾਮਲ ਕਰੋ (Settings > Secrets and variables > Actions)
2. PR ਵਰਕਫਲੋਜ਼ ਲਈ: Settings > Actions > General ਵਿੱਚ "Allow GitHub Actions to create and approve pull requests" ਨੂੰ ਸਮਰੱਥ ਕਰੋ

**ਵਰਕਫਲੋ ਵਿਕਲਪ:**

ਅਨੁਵਾਦਾਂ ਨੂੰ ਸਿੱਧੇ ਕਮਿਟ ਕਰੋ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

ਅਨੁਵਾਦਾਂ ਨਾਲ pull requests ਬਣਾਓ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ਉਪਲਬਧ ਇਨਪੁੱਟਸ:**

| Input                | Default                                        | Description                    |
| -------------------- | ---------------------------------------------- | ------------------------------ |
| `api-key`            | (ਲੋੜੀਂਦਾ)                                      | Lingo.dev API ਕੁੰਜੀ            |
| `pull-request`       | `false`                                        | ਸਿੱਧੇ ਕਮਿਟ ਕਰਨ ਦੀ ਬਜਾਏ PR ਬਣਾਓ |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | ਕਸਟਮ ਕਮਿਟ ਸੁਨੇਹਾ               |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | ਕਸਟਮ PR ਸਿਰਲੇਖ                 |
| `working-directory`  | `"."`                                          | ਚਲਾਉਣ ਲਈ ਡਾਇਰੈਕਟਰੀ             |
| `parallel`           | `false`                                        | ਸਮਾਂਤਰ ਪ੍ਰੋਸੈਸਿੰਗ ਸਮਰੱਥ ਕਰੋ    |

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ਗਤੀਸ਼ੀਲ ਸਮੱਗਰੀ ਲਈ ਰਨਟਾਈਮ ਅਨੁਵਾਦ ਲਾਇਬ੍ਰੇਰੀ। JavaScript, PHP, Python, ਅਤੇ Ruby ਲਈ ਉਪਲਬਧ।

**ਇੰਸਟਾਲੇਸ਼ਨ:**

```bash
npm install lingo.dev
```

**ਵਰਤੋਂ:**

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

**ਉਪਲਬਧ SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - ਵੈੱਬ ਐਪਸ, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/sdk)

---

### Lingo.dev ਕੰਪਾਇਲਰ

ਬਿਲਡ-ਟਾਈਮ ਅਨੁਵਾਦ ਸਿਸਟਮ ਜੋ ਕੰਪੋਨੈਂਟਸ ਨੂੰ ਸੋਧੇ ਬਿਨਾਂ React ਐਪਸ ਨੂੰ ਬਹੁ-ਭਾਸ਼ਾਈ ਬਣਾਉਂਦਾ ਹੈ। ਰਨਟਾਈਮ ਦੀ ਬਜਾਏ ਬਿਲਡ ਦੌਰਾਨ ਕੰਮ ਕਰਦਾ ਹੈ।

**ਇੰਸਟਾਲੇਸ਼ਨ:**

```bash
pnpm install @lingo.dev/compiler
```

**ਪ੍ਰਮਾਣਿਕਤਾ:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**ਕੌਂਫਿਗਰੇਸ਼ਨ (Next.js):**

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

**ਕੌਂਫਿਗਰੇਸ਼ਨ (Vite):**

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

**ਪ੍ਰੋਵਾਈਡਰ ਸੈੱਟਅੱਪ:**

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

**ਭਾਸ਼ਾ ਸਵਿੱਚਰ:**

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

**ਡਿਵੈਲਪਮੈਂਟ:** `npm run dev` (pseudotranslator ਵਰਤਦਾ ਹੈ, ਕੋਈ API ਕਾਲਾਂ ਨਹੀਂ)

**ਪ੍ਰੋਡਕਸ਼ਨ:** `usePseudotranslator: false` ਸੈੱਟ ਕਰੋ, ਫਿਰ `next build`

`.lingo/` ਡਾਇਰੈਕਟਰੀ ਨੂੰ ਵਰਜ਼ਨ ਕੰਟਰੋਲ ਵਿੱਚ ਕਮਿਟ ਕਰੋ।

**ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ:**

- ਜ਼ੀਰੋ ਰਨਟਾਈਮ ਪਰਫਾਰਮੈਂਸ ਲਾਗਤ
- ਕੋਈ ਅਨੁਵਾਦ ਕੁੰਜੀਆਂ ਜਾਂ JSON ਫਾਈਲਾਂ ਨਹੀਂ
- ਕੋਈ `t()` ਫੰਕਸ਼ਨ ਜਾਂ `<T>` ਰੈਪਰ ਕੰਪੋਨੈਂਟਸ ਨਹੀਂ
- JSX ਵਿੱਚ ਅਨੁਵਾਦਯੋਗ ਟੈਕਸਟ ਦੀ ਆਟੋਮੈਟਿਕ ਖੋਜ
- TypeScript ਸਪੋਰਟ
- ਬਹੁਵਚਨਾਂ ਲਈ ICU MessageFormat
- `data-lingo-override` ਐਟ੍ਰੀਬਿਊਟ ਰਾਹੀਂ ਮੈਨੁਅਲ ਓਵਰਰਾਈਡਸ
- ਬਿਲਟ-ਇਨ ਅਨੁਵਾਦ ਐਡੀਟਰ ਵਿਜੇਟ

**ਬਿਲਡ ਮੋਡਸ:**

- `pseudotranslator`: ਪਲੇਸਹੋਲਡਰ ਅਨੁਵਾਦਾਂ ਨਾਲ ਡਿਵੈਲਪਮੈਂਟ ਮੋਡ (ਕੋਈ API ਲਾਗਤਾਂ ਨਹੀਂ)
- `real`: LLMs ਵਰਤ ਕੇ ਅਸਲ ਅਨੁਵਾਦ ਜਨਰੇਟ ਕਰੋ
- `cache-only`: CI ਤੋਂ ਪਹਿਲਾਂ ਤੋਂ ਜਨਰੇਟ ਕੀਤੇ ਅਨੁਵਾਦਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ ਪ੍ਰੋਡਕਸ਼ਨ ਮੋਡ (ਕੋਈ API ਕਾਲਾਂ ਨਹੀਂ)

**ਸਪੋਰਟ ਕੀਤੇ ਫਰੇਮਵਰਕਸ:**

- Next.js (React Server Components ਨਾਲ App Router)
- Vite + React (SPA ਅਤੇ SSR)

ਵਾਧੂ ਫਰੇਮਵਰਕ ਸਪੋਰਟ ਦੀ ਯੋਜਨਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/compiler)

---

## ਯੋਗਦਾਨ

ਯੋਗਦਾਨ ਦਾ ਸਵਾਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹਨਾਂ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ:

1. **ਮੁੱਦੇ:** [ਬੱਗਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ ਫੀਚਰਾਂ ਦੀ ਬੇਨਤੀ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ਪੁੱਲ ਰਿਕੁਐਸਟਾਂ:** [ਤਬਦੀਲੀਆਂ ਸਬਮਿਟ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ਹਰੇਕ PR ਲਈ ਇੱਕ changeset ਦੀ ਲੋੜ ਹੈ: `pnpm new` (ਜਾਂ ਗੈਰ-ਰਿਲੀਜ਼ ਤਬਦੀਲੀਆਂ ਲਈ `pnpm new:empty`)
   - ਸਬਮਿਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਟੈਸਟ ਪਾਸ ਹੋ ਜਾਣ
3. **ਡਿਵੈਲਪਮੈਂਟ:** ਇਹ ਇੱਕ pnpm + turborepo monorepo ਹੈ
   - ਡਿਪੈਂਡੈਂਸੀਆਂ ਇੰਸਟਾਲ ਕਰੋ: `pnpm install`
   - ਟੈਸਟ ਚਲਾਓ: `pnpm test`
   - ਬਿਲਡ: `pnpm build`

**ਸਹਾਇਤਾ:** [Discord ਕਮਿਊਨਿਟੀ](https://lingo.dev/go/discord)

## ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇਕਰ ਤੁਹਾਨੂੰ Lingo.dev ਉਪਯੋਗੀ ਲੱਗਦਾ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਇੱਕ ਸਟਾਰ ਦਿਓ ਅਤੇ 10,000 ਸਟਾਰ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ਸਥਾਨਿਕ ਦਸਤਾਵੇਜ਼ੀਕਰਨ

**ਉਪਲਬਧ ਅਨੁਵਾਦ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ਨਵੀਂ ਭਾਸ਼ਾ ਸ਼ਾਮਲ ਕਰਨਾ:**

1. [`i18n.json`](./i18n.json) ਵਿੱਚ [BCP-47 ਫਾਰਮੈਟ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ ਲੋਕੇਲ ਕੋਡ ਸ਼ਾਮਲ ਕਰੋ
2. ਇੱਕ ਪੁੱਲ ਰਿਕੁਐਸਟ ਸਬਮਿਟ ਕਰੋ

**BCP-47 ਲੋਕੇਲ ਫਾਰਮੈਟ:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- ਉਦਾਹਰਨਾਂ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
