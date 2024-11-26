<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ترجمة آلية متطورة للويب والموبايل مباشرة من CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">الموقع</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">المساهمة</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#-localization-compiler-experimental">مترجم التوطين</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="License" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="Last Commit" />
  </a>
</p>

<br />

يقوم Replexica AI بأتمتة توطين البرمجيات بشكل كامل من البداية إلى النهاية.

ينتج ترجمات أصيلة بشكل فوري، مما يلغي العمل اليدوي والأعباء الإدارية. يفهم محرك Replexica للتوطين سياق المنتج، مما يؤدي إلى إنشاء ترجمات مثالية يتوقعها المتحدثون الأصليون في أكثر من 60 لغة. ونتيجة لذلك، تقوم الفرق بالتوطين بسرعة أكبر 100 مرة، مع جودة متطورة، مما يتيح إطلاق الميزات لمزيد من العملاء الدافعين حول العالم.

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

## 🧪 مترجم التوطين (تجريبي)

يحتوي هذا المستودع أيضًا على تجربتنا الجديدة: مترجم توطين JS/React.

يتيح لفرق المطورين القيام بتوطين الواجهة الأمامية **بدون استخراج النصوص إلى ملفات الترجمة**. يمكن للفرق الحصول على واجهة أمامية متعددة اللغات بسطر برمجي واحد فقط. يعمل في وقت البناء، ويستخدم معالجة شجرة الصيغة المجردة (AST) وتوليد الكود.

يمكنك مشاهدة العرض التوضيحي [هنا](https://x.com/MaxPrilutskiy/status/1781011350136734055).

إذا كنت ترغب في تجربة المترجم بنفسك، تأكد من تنفيذ `git checkout 6c6d59e8aa27836fd608f9258ea4dea82961120f` أولاً.

## 🥇 لماذا تختار الفرق Replexica

- 🔥 **تكامل فوري**: إعداد في دقائق
- 🔄 **أتمتة CI/CD**: تكامل سلس مع خط أنابيب التطوير
- 🌍 **أكثر من 60 لغة**: توسع عالمي بدون عناء
- 🧠 **محرك توطين ذكي**: ترجمات تناسب منتجك حقاً
- 📊 **مرونة الصيغ**: يدعم JSON وYAML وCSV وMarkdown والمزيد

## 🛠️ ميزات متطورة

- ⚡️ **سرعة فائقة**: توطين ذكي في ثوانٍ
- 🔄 **تحديثات تلقائية**: مزامنة مع أحدث المحتوى
- 🌟 **جودة محلية**: ترجمات تبدو أصيلة
- 👨‍💻 **صديق للمطورين**: واجهة سطر أوامر تتكامل مع سير عملك
- 📈 **قابل للتوسع**: للشركات الناشئة النامية وفرق المؤسسات

## 📚 التوثيق

للحصول على الأدلة التفصيلية ومراجع API، قم بزيارة [التوثيق](https://replexica.com/go/docs).

## 🤝 المساهمة

هل أنت مهتم بالمساهمة، حتى لو لم تكن عميلاً؟

ألقِ نظرة على [القضايا الجيدة للبدء](https://github.com/replexica/replexica/labels/good%20first%20issue) واقرأ [دليل المساهمة](./CONTRIBUTING.md).

## 🧠 الفريق

- **[فيرونيكا](https://github.com/vrcprl)**
- **[ماكس](https://github.com/maxprilutskiy)**

أسئلة أو استفسارات؟ راسلنا على veronica@replexica.com

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
