<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - खुला-स्रोत, एआई-संचालित i18n टूलकिट जवन LLMs के साथ तुरंते लोकलाइज़ेशन करे ला।</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="रिलीज़" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="लाइसेंस" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="पिछला कमिट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="प्रोडक्ट हंट #1 डेवलपर टूल ऑफ द मंथ" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="प्रोडक्ट हंट #1 प्रोडक्ट ऑफ द वीक" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="प्रोडक्ट हंट #2 प्रोडक्ट ऑफ द डे" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="गिटहब ट्रेंडिंग" />
  </a>
</p>

---

## Compiler से मिलल 🆕  

**Lingo.dev Compiler** एगो मुफ़्त, खुला-स्रोत कंपाइलर मिडलवेयर बा, जवन रिएक्ट ऐप के बिना कोड बदले मल्टीलिंगुअल बनावे में मदद करे ला।

इंस्टॉल करीं:
```bash
npm install lingo.dev

```

आपन बिल्ड कॉन्फ़िग में जोड़ीं:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

अब next build चलाईं आ देखीं — स्पैनिश आ फ्रेंच बंडल तैयार हो जाई ✨

पूरा गाइड खातिर [डॉक्स पढ़ीं →](https://lingo.dev/compiler) आ मदद खातिर [हमरा डिस्कॉर्ड से जुड़ीं →](https://lingo.dev/go/discord)।

---

### एह रेपो में का बा?
| टूल         | छोट विवरण                                                              | डॉक्स                                   |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------- |
| **कंपाइलर** | बिल्ड टाइम पर React लोकलाइज़ेशन                                        | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | एक कमांड में वेब/मोबाइल ऐप लोकलाइज़ेशन, JSON, YAML, markdown वगैरह     | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | हर पुश पर ऑटोमैटिक ट्रांसलेशन कमिट और जरूरत होखे त पुल रिक्वेस्ट बनावे | [/ci](https://lingo.dev/ci)             |
| **SDK**     | यूज़र जनरेटेड कंटेंट के रियलटाइम ट्रांसलेशन                            | [/sdk](https://lingo.dev/sdk)           |


नीचे हर टूल के झलक बा 👇

---

### ⚡️ Lingo.dev CLI

टर्मिनल से सीधा कोड आ कंटेंट ट्रांसलेट करीं।

```bash
npx lingo.dev@latest run
```

ई हर स्ट्रिंग के फिंगरप्रिंट करेला, रिजल्ट कैश करेला, आ सिर्फ नया बदलेल चीज़ के ट्रांसलेट करेला।

सेटअप सीखे खातिर [डॉक्स फॉलो करीं →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

हर पुश पर आपन ट्रांसलेशन ऑटोमैटिक भेजीं।

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

एहसे तोहरा रेपो ग्रीन रही, आ तोहार प्रोडक्ट मल्टीलिंगुअल बिना मेहनत के बन जाई।

[डॉक्स पढ़ीं →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनमिक कंटेंट के तुरंत ट्रांसलेशन खातिर।

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

ई चैट, यूज़र कमेंट आ रियलटाइम यूज़र फ्लो खातिर बढ़िया बा।

[डॉक्स पढ़ीं →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हमनी के कम्युनिटी-ड्रिवन बानी आ योगदान बहुत पसंद करेली!

- नया आइडिया बा? [इश्यू खोलीं](https://github.com/lingodotdev/lingo.dev/issues)
- कुछ ठीक करे के बा? [PR भेजीं](https://github.com/lingodotdev/lingo.dev/pulls)
- मदद चाहीं? [डिस्कॉर्ड में आवीं](https://lingo.dev/go/discord)

## ⭐ स्टार हिस्ट्री

अगर तोहरा के हमनी के काम पसंद आइल, त ⭐ दीं आ हमनी के 4000 स्टार तक पहुँचावे में मदद करीं 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 बाकिर भाषा में पढ़ीं

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) 

अगर तोहरे भाषा नइखे लिस्ट में? त [`i18n.json`](./i18n.json) में जोड़ के PR भेज दीं!
