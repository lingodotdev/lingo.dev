<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – 本地化工程平台"
    />
  </a>
</p>

<p align="center">
  <strong>
    开源本地化工程工具。连接 Lingo.dev 本地化工程平台，获得一致、优质的翻译。
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React（早期 Alpha 版）</a>
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

## 快速开始

| 工具                                               | 功能                                      | 快速命令                           |
| -------------------------------------------------- | ----------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | AI 辅助的 React 应用 i18n 配置            | 提示：`Set up i18n`                |
| [**Lingo CLI**](#lingodev-cli)                     | 本地化 JSON、YAML、Markdown、CSV、PO 文件 | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | 在 GitHub Actions 中持续本地化            | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | 构建时 React 本地化，无需 i18n 包装器     | `withLingo()` 插件                 |

### 本地化引擎

这些工具连接到[本地化引擎](https://lingo.dev)——您在 Lingo.dev 本地化工程平台上创建的有状态翻译 API。每个引擎在所有请求中持久化术语表、品牌语调和特定语言的指令，[将术语错误减少 16.6–44.6%](https://lingo.dev/research/retrieval-augmented-localization)。或者[使用您自己的 LLM](#lingodev-cli)。

---

### Lingo.dev MCP

在 React 应用中配置 i18n 容易出错——即使是 AI 编码助手也会幻想出不存在的 API 并破坏路由。Lingo.dev MCP 为 AI 助手提供对 Next.js、React Router 和 TanStack Start 框架特定 i18n 知识的结构化访问。适用于 Claude Code、Cursor、GitHub Copilot Agents 和 Codex。

[阅读文档 →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

一条命令本地化 JSON、YAML、Markdown、CSV 和 PO 文件。锁定文件跟踪已本地化的内容——仅处理新增或更改的内容。默认使用 Lingo.dev 上的本地化引擎，或使用您自己的 LLM（OpenAI、Anthropic、Google、Mistral、OpenRouter、Ollama）。

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[查看文档 →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

在您的流水线中实现持续本地化。每次推送都会触发本地化——缺失的字符串会在代码发布到生产环境之前自动填充。支持 GitHub Actions、GitLab CI/CD 和 Bitbucket Pipelines。

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[查看文档 →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

直接从后端代码调用您的本地化引擎。支持同步和异步本地化，提供 webhook 交付、按语言环境隔离故障以及通过 WebSocket 实时监控进度。

[查看文档 →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler for React（早期测试版）

无需 i18n 包装器的构建时 React 本地化。使用纯英文文本编写组件——编译器会检测可翻译字符串并在构建时生成本地化版本。无需翻译键、无需 JSON 文件、无需 `t()` 函数。支持 Next.js（App Router）和 Vite + React。

[查看文档 →](https://lingo.dev/en/docs/react/compiler)

---

## 贡献

欢迎贡献。请遵循以下准则：

1. **问题：**[报告错误或请求功能](https://github.com/lingodotdev/lingo.dev/issues)
2. **拉取请求：**[提交更改](https://github.com/lingodotdev/lingo.dev/pulls)
   - 每个 PR 都需要一个变更集：`pnpm new`（或使用 `pnpm new:empty` 进行非发布更改）
   - 提交前确保测试通过
3. **开发：**这是一个 pnpm + turborepo 单体仓库
   - 安装依赖：`pnpm install`
   - 运行测试：`pnpm test`
   - 构建：`pnpm build`

**支持：**[Discord 社区](https://lingo.dev/go/discord)

## Star 历史

如果您觉得 Lingo.dev 有用，请给我们一个 star，帮助我们达到 10,000 个 star！

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 本地化文档

**可用翻译：**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**添加新语言：**

1. 使用 [BCP-47 格式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)将语言代码添加到 [`i18n.json`](./i18n.json)
2. 提交拉取请求
