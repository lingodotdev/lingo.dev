<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## 团队都在 Lingo.dev 上构建本地化引擎

[本地化引擎](https://lingo.dev/en/docs/platform/engines)是由你的团队配置、由 Lingo.dev 运行的有状态翻译 API。你可以按产品、内容类型或品牌分别构建引擎。每次请求经过某个引擎时，都会按照固定的优先级顺序应用其中的全部配置：

| 层 | 你配置的内容 | 来自文档 |
| --- | --- | --- |
| [LLM 模型](https://lingo.dev/en/docs/platform/llm-models) | 为每个语言对指定处理模型，并设置按优先级排序的回退选项 | 400+ 款模型；响应中会标明实际运行的模型 |
| [品牌语调](https://lingo.dev/en/docs/platform/brand-voices) | 定义你的产品在每种语言中如何表达，每个语言区域对应一段文本 | 按不同市场设置语气和正式程度 |
| [规则](https://lingo.dev/en/docs/platform/rules) | 补足通用模型容易忽略的语言规范 | 例如西班牙语中的形容词位置、百分号前的空格 |
| [术语表](https://lingo.dev/en/docs/platform/glossaries) | 按语言区域设置精确术语映射，并按语义匹配 | 面向欧洲市场时，“911” 会转换为 “112”；产品名称则保持不变 |
| [AI 评估器](https://lingo.dev/en/docs/platform/ai-reviewers) | 每次翻译完成后都会运行的评分机制 | GEMBA 评分、BERTScore、术语表合规性 |

术语表、规则集和品牌语调都归属于你的组织，引擎则通过附加来应用它们。一个术语表可以同时管理五个引擎，一次编辑即可同步到全部五个引擎。正式上线前，你可以先在 [Playground](https://lingo.dev/en/docs/platform/playground) 中测试变更：将引擎与原始模型对比，或并排比较两个引擎。所有引擎都在平台上完成配置，本地化团队也在这里运行整套本地化基础设施。

## 从代码中调用你的引擎

翻译代码仓库中的内容。`lingo push` 会将文件发送到 `.lingo/config.json` 中指定的引擎，`lingo pull` 则可在任意机器上将翻译结果写回：

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

或者直接通过 ID 调用某个引擎：

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | 你的编码代理可以在问题出现的那段对话里直接创建引擎、添加术语、调整规则，并比较两个引擎 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | 可在终端或 CI 中推送源文件、拉取翻译。支持 18 种格式：JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、Android 和 Xcode strings、SubRip、PHP |
| [CI/CD 中的 Lingo.dev](https://lingo.dev/en/docs/workflows) | 安装 CLI，并将 `lingo push` 作为一个步骤运行在 GitHub Actions、GitLab CI/CD、Bitbucket Pipelines 或任何支持 Node.js 22+ 的运行器中 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 一次安装后，每次向默认分支推送都会创建或更新翻译拉取请求；或者把翻译作为一次提交直接写入修改了源内容的拉取请求。无需运行器，无需 API 密钥密文，也无需管理 Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | 可按语言对发起同步调用，也可通过一个异步任务将单次请求分发到多个语言区域，并在结果就绪后陆续返回 |

[构建你的第一个本地化引擎 →](https://lingo.dev)
