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
    ⚡ Lingo.dev - 开源的、由 AI 驱动的国际化工具包，使用 LLM 实现即时本地化。
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev 编译器</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

## 认识编译器 🆕

**Lingo.dev 编译器** 是一个免费的开源编译中间件，旨在无需更改现有 React 组件的情况下，在构建时使任何 React 应用程序支持多语言。

一次安装：

```bash
npm install @lingo.dev/compiler
```

在构建配置中启用：

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

运行 `next build`，即可看到西班牙语和法语的构建包 ✨

[阅读文档 →](https://lingo.dev/compiler) 获取完整指南，并 [加入我们的 Discord](https://lingo.dev/go/discord) 以获取设置帮助。

---

### 此仓库包含什么？

| 工具       | 简介                                              | 文档                                    |
| ---------- | ------------------------------------------------- | --------------------------------------- |
| **编译器** | 构建时的 React 本地化                             | [/compiler](https://lingo.dev/compiler) |
| **CLI**    | 一键本地化网页和移动应用、JSON、YAML、Markdown 等 | [/cli](https://lingo.dev/cli)           |
| **CI/CD**  | 每次推送时自动提交翻译 + 如有需要创建拉取请求     | [/ci](https://lingo.dev/ci)             |
| **SDK**    | 用户生成内容的实时翻译                            | [/sdk](https://lingo.dev/sdk)           |

以下是每个功能的快速概览 👇

---

### ⚡️ Lingo.dev CLI

直接从终端翻译代码和内容。

```bash
npx lingo.dev@latest run
```

它为每个字符串生成指纹，缓存结果，并且只重新翻译发生变化的内容。

[查看文档 →](https://lingo.dev/cli) 了解如何设置。

---

### 🔄 Lingo.dev CI/CD

自动交付完美的翻译。

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

让你的代码库保持绿色，让你的产品多语言化，无需手动操作。

[阅读文档 →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

为动态内容提供即时按需翻译。

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

非常适合聊天、用户评论和其他实时流程。

[阅读文档 →](https://lingo.dev/sdk)

---

## 🤝 社区

我们以社区为驱动，欢迎大家的贡献！

- 有想法？[提交一个问题](https://github.com/lingodotdev/lingo.dev/issues)
- 想修复某些内容？[发送一个 PR](https://github.com/lingodotdev/lingo.dev/pulls)
- 需要帮助？[加入我们的 Discord](https://lingo.dev/go/discord)

## ⭐ Star 历史

如果你喜欢我们的项目，请为我们点个⭐，帮助我们达到6,000颗星！🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 其他语言的自述文件

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Bhojpuri](/readme/bho.md)

没有看到您的语言？将其添加到 [`i18n.json`](./i18n.json) 并提交一个 PR！
