<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - खुला स्रोत (open-source), AI-चालित i18n टुलकिट, जसले LLMs प्रयोग गरेर तुरुन्त अनुवाद (localization) गर्न सक्छ।</strong>
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

## Compiler भेट्नुहोस् 🆕

**Lingo.dev Compiler** एउटा निःशुल्क, खुला स्रोत कम्पाइलर मिडलवेयर हो, जसले कुनै पनि React एपलाई बहुभाषिक (multilingual) बनाउन सहयोग गर्छ, त्यो पनि build-time मा, कुनै पनि विद्यमान React component परिवर्तन नगरी।

इन्स्टल गर्न:

```bash
npm install lingo.dev
````

Build config मा सक्षम गर्न:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चलाउनुहोस् र Spanish र French bundle हरू स्वतः देख्नुहोस् ✨

[पूरा गाइड पढ्नुहोस् →](https://lingo.dev/compiler), र [हाम्रो Discord मा सहभागी हुनुहोस्](https://lingo.dev/go/discord) — तपाईंको सेटअपमा सहयोगका लागि।

---

### यो रेपोजिटरीमा के छ?

| Tool         | TL;DR                                                                 | Docs                                    |
| ------------ | --------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Build-time React localization                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब र मोबाइल एप्स, JSON, YAML, markdown आदि को लागि एक-कमाण्ड अनुवाद  | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | हरेक push मा translation commit गर्छ + आवश्यक परे pull request बनाउँछ | [/ci](https://lingo.dev/ci)             |
| **SDK**      | प्रयोगकर्ताद्वारा सिर्जित सामग्रीहरूको realtime अनुवाद                | [/sdk](https://lingo.dev/sdk)           |

प्रत्येकको छोटो विवरण तल दिइएको छ 👇

---

### ⚡️ Lingo.dev CLI

तपाईंको टर्मिनलबाट सीधै कोड र सामग्री अनुवाद गर्नुहोस्।

```bash
npx lingo.dev@latest run
```

यसले हरेक string लाई fingerprint गर्छ, cache मा राख्छ, र परिवर्तन भएका मात्र string पुन: अनुवाद गर्छ।

[Docs पढ्नुहोस् →](https://lingo.dev/cli) यसलाई कसरी सेटअप गर्ने भनेर सिक्न।

---

### 🔄 Lingo.dev CI/CD

सही अनुवादहरू स्वचालित रूपमा पठाउनुहोस्।

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

यसले तपाईंको रेपोजिटरीलाई हरियो (up-to-date) राख्छ र तपाईंको उत्पादनलाई बहुभाषिक बनाउँछ — कुनै पनि म्यानुअल चरणहरू बिना।

[Docs पढ्नुहोस् →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक सामग्रीहरूको लागि instant per-request translation।

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

Chat, user comments, र अन्य realtime flows का लागि उपयुक्त।

[Docs पढ्नुहोस् →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हामी समुदाय-आधारित छौं र योगदान (contribution) मन पराउँछौं!

* नयाँ आइडिया छ? [Issue खोल्नुहोस्](https://github.com/lingodotdev/lingo.dev/issues)
* केही सुधार गर्न चाहनुहुन्छ? [Pull Request पठाउनुहोस्](https://github.com/lingodotdev/lingo.dev/pulls)
* सहायता चाहियो? [Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)

---

## ⭐ Star इतिहास

यदि तपाईंलाई हाम्रो काम मन पर्‍यो भने, कृपया ⭐ दिनुहोस् र हामीलाई 4,000 स्टारमा पुर्‍याउन मद्दत गर्नुहोस्! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev\&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

---

## 🌐 अन्य भाषामा Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

तपाईंको भाषा देख्नुभयो? यदि छैन भने [`i18n.json`](./i18n.json) मा थप्नुहोस् र PR खोल्नुहोस्!
