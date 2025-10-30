<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ओपन-सोर्स, AI-सञ्चालित i18n टुलकिट, जसले LLMs प्रयोग गरेर तुरुन्त स्थानीयकरण गर्छ।</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कम्पाइलर
</a> •
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

## हाम्रो कम्पाइलर 🆕

**Lingo.dev कम्पाइलर** एक नि:शुल्क, ओपन-सोर्स कम्पाइलर मिडलवेयर हो, जसमा विद्यमान React कम्पोनेन्टहरूमा कुनै परिवर्तन नगरी React एपलाई निर्माणको समयमा बहुभाषी बनाउन सकिन्छ।

एक पटक इन्स्टल गर्नुहोस् :

```bash
npm install lingo.dev
```

आफ्नो बिल्ड कन्फिगमा सक्षम गर्नुहोस्:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चलाउनुहोस् र स्प्यानिश तथा फ्रेन्च बन्डलहरू हेर्नुहोस् ✨

[Docs पढ्नुहोस् →](https://lingo.dev/compiler) पूर्ण मार्गदर्शनका लागि,र आफ्नो सेटअपमा मद्दत पाउन [हाम्रो Discord मा Join गर्नुहोस्](https://lingo.dev/go/discord)

---

### यस रेपो मा के छ?

| टूल          | संक्षिप्त विवरण                                                                          | Docs                                    |
| ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| **कम्पाइलर** | बिल्ड-टाइम React स्थानीयकरण                                                              | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब र मोबाइल एप्स, JSON, YAML, Markdown, + अन्यका लागि एक-कमाण्ड स्थानीयकरण              | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक push मा अनुवादहरूलाई auto-commit गर्नुहोस् + आवश्यक परे pull request बनाउनुहोस् | [/ci](https://lingo.dev/ci)             |
| **SDK**      | प्रयोगकर्ता-निर्मित सामग्रीका लागि real-time अनुवाद                                      | [/sdk](https://lingo.dev/sdk)           |

तल प्रत्येकको लागि छोटो सारांशहरू छन् 👇

---

### ⚡️ Lingo.dev CLI

आफ्नो टर्मिनलबाट सिधै कोड र कन्टेन्ट अनुवाद गर्नुहोस्।

```bash
npx lingo.dev@latest run
```

यसले प्रत्येक स्ट्रिङको फिङ्गरप्रिन्ट गर्छ, परिणामहरूलाई कैश गर्छ, र केवल ती चीजहरूलाई पुनः अनुवाद गर्छ जुन परिवर्तन भएका छन्।

यो कसरी सेटअप गर्ने भनेर जान्न [Docs हर्नुहोस् →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

सुद्ध अनुवादहरू परिपूर्ण रूपमा गर्नुहोस्।

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

तपाईंको रेपो हरियो राख्छ र तपाईंको उत्पादनलाई म्यानुअल चरणहरू बिना बहुभाषी बनाउँछ।

[ Docs पढ्नुहोस् →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

गतिशील सामग्रीका लागि तुरुन्त प्रति-अनुरोध अनुवाद।

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

च्याट, प्रयोगकर्ता टिप्पणिहरू र अन्य रीयल-टाइम फ्लोका लागि उत्तम।
[Docs पढ्नुहोस् →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हामी समुदाय-सञ्चालित छौं र योगदानलाई स्वागत गर्छौं!

- आइडिया छ? [एउटा इश्यू खोल्नुहोस्](https://github.com/lingodotdev/lingo.dev/issues)
- केही सुधार गर्न चाहनुहुन्छ? [PR पठाउनुहोस्](https://github.com/lingodotdev/lingo.dev/pulls)
- मद्दत चाहिन्छ? [Discord मा Join गर्नुहोस्](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

यदि तपाईंलाई हाम्रो काम मन पर्छ भने, हामीलाई एक ⭐ दिनुहोस् र ४,००० स्टारसम्म पुग्न मद्दत गर्नुहोस्! 🌟

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 अन्य भाषाहरूमा रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) •[नेपाली](/readme/ne.md)

आफ्नो भाषा देखिएको छैन? यसलाई [`i18n.json`](./i18n.json) मा थप्नुहोस् र एक PR खोल्नुहोस्!
