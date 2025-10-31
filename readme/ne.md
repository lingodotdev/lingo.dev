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
    ⚡ Lingo.dev - खुला-स्रोत, AI द्वारा सञ्चालित i18n टुलकिट, जसले LLMs प्रयोग गरेर तुरुन्त अनुवाद (localization) सक्षम बनाउँछ।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कम्पाइलर</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="रिलीज़"
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

## कम्पाइलरलाई चिनौँ 🆕

**Lingo.dev कम्पाइलर** एक निःशुल्क, खुला-स्रोत कम्पाइलर मिडलवेयर हो, जसले कुनै पनि React एपलाई बहुभाषिक बनाउँछ — त्यो पनि बिना कुनै परिवर्तन, निर्माण (build) समयमा नै।

एकपटक इन्स्टल गर्नुहोस्:

```bash
npm install lingo.dev
```

तपाईंको build configuration मा सक्षम गर्नुहोस्:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

अब `next build` चलाउँदा स्प्यानिस र फ्रेन्च बन्डलहरू तयार हुन्छन् ✨

[पूरा दस्तावेज पढ्नुहोस् →](https://lingo.dev/compiler) र सहयोगको लागि [हाम्रो Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)।

---

### यस रेपोमा के-के छन्?

| उपकरण        | छोटो विवरण                                                                 | दस्तावेज                                 |
| ------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| **कम्पाइलर**  | निर्माण (build) समयमा React अनुवाद                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**       | वेब/मोबाइल एप, JSON, YAML, Markdown आदि का लागि एक कमाण्डमै स्थानीयकरण       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**     | प्रत्येक push मा अनुवादहरू स्वत: कमिट गर्ने र आवश्यक परेमा पुल रिक्वेस्ट बनाउने | [/ci](https://lingo.dev/ci)             |
| **SDK**       | प्रयोगकर्ताबाट आएको सामग्रीका लागि रियलटाइम अनुवाद                            | [/sdk](https://lingo.dev/sdk)           |

तल प्रत्येकको लागि छिटो जानकारी दिइएको छ 👇

---

### ⚡️ Lingo.dev CLI

टर्मिनलबाटै कोड र सामग्री अनुवाद गर्नुहोस्:

```bash
npx lingo.dev@latest run
```

CLI ले प्रत्येक स्ट्रिङको फिङ्गरप्रिन्ट बनाउँछ, परिणामहरू क्यास गर्छ र मात्र परिवर्तन भएका वस्तुहरू पुनःअनुवाद गर्छन्।

[CLI दस्तावेज पढ्नुहोस् →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

सटीक अनुवादहरू स्वतः पठाउनुहोस्।

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

तपाईंको रेपो सधैं हरियो (अप-टु-डेट) राख्छ र तपाईंको उत्पादनलाई बहुभाषिक बनाउँछ, कुनै म्यानुअल कदम बिना।

[CI/CD दस्तावेज पढ्नुहोस् →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक सामग्रीका लागि अनुरोध-प्रति तत्काल अनुवाद:

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

च्याट, प्रयोगकर्ता टिप्पणीहरू, र अन्य वास्तविक समयका प्रवाहहरूका लागि एकदम उपयुक्त।

[SDK दस्तावेज पढ्नुहोस् →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हामी समुदाय-केन्द्रित छौं र तपाईंको योगदानलाई माया गर्छौं!

- कुनै विचार छ? [एउटा इश्यू खोल्नुहोस्](https://github.com/lingodotdev/lingo.dev/issues)
- केही सुधार गर्न चाहनुहुन्छ? [PR पठाउनुहोस्](https://github.com/lingodotdev/lingo.dev/pulls)
- सहयोग चाहिन्छ? [हाम्रो Discord मा सामेल हुनुहोस्](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

यदि तपाईंलाई हाम्रो काम मन परेको छ भने, हामीलाई ⭐ दिनुहोस् र ४,००० स्टारमा पुग्न सहयोग गर्नुहोस्! 🌟

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](<https://www.star-history.com/#lingodotdev/lingo.dev&Date>)

## 🌐 अन्य भाषामा Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

यदि तपाईंले आफ्नो भाषा देख्नु भएन भने, कृपया यसलाई [`i18n.json`](./i18n.json) मा थप्नुहोस् र PR खोल्नुहोस्।
