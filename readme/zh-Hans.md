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
    ⚡ Lingo.dev - 开源的、由 AI 驱动的国际化工具包，利用 LLM 实现即时本地化。
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev 编译器</a> •
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
</p>

---

## 认识编译器 🆕

**Lingo.dev 编译器** 是一个免费、开源的编译中间件，旨在无需更改现有 React 组件的情况下，在构建时让任何 React 应用支持多语言。

一次安装：

```bash
npm install lingo.dev
```

在构建配置中启用：

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

运行 `next build`，即可看到西班牙语和法语的包生成 ✨

[阅读文档 →](https://lingo.dev/compiler) 获取完整指南，并[加入我们的 Discord](https://lingo.dev/go/discord) 以获得设置帮助。

---

### 此仓库包含什么内容？

| 工具         | 简介                                              | 文档                                    |
| ------------ | ------------------------------------------------- | --------------------------------------- |
| **Compiler** | 构建时的 React 本地化                             | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | 一键本地化网页和移动应用、JSON、YAML、Markdown 等 | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | 每次推送时自动提交翻译 + 根据需要创建拉取请求     | [/ci](https://lingo.dev/ci)             |
| **SDK**      | 用户生成内容的实时翻译                            | [/sdk](https://lingo.dev/sdk)           |

以下是每个工具的快速概览 👇

---

### ⚡️ Lingo.dev CLI

直接从终端翻译代码和内容。

```bash
npx lingo.dev@latest run
```

它会为每个字符串生成指纹，缓存结果，并仅重新翻译更改的部分。

[查看文档 →](https://lingo.dev/cli) 了解如何设置。

---

### 🔄 Lingo.dev CI/CD

自动交付完美翻译。

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

让你的代码库保持绿色，让你的产品无需手动步骤即可实现多语言支持。

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

我们以社区为驱动，欢迎您的贡献！

- 有想法？[提交问题](https://github.com/lingodotdev/lingo.dev/issues)
- 想修复问题？[发送 PR](https://github.com/lingodotdev/lingo.dev/pulls)
- 需要帮助？[加入我们的 Discord](https://lingo.dev/go/discord)

## ⭐ Star 历史

如果您喜欢我们的工作，请给我们一个 ⭐，帮助我们达到 3,000 个星标！🌟

[

![Star 历史图表](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 其他语言的自述文件

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

没有看到您的语言？将其添加到 [`i18n.json`](./i18n.json) 并提交一个 PR！
