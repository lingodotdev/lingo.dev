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
    Lingo.dev 是本地化工程平台:衡量翻译质量、使用 LLM
    进行翻译以及与母语人士校对的最佳方式。
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">文档</a> •
  <a href="https://lingo.dev">平台</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 月度开发工具排名第一"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="许可证"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="最后提交"
    />
  </a>
</p>

---

## 团队在 Lingo.dev 上构建本地化引擎

[本地化引擎](https://lingo.dev/en/docs/platform/engines)是一个有状态的翻译 API,由您的团队配置并由 Lingo.dev 运行。为每个产品、每种内容类型或每个品牌构建一个引擎。通过引擎的每个请求都会按固定的优先级顺序应用您配置的所有内容:

| 层级                                                         | 您配置的内容                                        | 来自文档                                    |
| ------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------- |
| [LLM 模型](https://lingo.dev/en/docs/platform/llm-models)    | 每个语言对使用哪个模型处理,并设置备选排序           | 400+ 个模型;响应中会标明运行的模型          |
| [品牌语调](https://lingo.dev/en/docs/platform/brand-voices)  | 您的产品在每种语言中的表达方式,每个区域设置一段文本 | 各市场的语气和正式程度                      |
| [规则](https://lingo.dev/en/docs/platform/rules)             | 通用模型遗漏的语言规范                              | 西班牙语中的形容词位置、百分号前的空格      |
| [术语表](https://lingo.dev/en/docs/platform/glossaries)      | 每个区域设置的精确术语映射,按含义匹配               | "911" 在欧洲市场变为 "112";产品名称保持不变 |
| [AI 审核员](https://lingo.dev/en/docs/platform/ai-reviewers) | 每次翻译后运行的评分                                | GEMBA 评分、BERTScore、术语表合规性         |

术语表、规则集和品牌语调属于您的组织,引擎通过附加方式应用它们。一个术语表管理五个引擎,一次编辑可覆盖全部五个引擎。在[演练场](https://lingo.dev/en/docs/platform/playground)中测试更改后再上线:将引擎与原始模型进行比较,或并排比较两个引擎。引擎在平台上配置,本地化团队在平台上运行本地化基础设施。

## 从代码访问你的引擎

翻译仓库中的内容。`lingo push` 将文件发送到 `.lingo/config.json` 中指定的引擎，`lingo pull` 从任何机器写回翻译：

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

或通过 ID 直接调用引擎：

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                         |                                                                                                                                           |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                          | 你的编码助手可在问题出现的对话中创建引擎、添加术语表条目、调整规则并比较两个引擎                                                          |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                          | 从终端或 CI 推送源文件、拉取翻译。支持 18 种格式：JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、Android 和 Xcode 字符串、SubRip、PHP |
| [Lingo.dev 在 CI/CD 中使用](https://lingo.dev/en/docs/workflows)        | 安装 CLI 并在 GitHub Actions、GitLab CI/CD、Bitbucket Pipelines 或任何支持 Node.js 22+ 的运行器中将 `lingo push` 作为步骤运行             |
| [Lingo.dev GitHub 应用](https://lingo.dev/en/docs/workflows/github-app) | 一次性安装，每次推送到默认分支都会打开或更新翻译拉取请求。无需运行器、无需 API 密钥密文、无需管理锁文件                                   |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                          | 每个语言对一次同步调用，或使用异步任务将一个请求分发到多个语言区域，并在结果产生时交付                                                    |

[构建你的第一个本地化引擎 →](https://lingo.dev)
