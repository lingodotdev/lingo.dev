<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - open-source, AI-चालित LLM's सह त्वरित स्थानिकीकरणासाठी i18n टूलकिट.
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## Meet the Compiler 🆕

**Lingo.dev कंपाइलर** हे एक मोफत, ओपन-सोर्स कंपायलर मिडलवेअर आहे जे कोणत्याही React app बिल्ड वेळेत बहुभाषिक बनवण्यासाठी डिझाइन केलेले आहे, ज्यामध्ये विद्यमान React components मध्ये
 बदल करण्याची आवश्यकता नाही.

एकदा स्थापित करा:

```bash
npm install lingo.dev
```

तुमच्या बिल्ड कॉन्फिगरेशनमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल पॉप आउट होताना पहा.✨

[दस्तऐवज वाचा
 →](https://lingo.dev/compiler) संपूर्ण मार्गदर्शनासाठी, आणि [Discord वर सामील व्हा](https://lingo.dev/go/discord) तुमच्या सेटअपमध्ये मदत मिळविण्यासाठी.

---

### या रेपोमध्ये काय आहे?


| साधन         | TL;DR                                                                          | दस्तऐवज                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम रिअ‍ॅक्ट लोकॅलायझेशन                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आणि मोबाइल ॲप्स, JSON, YAML, Markdown, आणि बरेच काही यासाठी एक-कमांड स्थानिकीकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक पुशवर भाषांतरे ऑटो-कमिट करा + आवश्यक असल्यास पुल रिक्वेस्ट तयार करा        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | वापरकर्त्याने तयार केलेल्या सामग्रीसाठी रिअलटाइम भाषांतर                                | [/sdk](https://lingo.dev/sdk)           |

खाली प्रत्येकाची थोडक्यात माहिती दिली आहे 👇

---

### ⚡️ Lingo.dev CLI

तुमच्या टर्मिनलवरून कोड आणि मजकूर थेट भाषांतरित करा.

```bash
npx lingo.dev@latest run
```

ते प्रत्येक स्ट्रिंगचे फिंगरप्रिंट घेते, निकाल कॅशे करते आणि फक्त बदललेल्या गोष्टींचे पुनर्अनुवाद करते.

[दस्तऐवजाचे अनुसरण करा
 →](https://lingo.dev/cli) ते कसे सेट करायचे ते शिकण्यासाठी.

---

### 🔄 Lingo.dev CI/CD

परिपूर्ण भाषांतरे स्वयंचलितपणे करा.

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

तुमची रेपो नेहमी सक्रिय ठेवा आणि तुमचे उत्पादन बहुभाषिक बनवा — तेही कोणत्याही हाताने कराव्या लागणाऱ्या टप्प्यांशिवाय.

[दस्तऐवज वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

गतीशील मजकुरासाठी प्रत्येक विनंतीवर तात्काळ भाषांतर.

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

चॅट, वापरकर्त्यांच्या प्रतिक्रिया आणि इतर रिअल-टाईम प्रक्रियांसाठी अगदी योग्य.

[दस्तऐवज वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदायावर आधारित आहोत आणि योगदानांचे मनापासून स्वागत करतो!

- एखादी कल्पना सुचली का? [समस्या नोंदवा
](https://github.com/lingodotdev/lingo.dev/issues)
- काहीतरी दुरुस्त करायचे आहे का? [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [Discord वर सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

जर तुम्हाला आम्ही जे करत आहोत ते आवडत असेल, तर आम्हाला ⭐ द्या आणि ४,००० स्टारपर्यंत पोहोचण्यास मदत करा! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमध्ये Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [मराठी](/readme/mr.md)

तुमची भाषा दिसत नाहीये का? ती [`i18n.json`](./i18n.json) मध्ये जोडा आणि एक PR उघडा!
