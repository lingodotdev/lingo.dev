<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - खुला स्रोत, AI द्वारा संचालित i18n उपकरण जसले LLMs मार्फत तुरुन्त स्थानीयकरण गर्छ।</strong>
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

## कम्पाइलर भेट्नुहोस् 🆕

**Lingo.dev Compiler** एउटा निःशुल्क, खुला स्रोत कम्पाइलर मिडलवेयर हो, जसले कुनै पनि React एपलाई निर्माण समयमा बहुभाषिक बनाउँछ — कुनै पनि विद्यमान React कम्पोनेन्टहरू परिवर्तन नगरी।

एक पटक स्थापना गर्नुहोस्:

````bash
npm install lingo.dev

तपाईंको बिल्ड कन्फिगमा सक्षम गर्नुहोस्:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
````

`next build` चलाउनुहोस् र स्पेनिश र फ्रेन्च बन्डलहरू पप आउट हेर्नुहोस् ✨

पूर्ण गाइडको लागि [डकुमेन्टेसन पढ्नुहोस् →](https://lingo.dev/compiler), र तपाईंको सेटअपमा मद्दत प्राप्त गर्न [हाम्रो Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)।

---

### यो रिपोमा के-के छ?

| टुल          | संक्षिप्तमा                                                                | डकुमेन्टेसन                             |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| **कम्पाइलर** | बिल्ड-टाइम React स्थानीयकरण                                                | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब र मोबाइल एप्स, JSON, YAML, markdown र अन्यको लागि एक-कमान्ड स्थानीयकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | हरेक पुशमा अटो-कमिट अनुवाद + आवश्यक भएमा पुल रिक्वेस्ट सिर्जना             | [/ci](https://lingo.dev/ci)             |
| **SDK**      | प्रयोगकर्ता-सिर्जित सामग्रीको लागि रियलटाइम अनुवाद                         | [/sdk](https://lingo.dev/sdk)           |

तल प्रत्येकको लागि द्रुत जानकारी छ 👇

---

### ⚡️ Lingo.dev CLI

सिधै तपाईंको टर्मिनलबाट कोड र सामग्री अनुवाद गर्नुहोस्।

```bash
npx lingo.dev@latest run
```

यसले हरेक स्ट्रिङको फिंगरप्रिन्ट बनाउँछ, नतिजाहरू क्यास गर्छ, र केवल परिवर्तन भएका कुराहरूको मात्र पुन: अनुवाद गर्छ।

यसलाई कसरी सेटअप गर्ने भन्ने जान्न [डकुमेन्टेसन पछ्याउनुहोस् →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

पूर्ण अनुवादहरू स्वचालित रूपमा पठाउनुहोस्।

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

तपाईंको रिपो सधैं हरियो रहोस्, र उत्पादन बहुभाषिक बनोस् — बिना झन्झट।

[डक्स पढ्नुहोस् →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक सामग्रीका लागि तत्काल अनुवाद।

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

च्याट, प्रयोगकर्ता टिप्पणीहरू, र वास्तविक-समय सामग्रीका लागि उत्कृष्ट।

[डक्स पढ्नुहोस् →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हामी समुदायद्वारा प्रेरित छौं र योगदान स्वागत गर्छौं!

- नयाँ विचार छ? [Issue खोल्नुहोस्](https://github.com/lingodotdev/lingo.dev/issues)
- केही सुधार गर्न चाहनुहुन्छ? [Pull Request पठाउनुहोस्](https://github.com/lingodotdev/lingo.dev/pulls)
- सहयोग चाहियो? [Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

यदि तपाईंलाई हाम्रो काम मनपर्छ भने, कृपया ⭐ दिनुहोस् र हामीलाई ४,००० स्टारसम्म पुग्न मद्दत गर्नुहोस्! 🌟

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 अन्य भाषाहरूमा रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [नेपाली](/readme/ne.md)

यदि तपाईंको भाषा सूचीमा छैन भने, ['i18n.json'](./i18n.json) मा थप्नुहोस् र PR पठाउनुहोस्!
