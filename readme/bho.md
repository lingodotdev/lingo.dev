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
    ⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट जवन LLMs के साथ तुरंत
    स्थानीयकरण खातिर बा।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## Compiler से मिलीं 🆕

**Lingo.dev Compiler** एगो मुफ्त, ओपन-सोर्स कंपाइलर मिडलवेयर बा, जवन कवनो भी React ऐप के बिल्ड टाइम पर बहुभाषी बनावे खातिर डिजाइन कइल गइल बा बिना मौजूदा React कंपोनेंट्स में कवनो बदलाव के जरूरत के।

एक बेर इंस्टॉल करीं:

```bash
npm install @lingo.dev/compiler
```

अपना बिल्ड कॉन्फिग में सक्षम करीं:

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

`next build` चलाईं आ स्पेनिश आ फ्रेंच बंडल्स के निकलत देखीं ✨

[डॉक्स पढ़ीं →](https://lingo.dev/compiler) पूरा गाइड खातिर, आ [हमनी के Discord में शामिल होईं](https://lingo.dev/go/discord) अपना सेटअप में मदद पावे खातिर।

---

### ए रेपो में का बा?

| टूल          | TL;DR                                                                     | डॉक्स                                   |
| ------------ | ------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | बिल्ड-टाइम React स्थानीयकरण                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आ मोबाइल ऐप्स, JSON, YAML, markdown, + अउरी खातिर एक-कमांड स्थानीयकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | हर पुश पर ऑटो-कमिट अनुवाद + जरूरत पड़ला पर पुल रिक्वेस्ट बनाईं            | [/ci](https://lingo.dev/ci)             |
| **SDK**      | यूजर-जेनरेटेड कंटेंट खातिर रियलटाइम अनुवाद                                | [/sdk](https://lingo.dev/sdk)           |

नीचे हर एक के खातिर त्वरित हिट बा 👇

---

### ⚡️ Lingo.dev CLI

अपना टर्मिनल से सीधे कोड आ सामग्री के अनुवाद करीं।

```bash
npx lingo.dev@latest run
```

ई हर स्ट्रिंग के फिंगरप्रिंट करेला, परिणाम के कैश करेला, आ सिर्फ ओही के दोबारा अनुवाद करेला जवन बदल गइल बा।

[दस्तावेज़ के फॉलो करीं →](https://lingo.dev/cli) एकरा के सेट अप करे के तरीका जाने खातिर।

---

### 🔄 Lingo.dev CI/CD

परफेक्ट अनुवाद के अपने आप भेजीं।

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

राउर रेपो के हरियर आ राउर प्रोडक्ट के बहुभाषी बनवले रहेला बिना मैनुअल स्टेप के।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनामिक सामग्री खातिर तुरंत प्रति-अनुरोध अनुवाद।

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

चैट, यूजर कमेंट, आ अउरी रियल-टाइम फ्लो खातिर परफेक्ट बा।

[दस्तावेज़ पढ़ीं →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

हमनी के समुदाय-संचालित बानी आ योगदान के प्यार करीला!

- कवनो विचार बा? [एगो इश्यू खोलीं](https://github.com/lingodotdev/lingo.dev/issues)
- कुछ ठीक करे के चाहत बानी? [एगो PR भेजीं](https://github.com/lingodotdev/lingo.dev/pulls)
- मदद चाहीं? [हमनी के Discord में शामिल होईं](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

अगर राउर का हमनी के करत बानी ओकरा पसंद बा, त हमनी के एगो ⭐ दीं आ 6,000 स्टार तक पहुंचे में मदद करीं! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 दोसर भाषा में रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

अपना भाषा ना देख रहल बानी? एकरा [`i18n.json`](./i18n.json) में जोड़ के PR खोल दीं!

**लोकेल फॉर्मेट:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) कोड इस्तेमाल करीं: `language[-Script][-REGION]`

- भाषा: ISO 639-1/2/3 छोट अक्षर (`en`, `zh`, `bho`)
- लिपि: ISO 15924 टाइटल केस (`Hans`, `Hant`, `Latn`)
- क्षेत्र: ISO 3166-1 alpha-2 बड़ अक्षर (`US`, `CN`, `IN`)
- उदाहरण: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
