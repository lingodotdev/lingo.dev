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
    ⚡ Lingo.dev - مجموعة أدوات الترجمة مفتوحة المصدر مدعومة بالذكاء الاصطناعي
    للترجمة الفورية باستخدام نماذج اللغة الكبيرة.
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

## تعرّف على المُجمّع 🆕

**Lingo.dev Compiler** هو برنامج وسيط مجاني ومفتوح المصدر، مصمم لجعل أي تطبيق React متعدد اللغات في وقت البناء دون الحاجة إلى أي تغييرات على مكونات React الموجودة.

ثبّته مرة واحدة:

```bash
npm install @lingo.dev/compiler
```

فعّله في إعدادات البناء الخاصة بك:

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

شغّل `next build` وشاهد حزم الإسبانية والفرنسية تظهر ✨

[اقرأ الوثائق ←](https://lingo.dev/compiler) للحصول على الدليل الكامل، و[انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord) للحصول على المساعدة في إعدادك.

---

### ما الموجود داخل هذا المستودع؟

| الأداة       | الملخص                                                                  | الوثائق                                 |
| ------------ | ----------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ترجمة React في وقت البناء                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ترجمة بأمر واحد لتطبيقات الويب والموبايل، JSON، YAML، markdown، والمزيد | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | إرسال الترجمات تلقائيًا عند كل دفع + إنشاء طلبات سحب عند الحاجة         | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ترجمة فورية للمحتوى الذي ينشئه المستخدم                                 | [/sdk](https://lingo.dev/sdk)           |

فيما يلي النقاط السريعة لكل منها 👇

---

### ⚡️ Lingo.dev CLI

ترجم الكود والمحتوى مباشرة من الطرفية الخاصة بك.

```bash
npx lingo.dev@latest run
```

يقوم ببصمة كل سلسلة نصية، ويخزن النتائج مؤقتاً، ويعيد ترجمة ما تغير فقط.

[اتبع الوثائق ←](https://lingo.dev/cli) لتتعلم كيفية إعداده.

---

### 🔄 Lingo.dev CI/CD

قم بشحن ترجمات مثالية تلقائياً.

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

يحافظ على مستودعك نظيفاً ومنتجك متعدد اللغات دون خطوات يدوية.

[اقرأ الوثائق ←](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ترجمة فورية لكل طلب للمحتوى الديناميكي.

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

مثالي للدردشة وتعليقات المستخدمين وتدفقات الوقت الفعلي الأخرى.

[اقرأ الوثائق ←](https://lingo.dev/sdk)

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 6,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 اقرأني بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

**تنسيق اللغة المحلية:** استخدم رموز [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- اللغة: ISO 639-1/2/3 أحرف صغيرة (`en`، `zh`، `bho`)
- الكتابة: ISO 15924 حالة العنوان (`Hans`، `Hant`، `Latn`)
- المنطقة: ISO 3166-1 alpha-2 أحرف كبيرة (`US`، `CN`، `IN`)
- أمثلة: `en`، `pt-BR`، `zh-Hans`، `sr-Cyrl-RS`
