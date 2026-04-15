<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – ਸਥਾਨੀਕਰਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ"
    />
  </a>
</p>

<p align="center">
  <strong>
    ਓਪਨ-ਸੋਰਸ ਸਥਾਨੀਕਰਨ ਇੰਜੀਨੀਅਰਿੰਗ ਟੂਲਸ। ਇਕਸਾਰ, ਉੱਚ-ਗੁਣਵੱਤਾ ਵਾਲੇ ਅਨੁਵਾਦਾਂ ਲਈ
    Lingo.dev ਸਥਾਨੀਕਰਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ ਨਾਲ ਕਨੈਕਟ ਕਰੋ।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React ਲਈ Lingo Compiler (ਅਰਲੀ ਅਲਫਾ)</a>
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

| ਟੂਲ                                                | ਇਹ ਕੀ ਕਰਦਾ ਹੈ                                         | ਤੇਜ਼ ਕਮਾਂਡ                         |
| -------------------------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ਐਪਸ ਲਈ AI-ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ i18n ਸੈਟਅਪ              | ਪ੍ਰੋਂਪਟ: `Set up i18n`             |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ਫਾਈਲਾਂ ਨੂੰ ਸਥਾਨੀਕਰਨ ਕਰੋ | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions ਵਿੱਚ ਨਿਰੰਤਰ ਸਥਾਨੀਕਰਨ                   | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n ਰੈਪਰਾਂ ਤੋਂ ਬਿਨਾਂ ਬਿਲਡ-ਟਾਈਮ React ਸਥਾਨੀਕਰਨ        | `withLingo()` ਪਲੱਗਇਨ               |

### ਸਥਾਨੀਕਰਨ ਇੰਜਣ

ਇਹ ਟੂਲਸ [ਸਥਾਨੀਕਰਨ ਇੰਜਣਾਂ](https://lingo.dev) ਨਾਲ ਜੁੜਦੇ ਹਨ – ਸਟੇਟਫੁੱਲ ਅਨੁਵਾਦ API ਜੋ ਤੁਸੀਂ Lingo.dev ਸਥਾਨੀਕਰਨ ਇੰਜੀਨੀਅਰਿੰਗ ਪਲੇਟਫਾਰਮ 'ਤੇ ਬਣਾਉਂਦੇ ਹੋ। ਹਰੇਕ ਇੰਜਣ ਹਰ ਬੇਨਤੀ ਵਿੱਚ ਸ਼ਬਦਾਵਲੀਆਂ, ਬ੍ਰਾਂਡ ਆਵਾਜ਼, ਅਤੇ ਪ੍ਰਤੀ-ਲੋਕੇਲ ਹਿਦਾਇਤਾਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਦਾ ਹੈ, [ਸ਼ਬਦਾਵਲੀ ਗਲਤੀਆਂ ਨੂੰ 16.6–44.6% ਘਟਾਉਂਦਾ ਹੈ](https://lingo.dev/research/retrieval-augmented-localization)। ਜਾਂ [ਆਪਣਾ LLM ਲਿਆਓ](#lingodev-cli)।

---

### Lingo.dev MCP

React ਐਪਸ ਵਿੱਚ i18n ਸੈਟਅਪ ਕਰਨਾ ਗਲਤੀ-ਸੰਭਾਵੀ ਹੈ – AI ਕੋਡਿੰਗ ਸਹਾਇਕ ਵੀ ਗੈਰ-ਮੌਜੂਦ API ਦੇ ਭੁਲੇਖੇ ਪੈਦਾ ਕਰਦੇ ਹਨ ਅਤੇ ਰਾਊਟਿੰਗ ਨੂੰ ਤੋੜ ਦਿੰਦੇ ਹਨ। Lingo.dev MCP AI ਸਹਾਇਕਾਂ ਨੂੰ Next.js, React Router, ਅਤੇ TanStack Start ਲਈ ਫਰੇਮਵਰਕ-ਵਿਸ਼ੇਸ਼ i18n ਗਿਆਨ ਤੱਕ ਢਾਂਚਾਗਤ ਪਹੁੰਚ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ। Claude Code, Cursor, GitHub Copilot Agents, ਅਤੇ Codex ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ਇੱਕ ਕਮਾਂਡ ਵਿੱਚ JSON, YAML, markdown, CSV, ਅਤੇ PO ਫਾਈਲਾਂ ਦਾ ਸਥਾਨੀਕਰਨ ਕਰੋ। ਇੱਕ ਲਾਕਫਾਈਲ ਟਰੈਕ ਕਰਦੀ ਹੈ ਕਿ ਕੀ ਪਹਿਲਾਂ ਹੀ ਸਥਾਨੀਕਰਨ ਹੋ ਚੁੱਕਾ ਹੈ – ਸਿਰਫ਼ ਨਵੀਂ ਜਾਂ ਬਦਲੀ ਹੋਈ ਸਮੱਗਰੀ ਹੀ ਪ੍ਰੋਸੈਸ ਹੁੰਦੀ ਹੈ। Lingo.dev 'ਤੇ ਤੁਹਾਡੇ ਸਥਾਨੀਕਰਨ ਇੰਜਣ ਨੂੰ ਡਿਫਾਲਟ ਕਰਦਾ ਹੈ, ਜਾਂ ਆਪਣਾ LLM ਲਿਆਓ (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

ਤੁਹਾਡੀ ਪਾਈਪਲਾਈਨ ਵਿੱਚ ਨਿਰੰਤਰ ਸਥਾਨੀਕਰਨ। ਹਰ ਪੁਸ਼ ਸਥਾਨੀਕਰਨ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ – ਗੁੰਮ ਸਤਰਾਂ ਕੋਡ ਦੇ ਉਤਪਾਦਨ ਵਿੱਚ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਭਰ ਦਿੱਤੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। GitHub Actions, GitLab CI/CD, ਅਤੇ Bitbucket Pipelines ਨੂੰ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

ਬੈਕਐਂਡ ਕੋਡ ਤੋਂ ਸਿੱਧੇ ਆਪਣੇ ਸਥਾਨੀਕਰਨ ਇੰਜਣ ਨੂੰ ਕਾਲ ਕਰੋ। ਵੈੱਬਹੁੱਕ ਡਿਲੀਵਰੀ ਨਾਲ ਸਿੰਕਰੋਨਸ ਅਤੇ ਐਸਿੰਕ ਸਥਾਨੀਕਰਨ, ਪ੍ਰਤੀ ਲੋਕੇਲ ਫੇਲਯੋਰ ਆਈਸੋਲੇਸ਼ਨ, ਅਤੇ WebSocket ਰਾਹੀਂ ਰੀਅਲ-ਟਾਈਮ ਪ੍ਰਗਤੀ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/api)

---

### React ਲਈ Lingo Compiler (ਸ਼ੁਰੂਆਤੀ ਅਲਫਾ)

i18n ਰੈਪਰਾਂ ਤੋਂ ਬਿਨਾਂ ਬਿਲਡ-ਟਾਈਮ React ਸਥਾਨੀਕਰਨ। ਸਾਦੇ ਅੰਗਰੇਜ਼ੀ ਟੈਕਸਟ ਨਾਲ ਕੰਪੋਨੈਂਟ ਲਿਖੋ – ਕੰਪਾਈਲਰ ਅਨੁਵਾਦਯੋਗ ਸਤਰਾਂ ਦਾ ਪਤਾ ਲਗਾਉਂਦਾ ਹੈ ਅਤੇ ਬਿਲਡ ਟਾਈਮ 'ਤੇ ਸਥਾਨੀਕ੍ਰਿਤ ਵੇਰੀਐਂਟ ਤਿਆਰ ਕਰਦਾ ਹੈ। ਕੋਈ ਅਨੁਵਾਦ ਕੁੰਜੀਆਂ ਨਹੀਂ, ਕੋਈ JSON ਫਾਈਲਾਂ ਨਹੀਂ, ਕੋਈ `t()` ਫੰਕਸ਼ਨ ਨਹੀਂ। Next.js (App Router) ਅਤੇ Vite + React ਨੂੰ ਸਮਰਥਨ ਕਰਦਾ ਹੈ।

[ਦਸਤਾਵੇਜ਼ ਪੜ੍ਹੋ →](https://lingo.dev/en/docs/react/compiler)

---

## ਯੋਗਦਾਨ

ਯੋਗਦਾਨ ਦਾ ਸੁਆਗਤ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹਨਾਂ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ਾਂ ਦੀ ਪਾਲਣਾ ਕਰੋ:

1. **ਮੁੱਦੇ:** [ਬੱਗਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰੋ ਜਾਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦੀ ਬੇਨਤੀ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ਪੁੱਲ ਰਿਕੁਐਸਟਾਂ:** [ਤਬਦੀਲੀਆਂ ਸਬਮਿਟ ਕਰੋ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ਹਰ PR ਲਈ ਚੇਂਜਸੈੱਟ ਦੀ ਲੋੜ ਹੈ: `pnpm new` (ਜਾਂ ਗੈਰ-ਰਿਲੀਜ਼ ਤਬਦੀਲੀਆਂ ਲਈ `pnpm new:empty`)
   - ਸਬਮਿਟ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਯਕੀਨੀ ਬਣਾਓ ਕਿ ਟੈਸਟ ਪਾਸ ਹੋ ਰਹੇ ਹਨ
3. **ਵਿਕਾਸ:** ਇਹ pnpm + turborepo ਮੋਨੋਰੇਪੋ ਹੈ
   - ਨਿਰਭਰਤਾਵਾਂ ਇੰਸਟਾਲ ਕਰੋ: `pnpm install`
   - ਟੈਸਟ ਚਲਾਓ: `pnpm test`
   - ਬਿਲਡ: `pnpm build`

**ਸਹਾਇਤਾ:** [Discord ਕਮਿਊਨਿਟੀ](https://lingo.dev/go/discord)

## ਸਟਾਰ ਇਤਿਹਾਸ

ਜੇਕਰ ਤੁਹਾਨੂੰ Lingo.dev ਉਪਯੋਗੀ ਲੱਗਦਾ ਹੈ, ਤਾਂ ਸਾਨੂੰ ਸਟਾਰ ਦਿਓ ਅਤੇ 10,000 ਸਟਾਰਾਂ ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਸਾਡੀ ਮਦਦ ਕਰੋ!

[

![ਸਟਾਰ ਇਤਿਹਾਸ ਚਾਰਟ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ਸਥਾਨਕ ਦਸਤਾਵੇਜ਼

**ਉਪਲਬਧ ਅਨੁਵਾਦ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ਨਵੀਂ ਭਾਸ਼ਾ ਸ਼ਾਮਲ ਕਰਨਾ:**

1. [BCP-47 ਫਾਰਮੈਟ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ਦੀ ਵਰਤੋਂ ਕਰਦੇ ਹੋਏ [`i18n.json`](./i18n.json) ਵਿੱਚ ਲੋਕੇਲ ਕੋਡ ਸ਼ਾਮਲ ਕਰੋ
2. ਪੁੱਲ ਰਿਕੁਐਸਟ ਜਮ੍ਹਾਂ ਕਰੋ
