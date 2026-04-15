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
    オープンソースのローカライゼーションエンジニアリングツール。Lingo.devローカライゼーションエンジニアリングプラットフォームに接続して、一貫性のある高品質な翻訳を実現します。
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (アーリーアルファ版)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="リリース"
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
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 今月の開発ツール第1位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 今週のプロダクト第1位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 本日のプロダクト第2位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="GitHubトレンド"
    />
  </a>
</p>

---

## クイックスタート

| ツール                                             | 機能                                                | クイックコマンド                   |
| -------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | ReactアプリのAI支援i18nセットアップ                 | プロンプト: `Set up i18n`          |
| [**Lingo CLI**](#lingodev-cli)                     | JSON、YAML、Markdown、CSV、POファイルをローカライズ | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actionsでの継続的ローカライゼーション        | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18nラッパー不要のビルド時Reactローカライゼーション | `withLingo()`プラグイン            |

### ローカライゼーションエンジン

これらのツールは[ローカライゼーションエンジン](https://lingo.dev)に接続します。ローカライゼーションエンジンとは、Lingo.devローカライゼーションエンジニアリングプラットフォーム上で作成するステートフルな翻訳APIです。各エンジンは用語集、ブランドボイス、ロケール別の指示を全リクエスト間で保持し、[用語エラーを16.6～44.6%削減](https://lingo.dev/research/retrieval-augmented-localization)します。または[独自のLLMを使用](#lingodev-cli)することも可能です。

---

### Lingo.dev MCP

ReactアプリでのI18nセットアップはエラーが発生しやすく、AIコーディングアシスタントでさえ存在しないAPIを幻覚したり、ルーティングを壊したりします。Lingo.dev MCPは、Next.js、React Router、TanStack Start向けのフレームワーク固有のi18n知識への構造化されたアクセスをAIアシスタントに提供します。Claude Code、Cursor、GitHub Copilot Agents、Codexに対応しています。

[ドキュメントを読む →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

JSON、YAML、Markdown、CSV、POファイルを1つのコマンドでローカライズ。ロックファイルがすでにローカライズされた内容を追跡し、新規または変更されたコンテンツのみが処理されます。デフォルトではLingo.dev上のローカライゼーションエンジンを使用しますが、独自のLLM(OpenAI、Anthropic、Google、Mistral、OpenRouter、Ollama)も利用可能です。

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ドキュメントを読む →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

パイプラインでの継続的ローカライゼーション。プッシュのたびにローカライゼーションが実行され、コードが本番環境に到達する前に不足している文字列が補完されます。GitHub Actions、GitLab CI/CD、Bitbucket Pipelinesに対応。

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ドキュメントを読む →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

バックエンドコードから直接ローカライゼーションエンジンを呼び出せます。Webhook配信による同期・非同期ローカライゼーション、ロケールごとの障害分離、WebSocketによるリアルタイム進行状況確認に対応。

[ドキュメントを読む →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler for React（アーリーアルファ版）

i18nラッパーを使わないビルド時Reactローカライゼーション。プレーンな英語テキストでコンポーネントを記述すると、コンパイラが翻訳可能な文字列を検出し、ビルド時にローカライズされたバリアントを生成します。翻訳キー不要、JSONファイル不要、`t()`関数不要。Next.js（App Router）およびVite + Reactに対応。

[ドキュメントを読む →](https://lingo.dev/en/docs/react/compiler)

---

## コントリビューション

コントリビューションを歓迎します。以下のガイドラインに従ってください：

1. **Issue:** [バグ報告や機能リクエスト](https://github.com/lingodotdev/lingo.dev/issues)
2. **プルリクエスト:** [変更を送信](https://github.com/lingodotdev/lingo.dev/pulls)
   - すべてのPRにはチェンジセットが必要です：`pnpm new`（リリース対象外の変更の場合は`pnpm new:empty`）
   - 送信前にテストが通ることを確認してください
3. **開発:** これはpnpm + turborepoモノレポです
   - 依存関係のインストール：`pnpm install`
   - テストの実行：`pnpm test`
   - ビルド：`pnpm build`

**サポート:** [Discordコミュニティ](https://lingo.dev/go/discord)

## スター履歴

Lingo.devが役に立つと思ったら、スターをつけて10,000スター達成にご協力ください！

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ローカライズされたドキュメント

**利用可能な翻訳:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**新しい言語を追加する:**

1. [BCP-47形式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)を使用して[`i18n.json`](./i18n.json)にロケールコードを追加
2. プルリクエストを送信
