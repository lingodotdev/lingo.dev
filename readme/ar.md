<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ مجموعة أدوات i18n مفتوحة المصدر مدعومة بالذكاء الاصطناعي للترجمة الفورية باستخدام نماذج اللغة الكبيرة.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">مُجمّع Lingo.dev</a> •
  <a href="https://lingo.dev/cli">واجهة سطر أوامر Lingo.dev</a> •
  <a href="https://lingo.dev/ci">التكامل والتسليم المستمر Lingo.dev</a> •
  <a href="https://lingo.dev/sdk">مجموعة أدوات تطوير البرمجيات Lingo.dev</a>
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

---

## تعرف على المُجمّع 🆕

**مُجمّع Lingo.dev** هو وسيط تجميع مفتوح المصدر ومجاني، مصمم لجعل أي تطبيق React متعدد اللغات في وقت البناء دون الحاجة إلى إجراء أي تغييرات على مكونات React الحالية.

```bash
# install once
npm install lingo.dev

# next.config.js
import lingoCompiler from "lingo.dev/compiler";

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
});
```

قم بتشغيل `next build` وشاهد حزم اللغة الإسبانية والفرنسية تظهر ✨

[اقرأ الوثائق ←](https://lingo.dev/compiler) للدليل الكامل.

---

### ما الذي يوجد في هذا المستودع؟

| الأداة         | ملخص سريع                                                                    | الوثائق                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **المُجمّع** | ترجمة React في وقت البناء                                                  | [/compiler](https://lingo.dev/compiler) |
| **واجهة سطر الأوامر**      | ترجمة بأمر واحد لتطبيقات الويب والجوال، JSON، YAML، markdown، وأكثر | [/cli](https://lingo.dev/cli)           |
| **التكامل والتسليم المستمر**    | التزام تلقائي للترجمات مع كل دفع + إنشاء طلبات السحب إذا لزم الأمر        | [/ci](https://lingo.dev/ci)             |
| **مجموعة أدوات التطوير**      | ترجمة فورية للمحتوى الذي ينشئه المستخدم                                | [/sdk](https://lingo.dev/sdk)           |

فيما يلي نظرة سريعة على كل منها 👇

---

### ⚡️ واجهة سطر أوامر Lingo.dev

ترجمة الكود والمحتوى مباشرة من الطرفية الخاصة بك.

```bash
npx lingo.dev@latest i18n
```

تقوم بتحديد بصمة لكل نص، وتخزين النتائج مؤقتًا، وإعادة ترجمة ما تغير فقط.

[اقرأ الوثائق ←](https://lingo.dev/cli)

---

### 🔄 التكامل والتسليم المستمر Lingo.dev

نشر ترجمات مثالية تلقائيًا.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

يحافظ على مستودعك الخاص بالشفرة البرمجية أخضر ومنتجك متعدد اللغات دون الحاجة إلى خطوات يدوية.

[اقرأ الوثائق ←](https://lingo.dev/ci)

---

### 🧩 مجموعة تطوير برمجيات Lingo.dev

ترجمة فورية لكل طلب للمحتوى الديناميكي.

```ts
import { translate } from "lingo.dev/sdk";

const text = await translate("Hello world", { to: "es" });
// → "¡Hola mundo!"
```

مثالي للدردشة، وتعليقات المستخدمين، وغيرها من تدفقات العمل في الوقت الفعلي.

[اقرأ الوثائق ←](https://lingo.dev/sdk)

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!

---

## 🤝 المجتمع

نحن مدفوعون بالمجتمع ونحب المساهمات!

- لديك فكرة؟ [افتح مشكلة](https://github.com/lingodotdev/lingo.dev/issues)
- تريد إصلاح شيء ما؟ [أرسل طلب سحب](https://github.com/lingodotdev/lingo.dev/pulls)
- تحتاج إلى مساعدة؟ [انضم إلى Discord الخاص بنا](https://lingo.dev/go/discord)

## ⭐ تاريخ النجوم

إذا أعجبك ما نقوم به، امنحنا ⭐ وساعدنا في الوصول إلى 3,000 نجمة! 🌟

[

![مخطط تاريخ النجوم](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ملف القراءة بلغات أخرى

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

لا ترى لغتك؟ أضفها إلى [`i18n.json`](./i18n.json) وافتح طلب سحب!
