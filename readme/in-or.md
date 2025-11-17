<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ଏକ ଖୋଲା-ସୂତ୍ର (open-source), AI-ଚାଳିତ i18n ଟୁଲକିଟ୍ ଯାହା LLM ଦ୍ୱାରା ତୁରନ୍ତ ଅନୁବାଦ ସକ୍ଷମ କରେ।</strong>
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

## 🆕 Compiler ସହିତ ପରିଚୟ

**Lingo.dev Compiler** ଏକ ମାଗଣା ଏବଂ ଖୋଲା-ସୂତ୍ର (open-source) compiler middleware ଯାହା ଯେକୌଣସି React ଆପ୍ଲିକେସନ୍‌କୁ build-time ରେ multilingual କରିପାରେ — ତାହା ସହିତ କୌଣସି React component ପରିବର୍ତ୍ତନ କରିବା ଆବଶ୍ୟକ ନାହିଁ।

ଏକଥର ଇନ୍‌ସ୍ଟଲ୍ କରନ୍ତୁ:

```bash
npm install lingo.dev
```

ଆପଣଙ୍କ build config ରେ ସକ୍ରିୟ କରନ୍ତୁ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ଚଲାନ୍ତୁ ଏବଂ ଦେଖନ୍ତୁ — Spanish ଏବଂ French bundle ଗୁଡିକ ତିଆରି ହେଉଛି ✨

[ପୂର୍ଣ୍ଣ ଗାଇଡ୍ ପଢନ୍ତୁ →](https://lingo.dev/compiler) ଏବଂ [ଆମ Discord ଯୋଗଦିଅନ୍ତୁ](https://lingo.dev/go/discord) ସେଟଅପ୍ ସହାୟତା ପାଇଁ।

---

### ଏହି ରେପୋରେ କ’ଣ ଅଛି?

| ଟୁଲ୍ | ସାରକଥା | ଡକ୍ୟୁମେଣ୍ଟ |
| ------ | -------------------------------------- | -------------------------------------- |
| **Compiler** | Build-time React localization | [/compiler](https://lingo.dev/compiler) |
| **CLI** | ଏକ ଆଦେଶରେ web ଏବଂ mobile ଅପ୍ଲିକେସନ୍, JSON, YAML, markdown ଇତ୍ୟାଦି ଅନୁବାଦ | [/cli](https://lingo.dev/cli) |
| **CI/CD** | ପ୍ରତି push ରେ ଅନୁବାଦ commit କରେ ଏବଂ pull request ତିଆରି କରେ | [/ci](https://lingo.dev/ci) |
| **SDK** | ଉପଯୋଗକର୍ତ୍ତା ତିଆରି କରା ସାମଗ୍ରୀ ପାଇଁ real-time translation | [/sdk](https://lingo.dev/sdk) |

ନିମ୍ନରେ ପ୍ରତ୍ୟେକର ତ୍ୱରିତ ତଥ୍ୟ 👇

---

### ⚡️ Lingo.dev CLI

ଟର୍ମିନାଲ୍‌ରୁ ସିଧାସଳଖ ଅନୁବାଦ କରନ୍ତୁ।

```bash
npx lingo.dev@latest run
```

ଏହା ପ୍ରତ୍ୟେକ string କୁ fingerprint କରେ, ଫଳାଫଳ cache କରେ, ଏବଂ କେବଳ ପରିବର୍ତ୍ତିତ string ଗୁଡିକୁ ପୁନଃ ଅନୁବାଦ କରେ।

[ଡକ୍ସ ଅନୁସରଣ କରନ୍ତୁ →](https://lingo.dev/cli) ସେଟଅପ୍ ଶିଖିବା ପାଇଁ।

---

### 🔄 Lingo.dev CI/CD

ସ୍ୱୟଂଚାଳିତ ଭାବେ ସଠିକ୍ ଅନୁବାଦ ପ୍ରେରଣ କରନ୍ତୁ।

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

ଏହା ଆପଣଙ୍କ ରେପୋକୁ ସବୁବେଳେ ଅଦ୍ୟତନ ଏବଂ multilingual ରଖେ, କୌଣସି manual ଉଦ୍ୟମ ଛାଡ଼ି।

[ଡକ୍ସ ପଢନ୍ତୁ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Dynamic content ପାଇଁ ତୁରନ୍ତ per-request ଅନୁବାଦ।

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
// ଫେରାଇବ: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

ଚାଟ୍‌, user comments ଓ ଅନ୍ୟାନ୍ୟ real-time flow ପାଇଁ ସଠିକ୍।

[ଡକ୍ସ ପଢନ୍ତୁ →](https://lingo.dev/sdk)

---

## 🤝 ସମୁଦାୟ

ଆମେ ସମୁଦାୟ-ଭିତ୍ତିକ ଏବଂ ଆପଣଙ୍କ ଅଂଶଦାନକୁ ସ୍ୱାଗତ କରୁଛୁ!

- ନୂତନ ଧାରଣା ଅଛି? [Issue ଖୋଲନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
- କିଛି ସୁଧାରିବାକୁ ଚାହୁଁଛନ୍ତି? [PR ପଠାନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
- ସହାୟତା ଦରକାର? [ଆମ Discord ଯୋଗଦିଅନ୍ତୁ](https://lingo.dev/go/discord)

## ⭐ ତାରା ଇତିହାସ

ଯଦି ଆପଣଙ୍କୁ ଆମ ପ୍ରୟାସ ଭଲ ଲାଗୁଛି, ଏକ ⭐ ଦିଅନ୍ତୁ ଏବଂ ଆମକୁ 4,000 ତାରାରେ ପହଞ୍ଚିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ଅନ୍ୟ ଭାଷାରେ README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

ଆପଣଙ୍କ ଭାଷା ଦେଖିଲେ ନାହିଁ? [`i18n.json`](./i18n.json) ରେ ଯୋଡ଼ନ୍ତୁ ଏବଂ PR ଖୋଲନ୍ତୁ!
