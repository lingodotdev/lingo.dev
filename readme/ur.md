<div dir="rtl">

<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - اوپن سورس، AI-پاورڈ i18n ٹول کٹ فوری لوکلائزیشن کے لیے LLMs کے ساتھ۔</strong>
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

**Lingo.dev کمپائلر** ایک مفت، اوپن سورس کمپائلر مڈل ویئر ہے، جو کسی بھی React ایپ کو بلڈ ٹائم پر کثیر لسانی بنانے کے لیے ڈیزائن کیا گیا ہے بغیر موجودہ React کمپوننٹس میں کوئی تبدیلی کیے۔

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

`next build` چلائیں اور سپینش اور فرانسیسی بنڈلز کو نکلتے دیکھیں ✨

[دستاویزات پڑھیں →](https://lingo.dev/compiler) مکمل گائیڈ کے لیے، اور [ہماری Discord میں شامل ہوں](https://lingo.dev/go/discord) اپنے سیٹ اپ میں مدد حاصل کرنے کے لیے۔

---

### اس ریپو میں کیا ہے؟

| ٹول         | مختصر تفصیل                                                                          | دستاویزات                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **کمپائلر** | بلڈ ٹائم React لوکلائزیشن                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ویب اور موبائل ایپس، JSON، YAML، markdown، اور مزید کے لیے ایک کمانڈ لوکلائزیشن | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ہر پش پر خودکار ترجمے کمٹ کریں + ضرورت پڑنے پر pull requests بنائیں        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | صارف کی تیار کردہ مواد کے لیے حقیقی وقت میں ترجمہ                                | [/sdk](https://lingo.dev/sdk)           |

ہر ایک کے لیے فوری نکات ذیل میں ہیں 👇

---

### ⚡️ Lingo.dev CLI

اپنے ٹرمینل سے براہ راست کوڈ اور مواد کا ترجمہ کریں۔

```bash
npx lingo.dev@latest run
```

یہ ہر سٹرنگ کی فنگر پرنٹ بناتا ہے، نتائج کو کیش کرتا ہے، اور صرف وہی دوبارہ ترجمہ کرتا ہے جو تبدیل ہوا۔

[دستاویزات پر عمل کریں →](https://lingo.dev/cli) یہ جاننے کے لیے کہ اسے کیسے سیٹ اپ کریں۔

---

### 🤖 Lingo.dev CI/CD

GitHub Actions کے ذریعے خودکار ترجمے۔

```yaml
- uses: lingodotdev/actions@v1
  with:
    api-key: ${{ secrets.LINGO_API_KEY }}
```

ہر تبدیلی خودکار طور پر ترجمہ ہو جاتی ہے اور آپ کی ریپو میں واپس کمٹ ہو جاتی ہے۔

[مزید جانیں →](https://lingo.dev/ci)

---

### 📦 Lingo.dev SDK

صارف کے تیار کردہ مواد کو ترجمہ کریں، نوٹیفیکیشنز، چیٹ میسجز، اور بہت کچھ۔

```bash
npm install @lingo.dev/sdk
```

```ts
import { Lingo } from "@lingo.dev/sdk";

const lingo = new Lingo({ apiKey: "..." });

const translation = await lingo.translate({
  text: "خوش آمدید",
  targetLocale: "en",
});

console.log(translation); // "Welcome"
```

[API حوالہ →](https://lingo.dev/sdk)

---

## کیوں Lingo.dev؟

- **⚡ تیز**: بلڈ ٹائم لوکلائزیشن = رن ٹائم میں صفر اوور ہیڈ
- **🎯 درست**: کیڑے کو سیاق و سباق کے ساتھ ترجمہ کریں، نہ صرف الفاظ
- **🔒 محفوظ**: آپ کا ڈیٹا کبھی تیسری پارٹی LLM APIs میں نہیں بھیجا جاتا (خود میزبانی کے اختیار کے ساتھ)
- **🌍 پیمانہ**: 100+ زبانوں میں ترجمہ کریں
- **💰 سرمایہ کاری مؤثر**: ترجمے کیش کیے جاتے ہیں، صرف deltas کی ادائیگی کریں
- **🔧 قابل توسیع**: اپنے اپنے ترجمہ فراہم کنندگان کو جوڑیں

---

## شروع کریں

### کمپائلر

```bash
npm install lingo.dev
```

[کمپائلر گائیڈ →](https://lingo.dev/compiler)

### CLI

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[CLI گائیڈ →](https://lingo.dev/cli)

### SDK

```bash
npm install @lingo.dev/sdk
```

[SDK حوالہ →](https://lingo.dev/sdk)

---

## انٹیگریشنز

Lingo.dev کام کرتا ہے:

- ✅ **Next.js** (Pages اور App Router)
- ✅ **Vite**
- ✅ **React Router v7**
- ✅ **AdonisJS**
- ✅ **Directus**
- ✅ ہر کوئی فریم ورک جو بنڈلنگ کو سپورٹ کرتا ہے

[انٹیگریشن گائیڈز →](https://lingo.dev/integrations)

---

## مثالیں

یہ ریپو میں شامل ہے:

- [Next.js App](demo/next-app) - App Router کے ساتھ مکمل Next.js مثال
- [Vite React](demo/vite-project) - Vite + React کے ساتھ سادہ مثال
- [React Router v7](demo/react-router-app) - React Router v7 انٹیگریشن
- [AdonisJS](demo/adonisjs) - AdonisJS بیک اینڈ مثال

ہر مثال میں ایک تیار شدہ ترتیب اور کام کرنے والا نفاذ ہے۔

---

## کمیونٹی

- [Discord](https://lingo.dev/go/discord) - سوالات، مدد، اور خیالات کا اشتراک
- [GitHub Discussions](https://github.com/lingodotdev/lingo.dev/discussions) - فیچر کی درخواستیں اور تبادلہ خیال
- [Twitter](https://twitter.com/lingodotdev) - تازہ ترین خبریں اور اپ ڈیٹس

---

## تعاون

ہم تعاون کو خوش آمدید کہتے ہیں! براہ کرم [CONTRIBUTING.md](CONTRIBUTING.md) دیکھیں تفصیلات کے لیے۔

---

## لائسنس

MIT © [Lingo.dev](https://lingo.dev)

---

<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/logo.png" width="64" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  Lingo.dev کے ساتھ بنایا گیا ❤️
</p>

</div>
