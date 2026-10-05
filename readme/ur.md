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

## ٹیمیں Lingo.dev پر localization engine بناتی ہیں

ایک [localization engine](https://lingo.dev/en/docs/platform/engines) ایک stateful translation API ہے جسے آپ کی ٹیم configure کرتی ہے اور Lingo.dev چلاتا ہے۔ آپ ہر پروڈکٹ، ہر content type، یا ہر برانڈ کے لیے الگ engine بنا سکتے ہیں۔ کسی engine سے گزرنے والی ہر request اس میں کی گئی آپ کی تمام configurations کو ترجیح کے ایک طے شدہ ترتیب سے apply کرتی ہے:

| Layer | آپ کیا configure کرتے ہیں | docs سے |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | ہر language pair کو کون سا model handle کرے گا، ranked fallback کے ساتھ | 400+ models؛ response میں چلنے والے model کا نام آتا ہے |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | آپ کا پروڈکٹ ہر زبان میں کیسے بولتا ہے، ہر locale کے لیے ایک متن | ہر market کے لیے tone اور formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | وہ لسانی اصول جو ایک عام model اکثر miss کر دیتا ہے | ہسپانوی میں صفت کی جگہ، فیصد کے نشان سے پہلے space |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | ہر locale کے لیے terms کی exact mapping، معنی کے مطابق match کے ساتھ | یورپی markets کے لیے "911"، "112" بن جاتا ہے؛ پروڈکٹ کے نام جوں کے توں رہتے ہیں |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | scoring جو ہر ترجمے کے بعد چلتی ہے | GEMBA scores، BERTScore، glossary compliance |

Glossary، rulesets، اور brand voices آپ کی organization کی ملکیت ہوتے ہیں، اور engine انہیں attachment کے ذریعے apply کرتا ہے۔ ایک glossary پانچ engines کو govern کر سکتی ہے، اور ایک edit پانچوں تک پہنچ جاتی ہے۔ کسی تبدیلی کو live کرنے سے پہلے [Playground](https://lingo.dev/en/docs/platform/playground) میں test کریں: ایک engine کا raw model سے موازنہ کریں، یا دو engines کو ساتھ ساتھ compare کریں۔ engines پلیٹ فارم پر configure ہوتے ہیں، جہاں localization ٹیم localization infrastructure چلاتی ہے۔

## کوڈ سے اپنے engines تک رسائی حاصل کریں

کسی repository میں موجود content کا ترجمہ کریں۔ `lingo push` فائلوں کو `.lingo/config.json` میں درج engine تک بھیجتا ہے، اور `lingo pull` کسی بھی مشین سے translations واپس لکھ دیتا ہے۔

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

یا پھر کسی engine کو براہِ راست call کریں، اس کی ID دے کر:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | آپ کا coding agent ایک engine بناتا ہے، glossary terms شامل کرتا ہے، rules کو fine-tune کرتا ہے، اور اسی گفتگو میں دو engines کا موازنہ کرتا ہے جہاں مسئلہ سامنے آیا ہو |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | source files push کریں، translations pull کریں—terminal سے بھی اور CI سے بھی۔ 18 formats: JSON، YAML، Markdown، MDX، PO، XLIFF، Flutter ARB، Android اور Xcode strings، SubRip، PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install کریں اور `lingo push` کو GitHub Actions، GitLab CI/CD، Bitbucket Pipelines، یا Node.js 22+ والے کسی بھی runner میں ایک step کے طور پر چلائیں |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ایک بار install کریں، پھر default branch پر ہر push ایک translation pull request کھول دیتا ہے یا update کر دیتا ہے، یا translations اسی pull request میں commit کے طور پر آ جاتی ہیں جس میں source بدلا گیا ہو۔ نہ runner چاہیے، نہ API key secret، نہ Lockfile سنبھالنے کی جھنجھٹ |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ہر language pair کے لیے ایک synchronous call، یا ایک async job جو ایک request کو کئی locales تک پھیلا دے اور نتائج آتے ہی deliver کر دے |

[اپنا پہلا localization engine بنائیں →](https://lingo.dev)
