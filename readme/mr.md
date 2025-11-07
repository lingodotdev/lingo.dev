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
    ⚡ Lingo.dev - ओपन-सोर्स, AI-संचालित i18n टूलकिट जे LLMs च्या मदतीने
    वेगवान लोकलायझेशन करण्यासाठी बनवले आहे.
  </strong>
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
</p>

---

## Compiler ला भेटा 🆕

**Lingo.dev Compiler** हा एक फ्री, ओपन-सोर्स compiler middleware आहे
जो बिल्ड-टाइम वर, तुमचे existing React components कशालाही न बदलता
कुठलीही React App बहुभाषिक (multi-language) करू शकतो.

फक्त एकदाच installation करा:

```bash
npm install lingo.dev
```

तुमच्या build config मध्ये सक्षम करा:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` चालवा — आणि Spanish आणि French bundles बिल्ड झाल्यावर आपोआप दिसतील ✨

मराठीत सांगायचं तर → इतकं सोपं आहे 💥

पूर्ण मार्गदर्शकासाठी [Docs वाचा →](https://lingo.dev/compiler)
आणि ज्यांना मदत हवी आहे त्यांनी [आमच्या Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

---

### या Repo मध्ये नेमकं काय आहे?

| Tool         | संक्षिप्त वर्णन                                                                      | Docs                                    |
| ------------ | ------------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | बिल्ड-टाइम React लोकलायझेशन                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Web आणि Mobile Apps, JSON, YAML, Markdown + अजून formats साठी one-command लोकलायझेशन | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | प्रत्येक git push वर translations auto-commit + Pull Request तयार                    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | User-generated कंटेन्ट साठी Real-time भाषांतर                                        | [/sdk](https://lingo.dev/sdk)           |

खाली प्रत्येक टूलचं Quick Info दिलं आहे 👇

---

### ⚡️ Lingo.dev CLI

टर्मिनल मधून थेट कोड आणि कंटेन्ट चे भाषांतर करा.

```bash
npx lingo.dev@latest run
```

### 🔄 Lingo.dev CI/CD

भाषांतर आपोआप, परफेक्ट आणि वेळेवर शिप करा — manual हस्तक्षेप नाही.

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

हा सेटअप तुमचा Repo नेहमी Healthy ठेवतो आणि Product multi-language ठेवतो
ते पण कोणतेही हाताने Step न करता!

[Docs वाचा →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Dynamic कंटेन्ट साठी — प्रत्येक Request ला Live भाषांतर.

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

Live chats, user comments, streaming responses, इत्यादींसाठी उत्तम.

[Docs वाचा →](https://lingo.dev/sdk)

---

## 🤝 समुदाय

आम्ही community-driven आहोत आणि contributions चे स्वागत करतो!

- काही कल्पना आहे? → [Issue उघडा](https://github.com/lingodotdev/lingo.dev/issues)
- काही fix करायचं असेल? → [PR पाठवा](https://github.com/lingodotdev/lingo.dev/pulls)
- मदत हवी? → [Discord मध्ये सामील व्हा](https://lingo.dev/go/discord)

---

## ⭐ Star History

आमचं काम आवडलं?
मग आम्हाला एक ⭐ द्या आणि 3,000 stars पर्यंत पोहोचायला मदत करा! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

]([https://www.star-history.com/#lingodotdev/lingo.dev&Date](https://www.star-history.com/#lingodotdev/lingo.dev&Date))

---

## 🌐 इतर भाषांमधील README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)• [मराठी](/readme/mr.md)

तुमची भाषा लिस्ट मध्ये नाही?
तर ती [`i18n.json`](./i18n.json) मध्ये समाविष्ट करा आणि एक PR उघडा!
