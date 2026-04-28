[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/lingodotdev-lingo-dev-badge.png)](https://mseep.ai/app/lingodotdev-lingo-dev)

<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Open-source localization engineering tools. Connect to Lingo.dev localization engineering platform for consistent, quality translations.</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (Early alpha)</a>
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

## Quick Start

| Tool                                               | What it does                                        | Quick Command                      |
| -------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | AI-assisted i18n setup for React apps               | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | Localize JSON, YAML, markdown, CSV, PO files        | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | Continuous localization in GitHub Actions           | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | Build-time React localization without i18n wrappers | `withLingo()` plugin               |

### Localization engines

These tools connect to [localization engines](https://lingo.dev) – stateful translation APIs you create on the Lingo.dev localization engineering platform. Each engine persists glossaries, brand voice, and per-locale instructions across every request, [reducing terminology errors 16.6–44.6%](https://lingo.dev/research/retrieval-augmented-localization). Or [bring your own LLM](#lingodev-cli).

---

### Lingo.dev MCP

Setting up i18n in React apps is error-prone – even AI coding assistants hallucinate non-existent APIs and break routing. Lingo.dev MCP gives AI assistants structured access to framework-specific i18n knowledge for Next.js, React Router, and TanStack Start. Works with Claude Code, Cursor, GitHub Copilot Agents, and Codex.

[Read the docs →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Localize JSON, YAML, markdown, CSV, and PO files in one command. A lockfile tracks what's already localized – only new or changed content gets processed. Defaults to your localization engine on Lingo.dev, or bring your own LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Read the docs →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Continuous localization in your pipeline. Every push triggers localization – missing strings get filled before code reaches production. Supports GitHub Actions, GitLab CI/CD, and Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Read the docs →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Call your localization engine directly from backend code. Synchronous and async localization with webhook delivery, failure isolation per locale, and real-time progress via WebSocket.

[Read the docs →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler for React (Early alpha)

Build-time React localization without i18n wrappers. Write components with plain English text – the compiler detects translatable strings and generates localized variants at build time. No translation keys, no JSON files, no `t()` functions. Supports Next.js (App Router) and Vite + React.

[Read the docs →](https://lingo.dev/en/docs/react/compiler)

---

## Contributing

Contributions welcome. Please follow these guidelines:

1. **Issues:** [Report bugs or request features](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Submit changes](https://github.com/lingodotdev/lingo.dev/pulls)
   - Every PR requires a changeset: `pnpm new` (or `pnpm new:empty` for non-release changes)
   - Ensure tests pass before submitting
3. **Development:** This is a pnpm + turborepo monorepo
   - Install dependencies: `pnpm install`
   - Run tests: `pnpm test`
   - Build: `pnpm build`

**Support:** [Discord community](https://lingo.dev/go/discord)

## Star History

If you find Lingo.dev useful, give us a star and help us reach 10,000 stars!

[![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Localized Documentation

**Available translations:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Adding a new language:**

1. Add locale code to [`i18n.json`](./i18n.json) using [BCP-47 format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Submit a pull request
