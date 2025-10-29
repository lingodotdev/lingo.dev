# ⚡ Lingo.dev — اوپن سورس، AI سے چلنے والا i18n ٹول کِٹ

**Lingo.dev** ایک اوپن سورس، AI سے چلنے والا i18n (بین الاقوامی زبان بندی) ٹول کِٹ ہے جو کسی بھی React ایپ کو فوری طور پر مختلف زبانوں میں تبدیل کرنے کے لیے بنایا گیا ہے — بغیر کسی کوڈ میں تبدیلی کے۔

---

## 🚀 انسٹالیشن

پروجیکٹ میں شامل کرنے کے لیے:

```bash
npm install lingo.dev
```

### Next.js کمپائلر کی مثال

یہ کوڈ `next.config.js` (یا `next.config.mjs`) میں رکھا جا سکتا ہے:

```javascript
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

### اجزاء (Components)

| جزو      | مقصد                                                           | راستہ       |
| -------- | -------------------------------------------------------------- | ----------- |
| Compiler | React ایپس کے لیے بلڈ ٹائم لوکلائزیشن                          | `/compiler` |
| CLI      | ایک کمانڈ سے ویب یا موبائل ایپس، JSON, YAML, markdown کا ترجمہ | `/cli`      |
| CI/CD    | ہر push پر خودکار ترجمہ اور PRs بناتا ہے                       | `/ci`       |
| SDK      | لائیو کنٹینٹ (مثلاً چیٹ، تبصرے) کا فوری ترجمہ                  | `/sdk`      |

### SDK مثال

یہ ایک چھوٹا سا مثال ہے جو دکھاتی ہے کہ کس طرح `localizeObject` استعمال کیا جا سکتا ہے:

```javascript
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

(async () => {
  const translated = await lingoDotDev.localizeObject(content, {
    sourceLocale: "en",
    targetLocale: "es",
  });

  // نتیجہ:
  // { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
  console.log(translated);
})();
```

---

Once you save this as **`README.ur.md`** in the **root folder**, it will render **perfectly on GitHub**.

اگر آپ چاہیں تو میں اب آپ کے لیے وہی git کمانڈز تیار کرکے دِکھا دوں: کہ وہ فائل add, commit, push کریں اور PR کھولیے۔ بس "next" کہیے۔