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
    ⚡ Lingo.dev - ওপেন-সোর্স, AI-চালিত i18n টুলকিট যা LLM-এর মাধ্যমে তাৎক্ষণিক
    স্থানীয়করণ প্রদান করে।
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

## কম্পাইলারের সাথে পরিচিত হন 🆕

**Lingo.dev Compiler** হলো একটি বিনামূল্যের, ওপেন-সোর্স কম্পাইলার মিডলওয়্যার, যা বিদ্যমান React কম্পোনেন্টে কোনো পরিবর্তন ছাড়াই বিল্ড টাইমে যেকোনো React অ্যাপকে বহুভাষিক করার জন্য ডিজাইন করা হয়েছে।

একবার ইনস্টল করুন:

```bash
npm install @lingo.dev/compiler
```

আপনার বিল্ড কনফিগে সক্রিয় করুন:

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

`next build` চালান এবং স্প্যানিশ ও ফরাসি বান্ডেল বের হতে দেখুন ✨

সম্পূর্ণ গাইডের জন্য [ডকুমেন্টেশন পড়ুন →](https://lingo.dev/compiler), এবং আপনার সেটআপে সাহায্য পেতে [আমাদের Discord-এ যোগ দিন](https://lingo.dev/go/discord)।

---

### এই রিপোজিটরিতে কী আছে?

| টুল          | সংক্ষিপ্ত বিবরণ                                                                            | ডকুমেন্টেশন                             |
| ------------ | ------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | বিল্ড-টাইম React স্থানীয়করণ                                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ওয়েব এবং মোবাইল অ্যাপ, JSON, YAML, markdown এবং আরও অনেক কিছুর জন্য এক-কমান্ড স্থানীয়করণ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | প্রতিটি পুশে স্বয়ংক্রিয়ভাবে অনুবাদ কমিট করুন + প্রয়োজনে পুল রিকোয়েস্ট তৈরি করুন        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ইউজার-জেনারেটেড কন্টেন্টের জন্য রিয়েলটাইম অনুবাদ                                          | [/sdk](https://lingo.dev/sdk)           |

নিচে প্রতিটির জন্য দ্রুত তথ্য রয়েছে 👇

---

### ⚡️ Lingo.dev CLI

আপনার টার্মিনাল থেকে সরাসরি কোড এবং কন্টেন্ট অনুবাদ করুন।

```bash
npx lingo.dev@latest run
```

এটি প্রতিটি স্ট্রিং ফিঙ্গারপ্রিন্ট করে, ফলাফল ক্যাশ করে এবং শুধুমাত্র পরিবর্তিত অংশ পুনরায় অনুবাদ করে।

এটি কীভাবে সেটআপ করবেন তা জানতে [ডকুমেন্টেশন অনুসরণ করুন →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

স্বয়ংক্রিয়ভাবে নিখুঁত অনুবাদ ডেলিভার করুন।

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

ম্যানুয়াল ধাপ ছাড়াই আপনার রিপোজিটরি সচল এবং আপনার প্রোডাক্ট বহুভাষিক রাখে।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ডায়নামিক কন্টেন্টের জন্য তাৎক্ষণিক প্রতি-রিকোয়েস্ট অনুবাদ।

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

চ্যাট, ইউজার কমেন্ট এবং অন্যান্য রিয়েল-টাইম ফ্লোর জন্য পারফেক্ট।

[ডকুমেন্টেশন পড়ুন →](https://lingo.dev/sdk)

---

## 🤝 কমিউনিটি

আমরা কমিউনিটি-চালিত এবং অবদান পছন্দ করি!

- কোনো আইডিয়া আছে? [একটি ইস্যু খুলুন](https://github.com/lingodotdev/lingo.dev/issues)
- কিছু ঠিক করতে চান? [একটি PR পাঠান](https://github.com/lingodotdev/lingo.dev/pulls)
- সাহায্য প্রয়োজন? [আমাদের ডিসকর্ডে যোগ দিন](https://lingo.dev/go/discord)

## ⭐ স্টার হিস্ট্রি

আমরা যা করছি তা যদি আপনার পছন্দ হয়, আমাদের একটি ⭐ দিন এবং ৬,০০০ স্টারে পৌঁছাতে সাহায্য করুন! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 অন্যান্য ভাষায় রিডমি

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

আপনার ভাষা দেখছেন না? এটি [`i18n.json`](./i18n.json)-এ যোগ করুন এবং একটি PR খুলুন!

**লোকেল ফরম্যাট:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) কোড ব্যবহার করুন: `language[-Script][-REGION]`

- ভাষা: ISO 639-1/2/3 ছোট হাতের অক্ষর (`en`, `zh`, `bho`)
- লিপি: ISO 15924 টাইটেল কেস (`Hans`, `Hant`, `Latn`)
- অঞ্চল: ISO 3166-1 alpha-2 বড় হাতের অক্ষর (`US`, `CN`, `IN`)
- উদাহরণ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
