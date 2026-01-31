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
    Lingo.dev - جعبه‌ابزار i18n متن‌باز برای بومی‌سازی مبتنی بر LLM
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

## شروع سریع

| ابزار                              | مورد استفاده                                              | دستور سریع                         |
| ---------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | راه‌اندازی i18n با کمک هوش مصنوعی برای اپلیکیشن‌های React | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | ترجمه فایل‌های JSON، YAML، markdown، CSV، PO              | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | پایپلاین ترجمه خودکار در GitHub Actions                   | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ترجمه زمان اجرا برای محتوای پویا                          | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | بومی‌سازی React در زمان build بدون wrapper های i18n       | افزونه `withLingo()`               |

---

### Lingo.dev MCP

راه‌اندازی i18n در برنامه‌های React به‌طور شناخته‌شده‌ای مستعد خطا است - حتی برای توسعه‌دهندگان با تجربه. دستیاران کدنویسی AI وضعیت را بدتر می‌کنند: آن‌ها APIهای غیرموجود را توهم می‌بینند، پیکربندی‌های middleware را فراموش می‌کنند، مسیریابی را خراب می‌کنند، یا نیمی از راه‌حل را پیاده‌سازی می‌کنند و سپس گم می‌شوند. مشکل این است که راه‌اندازی i18n نیازمند یک توالی دقیق از تغییرات هماهنگ در چندین فایل (مسیریابی، middleware، کامپوننت‌ها، پیکربندی) است و LLMها در حفظ آن context دچار مشکل می‌شوند.

Lingo.dev MCP این مشکل را با دادن دسترسی ساختاریافته به دانش i18n خاص framework به دستیاران AI حل می‌کند. به‌جای حدس زدن، دستیار شما الگوهای پیاده‌سازی تأیید شده برای Next.js، React Router و TanStack Start را دنبال می‌کند.

**IDEهای پشتیبانی‌شده:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**frameworkهای پشتیبانی‌شده:**

- Next.js (App Router و Pages Router نسخه‌های 13-16)
- TanStack Start (نسخه 1)
- React Router (نسخه 7)

**استفاده:**

پس از پیکربندی سرور MCP در IDE خود ([راهنماهای شروع سریع را ببینید](https://lingo.dev/en/mcp))، به دستیار خود دستور دهید:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

دستیار این کارها را انجام می‌دهد:

1. پیکربندی مسیریابی مبتنی بر locale (مثلاً `/en`، `/es`، `/pt-BR`)
2. راه‌اندازی کامپوننت‌های تعویض زبان
3. پیاده‌سازی تشخیص خودکار locale
4. تولید فایل‌های پیکربندی لازم

**توجه:** تولید کد به کمک AI غیرقطعی است. کد تولید شده را قبل از commit بررسی کنید.

[مطالعه‌ی مستندات ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

همگام نگه‌داشتن ترجمه‌ها خسته‌کننده است. شما یک رشته‌ی جدید اضافه می‌کنید، فراموش می‌کنید آن را ترجمه کنید، UI خراب را برای کاربران بین‌المللی ارسال می‌کنید. یا فایل‌های JSON را برای مترجمان ارسال می‌کنید، چند روز منتظر می‌مانید، سپس کار آن‌ها را به‌صورت دستی ادغام می‌کنید. مقیاس‌بندی به بیش از 10 زبان به معنای مدیریت صدها فایل است که دائماً از همگام‌سازی خارج می‌شوند.

Lingo.dev CLI این فرآیند را خودکار می‌کند. آن را به فایل‌های ترجمه‌ی خود اشاره دهید، یک دستور اجرا کنید و هر locale به‌روزرسانی می‌شود. یک lockfile پیگیری می‌کند که چه چیزی قبلاً ترجمه شده است، بنابراین فقط برای محتوای جدید یا تغییر یافته هزینه می‌پردازید. از JSON، YAML، CSV، فایل‌های PO و markdown پشتیبانی می‌کند.

**راه‌اندازی:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**نحوه‌ی عملکرد:**

1. محتوای قابل ترجمه را از فایل‌های پیکربندی‌شده استخراج می‌کند
2. محتوا را برای ترجمه به ارائه‌دهنده‌ی LLM ارسال می‌کند
3. محتوای ترجمه‌شده را به filesystem بازمی‌نویسد
4. فایل `i18n.lock` را برای ردیابی ترجمه‌های تکمیل‌شده ایجاد می‌کند (از پردازش تکراری جلوگیری می‌کند)

**پیکربندی:**

دستور `init` یک فایل `i18n.json` تولید می‌کند. locale‌ها و bucket‌ها را پیکربندی کنید:

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

فیلد `provider` اختیاری است (به‌طور پیش‌فرض Lingo.dev Engine). برای ارائه‌دهندگان LLM سفارشی:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ارائه‌دهندگان LLM پشتیبانی‌شده:**

- Lingo.dev Engine (توصیه‌شده)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[مطالعه‌ی مستندات ←](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

ترجمه‌ها ویژگی‌ای هستند که همیشه «تقریباً تمام» شده‌اند. مهندسان کد را بدون به‌روزرسانی locale‌ها merge می‌کنند. QA ترجمه‌های گم‌شده را در staging می‌یابد - یا بدتر، کاربران آن‌ها را در production می‌یابند. علت اصلی: ترجمه یک مرحله‌ی دستی است که تحت فشار deadline به‌راحتی قابل نادیده‌گرفتن است.

Lingo.dev CI/CD ترجمه‌ها را خودکار می‌کند. هر push ترجمه را فعال می‌کند. رشته‌های گم‌شده قبل از رسیدن کد به production پر می‌شوند. نیازی به انضباط نیست - pipeline آن را مدیریت می‌کند.

**پلتفرم‌های پشتیبانی‌شده:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**راه‌اندازی GitHub Actions:**

فایل `.github/workflows/translate.yml` را ایجاد کنید:

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

**الزامات راه‌اندازی:**

1. `LINGODOTDEV_API_KEY` را به secret‌های repository اضافه کنید (Settings > Secrets and variables > Actions)
2. برای workflow‌های PR: گزینه‌ی "Allow GitHub Actions to create and approve pull requests" را در Settings > Actions > General فعال کنید

**گزینه‌های workflow:**

ترجمه‌ها را مستقیماً commit کنید:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

ایجاد pull request با ترجمه‌ها:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ورودی‌های موجود:**

| ورودی                | پیش‌فرض                                        | توضیحات                       |
| -------------------- | ---------------------------------------------- | ----------------------------- |
| `api-key`            | (الزامی)                                       | کلید API سرویس Lingo.dev      |
| `pull-request`       | `false`                                        | ایجاد PR به جای commit مستقیم |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | پیام commit سفارشی            |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | عنوان PR سفارشی               |
| `working-directory`  | `"."`                                          | دایرکتوری برای اجرا           |
| `parallel`           | `false`                                        | فعال‌سازی پردازش موازی        |

[مطالعه مستندات ←](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

فایل‌های ترجمه استاتیک برای برچسب‌های UI کار می‌کنند، اما محتوای تولید شده توسط کاربر چطور؟ پیام‌های چت، توضیحات محصول، تیکت‌های پشتیبانی - محتوایی که در زمان build وجود ندارد نمی‌تواند از پیش ترجمه شود. شما مجبورید متن ترجمه نشده را نمایش دهید یا یک pipeline ترجمه سفارشی بسازید.

SDK سرویس Lingo.dev محتوا را در زمان اجرا ترجمه می‌کند. هر متن، شیء یا HTML را ارسال کنید و نسخه محلی‌سازی شده را دریافت کنید. برای چت real-time، اعلان‌های پویا، یا هر محتوایی که پس از deployment می‌رسد کار می‌کند. برای JavaScript، PHP، Python و Ruby در دسترس است.

**نصب:**

```bash
npm install lingo.dev
```

**استفاده:**

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

**SDK های موجود:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - اپلیکیشن‌های وب، Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP، Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django، Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[مطالعه مستندات ←](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

i18n سنتی مزاحم است. شما هر رشته را در توابع `t()` می‌پیچید، کلیدهای ترجمه اختراع می‌کنید (`home.hero.title.v2`)، فایل‌های JSON موازی نگهداری می‌کنید، و شاهد متورم شدن کامپوننت‌های خود با boilerplate محلی‌سازی هستید. آنقدر خسته‌کننده است که تیم‌ها بین‌المللی‌سازی را به تعویق می‌اندازند تا زمانی که به یک refactor عظیم تبدیل شود.

کامپایلر Lingo.dev تشریفات را حذف می‌کند. کامپوننت‌های React را با متن ساده انگلیسی بنویسید. کامپایلر رشته‌های قابل ترجمه را در زمان build شناسایی کرده و نسخه‌های محلی‌سازی شده را به صورت خودکار تولید می‌کند. بدون کلید، بدون فایل JSON، بدون تابع wrapper - فقط کد React که اتفاقاً به چندین زبان کار می‌کند.

**نصب:**

```bash
pnpm install @lingo.dev/compiler
```

**احراز هویت:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**پیکربندی (Next.js):**

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

**پیکربندی (Vite):**

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

**راه‌اندازی provider:**

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

**تعویض‌کننده‌ی زبان:**

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

**توسعه:** `npm run dev` (از pseudotranslator استفاده می‌کند، بدون فراخوانی API)

**تولید:** `usePseudotranslator: false` را تنظیم کنید، سپس `next build`

دایرکتوری `.lingo/` را در version control ثبت کنید.

**ویژگی‌های کلیدی:**

- بدون هزینه‌ی عملکرد runtime
- بدون کلید ترجمه یا فایل JSON
- بدون تابع `t()` یا کامپوننت wrapper `<T>`
- شناسایی خودکار متن قابل ترجمه در JSX
- پشتیبانی از TypeScript
- ICU MessageFormat برای جمع‌ها
- بازنویسی دستی از طریق attribute `data-lingo-override`
- ویجت ویرایشگر ترجمه‌ی داخلی

**حالت‌های build:**

- `pseudotranslator`: حالت توسعه با ترجمه‌های placeholder (بدون هزینه‌ی API)
- `real`: تولید ترجمه‌های واقعی با استفاده از LLM ها
- `cache-only`: حالت تولید با استفاده از ترجمه‌های از پیش تولید شده از CI (بدون فراخوانی API)

**فریم‌ورک‌های پشتیبانی شده:**

- Next.js (App Router با React Server Components)
- Vite + React (SPA و SSR)

پشتیبانی از فریم‌ورک‌های اضافی برنامه‌ریزی شده است.

[مطالعه‌ی مستندات ←](https://lingo.dev/en/compiler)

---

## مشارکت

مشارکت‌ها خوش‌آمد هستند. لطفاً این دستورالعمل‌ها را دنبال کنید:

1. **مسائل:** [گزارش باگ یا درخواست ویژگی](https://github.com/lingodotdev/lingo.dev/issues)
2. **درخواست‌های Pull:** [ارسال تغییرات](https://github.com/lingodotdev/lingo.dev/pulls)
   - هر PR نیاز به یک changeset دارد: `pnpm new` (یا `pnpm new:empty` برای تغییرات بدون انتشار)
   - قبل از ارسال اطمینان حاصل کنید که تست‌ها موفق هستند
3. **توسعه:** این یک monorepo با pnpm + turborepo است
   - نصب وابستگی‌ها: `pnpm install`
   - اجرای تست‌ها: `pnpm test`
   - ساخت: `pnpm build`

**پشتیبانی:** [انجمن Discord](https://lingo.dev/go/discord)

## تاریخچه ستاره

اگر Lingo.dev را مفید می‌دانید، به ما ستاره بدهید و به ما کمک کنید به 10,000 ستاره برسیم!

[

![نمودار تاریخچه ستاره](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## مستندات محلی‌سازی شده

**ترجمه‌های موجود:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**افزودن زبان جدید:**

1. کد locale را به [`i18n.json`](./i18n.json) با استفاده از [فرمت BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) اضافه کنید
2. یک درخواست pull ارسال کنید

**فرمت locale BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (حروف کوچک): `en`، `zh`، `bho`
- `Script`: ISO 15924 (حروف بزرگ در ابتدا): `Hans`، `Hant`، `Latn`
- `REGION`: ISO 3166-1 alpha-2 (حروف بزرگ): `US`، `CN`، `IN`
- مثال‌ها: `en`، `pt-BR`، `zh-Hans`، `sr-Cyrl-RS`
