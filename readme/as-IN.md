<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – স্থানীয়কৰণ অভিযান্ত্ৰিক প্লেটফৰ্ম"
    />
  </a>
</p>

<p align="center">
  <strong>
    মুক্ত উৎসৰ স্থানীয়কৰণ অভিযান্ত্ৰিক সঁজুলি। সুসংগত, মানসম্পন্ন অনুবাদৰ বাবে
    Lingo.dev স্থানীয়কৰণ অভিযান্ত্ৰিক প্লেটফৰ্মৰ সৈতে সংযোগ কৰক।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React-ৰ বাবে Lingo Compiler (আৰম্ভণি আলফা)</a>
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

| সঁজুলি                                             | ই কি কৰে                                           | দ্ৰুত আদেশ                         |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React এপৰ বাবে AI-সহায়িত i18n ছেটআপ               | প্ৰম্পট: `Set up i18n`             |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ফাইল স্থানীয়কৰণ কৰক | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions-ত নিৰন্তৰ স্থানীয়কৰণ               | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n ৰেপাৰ নোহোৱাকৈ বিল্ড-টাইম React স্থানীয়কৰণ   | `withLingo()` প্লাগইন              |

### স্থানীয়কৰণ ইঞ্জিন

এই সঁজুলিসমূহে [স্থানীয়কৰণ ইঞ্জিনসমূহৰ](https://lingo.dev) সৈতে সংযোগ কৰে – Lingo.dev স্থানীয়কৰণ অভিযান্ত্ৰিক প্লেটফৰ্মত আপুনি সৃষ্টি কৰা ষ্টেটফুল অনুবাদ APIসমূহ। প্ৰতিটো ইঞ্জিনে প্ৰতিটো অনুৰোধত শব্দকোষ, ব্ৰেণ্ড ভইচ আৰু প্ৰতি-লোকেল নিৰ্দেশনা ধৰি ৰাখে, [পৰিভাষা ত্ৰুটি 16.6–44.6% হ্ৰাস কৰে](https://lingo.dev/research/retrieval-augmented-localization)। অথবা [নিজৰ LLM আনক](#lingodev-cli)।

---

### Lingo.dev MCP

React এপত i18n ছেটআপ কৰাটো ত্ৰুটিপূৰ্ণ – AI কোডিং সহায়কসকলেও অস্তিত্বহীন APIসমূহ কল্পনা কৰে আৰু ৰাউটিং ভাঙে। Lingo.dev MCP-এ AI সহায়কসকলক Next.js, React Router আৰু TanStack Start-ৰ বাবে ফ্ৰেমৱৰ্ক-নিৰ্দিষ্ট i18n জ্ঞানত গাঁথনিবদ্ধ প্ৰৱেশাধিকাৰ দিয়ে। Claude Code, Cursor, GitHub Copilot Agents আৰু Codex-ৰ সৈতে কাম কৰে।

[নথিপত্ৰসমূহ পঢ়ক →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

এটা আদেশত JSON, YAML, markdown, CSV আৰু PO ফাইল স্থানীয়কৰণ কৰক। এটা লকফাইলে কি ইতিমধ্যে স্থানীয়কৃত সেয়া ট্ৰেক কৰে – কেৱল নতুন বা সলনি হোৱা সমলহে প্ৰক্ৰিয়াকৰণ হয়। Lingo.dev-ত আপোনাৰ স্থানীয়কৰণ ইঞ্জিনলৈ ডিফল্ট হয়, অথবা নিজৰ LLM আনক (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[নথিপত্ৰ পঢ়ক →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

আপোনাৰ পাইপলাইনত নিৰন্তৰ স্থানীয়কৰণ। প্ৰতিটো পুশে স্থানীয়কৰণ সক্ৰিয় কৰে – ক'ডে উৎপাদনত উপনীত হোৱাৰ আগতে অনুপস্থিত স্ট্ৰিংবোৰ পূৰণ কৰা হয়। GitHub Actions, GitLab CI/CD, আৰু Bitbucket Pipelines সমৰ্থন কৰে।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[নথিপত্ৰ পঢ়ক →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

বেকেণ্ড ক'ডৰ পৰা পোনপটীয়াকৈ আপোনাৰ স্থানীয়কৰণ ইঞ্জিন কল কৰক। ৱেবহুক ডেলিভাৰীৰ সৈতে সিংক্ৰনাছ আৰু এছিংক্ৰনাছ স্থানীয়কৰণ, প্ৰতিটো ল'কেলৰ বাবে বিফলতা বিচ্ছিন্নতা, আৰু WebSocket যোগে ৰিয়েল-টাইম প্ৰগতি।

[নথিপত্ৰ পঢ়ক →](https://lingo.dev/en/docs/api)

---

### React ৰ বাবে Lingo Compiler (প্ৰাৰম্ভিক আলফা)

i18n ৰেপাৰ অবিহনে বিল্ড-টাইম React স্থানীয়কৰণ। সৰল ইংৰাজী পাঠৰ সৈতে কম্পোনেণ্ট লিখক – কম্পাইলাৰে অনুবাদযোগ্য স্ট্ৰিং চিনাক্ত কৰে আৰু বিল্ড সময়ত স্থানীয়কৃত ভেৰিয়েণ্ট সৃষ্টি কৰে। কোনো অনুবাদ কী নাই, কোনো JSON ফাইল নাই, কোনো `t()` ফাংচন নাই। Next.js (App Router) আৰু Vite + React সমৰ্থন কৰে।

[নথিপত্ৰ পঢ়ক →](https://lingo.dev/en/docs/react/compiler)

---

## অৱদান

অৱদান স্বাগত জনোৱা হয়। অনুগ্ৰহ কৰি এই নিৰ্দেশনাসমূহ অনুসৰণ কৰক:

1. **সমস্যা:** [বাগ ৰিপ'ৰ্ট কৰক বা বৈশিষ্ট্য অনুৰোধ কৰক](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [পৰিৱৰ্তন জমা দিয়ক](https://github.com/lingodotdev/lingo.dev/pulls)
   - প্ৰতিটো PR ৰ বাবে এটা চেঞ্জছেট প্ৰয়োজন: `pnpm new` (বা নন-ৰিলিজ পৰিৱৰ্তনৰ বাবে `pnpm new:empty`)
   - জমা দিয়াৰ আগতে পৰীক্ষাবোৰ পাছ হয় নে নাই নিশ্চিত কৰক
3. **ডেভেলপমেণ্ট:** এইটো এটা pnpm + turborepo monorepo
   - নিৰ্ভৰশীলতা ইনষ্টল কৰক: `pnpm install`
   - পৰীক্ষা চলাওক: `pnpm test`
   - বিল্ড কৰক: `pnpm build`

**সমৰ্থন:** [Discord সম্প্ৰদায়](https://lingo.dev/go/discord)

## ষ্টাৰ ইতিহাস

যদি আপুনি Lingo.dev উপযোগী বুলি পায়, আমাক এটা ষ্টাৰ দিয়ক আৰু আমাক 10,000 ষ্টাৰত উপনীত হোৱাত সহায় কৰক!

[

![ষ্টাৰ ইতিহাস চাৰ্ট](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## স্থানীয়কৃত নথিপত্ৰ

**উপলব্ধ অনুবাদসমূহ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**নতুন ভাষা যোগ কৰা:**

1. [BCP-47 ফৰ্মেট](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ব্যৱহাৰ কৰি [`i18n.json`](./i18n.json)-ত লʼকেল ক'ড যোগ কৰক
2. এটা পুল ৰিকুৱেষ্ট দাখিল কৰক
