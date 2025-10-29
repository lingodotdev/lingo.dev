<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ओपन-सोर्स, AI-पावर्ड i18n टूलकिट जे LLM वापरून त्वरित स्थानिकीकरण करते.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
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

## Compiler भेट द्या 🆕

**Lingo.dev Compiler** हा एक फ्री, ओपन-सोर्स कंपाइलर मिडलवेअर आहे, जो कोणत्याही React अॅपला बिल्ड टाइममध्ये मल्टीलिंग्वल बनवण्यासाठी डिझाइन केलेला आहे, कोणत्याही विद्यमान React कंपोनंट्समध्ये बदल करण्याची गरज नसल्याने.

एकदा इंस्टॉल करा:

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

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल्स पॉप आउट पाहा ✨

पूर्ण मार्गदर्शिका साठी [डॉक्स वाचा →](https://lingo.dev/compiler), आणि तुमच्या सेटअपमध्ये मदत मिळवण्यासाठी [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord).

---

### या रेपोमध्ये काय आहे?

| Tool         | TL;DR                                                                          | Docs                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | बिल्ड-टाइम React स्थानिकीकरण                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आणि मोबाइल अॅप्स, JSON, YAML, मार्कडाउन, आणि अधिकसाठी एक-कमांड स्थानिकीकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक पुशवर ऑटो-कमिट अनुवाद आणि आवश्यक असल्यास पुल रिक्वेस्ट तयार करा        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | वापरकर्ता-जनरेटेड सामग्रीसाठी रिअलटाइम अनुवाद                                | [/sdk](https://lingo.dev/sdk)           |

खाली प्रत्येकासाठी क्विक हिट्स आहेत 👇

---

### ⚡️ Lingo.dev CLI

तुमच्या टर्मिनलमधून थेट कोड आणि सामग्रीचे अनुवाद करा.

```bash
npx lingo.dev@latest run
```

ते प्रत्येक स्ट्रिंगला फिंगरप्रिंट करते, परिणाम कॅश करते, आणि फक्त बदललेले पुन्हा अनुवाद करते.

सेटअप कसे करायचे हे शिकण्यासाठी [डॉक्स फॉलो करा →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

परफेक्ट अनुवाद ऑटोमॅटिकली शिप करा.

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

तुमचा रेपो ग्रीन ठेवतो आणि तुमचा प्रोडक्ट मल्टीलिंग्वल ठेवतो मॅन्युअल स्टेप्सशिवाय.

[डॉक्स वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक सामग्रीसाठी इन्स्टंट पेर-रिक्वेस्ट अनुवाद.

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

चॅट, वापरकर्ता कमेंट्स, आणि इतर रिअल-टाइम फ्लोमध्ये परफेक्ट.

[डॉक्स वाचा →](https://lingo.dev/sdk)

---

## 🤝 कम्युनिटी

आम्ही कम्युनिटी-ड्रिव्हन आहोत आणि योगदानांना प्रेम करतो!

- कल्पना आहे? [इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काहीतरी फिक्स करायचे आहे? [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार हिस्टरी

तुम्हाला आमचे काम आवडले तर, आम्हाला ⭐ द्या आणि आम्हाला 4,000 स्टार्सपर्यंत पोहोचण्यास मदत करा! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमध्ये रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

तुमची भाषा दिसत नाही? [`i18n.json`](./i18n.json) मध्ये जोडा आणि PR उघडा!
