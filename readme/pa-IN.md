<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ"
    />
  </a>
</p>

<p align="center">
  <strong>
    ਓਪਨ-ਸੋਰਸ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜੀਨੀਅਰਿੰਗ ਟੂਲਜ਼। ਸਥਿਰ, ਉੱਚ-ਗੁਣਵੱਤਾ ਵਾਲੇ ਅਨੁਵਾਦਾਂ ਲਈ
    Lingo.dev ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ ਨਾਲ ਕਨੈਕਟ ਕਰੋ।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React ਲਈ Lingo Compiler (ਸ਼ੁਰੂਆਤੀ ਅਲਫ਼ਾ)</a>
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

## ਤੁਰੰਤ ਸ਼ੁਰੂਆਤ

| ਟੂਲ                                                | ਇਹ ਕੀ ਕਰਦਾ ਹੈ                                          | ਤੇਜ਼ ਕਮਾਂਡ                         |
| -------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ਐਪਸ ਲਈ AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ i18n ਸੈਟਅੱਪ              | ਪ੍ਰੌਂਪਟ: `Set up i18n`             |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ਫ਼ਾਈਲਾਂ ਨੂੰ ਲੋਕਲਾਈਜ਼ ਕਰੋ | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions ਵਿੱਚ ਲਗਾਤਾਰ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ                | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n ਰੈਪਰਾਂ ਤੋਂ ਬਿਨਾਂ ਬਿਲਡ-ਟਾਈਮ React ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ     | `withLingo()` ਪਲੱਗਇਨ               |

### ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜਣ

ਇਹ ਟੂਲਜ਼ [ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜਣਾਂ](https://lingo.dev) ਨਾਲ ਕਨੈਕਟ ਹੁੰਦੇ ਹਨ – ਸਟੇਟਫੁੱਲ ਅਨੁਵਾਦ APIs ਜੋ ਤੁਸੀਂ Lingo.dev ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ ਤੇ ਬਣਾਉਂਦੇ ਹੋ। ਹਰ ਇੰਜਣ ਹਰੇਕ ਬੇਨਤੀ ਵਿੱਚ ਗਲੋਸਰੀਜ਼, ਬ੍ਰਾਂਡ ਵੌਇਸ, ਅਤੇ ਪ੍ਰਤੀ-ਲੋਕੇਲ ਨਿਰਦੇਸ਼ਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਦਾ ਹੈ, [ਸ਼ਬਦਾਵਲੀ ਗਲਤੀਆਂ ਨੂੰ 16.6–44.6% ਘਟਾਉਂਦਾ ਹੈ](https://lingo.dev/research/retrieval-augmented-localization)। ਜਾਂ [ਆਪਣਾ LLM ਲਿਆਓ](#lingodev-cli)।

---

### Lingo.dev MCP

React ਐਪਸ ਵਿੱਚ i18n ਸੈਟਅੱਪ ਕਰਨਾ ਗਲਤੀਆਂ ਵਾਲਾ ਹੋ ਸਕਦਾ ਹੈ – AI ਕੋਡਿੰਗ ਸਹਾਇਕ ਵੀ ਗੈਰ-ਮੌਜੂਦ APIs ਬਣਾਉਂਦੇ ਹਨ ਅਤੇ ਰਾਉਟਿੰਗ ਨੂੰ ਤੋੜ ਦਿੰਦੇ ਹਨ। Lingo.dev MCP, AI ਸਹਾਇਕਾਂ ਨੂੰ Next.js, React Router, ਅਤੇ TanStack Start ਲਈ ਫ੍ਰੇਮਵਰਕ-ਵਿਸ਼ੇਸ਼ i18n ਗਿਆਨ ਤੱਕ ਸੰਰਚਿਤ ਪਹੁੰਚ ਦਿੰਦਾ ਹੈ। Claude Code, Cursor, GitHub Copilot Agents, ਅਤੇ Codex ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

JSON, YAML, markdown, CSV, ਅਤੇ PO ਫ਼ਾਈਲਾਂ ਨੂੰ ਇੱਕ ਕਮਾਂਡ ਵਿੱਚ ਲੋਕਲਾਈਜ਼ ਕਰੋ। ਇੱਕ ਲੌਕਫਾਈਲ ਟਰੈਕ ਕਰਦੀ ਹੈ ਕਿ ਪਹਿਲਾਂ ਹੀ ਕੀ ਲੋਕਲਾਈਜ਼ ਹੋਇਆ ਹੈ – ਸਿਰਫ਼ ਨਵੀਂ ਜਾਂ ਬਦਲੀ ਗਈ ਸਮੱਗਰੀ ਹੀ ਪ੍ਰੋਸੈਸ ਹੁੰਦੀ ਹੈ। Lingo.dev ਤੇ ਤੁਹਾਡੇ ਲੋਕਲਾਈਜ਼ੇਸ਼ਨ ਇੰਜਣ ਨੂੰ ਡਿਫੌਲਟ ਕਰਦਾ ਹੈ, ਜਾਂ ਆਪਣਾ LLM ਲਿਆਓ (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

ਤੁਹਾਡੀ ਪਾਈਪਲਾਈਨ ਵਿੱਚ ਨਿਰੰਤਰ ਸਥਾਨੀਕਰਨ। ਹਰ ਪੁਸ਼ ਸਥਾਨੀਕਰਨ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ – ਕੋਡ ਪ੍ਰੋਡਕਸ਼ਨ ਵਿੱਚ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਗੁੰਮ ਸਤਰਾਂ ਭਰੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। GitHub Actions, GitLab CI/CD, ਅਤੇ Bitbucket Pipelines ਦਾ ਸਮਰਥਨ ਕਰਦੀ ਹੈ।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

ਬੈਕਐਂਡ ਕੋਡ ਤੋਂ ਸਿੱਧੇ ਆਪਣੇ ਸਥਾਨੀਕਰਨ ਇੰਜਣ ਨੂੰ ਕੌਲ ਕਰੋ। ਵੈਬਹੁੱਕ ਡਿਲੀਵਰੀ ਦੇ ਨਾਲ ਸਿੰਕਰੋਨਸ ਅਤੇ ਐਸਿੰਕ ਸਥਾਨੀਕਰਨ, ਹਰ ਲੋਕੇਲ ਲਈ ਅਸਫਲਤਾ ਅਲੱਗ-ਥਲੱਗ, ਅਤੇ WebSocket ਰਾਹੀਂ ਰੀਅਲ-ਟਾਈਮ ਪ੍ਰਗਤੀ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/api)

---

### React ਲਈ Lingo Compiler (ਸ਼ੁਰੂਆਤੀ ਅਲਫ਼ਾ)

i18n ਰੈਪਰਾਂ ਤੋਂ ਬਿਨਾਂ ਬਿਲਡ-ਟਾਈਮ React ਸਥਾਨੀਕਰਨ। ਸਾਦੇ ਅੰਗਰੇਜ਼ੀ ਟੈਕਸਟ ਨਾਲ ਕੰਪੋਨੈਂਟਸ ਲਿਖੋ – ਕੰਪਾਈਲਰ ਅਨੁਵਾਦਯੋਗ ਸਤਰਾਂ ਦਾ ਪਤਾ ਲਗਾਉਂਦਾ ਹੈ ਅਤੇ ਬਿਲਡ ਟਾਈਮ ਤੇ ਸਥਾਨੀਕ੍ਰਿਤ ਸੰਸਕਰਣ ਤਿਆਰ ਕਰਦਾ ਹੈ। ਕੋਈ ਅਨੁਵਾਦ ਕੀਆਂ ਨਹੀਂ, ਕੋਈ JSON ਫਾਈਲਾਂ ਨਹੀਂ, ਕੋਈ `t()` ਫੰਕਸ਼ਨ ਨਹੀਂ। Next.js (App Router) ਅਤੇ Vite + React ਦਾ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/react/compiler)

---

## ਯੋਗਦਾਨ ਪਾਓ

ਯੋਗਦਾਨ ਦਾ ਸਵਾਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹਨਾਂ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ:

1. **ਮੁੱਦੇ:** [ਬੱਗਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ ਫੀਚਰ ਬੇਨਤੀ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ਪੁੱਲ ਰੀਕੁਐਸਟਸ:** [ਤਬਦੀਲੀਆਂ ਜਮ੍ਹਾਂ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ਹਰ PR ਲਈ ਚੇਂਜਸੈਟ ਜ਼ਰੂਰੀ ਹੈ: `pnpm new` (ਜਾਂ ਗੈਰ-ਰਿਲੀਜ਼ ਤਬਦੀਲੀਆਂ ਲਈ `pnpm new:empty`)
   - ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਟੈਸਟ ਪਾਸ ਹੋਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ
3. **ਵਿਕਾਸ:** ਇਹ ਇੱਕ pnpm + turborepo monorepo ਹੈ
   - ਨਿਰਭਰਤਾਵਾਂ ਸਥਾਪਤ ਕਰੋ: `pnpm install`
   - ਟੈਸਟ ਚਲਾਓ: `pnpm test`
   - ਬਿਲਡ: `pnpm build`

**ਸਹਾਇਤਾ:** [Discord ਕਮਿਊਨਿਟੀ](https://lingo.dev/go/discord)

## ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇ ਤੁਹਾਨੂੰ Lingo.dev ਉਪਯੋਗੀ ਲੱਗਦਾ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਸਟਾਰ ਦਿਓ ਅਤੇ 10,000 ਸਟਾਰ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ਸਥਾਨਿਕ ਦਸਤਾਵੇਜ਼

**ਉਪਲਬਧ ਅਨੁਵਾਦ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ਨਵੀਂ ਭਾਸ਼ਾ ਸ਼ਾਮਲ ਕਰਨਾ:**

1. [BCP-47 ਫਾਰਮੈਟ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ਵਰਤਦੇ ਹੋਏ [`i18n.json`](./i18n.json) ਵਿੱਚ ਲੋਕੇਲ ਕੋਡ ਸ਼ਾਮਲ ਕਰੋ
2. ਪੁੱਲ ਰਿਕਵੈਸਟ ਜਮ੍ਹਾਂ ਕਰੋ
