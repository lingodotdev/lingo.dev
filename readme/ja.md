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

## チームでLingo.dev上にローカライゼーションエンジンを構築

[ローカライゼーションエンジン](https://lingo.dev/en/docs/platform/engines)は、チームで設定し、Lingo.devが実行するステートフルな翻訳APIです。製品ごと、コンテンツタイプごと、ブランドごとに構築できます。エンジンを通るすべてのリクエストには、そこで設定した内容が固定の優先順で適用されます。

| レイヤー | 設定する内容 | ドキュメントから |
| --- | --- | --- |
| [LLMモデル](https://lingo.dev/en/docs/platform/llm-models) | 順位付きフォールバックを含め、各言語ペアをどのモデルで処理するか | 四百以上のモデルに対応。レスポンスには実行されたモデル名が表示されます |
| [ブランドボイス](https://lingo.dev/en/docs/platform/brand-voices) | 各言語で製品をどう語るかを、ロケールごとに一つのテキストで定義 | 市場ごとのトーンや丁寧さ |
| [ルール](https://lingo.dev/en/docs/platform/rules) | 汎用モデルでは拾いきれない言語上の慣習 | スペイン語での形容詞の位置や、パーセント記号の前の空白 |
| [用語集](https://lingo.dev/en/docs/platform/glossaries) | 意味に基づいて照合される、ロケールごとの正確な用語対応 | 欧州市場では「911」が「112」になり、製品名はそのまま通します |
| [AI評価者](https://lingo.dev/en/docs/platform/ai-reviewers) | 翻訳のたびに後段で実行されるスコアリング | GEMBAスコア、BERTScore、用語集準拠 |

用語集、ルールセット、ブランドボイスは組織にひもづき、エンジンはそれらをアタッチして適用します。一つの用語集で五つのエンジンを管理でき、一度の編集がその五つすべてに反映されます。本番公開前に[Playground](https://lingo.dev/en/docs/platform/playground)で変更をテストできます。エンジンと素のモデルを比較したり、二つのエンジンを並べて比較したりできます。エンジンはプラットフォーム上で設定され、ローカライゼーションチームはそこでローカライゼーション基盤を運用します。

## コードからエンジンにアクセス

リポジトリ内のコンテンツを翻訳します。`lingo push`は`.lingo/config.json`で指定したエンジンにファイルを送り、`lingo pull`はどのマシンからでも翻訳を書き戻します。

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

あるいは、IDを指定してエンジンを直接呼び出すこともできます。

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | 問題が表面化したその会話の中で、コーディングエージェントがエンジンを作成し、用語を追加し、ルールを調整し、二つのエンジンを比較します |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ソースファイルを送り、翻訳を取得します。端末からでもCIからでも使えます。対応形式は十八種類。JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、AndroidとXcodeの文字列、SubRip、PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLIをインストールし、GitHub Actions、GitLab CI/CD、Bitbucket Pipelines、またはNode.js二十二以上に対応した任意のランナーで、`lingo push`をステップとして実行します |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 一度インストールすれば、既定ブランチへのすべてのプッシュで翻訳用のプルリクエストが作成または更新されます。あるいは、翻訳がソースを変更したプルリクエストにコミットとして反映されます。ランナー不要、APIキーのシークレット不要、管理するLockfileも不要です |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | 言語ペアごとに一回の同期呼び出し、または一つのリクエストを多数のロケールへ展開し、結果が届きしだい返す非同期ジョブを利用できます |

[最初のローカライゼーションエンジンを構築する →](https://lingo.dev)
