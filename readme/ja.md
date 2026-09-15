<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – ローカライゼーションエンジニアリングプラットフォーム"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.devは、ローカリゼーションエンジニアリングプラットフォームです。翻訳品質の測定、LLMによる翻訳、ネイティブスピーカーによる校正を最適な方法で実現します。
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ドキュメント</a> •
  <a href="https://lingo.dev">プラットフォーム</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 今月の開発ツール第1位"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="ライセンス"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="最終コミット"
    />
  </a>
</p>

---

## チームはLingo.dev上でローカリゼーションエンジンを構築する

[ローカリゼーションエンジン](https://lingo.dev/en/docs/platform/engines)は、チームが設定しLingo.devが実行するステートフルな翻訳APIです。製品ごと、コンテンツタイプごと、ブランドごとに1つ構築します。エンジンを通じたすべてのリクエストは、設定したすべての項目を固定された優先順位で適用します。

| レイヤー                                                          | 設定内容                                                   | ドキュメントより                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| [LLMモデル](https://lingo.dev/en/docs/platform/llm-models)        | 各言語ペアを処理するモデルとランク付けされたフォールバック | 400以上のモデル、レスポンスには実行されたモデル名が含まれる |
| [ブランドボイス](https://lingo.dev/en/docs/platform/brand-voices) | 各言語における製品の語り口、ロケールごとに1つのテキスト    | 市場ごとのトーンとフォーマリティ                            |
| [ルール](https://lingo.dev/en/docs/platform/rules)                | 汎用モデルが見落とす言語規則                               | スペイン語の形容詞位置、パーセント記号の前のスペース        |
| [用語集](https://lingo.dev/en/docs/platform/glossaries)           | ロケールごとの正確な用語マッピング、意味で照合             | 「911」は欧州市場では「112」に、製品名はそのまま通す        |
| [AIレビュアー](https://lingo.dev/en/docs/platform/ai-reviewers)   | すべての翻訳後に実行されるスコアリング                     | GEMBAスコア、BERTScore、用語集コンプライアンス              |

用語集、ルールセット、ブランドボイスは組織に属し、エンジンはそれらをアタッチメントによって適用します。1つの用語集が5つのエンジンを管理し、1回の編集で5つすべてに反映されます。本番環境に反映する前に、[プレイグラウンド](https://lingo.dev/en/docs/platform/playground)で変更をテストできます。エンジンを生のモデルと比較したり、2つのエンジンを並べて比較したりできます。エンジンはプラットフォーム上で設定され、ローカリゼーションチームがローカリゼーションインフラを運用します。

## コードからエンジンにアクセスする

リポジトリ内のコンテンツを翻訳します。`lingo push`は、`.lingo/config.json`で指定されたエンジンにファイルを送信し、`lingo pull`は任意のマシンから翻訳を書き戻します：

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

または、IDを指定してエンジンを直接呼び出します：

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

|                                                                        |                                                                                                                                                                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | コーディングエージェントが、問題が発生した会話の中で、エンジンの作成、用語集の追加、ルールの調整、2つのエンジンの比較を実行します                                                |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | ターミナルまたはCIからソースファイルをプッシュし、翻訳をプルします。18種類の形式に対応：JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、AndroidおよびXcode文字列、SubRip、PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLIをインストールし、GitHub Actions、GitLab CI/CD、Bitbucket Pipelines、またはNode.js 22以降を搭載した任意のランナーで`lingo push`をステップとして実行します                     |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 一度インストールすれば、デフォルトブランチへのプッシュごとに翻訳プルリクエストが作成または更新されます。ランナー、APIキーシークレット、管理すべきロックファイルは不要です        |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | 言語ペアごとに1つの同期呼び出し、または1つのリクエストを複数のロケールに展開し、結果が得られ次第配信する非同期ジョブ                                                             |

[最初のローカライゼーションエンジンを構築する →](https://lingo.dev)
