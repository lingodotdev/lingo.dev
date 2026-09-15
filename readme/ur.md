<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – لوکلائزیشن انجینئرنگ پلیٹ فارم"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev لوکلائزیشن انجینئرنگ پلیٹ فارم ہے: ترجمے کے معیار کی پیمائش، LLMs
    کے ساتھ ترجمہ، اور مقامی بولنے والوں کے ساتھ پروف ریڈنگ کا بہترین طریقہ۔
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">دستاویزات</a> •
  <a href="https://lingo.dev">پلیٹ فارم</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt ماہ کا نمبر 1 DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="لائسنس"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="آخری کمٹ"
    />
  </a>
</p>

---

## ٹیمیں Lingo.dev پر لوکلائزیشن انجن بناتی ہیں

[لوکلائزیشن انجن](https://lingo.dev/en/docs/platform/engines) ایک stateful ترجمہ API ہے جسے آپ کی ٹیم کنفیگر کرتی ہے اور Lingo.dev چلاتا ہے۔ ہر پروڈکٹ، ہر کنٹینٹ قسم، یا ہر برانڈ کے لیے ایک بنائیں۔ انجن کے ذریعے ہر درخواست آپ کی کنفیگر کردہ ہر چیز کو ترجیح کی مقررہ ترتیب میں لاگو کرتی ہے:

| تہہ                                                             | آپ کیا کنفیگر کرتے ہیں                                                 | دستاویزات سے                                                                    |
| --------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [LLM ماڈلز](https://lingo.dev/en/docs/platform/llm-models)      | کون سا ماڈل ہر زبان کے جوڑے کو سنبھالتا ہے، درجہ بند fallbacks کے ساتھ | 400+ ماڈلز؛ جواب اس ماڈل کا نام بتاتا ہے جو چلا                                 |
| [برانڈ وائس](https://lingo.dev/en/docs/platform/brand-voices)   | آپ کی پروڈکٹ ہر زبان میں کیسے بولتی ہے، ہر لوکیل کے لیے ایک متن        | ہر مارکیٹ کے لیے لہجہ اور رسمیت                                                 |
| [اصول](https://lingo.dev/en/docs/platform/rules)                | لسانی روایات جو ایک عام ماڈل چھوڑ دیتا ہے                              | ہسپانوی میں صفت کی پوزیشن، فیصد کی علامات سے پہلے خالی جگہ                      |
| [لغت](https://lingo.dev/en/docs/platform/glossaries)            | ہر لوکیل کے لیے درست اصطلاح میپنگ، معنی کے مطابق ملایا جاتا ہے         | "911" یورپی مارکیٹوں کے لیے "112" بن جاتا ہے؛ پروڈکٹ کے نام جوں کے توں رہتے ہیں |
| [AI جائزہ کار](https://lingo.dev/en/docs/platform/ai-reviewers) | اسکورنگ جو ہر ترجمے کے بعد چلتی ہے                                     | GEMBA اسکورز، BERTScore، لغت کی تعمیل                                           |

لغات، قواعد کے سیٹ، اور برانڈ وائسز آپ کی تنظیم سے تعلق رکھتے ہیں، اور ایک انجن انہیں منسلکی کے ذریعے لاگو کرتا ہے۔ ایک لغت پانچ انجنوں کو کنٹرول کرتی ہے، اور ایک ترمیم پانچوں تک پہنچتی ہے۔ [Playground](https://lingo.dev/en/docs/platform/playground) میں اسے لائیو کرنے سے پہلے کسی تبدیلی کو ٹیسٹ کریں: کسی خام ماڈل کے خلاف ایک انجن کا موازنہ کریں، یا دو انجنوں کو ساتھ ساتھ رکھیں۔ انجن پلیٹ فارم پر کنفیگر کیے جاتے ہیں، جہاں لوکلائزیشن ٹیم لوکلائزیشن انفراسٹرکچر چلاتی ہے۔

## کوڈ سے اپنے انجنز تک رسائی حاصل کریں

ریپوزٹری میں مواد کا ترجمہ کریں۔ `lingo push` فائلوں کو `.lingo/config.json` میں نامزد انجن کو بھیجتا ہے، اور `lingo pull` کسی بھی مشین سے تراجم واپس لکھتا ہے:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا براہ راست انجن کو ID کے ذریعے نام دے کر کال کریں:

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

|                                                                        |                                                                                                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | آپ کا کوڈنگ ایجنٹ ایک انجن بناتا ہے، لغت کی اصطلاحات شامل کرتا ہے، قواعد کو بہتر بناتا ہے، اور دو انجنز کا موازنہ کرتا ہے، اسی گفتگو سے جہاں مسئلہ سامنے آیا              |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | سورس فائلیں پش کریں، تراجم پل کریں، ٹرمینل یا CI سے۔ اٹھارہ فارمیٹس: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، Android اور Xcode strings، SubRip، PHP            |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI انسٹال کریں اور `lingo push` کو GitHub Actions، GitLab CI/CD، Bitbucket Pipelines، یا Node.js 22+ والے کسی بھی رنر میں ایک قدم کے طور پر چلائیں                       |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ایک بار انسٹال کریں اور ڈیفالٹ برانچ پر ہر پش ایک ترجمہ pull request کھولتی یا اپڈیٹ کرتی ہے۔ کوئی رنر نہیں، کوئی API key سیکرٹ نہیں، منیج کرنے کے لیے کوئی lockfile نہیں |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | ہر زبان کے جوڑے کے لیے ایک synchronous کال، یا async job جو ایک درخواست کو کئی لوکیلز میں پھیلاتی ہے اور نتائج فراہم کرتی ہے جیسے ہی وہ آتے ہیں                           |

[اپنا پہلا لوکلائزیشن انجن بنائیں ←](https://lingo.dev)
