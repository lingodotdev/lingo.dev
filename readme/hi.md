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
    ⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट जो LLMs के साथ तत्काल
    स्थानीयकरण के लिए है।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev कंपाइलर</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
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
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 महीने का DevTool"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 सप्ताह का प्रोडक्ट"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 दिन का प्रोडक्ट"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github ट्रेंडिंग"
    />
  </a>
</p>

---

## कंपाइलर से मिलें 🆕

**Lingo.dev कंपाइलर** एक मुफ्त, ओपन-सोर्स कंपाइलर मिडलवेयर है, जो किसी भी React ऐप को बिल्ड टाइम पर बहुभाषी बनाने के लिए डिज़ाइन किया गया है, बिना मौजूदा React कंपोनेंट्स में कोई बदलाव किए।

> **नोट:** यदि आप लीगेसी कंपाइलर (`@lingo.dev/_compiler`) का उपयोग कर रहे हैं, तो कृपया `@lingo.dev/compiler` पर माइग्रेट करें। लीगेसी कंपाइलर को डेप्रिकेट कर दिया गया है और इसे भविष्य की रिलीज़ में हटा दिया जाएगा।

एक बार इंस्टॉल करें:

```bash
npm install @lingo.dev/compiler
```

अपनी बिल्ड कॉन्फ़िग में एनेबल करें:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

`next build` रन करें और स्पैनिश और फ्रेंच बंडल्स को पॉप आउट होते देखें ✨

[डॉक्स पढ़ें →](https://lingo.dev/compiler) पूरी गाइड के लिए, और [हमारे Discord से जुड़ें](https://lingo.dev/go/discord) अपने सेटअप में मदद पाने के लिए।

---

### इस रेपो में क्या है?

| टूल         | TL;DR                                                                        | डॉक्स                                   |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम React लोकलाइज़ेशन                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | वेब और मोबाइल ऐप्स, JSON, YAML, markdown, + अधिक के लिए वन-कमांड लोकलाइज़ेशन | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | हर पुश पर ऑटो-कमिट ट्रांसलेशन + ज़रूरत पड़ने पर pull request बनाएं           | [/ci](https://lingo.dev/ci)             |
| **SDK**     | यूज़र-जेनरेटेड कंटेंट के लिए रियलटाइम ट्रांसलेशन                             | [/sdk](https://lingo.dev/sdk)           |

नीचे प्रत्येक के लिए क्विक हिट्स दिए गए हैं 👇

---

### ⚡️ Lingo.dev CLI

अपने टर्मिनल से सीधे कोड और कंटेंट को ट्रांसलेट करें।

```bash
npx lingo.dev@latest run
```

यह हर स्ट्रिंग को फिंगरप्रिंट करता है, रिज़ल्ट्स को कैश करता है, और केवल वही री-ट्रांसलेट करता है जो बदला है।

[डॉक्स फॉलो करें →](https://lingo.dev/cli) यह जानने के लिए कि इसे कैसे सेट अप करें।

---

### 🔄 Lingo.dev CI/CD

परफेक्ट ट्रांसलेशन ऑटोमैटिकली शिप करें।

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

आपके रेपो को ग्रीन और आपके प्रोडक्ट को मल्टीलिंगुअल रखता है बिना मैनुअल स्टेप्स के।

[डॉक्स पढ़ें →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक कंटेंट के लिए तत्काल प्रति-अनुरोध अनुवाद।

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

चैट, यूज़र कमेंट्स और अन्य रियल-टाइम फ्लो के लिए परफेक्ट।

[डॉक्स पढ़ें →](https://lingo.dev/sdk)

---

## 🤝 कम्युनिटी

हम कम्युनिटी-ड्रिवन हैं और कंट्रिब्यूशन्स को पसंद करते हैं!

- कोई आइडिया है? [इश्यू ओपन करें](https://github.com/lingodotdev/lingo.dev/issues)
- कुछ फिक्स करना चाहते हैं? [PR भेजें](https://github.com/lingodotdev/lingo.dev/pulls)
- मदद चाहिए? [हमारे Discord में शामिल हों](https://lingo.dev/go/discord)

## ⭐ स्टार हिस्ट्री

अगर आपको हमारा काम पसंद है, तो हमें ⭐ दें और 10,000 स्टार्स तक पहुंचने में मदद करें! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 अन्य भाषाओं में Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

अपनी भाषा नहीं दिख रही? इसे [`i18n.json`](./i18n.json) में जोड़ें और PR ओपन करें!

**लोकेल फॉर्मेट:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) कोड्स का उपयोग करें: `language[-Script][-REGION]`

- भाषा: ISO 639-1/2/3 लोअरकेस (`en`, `zh`, `bho`)
- स्क्रिप्ट: ISO 15924 टाइटल केस (`Hans`, `Hant`, `Latn`)
- रीजन: ISO 3166-1 alpha-2 अपरकेस (`US`, `CN`, `IN`)
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
