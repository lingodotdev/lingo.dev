<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - اوپن سورس، AI سے چلنے والا i18n ٹول کٹ جو LLMs کے ساتھ فوری مقامی کاری کے لیے ہے۔</strong>
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
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## کمپائلر سے ملیں 🆕

**Lingo.dev Compiler** ایک مفت، اوپن سورس کمپائلر مِڈل ویئر ہے، جو کسی بھی React ایپ کو بلڈ ٹائم پر کثیر لسانی بنانے کے لیے ڈیزائن کیا گیا ہے بغیر موجودہ React components میں کوئی تبدیلی کی ضرورت کے۔

ایک بار انسٹال کریں:

```bash
npm install lingo.dev
```

اپنی بلڈ کنفگ میں فعال کریں:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` چلائیں اور ہسپانوی اور فرانسیسی بنڈلز کو نکلتے دیکھیں ✨

مکمل گائیڈ کے لیے [دستاویزات پڑھیں →](https://lingo.dev/compiler)، اور اپنے سیٹ اپ میں مدد کے لیے [ہمارے Discord میں شامل ہوں](https://lingo.dev/go/discord)۔

---

### اس ریپو میں کیا ہے؟

| ٹول         | خلاصہ                                                                          | دستاویزات                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **کمپائلر** | بلڈ ٹائم React مقامی کاری                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ویب اور موبائل ایپس، JSON، YAML، markdown، اور مزید کے لیے ایک کمانڈ مقامی کاری | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ہر push پر خودکار ترجمہ کمٹ + ضرورت پر pull requests بنائیں        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | صارف کے ذریعے تیار کردہ مواد کے لیے ریئل ٹائم ترجمہ                                | [/sdk](https://lingo.dev/sdk)           |

ہر ایک کے لیے فوری نکات نیچے ہیں 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہ راست کوڈ اور مواد کا ترجمہ کریں۔

```bash
npx lingo.dev@latest run
```

یہ ہر string کی fingerprint بناتا ہے، نتائج کو cache کرتا ہے، اور صرف تبدیل شدہ چیزوں کا دوبارہ ترجمہ کرتا ہے۔

اسے سیٹ اپ کرنے کا طریقہ جاننے کے لیے [دستاویزات فالو کریں →](https://lingo.dev/cli)۔

---

### 🔄 Lingo.dev CI/CD

خودکار طور پر کامل ترجمے بھیجیں۔

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

آپ کے ریپو کو سبز رکھتا ہے اور آپ کے پروڈکٹ کو دستی مراحل کے بغیر کثیر لسانی بناتا ہے۔

[دستاویزات پڑھیں →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

متحرک مواد کے لیے فوری درخواست کے مطابق ترجمہ۔

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
// واپس کرتا ہے: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

چیٹ، صارف کے تبصروں، اور دیگر ریئل ٹائم فلوز کے لیے مکمل۔

[دستاویزات پڑھیں →](https://lingo.dev/sdk)

---

## 🤝 کمیونٹی

ہم کمیونٹی پر مبنی ہیں اور شراکت سے محبت کرتے ہیں!

- کوئی آئیڈیا ہے؟ [ایک issue کھولیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ ٹھیک کرنا چاہتے ہیں؟ [PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد چاہیے؟ [ہمارے Discord میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ ستارہ کی تاریخ

اگر آپ کو ہمارا کام پسند ہے تو ہمیں ⭐ دیں اور 4,000 ستاروں تک پہنچنے میں ہماری مدد کریں! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دیگر زبانوں میں Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [اردو](/readme/ur.md)

اپنی زبان نظر نہیں آ رہی؟ اسے [`i18n.json`](./i18n.json) میں شامل کریں اور PR کھولیں!
