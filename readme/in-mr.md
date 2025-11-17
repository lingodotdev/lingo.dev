<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट — LLM च्या मदतीने त्वरित स्थानिकीकरणासाठी.</strong>
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

## कंपायलरची ओळख 🆕

**Lingo.dev Compiler** हा एक मोफत, ओपन-सोर्स कंपायलर मिडलवेअर आहे — विद्यमान React घटकांमध्ये कोणताही बदल न करता कोणत्याही React अॅपला बिल्डवेळी बहुभाषिक बनवण्यासाठी डिझाइन केलेला.

इंस्टॉल करा:

```bash
npm install lingo.dev
```

आपल्या बिल्ड कॉन्फिगरेशनमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल्स तयार होताना पहा ✨

पूर्ण मार्गदर्शकासाठी [डॉक वाचा →](https://lingo.dev/compiler)  
आणि मदतीसाठी [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

---

### या रेपॉमध्ये काय आहे?

| साधन | थोडक्यात | डॉक्स |
| ---- | ---------- | ------ |
| **Compiler** | बिल्डवेळी React अॅप्सचे स्थानिकीकरण | [/compiler](https://lingo.dev/compiler) |
| **CLI** | वेब आणि मोबाइल अॅप्ससाठी, JSON, YAML, Markdown साठी एकाच कमांडमध्ये भाषांतर | [/cli](https://lingo.dev/cli) |
| **CI/CD** | प्रत्येक push वर ट्रान्सलेशन्स ऑटो-कमिट करा आणि गरज असल्यास PR तयार करा | [/ci](https://lingo.dev/ci) |
| **SDK** | वापरकर्त्याद्वारे तयार केलेल्या सामग्रीसाठी रिअल-टाइम भाषांतर | [/sdk](https://lingo.dev/sdk) |

खाली प्रत्येकाचा झटपट आढावा 👇

---

### ⚡️ Lingo.dev CLI

टर्मिनलमधून थेट कोड आणि सामग्री भाषांतरित करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगचे फिंगरप्रिंट घेते, परिणाम कॅश करते आणि फक्त बदललेलेच पुन्हा भाषांतर करते.

[डॉक वाचा →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

स्वयंचलितपणे योग्य भाषांतरे वितरीत करा.

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

तुमचे रेपो नेहमी हिरवे ठेवा आणि तुमचे उत्पादन बहुभाषिक बनवा 🌍.

[डॉक वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक सामग्रीसाठी त्वरित भाषांतर मिळवा.

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
// परिणाम: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

चॅट, वापरकर्ता टिप्पण्या आणि रिअल-टाइम सामग्रीसाठी उत्तम.

[डॉक वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदायावर आधारित आहोत — तुमच्या योगदानाचे आम्ही स्वागत करतो!

- काही कल्पना आहे का? [Issue उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काही दुरुस्त करायचे आहे का? [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे का? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

जर तुम्हाला आमचे काम आवडले असेल तर ⭐ द्या आणि आम्हाला 4,000 स्टार गाठण्यास मदत करा! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमधील README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

तुमची भाषा दिसत नाही का? [`i18n.json`](./i18n.json) मध्ये ती जोडा आणि PR उघडा!
