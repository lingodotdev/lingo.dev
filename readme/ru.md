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
    Lingo.dev — open-source i18n toolkit для локализации на базе LLM
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

## Быстрый старт

| Инструмент                         | Сценарий использования                             | Быстрая команда                    |
| ---------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | AI-помощь при настройке i18n для React-приложений  | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Перевод JSON, YAML, markdown, CSV, PO файлов       | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Автоматизация перевода через GitHub Actions        | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Перевод на лету для динамического контента         | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Локализация React на этапе сборки без i18n-обёрток | `withLingo()` plugin               |

---

### Lingo.dev MCP

Model Context Protocol сервер, который позволяет AI-кодинг-ассистентам настраивать инфраструктуру i18n в React-приложениях через обычные текстовые подсказки.

**Поддерживаемые IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Поддерживаемые фреймворки:**

- Next.js (App Router и Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Использование:**

После настройки MCP-сервера в вашей IDE ([см. краткое руководство](https://lingo.dev/en/mcp)), дайте ассистенту команду:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Ассистент выполнит:

1. Настроит роутинг по локали (например, `/en`, `/es`, `/pt-BR`)
2. Добавит компоненты для переключения языков
3. Реализует автоматическое определение локали
4. Сгенерирует необходимые конфигурационные файлы

**Примечание:** Генерация кода с помощью ИИ не всегда повторяема. Проверьте сгенерированный код перед коммитом.

[Читать документацию →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Открытый CLI для перевода приложений и контента с помощью ИИ. Поддерживает все стандартные форматы: JSON, YAML, CSV, PO-файлы и markdown.

**Установка:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Как это работает:**

1. Извлекает переводимый контент из выбранных файлов
2. Отправляет контент провайдеру LLM для перевода
3. Записывает переведённый контент обратно в файловую систему
4. Создаёт файл `i18n.lock` для отслеживания завершённых переводов (чтобы не переводить повторно)

**Конфигурация:**

Команда `init` генерирует файл `i18n.json`. Настройте локали и бакеты:

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

Поле `provider` не обязательно (по умолчанию используется Lingo.dev Engine). Для кастомных LLM-провайдеров:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Поддерживаемые LLM-провайдеры:**

- Lingo.dev Engine (рекомендуется)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Читать документацию →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Автоматизированные процессы перевода для CI/CD. Не допускает неполные переводы в продакшн.

**Поддерживаемые платформы:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Настройка GitHub Actions:**

Создайте `.github/workflows/translate.yml`:

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

**Требования к настройке:**

1. Добавьте `LINGODOTDEV_API_KEY` в секреты репозитория (Настройки > Secrets and variables > Actions)
2. Для workflow с PR: Включите "Разрешить GitHub Actions создавать и одобрять pull requests" в Настройки > Actions > General

**Опции workflow:**

Коммитить переводы напрямую:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Создавать pull requests с переводами:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Доступные параметры:**

| Параметр             | По умолчанию                                   | Описание                            |
| -------------------- | ---------------------------------------------- | ----------------------------------- |
| `api-key`            | (обязательно)                                  | API-ключ Lingo.dev                  |
| `pull-request`       | `false`                                        | Создавать PR вместо прямого коммита |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Свое сообщение коммита              |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Свой заголовок PR                   |
| `working-directory`  | `"."`                                          | Директория для запуска              |
| `parallel`           | `false`                                        | Включить параллельную обработку     |

[Читать документацию →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Библиотека для перевода контента на лету. Доступна для JavaScript, PHP, Python и Ruby.

**Установка:**

```bash
npm install lingo.dev
```

**Использование:**

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

**Доступные SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) — веб-приложения, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) — PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) — Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) — Rails

[Читать документацию →](https://lingo.dev/en/sdk)

---

### Компилятор Lingo.dev

Система перевода на этапе сборки, которая делает React-приложения многоязычными без изменения компонентов. Работает во время сборки, а не в рантайме.

**Установка:**

```bash
pnpm install @lingo.dev/compiler
```

**Аутентификация:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Конфигурация (Next.js):**

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

**Конфигурация (Vite):**

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

**Настройка провайдера:**

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

**Переключатель языка:**

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

**Разработка:** `npm run dev` (использует псевдопереводчик, без API-запросов)

**Продакшн:** Установите `usePseudotranslator: false`, затем `next build`

Добавьте директорию `.lingo/` в систему контроля версий.

**Ключевые возможности:**

- Нулевая стоимость производительности в рантайме
- Нет ключей перевода и JSON-файлов
- Нет функций `t()` или обёрток-компонентов `<T>`
- Автоматическое определение переводимого текста в JSX
- Поддержка TypeScript
- ICU MessageFormat для плюрализации
- Ручные правки через атрибут `data-lingo-override`
- Встроенный виджет редактора переводов

**Режимы сборки:**

- `pseudotranslator`: Режим разработки с псевдопереводами (без затрат на API)
- `real`: Генерация реальных переводов с помощью LLM
- `cache-only`: Продакшн-режим с использованием заранее сгенерированных переводов из CI (без API-запросов)

**Поддерживаемые фреймворки:**

- Next.js (App Router с React Server Components)
- Vite + React (SPA и SSR)

Планируется поддержка дополнительных фреймворков.

[Читать документацию →](https://lingo.dev/en/compiler)

---

## Вклад в проект

Будем рады вашему участию. Пожалуйста, следуйте этим рекомендациям:

1. **Issues:** [Сообщить об ошибке или предложить функцию](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Отправить изменения](https://github.com/lingodotdev/lingo.dev/pulls)
   - Каждый PR требует changeset: `pnpm new` (или `pnpm new:empty` для нерелизных изменений)
   - Перед отправкой убедитесь, что все тесты проходят
3. **Разработка:** Это monorepo на pnpm + turborepo
   - Установить зависимости: `pnpm install`
   - Запустить тесты: `pnpm test`
   - Сборка: `pnpm build`

**Поддержка:** [Сообщество в Discord](https://lingo.dev/go/discord)

## История звёзд

Если Lingo.dev оказался полезен, поставьте нам звезду и помогите достичь 10 000 звёзд!

[

![График истории звёзд](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Локализованная документация

**Доступные переводы:**

[Английский](https://github.com/lingodotdev/lingo.dev) • [Китайский](/readme/zh-Hans.md) • [Японский](/readme/ja.md) • [Корейский](/readme/ko.md) • [Испанский](/readme/es.md) • [Французский](/readme/fr.md) • [Русский](/readme/ru.md) • [Украинский](/readme/uk-UA.md) • [Немецкий](/readme/de.md) • [Итальянский](/readme/it.md) • [Арабский](/readme/ar.md) • [Иврит](/readme/he.md) • [Хинди](/readme/hi.md) • [Португальский (Бразилия)](/readme/pt-BR.md) • [Бенгальский](/readme/bn.md) • [Персидский](/readme/fa.md) • [Польский](/readme/pl.md) • [Турецкий](/readme/tr.md) • [Урду](/readme/ur.md) • [Бходжпури](/readme/bho.md) • [Ассамский](/readme/as-IN.md) • [Гуджарати](/readme/gu-IN.md) • [Маратхи](/readme/mr-IN.md) • [Одиа](/readme/or-IN.md) • [Панджаби](/readme/pa-IN.md) • [Сингальский](/readme/si-LK.md) • [Тамильский](/readme/ta-IN.md) • [Телугу](/readme/te-IN.md)

**Добавить новый язык:**

1. Добавьте код локали в [`i18n.json`](./i18n.json) в формате [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Отправьте pull request

**Формат локали BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (строчные): `en`, `zh`, `bho`
- `Script`: ISO 15924 (с заглавной буквы): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (прописные): `US`, `CN`, `IN`
- Примеры: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
