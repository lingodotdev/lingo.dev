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
    Lingo.dev - LLM سے چلنے والے لوکلائزیشن کے لیے اوپن سورس i18n ٹول کٹ
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

## فوری آغاز

| ٹول                                | استعمال کا معاملہ                               | فوری کمانڈ                         |
| ---------------------------------- | ----------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ایپس کے لیے AI کی مدد سے i18n سیٹ اپ      | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON، YAML، markdown، CSV، PO فائلوں کا ترجمہ   | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions میں خودکار ترجمہ پائپ لائن       | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | متحرک مواد کے لیے رن ٹائم ترجمہ                 | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrappers کے بغیر بلڈ ٹائم React لوکلائزیشن | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol سرور جو AI کوڈنگ اسسٹنٹس کو قدرتی زبان کے prompts کے ذریعے React ایپلیکیشنز میں i18n انفراسٹرکچر سیٹ اپ کرنے کی سہولت فراہم کرتا ہے۔

**معاون IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**معاون frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**استعمال:**

اپنے IDE میں MCP سرور کو کنفیگر کرنے کے بعد ([فوری شروعات کی گائیڈز دیکھیں](https://lingo.dev/en/mcp))، اپنے اسسٹنٹ کو پرامپٹ کریں:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

اسسٹنٹ یہ کام کرے گا:

1. لوکیل پر مبنی روٹنگ کو کنفیگر کریں (مثلاً `/en`، `/es`، `/pt-BR`)
2. زبان سوئچنگ کمپوننٹس سیٹ اپ کریں
3. خودکار لوکیل ڈیٹیکشن کو نافذ کریں
4. ضروری کنفیگریشن فائلیں جنریٹ کریں

**نوٹ:** AI کی مدد سے کوڈ جنریشن نان ڈیٹرمنسٹک ہے۔ کمٹ کرنے سے پہلے جنریٹ شدہ کوڈ کا جائزہ لیں۔

[دستاویزات پڑھیں ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI کے ساتھ ایپس اور مواد کا ترجمہ کرنے کے لیے اوپن سورس CLI۔ JSON، YAML، CSV، PO فائلوں، اور markdown سمیت تمام انڈسٹری اسٹینڈرڈ فارمیٹس کو سپورٹ کرتا ہے۔

**سیٹ اپ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**یہ کیسے کام کرتا ہے:**

1. کنفیگر شدہ فائلوں سے قابل ترجمہ مواد نکالتا ہے
2. ترجمے کے لیے مواد کو LLM پرووائیڈر کو بھیجتا ہے
3. ترجمہ شدہ مواد کو فائل سسٹم میں واپس لکھتا ہے
4. مکمل شدہ تراجم کو ٹریک کرنے کے لیے `i18n.lock` فائل بناتا ہے (غیر ضروری پروسیسنگ سے بچتا ہے)

**کنفیگریشن:**

`init` کمانڈ ایک `i18n.json` فائل جنریٹ کرتی ہے۔ لوکیلز اور بکٹس کو کنفیگر کریں:

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

`provider` فیلڈ اختیاری ہے (ڈیفالٹ Lingo.dev Engine ہے)۔ کسٹم LLM پرووائیڈرز کے لیے:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**سپورٹ شدہ LLM پرووائیڈرز:**

- Lingo.dev Engine (تجویز کردہ)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[دستاویزات پڑھیں ←](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD پائپ لائنز کے لیے خودکار ترجمہ ورک فلوز۔ نامکمل تراجم کو پروڈکشن تک پہنچنے سے روکتا ہے۔

**تعاون یافتہ پلیٹ فارمز:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions سیٹ اپ:**

`.github/workflows/translate.yml` بنائیں:

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

**سیٹ اپ کی ضروریات:**

1. `LINGODOTDEV_API_KEY` کو repository secrets میں شامل کریں (Settings > Secrets and variables > Actions)
2. PR workflows کے لیے: Settings > Actions > General میں "Allow GitHub Actions to create and approve pull requests" کو فعال کریں

**Workflow کے اختیارات:**

ترجمے براہ راست commit کریں:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

ترجموں کے ساتھ pull requests بنائیں:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**دستیاب inputs:**

| Input                | Default                                        | Description                              |
| -------------------- | ---------------------------------------------- | ---------------------------------------- |
| `api-key`            | (ضروری)                                        | Lingo.dev API key                        |
| `pull-request`       | `false`                                        | براہ راست commit کرنے کی بجائے PR بنائیں |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | حسب ضرورت commit message                 |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | حسب ضرورت PR title                       |
| `working-directory`  | `"."`                                          | جس directory میں چلانا ہے                |
| `parallel`           | `false`                                        | parallel processing فعال کریں            |

[دستاویزات پڑھیں →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

متحرک مواد کے لیے runtime translation library۔ JavaScript، PHP، Python، اور Ruby کے لیے دستیاب۔

**انسٹالیشن:**

```bash
npm install lingo.dev
```

**استعمال:**

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

**دستیاب SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps، Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP، Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django، Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[دستاویزات پڑھیں →](https://lingo.dev/en/sdk)

---

### Lingo.dev کمپائلر

بلڈ ٹائم ترجمہ کا نظام جو React ایپس کو کمپوننٹس میں تبدیلی کیے بغیر کثیر لسانی بناتا ہے۔ رن ٹائم کی بجائے بلڈ کے دوران کام کرتا ہے۔

**انسٹالیشن:**

```bash
pnpm install @lingo.dev/compiler
```

**تصدیق:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**کنفیگریشن (Next.js):**

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

**کنفیگریشن (Vite):**

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

**پرووائیڈر سیٹ اپ:**

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

**زبان سوئچر:**

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

**ڈیولپمنٹ:** `npm run dev` (pseudotranslator استعمال کرتا ہے، کوئی API کالز نہیں)

**پروڈکشن:** `usePseudotranslator: false` سیٹ کریں، پھر `next build`

`.lingo/` ڈائریکٹری کو version control میں کمٹ کریں۔

**اہم خصوصیات:**

- رن ٹائم پرفارمنس کی صفر لاگت
- کوئی ترجمہ کیز یا JSON فائلیں نہیں
- کوئی `t()` فنکشنز یا `<T>` wrapper کمپوننٹس نہیں
- JSX میں قابل ترجمہ متن کی خودکار شناخت
- TypeScript سپورٹ
- جمع کے لیے ICU MessageFormat
- `data-lingo-override` attribute کے ذریعے دستی overrides
- بلٹ ان ترجمہ ایڈیٹر widget

**بلڈ موڈز:**

- `pseudotranslator`: placeholder ترجموں کے ساتھ ڈیولپمنٹ موڈ (کوئی API اخراجات نہیں)
- `real`: LLMs استعمال کرتے ہوئے حقیقی ترجمے تیار کریں
- `cache-only`: CI سے پہلے سے تیار شدہ ترجمے استعمال کرتے ہوئے پروڈکشن موڈ (کوئی API کالز نہیں)

**معاون فریم ورکس:**

- Next.js (React Server Components کے ساتھ App Router)
- Vite + React (SPA اور SSR)

اضافی فریم ورک سپورٹ کی منصوبہ بندی ہے۔

[دستاویزات پڑھیں ←](https://lingo.dev/en/compiler)

---

## تعاون

تعاون کا خیرمقدم ہے۔ براہ کرم ان رہنما خطوط پر عمل کریں:

1. **مسائل:** [bugs کی اطلاع دیں یا features کی درخواست کریں](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [تبدیلیاں جمع کروائیں](https://github.com/lingodotdev/lingo.dev/pulls)
   - ہر PR کے لیے changeset ضروری ہے: `pnpm new` (یا `pnpm new:empty` non-release تبدیلیوں کے لیے)
   - جمع کروانے سے پہلے یقینی بنائیں کہ tests پاس ہو جائیں
3. **Development:** یہ pnpm + turborepo monorepo ہے
   - dependencies انسٹال کریں: `pnpm install`
   - tests چلائیں: `pnpm test`
   - Build کریں: `pnpm build`

**سپورٹ:** [Discord کمیونٹی](https://lingo.dev/go/discord)

## Star History

اگر آپ کو Lingo.dev مفید لگے تو ہمیں star دیں اور 10,000 stars تک پہنچنے میں ہماری مدد کریں!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## مقامی دستاویزات

**دستیاب ترجمے:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**نئی زبان شامل کرنا:**

1. [`i18n.json`](./i18n.json) میں [BCP-47 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) استعمال کرتے ہوئے locale code شامل کریں
2. pull request جمع کروائیں

**BCP-47 locale format:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- مثالیں: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
