<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="لينجو.ديف" />
  </a>
</p>

<p align="center">
  <strong>⚡️ واجهة سطر أوامر مفتوحة المصدر مدعومة بالذكاء الاصطناعي لتوطين الويب والتطبيقات الجوالة.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">الوثائق</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">المساهمة</a> •
  <a href="#-github-action">إجراء GitHub</a> •
  <a href="#">ضع نجمة للمستودع</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="الإصدار" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="الترخيص" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="آخر التزام" />
  </a>
</p>

<br />

Lingo.dev هي واجهة سطر أوامر مفتوحة المصدر مدعومة من المجتمع وتعمل بالذكاء الاصطناعي لتوطين تطبيقات الويب والجوال.

تم تصميم Lingo.dev لإنتاج ترجمات أصيلة فورياً، مما يلغي العمل اليدوي والأعباء الإدارية. ونتيجة لذلك، تقوم الفرق بتوطين دقيق أسرع بـ 100 مرة، وإطلاق الميزات لمزيد من المستخدمين السعداء حول العالم. يمكن استخدامها مع نموذج اللغة الكبير الخاص بك أو مع محرك التوطين المُدار من Lingo.dev.

> **حقيقة قليلة المعرفة:** بدأت Lingo.dev كمشروع صغير في هاكاثون طلابي في عام 2023! بعد العديد من التكرارات، تم قبولنا في Y Combinator في عام 2024، ونحن الآن نوظف! هل أنت مهتم ببناء أدوات التوطين من الجيل التالي؟ أرسل سيرتك الذاتية إلى careers@lingo.dev! 🚀

## 📑 في هذا الدليل

- [البدء السريع](#-quickstart) - ابدأ في دقائق
- [التخزين المؤقت](#-caching-with-i18nlock) - تحسين تحديثات الترجمة
- [إجراء GitHub](#-github-action) - أتمتة التوطين في CI/CD
- [الميزات](#-supercharged-features) - ما الذي يجعل Lingo.dev قوية
- [الوثائق](#-documentation) - أدلة ومراجع مفصلة
- [المساهمة](#-contribute) - انضم إلى مجتمعنا

## 💫 البدء السريع

تم تصميم واجهة سطر أوامر Lingo.dev للعمل مع نموذج اللغة الكبير الخاص بك، ومحرك التوطين المُدار من Lingo.dev المبني على أحدث نماذج اللغة الكبيرة المتطورة (SOTA).

### استخدام نموذج اللغة الكبير الخاص بك (BYOK أو أحضر مفتاحك الخاص)

1. قم بإنشاء ملف تكوين `i18n.json`:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. قم بتعيين مفتاح API الخاص بك كمتغير بيئي:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# أو لـ OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. قم بتشغيل الترجمة:

```bash
npx lingo.dev@latest i18n
```

### استخدام Lingo.dev Cloud

غالبًا ما تتطلب التطبيقات ذات المستوى الإنتاجي ميزات مثل ذاكرة الترجمة، ودعم المصطلحات، وضمان جودة الترجمة. أيضًا، في بعض الأحيان، قد ترغب في أن يقرر خبير نيابة عنك أي مزود LLM ونموذج يجب استخدامه، وتحديث النموذج تلقائيًا عند إصدار نماذج جديدة. Lingo.dev هو محرك ترجمة مُدار يوفر هذه الميزات:

1. قم بإنشاء ملف تكوين `i18n.json` (بدون عقدة المزود):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. قم بالمصادقة مع Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. قم بتشغيل الترجمة:

```bash
npx lingo.dev@latest i18n
```

## 📖 التوثيق

للحصول على أدلة مفصلة ومراجع API، قم بزيارة [التوثيق](https://lingo.dev/go/docs).

## 🔒 التخزين المؤقت باستخدام `i18n.lock`

يستخدم Lingo.dev ملف `i18n.lock` لتتبع مجاميع التحقق من المحتوى، مما يضمن ترجمة النص المتغير فقط. هذا يحسن:

- ⚡️ **السرعة**: تخطي المحتوى المترجم بالفعل
- 🔄 **الاتساق**: منع إعادة الترجمة غير الضرورية
- 💰 **التكلفة**: لا توجد فواتير للترجمات المتكررة

## 🤖 إجراء GitHub

يقدم Lingo.dev إجراء GitHub لأتمتة الترجمة في خط أنابيب CI/CD الخاص بك. إليك الإعداد الأساسي:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

يقوم هذا الإجراء بتشغيل `lingo.dev i18n` مع كل دفع، مما يحافظ على تحديث ترجماتك تلقائيًا.

للحصول على وضع طلب السحب وخيارات التكوين الأخرى، قم بزيارة [توثيق إجراء GitHub](https://docs.lingo.dev/setup/gha) الخاص بنا.

## ⚡️ القدرات الخارقة لـ Lingo.dev

- 🔥 **تكامل فوري**: يعمل مع قاعدة التعليمات البرمجية الخاصة بك في دقائق
- 🔄 **أتمتة CI/CD**: قم بإعدادها وانساها
- 🌍 **وصول عالمي**: أطلق لمستخدمين في كل مكان
- 🧠 **مدعوم بالذكاء الاصطناعي**: يستخدم أحدث نماذج اللغة للترجمات الطبيعية
- 📊 **متوافق مع جميع الصيغ**: JSON وYAML وCSV وMarkdown وAndroid وiOS والعديد من الصيغ الأخرى
- 🔍 **اختلافات نظيفة**: يحافظ على بنية ملفاتك بالضبط
- ⚡️ **سريع كالبرق**: ترجمات في ثوانٍ، وليس أيام
- 🔄 **متزامن دائمًا**: يتحدث تلقائيًا عند تغيير المحتوى
- 🌟 **جودة بشرية**: ترجمات لا تبدو آلية
- 👨‍💻 **بُني بواسطة المطورين، للمطورين**: نستخدمه بأنفسنا يوميًا
- 📈 **ينمو معك**: من مشروع جانبي إلى نطاق المؤسسات

## 🤝 المساهمة

Lingo.dev يعتمد على المجتمع، لذلك نرحب بجميع المساهمات!

هل لديك فكرة لميزة جديدة؟ قم بإنشاء مشكلة على GitHub!

تريد المساهمة؟ قم بإنشاء طلب سحب!

## 🌐 الملف التعريفي بلغات أخرى

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

لا ترى لغتك؟ ما عليك سوى إضافة رمز لغة جديد إلى ملف [`i18n.json`](./i18n.json) وفتح طلب سحب.
