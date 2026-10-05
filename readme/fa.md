<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## تیم‌ها موتورهای بومی‌سازی‌شان را روی Lingo.dev می‌سازند

یک [موتور بومی‌سازی](https://lingo.dev/en/docs/platform/engines) یک API ترجمهٔ حالت‌مند است که تیم شما آن را پیکربندی می‌کند و Lingo.dev اجرايش می‌کند. می‌توانید برای هر محصول، هر نوع محتوا یا هر برند، یک موتور جدا بسازید. هر درخواستی که از یک موتور عبور می‌کند، همهٔ تنظیماتی را که داخل آن تعریف کرده‌اید، با یک ترتیب اولویت ثابت اعمال می‌کند:

| لایه | چه چیزی را پیکربندی می‌کنید | نمونه‌ای از مستندات |
| --- | --- | --- |
| [مدل‌های LLM](https://lingo.dev/en/docs/platform/llm-models) | این‌که برای هر جفت‌زبان کدام مدل استفاده شود، با گزینه‌های جایگزینِ اولویت‌بندی‌شده | بیش از ۴۰۰ مدل؛ پاسخ، نام مدلی را که اجرا شده نشان می‌دهد |
| [لحن برند](https://lingo.dev/en/docs/platform/brand-voices) | این‌که محصول شما در هر زبان چطور حرف می‌زند، با یک متن برای هر locale | لحن و میزان رسمیت برای هر بازار |
| [قواعد](https://lingo.dev/en/docs/platform/rules) | قراردادهای زبانی‌ای که مدل‌های عمومی معمولاً از قلم می‌اندازند | جایگاه صفت در زبان اسپانیایی، فاصله قبل از علامت درصد |
| [واژه‌نامه](https://lingo.dev/en/docs/platform/glossaries) | معادل‌های دقیق اصطلاحات برای هر locale، با تطبیق بر اساس معنا | "911" برای بازارهای اروپایی به "112" تبدیل می‌شود؛ نام محصولات بدون تغییر عبور می‌کنند |
| [بازبین‌های AI](https://lingo.dev/en/docs/platform/ai-reviewers) | امتیازدهی‌ای که بعد از هر ترجمه اجرا می‌شود | امتیازهای GEMBA، BERTScore، انطباق با واژه‌نامه |

واژه‌نامه‌ها، مجموعه‌قواعد و لحن‌های برند به سازمان شما تعلق دارند و موتور آن‌ها را از طریق الحاق اعمال می‌کند. یک واژه‌نامه می‌تواند پنج موتور را پوشش دهد و با یک ویرایش، هر پنج موتور به‌روزرسانی می‌شوند. قبل از انتشار، تغییر را در [Playground](https://lingo.dev/en/docs/platform/playground) آزمایش کنید: یک موتور را با یک مدل خام مقایسه کنید یا دو موتور را کنار هم بگذارید. موتورهای بومی‌سازی روی پلتفرم پیکربندی می‌شوند؛ همان‌جایی که تیم بومی‌سازی زیرساخت بومی‌سازی را اجرا می‌کند.

## از داخل کد به موتورهای خود دسترسی پیدا کنید

محتوای یک repository را ترجمه کنید. `lingo push` فایل‌ها را به موتوری می‌فرستد که در `.lingo/config.json` نام‌گذاری شده، و `lingo pull` ترجمه‌ها را از هر ماشینی برمی‌گرداند:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا یک موتور را مستقیماً و با شناسهٔ آن فراخوانی کنید:

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

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ایجنت کدنویسی شما از همان گفت‌وگویی که مسئله در آن مطرح شده، یک موتور می‌سازد، اصطلاحات واژه‌نامه را اضافه می‌کند، قواعد را تنظیم می‌کند و دو موتور را با هم مقایسه می‌کند |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | فایل‌های مبدأ را push کنید و ترجمه‌ها را pull کنید؛ از ترمینال یا از CI. هجده قالب: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، رشته‌های Android و Xcode، SubRip، PHP |
| [Lingo.dev در CI/CD](https://lingo.dev/en/docs/workflows) | CLI را نصب کنید و `lingo push` را به‌عنوان یک مرحله در GitHub Actions، GitLab CI/CD، Bitbucket Pipelines یا هر runner مجهز به Node.js 22+ اجرا کنید |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | یک بار نصب کنید و با هر push به شاخهٔ پیش‌فرض، یک pull request ترجمه باز یا به‌روزرسانی می‌شود؛ یا ترجمه‌ها به‌صورت یک commit داخل همان pull requestی ثبت می‌شوند که مبدأ را تغییر داده است. بدون runner، بدون secret برای کلید API، و بدون Lockfile برای مدیریت |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | برای هر جفت‌زبان، یک فراخوانی همگام داشته باشید؛ یا یک job ناهمگام که یک درخواست را به چندین locale پخش می‌کند و نتیجه‌ها را به‌محض آماده‌شدن تحویل می‌دهد |

[اولین موتور بومی‌سازی خود را بسازید ←](https://lingo.dev)
