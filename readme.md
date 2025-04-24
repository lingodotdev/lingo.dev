<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ AI-powered open-source CLI for web & mobile localization.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Docs</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribute</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Star the repo</a>
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
</p>

<br />

Lingo.dev is a community-driven, open-source CLI for AI-powered web and mobile app localization.

Lingo.dev is designed to produce authentic translations instantly, eliminating manual work and management overhead. As a result, teams do accurate localization 100x faster, shipping features to more happy users worldwide. It can be used with your own LLM or with Lingo.dev-managed Localization Engine.

> **Little-known fact:** Lingo.dev began as a small project at a student hackathon back in 2023! Many iterations later, we got accepted into Y Combinator in 2024, and we're now hiring! Interested in building the next-gen localization tools? Send your CV to careers@lingo.dev! 🚀

## 📑 In This Guide

- [Quickstart](#-quickstart) - Get started in minutes
- [Caching](#-caching-with-i18nlock) - Optimize translation updates
- [GitHub Action](#-github-action) - Automate localization in CI/CD
- [Features](#-supercharged-features) - What makes Lingo.dev powerful
- [Documentation](#-documentation) - Detailed guides and references
- [Contribute](#-contribute) - Join our community

## 💫 Quickstart

Lingo.dev CLI is designed to work with both your own LLM, and Lingo.dev-managed Localization Engine built on top of latest SOTA (state-of-the-art) LLMs.

### Using Your Own LLM (BYOK or Bring Your Own Key)

1. Create an `i18n.json` configuration file:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Set your API key as an environment variable:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key
# or for OpenAI
export OPENAI_API_KEY=your_openai_api_key
```

3. Run the localization:

```bash
npx lingo.dev@latest i18n
```

### Using Lingo.dev Cloud

Oftentimes, production-grade apps require features like translation memory, glossary support, and localization quality assurance. Also, sometimes, you want an expert to decide for you which LLM provider and model to use, and to update the model automatically when new ones are released. Lingo.dev is a managed Localization Engine that provides these features:

1. Create an `i18n.json` configuration file (without provider node):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Authenticate with Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Run localization:

```bash
npx lingo.dev@latest i18n
```

## 📖 Documentation

For detailed guides and API references, visit the [documentation](https://lingo.dev/go/docs).

## 🔒 Caching with `i18n.lock`

Lingo.dev uses an `i18n.lock` file to track content checksums, ensuring only changed text gets translated. This improves:

- ⚡️ **Speed**: Skip already translated content
- 🔄 **Consistency**: Prevent unnecessary retranslations
- 💰 **Cost**: No billing for repeated translations

## 🤖 GitHub Action

Lingo.dev offers a GitHub Action to automate localization in your CI/CD pipeline. Here's a basic setup:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

This action runs `lingo.dev i18n` on every push, keeping your translations up-to-date automatically.

For pull request mode and other configuration options, visit our [GitHub Action documentation](https://docs.lingo.dev/ci-action/gha).

## ⚡️ Lingo.dev's Superpowers

- 🔥 **Instant integration**: Works with your codebase in minutes
- 🔄 **CI/CD Automation**: Set it and forget it
- 🌍 **Global reach**: Ship to users everywhere
- 🧠 **AI-powered**: Uses latest language models for natural translations
- 📊 **Format-agnostic**: JSON, YAML, CSV, Markdown, Android, iOS, and many more
- 🔍 **Clean diffs**: Preserves your file structure exactly
- ⚡️ **Lightning-fast**: Translations in seconds, not days
- 🔄 **Always synced**: Automatically updates when content changes
- 🌟 **Human quality**: Translations that don't sound robotic
- 👨‍💻 **Built by devs, for devs**: We use it ourselves daily
- 📈 **Grows with you**: From side project to enterprise scale

## 🤝 Contribute

Lingo.dev is community-driven, so we welcome all contributions!

Have an idea for a new feature? Create a GitHub issue!

Want to contribute? Create a pull request!

## 🌐 Readme in other languages

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

Don't see your language? Just add a new language code to the [`i18n.json`](./i18n.json) file and open a PR.
