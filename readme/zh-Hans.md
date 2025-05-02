<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ 基于 AI 的开源 CLI，用于网页和移动端本地化。</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">文档</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">贡献</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">为仓库加星</a>
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

Lingo.dev 是一个社区驱动的开源 CLI，专为基于 AI 的网页和移动应用本地化而设计。

Lingo.dev 旨在即时生成高质量的翻译，消除手动工作和管理负担。因此，团队可以以 100 倍的速度完成精准本地化，将功能快速交付给全球更多满意的用户。它可以与您自己的 LLM 一起使用，也可以使用 Lingo.dev 管理的本地化引擎。

> **鲜为人知的事实：** Lingo.dev 起源于 2023 年的一次学生黑客马拉松中的一个小项目！经过多次迭代，我们在 2024 年被 Y Combinator 接受，现在正在招聘！有兴趣构建下一代本地化工具吗？请将您的简历发送至 careers@lingo.dev！🚀

## 📑 本指南内容

- [快速开始](#-quickstart) - 几分钟内上手
- [缓存](#-caching-with-i18nlock) - 优化翻译更新
- [GitHub Action](#-github-action) - 在CI/CD中自动化本地化
- [功能](#-supercharged-features) - Lingo.dev强大的原因
- [文档](#-documentation) - 详细指南和参考
- [贡献](#-contribute) - 加入我们的社区

## 💫 快速开始

Lingo.dev CLI设计为既可以与您自己的LLM一起工作，也可以与Lingo.dev管理的基于最新SOTA（最先进）LLM构建的本地化引擎一起工作。

### 使用您自己的LLM（BYOK或自带密钥）

1. 创建一个 `i18n.json` 配置文件：

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

2. 将您的 API 密钥设置为环境变量：

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# 或者对于 OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. 运行本地化：

```bash
npx lingo.dev@latest i18n
```

### 使用 Lingo.dev 云服务

通常，生产级应用需要翻译记忆库、术语表支持和本地化质量保证等功能。有时，您可能希望由专家为您决定使用哪个 LLM 提供商和模型，并在发布新模型时自动更新。Lingo.dev 是一个提供这些功能的托管本地化引擎：

1. 创建一个 `i18n.json` 配置文件（不包含 provider 节点）：

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. 与 Lingo.dev 进行身份验证：

```bash
npx lingo.dev@latest auth --login
```

3. 运行本地化：

```bash
npx lingo.dev@latest i18n
```

## 📖 文档

有关详细指南和 API 参考，请访问[文档](https://lingo.dev/go/docs)。

## 🔒 使用 `i18n.lock` 进行缓存

Lingo.dev 使用 `i18n.lock` 文件跟踪内容校验和，确保只有更改过的文本才会被翻译。这样可以提高：

- ⚡️ **速度**：跳过已翻译的内容
- 🔄 **一致性**：防止不必要的重新翻译
- 💰 **成本**：不对重复翻译计费

## 🤖 GitHub Action

Lingo.dev 提供了一个 GitHub Action 来在您的 CI/CD 流程中自动化本地化。以下是基本设置：

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

此操作会在每次推送时运行 `lingo.dev i18n`，自动保持您的翻译内容最新。

关于拉取请求模式和其他配置选项，请访问我们的 [GitHub Action 文档](https://docs.lingo.dev/ci-action/gha)。

## ⚡️ Lingo.dev的超能力

- 🔥 **即时集成**：几分钟内即可与您的代码库协同工作
- 🔄 **CI/CD自动化**：设置一次，无需再管
- 🌍 **全球覆盖**：向全球用户推送
- 🧠 **AI驱动**：使用最新的语言模型进行自然翻译
- 📊 **格式无关**：支持JSON、YAML、CSV、Markdown、Android、iOS等多种格式
- 🔍 **干净的差异**：完全保留您的文件结构
- ⚡️ **闪电般速度**：翻译在几秒内完成，而非数天
- 🔄 **始终同步**：内容变更时自动更新
- 🌟 **人工质量**：翻译不会显得机械
- 👨‍💻 **由开发者为开发者打造**：我们自己每天都在使用
- 📈 **与您共同成长**：从小项目到企业规模

## 🤝 贡献

Lingo.dev 是社区驱动的，所以我们欢迎所有贡献！

有新功能的想法？创建一个 GitHub issue！

想要贡献代码？创建一个 pull request！

## 🌐 其他语言的自述文件

- [英语](https://github.com/lingodotdev/lingo.dev)
- [中文](/readme/zh-Hans.md)
- [日语](/readme/ja.md)
- [韩语](/readme/ko.md)
- [西班牙语](/readme/es.md)
- [法语](/readme/fr.md)
- [俄语](/readme/ru.md)
- [德语](/readme/de.md)
- [意大利语](/readme/it.md)
- [阿拉伯语](/readme/ar.md)
- [印地语](/readme/hi.md)
- [孟加拉语](/readme/bn.md)

没有看到您的语言？只需将新的语言代码添加到[`i18n.json`](./i18n.json)文件并提交一个PR。
