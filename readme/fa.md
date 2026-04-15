<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – پلتفرم مهندسی بومی‌سازی"
    />
  </a>
</p>

<p align="center">
  <strong>
    ابزارهای متن‌باز مهندسی بومی‌سازی. به پلتفرم مهندسی بومی‌سازی Lingo.dev متصل
    شوید تا ترجمه‌های باکیفیت و یکپارچه دریافت کنید.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (آلفای اولیه)</a>
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

| ابزار                                              | کاربرد                                                    | دستور سریع                         |
| -------------------------------------------------- | --------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | راه‌اندازی i18n با کمک هوش مصنوعی برای اپلیکیشن‌های React | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | بومی‌سازی فایل‌های JSON، YAML، markdown، CSV، PO          | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | بومی‌سازی مداوم در GitHub Actions                         | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | بومی‌سازی React در زمان ساخت بدون wrapper های i18n        | `withLingo()` plugin               |

### موتورهای بومی‌سازی

این ابزارها به [موتورهای بومی‌سازی](https://lingo.dev) متصل می‌شوند – APIهای ترجمه با حالت که روی پلتفرم مهندسی بومی‌سازی Lingo.dev ایجاد می‌کنید. هر موتور واژگان تخصصی، لحن برند و دستورالعمل‌های هر زبان را در تمام درخواست‌ها حفظ می‌کند و [خطاهای اصطلاحی را ۱۶.۶ تا ۴۴.۶ درصد کاهش می‌دهد](https://lingo.dev/research/retrieval-augmented-localization). یا [مدل زبانی خود را بیاورید](#lingodev-cli).

---

### Lingo.dev MCP

راه‌اندازی i18n در اپلیکیشن‌های React مستعد خطاست – حتی دستیارهای کدنویسی هوش مصنوعی APIهای غیرموجود را توهم می‌بینند و مسیریابی را خراب می‌کنند. Lingo.dev MCP به دستیارهای هوش مصنوعی دسترسی ساختاریافته به دانش i18n مختص فریم‌ورک برای Next.js، React Router و TanStack Start می‌دهد. با Claude Code، Cursor، GitHub Copilot Agents و Codex کار می‌کند.

[مستندات را بخوانید ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

فایل‌های JSON، YAML، markdown، CSV و PO را با یک دستور بومی‌سازی کنید. یک lockfile پیگیری می‌کند چه چیزی قبلاً بومی‌سازی شده – فقط محتوای جدید یا تغییریافته پردازش می‌شود. به‌طور پیش‌فرض از موتور بومی‌سازی شما روی Lingo.dev استفاده می‌کند، یا مدل زبانی خود را بیاورید (OpenAI، Anthropic، Google، Mistral، OpenRouter، Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[مستندات را بخوانید ←](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

بومی‌سازی مداوم در خط لوله شما. هر push بومی‌سازی را فعال می‌کند – رشته‌های گمشده قبل از رسیدن کد به محیط تولید تکمیل می‌شوند. از GitHub Actions، GitLab CI/CD و Bitbucket Pipelines پشتیبانی می‌کند.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[مستندات را بخوانید ←](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

موتور بومی‌سازی خود را مستقیماً از کد بک‌اند فراخوانی کنید. بومی‌سازی همزمان و ناهمزمان با تحویل webhook، جداسازی خطا برای هر locale و پیشرفت لحظه‌ای از طریق WebSocket.

[مستندات را بخوانید ←](https://lingo.dev/en/docs/api)

---

### کامپایلر Lingo برای React (آلفای اولیه)

بومی‌سازی React در زمان build بدون wrapper های i18n. کامپوننت‌ها را با متن انگلیسی ساده بنویسید – کامپایلر رشته‌های قابل ترجمه را شناسایی کرده و نسخه‌های بومی‌شده را در زمان build تولید می‌کند. بدون کلیدهای ترجمه، بدون فایل‌های JSON، بدون توابع `t()`. از Next.js (App Router) و Vite + React پشتیبانی می‌کند.

[مستندات را بخوانید ←](https://lingo.dev/en/docs/react/compiler)

---

## مشارکت

مشارکت‌ها پذیرفته می‌شوند. لطفاً این دستورالعمل‌ها را دنبال کنید:

1. **مسائل:** [گزارش باگ یا درخواست ویژگی](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Request ها:** [ارسال تغییرات](https://github.com/lingodotdev/lingo.dev/pulls)
   - هر PR نیاز به changeset دارد: `pnpm new` (یا `pnpm new:empty` برای تغییرات غیر-انتشار)
   - قبل از ارسال اطمینان حاصل کنید که تست‌ها موفق هستند
3. **توسعه:** این یک monorepo با pnpm + turborepo است
   - نصب وابستگی‌ها: `pnpm install`
   - اجرای تست‌ها: `pnpm test`
   - Build: `pnpm build`

**پشتیبانی:** [انجمن Discord](https://lingo.dev/go/discord)

## تاریخچه ستاره‌ها

اگر Lingo.dev را مفید می‌دانید، به ما ستاره بدهید و به ما کمک کنید به 10,000 ستاره برسیم!

[

![نمودار تاریخچه ستاره‌ها](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## مستندات محلی‌سازی شده

**ترجمه‌های موجود:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**افزودن زبان جدید:**

1. کد زبان را به [`i18n.json`](./i18n.json) با استفاده از [فرمت BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) اضافه کنید
2. درخواست pull را ارسال کنید
