<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - open-source, AI-powered i18n toolkit for instant localization with LLMs.</strong>
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

## Meet the Compiler 🆕

**Lingo.dev Compiler** is a free, open-source compiler middleware, designed to make any React app multilingual at build time without requiring any changes to the existing React components.

Install once:

```bash
npm install lingo.dev
```

Enable in your build config:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Run `next build` and watch Spanish and French bundles pop out ✨

[Read the docs →](https://lingo.dev/compiler) for the full guide, and [Join our Discord](https://lingo.dev/go/discord) to get help with your setup.

---

### What's inside this repo?

| Tool         | TL;DR                                                                          | Docs                                    |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Build-time React localization                                                  | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | One-command localization for web and mobile apps, JSON, YAML, markdown, + more | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit translations on every push + create pull requests if needed        | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Realtime translation for user-generated content                                | [/sdk](https://lingo.dev/sdk)           |

Below are the quick hits for each 👇

---

### ⚡️ Lingo.dev CLI

Translate code & content straight from your terminal.

```bash
npx lingo.dev@latest run
```

It fingerprints every string, caches results, and only re-translates what changed.

[Follow the docs →](https://lingo.dev/cli) to learn how to set it up.

---

### 📸 Context Snapshot Manifest

Feed your translators with real UI context. Once you've run the compiler, capture a manifest that links every localized JSX scope to its DOM marker:

```bash
npx lingo.dev@latest review capture
```

The command reads `meta.json`/`dictionary.js`, outputs `.lingo/context/context-manifest.json`, and reminds you to enable `exposeContextAttribute` in your build config so `data-lingo-id` markers show up in the rendered app.

Each manifest entry includes the compiler-provided `marker.attribute`/`marker.value` pair alongside source and translated strings, making it easy to target the exact DOM nodes when capturing context.

Add per-route capture rules under the new `review` block in `i18n.json` to drive upcoming screenshot automation.

---

### 🔄 Lingo.dev CI/CD

Ship perfect translations automatically.

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

Keeps your repo green and your product multilingual without the manual steps.

[Read the docs →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Instant per-request translation for dynamic content.

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

Perfect for chat, user comments, and other real-time flows.

[Read the docs →](https://lingo.dev/sdk)

---

## 🤝 Community

We're community-driven and love contributions!

- Got an idea? [Open an issue](https://github.com/lingodotdev/lingo.dev/issues)
- Want to fix something? [Send a PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Need help? [Join our Discord](https://lingo.dev/go/discord)

## ⭐ Star History

If you like what we're doing, give us a ⭐ and help us reach 5,000 stars! 🌟

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme in other languages

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Bhojpuri](/readme/bho.md)

Don't see your language? Add it to [`i18n.json`](./i18n.json) and open a PR!
