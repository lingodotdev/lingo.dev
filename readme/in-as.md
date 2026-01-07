<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - মুক্ত উৎস (open-source) AI-চালিত i18n toolkit যাৰ সহায়ত LLMs ব্যৱহাৰ কৰি তৎক্ষণাৎ স্থানীয়কৰণ (localization)।</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 Product of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## Compiler পৰিচয় 🆕

**Lingo.dev Compiler** এটা বিনামূলীয়া, মুক্ত উৎস compiler middleware — যিয়ে যিকোনো React app-লৈ build সময়ত বহু-ভাষা সমৰ্থন যোগায়, কোডত কোনো সলনি নকৰাকৈ।

ইনস্টল কৰক:

```bash
npm install lingo.dev
```

Build config-ত সক্ষম কৰক:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` চলাওক আৰু দেখক — স্পেনিছ আৰু ফ্ৰেঞ্চ bundle স্বয়ংক্ৰিয়ভাৱে নিৰ্মাণ হৈ গ'ল ✨

[দস্তাবেজ পঢ়ক →](https://lingo.dev/compiler) সম্পূৰ্ণ নিৰ্দেশাবলী পঢ়িবলৈ, আৰু [আমাৰ Discord-ত যোগদান কৰক](https://lingo.dev/go/discord) সহায়ৰ বাবে।

---

### এই ৰেপ’জিটৰিত কি আছে?

| টুল | সংক্ষিপ্ত বিৱৰণ | দস্তাবেজ |
| ---- | ---------------- | ---------- |
| **Compiler** | Build সময়ত React localize কৰে | [/compiler](https://lingo.dev/compiler) |
| **CLI** | এক-আদেশত web/mobile, JSON, YAML, markdown অনুবাদ | [/cli](https://lingo.dev/cli) |
| **CI/CD** | Translation স্বয়ংক্ৰিয় commit আৰু pull request | [/ci](https://lingo.dev/ci) |
| **SDK** | সময়-বাস্তৱ translation (real-time translation) | [/sdk](https://lingo.dev/sdk) |

তলত প্ৰতিটো টুলৰ সংক্ষিপ্ত বিৱৰণ দিয়া হৈছে 👇

---

### ⚡️ Lingo.dev CLI

আপোনাৰ টাৰ্মিনেলৰ পৰা সোজাকৈ কোড আৰু কন্টেণ্ট অনুবাদ কৰক।

```bash
npx lingo.dev@latest run
```

ই প্ৰতিটো string fingerprint কৰে, ফলাফল cache ৰাখে, আৰু কেৱল সলনি হোৱা অংশসমূহ পুনঃ-অনুবাদ কৰে।

[দস্তাবেজ পঢ়ক →](https://lingo.dev/cli) স্থাপন পদ্ধতি জানিবলৈ।

---

### 🔄 Lingo.dev CI/CD

স্বয়ংক্ৰিয়ভাৱে নিখুঁত translation প্ৰেৰণ কৰক।

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

ই আপোনাৰ ৰেপ’জিটৰীক সদায় আপডেট ৰাখে আৰু আপোনাৰ প্ৰডাক্টক multilingual কৰি তোলে।

[দস্তাবেজ পঢ়ক →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Dynamic content-ৰ বাবে সময়-বাস্তৱ অনুবাদ।

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
// ফলাফল: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

চেট, ব্যৱহাৰকাৰী মন্তব্য, বা অন্যান্য real-time flows-ৰ বাবে উপযুক্ত।

[দস্তাবেজ পঢ়ক →](https://lingo.dev/sdk)

---

## 🤝 সম্প্ৰদায়

আমাৰ প্ৰকল্প সম্প্ৰদায়-ভিত্তিক, আৰু আপোনাৰ অৱদানক স্বাগতম!

- নতুন চিন্তা আছে? [Issue খুলক](https://github.com/lingodotdev/lingo.dev/issues)
- কিছু সংশোধন কৰিব বিচাৰে? [PR পঠাওক](https://github.com/lingodotdev/lingo.dev/pulls)
- সহায়ৰ প্ৰয়োজন? [আমাৰ Discord-ত যোগদান কৰক](https://lingo.dev/go/discord)

## ⭐ Star History

যদি আপোনালোকক আমাৰ কাম ভাল লাগে, এটা ⭐ দিয়ক আৰু আমাক ৪,০০০ স্টাৰলৈ সহায় কৰক! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 আন ভাষাত Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • **[অসমীয়া](/readme/as.md)**

আপোনাৰ ভাষাটো তালিকাত নাই নেকি? [`i18n.json`](./i18n.json)-ত যোগ কৰক আৰু PR পঠাওক!
