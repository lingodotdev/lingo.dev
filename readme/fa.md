<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="لینگو.دو"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ لینگو.دو - ابزار متن‌باز، هوشمند با هوش مصنوعی برای بین‌المللی‌سازی و
    بومی‌سازی فوری با مدل‌های زبانی بزرگ.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">کامپایلر Lingo.dev</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="انتشار"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="مجوز"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="آخرین کامیت"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="رتبه ۱ ابزار توسعه ماه در پروداکت هانت"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="رتبه ۱ محصول هفته در پروداکت هانت"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="رتبه ۲ محصول روز در پروداکت هانت"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="ترند گیت‌هاب"
    />
  </a>
</p>

---

## با کامپایلر آشنا شوید 🆕

**کامپایلر لینگو.دو** یک میان‌افزار کامپایلر رایگان و متن‌باز است که برای چندزبانه کردن هر برنامه ری‌اکت در زمان ساخت طراحی شده است، بدون نیاز به تغییر در کامپوننت‌های ری‌اکت موجود.

یک بار نصب کنید:

```bash
npm install @lingo.dev/compiler
```

در پیکربندی ساخت خود فعال کنید:

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

دستور `next build` را اجرا کنید و ببینید که بسته‌های اسپانیایی و فرانسوی ظاهر می‌شوند ✨

برای راهنمای کامل [مستندات را بخوانید →](https://lingo.dev/compiler) و برای دریافت کمک در راه‌اندازی به [دیسکورد ما بپیوندید](https://lingo.dev/go/discord).

---

### در این مخزن چه چیزی وجود دارد؟

| ابزار                   | خلاصه                                                                          | مستندات                                 |
| ----------------------- | ------------------------------------------------------------------------------ | --------------------------------------- |
| **کامپایلر**            | بومی‌سازی ری‌اکت در زمان ساخت                                                  | [/compiler](https://lingo.dev/compiler) |
| **رابط خط فرمان**       | بومی‌سازی تک‌دستوری برای برنامه‌های وب و موبایل، JSON، YAML، مارک‌داون و بیشتر | [/cli](https://lingo.dev/cli)           |
| **CI/CD**               | کامیت خودکار ترجمه‌ها در هر پوش و ایجاد درخواست‌های پول در صورت نیاز           | [/ci](https://lingo.dev/ci)             |
| **کیت توسعه نرم‌افزار** | ترجمه بلادرنگ برای محتوای تولید شده توسط کاربر                                 | [/sdk](https://lingo.dev/sdk)           |

در زیر خلاصه‌ای از هر کدام آمده است 👇

---

### ⚡️ Lingo.dev CLI

کد و محتوا را مستقیماً از ترمینال خود ترجمه کنید.

```bash
npx lingo.dev@latest run
```

هر رشته را اثرانگشت‌گذاری می‌کند، نتایج را ذخیره می‌کند و فقط آنچه را که تغییر کرده است دوباره ترجمه می‌کند.

[مستندات را دنبال کنید →](https://lingo.dev/cli) تا نحوه راه‌اندازی آن را یاد بگیرید.

---

### 🔄 Lingo.dev CI/CD

ترجمه‌های کامل را به صورت خودکار ارائه دهید.

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

مخزن شما را سبز و محصول شما را چندزبانه نگه می‌دارد بدون نیاز به مراحل دستی.

[مستندات را بخوانید →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ترجمه فوری برای هر درخواست برای محتوای پویا.

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

ایده‌آل برای چت، نظرات کاربران و سایر جریان‌های بلادرنگ.

[مستندات را بخوانید →](https://lingo.dev/sdk)

---

## 🤝 جامعه

ما جامعه‌محور هستیم و مشارکت‌ها را دوست داریم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما یک ⭐ بدهید و به ما کمک کنید به 6000 ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Bhojpuri](/readme/bho.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!
