<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – پلتفرم مهندسی بومی‌سازی" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev پلتفرم مهندسی بومی‌سازی است: بهترین راه برای سنجش کیفیت ترجمه، ترجمه با مدل‌های LLM، و بازبینی به‌دست گویشوران بومی.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">مستندات</a> •
  <a href="https://lingo.dev">پلتفرم</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="رتبهٔ ۱ Product Hunt در DevTool ماه" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="مجوز" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="آخرین commit" /></a>
</p>

---

## تیم‌ها روی Lingo.dev موتورهای بومی‌سازی می‌سازند

یک [موتور بومی‌سازی](https://lingo.dev/en/docs/platform/engines) یک API ترجمهٔ حالت‌مند است که تیم شما آن را پیکربندی می‌کند و Lingo.dev آن را اجرا می‌کند. می‌توانید برای هر محصول، هر نوع محتوا یا هر برند، یک موتور بسازید. هر درخواستی که از یک موتور عبور می‌کند، هر آنچه را در آن پیکربندی کرده‌اید، با ترتیب اولویت‌بندی ثابت اعمال می‌کند:

| لایه | چه چیزی را پیکربندی می‌کنید | نمونه‌ای از مستندات |
| --- | --- | --- |
| [مدل‌های LLM](https://lingo.dev/en/docs/platform/llm-models) | این‌که برای هر جفت‌زبان کدام مدل استفاده شود، همراه با جایگزین‌های پشتیبانِ رتبه‌بندی‌شده | بیش از ۴۰۰ مدل؛ پاسخ، نام مدلی را که اجرا شده اعلام می‌کند |
| [صدای برند](https://lingo.dev/en/docs/platform/brand-voices) | این‌که محصول شما در هر زبان چگونه حرف می‌زند، با یک متن برای هر زبان‌منطقه | لحن و میزان رسمیت برای هر بازار |
| [قواعد](https://lingo.dev/en/docs/platform/rules) | قراردادهای زبانی‌ای که یک مدل عمومی از قلم می‌اندازد | جایگاه صفت در اسپانیایی، فاصله قبل از علامت درصد |
| [واژه‌نامه](https://lingo.dev/en/docs/platform/glossaries) | معادل‌سازی دقیق اصطلاحات برای هر زبان‌منطقه، بر پایهٔ معنا | "911" برای بازارهای اروپایی به "112" تبدیل می‌شود؛ نام‌های محصول بدون تغییر عبور می‌کنند |
| [بازبین‌های هوش مصنوعی](https://lingo.dev/en/docs/platform/ai-reviewers) | امتیازدهی‌ای که بعد از هر ترجمه اجرا می‌شود | امتیازهای GEMBA، BERTScore، انطباق با واژه‌نامه |

واژه‌نامه‌ها، مجموعه‌قواعد و صداهای برند به سازمان شما تعلق دارند و هر موتور با اتصال آن‌ها ازشان استفاده می‌کند. یک واژه‌نامه می‌تواند بر پنج موتور حاکم باشد و یک ویرایش به هر پنج‌تا برسد. قبل از زنده شدن تغییر، آن را در [Playground](https://lingo.dev/en/docs/platform/playground) آزمایش کنید: یک موتور را با یک مدل خام مقایسه کنید، یا دو موتور را کنار هم بگذارید. موتورهای بومی‌سازی روی پلتفرم پیکربندی می‌شوند؛ جایی که تیم بومی‌سازی زیرساخت بومی‌سازی را اجرا می‌کند.

## از دل کد به موتورهای خود دسترسی پیدا کنید

محتوای یک مخزن را ترجمه کنید. `lingo push` فایل‌ها را به موتوری که در `.lingo/config.json` نام‌گذاری شده می‌فرستد و `lingo pull` ترجمه‌ها را از هر دستگاهی دوباره در فایل‌ها می‌نویسد:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا مستقیماً یک موتور را با شناسه‌اش فراخوانی کنید:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | عامل کدنویسی شما از همان گفت‌وگویی که مسئله در آن مطرح شده، یک موتور می‌سازد، اصطلاحات واژه‌نامه را اضافه می‌کند، قواعد را تنظیم می‌کند و دو موتور را با هم مقایسه می‌کند |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | فایل‌های مبدأ را push کنید و ترجمه‌ها را pull کنید؛ از ترمینال یا از CI. هجده قالب: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، رشته‌های Android و Xcode، SubRip، PHP |
| [Lingo.dev در CI/CD](https://lingo.dev/en/docs/workflows) | CLI را نصب کنید و `lingo push` را به‌عنوان یک مرحله در GitHub Actions، GitLab CI/CD، Bitbucket Pipelines یا هر اجراکننده‌ای با Node.js 22+ اجرا کنید |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | یک‌بار نصب کنید و هر push به شاخهٔ پیش‌فرض، یک pull request ترجمه باز می‌کند یا آن را به‌روزرسانی می‌کند؛ یا ترجمه‌ها به‌صورت یک commit در همان pull requestی می‌نشینند که مبدأ را تغییر داده است. بدون اجراکننده، بدون کلید محرمانهٔ API، و بدون Lockfile برای مدیریت |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | برای هر جفت‌زبان، یک فراخوانی همگام داشته باشید؛ یا یک کار ناهمگام که یک درخواست را به چندین زبان‌منطقه پخش می‌کند و نتیجه‌ها را به‌محض آماده شدن تحویل می‌دهد |

[اولین موتور بومی‌سازی خود را بسازید ←](https://lingo.dev)
