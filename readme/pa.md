<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - ਓਪਨ-ਸੋਰਸ, AI-ਸੰਚਾਲਿਤ i18n ਟੂਲਕਿੱਟ LLMs ਨਾਲ ਤੁਰੰਤ ਸਥਾਨੀਕਰਨ ਲਈ।</strong>
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

## ਕੰਪਾਇਲਰ ਨੂੰ ਮਿਲੋ 🆕

**Lingo.dev ਕੰਪਾਇਲਰ** ਇੱਕ ਮੁਫਤ, ਓਪਨ-ਸੋਰਸ ਕੰਪਾਇਲਰ ਮਿਡਲਵੇਅਰ ਹੈ, ਜੋ ਕਿਸੇ ਵੀ React ਐਪ ਨੂੰ ਬਿਲਡ ਟਾਈਮ 'ਤੇ ਬਹੁ-ਭਾਸ਼ਾਈ ਬਣਾਉਣ ਲਈ ਡਿਜ਼ਾਈਨ ਕੀਤਾ ਗਿਆ ਹੈ ਬਿਨਾਂ ਮੌਜੂਦਾ React ਕੰਪੋਨੈਂਟਸ ਵਿੱਚ ਕੋਈ ਤਬਦੀਲੀਆਂ ਕੀਤੇ।

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

`next build` ਚਲਾਓ ਅਤੇ ਸਪੈਨਿਸ਼ ਅਤੇ ਫਰੈਂਚ ਬੰਡਲ ਨੂੰ ਬਾਹਰ ਆਉਂਦੇ ਦੇਖੋ ✨

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/compiler) ਪੂਰੀ ਗਾਈਡ ਲਈ, ਅਤੇ [ਸਾਡੀ Discord ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ](https://lingo.dev/go/discord) ਆਪਣੇ ਸੈੱਟਅੱਪ ਵਿੱਚ ਮਦਦ ਲੈਣ ਲਈ।

---

### ਇਸ ਰਿਪੋ ਵਿੱਚ ਕੀ ਹੈ?

| ਟੂਲ         | ਸੰਖੇਪ ਵੇਰਵਾ                                                                          | ਦਸਤਾਵੇਜ਼                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **ਕੰਪਾਇਲਰ** | ਬਿਲਡ-ਟਾਈਮ React ਸਥਾਨੀਕਰਨ                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | ਵੈੱਬ ਅਤੇ ਮੋਬਾਈਲ ਐਪਸ, JSON, YAML, markdown, + ਹੋਰ ਲਈ ਇੱਕ-ਕਮਾਂਡ ਸਥਾਨੀਕਰਨ | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | ਹਰ ਪੁਸ਼ 'ਤੇ ਆਟੋ-ਕਮਿੱਟ ਅਨੁਵਾਦ + ਲੋੜ ਪੈਣ 'ਤੇ pull requests ਬਣਾਓ        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ਉਪਭੋਗਤਾ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੀ ਸਮੱਗਰੀ ਲਈ ਰੀਅਲਟਾਈਮ ਅਨੁਵਾਦ                                | [/sdk](https://lingo.dev/sdk)           |

ਹੇਠਾਂ ਹਰੇਕ ਲਈ ਤੁਰੰਤ ਹਿੱਟ ਹਨ 👇

---

### ⚡️ Lingo.dev CLI

ਆਪਣੇ ਟਰਮੀਨਲ ਤੋਂ ਸਿੱਧੇ ਕੋਡ ਅਤੇ ਸਮੱਗਰੀ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npx lingo.dev@latest run
```

ਇਹ ਹਰ ਸਟਰਿੰਗ ਦੀ ਫਿੰਗਰਪ੍ਰਿੰਟ ਕਰਦਾ ਹੈ, ਨਤੀਜਿਆਂ ਨੂੰ ਕੈਸ਼ ਕਰਦਾ ਹੈ, ਅਤੇ ਸਿਰਫ ਉਸੇ ਦਾ ਮੁੜ-ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ ਜੋ ਬਦਲਿਆ ਹੈ।

[ਦਸਤਾਵੇਜ਼ਾਂ ਦਾ ਪਾਲਣ ਕਰੋ →](https://lingo.dev/cli) ਇਹ ਸਿੱਖਣ ਲਈ ਕਿ ਇਸਨੂੰ ਕਿਵੇਂ ਸੈੱਟ ਅੱਪ ਕਰਨਾ ਹੈ।

---

### 🤖 Lingo.dev CI/CD

GitHub Actions ਰਾਹੀਂ ਆਟੋਮੈਟਿਕ ਅਨੁਵਾਦ।

```yaml
- uses: lingodotdev/actions@v1
  with:
    api-key: ${{ secrets.LINGO_API_KEY }}
```

ਹਰ ਤਬਦੀਲੀ ਆਪਣੇ-ਆਪ ਅਨੁਵਾਦਿਤ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਤੁਹਾਡੀ ਰਿਪੋ ਵਿੱਚ ਵਾਪਸ ਕਮਿੱਟ ਹੋ ਜਾਂਦੀ ਹੈ।

[ਹੋਰ ਜਾਣੋ →](https://lingo.dev/ci)

---

### 📦 Lingo.dev SDK

ਉਪਭੋਗਤਾ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤੀ ਸਮੱਗਰੀ, ਸੂਚਨਾਵਾਂ, ਚੈਟ ਸੁਨੇਹੇ, ਅਤੇ ਹੋਰ ਬਹੁਤ ਕੁਝ ਦਾ ਅਨੁਵਾਦ ਕਰੋ।

```bash
npm install @lingo.dev/sdk
```

```ts
import { Lingo } from "@lingo.dev/sdk";

const lingo = new Lingo({ apiKey: "..." });

const translation = await lingo.translate({
  text: "ਸੁਆਗਤ ਹੈ",
  targetLocale: "en",
});

console.log(translation); // "Welcome"
```

[API ਹਵਾਲਾ →](https://lingo.dev/sdk)

---

## ਕਿਉਂ Lingo.dev?

- **⚡ ਤੇਜ਼**: ਬਿਲਡ-ਟਾਈਮ ਸਥਾਨੀਕਰਨ = ਰਨ-ਟਾਈਮ 'ਤੇ ਜ਼ੀਰੋ ਓਵਰਹੈੱਡ
- **🎯 ਸਹੀ**: ਸੰਦਰਭ ਦੇ ਨਾਲ ਅਨੁਵਾਦ ਕਰੋ, ਨਾ ਸਿਰਫ਼ ਸ਼ਬਦ
- **🔒 ਸੁਰੱਖਿਅਤ**: ਤੁਹਾਡਾ ਡੇਟਾ ਕਦੇ ਵੀ ਤੀਜੀ-ਧਿਰ LLM APIs ਨੂੰ ਨਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ (ਸਵੈ-ਹੋਸਟਿੰਗ ਵਿਕਲਪ ਦੇ ਨਾਲ)
- **🌍 ਸਕੇਲ**: 100+ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰੋ
- **💰 ਲਾਗਤ-ਪ੍ਰਭਾਵਸ਼ਾਲੀ**: ਅਨੁਵਾਦ ਕੈਸ਼ ਕੀਤੇ ਜਾਂਦੇ ਹਨ, ਸਿਰਫ deltas ਲਈ ਭੁਗਤਾਨ ਕਰੋ
- **🔧 ਵਿਸਤਾਰਯੋਗ**: ਆਪਣੇ ਖੁਦ ਦੇ ਅਨੁਵਾਦ ਪ੍ਰਦਾਤਾ ਜੋੜੋ

---

## ਸ਼ੁਰੂ ਕਰੋ

### ਕੰਪਾਇਲਰ

```bash
npm install lingo.dev
```

[ਕੰਪਾਇਲਰ ਗਾਈਡ →](https://lingo.dev/compiler)

### CLI

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[CLI ਗਾਈਡ →](https://lingo.dev/cli)

### SDK

```bash
npm install @lingo.dev/sdk
```

[SDK ਹਵਾਲਾ →](https://lingo.dev/sdk)

---

## ਏਕੀਕਰਣ

Lingo.dev ਕੰਮ ਕਰਦਾ ਹੈ:

- ✅ **Next.js** (Pages ਅਤੇ App Router)
- ✅ **Vite**
- ✅ **React Router v7**
- ✅ **AdonisJS**
- ✅ **Directus**
- ✅ ਹਰ ਫਰੇਮਵਰਕ ਜੋ ਬੰਡਲਿੰਗ ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ

[ਏਕੀਕਰਣ ਗਾਈਡਾਂ →](https://lingo.dev/integrations)

---

## ਉਦਾਹਰਣਾਂ

ਇਸ ਰਿਪੋ ਵਿੱਚ ਸ਼ਾਮਲ ਹਨ:

- [Next.js App](demo/next-app) - App Router ਨਾਲ ਪੂਰੀ Next.js ਉਦਾਹਰਣ
- [Vite React](demo/vite-project) - Vite + React ਨਾਲ ਸਧਾਰਨ ਉਦਾਹਰਣ
- [React Router v7](demo/react-router-app) - React Router v7 ਏਕੀਕਰਣ
- [AdonisJS](demo/adonisjs) - AdonisJS ਬੈਕਐਂਡ ਉਦਾਹਰਣ

ਹਰੇਕ ਉਦਾਹਰਣ ਵਿੱਚ ਇੱਕ ਤਿਆਰ ਸੈੱਟਅੱਪ ਅਤੇ ਕੰਮ ਕਰਦਾ ਲਾਗੂਕਰਨ ਹੈ।

---

## ਭਾਈਚਾਰਾ

- [Discord](https://lingo.dev/go/discord) - ਸਵਾਲ, ਮਦਦ, ਅਤੇ ਵਿਚਾਰ ਸਾਂਝੇ ਕਰੋ
- [GitHub Discussions](https://github.com/lingodotdev/lingo.dev/discussions) - ਵਿਸ਼ੇਸ਼ਤਾ ਬੇਨਤੀਆਂ ਅਤੇ ਚਰਚਾਵਾਂ
- [Twitter](https://twitter.com/lingodotdev) - ਤਾਜ਼ਾ ਖ਼ਬਰਾਂ ਅਤੇ ਅੱਪਡੇਟ

---

## ਯੋਗਦਾਨ

ਅਸੀਂ ਯੋਗਦਾਨਾਂ ਦਾ ਸੁਆਗਤ ਕਰਦੇ ਹਾਂ! ਕਿਰਪਾ ਕਰਕੇ [CONTRIBUTING.md](CONTRIBUTING.md) ਵੇਖੋ ਵੇਰਵਿਆਂ ਲਈ।

---

## ਲਾਇਸੰਸ

MIT © [Lingo.dev](https://lingo.dev)

---

<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/logo.png" width="64" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  Lingo.dev ਨਾਲ ਬਣਾਇਆ ਗਿਆ ❤️
</p>
