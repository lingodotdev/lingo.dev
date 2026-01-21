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
    ⚡ Lingo.dev - اوپن سورس، AI سے چلنے والا i18n ٹول کٹ جو LLMs کے ساتھ فوری
    لوکلائزیشن فراہم کرتا ہے۔
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

## Compiler سے ملیں 🆕

**Lingo.dev Compiler** ایک مفت، اوپن سورس کمپائلر middleware ہے، جو کسی بھی React ایپ کو build کے وقت کثیر لسانی بنانے کے لیے ڈیزائن کیا گیا ہے بغیر موجودہ React components میں کوئی تبدیلی کیے۔

ایک بار انسٹال کریں:

```bash
npm install @lingo.dev/compiler
```

اپنی build config میں فعال کریں:

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

`next build` چلائیں اور دیکھیں کہ ہسپانوی اور فرانسیسی bundles کیسے سامنے آتے ہیں ✨

مکمل گائیڈ کے لیے [دستاویزات پڑھیں →](https://lingo.dev/compiler)، اور اپنے سیٹ اپ میں مدد کے لیے [ہماری Discord میں شامل ہوں](https://lingo.dev/go/discord)۔

---

### اس repo میں کیا ہے؟

| Tool         | خلاصہ                                                                             | دستاویزات                               |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Build کے وقت React کی لوکلائزیشن                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ویب اور موبائل ایپس، JSON، YAML، markdown وغیرہ کے لیے ایک کمانڈ لوکلائزیشن       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ہر push پر خودکار طور پر تراجم commit کریں اور ضرورت پڑنے پر pull requests بنائیں | [/ci](https://lingo.dev/ci)             |
| **SDK**      | یوزر-جنریٹڈ مواد کے لیے ریئل ٹائم ترجمہ                                           | [/sdk](https://lingo.dev/sdk)           |

ذیل میں ہر ایک کے لیے فوری نکات ہیں 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہ راست کوڈ اور مواد کا ترجمہ کریں۔

```bash
npx lingo.dev@latest run
```

یہ ہر سٹرنگ کو فنگر پرنٹ کرتا ہے، نتائج کو کیش کرتا ہے، اور صرف تبدیل شدہ چیزوں کا دوبارہ ترجمہ کرتا ہے۔

[دستاویزات دیکھیں →](https://lingo.dev/cli) تاکہ جان سکیں کہ اسے کیسے سیٹ اپ کریں۔

---

### 🔄 Lingo.dev CI/CD

خودکار طریقے سے بہترین ترجمے فراہم کریں۔

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

آپ کے repo کو سبز اور آپ کی پروڈکٹ کو کسی دستی مرحلے کے بغیر کثیر لسانی رکھتا ہے۔

[دستاویزات پڑھیں →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

متحرک مواد کے لیے فی درخواست فوری ترجمہ۔

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

چیٹ، صارف کے تبصروں، اور دیگر real-time flows کے لیے بہترین۔

[دستاویزات پڑھیں →](https://lingo.dev/sdk)

---

## 🤝 کمیونٹی

ہم کمیونٹی پر مبنی ہیں اور شراکتوں کو پسند کرتے ہیں!

- کوئی خیال ہے؟ [ایک issue کھولیں](https://github.com/lingodotdev/lingo.dev/issues)
- کچھ ٹھیک کرنا چاہتے ہیں؟ [PR بھیجیں](https://github.com/lingodotdev/lingo.dev/pulls)
- مدد چاہیے؟ [ہماری Discord میں شامل ہوں](https://lingo.dev/go/discord)

## ⭐ Star History

اگر آپ کو ہمارا کام پسند ہے، تو ہمیں ⭐ دیں اور 6,000 ستاروں تک پہنچنے میں ہماری مدد کریں! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 دیگر زبانوں میں Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

اپنی زبان نظر نہیں آ رہی؟ اسے [`i18n.json`](./i18n.json) میں شامل کریں اور PR کھولیں!

**لوکیل فارمیٹ:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) کوڈز استعمال کریں: `language[-Script][-REGION]`

- زبان: ISO 639-1/2/3 چھوٹے حروف (`en`, `zh`, `bho`)
- رسم الخط: ISO 15924 ٹائٹل کیس (`Hans`, `Hant`, `Latn`)
- خطہ: ISO 3166-1 alpha-2 بڑے حروف (`US`, `CN`, `IN`)
- مثالیں: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
