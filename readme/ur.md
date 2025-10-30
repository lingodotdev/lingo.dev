<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p dir="rtl" lang="ur" align="center">
  <strong>⚡Lingo.dev — اوپن سورس، AI سے چلنے والا i18n ٹول کِٹ جو LLMs کے ذریعے فوری لوکلائزیشن فراہم کرتا ہے۔</strong>
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

## کمپائلر کا تعارف 🆕

**Lingo.dev Compiler** ایک مفت، اوپن سورس کمپائلر مڈل ویئر ہے، جو کسی بھی React ایپ کو build کے وقت کثیر لسانی بنانے کے لیے ڈیزائن کیا گیا ہے — اور اس کے لیے آپ کے موجودہ React کمپونینٹس میں کسی قسم کی تبدیلی درکار نہیں۔

ایک مرتبہ انسٹال کریں:

```bash
npm install lingo.dev
```

اپنے build کنفیگ میں فعال کریں:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` چلائیں اور ہسپانوی اور فرانسیسی بنڈلز بنتے ہوئے دیکھیں ✨

[مکمل دستاویزات پڑھیں →](https://lingo.dev/compiler) اور سیٹ اپ میں مدد کے لیے [ہماری Discord](https://lingo.dev/go/discord) میں شامل ہوں۔

---

### اس ریپو میں کیا ہے؟

| Tool         | خلاصہ                                                                             | دستاویزات                               |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Build کے وقت React کی لوکلائزیشن                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ویب اور موبائل ایپس، JSON، YAML، markdown وغیرہ کے لیے ایک کمانڈ لوکلائزیشن       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ہر push پر خودکار طور پر تراجم commit کریں اور ضرورت پڑنے پر pull requests بنائیں | [/ci](https://lingo.dev/ci)             |
| **SDK**      | یوزر-جنریٹڈ مواد کے لیے ریئل ٹائم ترجمہ                                           | [/sdk](https://lingo.dev/sdk)           |

نیچے ہر ایک کا مختصر تعارف ہے 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہِ راست کوڈ اور مواد کا ترجمہ کریں۔

```bash
npx lingo.dev@latest run
```

یہ ہر سٹرنگ کا fingerprint بناتا ہے، نتائج کو cache کرتا ہے، اور صرف وہی چیزیں دوبارہ ترجمہ کرتا ہے جو تبدیل ہوئی ہوں۔

[دستاویزات دیکھیں →](https://lingo.dev/cli) تاکہ آپ اسے سیٹ اپ کر سکیں۔

---

### 🔄 Lingo.dev CI/CD

تراجم کو خودکار انداز میں شپ کریں۔

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

یہ آپ کے ریپو کو ہرا رکھتا ہے اور آپ کی پراڈکٹ کو بغیر دستی اقدامات کے کثیر لسانی بناتا ہے۔

[دستاویزات پڑھیں →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ڈائنامک مواد کے لیے ہر درخواست پر فوری ترجمہ۔

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

چیٹ، یوزر کمنٹ، اور دیگر ریئل ٹائم فلو کے لیے بہترین حل۔

[دستاویزات پڑھیں →](https://lingo.dev/sdk)

---

## 🤝 کمیونٹی

ہم کمیونٹی کی طرف سے چلتے ہیں اور آپ کی شراکت کو قدر کی نگاہ سے دیکھتے ہیں!

- کوئی خیال ہے؟ [ایک مسئلہ کھولیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ ٹھیک کرنا چاہتے ہیں؟ [ایک PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد چاہیے؟ [ہماری Discord میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ اسٹار ہسٹری

اگر آپ کو ہمارا کام پسند آتا ہے تو ہمیں ⭐ دیں اور ہمیں 4,000 اسٹار تک پہنچانے میں مدد کریں! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دیگر زبانوں میں ریڈمی

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [اردو](/readme/ur.md)

اپنی زبان نہیں دیکھی؟ اسے [`i18n.json`](./i18n.json) میں شامل کریں اور PR کھولیں!
