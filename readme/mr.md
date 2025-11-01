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
    ⚡ Lingo.dev - ओपन-सोर्स, AI-चालित i18n टूलकिट LLMs सहित द्रुत
    स्थानिकीकरण साठी.
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
      alt="रिलीज"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="परवाना"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="शेवटची कमिट"
    />
  </a>
</p>

---

## कंपाइलरशी परिचित व्हा 🆕

**Lingo.dev कंपाइलर** हे एक मोफत, ओपन-सोर्स कंपाइलर मिडलवेअर आहे, जे विद्यमान React कॉम्पोनेंट्समध्ये कोणतेही बदल न करता बिल्ड वेळी कोणत्याही React ॲपला बहुभाषी बनवण्यासाठी डिझाइन केले आहे.

एकदा इंस्टॉल करा:

```bash
npm install lingo.dev
```

आपल्या बिल्ड कॉन्फिगमध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा आणि स्पॅनिश आणि फ्रेंच बंडल दिसू लागेल ✨

[दस्तावेज वाचा →](https://lingo.dev/compiler) पूर्ण मार्गदर्शकासाठी, आणि [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord) आपला सेटअप मध्ये मदत मिळविण्यासाठी.

---

### या रेपोमध्ये काय आहे?

| साधन        | संक्षिप्त वर्णन                                                                  | दस्तावेज                               |
| ----------- | -------------------------------------------------------------------------------- | --------------------------------------- |
| **कंपाइलर** | बिल्ड-टाइम React स्थानीयकरण                                                        | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | वेब आणि मोबाईल ॲप्स, JSON, YAML, मार्कडाउन, + अधिक साठी एक-आदेश स्थानीयकरण     | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | प्रत्येक पुश वर अनुवादांना ऑटो-कमिट करा + आवश्यकतेनुसार पुल रिक्वेस्ट तयार करा    | [/ci](https://lingo.dev/ci)             |
| **SDK**     | वापरकर्ता-निर्मित सामग्रीसाठी रीयलटाइम अनुवाद                                   | [/sdk](https://lingo.dev/sdk)           |

प्रत्येकासाठी महत्त्वाचे मुद्दे खाली दिले आहेत 👇

---

### ⚡️ Lingo.dev CLI

आपल्या टर्मिनलमधून थेट कोड आणि सामग्रीचे अनुवाद करा.

```bash
npx lingo.dev@latest run
```

हे प्रत्येक स्ट्रिंगला फिंगरप्रिंट करते, निकालांना कॅश करते, आणि केवळ बदललेल्या गोष्टींचे पुन्हा अनुवाद करते.

[दस्तावेजाचे अनुसरण करा →](https://lingo.dev/cli) हे सेट अप कसे करावे हे जाणून घेण्यासाठी.

---

### 🔄 Lingo.dev CI/CD

स्वयंचलितपणे परिपूर्ण अनुवाद शिप करा.

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

आपल्या रेपोला हिरवा ठेवते आणि आपल्या उत्पादनाला मॅन्युअल चरणांशिवाय बहुभाषी ठेवते.

[दस्तावेज वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

गतिमान सामग्रीसाठी त्वरित प्रति-विनंती अनुवाद.

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

चॅट, वापरकर्ता टिप्पण्या आणि इतर रीयल-टाइम फ्लोसाठी उत्तम.

[दस्तावेज वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही समुदाय-चालित आहोत आणि योगदान आवडते!

- काही कल्पना आहे? [एक इश्यू उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काही निराकरण करायचे आहे? [एक PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी आहे? [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

## ⭐ स्टार इतिहास

जर तुम्हाला आमचे काम आवडत असेल, तर आम्हाला ⭐ द्या आणि 3,000 स्टारांपर्यंत पोहोचण्यात आम्हाला मदत करा! 🌟

[

![स्टार इतिहास चार्ट](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 इतर भाषांमध्ये रीडमी

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [मराठी](/readme/mr.md)

तुमची भाषा दिसत नाही? ती [`i18n.json`](./i18n.json) मध्ये जोडा आणि एक PR उघडा!

