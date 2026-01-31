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
    ⚡ Lingo.dev - ଓପନ-ସୋର୍ସ, AI-ପାୱାର୍ଡ i18n ଟୁଲକିଟ୍ LLMs ସହିତ ତୁରନ୍ତ
    ଲୋକାଲାଇଜେସନ୍ ପାଇଁ।
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

## Compiler ସହିତ ପରିଚିତ ହୁଅନ୍ତୁ 🆕

**Lingo.dev Compiler** ହେଉଛି ଏକ ମାଗଣା, ଓପନ-ସୋର୍ସ କମ୍ପାଇଲର୍ ମିଡଲୱେର୍, ଯାହା ବିଲ୍ଡ ସମୟରେ ଯେକୌଣସି React ଆପ୍‌କୁ ବହୁଭାଷୀ କରିବା ପାଇଁ ଡିଜାଇନ୍ କରାଯାଇଛି, ବିଦ୍ୟମାନ React କମ୍ପୋନେଣ୍ଟଗୁଡ଼ିକରେ କୌଣସି ପରିବର୍ତ୍ତନ ଆବଶ୍ୟକ ନକରି।

> **ଟିପ୍ପଣୀ:** ଯଦି ଆପଣ ଲିଗେସି କମ୍ପାଇଲର୍ (`@lingo.dev/_compiler`) ବ୍ୟବହାର କରୁଛନ୍ତି, ଦୟାକରି `@lingo.dev/compiler`କୁ ମାଇଗ୍ରେଟ୍ କରନ୍ତୁ। ଲିଗେସି କମ୍ପାଇଲର୍ ଅବମୂଲ୍ୟାୟିତ ହୋଇଛି ଏବଂ ଭବିଷ୍ୟତର ରିଲିଜ୍‌ରେ ଅପସାରିତ ହେବ।

ଥରେ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ:

```bash
npm install @lingo.dev/compiler
```

ଆପଣଙ୍କ ବିଲ୍ଡ କନଫିଗରେ ସକ୍ଷମ କରନ୍ତୁ:

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

`next build` ଚଲାନ୍ତୁ ଏବଂ ସ୍ପାନିସ୍ ଓ ଫ୍ରେଞ୍ଚ ବଣ୍ଡଲ୍ ବାହାରକୁ ଆସିବା ଦେଖନ୍ତୁ ✨

ସମ୍ପୂର୍ଣ୍ଣ ଗାଇଡ୍ ପାଇଁ [ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/compiler), ଏବଂ ଆପଣଙ୍କ ସେଟଅପ୍‌ରେ ସାହାଯ୍ୟ ପାଇବାକୁ [ଆମର Discord ରେ ଯୋଗ ଦିଅନ୍ତୁ](https://lingo.dev/go/discord)।

---

### ଏହି ରେପୋ ଭିତରେ କ'ଣ ଅଛି?

| ଟୁଲ୍         | TL;DR                                                                             | ଡକ୍ସ                                    |
| ------------ | --------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ବିଲ୍ଡ-ଟାଇମ୍ React ଲୋକାଲାଇଜେସନ୍                                                    | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ୱେବ୍ ଏବଂ ମୋବାଇଲ୍ ଆପ୍, JSON, YAML, markdown, + ଅଧିକ ପାଇଁ ଏକ-କମାଣ୍ଡ ଲୋକାଲାଇଜେସନ୍    | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ପ୍ରତ୍ୟେକ push ରେ ଅନୁବାଦ ଅଟୋ-କମିଟ୍ କରନ୍ତୁ + ଆବଶ୍ୟକ ହେଲେ pull request ସୃଷ୍ଟି କରନ୍ତୁ | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ବ୍ୟବହାରକାରୀ-ଉତ୍ପାଦିତ ବିଷୟବସ୍ତୁ ପାଇଁ ରିଅଲଟାଇମ୍ ଅନୁବାଦ                              | [/sdk](https://lingo.dev/sdk)           |

ପ୍ରତ୍ୟେକ ପାଇଁ ଦ୍ରୁତ ହିଟ୍ ନିମ୍ନରେ ଅଛି 👇

---

### ⚡️ Lingo.dev CLI

ଆପଣଙ୍କ ଟର୍ମିନାଲରୁ ସିଧାସଳଖ କୋଡ୍ ଓ ବିଷୟବସ୍ତୁ ଅନୁବାଦ କରନ୍ତୁ।

```bash
npx lingo.dev@latest run
```

ଏହା ପ୍ରତ୍ୟେକ ଷ୍ଟ୍ରିଙ୍ଗକୁ ଫିଙ୍ଗରପ୍ରିଣ୍ଟ କରେ, ଫଳାଫଳ କ୍ୟାଶ୍ କରେ, ଏବଂ କେବଳ ପରିବର୍ତ୍ତିତ ହୋଇଥିବା ଅଂଶକୁ ପୁନଃ ଅନୁବାଦ କରେ।

ଏହାକୁ କିପରି ସେଟଅପ୍ କରିବେ ଜାଣିବାକୁ [ଡକ୍ସ ଅନୁସରଣ କରନ୍ତୁ →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସମ୍ପୂର୍ଣ୍ଣ ଅନୁବାଦ ପ୍ରଦାନ କରନ୍ତୁ।

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

ମାନୁଆଲ୍ ପଦକ୍ଷେପ ବିନା ଆପଣଙ୍କ ରେପୋକୁ ସବୁଜ ଏବଂ ଆପଣଙ୍କ ପ୍ରଡକ୍ଟକୁ ବହୁଭାଷୀ ରଖେ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ଗତିଶୀଳ ବିଷୟବସ୍ତୁ ପାଇଁ ତତ୍କ୍ଷଣାତ୍ ପ୍ରତି-ଅନୁରୋଧ ଅନୁବାଦ।

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

ଚାଟ୍, ଉପଯୋଗକର୍ତ୍ତା ମନ୍ତବ୍ୟ ଏବଂ ଅନ୍ୟାନ୍ୟ ରିଅଲ୍-ଟାଇମ୍ ଫ୍ଲୋ ପାଇଁ ଉପଯୁକ୍ତ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/sdk)

---

## 🤝 ସମ୍ପ୍ରଦାୟ

ଆମେ ସମ୍ପ୍ରଦାୟ-ଚାଳିତ ଏବଂ ଅବଦାନକୁ ଭଲପାଉ!

- କୌଣସି ଧାରଣା ଅଛି? [ଏକ ଇସ୍ୟୁ ଖୋଲନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
- କିଛି ଠିକ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି? [ଏକ PR ପଠାନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
- ସାହାଯ୍ୟ ଦରକାର? [ଆମର Discord ରେ ଯୋଗ ଦିଅନ୍ତୁ](https://lingo.dev/go/discord)

## ⭐ ଷ୍ଟାର୍ ଇତିହାସ

ଯଦି ଆପଣ ଆମେ କରୁଥିବା କାମ ପସନ୍ଦ କରନ୍ତି, ଆମକୁ ଏକ ⭐ ଦିଅନ୍ତୁ ଏବଂ 10,000 ଷ୍ଟାର୍ ପହଞ୍ଚିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ଅନ୍ୟ ଭାଷାରେ Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

ଆପଣଙ୍କ ଭାଷା ଦେଖୁନାହାଁନ୍ତି? ଏହାକୁ `i18n.json` ରେ ଯୋଡ଼ନ୍ତୁ ଏବଂ ଏକ PR ଖୋଲନ୍ତୁ!

**ଲୋକେଲ୍ ଫର୍ମାଟ୍:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) କୋଡ୍ ବ୍ୟବହାର କରନ୍ତୁ: `language[-Script][-REGION]`

- ଭାଷା: ISO 639-1/2/3 ଲୋୟରକେସ୍ (`en`, `zh`, `bho`)
- ସ୍କ୍ରିପ୍ଟ: ISO 15924 ଟାଇଟଲ୍ କେସ୍ (`Hans`, `Hant`, `Latn`)
- ଅଞ୍ଚଳ: ISO 3166-1 alpha-2 ଅପରକେସ୍ (`US`, `CN`, `IN`)
- ଉଦାହରଣ: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
