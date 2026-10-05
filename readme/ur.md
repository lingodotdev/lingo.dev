<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – مقامیانے کی انجینئرنگ کا پلیٹ فارم" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev مقامیانے کی انجینئرنگ کا پلیٹ فارم ہے: ترجمے کے معیار کی پیمائش، LLMs کے ساتھ ترجمہ، اور مقامی بولنے والوں سے پروف ریڈنگ کروانے کا بہترین طریقہ۔</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">دستاویزات</a> •
  <a href="https://lingo.dev">پلیٹ فارم</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt کا مہینے کا #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="لائسنس" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="آخری commit" /></a>
</p>

---

## ٹیمیں Lingo.dev پر مقامیانے کے انجن بناتی ہیں

ایک [مقامیانے کا انجن](https://lingo.dev/en/docs/platform/engines) ایسی اسٹیٹ محفوظ رکھنے والی ترجمہ API ہے جسے آپ کی ٹیم ترتیب دیتی ہے اور Lingo.dev چلاتا ہے۔ ہر پروڈکٹ، ہر قسم کے مواد، یا ہر برانڈ کے لیے الگ انجن بنائیں۔ کسی انجن کے ذریعے گزرنے والی ہر درخواست پر وہ سب کچھ ایک طے شدہ ترجیحی ترتیب میں لاگو ہوتا ہے جو آپ نے اس میں مقرر کیا ہوتا ہے:

| تہہ | آپ کیا ترتیب دیتے ہیں | دستاویزات سے |
| --- | --- | --- |
| [LLM ماڈلز](https://lingo.dev/en/docs/platform/llm-models) | ہر زبان کے جوڑے کو کون سا ماڈل سنبھالے گا، ترجیحی متبادل ماڈلز کے ساتھ | 400+ ماڈلز؛ جواب میں چلنے والے ماڈل کا نام بھی آتا ہے |
| [برانڈ کی آواز](https://lingo.dev/en/docs/platform/brand-voices) | آپ کا پروڈکٹ ہر زبان میں کیسے بولتا ہے، ہر locale کے لیے ایک متن | ہر مارکیٹ کے لیے لہجہ اور رسمیت |
| [قواعد](https://lingo.dev/en/docs/platform/rules) | وہ لسانی اصول جو عمومی ماڈل سے رہ جاتے ہیں | ہسپانوی میں صفت کی جگہ، فیصد کے نشان سے پہلے وقفہ |
| [اصطلاح نامہ](https://lingo.dev/en/docs/platform/glossaries) | ہر locale کے لیے اصطلاحات کی درست نقشہ بندی، معنی کے مطابق ملا کر | یورپی مارکیٹس کے لیے "911"، "112" بن جاتا ہے؛ پروڈکٹ کے نام جوں کے توں رہتے ہیں |
| [AI جائزہ کار](https://lingo.dev/en/docs/platform/ai-reviewers) | ہر ترجمے کے بعد چلنے والی اسکورنگ | GEMBA اسکورز، BERTScore، اصطلاح نامے کی پابندی |

اصطلاح نامے، قواعد کے مجموعے، اور برانڈ کی آوازیں آپ کی تنظیم کی ملکیت ہوتی ہیں، اور انجن انہیں منسلک کر کے لاگو کرتا ہے۔ ایک اصطلاح نامہ پانچ انجنوں پر لاگو ہو سکتا ہے، اور ایک ترمیم پانچوں تک پہنچ جاتی ہے۔ کسی تبدیلی کو لائیو کرنے سے پہلے [Playground](https://lingo.dev/en/docs/platform/playground) میں آزمائیں: ایک انجن کا موازنہ خام ماڈل سے کریں، یا دو انجن ساتھ ساتھ دیکھیں۔ انجن پلیٹ فارم پر ترتیب دیے جاتے ہیں، جہاں مقامیانے کی ٹیم مقامیانے کا بنیادی ڈھانچا چلاتی ہے۔

## کوڈ سے اپنے انجنوں تک رسائی حاصل کریں

ریپازٹری کے مواد کا ترجمہ کریں۔ `lingo push` فائلیں `.lingo/config.json` میں درج انجن کو بھیجتا ہے، اور `lingo pull` کسی بھی مشین سے تراجم واپس لکھ دیتا ہے:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا ID کے ذریعے نام لے کر انجن کو براہِ راست کال کریں:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | آپ کا کوڈنگ ایجنٹ اسی گفتگو سے، جہاں مسئلہ سامنے آیا، انجن بناتا ہے، اصطلاح نامے میں اصطلاحات شامل کرتا ہے، قواعد کو بہتر کرتا ہے، اور دو انجنوں کا موازنہ کرتا ہے |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | سورس فائلیں push کریں، تراجم pull کریں، ٹرمینل سے یا CI سے۔ اٹھارہ فارمیٹس: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، Android اور Xcode strings، SubRip، PHP |
| [CI/CD میں Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI انسٹال کریں اور GitHub Actions، GitLab CI/CD، Bitbucket Pipelines، یا Node.js 22+ والے کسی بھی runner میں `lingo push` کو ایک مرحلے کے طور پر چلائیں |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ایک بار انسٹال کریں، پھر ڈیفالٹ برانچ پر ہر push ایک ترجمے کی pull request کھول دیتا ہے یا اسے تازہ کرتا ہے، یا ترجمے اسی pull request میں ایک commit کی صورت میں آ جاتے ہیں جس میں سورس بدلا گیا ہو۔ نہ runner، نہ API key secret، نہ سنبھالنے کے لیے کوئی Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ہر زبان کے جوڑے کے لیے ایک ہم وقت کال، یا ایک غیر ہم وقت کام جو ایک درخواست کو کئی locales تک پھیلا دیتا ہے اور نتائج آتے ہی پہنچا دیتا ہے |

[اپنا پہلا مقامیانے کا انجن بنائیں →](https://lingo.dev)
