
<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ਖੁੱਲ੍ਹਾ ਸਰੋਤ, AI-ਆਧਾਰਿਤ i18n ਟੂਲਕਿਟ ਜੋ LLMs ਨਾਲ ਤੁਰੰਤ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ।</strong>
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

## Compiler ਨਾਲ ਮਿਲੋ 🆕

**Lingo.dev Compiler** ਇੱਕ ਮੁਫ਼ਤ, ਖੁੱਲ੍ਹਾ ਸਰੋਤ ਕੰਪਾਇਲਰ ਮਿਡਲਵੇਅਰ ਹੈ ਜੋ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਬਿਲਡ ਸਮੇਂ ਬਹੁਭਾਸ਼ਾਈ ਬਣਾਉਂਦਾ ਹੈ — ਬਿਨਾ ਕਿਸੇ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟ ਨੂੰ ਬਦਲੇ।

ਇੱਕ ਵਾਰ ਇੰਸਟਾਲ ਕਰੋ:

```bash
npm install lingo.dev
```

ਆਪਣੀ ਬਿਲਡ ਕਨਫਿਗਰੇਸ਼ਨ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

ਹੁਣ `next build` ਚਲਾਓ ਅਤੇ ਦੇਖੋ — Spanish ਅਤੇ French ਬੰਡਲ ਤਿਆਰ ✨

ਪੂਰੀ ਗਾਈਡ ਲਈ [ਡੌਕੁਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/compiler)  
ਅਤੇ ਸਹਾਇਤਾ ਲਈ [ਸਾਡੇ Discord ਨਾਲ ਜੁੜੋ](https://lingo.dev/go/discord)।

---

### ਇਸ ਰਿਪੋਜ਼ਟਰੀ ਵਿੱਚ ਕੀ ਹੈ?

| ਟੂਲ | ਟੀਐਲ;ਡੀਆਰ | ਡੌਕਸ |
| ------------ | -------------------------------- | ---------------------------- |
| **Compiler** | ਬਿਲਡ ਸਮੇਂ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ | [/compiler](https://lingo.dev/compiler) |
| **CLI** | ਵੈੱਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪ ਲਈ ਇੱਕ ਕਮਾਂਡ ਵਿੱਚ ਅਨੁਵਾਦ | [/cli](https://lingo.dev/cli) |
| **CI/CD** | ਹਰ ਪੁਸ਼ ਤੇ ਆਪਣੇ ਆਪ ਅਨੁਵਾਦ ਕਮੀਟ ਅਤੇ PR ਬਣਾਉਂਦਾ ਹੈ | [/ci](https://lingo.dev/ci) |
| **SDK** | ਰੀਅਲ ਟਾਈਮ ਅਨੁਵਾਦ (ਯੂਜ਼ਰ ਜਨਰੇਟ ਕੀਤਾ ਸਮੱਗਰੀ ਲਈ) | [/sdk](https://lingo.dev/sdk) |

ਹੇਠਾਂ ਹਰੇਕ ਦੇ ਵੇਰਵੇ 👇

---

### ⚡️ Lingo.dev CLI

ਆਪਣੇ ਟਰਮੀਨਲ ਤੋਂ ਸਿੱਧਾ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npx lingo.dev@latest run
```

ਇਹ ਹਰ ਸਟ੍ਰਿੰਗ ਨੂੰ ਫਿੰਗਰਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ, ਨਤੀਜਿਆਂ ਨੂੰ ਕੈਸ਼ ਕਰਦਾ ਹੈ ਅਤੇ ਸਿਰਫ਼ ਬਦਲੇ ਹੋਏ ਹਿੱਸਿਆਂ ਦਾ ਹੀ ਦੁਬਾਰਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ।

ਇਸਨੂੰ ਸੈਟਅੱਪ ਕਰਨ ਲਈ [ਡੌਕਸ ਪੜ੍ਹੋ →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

ਆਪਣੇ ਆਪ ਸਹੀ ਅਨੁਵਾਦ ਭੇਜੋ।

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

ਤੁਹਾਡੀ ਰਿਪੋ ਨੂੰ ਹਮੇਸ਼ਾਂ ਹਰਾ ਰੱਖਦਾ ਹੈ 🌿  
ਅਤੇ ਪ੍ਰੋਡਕਟ ਨੂੰ ਬਹੁਭਾਸ਼ਾਈ ਬਣਾਉਂਦਾ ਹੈ — ਬਿਨਾ ਮੈਨੂਅਲ ਕਦਮਾਂ ਦੇ।

[ਡੌਕਸ ਪੜ੍ਹੋ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ਡਾਇਨਾਮਿਕ ਸਮੱਗਰੀ ਲਈ ਤੁਰੰਤ ਅਨੁਵਾਦ ਪ੍ਰਾਪਤ ਕਰੋ।

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
// ਨਤੀਜਾ: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

ਚੈਟਾਂ, ਟਿੱਪਣੀਆਂ ਅਤੇ ਰੀਅਲ ਟਾਈਮ ਡਾਟਾ ਲਈ ਬਹੁਤ ਹੀ ਉਚਿਤ।

[ਡੌਕਸ ਪੜ੍ਹੋ →](https://lingo.dev/sdk)

---

## 🤝 ਕਮਿਊਨਟੀ

ਅਸੀਂ ਕਮਿਊਨਟੀ ਚਲਾਈਆਂ ਪ੍ਰੋਜੈਕਟ ਹਾਂ ਅਤੇ ਯੋਗਦਾਨਾਂ ਦਾ ਸਵਾਗਤ ਕਰਦੇ ਹਾਂ!

- ਕੋਈ ਵਿਚਾਰ ਹੈ? [Issue ਖੋਲ੍ਹੋ](https://github.com/lingodotdev/lingo.dev/issues)
- ਕੁਝ ਠੀਕ ਕਰਨਾ ਹੈ? [PR ਭੇਜੋ](https://github.com/lingodotdev/lingo.dev/pulls)
- ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ? [Discord ਨਾਲ ਜੁੜੋ](https://lingo.dev/go/discord)

## ⭐ ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇ ਤੁਸੀਂ ਸਾਨੂੰ ਪਸੰਦ ਕਰਦੇ ਹੋ, ਤਾਂ ⭐ ਦਿਓ ਅਤੇ ਸਾਨੂੰ 4,000 ਸਟਾਰ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਮਦਦ ਕਰੋ! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

---

## 🌐 ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਪੜ੍ਹੋ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • **[ਪੰਜਾਬੀ](/readme/pa.md)**

ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ? [`i18n.json`](./i18n.json) ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ PR ਭੇਜੋ!
