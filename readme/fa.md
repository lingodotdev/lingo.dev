<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.launch.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ابزار CLI اوپن سورس با قدرت هوش مصنوعی برای بومی‌سازی اپلیکیشن‌های وب و موبایل.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">مستندات</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">مشارکت</a> •
  <a href="#-github-action">اکشن GitHub</a> •
  <a href="#">ستاره‌دار کردن مخزن</a>
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

<br />

Lingo.dev یک CLI متن‌باز و مبتنی بر جامعه است که برای بومی‌سازی (ترجمه) اپلیکیشن‌های وب و موبایل با قدرت هوش مصنوعی ایجاد شده است.

این ابزار برای تولید فوری ترجمه‌های معتبر طراحی شده که نیاز به کار دستی و مدیریت را حذف می‌کند. در نتیجه، تیم‌ها می‌توانند بومی‌سازی دقیق را تا ۱۰۰ برابر سریع‌تر انجام دهند و ویژگی‌ها را به کاربران بیشتری در سراسر جهان عرضه کنند. از آن می‌توانید با مدل زبانی شخصی خود یا موتور بومی‌سازی مدیریت‌شده توسط Lingo.dev استفاده کنید.

> **نکته کمتر شناخته‌شده:** Lingo.dev ابتدا در سال ۲۰۲۳ به عنوان یک پروژه کوچک در هکاتون دانشجویی شروع شد! بعد از چندین تغییر، در سال ۲۰۲۴ به Y Combinator راه یافتیم و اکنون در حال جذب نیرو هستیم! به ساخت ابزارهای نسل بعدی بومی‌سازی علاقه دارید؟ رزومه خود را به careers@lingo.dev ارسال کنید! 🚀

## 📑 در این راهنما

- [شروع سریع](#-شروع-سریع) - آغاز در چند دقیقه
- [کشینگ](#-کشینگ-با-i18nlock) - بهینه‌سازی ترجمه‌ها
- [اکشن GitHub](#-اکشن-github) - خودکارسازی در CI/CD
- [ویژگی‌ها](#-ویژگی‌ها) - قدرت Lingo.dev
- [مستندات](#-مستندات) - راهنماها و منابع دقیق
- [مشارکت](#-مشارکت) - به جامعه ما بپیوندید

## 💫 شروع سریع

Lingo.dev CLI برای کار هم با مدل زبانی شخصی شما و هم موتور بومی‌سازی مدیریت‌شده Lingo.dev که بر پایه آخرین مدل‌های هوش مصنوعی (SOTA) است، طراحی شده است.

### استفاده از مدل زبانی خودتان (BYOK)

1. فایل `i18n.json` را بسازید:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "شما در حال ترجمه متن از {source} به {target} هستید."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. کلید API را تنظیم کنید:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# یا برای OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. دستور اجرا:

```bash
npx lingo.dev@latest i18n
```

### استفاده از Lingo.dev Cloud

اغلب اپلیکیشن‌های تجاری نیاز به ویژگی‌هایی مانند حافظه ترجمه، پشتیبانی واژه‌نامه و تضمین کیفیت بومی‌سازی دارند. Lingo.dev این امکانات را ارائه می‌دهد:

1. ایجاد فایل `i18n.json` (بدون provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. احراز هویت:

```bash
npx lingo.dev@latest auth --login
```

3. اجرای بومی‌سازی:

```bash
npx lingo.dev@latest i18n
```

- [انگلیسی](https://github.com/lingodotdev/lingo.dev)
- [چینی](/readme/zh-Hans.md)
- [ژاپنی](/readme/ja.md)
- [کره‌ای](/readme/ko.md)
- [اسپانیایی](/readme/es.md)
- [فرانسوی](/readme/fr.md)
- [روسی](/readme/ru.md)
- [آلمانی](/readme/de.md)
- [ایتالیایی](/readme/it.md)
- [عربی](/readme/ar.md)
- [هندی](/readme/hi.md)
- [بنگالی](/readme/bn.md)
- [فارسی](/readme/fa.md)

زبان خود را نمی‌بینید؟ کافیست یک کد زبان جدید به فایل [`i18n.json`](./i18n.json) اضافه کنید و یک PR باز کنید!
