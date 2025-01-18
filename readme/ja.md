<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CI/CDから直接利用できる最先端のAIローカライゼーション for Web & モバイル</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">ウェブサイト</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">コントリビュート</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="リリース" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="ライセンス" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="最終コミット" />
  </a>
</p>

<br />

Replexica AIはソフトウェアのローカライゼーションを完全に自動化します。

瞬時に自然な翻訳を生成し、手作業や管理の手間を排除します。Replexicaのローカライゼーションエンジンは製品のコンテキストを理解し、60以上の言語でネイティブスピーカーが期待する完璧な翻訳を作成します。その結果、チームは最先端の品質を保ちながら、ローカライゼーションを100倍速く実行し、世界中のより多くの有料顧客に向けて機能をリリースすることができます。

## 💫 クイックスタート

1. [ウェブサイト](https://replexica.com)でアカウントを作成

2. プロジェクトの初期化:

   ```bash
   npx replexica@latest init
   ```

3. ドキュメントを確認: [docs.replexica.com](https://docs.replexica.com)

4. アプリのローカライズ（数秒で完了）:
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

Replexicaは、CI/CDパイプラインでローカライゼーションを自動化するGitHub Actionを提供しています。基本的なセットアップは以下の通りです：

```yaml
- uses: replexica/replexica@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```

このアクションは、プッシュごとに`replexica i18n`を実行し、翻訳を自動的に最新の状態に保ちます。

プルリクエストモードやその他の設定オプションについては、[GitHub Actionのドキュメント](https://docs.replexica.com/setup/gha)をご覧ください。

## 🥇 チームがReplexicaを選ぶ理由

- 🔥 **即時導入**: 数分でセットアップ完了
- 🔄 **CI/CD自動化**: シームレスな開発パイプライン統合
- 🌍 **60以上の言語**: グローバル展開を簡単に
- 🧠 **AIローカライゼーションエンジン**: 製品に最適化された翻訳
- 📊 **柔軟なフォーマット**: JSON、YAML、CSV、Markdown他に対応

## 🛠️ パワフルな機能

- ⚡️ **超高速**: 数秒でAIローカライゼーション
- 🔄 **自動更新**: 最新コンテンツと同期
- 🌟 **ネイティブ品質**: 自然な翻訳
- 👨‍💻 **開発者フレンドリー**: ワークフローに統合できるCLI
- 📈 **スケーラブル**: 成長中のスタートアップから大企業まで対応

## 📚 ドキュメント

詳細なガイドとAPIリファレンスは[ドキュメント](https://replexica.com/go/docs)をご覧ください。

## 🤝 コントリビュート

顧客でなくてもコントリビュートに興味がありますか？

[Good First Issues](https://github.com/replexica/replexica/labels/good%20first%20issue)をチェックして、[コントリビューションガイド](./CONTRIBUTING.md)をお読みください。

## 🧠 チーム

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**

質問やお問い合わせは veronica@replexica.com まで

## 🌐 他言語のREADME

- [English](https://github.com/replexica/replexica)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)

お使いの言語が見つかりませんか？[`i18n.json`](./i18n.json)ファイルに新しい言語コードを追加してPRを開いてください。
