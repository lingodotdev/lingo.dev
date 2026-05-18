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
    أدوات هندسة ترجمة مفتوحة المصدر. اتصل بمنصة Lingo.dev لهندسة الترجمة للحصول
    على ترجمات متسقة وعالية الجودة.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (ألفا مبكرة)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="الإصدار"
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
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 أداة تطوير للشهر"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 منتج الأسبوع"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 منتج اليوم"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="رائج على Github"
    />
  </a>
</p>

---

## البدء السريع

| الأداة                                             | ما تفعله                                           | الأمر السريع                       |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | إعداد i18n بمساعدة الذكاء الاصطناعي لتطبيقات React | المطالبة: `Set up i18n`            |
| [**Lingo CLI**](#lingodev-cli)                     | ترجمة ملفات JSON وYAML وmarkdown وCSV وPO          | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | ترجمة مستمرة في GitHub Actions                     | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | ترجمة React وقت البناء بدون أغلفة i18n             | إضافة `withLingo()`                |

### محركات الترجمة

تتصل هذه الأدوات بـ [محركات الترجمة](https://lingo.dev) – واجهات برمجة ترجمة ذات حالة تنشئها على منصة Lingo.dev لهندسة الترجمة. يحتفظ كل محرك بالمسارد ونبرة العلامة التجارية والتعليمات الخاصة بكل لغة عبر كل طلب، [مما يقلل أخطاء المصطلحات بنسبة 16.6-44.6%](https://lingo.dev/research/retrieval-augmented-localization). أو [استخدم نموذج اللغة الكبير الخاص بك](#lingodev-cli).

---

### Lingo.dev MCP

إعداد i18n في تطبيقات React معرض للأخطاء – حتى مساعدو البرمجة بالذكاء الاصطناعي يتخيلون واجهات برمجة غير موجودة ويكسرون التوجيه. يمنح Lingo.dev MCP مساعدي الذكاء الاصطناعي وصولاً منظماً إلى معرفة i18n الخاصة بالإطار لـ Next.js وReact Router وTanStack Start. يعمل مع Claude Code وCursor وGitHub Copilot Agents وCodex.

[اقرأ الوثائق ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ترجم ملفات JSON وYAML وmarkdown وCSV وPO بأمر واحد. يتتبع ملف القفل ما تمت ترجمته بالفعل – يتم معالجة المحتوى الجديد أو المعدل فقط. يستخدم محرك الترجمة الخاص بك على Lingo.dev افتراضياً، أو استخدم نموذج اللغة الكبير الخاص بك (OpenAI وAnthropic وGoogle وMistral وOpenRouter وOllama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[اقرأ المستندات ←](https://lingo.dev/en/docs/cli)

---

### واجهة سطر أوامر Lingo.dev

الترجمة المستمرة في خط العمل. كل دفع يُفعّل الترجمة – تُملأ النصوص الناقصة قبل وصول الكود إلى الإنتاج. يدعم GitHub Actions وGitLab CI/CD وBitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[اقرأ المستندات ←](https://lingo.dev/en/docs/integrations)

---

### واجهة برمجة تطبيقات Lingo.dev

استدعِ محرك الترجمة مباشرةً من كود الخادم. ترجمة متزامنة وغير متزامنة مع التسليم عبر webhook، وعزل الأخطاء لكل لغة، وتتبع التقدم في الوقت الفعلي عبر WebSocket.

[اقرأ المستندات ←](https://lingo.dev/en/docs/api)

---

### مُترجم Lingo لـ React (نسخة تجريبية مبكرة)

ترجمة React في وقت البناء بدون أغلفة i18n. اكتب المكونات بنصوص إنجليزية عادية – يكتشف المُترجم النصوص القابلة للترجمة ويُنشئ متغيرات مترجمة في وقت البناء. بدون مفاتيح ترجمة، بدون ملفات JSON، بدون دوال `t()`. يدعم Next.js (App Router) وVite + React.

[اقرأ المستندات ←](https://lingo.dev/en/docs/react/compiler)

---

## المساهمة

المساهمات مرحب بها. يُرجى اتباع هذه الإرشادات:

1. **المشكلات:** [أبلغ عن الأخطاء أو اطلب ميزات](https://github.com/lingodotdev/lingo.dev/issues)
2. **طلبات السحب:** [قدّم التغييرات](https://github.com/lingodotdev/lingo.dev/pulls)
   - كل طلب سحب يتطلب مجموعة تغييرات: `pnpm new` (أو `pnpm new:empty` للتغييرات غير المُصدرة)
   - تأكد من نجاح الاختبارات قبل التقديم
3. **التطوير:** هذا مستودع أحادي باستخدام pnpm + turborepo
   - تثبيت التبعيات: `pnpm install`
   - تشغيل الاختبارات: `pnpm test`
   - البناء: `pnpm build`

**الدعم:** [مجتمع Discord](https://lingo.dev/go/discord)

## تاريخ النجوم

إذا وجدت Lingo.dev مفيداً، امنحنا نجمة وساعدنا في الوصول إلى 10,000 نجمة!

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## الوثائق المترجمة

**الترجمات المتاحة:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**إضافة لغة جديدة:**

1. أضف رمز اللغة إلى [`i18n.json`](./i18n.json) باستخدام [صيغة BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. قدّم طلب دمج
