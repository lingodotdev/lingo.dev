<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - मुक्त-स्रोत, एआय-सक्षम i18n साधन जे LLMs वापरून तत्काळ भाषांतर करते.</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="प्रकाशन" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="परवाना" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="शेवटचा कमिट" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #1 महिन्याचे सर्वोत्तम डेव्हलपर साधन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #1 आठवड्याचे सर्वोत्तम डेव्हलपर साधन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="प्रॉडक्ट हंट #2 दिवसातील सर्वोत्तम उत्पादन" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="GitHub ट्रेंडिंग" />
  </a>
</p>

---

## कंपायलरची ओळख 🆕

**Lingo.dev Compiler** हे एक विनामूल्य, मुक्त-स्रोत मिडलवेअर आहे जे कोणत्याही React अ‍ॅपला बिल्डच्या वेळी बहुभाषिक बनवते — तेही विद्यमान घटक न बदलता.

एकदाच स्थापित करा:

```bash
npm install lingo.dev
```

बिल्ड कॉन्फिगमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश व फ्रेंच बंडल तयार होताना पहा ✨

[संपूर्ण माहिती साठी Docs वाचा →](https://lingo.dev/compiler) आणि [मदतीसाठी Discord →](https://lingo.dev/go/discord) मध्ये सामील व्हा.

---

### या रिपॉझिटरीमध्ये काय आहे?

| साधन         | थोडक्यात वर्णन                                                                         | डॉक्युमेंटेशन                           |
| ------------ | -------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | बिल्ड टाइमवर React चे भाषांतर                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | वेब आणि मोबाईल अ‍ॅप्स, JSON, YAML, markdown इत्यादीसाठी एक कमांडमध्ये भाषांतर          | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक पुशवर स्वयंचलितपणे अनुवाद ऑटो-कमिट आणि आवश्यक असल्यास पुल रिक्वेस्ट तयार करणे | [/ci](https://lingo.dev/ci)             |
| **SDK**      | वापरकर्त्याच्या डायनॅमिक कंटेंटसाठी रिअलटाइम भाषांतर                                   | [/sdk](https://lingo.dev/sdk)           |

खालीलप्रमाणे प्रत्येक साधनाचे एक झटक्यात सारांश 👇

---

### ⚡️ Lingo.dev CLI

थेट टर्मिनलमधून कोड आणि कंटेंटचे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंग ओळखते, परिणाम कॅश करते आणि फक्त बदललेल्या भागांचे भाषांतर पुन्हा करते.

[सेटअपसाठी →](https://lingo.dev/cli) वाचा

---

### 🔄 Lingo.dev CI/CD

पूर्णपणे परफेक्ट अनुवाद स्वयंचलितपणे वितरण करा.

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

हे तुमच्या रेपोला अपडेट ठेवते आणि तुमचे उत्पादन बहुभाषिक ठेवते, मनुष्यहस्तक्षेपाशिवाय

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

डायनॅमिक कंटेंटसाठी प्रति-रिक्वेस्ट भाषांतर.

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

चॅट, युजर कमेंट्स आणि रिअलटाइम कंटेंटसाठी उत्तम पर्याय.

[डॉक्युमेंटेशन वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदाय-चालित प्रकल्प आहोत आणि तुमचे योगदान स्वागतार्ह आहे!

- कल्पना आहे? [इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काही सुधारायचे आहे? [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

आमचे काम आवडत असेल तर आम्हाला एक ⭐ द्या आणि आम्हाला 4,000 स्टारपर्यंत पोहोचण्यास मदत करा! 🌟

[![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमधील Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

तुमची भाषा इथे नाही का पाहत आहात? [`i18n.json`](./i18n.json) मध्ये ती जोडा आणि PR पाठवा!
