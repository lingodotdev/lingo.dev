<![CDATA[<p align="center">
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
    ⚡ Lingo.dev - LLMs सह त्वरित स्थानिकीकरणासाठी मुक्त-स्रोत, AI-संचालित i18n साधने.
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
      alt="परवाना"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="शेवटचा कमिट"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="महिन्यातील #१ DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="आठवड्यातील #१ उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="दिवसातील #२ उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github वर ट्रेंडिंग" />
  </a>
</p>

---

## कंपाइलरची ओळख 🆕

**Lingo.dev कंपाइलर** हे एक मुफत, मुक्त-स्रोत कंपाइलर मिडलवेअर आहे, जे विद्यमान React कंपोनंट्समध्ये कोणताही बदल न करता बिल्ड टाइमला कोणत्याही React अॅपला बहुभाषिक बनवण्यासाठी डिझाइन केले आहे.

एकदाच इन्स्टॉल करा:

```bash
npm install lingo.dev
```

तुमच्या बिल्ड कॉन्फिगमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल्स पॉप आउट पहा ✨

संपूर्ण मार्गदर्शनासाठी [डॉक्युमेंटेशन वाचा →](https://lingo.dev/compiler), आणि तुमच्या सेटअपमध्ये मदत मिळवण्यासाठी [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord).

---

### या रिपोमध्ये काय आहे?

| टूल         | थोडक्यात                                                                      | डॉक्युमेंटेशन                            |
| ----------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम React स्थानिकीकरण                                                | [/compiler](https://lingo.dev/compiler)   |
| **CLI**     | वेब आणि मोबाईल अॅप्स, JSON, YAML, मार्कडाउन, + अधिकसाठी एक-कमांड स्थानिकीकरण | [/cli](https://lingo.dev/cli)             |
| **CI/CD**   | प्रत्येक पुशवर ऑटो-कमिट भाषांतरे + आवश्यक असल्यास पुल रिक्वेस्ट तयार करा    | [/ci](https://lingo.dev/ci)               |
| **SDK**     | वापरकर्ता-निर्मित सामग्रीसाठी रिअलटाइम भाषांतर                              | [/sdk](https://lingo.dev/sdk)             |

खाली प्रत्येकासाठी त्वरित माहिती दिली आहे 👇

---

### ⚡️ Lingo.dev CLI

तुमच्या टर्मिनलमधून थेट कोड आणि सामग्रीचे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगची फिंगरप्रिंट बनवते, निकाल कॅशे करते, आणि फक्त बदललेल्या गोष्टींचे पुन्हा भाषांतर करते.

ते कसे सेट करायचे ते जाणून घेण्यासाठी [डॉक्युमेंटेशन अनुसरा →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

स्वयंचलितपणे संपूर्ण भाषांतरे शिप करा.

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

तुमचे रिपो हिरवे आणि तुमचे उत्पादन मॅन्युअल पायऱ्यांशिवाय बहुभाषिक ठेवते.

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक सामग्रीसाठी प्रति-विनंती तात्काळ भाषांतर.

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

चॅट, वापरकर्ता टिप्पण्या आणि इतर रिअल-टाइम फ्लोसाठी उत्कृष्ट.

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदाय-चालित आहोत आणि योगदानांचे स्वागत करतो!

- एखादा विचार आहे? [एक इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काहीतरी दुरुस्त करायचे आहे? [एक PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

जर तुम्हाला आमचे काम आवडत असेल, तर आम्हाला एक ⭐ द्या आणि ३,००० स्टार्सपर्यंत पोहोचण्यात आमची मदत करा! 🌟

[

![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमध्ये रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [मराठी](/readme/mr.md) • [فارسی](/readme/fa.md)

तुमची भाषा दिसत नाही? ती [`i18n.json`](./i18n.json) मध्ये जोडा आणि एक PR उघडा!

---]]>