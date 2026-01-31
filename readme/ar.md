<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev - مجموعة أدوات i18n مفتوحة المصدر للترجمة المدعومة بنماذج اللغة
    الكبيرة
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">المترجم</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="الإصدار"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="الترخيص"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="آخر تحديث"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 أداة تطوير للشهر"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 منتج الأسبوع"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 منتج اليوم"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="رائج على Github"
    />
  </a>
</p>

---

## البدء السريع

| الأداة                            | حالة الاستخدام                                     | الأمر السريع                       |
| --------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)          | إعداد i18n بمساعدة الذكاء الاصطناعي لتطبيقات React | الأمر: `Set up i18n`               |
| [**CLI**](#lingodev-cli)          | ترجمة ملفات JSON وYAML وmarkdown وCSV وPO          | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)       | خط أنابيب ترجمة آلي في GitHub Actions              | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)          | ترجمة وقت التشغيل للمحتوى الديناميكي               | `npm install lingo.dev`            |
| [**المترجم**](#lingodev-compiler) | ترجمة React في وقت البناء بدون أغلفة i18n          | إضافة `withLingo()`                |

---

### Lingo.dev MCP

خادم بروتوكول سياق النموذج الذي يمكّن مساعدي البرمجة بالذكاء الاصطناعي من إعداد البنية التحتية لـ i18n في تطبيقات React من خلال أوامر اللغة الطبيعية.

**بيئات التطوير المدعومة:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**الأطر المدعومة:**

- Next.js (App Router وPages Router الإصدارات 13-16)
- TanStack Start (الإصدار 1)
- React Router (الإصدار 7)

**الاستخدام:**

بعد تكوين خادم MCP في بيئة التطوير الخاصة بك ([راجع أدلة البدء السريع](https://lingo.dev/en/mcp))، اطلب من المساعد:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

سيقوم المساعد بـ:

1. تكوين التوجيه المعتمد على اللغة (مثل `/en`، `/es`، `/pt-BR`)
2. إعداد مكونات تبديل اللغة
3. تنفيذ الكشف التلقائي عن اللغة
4. إنشاء ملفات التكوين اللازمة

**ملاحظة:** إنشاء الكود بمساعدة الذكاء الاصطناعي غير حتمي. راجع الكود المُنشأ قبل الالتزام به.

[اقرأ المستندات ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

واجهة سطر أوامر مفتوحة المصدر لترجمة التطبيقات والمحتوى باستخدام الذكاء الاصطناعي. تدعم جميع التنسيقات القياسية في الصناعة بما في ذلك JSON وYAML وCSV وملفات PO وmarkdown.

**الإعداد:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**كيف يعمل:**

1. استخراج المحتوى القابل للترجمة من الملفات المُكوَّنة
2. إرسال المحتوى إلى مزود LLM للترجمة
3. كتابة المحتوى المترجم مرة أخرى إلى نظام الملفات
4. إنشاء ملف `i18n.lock` لتتبع الترجمات المكتملة (تجنب المعالجة الزائدة)

**التكوين:**

ينشئ الأمر `init` ملف `i18n.json`. قم بتكوين اللغات والحاويات:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

حقل `provider` اختياري (الافتراضي هو Lingo.dev Engine). لمزودي LLM المخصصين:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**مزودو LLM المدعومون:**

- Lingo.dev Engine (موصى به)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[اقرأ المستندات ←](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

سير عمل ترجمة آلي لخطوط أنابيب CI/CD. يمنع وصول الترجمات غير المكتملة إلى الإنتاج.

**المنصات المدعومة:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**إعداد GitHub Actions:**

أنشئ `.github/workflows/translate.yml`:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**متطلبات الإعداد:**

1. أضف `LINGODOTDEV_API_KEY` إلى أسرار المستودع (Settings > Secrets and variables > Actions)
2. لسير عمل PR: فعّل "Allow GitHub Actions to create and approve pull requests" في Settings > Actions > General

**خيارات سير العمل:**

تنفيذ الترجمات مباشرة:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

إنشاء طلبات سحب مع الترجمات:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**المدخلات المتاحة:**

| المدخل               | الافتراضي                                      | الوصف                             |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| `api-key`            | (مطلوب)                                        | مفتاح API الخاص بـ Lingo.dev      |
| `pull-request`       | `false`                                        | إنشاء PR بدلاً من التنفيذ المباشر |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | رسالة تنفيذ مخصصة                 |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | عنوان PR مخصص                     |
| `working-directory`  | `"."`                                          | الدليل المراد التشغيل فيه         |
| `parallel`           | `false`                                        | تفعيل المعالجة المتوازية          |

[اقرأ المستندات ←](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

مكتبة ترجمة وقت التشغيل للمحتوى الديناميكي. متاحة لـ JavaScript وPHP وPython وRuby.

**التثبيت:**

```bash
npm install lingo.dev
```

**الاستخدام:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**مجموعات SDK المتاحة:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - تطبيقات الويب، Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP، Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django، Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[اقرأ المستندات ←](https://lingo.dev/en/sdk)

---

### مترجم Lingo.dev

نظام ترجمة وقت البناء الذي يجعل تطبيقات React متعددة اللغات دون تعديل المكونات. يعمل أثناء البناء بدلاً من وقت التشغيل.

**التثبيت:**

```bash
pnpm install @lingo.dev/compiler
```

**المصادقة:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**الإعداد (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**الإعداد (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**إعداد المزود:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**مبدل اللغة:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**التطوير:** `npm run dev` (يستخدم المترجم الوهمي، بدون استدعاءات API)

**الإنتاج:** قم بتعيين `usePseudotranslator: false`، ثم `next build`

قم بإيداع دليل `.lingo/` في نظام التحكم بالإصدارات.

**الميزات الرئيسية:**

- لا تكلفة أداء في وقت التشغيل
- لا مفاتيح ترجمة أو ملفات JSON
- لا دوال `t()` أو مكونات غلاف `<T>`
- اكتشاف تلقائي للنصوص القابلة للترجمة في JSX
- دعم TypeScript
- تنسيق ICU MessageFormat للجمع
- تجاوزات يدوية عبر سمة `data-lingo-override`
- أداة محرر ترجمة مدمجة

**أوضاع البناء:**

- `pseudotranslator`: وضع التطوير مع ترجمات نائبة (بدون تكاليف API)
- `real`: إنشاء ترجمات فعلية باستخدام نماذج اللغة الكبيرة
- `cache-only`: وضع الإنتاج باستخدام ترجمات مُنشأة مسبقاً من CI (بدون استدعاءات API)

**الأطر المدعومة:**

- Next.js (App Router مع React Server Components)
- Vite + React (SPA وSSR)

من المخطط دعم أطر عمل إضافية.

[اقرأ المستندات ←](https://lingo.dev/en/compiler)

---

## المساهمة

المساهمات مرحب بها. يرجى اتباع هذه الإرشادات:

1. **المشكلات:** [الإبلاغ عن الأخطاء أو طلب الميزات](https://github.com/lingodotdev/lingo.dev/issues)
2. **طلبات السحب:** [إرسال التغييرات](https://github.com/lingodotdev/lingo.dev/pulls)
   - كل طلب سحب يتطلب مجموعة تغييرات: `pnpm new` (أو `pnpm new:empty` للتغييرات التي لا تتطلب إصداراً)
   - تأكد من نجاح الاختبارات قبل الإرسال
3. **التطوير:** هذا مستودع أحادي pnpm + turborepo
   - تثبيت التبعيات: `pnpm install`
   - تشغيل الاختبارات: `pnpm test`
   - البناء: `pnpm build`

**الدعم:** [مجتمع Discord](https://lingo.dev/go/discord)

## تاريخ النجوم

إذا وجدت Lingo.dev مفيداً، امنحنا نجمة وساعدنا في الوصول إلى 10,000 نجمة!

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## المستندات المترجمة

**الترجمات المتاحة:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**إضافة لغة جديدة:**

1. أضف رمز اللغة إلى [`i18n.json`](./i18n.json) باستخدام [تنسيق BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. أرسل طلب سحب

**تنسيق اللغة BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (أحرف صغيرة): `en`، `zh`، `bho`
- `Script`: ISO 15924 (حالة العنوان): `Hans`، `Hant`، `Latn`
- `REGION`: ISO 3166-1 alpha-2 (أحرف كبيرة): `US`، `CN`، `IN`
- أمثلة: `en`، `pt-BR`، `zh-Hans`، `sr-Cyrl-RS`
