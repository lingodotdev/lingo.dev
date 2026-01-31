<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - মুক্ত উৎস, AI-চালিত i18n টুলকিট LLM ৰ সৈতে তাৎক্ষণিক
    স্থানীয়কৰণৰ বাবে।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

## Compiler ৰ সৈতে পৰিচয় হওক 🆕

**Lingo.dev Compiler** এটা বিনামূলীয়া, মুক্ত উৎস কম্পাইলাৰ মিডলৱেৰ, যিকোনো React এপক বিল্ড সময়ত বহুভাষিক কৰিবলৈ ডিজাইন কৰা হৈছে বৰ্তমান React কম্পোনেণ্টসমূহত কোনো পৰিৱৰ্তনৰ প্ৰয়োজন নোহোৱাকৈ।

> **টোকা:** যদি আপুনি লিগেচি কম্পাইলাৰ (`@lingo.dev/_compiler`) ব্যৱহাৰ কৰি আছে, অনুগ্ৰহ কৰি `@lingo.dev/compiler` লৈ মাইগ্ৰেট কৰক। লিগেচি কম্পাইলাৰ অৱমূল্যায়িত আৰু ভৱিষ্যতৰ ৰিলিজত আঁতৰোৱা হ'ব।

এবাৰ ইনষ্টল কৰক:

```bash
npm install @lingo.dev/compiler
```

আপোনাৰ বিল্ড কনফিগত সক্ষম কৰক:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

`next build` চলাওক আৰু স্পেনিছ আৰু ফ্ৰেঞ্চ বাণ্ডল ওলাই অহা চাওক ✨

[ডকুমেণ্ট পঢ়ক →](https://lingo.dev/compiler) সম্পূৰ্ণ গাইডৰ বাবে, আৰু আপোনাৰ ছেটআপত সহায়ৰ বাবে [আমাৰ Discord ত যোগদান কৰক](https://lingo.dev/go/discord)।

---

### এই ৰিপ'ৰ ভিতৰত কি আছে?

| সঁজুলি       | সংক্ষিপ্ত বিৱৰণ                                                                       | ডকুমেণ্ট                                |
| ------------ | ------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | বিল্ড-টাইম React স্থানীয়কৰণ                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ৱেব আৰু মোবাইল এপ্, JSON, YAML, markdown, + অধিকৰ বাবে এক-কমাণ্ড স্থানীয়কৰণ          | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | প্ৰতিটো পুছত অনুবাদ স্বয়ংক্ৰিয়ভাৱে কমিট কৰক + প্ৰয়োজন হ'লে pull request সৃষ্টি কৰক | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ব্যৱহাৰকাৰী-উৎপন্ন সমলৰ বাবে ৰিয়েলটাইম অনুবাদ                                        | [/sdk](https://lingo.dev/sdk)           |

তলত প্ৰতিটোৰ বাবে দ্ৰুত তথ্য দিয়া হৈছে 👇

---

### ⚡️ Lingo.dev CLI

আপোনাৰ টাৰ্মিনেলৰ পৰা পোনপটীয়াকৈ ক'ড আৰু সমল অনুবাদ কৰক।

```bash
npx lingo.dev@latest run
```

ই প্ৰতিটো ষ্ট্ৰিং ফিংগাৰপ্ৰিণ্ট কৰে, ফলাফল কেশ্ব কৰে, আৰু কেৱল সলনি হোৱা অংশহে পুনৰ অনুবাদ কৰে।

ইয়াক কেনেকৈ ছেটআপ কৰিব লাগে জানিবলৈ [ডকুমেণ্ট অনুসৰণ কৰক →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

স্বয়ংক্ৰিয়ভাৱে নিখুঁত অনুবাদ শ্বিপ কৰক।

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

আপোনাৰ ৰিপ' সেউজীয়া আৰু আপোনাৰ প্ৰডাক্ট বহুভাষিক ৰাখে মেনুৱেল পদক্ষেপ অবিহনে।

[ডকুমেণ্ট পঢ়ক →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ডাইনামিক সমল বাবে তৎক্ষণাৎ প্ৰতি-অনুৰোধ অনুবাদ।

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

চেট, ব্যৱহাৰকাৰীৰ মন্তব্য, আৰু অন্যান্য ৰিয়েল-টাইম প্ৰবাহৰ বাবে নিখুঁত।

[ডক্স পঢ়ক →](https://lingo.dev/sdk)

---

## 🤝 সম্প্ৰদায়

আমি সম্প্ৰদায়-চালিত আৰু অৱদান ভাল পাওঁ!

- কোনো ধাৰণা আছে? [এটা ইছ্যু খোলক](https://github.com/lingodotdev/lingo.dev/issues)
- কিবা ঠিক কৰিব বিচাৰে? [এটা PR পঠিয়াওক](https://github.com/lingodotdev/lingo.dev/pulls)
- সহায়ৰ প্ৰয়োজন? [আমাৰ Discord ত যোগদান কৰক](https://lingo.dev/go/discord)

## ⭐ তাৰকা ইতিহাস

যদি আপুনি আমি কৰি থকা কামটো ভাল পায়, আমাক এটা ⭐ দিয়ক আৰু আমাক 10,000 তাৰকা লাভ কৰাত সহায় কৰক! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 অন্যান্য ভাষাত Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

আপোনাৰ ভাষা দেখা নাই? ইয়াক `i18n.json` ত যোগ কৰক আৰু এটা PR খোলক!

**লোকেল ফৰ্মেট:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ক'ড ব্যৱহাৰ কৰক: `language[-Script][-REGION]`

- ভাষা: ISO 639-1/2/3 সৰু আখৰ (`en`, `zh`, `bho`)
- লিপি: ISO 15924 শিৰোনাম কেছ (`Hans`, `Hant`, `Latn`)
- অঞ্চল: ISO 3166-1 alpha-2 ডাঙৰ আখৰ (`US`, `CN`, `IN`)
- উদাহৰণ: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
