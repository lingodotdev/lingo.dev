````markdown
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
    ⚡ Lingo.dev - ମୁକ୍ତ ଉତ୍ସ, AI-ଚାଳିତ i18n ଟୁଲକିଟ୍ LLMs ସହିତ।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev କମ୍ପାଇଲର୍</a> •
  <a href="https://lingo.dev/cli">Lingo.dev ସିଏଲଆଇ </a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="ରିଲିଜ୍"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ଲାଇସେନ୍ସ"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="ଶେଷ କମିଟ୍"
    />
  </a>
</p>

---

## କମ୍ପାଇଲର୍ ସହିତ ପରିଚିତ ହୁଅନ୍ତୁ 🆕

**Lingo.dev କମ୍ପାଇଲର୍** ହେଉଛି ଏକ ମାଗଣା, ମୁକ୍ତ ଉତ୍ସ କମ୍ପାଇଲର୍ ମିଡଲୱେର୍, ଯାହା React କମ୍ପୋନେଣ୍ଟ୍ରେ ଗୁଡିକୁ  ଅନେକ ଭାଷା  ରେ ପରିବର୍ତନ ପାଇଁ ତିଆରି ହେଇଛି ଆଉ ଏହା ଦ୍ବାରା React କମ୍ପୋନେଣ୍ଟ  ରେ କୌଣସି ପରିବର୍ତନ  କରିବାକୁ ପଡିବ ନାହି |

ଥରେ ଇନ୍ଷ୍ଟାଲ  କରନ୍ତୁ:

```bash
npm install lingo.dev
```

ଆପଣଙ୍କ ବିଲ୍ଡ କନଫିଗରେ ସକ୍ଷମ କରନ୍ତୁ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ଚଲାନ୍ତୁ ଏବଂ ସ୍ପାନିସ୍ ଓ ଫ୍ରେଞ୍ଚ ବଣ୍ଡଲ୍ ବାହାରିବାର ଦେଖନ୍ତୁ ✨

[ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ପଢନ୍ତୁ →](https://lingo.dev/compiler) ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍ ପାଇଁ, ଏବଂ [ଆମ Discord ରେ ଯୋଗ ଦିଅନ୍ତୁ](https://lingo.dev/go/discord) ଆପଣଙ୍କ ସେଟଅପରେ ସହାୟତା ପାଇବାକୁ।

---

### ଏହି ରେପୋରେ କ'ଣ ଅଛି?

| ଟୁଲ୍        | ସଂକ୍ଷିପ୍ତ ବିବରଣୀ                                                             | ଡକ୍ସ୍                                  |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **କମ୍ପାଇଲର୍** | ବିଲ୍ଡ-ସମୟ React ସ୍ଥାନୀକରଣ                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | ୱେବ ଓ ମୋବାଇଲ୍ ଆପ୍, JSON, YAML, ମାର୍କଡାଉନ୍, + ଅଧିକ ପାଇଁ ଏକ-କମାଣ୍ଡ ସ୍ଥାନୀକରଣ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ପ୍ରତ୍ୟେକ ପୁସରେ ଅନୁବାଦଗୁଡ଼ିକୁ ସ୍ୱୟଂ-କମିଟ୍ କରନ୍ତୁ + ଆବଶ୍ୟକତା ଅନୁସାରେ ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ ସୃଷ୍ଟି କରନ୍ତୁ | [/ci](https://lingo.dev/ci)             |
| **SDK**     | ଉପଭୋକ୍ତା-ଜନିତ ବିଷୟବସ୍ତୁ ପାଇଁ ରିଅଲଟାଇମ୍ ଅନୁବାଦ                            | [/sdk](https://lingo.dev/sdk)           |

ପ୍ରତ୍ୟେକ ପାଇଁ ସଂକ୍ଷିପ୍ତ ସୂଚନା ତଳେ ଦିଆଯାଇଛି 👇

---

### ⚡️ Lingo.dev CLI

ଆପଣଙ୍କ ଟର୍ମିନାଲ୍ ରୁ ସିଧାସଳଖ କୋଡ୍ ଓ ବିଷୟବସ୍ତୁର ଅନୁବାଦ କରନ୍ତୁ।

```bash
npx lingo.dev@latest run
```

ଏହା ପ୍ରତ୍ୟେକ ଷ୍ଟ୍ରିଙ୍ଗକୁ ଫିଙ୍ଗରପ୍ରିଣ୍ଟ କରେ, ଫଳାଫଳଗୁଡ଼ିକୁ କ୍ୟାଶ୍ କରେ, ଏବଂ କେବଳ ପରିବର୍ତ୍ତିତ ବିଷୟଗୁଡ଼ିକର ପୁନଃ ଅନୁବାଦ କରେ।

[ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ଅନୁସରଣ କରନ୍ତୁ →](https://lingo.dev/cli) ଏହାକୁ କିପରି ସେଟଅପ୍ କରିବେ ଜାଣିବାକୁ।

---

### 🔄 Lingo.dev CI/CD

ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସମ୍ପୂର୍ଣ୍ଣ ଅନୁବାଦ ଶିପ୍ କରନ୍ତୁ।

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

ଆପଣଙ୍କ ରେପୋକୁ ସବୁଜ ଏବଂ ଆପଣଙ୍କ ପ୍ରଡକ୍ଟକୁ ମାନୁଆଲ୍ ପଦକ୍ଷେପ ବିନା ବହୁଭାଷିକ ରଖେ।

[ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ପଢନ୍ତୁ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ପରିବର୍ତନଶୀଳ ବିଷୟବସ୍ତୁ ପାଇଁ ତତକ୍ଷଣାତ ପ୍ରତି-ଅନୁରୋଧ ଅନୁବାଦ।

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

ଚାଟ୍, ଉପଭୋକ୍ତା ମନ୍ତବ୍ୟ, ଏବଂ ଅନ୍ୟାନ୍ୟ ରିଅଲ୍-ଟାଇମ୍ ଫ୍ଲୋ ପାଇଁ ଉତ୍ତମ।

[ଡକ୍ୟୁମେଣ୍ଟେସନ୍ ପଢନ୍ତୁ →](https://lingo.dev/sdk)

---

## 🤝 ସମ୍ପ୍ରଦାୟ

ଆମେ ସମ୍ପ୍ରଦାୟ-ଚାଳିତ ଏବଂ ଅବଦାନକୁ ଭଲପାଉ!

- କୌଣସି ଧାରଣା ଅଛି? [ଏକ ଇସୁ ଖୋଲନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
- କିଛି ସମାଧାନ କରିବାକୁ ଚାହୁଁଛନ୍ତି? [ଏକ PR ପଠାନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
- ସହାୟତା ଆବଶ୍ୟକ? [ଆମ Discord ରେ ଯୋଗ ଦିଅନ୍ତୁ](https://lingo.dev/go/discord)

## ⭐ ଷ୍ଟାର୍ ଇତିହାସ

ଯଦି ଆପଣ ଆମର କାମ ପସନ୍ଦ କରୁଛନ୍ତି, ଆମକୁ ଏକ ⭐ ଦିଅନ୍ତୁ ଏବଂ 4,000 ଷ୍ଟାର୍ ପହଞ୍ଚିବାରେ ଆମକୁ ସାହାଯ୍ୟ କରନ୍ତୁ! 🌟

[

![ଷ୍ଟାର୍ ଇତିହାସ ଚାର୍ଟ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ଅନ୍ୟ ଭାଷାରେ ରିଡମି

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ଓଡ଼ିଆ](/readme/od.md)

ଆପଣଙ୍କ ଭାଷା ଦେଖୁନାହାଁନ୍ତି? ଏହାକୁ [`i18n.json`](./i18n.json) ରେ ଯୋଡନ୍ତୁ ଏବଂ ଏକ PR ଖୋଲନ୍ତୁ!

````