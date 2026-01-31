<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev -
    LLMベースのローカライゼーションのためのオープンソースi18nツールキット
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

| ツール                             | ユースケース                                        | クイックコマンド                   |
| ---------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | ReactアプリのAI支援i18nセットアップ                 | プロンプト: `Set up i18n`          |
| [**CLI**](#lingodev-cli)           | JSON、YAML、Markdown、CSV、POファイルの翻訳         | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actionsでの自動翻訳パイプライン              | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | 動的コンテンツのランタイム翻訳                      | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18nラッパーなしのビルド時Reactローカライゼーション | `withLingo()`プラグイン            |

---

### Lingo.dev MCP

AIコーディングアシスタントが自然言語プロンプトを通じてReactアプリケーションにi18nインフラストラクチャをセットアップできるようにするModel Context Protocolサーバー。

**対応IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**対応フレームワーク:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**使用方法:**

IDE で MCP サーバーを設定した後（[クイックスタートガイドを参照](https://lingo.dev/en/mcp)）、アシスタントに次のようにプロンプトします:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

アシスタントは以下を実行します:

1. ロケールベースのルーティングを設定（例: `/en`、`/es`、`/pt-BR`）
2. 言語切り替えコンポーネントをセットアップ
3. 自動ロケール検出を実装
4. 必要な設定ファイルを生成

**注意:** AI アシストによるコード生成は非決定的です。コミット前に生成されたコードを確認してください。

[ドキュメントを読む →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

AI を使用してアプリとコンテンツを翻訳するためのオープンソース CLI。JSON、YAML、CSV、PO ファイル、markdown など、業界標準のすべてのフォーマットをサポートしています。

**セットアップ:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**仕組み:**

1. 設定されたファイルから翻訳可能なコンテンツを抽出
2. 翻訳のためにコンテンツを LLM プロバイダーに送信
3. 翻訳されたコンテンツをファイルシステムに書き戻し
4. 完了した翻訳を追跡するために `i18n.lock` ファイルを作成（冗長な処理を回避）

**設定:**

`init` コマンドは `i18n.json` ファイルを生成します。ロケールとバケットを設定します:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

`provider` フィールドはオプションです（デフォルトは Lingo.dev Engine）。カスタム LLM プロバイダーの場合:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**サポートされている LLM プロバイダー:**

- Lingo.dev Engine（推奨）
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ドキュメントを読む →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD パイプライン用の自動翻訳ワークフロー。不完全な翻訳が本番環境に到達するのを防ぎます。

**対応プラットフォーム:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actionsのセットアップ:**

`.github/workflows/translate.yml`を作成:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**セットアップ要件:**

1. `LINGODOTDEV_API_KEY`をリポジトリシークレットに追加(Settings > Secrets and variables > Actions)
2. PRワークフローの場合:Settings > Actions > Generalで「Allow GitHub Actions to create and approve pull requests」を有効化

**ワークフローオプション:**

翻訳を直接コミット:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

翻訳付きのプルリクエストを作成:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**利用可能な入力:**

| 入力                 | デフォルト                                     | 説明                         |
| -------------------- | ---------------------------------------------- | ---------------------------- |
| `api-key`            | (必須)                                         | Lingo.dev APIキー            |
| `pull-request`       | `false`                                        | 直接コミットではなくPRを作成 |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | カスタムコミットメッセージ   |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | カスタムPRタイトル           |
| `working-directory`  | `"."`                                          | 実行するディレクトリ         |
| `parallel`           | `false`                                        | 並列処理を有効化             |

[ドキュメントを読む →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

動的コンテンツ用のランタイム翻訳ライブラリ。JavaScript、PHP、Python、Rubyに対応。

**インストール:**

```bash
npm install lingo.dev
```

**使用方法:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**利用可能なSDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Webアプリ、Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP、Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django、Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ドキュメントを読む →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

ビルド時翻訳システムで、コンポーネントを変更せずにReactアプリを多言語化します。ランタイムではなくビルド時に動作します。

**インストール:**

```bash
pnpm install @lingo.dev/compiler
```

**認証:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**設定 (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**設定 (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**プロバイダーのセットアップ:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**言語切り替え:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**開発:** `npm run dev` (疑似翻訳を使用、API呼び出しなし)

**本番:** `usePseudotranslator: false`を設定し、`next build`を実行

`.lingo/`ディレクトリをバージョン管理にコミットします。

**主な機能:**

- ランタイムパフォーマンスコストゼロ
- 翻訳キーやJSONファイル不要
- `t()`関数や`<T>`ラッパーコンポーネント不要
- JSX内の翻訳可能テキストの自動検出
- TypeScriptサポート
- 複数形対応のICU MessageFormat
- `data-lingo-override`属性による手動オーバーライド
- 組み込み翻訳エディターウィジェット

**ビルドモード:**

- `pseudotranslator`: プレースホルダー翻訳を使用する開発モード (APIコストなし)
- `real`: LLMを使用して実際の翻訳を生成
- `cache-only`: CIで事前生成された翻訳を使用する本番モード (API呼び出しなし)

**サポートされているフレームワーク:**

- Next.js (React Server ComponentsのApp Router)
- Vite + React (SPAおよびSSR)

追加のフレームワークサポートを予定しています。

[ドキュメントを読む →](https://lingo.dev/en/compiler)

---

## コントリビューション

コントリビューションを歓迎します。以下のガイドラインに従ってください:

1. **Issue:** [バグ報告や機能リクエスト](https://github.com/lingodotdev/lingo.dev/issues)
2. **プルリクエスト:** [変更を送信](https://github.com/lingodotdev/lingo.dev/pulls)
   - すべてのPRにはchangesetが必要です: `pnpm new` (リリース対象外の変更の場合は `pnpm new:empty`)
   - 送信前にテストが通過することを確認してください
3. **開発:** これはpnpm + turborepoのモノレポです
   - 依存関係のインストール: `pnpm install`
   - テストの実行: `pnpm test`
   - ビルド: `pnpm build`

**サポート:** [Discordコミュニティ](https://lingo.dev/go/discord)

## スター履歴

Lingo.devが役に立つと思ったら、スターを付けて10,000スター達成にご協力ください!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ローカライズされたドキュメント

**利用可能な翻訳:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**新しい言語の追加:**

1. [`i18n.json`](./i18n.json)に[BCP-47形式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)でロケールコードを追加
2. プルリクエストを送信

**BCP-47ロケール形式:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (小文字): `en`、`zh`、`bho`
- `Script`: ISO 15924 (タイトルケース): `Hans`、`Hant`、`Latn`
- `REGION`: ISO 3166-1 alpha-2 (大文字): `US`、`CN`、`IN`
- 例: `en`、`pt-BR`、`zh-Hans`、`sr-Cyrl-RS`
