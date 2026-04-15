<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – স্থানীয়করণ প্রকৌশল প্ল্যাটফর্ম"
    />
  </a>
</p>

<p align="center">
  <strong>
    ওপেন-সোর্স স্থানীয়করণ প্রকৌশল টুল। সামঞ্জস্যপূর্ণ, মানসম্পন্ন অনুবাদের জন্য
    Lingo.dev স্থানীয়করণ প্রকৌশল প্ল্যাটফর্মের সাথে সংযুক্ত হন।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React-এর জন্য Lingo কম্পাইলার (প্রাথমিক আলফা)</a>
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

| টুল                                                | এটি কী করে                                          | দ্রুত কমান্ড                       |
| -------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React অ্যাপের জন্য AI-সহায়তায় i18n সেটআপ          | প্রম্পট: `Set up i18n`             |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ফাইল স্থানীয়করণ করুন | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions-এ ক্রমাগত স্থানীয়করণ                | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n র‍্যাপার ছাড়াই বিল্ড-টাইম React স্থানীয়করণ   | `withLingo()` প্লাগইন              |

### স্থানীয়করণ ইঞ্জিন

এই টুলগুলি [স্থানীয়করণ ইঞ্জিনের](https://lingo.dev) সাথে সংযুক্ত হয় – স্টেটফুল অনুবাদ API যা আপনি Lingo.dev স্থানীয়করণ প্রকৌশল প্ল্যাটফর্মে তৈরি করেন। প্রতিটি ইঞ্জিন শব্দকোষ, ব্র্যান্ড ভয়েস এবং প্রতিটি অনুরোধ জুড়ে লোকেল-নির্দিষ্ট নির্দেশনা সংরক্ষণ করে, [পরিভাষা ত্রুটি ১৬.৬–৪৪.৬% হ্রাস করে](https://lingo.dev/research/retrieval-augmented-localization)। অথবা [আপনার নিজস্ব LLM ব্যবহার করুন](#lingodev-cli)।

---

### Lingo.dev MCP

React অ্যাপে i18n সেটআপ করা ত্রুটিপ্রবণ – এমনকি AI কোডিং সহায়করাও অস্তিত্বহীন API কল্পনা করে এবং রাউটিং ভেঙে ফেলে। Lingo.dev MCP, AI সহায়কদের Next.js, React Router এবং TanStack Start-এর জন্য ফ্রেমওয়ার্ক-নির্দিষ্ট i18n জ্ঞানে কাঠামোবদ্ধ প্রবেশাধিকার দেয়। Claude Code, Cursor, GitHub Copilot Agents এবং Codex-এর সাথে কাজ করে।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

একটি কমান্ডে JSON, YAML, markdown, CSV এবং PO ফাইল স্থানীয়করণ করুন। একটি লকফাইল ট্র্যাক করে কী ইতিমধ্যে স্থানীয়করণ করা হয়েছে – শুধুমাত্র নতুন বা পরিবর্তিত কন্টেন্ট প্রক্রিয়া করা হয়। ডিফল্টভাবে Lingo.dev-এ আপনার স্থানীয়করণ ইঞ্জিন ব্যবহার করে, অথবা আপনার নিজস্ব LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama) ব্যবহার করুন।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ডকস পড়ুন →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

আপনার পাইপলাইনে ক্রমাগত স্থানীয়করণ। প্রতিটি পুশ স্থানীয়করণ ট্রিগার করে – কোড প্রোডাকশনে পৌঁছানোর আগে অনুপস্থিত স্ট্রিংগুলি পূরণ হয়ে যায়। GitHub Actions, GitLab CI/CD এবং Bitbucket Pipelines সমর্থন করে।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ডকস পড়ুন →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

ব্যাকএন্ড কোড থেকে সরাসরি আপনার স্থানীয়করণ ইঞ্জিন কল করুন। ওয়েবহুক ডেলিভারি সহ সিঙ্ক্রোনাস এবং অ্যাসিঙ্ক স্থানীয়করণ, লোকেল প্রতি ব্যর্থতা আলাদাকরণ এবং WebSocket এর মাধ্যমে রিয়েল-টাইম অগ্রগতি।

[ডকস পড়ুন →](https://lingo.dev/en/docs/api)

---

### React এর জন্য Lingo Compiler (প্রাথমিক আলফা)

i18n র‍্যাপার ছাড়াই বিল্ড-টাইম React স্থানীয়করণ। সাধারণ ইংরেজি টেক্সট দিয়ে কম্পোনেন্ট লিখুন – কম্পাইলার অনুবাদযোগ্য স্ট্রিং সনাক্ত করে এবং বিল্ড টাইমে স্থানীয়কৃত ভেরিয়েন্ট তৈরি করে। কোনো অনুবাদ কী নেই, কোনো JSON ফাইল নেই, কোনো `t()` ফাংশন নেই। Next.js (App Router) এবং Vite + React সমর্থন করে।

[ডকস পড়ুন →](https://lingo.dev/en/docs/react/compiler)

---

## অবদান

অবদান স্বাগত। অনুগ্রহ করে এই নির্দেশিকাগুলি অনুসরণ করুন:

1. **ইস্যু:** [বাগ রিপোর্ট করুন বা ফিচার অনুরোধ করুন](https://github.com/lingodotdev/lingo.dev/issues)
2. **পুল রিকোয়েস্ট:** [পরিবর্তন জমা দিন](https://github.com/lingodotdev/lingo.dev/pulls)
   - প্রতিটি PR এর জন্য একটি চেঞ্জসেট প্রয়োজন: `pnpm new` (অথবা নন-রিলিজ পরিবর্তনের জন্য `pnpm new:empty`)
   - জমা দেওয়ার আগে নিশ্চিত করুন যে টেস্ট পাস করে
3. **ডেভেলপমেন্ট:** এটি একটি pnpm + turborepo মনোরেপো
   - ডিপেন্ডেন্সি ইনস্টল করুন: `pnpm install`
   - টেস্ট চালান: `pnpm test`
   - বিল্ড করুন: `pnpm build`

**সহায়তা:** [Discord কমিউনিটি](https://lingo.dev/go/discord)

## স্টার ইতিহাস

Lingo.dev যদি আপনার কাজে লাগে, আমাদের একটি স্টার দিন এবং ১০,০০০ স্টারে পৌঁছাতে সাহায্য করুন!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## স্থানীয়করণকৃত ডকুমেন্টেশন

**উপলব্ধ অনুবাদসমূহ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**নতুন ভাষা যোগ করা:**

1. [BCP-47 ফর্ম্যাট](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ব্যবহার করে [`i18n.json`](./i18n.json)-এ লোকেল কোড যোগ করুন
2. একটি পুল রিকোয়েস্ট জমা দিন
