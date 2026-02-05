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

React এপসমূহত i18n ছেটআপ কৰাটো কুখ্যাতভাৱে ত্ৰুটিপ্ৰৱণ - অভিজ্ঞ ডেভেলপাৰসকলৰ বাবেও। AI কোডিং সহায়কসমূহে ইয়াক আৰু বেয়া কৰি তোলে: তেওঁলোকে অস্তিত্বহীন APIসমূহ হেলুচিনেট কৰে, মিডলৱেৰ কনফিগাৰেশ্যন পাহৰি যায়, ৰাউটিং ভাঙি পেলায়, বা হেৰাই যোৱাৰ আগতে আধা সমাধান ইমপ্লিমেণ্ট কৰে। সমস্যাটো হ'ল যে i18n ছেটআপৰ বাবে একাধিক ফাইলৰ (ৰাউটিং, মিডলৱেৰ, কম্পোনেণ্ট, কনফিগাৰেশ্যন) মাজত সমন্বিত পৰিৱৰ্তনৰ এটা সুনিৰ্দিষ্ট ক্ৰমৰ প্ৰয়োজন, আৰু LLMসমূহে সেই প্ৰসংগ বজাই ৰাখিবলৈ সংগ্ৰাম কৰে।

Lingo.dev MCP এ AI সহায়কসমূহক ফ্ৰেমৱৰ্ক-নিৰ্দিষ্ট i18n জ্ঞানৰ গাঁথনিবদ্ধ প্ৰৱেশ প্ৰদান কৰি এইটো সমাধান কৰে। অনুমান কৰাৰ পৰিৱৰ্তে, আপোনাৰ সহায়কে Next.js, React Router, আৰু TanStack Start ৰ বাবে প্ৰমাণিত ইমপ্লিমেণ্টেশ্যন পেটাৰ্ন অনুসৰণ কৰে।

**সমৰ্থিত IDEসমূহ:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**সমৰ্থিত ফ্ৰেমৱৰ্কসমূহ:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ব্যৱহাৰ:**

আপোনাৰ IDEত MCP চাৰ্ভাৰ কনফিগাৰ কৰাৰ পিছত ([কুইকষ্টাৰ্ট গাইড চাওক](https://lingo.dev/en/mcp)), আপোনাৰ সহায়কক প্ৰম্পট কৰক:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

সহায়কে:

1. লোকেল-ভিত্তিক ৰাউটিং কনফিগাৰ কৰিব (যেনে, `/en`, `/es`, `/pt-BR`)
2. ভাষা সলনিকাৰী কম্পোনেণ্ট ছেটআপ কৰিব
3. স্বয়ংক্ৰিয় লোকেল চিনাক্তকৰণ ইমপ্লিমেণ্ট কৰিব
4. প্ৰয়োজনীয় কনফিগাৰেশ্যন ফাইল জেনাৰেট কৰিব

**টোকা:** AI-সহায়িত কোড জেনাৰেশ্যন নন-ডিটাৰমিনিষ্টিক। কমিট কৰাৰ আগতে জেনাৰেট কৰা কোড পৰ্যালোচনা কৰক।

[ডকুমেণ্টেশ্যন পঢ়ক →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

অনুবাদসমূহ সিংকত ৰখাটো ক্লান্তিকৰ। আপুনি এটা নতুন ষ্ট্ৰিং যোগ কৰে, ইয়াক অনুবাদ কৰিবলৈ পাহৰি যায়, আন্তৰ্জাতিক ব্যৱহাৰকাৰীসকলক ভঙা UI শ্বিপ কৰে। বা আপুনি অনুবাদকসকলক JSON ফাইল পঠিয়ায়, দিনৰ পিছত দিন অপেক্ষা কৰে, তাৰ পিছত তেওঁলোকৰ কাম মেনুৱেলি মাৰ্জ কৰে। 10+ ভাষালৈ স্কেল কৰাৰ অৰ্থ হ'ল শ শ ফাইল পৰিচালনা কৰা যিবোৰ নিৰন্তৰ সিংকৰ বাহিৰত ড্ৰিফ্ট হয়।

Lingo.dev CLI এ এইটো স্বয়ংক্ৰিয় কৰে। আপোনাৰ অনুবাদ ফাইলসমূহত ইয়াক পইণ্ট কৰক, এটা কমাণ্ড চলাওক, আৰু প্ৰতিটো লোকেল আপডেট হয়। এটা লকফাইলে ইতিমধ্যে কি অনুবাদ কৰা হৈছে ট্ৰেক কৰে, গতিকে আপুনি কেৱল নতুন বা সলনি হোৱা কণ্টেণ্টৰ বাবে পেমেণ্ট কৰে। JSON, YAML, CSV, PO ফাইল, আৰু markdown সমৰ্থন কৰে।

**ছেটআপ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ই কেনেকৈ কাম কৰে:**

1. কনফিগাৰ কৰা ফাইলসমূহৰ পৰা অনুবাদযোগ্য কন্টেণ্ট এক্সট্ৰেক্ট কৰে
2. অনুবাদৰ বাবে LLM প্ৰভাইডাৰলৈ কন্টেণ্ট প্ৰেৰণ কৰে
3. অনুবাদিত কন্টেণ্ট ফাইলছিষ্টেমলৈ পুনৰ লিখে
4. সম্পূৰ্ণ হোৱা অনুবাদসমূহ ট্ৰেক কৰিবলৈ `i18n.lock` ফাইল সৃষ্টি কৰে (অপ্ৰয়োজনীয় প্ৰচেছিং এৰাই চলে)

**কনফিগাৰেশ্যন:**

`init` কমাণ্ডে এটা `i18n.json` ফাইল জেনেৰেট কৰে। লোকেল আৰু বাকেটসমূহ কনফিগাৰ কৰক:

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

`provider` ফিল্ডটো ঐচ্ছিক (ডিফল্ট Lingo.dev Engine)। কাষ্টম LLM প্ৰভাইডাৰৰ বাবে:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**সমৰ্থিত LLM প্ৰভাইডাৰসমূহ:**

- Lingo.dev Engine (পৰামৰ্শিত)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ডকুমেণ্টেশ্যন পঢ়ক →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

অনুবাদ হৈছে সেই ফিচাৰ যি সদায় "প্ৰায় সম্পূৰ্ণ" হৈ থাকে। ইঞ্জিনিয়াৰসকলে লোকেল আপডেট নকৰাকৈয়ে ক'ড মাৰ্জ কৰে। QA য়ে ষ্টেজিংত হেৰোৱা অনুবাদসমূহ ধৰা পেলায় - বা আৰু বেয়া, ব্যৱহাৰকাৰীয়ে প্ৰডাকশ্যনত ধৰা পেলায়। মূল কাৰণ: অনুবাদ এটা মেনুৱেল পদক্ষেপ যি ডেডলাইনৰ চাপত এৰি দিয়া সহজ।

Lingo.dev CI/CD য়ে অনুবাদ স্বয়ংক্ৰিয় কৰে। প্ৰতিটো পুশে অনুবাদ ট্ৰিগাৰ কৰে। হেৰোৱা ষ্ট্ৰিংসমূহ ক'ড প্ৰডাকশ্যনত উপনীত হোৱাৰ আগতেই পূৰণ হয়। কোনো শৃংখলাৰ প্ৰয়োজন নাই - পাইপলাইনে ইয়াক সম্ভালে।

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

**ছেটআপ প্ৰয়োজনীয়তাসমূহ:**

1. ৰিপজিটৰী ছিক্ৰেটছত `LINGODOTDEV_API_KEY` যোগ কৰক (Settings > Secrets and variables > Actions)
2. PR ৱৰ্কফ্ল'ৰ বাবে: Settings > Actions > General ত "Allow GitHub Actions to create and approve pull requests" সক্ষম কৰক

**ৱৰ্কফ্ল' বিকল্পসমূহ:**

অনুবাদসমূহ পোনপটীয়াকৈ কমিট কৰক:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

অনুবাদৰ সৈতে pull request সৃষ্টি কৰক:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**উপলব্ধ ইনপুটসমূহ:**

| ইনপুট                | ডিফল্ট                                         | বিৱৰণ                                          |
| -------------------- | ---------------------------------------------- | ---------------------------------------------- |
| `api-key`            | (প্ৰয়োজনীয়)                                  | Lingo.dev API কী                               |
| `pull-request`       | `false`                                        | প্ৰত্যক্ষভাৱে কমিট কৰাৰ পৰিৱৰ্তে PR সৃষ্টি কৰক |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | কাষ্টম কমিট বাৰ্তা                             |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | কাষ্টম PR শিৰোনাম                              |
| `working-directory`  | `"."`                                          | চলাবলৈ ডাইৰেক্টৰী                              |
| `parallel`           | `false`                                        | সমান্তৰাল প্ৰচেছিং সক্ষম কৰক                   |

[ডকুমেণ্ট পঢ়ক →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ষ্টেটিক অনুবাদ ফাইলে UI লেবেলৰ বাবে কাম কৰে, কিন্তু ব্যৱহাৰকাৰীয়ে সৃষ্টি কৰা কণ্টেণ্টৰ ক্ষেত্ৰত কি হ'ব? চেট বাৰ্তা, প্ৰডাক্ট বিৱৰণ, সাপ'ৰ্ট টিকেট - যিবোৰ কণ্টেণ্ট বিল্ড টাইমত নাথাকে সেইবোৰ পূৰ্বতে অনুবাদ কৰিব নোৱাৰি। আপুনি অনুবাদ নোহোৱা টেক্সট দেখুৱাবলৈ বাধ্য হয় বা কাষ্টম অনুবাদ পাইপলাইন নিৰ্মাণ কৰিব লাগে।

Lingo.dev SDK এ ৰানটাইমত কণ্টেণ্ট অনুবাদ কৰে। যিকোনো টেক্সট, অবজেক্ট, বা HTML পাছ কৰক আৰু স্থানীয়কৃত সংস্কৰণ পাওক। ৰিয়েল-টাইম চেট, ডাইনামিক নটিফিকেশ্যন, বা ডিপ্লয়মেণ্টৰ পিছত আহা যিকোনো কণ্টেণ্টৰ বাবে কাম কৰে। JavaScript, PHP, Python, আৰু Ruby ৰ বাবে উপলব্ধ।

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

**উপলব্ধ SDK সমূহ:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - ৱেব এপ্, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ডকুমেণ্ট পঢ়ক →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

পৰম্পৰাগত i18n আক্ৰমণাত্মক। আপুনি প্ৰতিটো ষ্ট্ৰিং `t()` ফাংশ্যনত ৰেপ কৰে, অনুবাদ কী উদ্ভাৱন কৰে (`home.hero.title.v2`), সমান্তৰাল JSON ফাইল মেইণ্টেইন কৰে, আৰু আপোনাৰ কম্পোনেণ্টবোৰ লোকেলাইজেশ্যন বয়লাৰপ্লেটৰ সৈতে ফুলি উঠা দেখে। ই ইমানেই ক্লান্তিকৰ যে টিমসমূহে আন্তৰ্জাতিকীকৰণ পিছুৱাই দিয়ে যেতিয়ালৈকে ই এটা বৃহৎ ৰিফেক্টৰ নহয়।

Lingo.dev Compiler এ আনুষ্ঠানিকতা আঁতৰায়। সাধাৰণ ইংৰাজী টেক্সটৰ সৈতে React কম্পোনেণ্ট লিখক। কম্পাইলাৰে বিল্ড টাইমত অনুবাদযোগ্য ষ্ট্ৰিং চিনাক্ত কৰে আৰু স্বয়ংক্ৰিয়ভাৱে স্থানীয়কৃত ভেৰিয়েণ্ট জেনেৰেট কৰে। কোনো কী নাই, কোনো JSON ফাইল নাই, কোনো ৰেপাৰ ফাংচন নাই - কেৱল React ক'ড যি একাধিক ভাষাত কাম কৰে।

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

**প্ৰ'ভাইডাৰ ছেটআপ:**

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

**ভাষা সুইচাৰ:**

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

**ডেভেলপমেণ্ট:** `npm run dev` (pseudotranslator ব্যৱহাৰ কৰে, কোনো API কল নাই)

**প্ৰডাকশ্যন:** `usePseudotranslator: false` ছেট কৰক, তাৰপিছত `next build`

`.lingo/` ডাইৰেক্টৰী ভাৰ্ছন কণ্ট্ৰ'লত কমিট কৰক।

**মুখ্য বৈশিষ্ট্যসমূহ:**

- শূন্য ৰানটাইম পাৰফৰ্মেন্স খৰচ
- কোনো অনুবাদ কী বা JSON ফাইল নাই
- কোনো `t()` ফাংচন বা `<T>` ৰেপাৰ কম্পোনেণ্ট নাই
- JSX ত অনুবাদযোগ্য টেক্সটৰ স্বয়ংক্ৰিয় চিনাক্তকৰণ
- TypeScript সমৰ্থন
- বহুবচনৰ বাবে ICU MessageFormat
- `data-lingo-override` এট্ৰিবিউটৰ জৰিয়তে মেনুৱেল অভাৰৰাইড
- বিল্ট-ইন অনুবাদ এডিটৰ ৱিজেট

**বিল্ড ম'ডসমূহ:**

- `pseudotranslator`: প্লেচহ'ল্ডাৰ অনুবাদৰ সৈতে ডেভেলপমেণ্ট ম'ড (কোনো API খৰচ নাই)
- `real`: LLM ব্যৱহাৰ কৰি প্ৰকৃত অনুবাদ জেনেৰেট কৰক
- `cache-only`: CI ৰ পৰা পূৰ্ব-জেনেৰেট কৰা অনুবাদ ব্যৱহাৰ কৰি প্ৰডাকশ্যন ম'ড (কোনো API কল নাই)

**সমৰ্থিত ফ্ৰেমৱৰ্কসমূহ:**

- Next.js (React Server Components ৰ সৈতে App Router)
- Vite + React (SPA আৰু SSR)

অতিৰিক্ত ফ্ৰেমৱৰ্ক সমৰ্থন পৰিকল্পিত।

[ডকুমেণ্টেশ্যন পঢ়ক →](https://lingo.dev/en/compiler)

---

## অৱদান

অৱদান স্বাগতম। অনুগ্ৰহ কৰি এই নিৰ্দেশনাসমূহ অনুসৰণ কৰক:

1. **সমস্যাসমূহ:** [বাগ ৰিপ'ৰ্ট কৰক বা বৈশিষ্ট্যৰ অনুৰোধ কৰক](https://github.com/lingodotdev/lingo.dev/issues)
2. **পুল ৰিকুৱেষ্টসমূহ:** [পৰিৱৰ্তনসমূহ জমা দিয়ক](https://github.com/lingodotdev/lingo.dev/pulls)
   - প্ৰতিটো PR ৰ বাবে এটা changeset প্ৰয়োজন: `pnpm new` (বা non-release পৰিৱৰ্তনৰ বাবে `pnpm new:empty`)
   - জমা দিয়াৰ আগতে পৰীক্ষাসমূহ পাছ হোৱাটো নিশ্চিত কৰক
3. **ডেভেলপমেণ্ট:** এইটো এটা pnpm + turborepo monorepo
   - নিৰ্ভৰশীলতাসমূহ ইনষ্টল কৰক: `pnpm install`
   - পৰীক্ষাসমূহ চলাওক: `pnpm test`
   - বিল্ড: `pnpm build`

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
