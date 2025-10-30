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
    ⚡ Lingo.dev - اوپن سورس، AI پر مبنی فوری لوکلائزیشن کا ٹول
    جو جدید زبان ماڈلز (LLM) استعمال کرتا ہے۔
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
      alt="آخری کمیٹ"
    />
  </a>
</p>

---

## 🆕 کمپائلر سے ملیں

**Lingo.dev Compiler** ایک مفت اور اوپن سورس کمپائلر مڈل ویئر ہے
جو آپ کے React ایپ کو بغیر موجودہ React کمپوننٹس کو تبدیل کیے،
آسانی سے ملٹی لینگویج بناتا ہے۔

---CODE-PLACEHOLDER-f159f7253d409892d00e70ee045902a5---

`next build` چلائیں اور دیکھیں کہ ہسپانوی اور فرانسیسی بنڈلز خود بخود تیار ہو جائیں گے ✨

[مزید جانیں →](https://lingo.dev/compiler)

---

### اس ریپوزٹری میں کیا شامل ہے؟

| ٹول        | خلاصہ                                                                     | دستاویزات                           |
| ---------- | ------------------------------------------------------------------------ | ----------------------------------- |
| **کمپائلر** | React کی لوکلائزیشن بلڈ ٹائم میں                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**    | ویب/موبائل ایپس، JSON، YAML، مارک ڈاؤن اور مزید کے لیے فوری ترجمہ      | [/cli](https://lingo.dev/cli)       |
| **CI/CD**  | ہر push پر خودکار ترجمے شامل کریں اور PR بنائیں                         | [/ci](https://lingo.dev/ci)         |
| **SDK**    | متحرک مواد کے لیے ریئل ٹائم ترجمہ                                       | [/sdk](https://lingo.dev/sdk)       |

مزید معلومات نیچے 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہِ راست مواد اور کوڈ کا ترجمہ کریں۔

---CODE-PLACEHOLDER-a4836309dda7477e1ba399e340828247---

یہ ہر سٹرنگ کو fingerprint کرتا ہے، نتائج cache کرتا ہے،
اور صرف اُن چیزوں کا دوبارہ ترجمہ کرتا ہے جن میں تبدیلی ہوئی ہو۔

[مزید پڑھیں →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

اعلیٰ معیار کے ترجمے خودکار طور پر جاری کریں۔

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
آپ کی ریپوزٹری کو تازہ (سبز) رکھتی ہے اور آپ کی پروڈکٹ کو بغیر کسی دستی مرحلے کے
کثیر لسانی بنائے رکھتی ہے۔

[دستاویزات پڑھیں ←](https://lingo.dev/ci)

---

### 🧩 Lingo.dev سافٹ ویئر ڈیولپمنٹ کٹ (SDK)

ہر درخواست کے لیے متحرک (Dynamic) مواد کا فوری ترجمہ فراہم کرتی ہے۔

---CODE-PLACEHOLDER-c50e1e589a70e31dd2dde95be8da6ddf---

چیٹ، صارف کی رائے (comments)، اور دیگر ریئل ٹائم تجربات کے لیے بہترین۔

[دستاویزات پڑھیں ←](https://lingo.dev/sdk)

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
// نتیجہ: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

## 🤝 کمیونٹی

ہم کمیونٹی کی بنیاد پر کام کرتے ہیں اور شراکت کا خیرمقدم کرتے ہیں!

- کوئی آئیڈیا ہے؟ [ایک Issue بنائیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ ٹھیک کرنا چاہتے ہیں؟ [PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد کی ضرورت ہے؟ [ہمارے ڈسکارڈ میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ اسٹار ہسٹری

اگر آپ کو یہ پسند ہے کہ ہم کیا کر رہے ہیں تو ، ہمیں ⭐ دیں اور 4،000 ستاروں تک پہنچنے میں ہماری مدد کریں! 🌟

[![اسٹار ہسٹری چارٹ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دوسری زبانوں میں پڑھیں

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [اردو](/readme/ur.md)

 اور ایک PR کھولیں! [`i18n.json`](./i18n.json) اپنی زبان نظر نہیں آ رہی؟ اس میں شامل کریں