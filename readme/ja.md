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
    オープンソースのAI搭載i18nツールキットで、LLMによる即座のローカライゼーションを実現
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
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## Compilerのご紹介 🆕

**Lingo.dev Compiler**は、無料のオープンソースコンパイラミドルウェアで、既存のReactコンポーネントに変更を加えることなく、ビルド時にあらゆるReactアプリを多言語対応にすることができます。

一度インストール:

```bash
npm install @lingo.dev/compiler
```

ビルド設定で有効化:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

`next build`を実行すると、スペイン語とフランス語のバンドルが生成されます✨

[ドキュメントを読む →](https://lingo.dev/compiler)で完全なガイドを確認し、[Discordに参加](https://lingo.dev/go/discord)してセットアップのサポートを受けましょう。

---

### このリポジトリには何が含まれていますか?

| ツール       | 概要                                                                                | ドキュメント                            |
| ------------ | ----------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | ビルド時のReactローカライゼーション                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Webおよびモバイルアプリ、JSON、YAML、markdownなどのワンコマンドローカライゼーション | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | プッシュごとに翻訳を自動コミット + 必要に応じてプルリクエストを作成                 | [/ci](https://lingo.dev/ci)             |
| **SDK**      | ユーザー生成コンテンツのリアルタイム翻訳                                            | [/sdk](https://lingo.dev/sdk)           |

以下は各機能の概要です 👇

---

### ⚡️ Lingo.dev CLI

ターミナルから直接コードとコンテンツを翻訳できます。

```bash
npx lingo.dev@latest run
```

すべての文字列をフィンガープリント化し、結果をキャッシュし、変更された部分のみを再翻訳します。

セットアップ方法については[ドキュメントを参照 →](https://lingo.dev/cli)してください。

---

### 🔄 Lingo.dev CI/CD

完璧な翻訳を自動的にデプロイできます。

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

手動作業なしで、リポジトリを正常に保ち、製品を多言語対応にします。

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

私たちはコミュニティ主導で、貢献を歓迎しています！

- アイデアがありますか？[issueを開く](https://github.com/lingodotdev/lingo.dev/issues)
- 何か修正したいですか？[PRを送る](https://github.com/lingodotdev/lingo.dev/pulls)
- サポートが必要ですか？[Discordに参加](https://lingo.dev/go/discord)

## ⭐ スター履歴

私たちの取り組みが気に入ったら、⭐をつけて6,000スター達成にご協力ください！🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 他の言語のReadme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

お使いの言語が見つかりませんか？[`i18n.json`](./i18n.json)に追加してPRを開いてください！

**ロケール形式:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)コードを使用してください: `language[-Script][-REGION]`

- 言語: ISO 639-1/2/3 小文字 (`en`、`zh`、`bho`)
- 文字体系: ISO 15924 タイトルケース (`Hans`、`Hant`、`Latn`)
- 地域: ISO 3166-1 alpha-2 大文字 (`US`、`CN`、`IN`)
- 例: `en`、`pt-BR`、`zh-Hans`、`sr-Cyrl-RS`
