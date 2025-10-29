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
    ⚡ Lingo.dev - ਓਪਨ-ਸੋਰਸ, AI-ਸੰਚਾਲਿਤ i18n ਟੂਲਕਿੱਟ LLMs ਨਾਲ ਤੁਰੰਤ ਸਥਾਨੀਕਰਨ ਲਈ।
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev ਕੰਪਾਇਲਰ</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="ਰਿਲੀਜ਼"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ਲਾਇਸੈਂਸ"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="ਆਖਰੀ ਕਮਿਟ"
    />
  </a>
</p>

---

## ਕੰਪਾਇਲਰ ਨੂੰ ਮਿਲੋ 🆕

**Lingo.dev ਕੰਪਾਇਲਰ** ਇੱਕ ਮੁਫਤ, ਓਪਨ-ਸੋਰਸ ਕੰਪਾਇਲਰ ਮਿਡਲਵੇਅਰ ਹੈ, ਜੋ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟਸ ਵਿੱਚ ਕੋਈ ਬਦਲਾਅ ਕੀਤੇ ਬਿਨਾਂ ਬਿਲਡ ਟਾਈਮ 'ਤੇ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਬਹੁ-ਭਾਸ਼ਾਈ ਬਣਾਉਣ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।

ਇੱਕ ਵਾਰ ਇੰਸਟਾਲ ਕਰੋ:

```bash
npm install lingo.dev
```

ਆਪਣੀ ਬਿਲਡ ਕੌਂਫਿਗ ਵਿੱਚ ਸਮਰੱਥ ਕਰੋ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ਚਲਾਓ ਅਤੇ ਸਪੈਨਿਸ਼ ਅਤੇ ਫ੍ਰੈਂਚ ਬੰਡਲਾਂ ਨੂੰ ਪ੍ਰਗਟ ਹੁੰਦੇ ਦੇਖੋ ✨

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/compiler) ਪੂਰੀ ਗਾਈਡ ਲਈ, ਅਤੇ [ਸਾਡੇ Discord ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord) ਆਪਣੇ ਸੈੱਟਅੱਪ ਵਿੱਚ ਮਦਦ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ।

---

### ਇਸ ਰੈਪੋ ਵਿੱਚ ਕੀ ਹੈ?

| ਟੂਲ         | ਸੰਖੇਪ ਵੇਰਵਾ                                                            | ਦਸਤਾਵੇਜ਼                                |
| ----------- | ---------------------------------------------------------------------- | --------------------------------------- |
| **ਕੰਪਾਇਲਰ** | ਬਿਲਡ-ਟਾਈਮ React ਸਥਾਨੀਕਰਨ                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | ਵੈੱਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪਸ, JSON, YAML, ਮਾਰਕਡਾਊਨ, + ਹੋਰ ਲਈ ਇੱਕ-ਕਮਾਂਡ ਸਥਾਨੀਕਰਨ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ਹਰ ਪੁਸ਼ 'ਤੇ ਅਨੁਵਾਦਾਂ ਨੂੰ ਆਟੋ-ਕਮਿਟ ਕਰੋ + ਲੋੜ ਅਨੁਸਾਰ ਪੁੱਲ ਬੇਨਤੀਆਂ ਬਣਾਓ   | [/ci](https://lingo.dev/ci)             |
| **SDK**     | ਉਪਭੋਗਤਾ-ਜਨਰੇਟਡ ਸਮੱਗਰੀ ਲਈ ਰੀਅਲਟਾਈਮ ਅਨੁਵਾਦ                               | [/sdk](https://lingo.dev/sdk)           |

ਹੇਠਾਂ ਹਰੇਕ ਲਈ ਤੇਜ਼ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ 👇

---

### ⚡️ Lingo.dev CLI

ਆਪਣੇ ਟਰਮੀਨਲ ਤੋਂ ਸਿੱਧਾ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npx lingo.dev@latest run
```

ਇਹ ਹਰ ਸਤਰ ਨੂੰ ਫਿੰਗਰਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ, ਨਤੀਜਿਆਂ ਨੂੰ ਕੈਸ਼ ਕਰਦਾ ਹੈ, ਅਤੇ ਸਿਰਫ਼ ਉਨ੍ਹਾਂ ਚੀਜ਼ਾਂ ਦਾ ਦੁਬਾਰਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ ਜੋ ਬਦਲੀਆਂ ਗਈਆਂ ਹਨ।

[ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ →](https://lingo.dev/cli) ਇਸਨੂੰ ਸੈੱਟ ਅੱਪ ਕਰਨ ਦਾ ਤਰੀਕਾ ਜਾਣਨ ਲਈ।

---

### 🔄 Lingo.dev CI/CD

ਸਵੈਚਲਿਤ ਤੌਰ 'ਤੇ ਸੰਪੂਰਣ ਅਨੁਵਾਦ ਭੇਜੋ।

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

ਤੁਹਾਡੇ ਰੈਪੋ ਨੂੰ ਹਰਾ ਅਤੇ ਤੁਹਾਡੇ ਉਤਪਾਦ ਨੂੰ ਮੈਨੁਅਲ ਕਦਮਾਂ ਤੋਂ ਬਿਨਾਂ ਬਹੁ-ਭਾਸ਼ਾਈ ਰੱਖਦਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/ci)

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

ਚੈਟ, ਉਪਭੋਗਤਾ ਟਿੱਪਣੀਆਂ ਅਤੇ ਹੋਰ ਰੀਅਲ-ਟਾਈਮ ਫਲੋ ਲਈ ਸੰਪੂਰਨ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/sdk)

---

## 🤝 ਭਾਈਚਾਰਾ

ਅਸੀਂ ਕਮਿਊਨਿਟੀ-ਸੰਚਾਲਿਤ ਹਾਂ ਅਤੇ ਯੋਗਦਾਨ ਪਸੰਦ ਕਰਦੇ ਹਾਂ!

- ਕੋਈ ਵਿਚਾਰ ਹੈ? [ਇੱਕ ਇਸ਼ੂ ਖੋਲ੍ਹੋ](https://github.com/lingodotdev/lingo.dev/issues)
- ਕੁਝ ਠੀਕ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? [ਇੱਕ PR ਭੇਜੋ](https://github.com/lingodotdev/lingo.dev/pulls)
- ਮਦਦ ਚਾਹੀਦੀ ਹੈ? [ਸਾਡੇ Discord ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord)

## ⭐ ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇਕਰ ਤੁਹਾਨੂੰ ਸਾਡਾ ਕੰਮ ਪਸੰਦ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਇੱਕ ⭐ ਦਿਓ ਅਤੇ 4,000 ਸਟਾਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ! 🌟

[

![ਸਟਾਰ ਇਤਿਹਾਸ ਚਾਰਟ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਰੀਡਮੀ

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ਪੰਜਾਬੀ](/readme/pa.md)

ਆਪਣੀ ਭਾਸ਼ਾ ਨਹੀਂ ਦੇਖ ਰਹੇ? ਇਸਨੂੰ [`i18n.json`](./i18n.json) ਵਿੱਚ ਜੋੜੋ ਅਤੇ ਇੱਕ PR ਖੋਲ੍ਹੋ!
