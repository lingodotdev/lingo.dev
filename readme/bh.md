<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट LLMs के साथ तत्काल
    स्थानीयकरण खातिर।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कंपाइलर</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="रिलीज"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="लाइसेंस"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="अंतिम कमिट"
    />
  </a>
</p>

---

## कंपाइलर से मिलिए 🆕

**Lingo.dev कंपाइलर** एक मुफ्त, ओपन-सोर्स कंपाइलर मिडलवेयर बा, जवन कि मौजूदा React कंपोनेंट्स में कवनो बदलाव किए बिना बिल्ड टाइम पर कौनो भी React ऐप के बहुभाषी बनावे खातिर डिजाइन कइल गइल बा।

एक बेर इंस्टॉल करीं:

```bash
npm install lingo.dev
```

अपना बिल्ड कॉन्फिग में सक्षम करीं:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चलावीं आ स्पेनिश आ फ्रेंच बंडल के प्रकट होते देखीं ✨

[दस्तावेज़ पढ़ीं →](https://lingo.dev/compiler) पूरा गाइड खातिर, आ [हमरा Discord में शामिल होईं](https://lingo.dev/go/discord) अपना सेटअप में मदद पावे खातिर।

---

### ई रेपो में की बा?

| टूल         | संक्षिप्त विवरण                                                              | दस्तावेज़                               |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम React स्थानीयकरण                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | वेब आ मोबाइल ऐप्स, JSON, YAML, मार्कडाउन, + अउरी खातिर एक-कमांड स्थानीयकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | हर पुश पर अनुवाद के ऑटो-कमिट करीं + जरूरत पर पुल रिक्वेस्ट बनावीं         | [/ci](https://lingo.dev/ci)             |
| **SDK**     | उपयोगकर्ता-जनित सामग्री खातिर रीयलटाइम अनुवाद                               | [/sdk](https://lingo.dev/sdk)           |

नीचे हर एक खातिर त्वरित जानकारी दिहल गइल बा 👇

---

### ⚡️ Lingo.dev CLI

अपना टर्मिनल से सीधा कोड आ सामग्री के अनुवाद करीं।

```bash
npx lingo.dev@latest run
```

ई हर स्ट्रिंग के फिंगरप्रिंट करेला, नतीजा के कैश करेला, आ सिर्फ उहीं चीज के फेर से अनुवाद करेला जवन बदल गइल बा।

[दस्तावेज़ देखीं →](https://lingo.dev/cli) ई के सेट अप करे के तरीका जाने खातिर।

---

### 🔄 Lingo.dev CI/CD

स्वचालित रूप से परिपूर्ण अनुवाद शिप करीं।

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

आपके रेपो के हरा रखेला आ आपके उत्पाद के मैनुअल चरण बिना बहुभाषी रखेला।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

गतिशील सामग्री खातिर तत्काल प्रति-अनुरोध अनुवाद।

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

चैट, उपयोगकर्ता टिप्पणी आ अउरी रीयल-टाइम फ्लो खातिर उत्तम।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हम समुदाय-संचालित बाड़ी आ योगदान पसंद करेला!

- कवनो विचार बा? [एगो इश्यू खोलीं](https://github.com/lingodotdev/lingo.dev/issues)
- कुछ ठीक करे के चाहत बानी? [एगो PR भेजीं](https://github.com/lingodotdev/lingo.dev/pulls)
- मदद चाहीं? [हमरा Discord में शामिल होईं](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

अगर हमरा काम पसंद बा, त हमरा एगो ⭐ दीं आ 3,000 स्टार ले पहुंचे में हमरा मदद करीं! 🌟

[

![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 अउरी भाषा में रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [भोजपुरी](/readme/bh.md) • [فارسی](/readme/fa.md)

अपना भाषा नइखे देख रहल बानी? एकरा [`i18n.json`](./i18n.json) में जोड़ीं आ एगो PR खोलीं!

