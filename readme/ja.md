<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev ― ローカライゼーションエンジニアリングプラットフォーム" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev はローカライゼーションエンジニアリングプラットフォームです。翻訳品質の測定、LLM を使った翻訳、ネイティブスピーカーによる校正を、これ以上ない形で実現します。</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ドキュメント</a> •
  <a href="https://lingo.dev">プラットフォーム</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt 今月の開発ツール第１位" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="ライセンス" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="最終コミット" /></a>
</p>

---

## チームは Lingo.dev 上でローカライゼーションエンジンを構築します

[ローカライゼーションエンジン](https://lingo.dev/en/docs/platform/engines)とは、チームが設定し、Lingo.dev が実行する、状態を持つ翻訳 API です。製品ごと、コンテンツタイプごと、ブランドごとに構築できます。エンジンを経由するすべてのリクエストには、そのエンジンに設定した内容が、固定された優先順位に従って適用されます。

| レイヤー | 設定する内容 | ドキュメントより |
| --- | --- | --- |
| [LLM モデル](https://lingo.dev/en/docs/platform/llm-models) | 各言語ペアをどのモデルで処理するか。優先順位付きのフォールバックも設定できます | 四百以上のモデルに対応。応答には実際に使われたモデル名が含まれます |
| [ブランドボイス](https://lingo.dev/en/docs/platform/brand-voices) | 各言語で製品がどう語るかを、ロケールごとに一つのテキストで定義します | 市場ごとのトーンと丁寧さ |
| [ルール](https://lingo.dev/en/docs/platform/rules) | 汎用モデルでは見落としやすい言語上の慣習 | スペイン語での形容詞の位置、百分率記号の前の空白 |
| [用語集](https://lingo.dev/en/docs/platform/glossaries) | 意味に基づいて照合される、ロケールごとの正確な用語対応 | 欧州市場では「九一一」を「一一二」に置き換え、製品名はそのまま保持します |
| [AI評価者](https://lingo.dev/en/docs/platform/ai-reviewers) | 各翻訳のあとに実行されるスコアリング | GEMBA スコア、BERTScore、用語集準拠 |

用語集、ルールセット、ブランドボイスは組織に属し、エンジンは関連付けによってそれらを適用します。一つの用語集で五つのエンジンを管理でき、ひとたび編集すれば五つすべてに反映されます。本番公開前に [Playground](https://lingo.dev/en/docs/platform/playground) で変更を試せます。エンジンと生のモデルを比較したり、二つのエンジンを並べて比べたりできます。エンジンはプラットフォーム上で設定し、ローカライゼーションチームはそこでローカライゼーションインフラストラクチャを運用します。

## コードからエンジンを利用する

リポジトリ内のコンテンツを翻訳できます。`lingo push` は `.lingo/config.json` に指定されたエンジンへファイルを送信し、`lingo pull` はどのマシンからでも翻訳を書き戻します。

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

あるいは、識別子を指定してエンジンを直接呼び出すこともできます。

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | 問題が見つかったその会話の流れのまま、コーディングエージェントがエンジンを作成し、用語集の項目を追加し、ルールを調整し、二つのエンジンを比較します |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ソースファイルを送信し、翻訳を取得します。端末からでも CI からでも実行できます。対応形式は十八種類。JSON、YAML、Markdown、MDX、PO、XLIFF、Flutter ARB、Android と Xcode の文字列、SubRip、PHP に対応しています |
| [Lingo.dev を CI/CD で使う](https://lingo.dev/en/docs/workflows) | CLI をインストールし、GitHub Actions、GitLab CI/CD、Bitbucket Pipelines、または Node.js 二十二以上が動く任意のランナーで、ステップとして `lingo push` を実行します |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 一度インストールすれば、既定ブランチへのすべてのプッシュで翻訳用のプルリクエストが作成または更新されます。あるいは、ソースを変更したプルリクエストに翻訳がコミットとして反映されます。ランナー不要、API キーのシークレット不要、管理する Lockfile も不要です |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | 言語ペアごとに一回の同期呼び出し、または一つのリクエストを多数のロケールに展開し、結果が届きしだい返す非同期ジョブを利用できます |

[最初のローカライゼーションエンジンを構築する →](https://lingo.dev)
