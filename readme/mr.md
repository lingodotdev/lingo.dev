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
    ⚡मोठ्या भाषिक मॉडेल्सवर आधारित त्वरित भाषांतरासाठी एक AI-शक्ती असलेले मुक्त-स्रोत साधन.
  </strong>
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
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="प्रकाशन"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="परवाना (License)"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="शेवटचा कमिट"
    />
  </a>
</p>

---

## कंपायलरशी ओळख करा 🆕

**Lingo.dev कंपाइलर** एक मोफत, मुक्त-स्रोत कंपायलर मिडलवेअर है, जो मौजूदा React कंपोनेंट्स में कोई परिवर्तन किए बिना बिल्ड टाइम पर किसी भी React ऐप को अनेक भाषांमध्ये रूपांतर करण्यासाठी डिझाइन केलेले आहे।

एकदाच स्थापित करा:

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

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल्स दिसताना पहा ✨✨

संपूर्ण मार्गदर्शनासाठी दस्तऐवज वाचा → आणि आपल्या सेटअपसाठी मदत मिळवण्यासाठी आमच्या Discord मध्ये सामील व्हा.

---

### या रेपोमध्ये काय आहे?

| साधन         | थोडक्यात वर्णन                                                         | दस्तऐवज                               |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **कंपाइलर** | बिल्ड-वेळी React स्थानीयकरण                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | वेब आणि मोबाइल ॲप्स, JSON, YAML, markdown आणि अधिकसाठी एका कमांडमध्ये स्थानिकीकरण | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | प्रत्येक पुशवर भाषांतरे स्वयंचलितपणे कमिट करा + आवश्यक असल्यास पुल विनंत्या तयार करा      | [/ci](https://lingo.dev/ci)             |
| **SDK**     | वापरकर्त्याने तयार केलेल्या सामग्रीसाठी रिअल-टाइम भाषांतर                               | [/sdk](https://lingo.dev/sdk)           |

प्रत्येकाचा एक त्वरित आढावा खालीलप्रमाणे आहे 👇
---

### ⚡️ Lingo.dev CLI

आपल्या टर्मिनलवरून थेट कोड आणि सामग्रीचे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगसाठी फिंगरप्रिंट तयार करते, परिणाम कॅश करते आणि केवळ बदललेल्या भागाचे पुन्हा भाषांतर करते.


[दस्तऐवजाचे अनुसरण करा →](https://lingo.dev/cli) हे कसे सेट करायचे हे शिकण्यासाठी

---

### 🔄 Lingo.dev CI/CD

परिपूर्ण भाषांतरे आपोआप पाठवा.

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

तुमची रेपॉजिटरी ग्रीन ठेवते आणि तुमचे उत्पादन कोणत्याही मॅन्युअल चरणांशिवाय बहुभाषिक ठेवते.

[दस्तऐवज वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक सामग्रीसाठी मागणीनुसार त्वरित भाषांतर.

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

चॅट, वापरकर्ता प्रतिक्रिया आणि इतर रिअल-टाइम फ्लोसाठी योग्य.

[दस्तऐवज वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदाय-चालित आहोत आणि योगदानाचे स्वागत करतो!

- एखादी कल्पना आहे? [एक समस्या उघडा (Open an issue)](https://github.com/lingodotdev/lingo.dev/issues)
- काहीतरी निश्चित करायचे आहे?  [एक पीआर (PR) पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत पाहिजे?? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

तुम्हाला आमचे कार्य आवडल्यास, आम्हाला ⭐ द्या आणि आम्हाला ४,००० स्टार्स पर्यंत पोहोचण्यास मदत करा! 🌟

[

![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमधील README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [marathi](/readme/mr.md)

तुमची भाषा दिसत नाहीये? तिला[`i18n.json`](./i18n.json) मध्ये जोडा आणि एक पीआर (PR) उघडा!
