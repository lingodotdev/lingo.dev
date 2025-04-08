<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ AI驱动的网页和移动应用本地化开源命令行工具。</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">文档</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">贡献</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">为仓库点星</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="发布" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="许可证" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="最后提交" />
  </a>
</p>

<br />

Lingo.dev是一个社区驱动的、AI驱动的网页和移动应用本地化开源命令行工具。

Lingo.dev旨在即时生成地道的翻译，消除手动工作和管理开销。因此，团队可以以100倍的速度进行准确的本地化，将功能推送给全球更多满意的用户。它可以与您自己的LLM一起使用，也可以与Lingo.dev管理的本地化引擎一起使用。

> **鲜为人知的事实：** Lingo.dev最初是2023年一个学生黑客马拉松的小项目！经过多次迭代后，我们在2024年被Y Combinator接纳，现在我们正在招聘！对构建下一代本地化工具感兴趣吗？请将您的简历发送至careers@lingo.dev 🚀

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

Lingo.dev 提供 GitHub Action 来在您的 CI/CD 流程中自动化本地化。以下是基本设置：

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

此操作在每次推送时运行 `lingo.dev i18n`，自动保持您的翻译最新。

关于拉取请求模式和其他配置选项，请访问我们的 [GitHub Action 文档](https://docs.lingo.dev/setup/gha)。

## ⚡️ Lingo.dev的超能力

## ⚡️ Lingo.dev的超能力

- 🔥 **即时集成**：几分钟内即可与您的代码库协同工作
- 🔄 **CI/CD自动化**：设置一次，无需再管
- 🌍 **全球覆盖**：向全球用户发布
- 🧠 **AI驱动**：使用最新语言模型实现自然翻译
- 📊 **格式无关**：支持JSON、YAML、CSV、Markdown、Android、iOS等多种格式
- 🔍 **整洁差异**：完全保留您的文件结构
- ⚡️ **闪电般速度**：翻译只需几秒钟，而非数天
- 🔄 **始终同步**：内容变更时自动更新
- 🌟 **人类品质**：翻译不会显得机械呆板
- 👨‍💻 **由开发者构建，为开发者服务**：我们自己每天都在使用
- 📈 **与您共同成长**：从小型项目到企业级规模

## 🤝 贡献

Lingo.dev是社区驱动的，因此我们欢迎所有贡献！

有新功能的想法？创建GitHub问题！

想要贡献代码？创建拉取请求！

## 🌐 其他语言的自述文件

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

没有看到您的语言？只需在[`i18n.json`](./i18n.json)文件中添加新的语言代码并开启PR。
