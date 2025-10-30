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
    ⚡ Lingo.dev - ਖੁੱਲ੍ਹਾ-ਸਰੋਤ, AI-ਚਲਿਤ i18n ਟੂਲਕਿਟ LLMs ਦੇ ਨਾਲ ਤੇਜ਼
    ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਲਈ।
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

## ਕੰਪਾਇਲਰ ਨਾਲ ਮਿਲੋ 🆕

**Lingo.dev ਕੰਪਾਇਲਰ** ਇੱਕ ਮੁਫ਼ਤ, ਖੁੱਲ੍ਹਾ-ਸਰੋਤ ਕੰਪਾਇਲਰ ਮਿਡਲਵੇਅਰ ਹੈ, ਜੋ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟਸ ਵਿੱਚ ਕੋਈ ਤਬਦੀਲੀ ਕੀਤੇ ਬਿਨਾਂ ਬਿਲਡ ਟਾਈਮ ਤੇ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਬਹੁਭਾਸ਼ੀ ਬਣਾਉਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ ਹੈ।

ਇੱਕ ਵਾਰ ਇੰਸਟਾਲ ਕਰੋ:

```bash
npm install lingo.dev
```

ਆਪਣੇ ਬਿਲਡ ਕਾਨਫਿਗ ਵਿੱਚ ਐਨੇਬਲ ਕਰੋ:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` ਚਲਾਓ ਅਤੇ ਸਪੈਨਿਸ਼ ਅਤੇ ਫ੍ਰੈਂਚ ਬੰਡਲ ਉਤਪੰਨ ਹੋਣ ਵੇਖੋ ✨

[ਡੌਕੂਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/compiler) ਪੂਰੀ ਗਾਈਡ ਲਈ, ਅਤੇ [ਸਾਡੇ Discord ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord) ਆਪਣੇ ਸੈਟਅਪ ਵਿੱਚ ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ।

---

### ਇਸ ਰੇਪੋ ਵਿੱਚ ਕੀ ਹੈ?

| ਟੂਲ         | ਸੰਖੇਪ ਵੇਰਵਾ                                                                | ਡੌਕੂਮੈਂਟ                                |
| ----------- | -------------------------------------------------------------------------- | --------------------------------------- |
| **ਕੰਪਾਇਲਰ** | ਬਿਲਡ-ਟਾਈਮ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ                                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | ਵੈੱਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪਸ, JSON, YAML, ਮਾਰਕਡਾਊਨ, + ਹੋਰ ਲਈ ਇੱਕ-ਕਮਾਂਡ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | ਹਰ ਪੁਸ਼ ਤੇ ਅਨੁਵਾਦਾਂ ਨੂੰ ਆਟੋ-ਕਮਿਟ ਕਰੋ + ਲੋੜ ਪੈਂਦਿਆਂ ਪੁਲ ਰਿਕਵੈਸਟ ਬਣਾਓ        | [/ci](https://lingo.dev/ci)             |
| **SDK**     | ਯੂਜ਼ਰ-ਜਨਰੇਟਿਡ ਸਮੱਗਰੀ ਲਈ ਰੀਅਲਟਾਈਮ ਅਨੁਵਾਦ                                    | [/sdk](https://lingo.dev/sdk)           |

ਹੇਠਾਂ ਹਰ ਇੱਕ ਲਈ ਤੁਰੰਤ ਜਾਣਕਾਰੀ ਦਿੱਤੀ ਗਈ ਹੈ 👇

---

### ⚡️ Lingo.dev CLI

ਆਪਣੇ ਟਰਮਿਨਲ ਤੋਂ ਸਿੱਧੇ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npx lingo.dev@latest run
```

ਇਹ ਹਰ ਸਟਰਿੰਗ ਨੂੰ ਫਿੰਗਰਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ, ਨਤੀਜੇ ਕੈਸ਼ ਕਰਦਾ ਹੈ, ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਚੀਜ਼ਾਂ ਮੁੜ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ ਜੋ ਬਦਲੀਆਂ ਗਈਆਂ ਹਨ।

[ਡੌਕੂਮੈਂਟ ਫਾਲੋ ਕਰੋ →](https://lingo.dev/cli) ਇਹ ਸੈਟਅਪ ਕਰਨ ਦਾ ਤਰੀਕਾ ਜਾਣਨ ਲਈ।

---

### 🔄 Lingo.dev CI/CD

ਆਪਣੇ ਆਪ ਪੂਰਨ ਅਨੁਵਾਦ ਸ਼ਿਪ ਕਰੋ।

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

ਤੁਹਾਡੇ ਰੇਪੋ ਨੂੰ ਹਰਾ ਰੱਖਦਾ ਹੈ ਅਤੇ ਤੁਹਾਡੇ ਪ੍ਰੋਡਕਟ ਨੂੰ ਮੈਨੂਅਲ ਕਦਮਾਂ ਦੇ ਬਿਨਾਂ ਬਹੁਭਾਸ਼ੀ ਰੱਖਦਾ ਹੈ।

[ਡੌਕੂਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

ਡਾਇਨੈਮਿਕ ਸਮੱਗਰੀ ਲਈ ਤੁਰੰਤ ਪ੍ਰਤੀ-ਅਨੁਰੋਧ ਅਨੁਵਾਦ।

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

ਚੈਟ, ਯੂਜ਼ਰ ਟਿੱਪਣੀਆਂ ਅਤੇ ਹੋਰ ਰੀਅਲਟਾਈਮ ਫ਼ਲੋ ਲਈ ਬਿਹਤਰ।

[ਡੌਕੂਮੈਂਟ ਪੜ੍ਹੋ →](https://lingo.dev/sdk)

---

## 🤝 ਕਮਿਊਨਿਟੀ

ਅਸੀਂ ਕਮਿਊਨਿਟੀ-ਚਲਿਤ ਹਾਂ ਅਤੇ ਯੋਗਦਾਨ ਪਸੰਦ ਕਰਦੇ ਹਾਂ!

* ਕੋਈ ਵਿਚਾਰ ਹੈ? [ਇਕ ਇਸ਼ਯੂ ਖੋਲ੍ਹੋ](https://github.com/lingodotdev/lingo.dev/issues)
* ਕੁਝ ਠੀਕ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ? [ਇਕ PR ਭੇਜੋ](https://github.com/lingodotdev/lingo.dev/pulls)
* ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ? [ਸਾਡੇ Discord ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord)

## ⭐ ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇ ਤੁਹਾਨੂੰ ਸਾਡਾ ਕੰਮ ਪਸੰਦ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਇੱਕ ⭐ ਦਿਓ ਅਤੇ 3,000 ਸਟਾਰ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਹਾਇਤਾ ਕਰੋ! 🌟

[

![ਸਟਾਰ ਇਤਿਹਾਸ ਚਾਰਟ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev\&type=Date)

]([https://www.star-history.com/#lingodotdev/lingo.dev&Date](https://www.star-history.com/#lingodotdev/lingo.dev&Date))

## 🌐 ਹੋਰ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ README

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी ](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [ਪੰਜਾਬੀ](/readme/pa.md) • [ਪੰਜਾਬੀ](/readme/pa.md) 

ਆਪਣੀ ਭਾਸ਼ਾ ਨਹੀਂ ਦੇਖ ਰਹੇ? ਇਸਨੂੰ [`i18n.json`](./i18n.json) ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ ਅਤੇ ਇੱਕ PR ਖੋਲ੍ਹੋ!
