<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - open-source, AI-powered i18n toolkit for instant localization with LLMs.</strong>
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

## کمپائلر سے ملو 🆕

**Lingo.dev Compiler** ایک مفت اور اوپن سورس کمپائلر مڈل ویئر ہے جو کسی بھی React ایپ کو بلڈ ٹائم پر کثیراللسانی بنانے کے لیے تیار کیا گیا ہے، بغیر موجودہ React کمپوننٹس میں کوئی تبدیلی کیے۔

ایک بار انسٹال کریں:

```bash
npm install lingo.dev
```

اپنے بلڈ کنفیگ میں فعال کریں:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

اور دیکھیں کہ ہسپانوی اور فرانسیسی بنڈلز تیار ہو جاتے ہیں `next build` چلائیں ✨

[Read the docs →](https://lingo.dev/compiler) for the full guide, and [Join our Discord](https://lingo.dev/go/discord) to get help with your setup.

---

### اس ریپو میں کیا ہے؟

| Tool         | TL;DR                                                                          | Docs                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Build-time React localization                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | One-command localization for web and mobile apps, JSON, YAML, markdown, + more | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit translations on every push + create pull requests if needed        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Realtime translation for user-generated content                                | [/sdk](https://lingo.dev/sdk)           |

ذیل میں ہر ایک کا مختصر جائزہ 👇

---

### ⚡️ Lingo.dev CLI

ٹرمینل سے براہِ راست کوڈ اور مواد کا ترجمہ کریں۔

```bash
npx lingo.dev@latest run
```

یہ ہر سٹرنگ کا فنگرپرنٹ بناتا ہے، نتائج کو کیش کرتا ہے، اور صرف وہی دوبارہ ترجمہ کرتا ہے جو تبدیل ہوا ہو۔

[دستاویزات دیکھیں →](https://lingo.dev/cli) سیٹ اپ کا طریقہ جاننے کے لیے۔

---

### 🔄 Lingo.dev CI/CD

خودکار طور پر بہترین ترجمے جاری کریں۔

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

یہ آپ کے ریپو کو ہمیشہ درست حالت میں رکھتا ہے اور بغیر کسی دستی مرحلے کے آپ کی پروڈکٹ کو کثیراللسانی بناتا ہے۔

[مزید پڑھیں →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

حرکت پذیر مواد کا فی درخواست ترجمہ فوری طور پر حاصل کریں۔

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

یہ چیٹ، صارف کے تبصرے، اور دیگر ریئل ٹائم فیچرز کے لیے بہترین ہے۔

[مزید پڑھیں →](https://lingo.dev/sdk)

---

## 🤝 کمیونٹی

ہماری کمیونٹی بنیاد پر کام کرتی ہے اور آپ کی شمولیت کا خیرمقدم کرتی ہے!

- کوئی آئیڈیا ہے؟ [ایک مسئلہ کھولیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ درست کرنا چاہتے ہیں؟ [PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد چاہیے؟ [ہمارے Discord میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ اسٹار ہسٹری

اگر آپ کو ہمارا کام پسند ہے تو ہمیں ایک ⭐ دیں اور 5,000 اسٹارز تک پہنچنے میں مدد کریں! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دیگر زبانوں میں README پڑھیں

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [اردو](/readme/ur.md)

اپنی زبان نہیں دیکھ رہے؟ i18n.json
 میں شامل کریں اور PR بھیجیں!
