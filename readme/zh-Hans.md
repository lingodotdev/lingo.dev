<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev - 基于 LLM 的开源本地化 i18n 工具包</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

| 工具                               | 使用场景                                | 快速命令                           |
| ---------------------------------- | --------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React 应用的 AI 辅助 i18n 配置          | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | 翻译 JSON、YAML、markdown、CSV、PO 文件 | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions 自动化翻译流程           | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | 动态内容的运行时翻译                    | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | 无需 i18n 包装器的 React 构建时本地化   | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol 服务器，支持 AI 编码助手通过自然语言提示在 React 应用中搭建 i18n 基础设施。

**支持的 IDE：**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**支持的框架：**

- Next.js（App Router & Pages Router v13-16）
- TanStack Start（v1）
- React Router（v7）

**用法：**

在您的 IDE 中配置 MCP 服务器后（[参见快速入门指南](https://lingo.dev/en/mcp)），提示您的助手：

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

助手将会：

1. 配置基于语言环境的路由（例如：`/en`、`/es`、`/pt-BR`）
2. 设置语言切换组件
3. 实现自动语言环境检测
4. 生成所需的配置文件

**注意：** AI 辅助代码生成具有不确定性。请在提交前仔细检查生成的代码。

[阅读文档 →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

开源 CLI，支持使用 AI 翻译应用和内容。兼容所有行业标准格式，包括 JSON、YAML、CSV、PO 文件和 markdown。

**设置：**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**工作原理：**

1. 从已配置的文件中提取可翻译内容
2. 将内容发送至 LLM 提供商进行翻译
3. 将翻译内容写回文件系统
4. 创建 `i18n.lock` 文件以跟踪已完成的翻译（避免重复处理）

**配置：**

`init` 命令会生成一个 `i18n.json` 文件。可配置语言环境和分组：

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

`provider` 字段为可选项（默认为 Lingo.dev Engine）。如需自定义 LLM 提供商：

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**支持的 LLM 提供商：**

- Lingo.dev Engine（推荐）
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[阅读文档 →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

为 CI/CD 流水线提供自动化翻译工作流，防止未完成的翻译进入生产环境。

**支持的平台：**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions 配置：**

创建 `.github/workflows/translate.yml`：

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**配置要求：**

1. 将 `LINGODOTDEV_API_KEY` 添加到仓库机密（设置 > 机密和变量 > Actions）
2. 针对 PR 工作流：在设置 > Actions > 常规中启用“允许 GitHub Actions 创建和批准拉取请求”

**工作流选项：**

直接提交翻译：

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

通过拉取请求提交翻译：

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**可用输入项：**

| 输入                 | 默认值                                         | 描述                   |
| -------------------- | ---------------------------------------------- | ---------------------- |
| `api-key`            | （必填）                                       | Lingo.dev API 密钥     |
| `pull-request`       | `false`                                        | 创建 PR 而不是直接提交 |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | 自定义提交信息         |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | 自定义 PR 标题         |
| `working-directory`  | `"."`                                          | 运行目录               |
| `parallel`           | `false`                                        | 启用并行处理           |

[阅读文档 →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

用于动态内容的运行时翻译库。支持 JavaScript、PHP、Python 和 Ruby。

**安装：**

```bash
npm install lingo.dev
```

**用法：**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**可用 SDK：**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web 应用、Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP、Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django、Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[阅读文档 →](https://lingo.dev/en/sdk)

---

### Lingo.dev 编译器

构建时翻译系统，使 React 应用无需修改组件即可实现多语言支持。在构建阶段运行，而非运行时。

**安装：**

```bash
pnpm install @lingo.dev/compiler
```

**认证：**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**配置（Next.js）：**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**配置（Vite）：**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Provider 设置：**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**语言切换器：**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**开发环境：** `npm run dev`（使用伪翻译器，无需 API 调用）

**生产环境：** 设置 `usePseudotranslator: false`，然后 `next build`

将 `.lingo/` 目录提交到版本控制。

**主要特性：**

- 零运行时性能损耗
- 无需翻译 key 或 JSON 文件
- 无 `t()` 函数或 `<T>` 包裹组件
- 自动检测 JSX 中可翻译文本
- 支持 TypeScript
- 支持 ICU MessageFormat 复数
- 通过 `data-lingo-override` 属性手动覆盖
- 内置翻译编辑器小部件

**构建模式：**

- `pseudotranslator`：开发模式，使用占位翻译（无 API 成本）
- `real`：使用 LLM 生成实际翻译
- `cache-only`：生产模式，使用 CI 预生成的翻译（无 API 调用）

**支持的框架：**

- Next.js（App Router，支持 React Server Components）
- Vite + React（SPA 和 SSR）

计划支持更多框架。

[阅读文档 →](https://lingo.dev/en/compiler)

---

## 参与贡献

欢迎贡献。请遵循以下指南：

1. **问题反馈：** [报告 bug 或请求新功能](https://github.com/lingodotdev/lingo.dev/issues)
2. **拉取请求：** [提交更改](https://github.com/lingodotdev/lingo.dev/pulls)
   - 每个 PR 需要包含 changeset：`pnpm new`（或非发布更改用 `pnpm new:empty`）
   - 提交前请确保所有测试通过
3. **开发：** 本项目为 pnpm + turborepo 单体仓库
   - 安装依赖：`pnpm install`
   - 运行测试：`pnpm test`
   - 构建：`pnpm build`

**支持：** [Discord 社区](https://lingo.dev/go/discord)

## Star 历史

如果你觉得 Lingo.dev 有用，请为我们点亮 star，助力我们达成 10,000 star！

[

![Star 历史图表](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 本地化文档

**可用翻译：**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [西班牙语](/readme/es.md) • [法语](/readme/fr.md) • [俄语](/readme/ru.md) • [乌克兰语](/readme/uk-UA.md) • [德语](/readme/de.md) • [意大利语](/readme/it.md) • [阿拉伯语](/readme/ar.md) • [希伯来语](/readme/he.md) • [印地语](/readme/hi.md) • [葡萄牙语（巴西）](/readme/pt-BR.md) • [孟加拉语](/readme/bn.md) • [波斯语](/readme/fa.md) • [波兰语](/readme/pl.md) • [土耳其语](/readme/tr.md) • [乌尔都语](/readme/ur.md) • [博杰普尔语](/readme/bho.md) • [阿萨姆语](/readme/as-IN.md) • [古吉拉特语](/readme/gu-IN.md) • [马拉地语](/readme/mr-IN.md) • [奥里亚语](/readme/or-IN.md) • [旁遮普语](/readme/pa-IN.md) • [僧伽罗语](/readme/si-LK.md) • [泰米尔语](/readme/ta-IN.md) • [泰卢固语](/readme/te-IN.md)

**添加新语言：**

1. 按 [`i18n.json`] (./i18n.json) 添加 locale 代码，使用 [BCP-47 格式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. 提交拉取请求

**BCP-47 locale 格式：** `language[-Script][-REGION]`

- `language`：ISO 639-1/2/3（小写）：`en`、`zh`、`bho`
- `Script`：ISO 15924（首字母大写）：`Hans`、`Hant`、`Latn`
- `REGION`：ISO 3166-1 alpha-2（大写）：`US`、`CN`、`IN`
- 示例：`en`、`pt-BR`、`zh-Hans`、`sr-Cyrl-RS`
