<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – 本地化工程平台" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev 是本地化工程平台：衡量翻译质量、用 LLM 翻译，并由母语者润色校对的最佳方式。</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">文档</a> •
  <a href="https://lingo.dev">平台</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt 月度第 1 开发工具" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="许可证" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="最近一次提交" /></a>
</p>

---

## 团队都在 Lingo.dev 上构建本地化引擎

[本地化引擎](https://lingo.dev/en/docs/platform/engines)是由你的团队配置、由 Lingo.dev 运行的有状态翻译 API。你可以按产品、内容类型或品牌分别构建引擎。所有经过引擎的请求，都会按固定优先级顺序应用你在其中配置的全部内容：

| 层级 | 你配置的内容 | 文档中的说明 |
| --- | --- | --- |
| [LLM 模型](https://lingo.dev/en/docs/platform/llm-models) | 为每个语言对指定处理模型，并设置按优先级排序的回退选项 | 支持 400+ 模型；响应中会标明实际运行的模型 |
| [品牌语调](https://lingo.dev/en/docs/platform/brand-voices) | 定义产品在每种语言中的表达方式，每个语言区域对应一份文本 | 按不同市场设置语气和正式程度 |
| [规则](https://lingo.dev/en/docs/platform/rules) | 补足通用模型容易忽略的语言规范 | 例如西班牙语中的形容词位置，或百分号前需要留空格 |
| [术语表](https://lingo.dev/en/docs/platform/glossaries) | 按语言区域设置精确术语映射，并基于语义进行匹配 | 面向欧洲市场时，“911” 会变成 “112”；产品名称则保持不变 |
| [AI 评估器](https://lingo.dev/en/docs/platform/ai-reviewers) | 每次翻译完成后都会运行的评分机制 | GEMBA 评分、BERTScore、术语表合规性 |

术语表、规则集和品牌语调都归属于你的组织，引擎通过附加来应用它们。一个术语表可以管理五个引擎，一次修改即可同步到全部五个引擎。正式上线前，先在 [Playground](https://lingo.dev/en/docs/platform/playground) 中测试改动：把引擎和原始模型对比，或将两个引擎并排比较。所有引擎都在平台中完成配置，本地化团队也在这里运行整套本地化基础设施。

## 在代码中调用你的引擎

直接翻译代码仓库中的内容。`lingo push` 会把文件发送到 `.lingo/config.json` 中指定的引擎，`lingo pull` 则可在任意机器上将翻译写回：

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

也可以直接调用某个引擎，并通过 ID 指定它：

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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | 你的编码代理可以在问题出现的对话里直接创建引擎、添加术语表条目、调整规则，并比较两个引擎 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | 可在终端或 CI 中推送源文件、拉取翻译。支持 18 种格式：JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、Android 和 Xcode strings、SubRip、PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | 安装 CLI 后，即可在 GitHub Actions、GitLab CI/CD、Bitbucket Pipelines，或任何支持 Node.js 22+ 的运行器中，把 `lingo push` 作为一个步骤运行 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 只需安装一次，每次推送到默认分支时，都会自动创建或更新翻译拉取请求；或者将翻译作为一次提交，直接写入修改源内容的拉取请求中。无需运行器，无需 API 密钥密文，也无需管理 Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | 每个语言对可发起一次同步调用；也可通过异步任务将一次请求分发到多个语言区域，并在结果就绪后陆续返回 |

[构建你的第一个本地化引擎 →](https://lingo.dev)
