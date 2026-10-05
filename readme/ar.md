<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – منصة هندسة التوطين" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev هي منصة هندسة التوطين: أفضل طريقة لقياس جودة الترجمة، والترجمة باستخدام LLMs، ومراجعتها مع متحدثين أصليين.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">الوثائق</a> •
  <a href="https://lingo.dev">المنصة</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool لهذا الشهر" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="الترخيص" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="آخر commit" /></a>
</p>

---

## الفرق تبني محركات توطين على Lingo.dev

[محرك التوطين](https://lingo.dev/en/docs/platform/engines) هو API ترجمة يحتفظ بالحالة، يضبطه فريقك ويتولى Lingo.dev تشغيله. يمكنك إنشاء محرك لكل منتج، أو لكل نوع محتوى، أو لكل علامة تجارية. كل طلب يمر عبر المحرك يطبّق كل ما أعددته فيه، وفق ترتيب أولوية ثابت:

| الطبقة | ما الذي تضبطه | من الوثائق |
| --- | --- | --- |
| [نماذج LLM](https://lingo.dev/en/docs/platform/llm-models) | النموذج الذي يتولى كل زوج لغوي، مع بدائل احتياطية مرتبة | أكثر من 400 نموذج؛ وتذكر الاستجابة اسم النموذج الذي نُفِّذ |
| [أسلوب العلامة التجارية](https://lingo.dev/en/docs/platform/brand-voices) | كيف يتحدث منتجك بكل لغة، مع نص واحد لكل لغة/منطقة | النبرة ومستوى الرسمية لكل سوق |
| [القواعد](https://lingo.dev/en/docs/platform/rules) | الأعراف اللغوية التي قد تفوت على نموذج عام | موضع الصفة في الإسبانية، ووجود مسافة قبل علامة النسبة المئوية |
| [مسرد المصطلحات](https://lingo.dev/en/docs/platform/glossaries) | مطابقات دقيقة للمصطلحات لكل لغة/منطقة، مع مطابقة بحسب المعنى | يتحوّل "911" إلى "112" للأسواق الأوروبية؛ وتبقى أسماء المنتجات كما هي |
| [مراجعو AI](https://lingo.dev/en/docs/platform/ai-reviewers) | تقييم يُجرى بعد كل ترجمة | درجات GEMBA وBERTScore والالتزام بمسرد المصطلحات |

مسارد المصطلحات ومجموعات القواعد وأسلوب العلامة التجارية كلها تابعة لمؤسستك، ويطبّقها المحرك بمجرد إرفاقها به. يمكن لمسرد واحد أن يدير خمسة محركات، ويصل تعديل واحد إلى الخمسة جميعًا. اختبر أي تغيير في [Playground](https://lingo.dev/en/docs/platform/playground) قبل اعتماده: قارن بين محرك ونموذج خام، أو بين محركين جنبًا إلى جنب. تُضبط المحركات على المنصة، حيث يدير فريق التوطين البنية التحتية للتوطين.

## الوصول إلى محركاتك من خلال الكود

ترجم المحتوى داخل مستودع. يرسل `lingo push` الملفات إلى المحرك المحدد في `.lingo/config.json`، ويعيد `lingo pull` كتابة الترجمات من أي جهاز:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

أو استدعِ محركًا مباشرةً باستخدام معرّفه:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | يمكن لوكيل البرمجة لديك إنشاء محرك، وإضافة مصطلحات إلى المسرد، وضبط القواعد، ومقارنة محركين من داخل المحادثة نفسها التي ظهرت فيها المشكلة |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ادفع الملفات المصدر واسحب الترجمات من الطرفية أو من CI. ثمانية عشر تنسيقًا: JSON وYAML وMarkdown وMDX وPO وXLIFF وFlutter ARB وسلاسل Android وXcode وSubRip وPHP |
| [Lingo.dev في CI/CD](https://lingo.dev/en/docs/workflows) | ثبّت CLI وشغّل `lingo push` كخطوة ضمن GitHub Actions أو GitLab CI/CD أو Bitbucket Pipelines أو أي مشغّل يعمل على Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ثبّت مرة واحدة، وكل push إلى الفرع الافتراضي سيفتح طلب سحب للترجمة أو يحدّثه، أو ستصل الترجمات كـ commit داخل طلب السحب الذي غيّر المصدر. بلا مشغّل، وبلا مفتاح API سري، وبلا Lockfile لإدارته |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | استدعاء متزامن واحد لكل زوج لغوي، أو مهمة غير متزامنة توزّع طلبًا واحدًا على عدة لغات/مناطق وتسلّم النتائج فور وصولها |

[أنشئ أول محرك توطين لك ←](https://lingo.dev)
