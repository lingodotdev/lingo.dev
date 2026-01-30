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
    ⚡ Lingo.dev — open-source AI-инструмент для мгновенной локализации с
    помощью LLM.
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

## Встречайте Compiler 🆕

**Lingo.dev Compiler** — бесплатный open-source middleware-компилятор, который делает любой React-приложение мультиязычным на этапе сборки, без изменений в существующих React-компонентах.

> **Примечание:** Если вы используете устаревший компилятор (`@lingo.dev/_compiler`), пожалуйста, переходите на `@lingo.dev/compiler`. Устаревший компилятор больше не поддерживается и будет удалён в будущих версиях.

Установите один раз:

```bash
npm install @lingo.dev/compiler
```

Включите в своей сборке:

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

Запустите `next build` и наблюдайте, как появляются бандлы для испанского и французского ✨

[Читать документацию →](https://lingo.dev/compiler) для полного гайда, а также [присоединяйтесь к нашему Discord](https://lingo.dev/go/discord), чтобы получить помощь с настройкой.

---

### Что внутри этого репозитория?

| Инструмент   | TL;DR                                                                                 | Документация                            |
| ------------ | ------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Локализация React на этапе сборки                                                     | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Локализация для web и мобильных приложений, JSON, YAML, markdown и др. одной командой | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Авто-коммит переводов при каждом пуше + создание pull request'ов при необходимости    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Перевод пользовательского контента в реальном времени                                 | [/sdk](https://lingo.dev/sdk)           |

Ниже — быстрый обзор по каждому инструменту 👇

---

### ⚡️ Lingo.dev CLI

Переводите код и контент прямо из терминала.

```bash
npx lingo.dev@latest run
```

Каждая строка получает свой отпечаток, результаты кешируются, и переводятся только изменённые строки.

[Следуйте документации →](https://lingo.dev/cli), чтобы узнать, как всё настроить.

---

### 🔄 Lingo.dev CI/CD

Доставляйте идеальные переводы автоматически.

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

Ваш репозиторий всегда зелёный, а продукт — многоязычный, без ручных шагов.

[Читать документацию →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Мгновенный перевод по запросу для динамического контента.

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

Идеально для чатов, комментариев пользователей и других real-time сценариев.

[Читать документацию →](https://lingo.dev/sdk)

---

## 🤝 Сообщество

Мы развиваемся вместе с комьюнити и всегда рады любым вкладчикам!

- Есть идея? [Откройте issue](https://github.com/lingodotdev/lingo.dev/issues)
- Хотите что-то поправить? [Присылайте PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Нужна помощь? [Присоединяйтесь к нашему Discord](https://lingo.dev/go/discord)

## ⭐ История звёзд

Если вам нравится, что мы делаем, поставьте ⭐ и помогите нам добраться до 10 000 звёзд! 🌟

[

![График истории звёзд](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme на других языках

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Не нашли свой язык? Добавьте его в [`i18n.json`](./i18n.json) и отправьте PR!

**Формат локали:** используйте коды [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- Язык: ISO 639-1/2/3 строчные буквы (`en`, `zh`, `bho`)
- Скрипт: ISO 15924 с заглавной буквы (`Hans`, `Hant`, `Latn`)
- Регион: ISO 3166-1 alpha-2 заглавные буквы (`US`, `CN`, `IN`)
- Примеры: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
