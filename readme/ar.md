<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – منصة هندسة الترجمة"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev هي منصة هندسة التعريب: أفضل طريقة لقياس جودة الترجمة، والترجمة
    باستخدام نماذج اللغة الكبيرة، والمراجعة مع متحدثين أصليين.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">المستندات</a> •
  <a href="https://lingo.dev">المنصة</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="أداة التطوير رقم 1 للشهر على Product Hunt"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="الترخيص"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="آخر تحديث"
    />
  </a>
</p>

---

## الفرق تبني محركات التعريب على Lingo.dev

[محرك التعريب](https://lingo.dev/en/docs/platform/engines) هو واجهة برمجة تطبيقات ترجمة ذات حالة يقوم فريقك بتكوينها وتديرها Lingo.dev. ابنِ واحداً لكل منتج، أو لكل نوع محتوى، أو لكل علامة تجارية. كل طلب عبر المحرك يطبق كل ما قمت بتكوينه فيه، بترتيب أولوية ثابت:

| الطبقة                                                                  | ما تقوم بتكوينه                                         | من المستندات                                                  |
| ----------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| [نماذج اللغة الكبيرة](https://lingo.dev/en/docs/platform/llm-models)    | أي نموذج يتعامل مع كل زوج لغوي، مع بدائل مرتبة          | أكثر من 400 نموذج؛ الاستجابة تحدد النموذج الذي تم تشغيله      |
| [صوت العلامة التجارية](https://lingo.dev/en/docs/platform/brand-voices) | كيف يتحدث منتجك في كل لغة، نص واحد لكل لغة محلية        | النبرة والرسمية لكل سوق                                       |
| [القواعد](https://lingo.dev/en/docs/platform/rules)                     | الأعراف اللغوية التي يفتقدها النموذج العام              | موضع الصفة في الإسبانية، مسافة قبل علامات النسبة المئوية      |
| [المسرد](https://lingo.dev/en/docs/platform/glossaries)                 | مطابقات دقيقة للمصطلحات لكل لغة محلية، تطابق حسب المعنى | "911" تصبح "112" للأسواق الأوروبية؛ أسماء المنتجات تمر كما هي |
| [المراجعون الذكيون](https://lingo.dev/en/docs/platform/ai-reviewers)    | التقييم الذي يعمل بعد كل ترجمة                          | درجات GEMBA، وBERTScore، والالتزام بالمسرد                    |

المسارد ومجموعات القواعد وأصوات العلامة التجارية تنتمي إلى مؤسستك، ويطبقها المحرك عن طريق الإرفاق. مسرد واحد يحكم خمسة محركات، وتعديل واحد يصل إلى الخمسة جميعاً. اختبر التغيير في [ساحة التجريب](https://lingo.dev/en/docs/platform/playground) قبل أن يصبح مباشراً: قارن محركاً مع نموذج خام، أو محركين جنباً إلى جنب. المحركات مكونة على المنصة، حيث يدير فريق التعريب البنية التحتية للتعريب.

## الوصول إلى محركاتك من الكود

ترجمة المحتوى في مستودع. `lingo push` يرسل الملفات إلى المحرك المحدد في `.lingo/config.json`، و `lingo pull` يكتب الترجمات من أي جهاز:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

أو قم باستدعاء محرك مباشرة بتحديد معرّفه:

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

|                                                                              |                                                                                                                                                                 |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                               | يقوم وكيل البرمجة الخاص بك بإنشاء محرك، وإضافة مصطلحات المسرد، وضبط القواعد، ومقارنة محركين، من المحادثة التي ظهرت فيها المشكلة                                 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                               | دفع الملفات المصدر، سحب الترجمات، من الطرفية أو من CI. ثمانية عشر تنسيقًا: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، سلاسل Android وXcode، SubRip، PHP |
| [Lingo.dev في CI/CD](https://lingo.dev/en/docs/workflows)                    | قم بتثبيت CLI وتشغيل `lingo push` كخطوة في GitHub Actions، أو GitLab CI/CD، أو Bitbucket Pipelines، أو أي مشغل مع Node.js 22+                                   |
| [تطبيق Lingo.dev على GitHub](https://lingo.dev/en/docs/workflows/github-app) | قم بالتثبيت مرة واحدة وسيفتح كل دفع للفرع الافتراضي طلب سحب ترجمة أو يحدّثه. بدون مشغل، بدون مفتاح API سري، بدون ملف قفل لإدارته                                |
| [واجهة برمجة التطبيقات Lingo.dev](https://lingo.dev/en/docs/api)             | استدعاء متزامن واحد لكل زوج لغة، أو مهمة غير متزامنة توزع طلبًا واحدًا على لغات متعددة وتسلم النتائج فور وصولها                                                 |

[ابنِ أول محرك ترجمة لك ←](https://lingo.dev)
