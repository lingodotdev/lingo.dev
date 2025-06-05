<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="لینگو.دو" />
  </a>
</p>

<p align="center">
  <strong>⚡️ مجموعه ابزار i18n متن‌باز و مبتنی بر هوش مصنوعی برای بومی‌سازی آنی با LLM‌ها.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">کامپایلر لینگو.دو</a> •
  <a href="https://lingo.dev/cli">CLI لینگو.دو</a> •
  <a href="https://lingo.dev/ci">CI/CD لینگو.دو</a> •
  <a href="https://lingo.dev/sdk">SDK لینگو.دو</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="انتشار" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="مجوز" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="آخرین کامیت" />
  </a>
</p>

---

## با کامپایلر آشنا شوید 🆕

**کامپایلر لینگو.دو** یک میان‌افزار کامپایلر رایگان و متن‌باز است که برای چندزبانه کردن هر برنامه React در زمان ساخت طراحی شده، بدون نیاز به تغییر در کامپوننت‌های موجود React.

```bash
# install once
npm install lingo.dev

# next.config.js
import lingoCompiler from "lingo.dev/compiler";

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
});
```

دستور `next build` را اجرا کنید و ببینید که باندل‌های اسپانیایی و فرانسوی ظاهر می‌شوند ✨

[مستندات را بخوانید →](https://lingo.dev/compiler) برای راهنمای کامل.

---

### این مخزن شامل چیست؟

| ابزار         | خلاصه                                                                          | مستندات                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **کامپایلر** | بومی‌سازی React در زمان ساخت                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | بومی‌سازی تک‌دستوری برای برنامه‌های وب و موبایل، JSON، YAML، مارک‌داون و بیشتر | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | کامیت خودکار ترجمه‌ها در هر پوش و ایجاد درخواست‌های پول در صورت نیاز        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ترجمه بلادرنگ برای محتوای تولید شده توسط کاربر                                | [/sdk](https://lingo.dev/sdk)           |

در ادامه، نکات کلیدی هر کدام آمده است 👇

---

### ⚡️ CLI لینگو.دو

کد و محتوا را مستقیماً از ترمینال خود ترجمه کنید.

```bash
npx lingo.dev@latest i18n
```

هر رشته را اثرانگشت‌گذاری می‌کند، نتایج را کش می‌کند و فقط مواردی را که تغییر کرده‌اند مجدداً ترجمه می‌کند.

[مستندات را بخوانید →](https://lingo.dev/cli)

---

### 🔄 CI/CD لینگو.دو

ترجمه‌های بی‌نقص را به صورت خودکار منتشر کنید.

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

[مستندات را بخوانید ←](https://lingo.dev/ci)

---

### 🧩 کیت توسعه نرم‌افزار Lingo.dev

ترجمه آنی برای هر درخواست برای محتوای پویا.

```ts
import { translate } from "lingo.dev/sdk";

const text = await translate("Hello world", { to: "es" });
// → "¡Hola mundo!"
```

ایده‌آل برای چت، نظرات کاربران و سایر جریان‌های بلادرنگ.

[مستندات را بخوانید ←](https://lingo.dev/sdk)

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!

---

## 🤝 انجمن

ما جامعه‌محور هستیم و از مشارکت‌ها استقبال می‌کنیم!

- ایده‌ای دارید؟ [یک مسئله باز کنید](https://github.com/lingodotdev/lingo.dev/issues)
- می‌خواهید چیزی را اصلاح کنید؟ [یک PR ارسال کنید](https://github.com/lingodotdev/lingo.dev/pulls)
- به کمک نیاز دارید؟ [به دیسکورد ما بپیوندید](https://lingo.dev/go/discord)

## ⭐ تاریخچه ستاره‌ها

اگر از کاری که انجام می‌دهیم خوشتان می‌آید، به ما ⭐ بدهید و کمک کنید به ۳,۰۰۰ ستاره برسیم! 🌟

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 فایل readme به زبان‌های دیگر

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ آن را به [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!
