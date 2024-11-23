<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ترجمة آلية متطورة للويب والموبايل، مباشرة من CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">الموقع الإلكتروني</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">المساهمة</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="الإصدار" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="الترخيص" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="آخر تعديل" />
  </a>
</p>

<br />

تقوم Replexica AI بأتمتة عملية ترجمة البرمجيات بشكل كامل.

تنتج ترجمات أصيلة على الفور، مما يلغي العمل اليدوي والأعباء الإدارية. يفهم محرك الترجمة Replexica سياق المنتج، مما يؤدي إلى إنشاء ترجمات مثالية يتوقعها المتحدثون الأصليون في أكثر من 60 لغة. نتيجة لذلك، تقوم الفرق بالترجمة بسرعة أكبر 100 مرة، مع جودة متطورة، مما يتيح إطلاق الميزات لمزيد من العملاء الدافعين حول العالم.

## 💫 البدء السريع

1. **طلب الوصول**: [تحدث إلينا](https://replexica.com/go/call) لتصبح عميلاً.

2. بمجرد الموافقة، قم بتهيئة مشروعك:
   ```bash
   npx replexica@latest init
   ```

3. قم بترجمة المحتوى الخاص بك:
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

توفر Replexica إجراء GitHub لأتمتة الترجمة في خط أنابيب CI/CD الخاص بك. إليك الإعداد الأساسي:

```yaml
- uses: replexica/replexica@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```

يقوم هذا الإجراء بتشغيل `replexica i18n` مع كل دفع، مما يحافظ على تحديث ترجماتك تلقائيًا.

للحصول على وضع طلب السحب وخيارات التكوين الأخرى، قم بزيارة [وثائق GitHub Action](https://docs.replexica.com/setup/gha) الخاصة بنا.

## 🥇 لماذا تختار الفرق ريبليكسيكا

- 🔥 **دمج فوري**: إعداد في دقائق
- 🔄 **أتمتة CI/CD**: دمج سلس مع خط أنابيب التطوير
- 🌍 **أكثر من 60 لغة**: توسع عالمي بدون جهد
- 🧠 **محرك توطين ذكي**: ترجمات تناسب منتجك حقًا
- 📊 **مرونة الصيغ**: يدعم JSON وYAML وCSV وMarkdown والمزيد

## 🛠️ ميزات فائقة القوة

- ⚡️ **سرعة البرق**: توطين ذكي في ثوانٍ
- 🔄 **تحديثات تلقائية**: تزامن مع أحدث المحتوى
- 🌟 **جودة أصلية**: ترجمات تبدو أصيلة
- 👨‍💻 **صديقة للمطورين**: واجهة سطر أوامر تتكامل مع سير عملك
- 📈 **قابلة للتوسع**: للشركات الناشئة النامية وفرق المؤسسات

## 📚 الوثائق

للحصول على أدلة مفصلة ومراجع API، قم بزيارة [الوثائق](https://replexica.com/go/docs).

## 🤝 المساهمة

مهتم بالمساهمة، حتى لو لم تكن عميلاً؟

ألق نظرة على [القضايا الجيدة للبدء](https://github.com/replexica/replexica/labels/good%20first%20issue) واقرأ [دليل المساهمة](./CONTRIBUTING.md).

## 🧠 الفريق

- **[فيرونيكا](https://github.com/vrcprl)**
- **[ماكس](https://github.com/maxprilutskiy)**

أسئلة أو استفسارات؟ راسل veronica@replexica.com

## 🌐 الملف التعريفي بلغات أخرى

- [الإنجليزية](https://github.com/replexica/replexica)
- [الإسبانية](/readme/es.md)
- [الفرنسية](/readme/fr.md)
- [الروسية](/readme/ru.md)
- [الألمانية](/readme/de.md)
- [الصينية](/readme/zh-Hans.md)
- [الكورية](/readme/ko.md)
- [اليابانية](/readme/ja.md)
- [الإيطالية](/readme/it.md)
- [العربية](/readme/ar.md)

لا ترى لغتك؟ ما عليك سوى إضافة رمز لغة جديد إلى ملف [`i18n.json`](./i18n.json) وفتح طلب سحب.
