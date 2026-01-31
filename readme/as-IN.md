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
  <strong>
    Lingo.dev - LLM-চালিত স্থানীয়কৰণৰ বাবে মুক্ত উৎসৰ i18n টুলকিট
  </strong>
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

## দ্ৰুত আৰম্ভণি

| টুল                                | ব্যৱহাৰৰ ক্ষেত্ৰ                                 | দ্ৰুত কমাণ্ড                       |
| ---------------------------------- | ------------------------------------------------ | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React এপৰ বাবে AI-সহায়ক i18n ছেটআপ              | প্ৰম্পট: `Set up i18n`             |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ফাইল অনুবাদ কৰক    | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions ত স্বয়ংক্ৰিয় অনুবাদ পাইপলাইন    | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ডাইনামিক কন্টেন্টৰ বাবে ৰানটাইম অনুবাদ           | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrapper অবিহনে বিল্ড-টাইম React স্থানীয়কৰণ | `withLingo()` প্লাগইন              |

---

### Lingo.dev MCP

Model Context Protocol চাৰ্ভাৰ যি AI কোডিং সহায়কসকলক প্ৰাকৃতিক ভাষাৰ প্ৰম্পটৰ জৰিয়তে React এপ্লিকেশ্যনত i18n আন্তঃগাঁথনি ছেটআপ কৰিবলৈ সক্ষম কৰে।

**সমৰ্থিত IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**সমৰ্থিত ফ্ৰেমৱৰ্কসমূহ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ব্যৱহাৰ:**

আপোনাৰ IDE ত MCP চাৰ্ভাৰ কনফিগাৰ কৰাৰ পিছত ([quickstart guides চাওক](https://lingo.dev/en/mcp)), আপোনাৰ সহায়কক প্ৰমপ্ট কৰক:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

সহায়কে কৰিব:

1. লোকেল-ভিত্তিক ৰাউটিং কনফিগাৰ কৰক (যেনে, `/en`, `/es`, `/pt-BR`)
2. ভাষা সলনি কৰা কম্পোনেণ্ট ছেটআপ কৰক
3. স্বয়ংক্ৰিয় লোকেল ডিটেকশ্বন ইমপ্লিমেণ্ট কৰক
4. প্ৰয়োজনীয় কনফিগাৰেশ্বন ফাইল জেনেৰেট কৰক

**টোকা:** AI-সহায়িত ক'ড জেনেৰেশ্বন নন-ডিটাৰমিনিষ্টিক। কমিট কৰাৰ আগতে জেনেৰেট কৰা ক'ড ৰিভিউ কৰক।

[ডকুমেণ্টেশ্বন পঢ়ক →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI ৰ সৈতে এপ্লিকেশ্বন আৰু কণ্টেণ্ট অনুবাদ কৰাৰ বাবে অ'পেন-ছ'ৰ্চ CLI। JSON, YAML, CSV, PO ফাইল, আৰু markdown সহ সকলো ইণ্ডাষ্ট্ৰি-ষ্টেণ্ডাৰ্ড ফৰ্মেট সমৰ্থন কৰে।

**ছেটআপ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ই কেনেকৈ কাম কৰে:**

1. কনফিগাৰ কৰা ফাইলৰ পৰা অনুবাদযোগ্য কণ্টেণ্ট এক্সট্ৰেক্ট কৰে
2. অনুবাদৰ বাবে LLM প্ৰ'ভাইডাৰলৈ কণ্টেণ্ট পঠিয়ায়
3. অনুবাদিত কণ্টেণ্ট ফাইলছিষ্টেমলৈ ৰাইট কৰে
4. সম্পূৰ্ণ হোৱা অনুবাদ ট্ৰেক কৰিবলৈ `i18n.lock` ফাইল সৃষ্টি কৰে (অপ্ৰয়োজনীয় প্ৰচেছিং এৰাই চলে)

**কনফিগাৰেশ্বন:**

`init` কমাণ্ডে এটা `i18n.json` ফাইল জেনেৰেট কৰে। লোকেল আৰু বাকেট কনফিগাৰ কৰক:

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

`provider` ফিল্ড ঐচ্ছিক (ডিফল্ট Lingo.dev Engine)। কাষ্টম LLM প্ৰ'ভাইডাৰৰ বাবে:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**সমৰ্থিত LLM প্ৰ'ভাইডাৰ:**

- Lingo.dev Engine (পৰামৰ্শিত)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ডকুমেণ্টেশ্বন পঢ়ক →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD পাইপলাইনৰ বাবে স্বয়ংক্ৰিয় অনুবাদ ৱৰ্কফ্ল'। অসম্পূৰ্ণ অনুবাদ প্ৰ'ডাকশ্বনত উপনীত হোৱাত বাধা দিয়ে।

**সমৰ্থিত প্লেটফৰ্মসমূহ:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions ছেটআপ:**

`.github/workflows/translate.yml` সৃষ্টি কৰক:

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

**ছেটআপৰ প্ৰয়োজনীয়তাসমূহ:**

1. ৰিপ'জিটৰী ছিক্ৰেটছত `LINGODOTDEV_API_KEY` যোগ কৰক (Settings > Secrets and variables > Actions)
2. PR ৱৰ্কফ্ল'ৰ বাবে: Settings > Actions > General ত "Allow GitHub Actions to create and approve pull requests" সক্ষম কৰক

**ৱৰ্কফ্ল' বিকল্পসমূহ:**

অনুবাদসমূহ পোনপটীয়াকৈ কমিট কৰক:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

অনুবাদসমূহৰ সৈতে pull request সৃষ্টি কৰক:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**উপলব্ধ ইনপুটসমূহ:**

| ইনপুট                | ডিফল্ট                                         | বিৱৰণ                                        |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| `api-key`            | (প্ৰয়োজনীয়)                                  | Lingo.dev API কী                             |
| `pull-request`       | `false`                                        | পোনপটীয়াকৈ কমিট কৰাৰ পৰিৱৰ্তে PR সৃষ্টি কৰক |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | কাষ্টম কমিট বাৰ্তা                           |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | কাষ্টম PR শিৰোনাম                            |
| `working-directory`  | `"."`                                          | চলাবলগীয়া ডাইৰেক্টৰী                        |
| `parallel`           | `false`                                        | সমান্তৰাল প্ৰচেছিং সক্ষম কৰক                 |

[ডকুমেণ্টেশ্যন পঢ়ক →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ডাইনামিক কন্টেণ্টৰ বাবে ৰানটাইম অনুবাদ লাইব্ৰেৰী। JavaScript, PHP, Python, আৰু Ruby ৰ বাবে উপলব্ধ।

**ইনষ্টলেশ্যন:**

```bash
npm install lingo.dev
```

**ব্যৱহাৰ:**

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

**উপলব্ধ SDKসমূহ:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - ৱেব এপ্লিকেশ্যন, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ডকুমেণ্টেশ্যন পঢ়ক →](https://lingo.dev/en/sdk)

---

### Lingo.dev কম্পাইলাৰ

বিল্ড-টাইম অনুবাদ ব্যৱস্থা যিয়ে কম্পোনেণ্টসমূহ পৰিৱৰ্তন নকৰাকৈয়ে React এপসমূহক বহুভাষিক কৰি তোলে। ৰানটাইমৰ পৰিৱৰ্তে বিল্ডৰ সময়ত কাম কৰে।

**ইনষ্টলেশ্যন:**

```bash
pnpm install @lingo.dev/compiler
```

**প্ৰমাণীকৰণ:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**কনফিগাৰেশ্যন (Next.js):**

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

**কনফিগাৰেশ্যন (Vite):**

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

**প্ৰভাইডাৰ ছেটআপ:**

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

**ভাষা সলনিকাৰী:**

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

**ডেভেলপমেণ্ট:** `npm run dev` (ছ্যুড'ট্ৰেন্সলেটৰ ব্যৱহাৰ কৰে, কোনো API কল নাই)

**প্ৰডাকশ্যন:** `usePseudotranslator: false` ছেট কৰক, তাৰ পিছত `next build`

`.lingo/` ডাইৰেক্টৰীটো ভাৰ্ছন কণ্ট্ৰ'লত কমিট কৰক।

**মুখ্য বৈশিষ্ট্যসমূহ:**

- শূন্য ৰানটাইম পাৰফৰমেন্স খৰচ
- কোনো অনুবাদ কী বা JSON ফাইল নাই
- কোনো `t()` ফাংশ্যন বা `<T>` ৰেপাৰ কম্পোনেণ্ট নাই
- JSX-ত অনুবাদযোগ্য টেক্সটৰ স্বয়ংক্ৰিয় চিনাক্তকৰণ
- TypeScript সমৰ্থন
- বহুবচনৰ বাবে ICU MessageFormat
- `data-lingo-override` এট্ৰিবিউটৰ জৰিয়তে মেনুৱেল অভাৰৰাইড
- বিল্ট-ইন অনুবাদ সম্পাদক ৱিজেট

**বিল্ড ম'ডসমূহ:**

- `pseudotranslator`: প্লেচহ'ল্ডাৰ অনুবাদৰ সৈতে ডেভেলপমেণ্ট ম'ড (কোনো API খৰচ নাই)
- `real`: LLM ব্যৱহাৰ কৰি প্ৰকৃত অনুবাদ জেনেৰেট কৰক
- `cache-only`: CI-ৰ পৰা পূৰ্ব-জেনেৰেট কৰা অনুবাদ ব্যৱহাৰ কৰি প্ৰডাকশ্যন ম'ড (কোনো API কল নাই)

**সমৰ্থিত ফ্ৰেমৱৰ্কসমূহ:**

- Next.js (React Server Components-ৰ সৈতে App Router)
- Vite + React (SPA আৰু SSR)

অতিৰিক্ত ফ্ৰেমৱৰ্ক সমৰ্থন পৰিকল্পিত।

[ডকুমেণ্টসমূহ পঢ়ক →](https://lingo.dev/en/compiler)

---

## অৱদান

অৱদান স্বাগতম। অনুগ্রহ কৰি এই নিৰ্দেশনাসমূহ অনুসৰণ কৰক:

1. **সমস্যাসমূহ:** [বাগ ৰিপ'ৰ্ট কৰক বা বৈশিষ্ট্যৰ অনুৰোধ কৰক](https://github.com/lingodotdev/lingo.dev/issues)
2. **পুল ৰিকুৱেষ্টসমূহ:** [পৰিৱৰ্তনসমূহ জমা দিয়ক](https://github.com/lingodotdev/lingo.dev/pulls)
   - প্ৰতিটো PR ৰ বাবে এটা changeset প্ৰয়োজন: `pnpm new` (বা `pnpm new:empty` non-release পৰিৱৰ্তনৰ বাবে)
   - জমা দিয়াৰ আগতে পৰীক্ষাসমূহ পাছ হোৱাটো নিশ্চিত কৰক
3. **ডেভেলপমেণ্ট:** এইটো এটা pnpm + turborepo monorepo
   - নিৰ্ভৰশীলতাসমূহ ইনষ্টল কৰক: `pnpm install`
   - পৰীক্ষাসমূহ চলাওক: `pnpm test`
   - বিল্ড কৰক: `pnpm build`

**সমৰ্থন:** [Discord সম্প্ৰদায়](https://lingo.dev/go/discord)

## ষ্টাৰ ইতিহাস

যদি আপুনি Lingo.dev উপযোগী বুলি বিবেচনা কৰে, আমাক এটা ষ্টাৰ দিয়ক আৰু আমাক 10,000 ষ্টাৰ লাভ কৰাত সহায় কৰক!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## স্থানীয়কৃত ডকুমেণ্টেশ্যন

**উপলব্ধ অনুবাদসমূহ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**নতুন ভাষা যোগ কৰা:**

1. [`i18n.json`](./i18n.json) ত [BCP-47 ফৰ্মেট](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ব্যৱহাৰ কৰি locale code যোগ কৰক
2. এটা pull request জমা দিয়ক

**BCP-47 locale ফৰ্মেট:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- উদাহৰণসমূহ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
