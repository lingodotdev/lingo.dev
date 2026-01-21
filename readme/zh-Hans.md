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
    ⚡ Lingo.dev - 开源、AI 驱动的 i18n 工具包，借助 LLM 实现即时本地化。
  </strong>
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
      alt="Product Hunt 月度第一开发工具"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 本周第一产品"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 今日第二产品"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github 趋势"
    />
  </a>
</p>

---

## 认识 Compiler 🆕

**Lingo.dev Compiler** 是一款免费开源的编译中间件，旨在让任何 React 应用在构建时实现多语言支持，无需更改现有 React 组件。

只需安装一次：

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

运行 `next build`，即可看到西班牙语和法语包自动生成 ✨

[阅读文档 →](https://lingo.dev/compiler) 获取完整指南，或 [加入我们的 Discord](https://lingo.dev/go/discord) 获取设置帮助。

---

### 本仓库包含哪些内容？

| 工具         | 简要说明                                          | 文档                                    |
| ------------ | ------------------------------------------------- | --------------------------------------- |
| **Compiler** | 构建时 React 本地化                               | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | 一键本地化网页和移动应用、JSON、YAML、Markdown 等 | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | 每次推送自动提交翻译，如有需要自动创建拉取请求    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | 用户生成内容的实时翻译                            | [/sdk](https://lingo.dev/sdk)           |

下面是每个功能的快速介绍👇

---

### ⚡️ Lingo.dev CLI

直接在终端中翻译代码和内容。

```bash
npx lingo.dev@latest run
```

它会为每个字符串生成指纹，缓存结果，只重新翻译有变动的内容。

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

让你的仓库持续通过检查，让产品无需手动操作即可多语言化。

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

非常适合聊天、用户评论和其他实时场景。

[阅读文档 →](https://lingo.dev/sdk)

---

## 🤝 社区

我们以社区为驱动力，欢迎大家贡献！

- 有想法？[提交 issue](https://github.com/lingodotdev/lingo.dev/issues)
- 想修复问题？[发送 PR](https://github.com/lingodotdev/lingo.dev/pulls)
- 需要帮助？[加入我们的 Discord](https://lingo.dev/go/discord)

## ⭐ Star 历史

如果你喜欢我们的项目，欢迎给我们一个 ⭐，帮助我们达到 6,000 颗星！🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 其他语言版本的 Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [西班牙语](/readme/es.md) • [法语](/readme/fr.md) • [俄语](/readme/ru.md) • [乌克兰语](/readme/uk-UA.md) • [德语](/readme/de.md) • [意大利语](/readme/it.md) • [阿拉伯语](/readme/ar.md) • [希伯来语](/readme/he.md) • [印地语](/readme/hi.md) • [葡萄牙语（巴西）](/readme/pt-BR.md) • [孟加拉语](/readme/bn.md) • [波斯语](/readme/fa.md) • [波兰语](/readme/pl.md) • [土耳其语](/readme/tr.md) • [乌尔都语](/readme/ur.md) • [博杰普尔语](/readme/bho.md) • [阿萨姆语](/readme/as-IN.md) • [古吉拉特语](/readme/gu-IN.md) • [马拉雅拉姆语（印度）](/readme/ml-IN.md) • [马拉地语](/readme/mr-IN.md) • [奥里亚语](/readme/or-IN.md) • [旁遮普语](/readme/pa-IN.md) • [僧伽罗语](/readme/si-LK.md) • [泰米尔语](/readme/ta-IN.md) • [泰卢固语](/readme/te-IN.md)

没有找到你的语言？请将其添加到 [`i18n.json`](./i18n.json) 并提交 PR！

**区域格式：** 使用 [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) 代码：`language[-Script][-REGION]`

- 语言：ISO 639-1/2/3 小写（`en`、`zh`、`bho`）
- 字母书写系统：ISO 15924 首字母大写（`Hans`、`Hant`、`Latn`）
- 地区：ISO 3166-1 alpha-2 大写（`US`、`CN`、`IN`）
- 示例：`en`、`pt-BR`、`zh-Hans`、`sr-Cyrl-RS`
