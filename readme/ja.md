<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev -
    LLMによる即時ローカライゼーションのためのオープンソース、AI駆動のi18nツールキット
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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
      alt="Product Hunt 月間デブツール第1位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 週間プロダクト第1位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt デイリープロダクト第2位"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Githubトレンド"
    />
  </a>
</p>

---

## コンパイラの紹介 🆕

**Lingo.dev コンパイラ**は、既存のReactコンポーネントに変更を加えることなく、ビルド時に任意のReactアプリを多言語対応にするために設計された、無料のオープンソースコンパイラミドルウェアです。

一度インストールするだけ：

```bash
npm install lingo.dev
```

ビルド設定で有効化：

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` を実行すると、スペイン語とフランス語のバンドルが自動的に生成されます ✨

完全なガイドは[ドキュメントを読む →](https://lingo.dev/compiler)をご覧ください。セットアップのサポートが必要な場合は[Discordに参加](https://lingo.dev/go/discord)してください。

---

### このリポジトリには何が含まれていますか？

| ツール         | 要約                                                                                   | ドキュメント                            |
| -------------- | -------------------------------------------------------------------------------------- | --------------------------------------- |
| **コンパイラ** | ビルド時のReactローカライゼーション                                                    | [/compiler](https://lingo.dev/compiler) |
| **CLI**        | ウェブやモバイルアプリ、JSON、YAML、マークダウンなどのワンコマンドローカライゼーション | [/cli](https://lingo.dev/cli)           |
| **CI/CD**      | プッシュごとに翻訳を自動コミット + 必要に応じてプルリクエストを作成                    | [/ci](https://lingo.dev/ci)             |
| **SDK**        | ユーザー生成コンテンツのリアルタイム翻訳                                               | [/sdk](https://lingo.dev/sdk)           |

各ツールの要点は以下の通りです 👇

---

### ⚡️ Lingo.dev CLI

ターミナルから直接コードとコンテンツを翻訳します。

```bash
npx lingo.dev@latest run
```

すべての文字列に指紋を付け、結果をキャッシュし、変更された部分のみを再翻訳します。

[ドキュメントを確認 →](https://lingo.dev/cli) でセットアップ方法を学びましょう。

---

### 🔄 Lingo.dev CI/CD

完璧な翻訳を自動的に提供します。

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

手動の手順なしで、リポジトリを正常に保ち、製品を多言語対応にします。

[ドキュメントを読む →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

動的コンテンツのリクエストごとの即時翻訳。

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

チャット、ユーザーコメント、その他のリアルタイムフローに最適です。

[ドキュメントを読む →](https://lingo.dev/sdk)

---

## 🤝 コミュニティ

私たちはコミュニティ主導であり、貢献を歓迎します！

- アイデアがありますか？ [イシューを開く](https://github.com/lingodotdev/lingo.dev/issues)
- 何かを修正したいですか？ [PRを送信](https://github.com/lingodotdev/lingo.dev/pulls)
- サポートが必要ですか？ [Discordに参加](https://lingo.dev/go/discord)

## ⭐ スター履歴

私たちの取り組みが気に入ったら、⭐をつけて5,000スター達成を手伝ってください！ 🌟

[

![スター履歴チャート](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 他言語のREADME

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Bhojpuri](/readme/bho.md)

あなたの言語が見つかりませんか？[`i18n.json`](./i18n.json)に追加してPRを開いてください！
