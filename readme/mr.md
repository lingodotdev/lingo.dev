<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट LLMs च्या मदतीने त्वरित
    स्थानिकीकरणासाठी.</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="रिलीझ" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="परवाना" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="शेवटचा कमिट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #1 महिन्याचे सर्वोत्तम DevTool" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #1 आठवड्याचे सर्वोत्तम उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #2 दिवसाचे उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="GitHub वर ट्रेंडिंग" />
  </a>
</p>

---

## कंपाइलरची ओळख 🆕

**Lingo.dev कंपाइलर** हे मोफत, ओपन-सोर्स कंपाइलर मिडलवेअर आहे, जे विद्यमान React कंपोनंटमध्ये कोणताही बदल न करता कोणतेही React अ‍ॅप बिल्ड-टाइमवर बहुभाषिक करण्यासाठी तयार केले आहे.

एकदाच इंस्टॉल करा:

```bash
npm install lingo.dev
```

तुमच्या बिल्ड कॉन्फिगमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश व फ्रेंच बंडल्स तयार होताना पाहा ✨

[दस्तऐवज वाचा →](https://lingo.dev/compiler) संपूर्ण मार्गदर्शकासाठी, आणि [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord) तुमच्या सेटअपसाठी मदत मिळवण्यासाठी.

---

### या रेपोमध्ये काय आहे?

| टूल           | संक्षिप्त वर्णन                                                                     | दस्तऐवज                                  |
| ------------ | ------------------------------------------------------------------------------  | --------------------------------------- |
| **कंपाइलर**  | बिल्ड-टाइम React स्थानिकीकरण                                                       | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आणि मोबाइल अ‍ॅप्स, JSON, YAML, Markdown आणि अधिकासाठी एक-कमांड स्थानिकीकरण      | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक push वर अनुवाद स्वयंचलितपणे कमिट करा + आवश्यक असल्यास PR तयार करा             | [/ci](https://lingo.dev/ci)             |
| **SDK**      | वापरकर्त्याद्वारे तयार केलेल्या सामग्रीसाठी रिअलटाइम अनुवाद                                   | [/sdk](https://lingo.dev/sdk)           |

खाली प्रत्येकाचे झटपट तपशील दिले आहेत 👇

---

### ⚡️ Lingo.dev CLI

तुमच्या टर्मिनलवरून थेट कोड आणि सामग्रीचे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगचे फिंगरप्रिंट तयार करते, परिणाम cache मध्ये ठेवते, आणि फक्त बदललेली सामग्रीच पुन्हा अनुवादित करते.

[दस्तऐवज वाचा →](https://lingo.dev/cli) सेटअप कसा करायचा हे जाणून घ्या.

---

### 🔄 Lingo.dev CI/CD

स्वयंचलितपणे अचूक भाषांतरे वितरित करा.

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

हे तुमचे रेपो स्थिर ठेवते आणि उत्पादनाला मॅन्युअल टप्प्यांशिवाय बहुभाषिक बनवते.

[दस्तऐवज वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

गतिशील सामग्रीसाठी तत्काळ प्रति-अनुरोध भाषांतर.

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

चॅट, वापरकर्त्यांच्या टिप्पण्या आणि इतर रिअलटाइम प्रवाहांसाठी उत्तम.

[दस्तऐवज वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदायावर आधारित आहोत आणि योगदानांचे स्वागत करतो!

- काही कल्पना आहे का? [एक इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काही सुधारणा करायच्या आहेत का? [एक PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे का? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

जर तुम्हाला आमचे काम आवडले असेल, तर आम्हाला एक ⭐ द्या आणि आम्हाला 3,000 स्टारपर्यंत पोहोचण्यास मदत करा! 🌟

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमधील README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)  • [मराठी](/readme/mr.md)

तुमची भाषा दिसत नाही का? मध्ये ती जोडा [`i18n.json`](./i18n.json) आणि एक PR उघडा!
