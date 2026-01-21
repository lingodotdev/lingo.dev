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
    ⚡ Lingo.dev - ابزار i18n متن‌باز و مبتنی بر هوش مصنوعی برای بومی‌سازی فوری
    با LLM‌ها.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">کامپایلر Lingo.dev</a> •
  <a href="https://lingo.dev/mcp">MCP Lingo.dev</a> •
  <a href="https://lingo.dev/cli">CLI Lingo.dev</a> •
  <a href="https://lingo.dev/ci">CI/CD Lingo.dev</a> •
  <a href="https://lingo.dev/sdk">SDK Lingo.dev</a>
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

## با کامپایلر آشنا شوید 🆕

**کامپایلر Lingo.dev** یک میان‌افزار کامپایلر رایگان و متن‌باز است که برای چندزبانه کردن هر برنامه React در زمان ساخت، بدون نیاز به تغییر در کامپوننت‌های موجود React طراحی شده است.

یک‌بار نصب کنید:

```bash
npm install @lingo.dev/compiler
```

در تنظیمات ساخت خود فعال کنید:

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

دستور `next build` را اجرا کنید و بسته‌های اسپانیایی و فرانسوی را ببینید که ظاهر می‌شوند ✨

[مستندات را بخوانید →](https://lingo.dev/compiler) برای راهنمای کامل، و [به Discord ما بپیوندید](https://lingo.dev/go/discord) تا در راه‌اندازی کمک بگیرید.

---

### داخل این مخزن چه چیزی است؟

| ابزار        | خلاصه                                                                           | مستندات                                 |
| ------------ | ------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | بومی‌سازی React در زمان ساخت                                                    | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | بومی‌سازی با یک دستور برای برنامه‌های وب و موبایل، JSON، YAML، markdown و بیشتر | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | کامیت خودکار ترجمه‌ها در هر push و ایجاد pull request در صورت نیاز              | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ترجمه لحظه‌ای برای محتوای تولید شده توسط کاربر                                  | [/sdk](https://lingo.dev/sdk)           |

در زیر نکات کلیدی برای هر کدام آمده است 👇

---

### ⚡️ رابط خط فرمان Lingo.dev

کد و محتوا را مستقیماً از ترمینال خود ترجمه کنید.

```bash
npx lingo.dev@latest run
```

این ابزار اثر انگشت هر رشته را ثبت می‌کند، نتایج را کش می‌کند و فقط آنچه را که تغییر کرده دوباره ترجمه می‌کند.

برای یادگیری نحوه راه‌اندازی [مستندات را دنبال کنید →](https://lingo.dev/cli).

---

### 🔄 یکپارچه‌سازی مداوم Lingo.dev

ترجمه‌های بی‌نقص را به‌طور خودکار ارسال کنید.

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

مخزن شما را سبز و محصولتان را چندزبانه نگه می‌دارد بدون نیاز به مراحل دستی.

[مستندات را بخوانید →](https://lingo.dev/ci)

---

### 🧩 کیت توسعه Lingo.dev

ترجمه آنی برای هر درخواست برای محتوای پویا.

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

مناسب برای چت، نظرات کاربران و سایر جریان‌های بلادرنگ.

[مستندات را بخوانید →](https://lingo.dev/sdk)

---

## 🤝 انجمن

ما جامعه‌محور هستیم و مشارکت‌ها را دوست داریم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک درخواست ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر کاری که انجام می‌دهیم را دوست دارید، به ما یک ستاره ⭐ بدهید و به ما کمک کنید به 6000 ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 راهنما به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

زبان خود را نمی‌بینید؟ آن را به `i18n.json` اضافه کنید و یک PR باز کنید!

**قالب محلی:** از کدهای [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) استفاده کنید: `language[-Script][-REGION]`

- زبان: ISO 639-1/2/3 حروف کوچک (`en`، `zh`، `bho`)
- خط: ISO 15924 حروف بزرگ و کوچک (`Hans`، `Hant`، `Latn`)
- منطقه: ISO 3166-1 alpha-2 حروف بزرگ (`US`، `CN`، `IN`)
- نمونه‌ها: `en`، `pt-BR`، `zh-Hans`، `sr-Cyrl-RS`
