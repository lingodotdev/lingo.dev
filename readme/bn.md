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

React অ্যাপে i18n সেটআপ করা কুখ্যাতভাবে ত্রুটিপ্রবণ - এমনকি অভিজ্ঞ ডেভেলপারদের জন্যও। AI কোডিং সহায়করা এটিকে আরও খারাপ করে: তারা অস্তিত্বহীন API হ্যালুসিনেট করে, মিডলওয়্যার কনফিগারেশন ভুলে যায়, রাউটিং ভেঙে দেয়, বা হারিয়ে যাওয়ার আগে অর্ধেক সমাধান বাস্তবায়ন করে। সমস্যা হল যে i18n সেটআপের জন্য একাধিক ফাইল জুড়ে (রাউটিং, মিডলওয়্যার, কম্পোনেন্ট, কনফিগারেশন) সমন্বিত পরিবর্তনের একটি সুনির্দিষ্ট ক্রম প্রয়োজন, এবং LLM-রা সেই প্রসঙ্গ বজায় রাখতে সংগ্রাম করে।

Lingo.dev MCP এটি সমাধান করে AI সহায়কদের ফ্রেমওয়ার্ক-নির্দিষ্ট i18n জ্ঞানে কাঠামোগত অ্যাক্সেস দিয়ে। অনুমান করার পরিবর্তে, আপনার সহায়ক Next.js, React Router এবং TanStack Start-এর জন্য যাচাইকৃত বাস্তবায়ন প্যাটার্ন অনুসরণ করে।

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

আপনার IDE-তে MCP সার্ভার কনফিগার করার পরে ([কুইকস্টার্ট গাইড দেখুন](https://lingo.dev/en/mcp)), আপনার সহায়ককে প্রম্পট করুন:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

সহায়ক করবে:

1. লোকেল-ভিত্তিক রাউটিং কনফিগার করবে (যেমন, `/en`, `/es`, `/pt-BR`)
2. ভাষা পরিবর্তন কম্পোনেন্ট সেটআপ করবে
3. স্বয়ংক্রিয় লোকেল সনাক্তকরণ বাস্তবায়ন করবে
4. প্রয়োজনীয় কনফিগারেশন ফাইল তৈরি করবে

**দ্রষ্টব্য:** AI-সহায়তা কোড জেনারেশন নন-ডিটারমিনিস্টিক। কমিট করার আগে জেনারেট করা কোড পর্যালোচনা করুন।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

অনুবাদ সিঙ্কে রাখা ক্লান্তিকর। আপনি একটি নতুন স্ট্রিং যোগ করেন, এটি অনুবাদ করতে ভুলে যান, আন্তর্জাতিক ব্যবহারকারীদের কাছে ভাঙা UI পাঠান। অথবা আপনি অনুবাদকদের কাছে JSON ফাইল পাঠান, দিনের পর দিন অপেক্ষা করেন, তারপর ম্যানুয়ালি তাদের কাজ মার্জ করেন। 10+ ভাষায় স্কেল করার অর্থ শত শত ফাইল পরিচালনা করা যা ক্রমাগত সিঙ্কের বাইরে চলে যায়।

Lingo.dev CLI এটি স্বয়ংক্রিয় করে। আপনার অনুবাদ ফাইলগুলিতে এটি নির্দেশ করুন, একটি কমান্ড চালান এবং প্রতিটি লোকেল আপডেট হয়। একটি লকফাইল ট্র্যাক করে কী ইতিমধ্যে অনুবাদ করা হয়েছে, তাই আপনি শুধুমাত্র নতুন বা পরিবর্তিত কন্টেন্টের জন্য অর্থ প্রদান করেন। JSON, YAML, CSV, PO ফাইল এবং markdown সমর্থন করে।

**সেটআপ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**এটি কীভাবে কাজ করে:**

১. কনফিগার করা ফাইল থেকে অনুবাদযোগ্য কন্টেন্ট এক্সট্র্যাক্ট করে
২. অনুবাদের জন্য LLM প্রোভাইডারে কন্টেন্ট পাঠায়
৩. অনুবাদিত কন্টেন্ট ফাইলসিস্টেমে লিখে রাখে
৪. সম্পন্ন অনুবাদ ট্র্যাক করার জন্য `i18n.lock` ফাইল তৈরি করে (অপ্রয়োজনীয় প্রসেসিং এড়ায়)

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

অনুবাদ হলো এমন একটি ফিচার যা সবসময় "প্রায় সম্পন্ন" থাকে। ইঞ্জিনিয়াররা লোকেল আপডেট না করেই কোড মার্জ করেন। QA স্টেজিংয়ে অনুপস্থিত অনুবাদ ধরে ফেলে - অথবা আরও খারাপ, ব্যবহারকারীরা প্রোডাকশনে সেগুলো ধরে ফেলেন। মূল কারণ: অনুবাদ একটি ম্যানুয়াল ধাপ যা ডেডলাইনের চাপে এড়িয়ে যাওয়া সহজ।

Lingo.dev CI/CD অনুবাদকে স্বয়ংক্রিয় করে তোলে। প্রতিটি পুশ অনুবাদ ট্রিগার করে। অনুপস্থিত স্ট্রিং প্রোডাকশনে পৌঁছানোর আগেই পূরণ হয়ে যায়। কোনো শৃঙ্খলার প্রয়োজন নেই - পাইপলাইন এটি পরিচালনা করে।

**সাপোর্টেড প্ল্যাটফর্ম:**

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

১. রিপোজিটরি সিক্রেটে `LINGODOTDEV_API_KEY` যোগ করুন (Settings > Secrets and variables > Actions)
২. PR ওয়ার্কফ্লোর জন্য: Settings > Actions > General-এ "Allow GitHub Actions to create and approve pull requests" সক্ষম করুন

**ওয়ার্কফ্লো অপশন:**

সরাসরি অনুবাদ কমিট করুন:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

অনুবাদ সহ pull request তৈরি করুন:

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

স্ট্যাটিক অনুবাদ ফাইল UI লেবেলের জন্য কাজ করে, কিন্তু ইউজার-জেনারেটেড কন্টেন্টের ক্ষেত্রে কী হবে? চ্যাট মেসেজ, প্রোডাক্ট বর্ণনা, সাপোর্ট টিকিট - যে কন্টেন্ট বিল্ড টাইমে বিদ্যমান নেই তা প্রি-ট্রান্সলেট করা যায় না। আপনি অনুবাদহীন টেক্সট দেখাতে বাধ্য হন অথবা একটি কাস্টম অনুবাদ পাইপলাইন তৈরি করতে হয়।

Lingo.dev SDK রানটাইমে কন্টেন্ট অনুবাদ করে। যেকোনো টেক্সট, অবজেক্ট, বা HTML পাস করুন এবং একটি লোকালাইজড ভার্সন ফেরত পান। রিয়েল-টাইম চ্যাট, ডায়নামিক নোটিফিকেশন, বা ডিপ্লয়মেন্টের পরে আসা যেকোনো কন্টেন্টের জন্য কাজ করে। JavaScript, PHP, Python, এবং Ruby-এর জন্য উপলব্ধ।

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

### Lingo.dev Compiler

ট্র্যাডিশনাল i18n ইনভেসিভ। আপনি প্রতিটি স্ট্রিং `t()` ফাংশনে র‍্যাপ করেন, অনুবাদ কী আবিষ্কার করেন (`home.hero.title.v2`), প্যারালাল JSON ফাইল মেইনটেইন করেন, এবং আপনার কম্পোনেন্টগুলো লোকালাইজেশন বয়লারপ্লেটে ফুলে যেতে দেখেন। এটি এতটাই ক্লান্তিকর যে টিমগুলো আন্তর্জাতিকীকরণ বিলম্বিত করে যতক্ষণ না এটি একটি বিশাল রিফ্যাক্টরে পরিণত হয়।

Lingo.dev Compiler আনুষ্ঠানিকতা দূর করে। সাধারণ ইংরেজি টেক্সট দিয়ে React কম্পোনেন্ট লিখুন। কম্পাইলার বিল্ড টাইমে অনুবাদযোগ্য স্ট্রিং সনাক্ত করে এবং স্বয়ংক্রিয়ভাবে স্থানীয়করণ করা ভেরিয়েন্ট তৈরি করে। কোনো কী নেই, কোনো JSON ফাইল নেই, কোনো র‍্যাপার ফাংশন নেই - শুধু React কোড যা একাধিক ভাষায় কাজ করে।

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

`.lingo/` ডিরেক্টরি ভার্সন কন্ট্রোলে কমিট করুন।

**মূল বৈশিষ্ট্য:**

- শূন্য রানটাইম পারফরম্যান্স খরচ
- কোনো অনুবাদ কী বা JSON ফাইল নেই
- কোনো `t()` ফাংশন বা `<T>` র‍্যাপার কম্পোনেন্ট নেই
- JSX-এ অনুবাদযোগ্য টেক্সটের স্বয়ংক্রিয় সনাক্তকরণ
- TypeScript সাপোর্ট
- বহুবচনের জন্য ICU MessageFormat
- `data-lingo-override` অ্যাট্রিবিউটের মাধ্যমে ম্যানুয়াল ওভাররাইড
- বিল্ট-ইন অনুবাদ এডিটর উইজেট

**বিল্ড মোড:**

- `pseudotranslator`: প্লেসহোল্ডার অনুবাদ সহ ডেভেলপমেন্ট মোড (কোনো API খরচ নেই)
- `real`: LLM ব্যবহার করে প্রকৃত অনুবাদ তৈরি করুন
- `cache-only`: CI থেকে পূর্ব-তৈরি অনুবাদ ব্যবহার করে প্রোডাকশন মোড (কোনো API কল নেই)

**সমর্থিত ফ্রেমওয়ার্ক:**

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
   - জমা দেওয়ার আগে নিশ্চিত করুন যে টেস্ট পাস হয়েছে
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
