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

## تبني الفرق محركات توطين على Lingo.dev

[محرك التوطين](https://lingo.dev/en/docs/platform/engines) هو واجهة برمجة تطبيقات للترجمة تحتفظ بالحالة، يضبطها فريقك وتُشغّلها Lingo.dev. أنشئ محركًا لكل منتج، أو لكل نوع محتوى، أو لكل علامة تجارية. كل طلب يمر عبر محرك يطبّق كل ما أعددته فيه، وفق ترتيب أولوية ثابت:

| الطبقة | ما الذي تضبطه | من الوثائق |
| --- | --- | --- |
| [نماذج LLM](https://lingo.dev/en/docs/platform/llm-models) | أي نموذج يتولى كل زوج لغوي، مع بدائل احتياطية مرتبة | أكثر من 400 نموذج؛ وتُسمّي الاستجابة النموذج الذي تم تشغيله |
| [صوت العلامة التجارية](https://lingo.dev/en/docs/platform/brand-voices) | كيف يتحدث منتجك بكل لغة، مع نص واحد لكل لغة محلية | النبرة ومستوى الرسمية لكل سوق |
| [القواعد](https://lingo.dev/en/docs/platform/rules) | الاصطلاحات اللغوية التي قد تفوت على نموذج عام | موضع الصفة في الإسبانية، ووضع مسافة قبل علامة النسبة المئوية |
| [مسرد المصطلحات](https://lingo.dev/en/docs/platform/glossaries) | مطابقات دقيقة للمصطلحات حسب اللغة المحلية، مع مطابقة المعنى | تتحول "911" إلى "112" في الأسواق الأوروبية؛ وتبقى أسماء المنتجات كما هي |
| [مراجعو AI](https://lingo.dev/en/docs/platform/ai-reviewers) | تقييم يُجرى بعد كل ترجمة | درجات GEMBA وBERTScore والالتزام بمسرد المصطلحات |

تعود مسارد المصطلحات ومجموعات القواعد وأصوات العلامة التجارية إلى مؤسستك، ويطبّقها المحرك بمجرد ربطها به. يمكن لمسرد واحد أن يدير خمسة محركات، ويصل تعديل واحد إلى الخمسة جميعًا. اختبر أي تغيير في [Playground](https://lingo.dev/en/docs/platform/playground) قبل اعتماده: قارن بين محرك ونموذج خام، أو بين محركين جنبًا إلى جنب. تُضبط المحركات على المنصة، حيث يدير فريق التوطين البنية التحتية للتوطين.

## الوصول إلى محركاتك من خلال الكود

ترجِم المحتوى داخل مستودع. يرسل `lingo push` الملفات إلى المحرك المسمّى في `.lingo/config.json`، ويعيد `lingo pull` كتابة الترجمات من أي جهاز:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

أو استدعِ محركًا مباشرةً بذكر معرّفه:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | يمكن لوكيل البرمجة لديك إنشاء محرك، وإضافة مصطلحات إلى المسرد، وضبط القواعد، ومقارنة محركين، مباشرةً من المحادثة التي ظهرت فيها المشكلة |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ادفع الملفات المصدرية واسحب الترجمات من الطرفية أو من CI. ثمانية عشر تنسيقًا: JSON وYAML وMarkdown وMDX وPO وXLIFF وFlutter ARB وسلاسل Android وXcode وSubRip وPHP |
| [Lingo.dev في CI/CD](https://lingo.dev/en/docs/workflows) | ثبّت CLI وشغّل `lingo push` كخطوة ضمن GitHub Actions أو GitLab CI/CD أو Bitbucket Pipelines أو أي مشغّل يعمل بـ Node.js 22+ |
| [تطبيق Lingo.dev على GitHub](https://lingo.dev/en/docs/workflows/github-app) | ثبّته مرة واحدة، وكل push إلى الفرع الافتراضي سيفتح طلب سحب للترجمة أو يحدّثه، أو تصل الترجمات كـ commit داخل طلب السحب الذي غيّر المصدر. بلا مشغّل، وبلا مفتاح API سري، وبلا Lockfile لإدارته |
| [واجهة API من Lingo.dev](https://lingo.dev/en/docs/api) | استدعاء متزامن واحد لكل زوج لغوي، أو مهمة غير متزامنة توزّع طلبًا واحدًا على عدة لغات محلية وتسلّم النتائج فور وصولها |

[أنشئ أول محرك توطين لك ←](https://lingo.dev)
