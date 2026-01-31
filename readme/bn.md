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
    Lingo.dev - LLM-চালিত স্থানীয়করণের জন্য ওপেন-সোর্স i18n টুলকিট
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

## দ্রুত শুরু

| টুল                                | ব্যবহারের ক্ষেত্র                                 | দ্রুত কমান্ড                       |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React অ্যাপের জন্য AI-সহায়তাপ্রাপ্ত i18n সেটআপ   | প্রম্পট: `Set up i18n`             |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ফাইল অনুবাদ করুন    | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions-এ স্বয়ংক্রিয় অনুবাদ পাইপলাইন     | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ডায়নামিক কন্টেন্টের জন্য রানটাইম অনুবাদ          | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n র‍্যাপার ছাড়াই বিল্ড-টাইম React স্থানীয়করণ | `withLingo()` প্লাগইন              |

---

### Lingo.dev MCP

Model Context Protocol সার্ভার যা AI কোডিং অ্যাসিস্ট্যান্টদের প্রাকৃতিক ভাষার প্রম্পটের মাধ্যমে React অ্যাপ্লিকেশনে i18n অবকাঠামো সেটআপ করতে সক্ষম করে।

**সমর্থিত IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**সমর্থিত ফ্রেমওয়ার্ক:**

- Next.js (App Router ও Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ব্যবহার:**

আপনার IDE-তে MCP সার্ভার কনফিগার করার পর ([দ্রুত শুরুর গাইড দেখুন](https://lingo.dev/en/mcp)), আপনার সহায়ককে প্রম্প্ট করুন:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

সহায়ক করবে:

1. লোকেল-ভিত্তিক রাউটিং কনফিগার করুন (যেমন, `/en`, `/es`, `/pt-BR`)
2. ভাষা পরিবর্তন কম্পোনেন্ট সেটআপ করুন
3. স্বয়ংক্রিয় লোকেল সনাক্তকরণ প্রয়োগ করুন
4. প্রয়োজনীয় কনফিগারেশন ফাইল তৈরি করুন

**দ্রষ্টব্য:** AI-সহায়তা কোড জেনারেশন নন-ডিটারমিনিস্টিক। কমিট করার আগে জেনারেট করা কোড পর্যালোচনা করুন।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI দিয়ে অ্যাপ এবং কন্টেন্ট অনুবাদ করার জন্য ওপেন-সোর্স CLI। JSON, YAML, CSV, PO ফাইল এবং markdown সহ সমস্ত ইন্ডাস্ট্রি-স্ট্যান্ডার্ড ফরম্যাট সাপোর্ট করে।

**সেটআপ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**এটি কীভাবে কাজ করে:**

1. কনফিগার করা ফাইল থেকে অনুবাদযোগ্য কন্টেন্ট এক্সট্র্যাক্ট করে
2. অনুবাদের জন্য LLM প্রোভাইডারে কন্টেন্ট পাঠায়
3. অনুবাদিত কন্টেন্ট ফাইলসিস্টেমে লিখে দেয়
4. সম্পন্ন অনুবাদ ট্র্যাক করতে `i18n.lock` ফাইল তৈরি করে (অপ্রয়োজনীয় প্রসেসিং এড়ায়)

**কনফিগারেশন:**

`init` কমান্ড একটি `i18n.json` ফাইল জেনারেট করে। লোকেল এবং বাকেট কনফিগার করুন:

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

`provider` ফিল্ডটি ঐচ্ছিক (ডিফল্ট Lingo.dev Engine)। কাস্টম LLM প্রোভাইডারের জন্য:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**সাপোর্টেড LLM প্রোভাইডার:**

- Lingo.dev Engine (প্রস্তাবিত)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD পাইপলাইনের জন্য স্বয়ংক্রিয় অনুবাদ ওয়ার্কফ্লো। অসম্পূর্ণ অনুবাদ প্রোডাকশনে পৌঁছানো প্রতিরোধ করে।

**সমর্থিত প্ল্যাটফর্ম:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions সেটআপ:**

`.github/workflows/translate.yml` তৈরি করুন:

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

**সেটআপ প্রয়োজনীয়তা:**

1. রিপোজিটরি সিক্রেটে `LINGODOTDEV_API_KEY` যোগ করুন (Settings > Secrets and variables > Actions)
2. PR ওয়ার্কফ্লোর জন্য: Settings > Actions > General-এ "Allow GitHub Actions to create and approve pull requests" সক্রিয় করুন

**ওয়ার্কফ্লো অপশন:**

সরাসরি অনুবাদ কমিট করুন:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

অনুবাদসহ pull request তৈরি করুন:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**উপলব্ধ ইনপুট:**

| ইনপুট                | ডিফল্ট                                         | বর্ণনা                                 |
| -------------------- | ---------------------------------------------- | -------------------------------------- |
| `api-key`            | (প্রয়োজনীয়)                                  | Lingo.dev API কী                       |
| `pull-request`       | `false`                                        | সরাসরি কমিট করার পরিবর্তে PR তৈরি করুন |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | কাস্টম কমিট মেসেজ                      |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | কাস্টম PR শিরোনাম                      |
| `working-directory`  | `"."`                                          | যে ডিরেক্টরিতে চালাতে হবে              |
| `parallel`           | `false`                                        | প্যারালাল প্রসেসিং সক্রিয় করুন        |

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ডায়নামিক কন্টেন্টের জন্য রানটাইম অনুবাদ লাইব্রেরি। JavaScript, PHP, Python এবং Ruby-এর জন্য উপলব্ধ।

**ইনস্টলেশন:**

```bash
npm install lingo.dev
```

**ব্যবহার:**

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

**উপলব্ধ SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - ওয়েব অ্যাপ, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/sdk)

---

### Lingo.dev কম্পাইলার

বিল্ড-টাইম অনুবাদ সিস্টেম যা কম্পোনেন্ট পরিবর্তন না করেই React অ্যাপকে বহুভাষিক করে তোলে। রানটাইমের পরিবর্তে বিল্ডের সময় কাজ করে।

**ইনস্টলেশন:**

```bash
pnpm install @lingo.dev/compiler
```

**অথেন্টিকেশন:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**কনফিগারেশন (Next.js):**

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

**কনফিগারেশন (Vite):**

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

**প্রোভাইডার সেটআপ:**

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

**ভাষা সুইচার:**

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

**ডেভেলপমেন্ট:** `npm run dev` (সিউডোট্রান্সলেটর ব্যবহার করে, কোনো API কল নেই)

**প্রোডাকশন:** `usePseudotranslator: false` সেট করুন, তারপর `next build`

ভার্সন কন্ট্রোলে `.lingo/` ডিরেক্টরি কমিট করুন।

**মূল বৈশিষ্ট্যসমূহ:**

- শূন্য রানটাইম পারফরম্যান্স খরচ
- কোনো অনুবাদ কী বা JSON ফাইল নেই
- কোনো `t()` ফাংশন বা `<T>` র‍্যাপার কম্পোনেন্ট নেই
- JSX-এ অনুবাদযোগ্য টেক্সটের স্বয়ংক্রিয় সনাক্তকরণ
- TypeScript সাপোর্ট
- বহুবচনের জন্য ICU MessageFormat
- `data-lingo-override` অ্যাট্রিবিউটের মাধ্যমে ম্যানুয়াল ওভাররাইড
- বিল্ট-ইন অনুবাদ এডিটর উইজেট

**বিল্ড মোডসমূহ:**

- `pseudotranslator`: প্লেসহোল্ডার অনুবাদ সহ ডেভেলপমেন্ট মোড (কোনো API খরচ নেই)
- `real`: LLM ব্যবহার করে প্রকৃত অনুবাদ তৈরি করুন
- `cache-only`: CI থেকে পূর্ব-তৈরি অনুবাদ ব্যবহার করে প্রোডাকশন মোড (কোনো API কল নেই)

**সমর্থিত ফ্রেমওয়ার্কসমূহ:**

- Next.js (React Server Components সহ App Router)
- Vite + React (SPA এবং SSR)

অতিরিক্ত ফ্রেমওয়ার্ক সাপোর্ট পরিকল্পিত।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/compiler)

---

## অবদান

অবদান স্বাগত। অনুগ্রহ করে এই নির্দেশিকাগুলি অনুসরণ করুন:

1. **ইস্যু:** [বাগ রিপোর্ট করুন বা ফিচার অনুরোধ করুন](https://github.com/lingodotdev/lingo.dev/issues)
2. **পুল রিকোয়েস্ট:** [পরিবর্তন জমা দিন](https://github.com/lingodotdev/lingo.dev/pulls)
   - প্রতিটি PR-এর জন্য একটি changeset প্রয়োজন: `pnpm new` (অথবা নন-রিলিজ পরিবর্তনের জন্য `pnpm new:empty`)
   - জমা দেওয়ার আগে টেস্ট পাস হয়েছে তা নিশ্চিত করুন
3. **ডেভেলপমেন্ট:** এটি একটি pnpm + turborepo monorepo
   - ডিপেন্ডেন্সি ইনস্টল করুন: `pnpm install`
   - টেস্ট চালান: `pnpm test`
   - বিল্ড করুন: `pnpm build`

**সাপোর্ট:** [Discord কমিউনিটি](https://lingo.dev/go/discord)

## স্টার হিস্ট্রি

আপনি যদি Lingo.dev উপযোগী মনে করেন, আমাদের একটি স্টার দিন এবং ১০,০০০ স্টারে পৌঁছাতে সাহায্য করুন!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## স্থানীয়করণ করা ডকুমেন্টেশন

**উপলব্ধ অনুবাদ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**নতুন ভাষা যোগ করা:**

1. [`i18n.json`](./i18n.json)-এ [BCP-47 ফরম্যাট](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ব্যবহার করে লোকেল কোড যোগ করুন
2. একটি পুল রিকোয়েস্ট জমা দিন

**BCP-47 লোকেল ফরম্যাট:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (ছোট হাতের অক্ষর): `en`, `zh`, `bho`
- `Script`: ISO 15924 (টাইটেল কেস): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (বড় হাতের অক্ষর): `US`, `CN`, `IN`
- উদাহরণ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
