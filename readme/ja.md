<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ウェブ＆モバイルローカリゼーション向けAI搭載オープンソースCLI。</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">ドキュメント</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">貢献する</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">リポジトリにスターを付ける</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="リリース" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="ライセンス" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="最終コミット" />
  </a>
</p>

<br />

Lingo.devは、AI搭載のウェブおよびモバイルアプリのローカリゼーション向けコミュニティ主導のオープンソースCLIです。

Lingo.devは、手作業や管理の手間を省き、本物の翻訳を即座に生成するように設計されています。その結果、チームは100倍速く正確なローカリゼーションを行い、世界中のより多くの満足ユーザーに機能を提供できます。あなた自身のLLMまたはLingo.dev管理のローカリゼーションエンジンと共に使用できます。

> **あまり知られていない事実：** Lingo.devは2023年の学生ハッカソンで小さなプロジェクトとして始まりました！多くの改良を経て、2024年にY Combinatorに採用され、現在は採用中です！次世代のローカリゼーションツールの構築に興味がありますか？履歴書をcareers@lingo.devに送ってください！🚀

## 📑 このガイドの内容

- [クイックスタート](#-quickstart) - 数分で始める
- [キャッシング](#-caching-with-i18nlock) - 翻訳更新の最適化
- [GitHub Action](#-github-action) - CI/CDでローカリゼーションを自動化
- [機能](#-supercharged-features) - Lingo.devが強力な理由
- [ドキュメント](#-documentation) - 詳細なガイドとリファレンス
- [貢献](#-contribute) - コミュニティに参加する

## 💫 クイックスタート

Lingo.dev CLIは、あなた自身のLLMとLingo.dev管理の最新のSOTA（最先端）LLM上に構築されたローカリゼーションエンジンの両方で動作するように設計されています。

### 自分のLLMを使用する（BYOKまたはBring Your Own Key）

1. `i18n.json`設定ファイルを作成します：

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. 環境変数としてAPIキーを設定します：

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# または OpenAI の場合

export OPENAI_API_KEY=your_openai_api_key
```

3. ローカライゼーションを実行します：

```bash
npx lingo.dev@latest i18n
```

### Lingo.dev Cloud の使用

本番環境のアプリケーションでは、翻訳メモリ、用語集サポート、ローカライゼーション品質保証などの機能が必要になることがよくあります。また、どのLLMプロバイダーとモデルを使用するかを専門家に決定してもらい、新しいモデルがリリースされたときに自動的に更新することが望ましい場合もあります。Lingo.devはこれらの機能を提供する管理されたローカライゼーションエンジンです：

1. `i18n.json`設定ファイルを作成します（providerノードなし）：

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Lingo.devで認証します：

```bash
npx lingo.dev@latest auth --login
```

3. ローカライゼーションを実行します：

```bash
npx lingo.dev@latest i18n
```

## 📖 ドキュメント

詳細なガイドとAPIリファレンスについては、[ドキュメント](https://lingo.dev/go/docs)をご覧ください。

## 🔒 `i18n.lock`によるキャッシング

Lingo.devは`i18n.lock`ファイルを使用してコンテンツのチェックサムを追跡し、変更されたテキストのみが翻訳されるようにします。これにより以下が向上します：

- ⚡️ **速度**：既に翻訳されたコンテンツをスキップ
- 🔄 **一貫性**：不要な再翻訳を防止
- 💰 **コスト**：繰り返しの翻訳に対する課金なし

## 🤖 GitHub Action

Lingo.devはCI/CDパイプラインでローカライゼーションを自動化するGitHub Actionを提供しています。基本的なセットアップは次のとおりです：

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

このアクションは、プッシュごとに`lingo.dev i18n`を実行し、翻訳を自動的に最新の状態に保ちます。

プルリクエストモードやその他の設定オプションについては、[GitHub Actionドキュメント](https://docs.lingo.dev/setup/gha)をご覧ください。

## ⚡️ Lingo.devのスーパーパワー

- 🔥 **即時統合**: 数分でコードベースと連携
- 🔄 **CI/CD自動化**: 設定したら忘れてOK
- 🌍 **グローバルリーチ**: 世界中のユーザーに提供
- 🧠 **AI搭載**: 自然な翻訳のための最新言語モデルを使用
- 📊 **フォーマット非依存**: JSON、YAML、CSV、Markdown、Android、iOS、その他多数に対応
- 🔍 **クリーンな差分**: ファイル構造を完全に保持
- ⚡️ **超高速**: 翻訳が数日ではなく数秒で完了
- 🔄 **常に同期**: コンテンツが変更されると自動的に更新
- 🌟 **人間品質**: 機械的に聞こえない翻訳
- 👨‍💻 **開発者が開発者のために構築**: 私たち自身が毎日使用
- 📈 **あなたと共に成長**: サイドプロジェクトから企業規模まで

## 🤝 貢献する

Lingo.devはコミュニティ主導のプロジェクトですので、すべての貢献を歓迎します！

新機能のアイデアがありますか？GitHubのイシューを作成してください！

貢献したいですか？プルリクエストを作成してください！

## 🌐 他言語のREADME

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

あなたの言語が見つかりませんか？[`i18n.json`](./i18n.json)ファイルに新しい言語コードを追加して、PRを開いてください。
