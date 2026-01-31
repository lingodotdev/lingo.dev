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
    ⚡ Lingo.dev - ओपन-सोर्स, AI-आधारित i18n टूलकिट जे LLMs सह त्वरित
    स्थानिकीकरण करते.
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

## Compiler ला भेटा 🆕

**Lingo.dev Compiler** हे एक मोफत, ओपन-सोर्स कंपायलर मिडलवेअर आहे, जे कोणत्याही React अॅपला विद्यमान React components मध्ये कोणतेही बदल न करता बिल्ड टाइमवर बहुभाषिक बनवण्यासाठी डिझाइन केले आहे.

> **टीप:** जर तुम्ही लेगसी कंपायलर (`@lingo.dev/_compiler`) वापरत असाल, तर कृपया `@lingo.dev/compiler` वर स्थलांतरित करा. लेगसी कंपायलर deprecated आहे आणि भविष्यातील रिलीझमध्ये काढून टाकला जाईल.

एकदा इन्स्टॉल करा:

```bash
npm install @lingo.dev/compiler
```

तुमच्या बिल्ड कॉन्फिगमध्ये सक्षम करा:

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

`next build` रन करा आणि स्पॅनिश आणि फ्रेंच बंडल्स बाहेर येताना पहा ✨

[डॉक्स वाचा →](https://lingo.dev/compiler) संपूर्ण मार्गदर्शकासाठी, आणि तुमच्या सेटअपसाठी मदत मिळवण्यासाठी [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord).

---

### या रेपोमध्ये काय आहे?

| टूल          | TL;DR                                                                       | डॉक्स                                   |
| ------------ | --------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | बिल्ड-टाइम React स्थानिकीकरण                                                | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आणि मोबाइल अॅप्स, JSON, YAML, markdown, + अधिकसाठी एक-कमांड स्थानिकीकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक push वर ऑटो-कमिट अनुवाद + आवश्यक असल्यास pull requests तयार करा    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | वापरकर्त्याने तयार केलेल्या सामग्रीसाठी रिअलटाइम अनुवाद                     | [/sdk](https://lingo.dev/sdk)           |

खाली प्रत्येकासाठी द्रुत माहिती आहे 👇

---

### ⚡️ Lingo.dev CLI

तुमच्या टर्मिनलमधून थेट कोड आणि सामग्रीचे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगचे फिंगरप्रिंट करते, परिणाम कॅशे करते आणि फक्त बदललेल्या गोष्टींचे पुन्हा भाषांतर करते.

ते कसे सेट करायचे हे जाणून घेण्यासाठी [डॉक्स फॉलो करा →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

परफेक्ट भाषांतरे आपोआप शिप करा.

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

मॅन्युअल स्टेप्सशिवाय तुमचा रेपो ग्रीन आणि तुमचे प्रॉडक्ट बहुभाषिक ठेवते.

[डॉक्स वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक सामग्रीसाठी तात्काळ प्रति-रिक्वेस्ट भाषांतर.

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

चॅट, यूजर कमेंट्स आणि इतर रिअल-टाइम फ्लोसाठी परफेक्ट.

[डॉक्स वाचा →](https://lingo.dev/sdk)

---

## 🤝 कम्युनिटी

आम्ही कम्युनिटी-ड्रिव्हन आहोत आणि योगदानांचे स्वागत करतो!

- कल्पना आहे? [इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काहीतरी ठीक करायचे आहे? [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार हिस्ट्री

आम्ही जे करत आहोत ते तुम्हाला आवडत असल्यास, आम्हाला ⭐ द्या आणि 10,000 स्टार्सपर्यंत पोहोचण्यात आमची मदत करा! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमध्ये Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

तुमची भाषा दिसत नाही? ती [`i18n.json`](./i18n.json) मध्ये जोडा आणि PR उघडा!

**Locale फॉरमॅट:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) कोड वापरा: `language[-Script][-REGION]`

- भाषा: ISO 639-1/2/3 लोअरकेस (`en`, `zh`, `bho`)
- लिपी: ISO 15924 टायटल केस (`Hans`, `Hant`, `Latn`)
- प्रदेश: ISO 3166-1 alpha-2 अप्परकेस (`US`, `CN`, `IN`)
- उदाहरणे: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
