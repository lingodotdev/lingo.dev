<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट, LLM के साथ तुरंत स्थानीयकरण खातिर।</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="रिलीज" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="लाइसेंस" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="आखिरी कमिट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt महीना के #1 DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt हफ्ता के #1 प्रोडक्ट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt दिन के #2 प्रोडक्ट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github ट्रेंडिंग" />
  </a>
</p>

---

## कंपाइलर से मिलिये 🆕

**Lingo.dev कंपाइलर** एगो मुफ्त, ओपन-सोर्स कंपाइलर मिडलवेयर हवे, जेकरा बनावल गइल बा कि बिल्ड टाइम पर कवनो React ऐप के बहुभाषी बनावल जा सके बिना मौजूदा React कंपोनेंट में कवनो बदलाव के जरूरत पड़े के।

एक बार इंस्टॉल करीं:

```bash
npm install lingo.dev
```

अपना बिल्ड कॉन्फ़िग में सक्षम करीं:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चलावीं आ स्पेनिश आ फ्रेंच बंडल के बाहर निकलत देखीं ✨

[दस्तावेज पढ़ीं →](https://lingo.dev/compiler) पूरा गाइड खातिर, आ [हमारा Discord में शामिल हो जाईं](https://lingo.dev/go/discord) अपना सेटअप में मदद पावे खातिर।

---

### ए रेपो में का बा?

| टूल         | संक्षेप में                                                              | दस्तावेज                                |
| ----------- | ------------------------------------------------------------------------ | --------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम React स्थानीयकरण                                              | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | वेब आ मोबाइल ऐप, JSON, YAML, मार्कडाउन, + बेसी खातिर एक-कमांड स्थानीयकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | हर पुश पर ऑटो-कमिट अनुवाद + जरूरत पड़े त पुल रिक्वेस्ट बनावीं            | [/ci](https://lingo.dev/ci)             |
| **SDK**     | यूजर-जनरेट कंटेंट खातिर रियलटाइम अनुवाद                                  | [/sdk](https://lingo.dev/sdk)           |

नीचे हर एक खातिर जल्दी जानकारी दिहल गइल बा 👇

---

### ⚡️ Lingo.dev CLI

अपना टर्मिनल से सीधा कोड आ कंटेंट के अनुवाद करीं।

```bash
npx lingo.dev@latest run
```

ए हर स्ट्रिंग के फिंगरप्रिंट बनावेला, नतीजा के कैश करेला, आ सिर्फ ओही चीज के दोबारा अनुवाद करेला जवन बदलल बा।

[दस्तावेज के पालन करीं →](https://lingo.dev/cli) एह बात के जाने खातिर कि कइसे सेटअप करीं।

---

### 🔄 Lingo.dev CI/CD

सही अनुवाद के ऑटोमैटिक जहाज करीं।

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

मैनुअल कदम के बिना आपन रेपो के हरियर आ आपन प्रोडक्ट के बहुभाषी रखेला।

[दस्तावेज पढ़ीं →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक कंटेंट खातिर तत्काल प्रति-अनुरोध अनुवाद।

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
// रिटर्न: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

चैट, यूजर कमेंट, आ अन्य रियल-टाइम फ्लो खातिर बढ़िया।

[दस्तावेज पढ़ीं →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हम समुदाय-प्रेरित बाड़ें आ योगदान के प्यार करें लोग!

- कोई विचार बा? [एगो इश्यू खोलीं](https://github.com/lingodotdev/lingo.dev/issues)
- कवनो चीज के ठीक करे के चाहत बानी? [PR भेजीं](https://github.com/lingodotdev/lingo.dev/pulls)
- मदद के जरूरत बा? [हमारा Discord में शामिल हो जाईं](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

अगर राउर हमनी के काम पसंद आवे त, हमनी के एगो ⭐ दिहीं आ 4,000 स्टार तक पहुँचे में हमनी के मदद करीं! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 अन्य भाषा में रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

आपन भाषा नइखे देखत? एकरा [`i18n.json`](./i18n.json) में जोड़ीं आ एगो PR खोलीं!
