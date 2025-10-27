Here's the complete Urdu translation of the README for your contribution to Lingo.dev:

```markdown
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
    ⚡ Lingo.dev - اوپن سورس، AI سے چلنے والا i18n ٹول کٹ LLMs کے ساتھ فوری
    لوکلائزیشن کے لیے۔
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev کمپائلر</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="ریلیز"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="لائسنس"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="آخری کمٹ"
    />
  </a>
</p>

---

## کمپائلر سے ملیں 🆕

**Lingo.dev کمپائلر** ایک مفت، اوپن سورس کمپائلر مڈل ویئر ہے، جو موجودہ React کمپوننٹس میں کوئی تبدیلی کیے بغیر بلڈ ٹائم پر کسی بھی React ایپ کو کثیر لسانی بنانے کے لیے ڈیزائن کیا گیا ہے۔

ایک بار انسٹال کریں:
```

npm install lingo.dev

```

اپنی بلڈ کنفیگ میں فعال کریں:

```

import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
sourceLocale: "en",
targetLocales: ["es", "fr"],
})(existingNextConfig);

```

`next build` چلائیں اور ہسپانوی اور فرانسیسی بنڈلز کو ظاہر ہوتے دیکھیں ✨

[دستاویزات پڑھیں →](https://lingo.dev/compiler) مکمل گائیڈ کے لیے، اور [ہمارے Discord میں شامل ہوں](https://lingo.dev/go/discord) اپنے سیٹ اپ میں مدد حاصل کرنے کے لیے۔

---

### اس ریپو میں کیا ہے؟

| ٹول        | مختصر تفصیل                                                                 | دستاویزات                               |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------- |
| **کمپائلر** | بلڈ ٹائم React لوکلائزیشن                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**    | ویب اور موبائل ایپس، JSON، YAML، مارک ڈاؤن، + مزید کے لیے ایک کمانڈ لوکلائزیشن | [/cli](https://lingo.dev/cli)           |
| **CI/CD**  | ہر پش پر ترجمے آٹو کمٹ کریں + ضرورت کے مطابق پل رکوئسٹ بنائیں                | [/ci](https://lingo.dev/ci)             |
| **SDK**    | صارف کی طرف سے تیار کردہ مواد کے لیے ریئل ٹائم ترجمہ                        | [/sdk](https://lingo.dev/sdk)           |

ذیل میں ہر ایک کے لیے فوری معلومات دی گئی ہیں 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہ راست کوڈ اور مواد کا ترجمہ کریں۔

```

npx lingo.dev@latest run

```

یہ ہر سٹرنگ کو فنگر پرنٹ کرتا ہے، نتائج کو کیش کرتا ہے، اور صرف ان چیزوں کا دوبارہ ترجمہ کرتا ہے جو تبدیل ہو گئی ہیں۔

[دستاویزات کی پیروی کریں →](https://lingo.dev/cli) اسے سیٹ اپ کرنے کا طریقہ جاننے کے لیے۔

---

### 🔄 Lingo.dev CI/CD

خودکار طور پر کامل ترجمے شپ کریں۔

```

# .github/workflows/i18n.yml

name: Lingo.dev i18n
on: [push]

jobs:
i18n:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4 - uses: lingodotdev/lingo.dev@main
with:
api-key: ${{ secrets.LINGODOTDEV_API_KEY }}

```

آپ کے ریپو کو سبز اور آپ کی پروڈکٹ کو دستی اقدامات کے بغیر کثیر لسانی رکھتا ہے۔

[دستاویزات پڑھیں →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

متحرک مواد کے لیے فوری فی درخواست ترجمہ۔

```

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

چیٹ، صارف کے تبصروں اور دیگر ریئل ٹائم فلو کے لیے بہترین۔

[دستاویزات پڑھیں →](https://lingo.dev/sdk)

---

## 🤝 کمیونٹی

ہم کمیونٹی پر مبنی ہیں اور شراکت کو پسند کرتے ہیں!

- کوئی خیال ہے؟ [ایک ایشو کھولیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ ٹھیک کرنا چاہتے ہیں؟ [ایک PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد چاہیے؟ [ہمارے Discord میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ اسٹار ہسٹری

اگر آپ کو ہمارا کام پسند ہے تو ہمیں ⭐ دیں اور 4,000 ستاروں تک پہنچنے میں ہماری مدد کریں! 🌟

[![اسٹار ہسٹری چارٹ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دوسری زبانوں میں ریڈمی

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

اپنی زبان نہیں دیکھ رہے؟ اسے [`i18n.json`](./i18n.json) میں شامل کریں اور ایک PR کھولیں!
```
