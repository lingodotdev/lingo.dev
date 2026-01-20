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
    ⚡ Lingo.dev - ਓਪਨ-ਸੋਰਸ, AI-ਸੰਚਾਲਿਤ i18n ਟੂਲਕਿੱਟ ਜੋ LLMs ਨਾਲ ਤੁਰੰਤ
    ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਲਈ ਹੈ।
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

## Compiler ਨਾਲ ਮਿਲੋ 🆕

**Lingo.dev Compiler** ਇੱਕ ਮੁਫ਼ਤ, ਓਪਨ-ਸੋਰਸ ਕੰਪਾਈਲਰ ਮਿਡਲਵੇਅਰ ਹੈ, ਜੋ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟਸ ਵਿੱਚ ਕੋਈ ਬਦਲਾਅ ਕੀਤੇ ਬਿਨਾਂ ਬਿਲਡ ਟਾਈਮ 'ਤੇ ਬਹੁਭਾਸ਼ਾਈ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।

ਇੱਕ ਵਾਰ ਇੰਸਟਾਲ ਕਰੋ:

```bash
npm install @lingo.dev/compiler
```

ਆਪਣੀ ਬਿਲਡ ਕੌਂਫਿਗ ਵਿੱਚ ਸਮਰੱਥ ਕਰੋ:

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

`next build` ਚਲਾਓ ਅਤੇ ਸਪੈਨਿਸ਼ ਅਤੇ ਫ੍ਰੈਂਚ ਬੰਡਲ ਬਾਹਰ ਆਉਂਦੇ ਦੇਖੋ ✨

ਪੂਰੀ ਗਾਈਡ ਲਈ [ਡੌਕਸ ਪੜ੍ਹੋ →](https://lingo.dev/compiler), ਅਤੇ ਆਪਣੇ ਸੈਟਅੱਪ ਵਿੱਚ ਮਦਦ ਲੈਣ ਲਈ [ਸਾਡੇ Discord 'ਤੇ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord)।

---

### ਇਸ ਰਿਪੋ ਵਿੱਚ ਕੀ ਹੈ?

| ਟੂਲ          | TL;DR                                                                      | ਡੌਕਸ                                    |
| ------------ | -------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ਬਿਲਡ-ਟਾਈਮ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ਵੈੱਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪਸ, JSON, YAML, markdown, + ਹੋਰ ਲਈ ਇੱਕ-ਕਮਾਂਡ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ਹਰ ਪੁਸ਼ 'ਤੇ ਅਨੁਵਾਦ ਆਟੋ-ਕਮਿਟ ਕਰੋ + ਲੋੜ ਪੈਣ 'ਤੇ ਪੁੱਲ ਰਿਕੁਐਸਟ ਬਣਾਓ            | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ਯੂਜ਼ਰ-ਜਨਰੇਟਿਡ ਸਮੱਗਰੀ ਲਈ ਰੀਅਲਟਾਈਮ ਅਨੁਵਾਦ                                    | [/sdk](https://lingo.dev/sdk)           |

ਹੇਠਾਂ ਹਰੇਕ ਲਈ ਤੇਜ਼ ਜਾਣਕਾਰੀ ਹੈ 👇

---

### ⚡️ Lingo.dev CLI

ਆਪਣੇ ਟਰਮੀਨਲ ਤੋਂ ਸਿੱਧੇ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npx lingo.dev@latest run
```

ਇਹ ਹਰ ਸਟ੍ਰਿੰਗ ਨੂੰ ਫਿੰਗਰਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ, ਨਤੀਜਿਆਂ ਨੂੰ ਕੈਸ਼ ਕਰਦਾ ਹੈ, ਅਤੇ ਸਿਰਫ਼ ਬਦਲੀਆਂ ਚੀਜ਼ਾਂ ਦਾ ਦੁਬਾਰਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ।

ਇਸਨੂੰ ਸੈੱਟਅੱਪ ਕਰਨ ਬਾਰੇ ਜਾਣਨ ਲਈ [ਡੌਕੁਮੈਂਟ ਦੇਖੋ →](https://lingo.dev/cli)।

---

### 🔄 Lingo.dev CI/CD

ਸੰਪੂਰਨ ਅਨੁਵਾਦ ਆਪਣੇ-ਆਪ ਭੇਜੋ।

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

ਤੁਹਾਡੇ ਰਿਪੋ ਨੂੰ ਹਰਾ ਅਤੇ ਤੁਹਾਡੇ ਉਤਪਾਦ ਨੂੰ ਬਿਨਾਂ ਮੈਨੁਅਲ ਕਦਮਾਂ ਦੇ ਬਹੁਭਾਸ਼ੀ ਰੱਖਦਾ ਹੈ।

[ਡੌਕੁਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ਗਤੀਸ਼ੀਲ ਸਮੱਗਰੀ ਲਈ ਤੁਰੰਤ ਪ੍ਰਤੀ-ਬੇਨਤੀ ਅਨੁਵਾਦ।

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

ਚੈਟ, ਉਪਭੋਗਤਾ ਟਿੱਪਣੀਆਂ, ਅਤੇ ਹੋਰ ਰੀਅਲ-ਟਾਈਮ ਫਲੋਅ ਲਈ ਸੰਪੂਰਨ।

[ਡੌਕੁਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/sdk)

---

## 🤝 ਕਮਿਊਨਿਟੀ

ਅਸੀਂ ਕਮਿਊਨਿਟੀ-ਸੰਚਾਲਿਤ ਹਾਂ ਅਤੇ ਯੋਗਦਾਨਾਂ ਨੂੰ ਪਸੰਦ ਕਰਦੇ ਹਾਂ!

- ਕੋਈ ਵਿਚਾਰ ਹੈ? [ਇੱਕ ਇਸ਼ੂ ਖੋਲ੍ਹੋ](https://github.com/lingodotdev/lingo.dev/issues)
- ਕੁਝ ਠੀਕ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? [PR ਭੇਜੋ](https://github.com/lingodotdev/lingo.dev/pulls)
- ਮਦਦ ਚਾਹੀਦੀ ਹੈ? [ਸਾਡੇ Discord ਨਾਲ ਜੁੜੋ](https://lingo.dev/go/discord)

## ⭐ ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇ ਤੁਹਾਨੂੰ ਸਾਡਾ ਕੰਮ ਪਸੰਦ ਹੈ, ਤਾਂ ਸਾਨੂੰ ⭐ ਦਿਓ ਅਤੇ 6,000 ਸਿਤਾਰਿਆਂ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਨਹੀਂ ਦਿਖਾਈ ਦੇ ਰਹੀ? ਇਸਨੂੰ [`i18n.json`](./i18n.json) ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ PR ਖੋਲ੍ਹੋ!

**ਲੋਕੇਲ ਫਾਰਮੈਟ:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ਕੋਡ ਵਰਤੋ: `language[-Script][-REGION]`

- ਭਾਸ਼ਾ: ISO 639-1/2/3 ਛੋਟੇ ਅੱਖਰ (`en`, `zh`, `bho`)
- ਲਿਪੀ: ISO 15924 ਟਾਈਟਲ ਕੇਸ (`Hans`, `Hant`, `Latn`)
- ਖੇਤਰ: ISO 3166-1 alpha-2 ਵੱਡੇ ਅੱਖਰ (`US`, `CN`, `IN`)
- ਉਦਾਹਰਨਾਂ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
