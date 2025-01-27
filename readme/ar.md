<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ترجمة برمجية متطورة بالذكاء الاصطناعي للويب والموبايل، مباشرة من CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">الموقع</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">المساهمة</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

<br />

يقوم Lingo.dev بأتمتة الترجمة البرمجية بشكل كامل باستخدام أحدث نماذج LLM.

يقدم ترجمات أصيلة بشكل فوري، مما يلغي العمل اليدوي وأعباء الإدارة. يفهم محرك الترجمة في Lingo.dev سياق المنتج، مما يؤدي إلى إنشاء ترجمات مثالية يتوقعها المتحدثون الأصليون في أكثر من 60 لغة. نتيجة لذلك، تقوم الفرق بالترجمة بسرعة أكبر 100 مرة، مع جودة متطورة، مما يتيح إطلاق الميزات لمزيد من العملاء الدافعين حول العالم.

## 💫 البدء السريع

1. قم بإنشاء حساب على [الموقع](https://lingo.dev)

2. قم بتهيئة مشروعك:

   ```bash
   npx lingo.dev@latest init
   ```

3. راجع وثائقنا: [docs.lingo.dev](https://docs.lingo.dev)

4. قم بترجمة تطبيقك (يستغرق ثواني):
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

يقدم Lingo.dev خدمة GitHub Action لأتمتة الترجمة في خط أنابيب CI/CD الخاص بك. إليك الإعداد الأساسي:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

يقوم هذا الإجراء بتشغيل `lingo.dev i18n` مع كل عملية دفع، مما يحافظ على تحديث ترجماتك تلقائياً.

لمعرفة المزيد عن وضع طلبات السحب وخيارات التكوين الأخرى، قم بزيارة [وثائق GitHub Action](https://docs.lingo.dev/setup/gha) الخاصة بنا.

## 🥇 لماذا تختار الفرق Lingo.dev

- 🔥 **تكامل فوري**: إعداد في دقائق
- 🔄 **أتمتة CI/CD**: تكامل سلس مع خط أنابيب التطوير
- 🌍 **أكثر من 60 لغة**: توسع عالمي بدون عناء
- 🧠 **محرك ترجمة ذكي**: ترجمات تناسب منتجك بشكل حقيقي
- 📊 **مرونة في التنسيق**: يدعم JSON وYAML وCSV وMarkdown والمزيد

## 🛠️ مميزات متطورة

- ⚡️ **سرعة البرق**: ترجمة ذكية في ثوانٍ
- 🔄 **تحديثات تلقائية**: تزامن مع أحدث المحتوى
- 🌟 **جودة محلية**: ترجمات تبدو أصلية
- 👨‍💻 **صديق للمطورين**: واجهة سطر أوامر تتكامل مع سير عملك
- 📈 **قابل للتوسع**: للشركات الناشئة والفرق المؤسسية النامية

## 📚 الوثائق

للحصول على أدلة مفصلة ومراجع API، قم بزيارة [الوثائق](https://lingo.dev/go/docs).

## 🤝 المساهمة

مهتم بالمساهمة، حتى لو لم تكن عميلاً؟

ألق نظرة على [المشكلات الجيدة للبدء](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) واقرأ [دليل المساهمة](./CONTRIBUTING.md).

## 🧠 الفريق

- **[فيرونيكا](https://github.com/vrcprl)**
- **[ماكس](https://github.com/maxprilutskiy)**

أسئلة أو استفسارات؟ راسلنا على veronica@lingo.dev

## 🌐 الملف التعريفي بلغات أخرى

- [الإنجليزية](https://github.com/lingodotdev/lingo.dev)
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
