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
    Lingo.dev پلتفرم مهندسی محلی‌سازی است: بهترین راه برای سنجش کیفیت ترجمه،
    ترجمه با مدل‌های زبانی بزرگ، و ویرایش با گویشوران بومی.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">مستندات</a> •
  <a href="https://lingo.dev">پلتفرم</a> •
  <a href="https://lingo.dev/go/discord">دیسکورد</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="ابزار توسعه شماره ۱ ماه در Product Hunt"
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
</p>

---

## تیم‌ها موتورهای محلی‌سازی را روی Lingo.dev می‌سازند

[موتور محلی‌سازی](https://lingo.dev/en/docs/platform/engines) یک API ترجمه حالت‌دار است که تیم شما پیکربندی می‌کند و Lingo.dev آن را اجرا می‌کند. یک موتور برای هر محصول، هر نوع محتوا، یا هر برند بسازید. هر درخواست از طریق یک موتور، همه چیزهایی را که در آن پیکربندی کرده‌اید، با ترتیب اولویت ثابت اعمال می‌کند:

| لایه                                                                   | آنچه شما پیکربندی می‌کنید                                           | از مستندات                                                                         |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [مدل‌های LLM](https://lingo.dev/en/docs/platform/llm-models)           | کدام مدل هر جفت زبان را مدیریت می‌کند، با پشتیبان‌های رتبه‌بندی‌شده | ۴۰۰+ مدل؛ پاسخ نام مدلی را که اجرا شده نشان می‌دهد                                 |
| [لحن برند](https://lingo.dev/en/docs/platform/brand-voices)            | چگونه محصول شما در هر زبان صحبت می‌کند، یک متن برای هر محل          | لحن و رسمیت بودن برای هر بازار                                                     |
| [قوانین](https://lingo.dev/en/docs/platform/rules)                     | قراردادهای زبانی که یک مدل عمومی از دست می‌دهد                      | موقعیت صفت در اسپانیایی، فاصله قبل از علامت درصد                                   |
| [واژه‌نامه](https://lingo.dev/en/docs/platform/glossaries)             | نگاشت دقیق اصطلاحات برای هر محل، تطبیق بر اساس معنا                 | "۹۱۱" برای بازارهای اروپایی به "۱۱۲" تبدیل می‌شود؛ نام محصولات بدون تغییر می‌مانند |
| [بازبینان هوش مصنوعی](https://lingo.dev/en/docs/platform/ai-reviewers) | امتیازدهی که بعد از هر ترجمه اجرا می‌شود                            | امتیازهای GEMBA، BERTScore، انطباق با واژه‌نامه                                    |

واژه‌نامه‌ها، مجموعه قوانین، و لحن‌های برند متعلق به سازمان شما هستند و یک موتور آن‌ها را از طریق پیوست اعمال می‌کند. یک واژه‌نامه پنج موتور را کنترل می‌کند و یک ویرایش به هر پنج می‌رسد. قبل از اینکه تغییری زنده شود آن را در [Playground](https://lingo.dev/en/docs/platform/playground) آزمایش کنید: یک موتور را در برابر یک مدل خام مقایسه کنید، یا دو موتور را در کنار هم. موتورها روی پلتفرم پیکربندی می‌شوند، جایی که تیم محلی‌سازی زیرساخت محلی‌سازی را اجرا می‌کند.

## به موتورهای خود از کد دسترسی پیدا کنید

محتوای یک مخزن را ترجمه کنید. `lingo push` فایل‌ها را به موتور نام‌گذاری شده در `.lingo/config.json` ارسال می‌کند و `lingo pull` ترجمه‌ها را از هر دستگاهی بازمی‌نویسد:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا مستقیماً یک موتور را با نام‌گذاری آن از طریق شناسه فراخوانی کنید:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                                |                                                                                                                                                                                |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                                 | عامل کدنویسی شما یک موتور ایجاد می‌کند، اصطلاحات واژه‌نامه اضافه می‌کند، قوانین را تنظیم می‌کند و دو موتور را مقایسه می‌کند، همه در همان مکالمه‌ای که مسئله مطرح شده است       |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                                 | فایل‌های منبع را ارسال کنید، ترجمه‌ها را دریافت کنید، از ترمینال یا از CI. هجده فرمت: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، رشته‌های Android و Xcode، SubRip، PHP |
| [Lingo.dev در CI/CD](https://lingo.dev/en/docs/workflows)                      | CLI را نصب کنید و `lingo push` را به عنوان یک مرحله در GitHub Actions، GitLab CI/CD، Bitbucket Pipelines یا هر رانری با Node.js 22+ اجرا کنید                                  |
| [اپلیکیشن GitHub از Lingo.dev](https://lingo.dev/en/docs/workflows/github-app) | یک‌بار نصب کنید و هر push به شاخه پیش‌فرض یک درخواست pull ترجمه باز یا به‌روزرسانی می‌کند. بدون راننده، بدون کلید مخفی API، بدون فایل قفل برای مدیریت                          |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                                 | یک فراخوانی همزمان برای هر جفت زبان، یا یک job ناهمزمان که یک درخواست را به چندین زبان پخش می‌کند و نتایج را به محض دریافت تحویل می‌دهد                                        |

[اولین موتور بومی‌سازی خود را بسازید ←](https://lingo.dev)
