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

Настроить i18n в React-приложениях — это всегда куча граблей, даже для опытных разработчиков. AI-ассистенты только усугубляют: придумывают несуществующие API, забывают про middleware, ломают роутинг или делают всё наполовину и теряются. Проблема в том, что настройка i18n требует чёткой последовательности изменений в разных файлах (роутинг, middleware, компоненты, конфиги), а LLM-ам сложно держать весь контекст.

Lingo.dev MCP решает это, давая AI-ассистентам структурированный доступ к знаниям по i18n для конкретных фреймворков. Вместо догадок ассистент использует проверенные схемы для Next.js, React Router и TanStack Start.

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

После настройки MCP-сервера в своей IDE ([см. быстрый старт](https://lingo.dev/en/mcp)), просто попросите ассистента:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Ассистент сделает следующее:

1. Настроит роутинг по локали (например, `/en`, `/es`, `/pt-BR`)
2. Добавит компоненты для переключения языка
3. Реализует автоматическое определение локали
4. Сгенерирует нужные конфиги

**Важно:** Генерация кода с помощью AI непредсказуема. Проверьте код перед коммитом.

[Читать документацию →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Держать переводы в актуальном состоянии — это боль. Добавил новую строку, забыл перевести — и вот уже сломанный интерфейс для пользователей из других стран. Или отправил JSON-файлы переводчикам, ждал несколько дней, потом вручную сливал их работу. А если языков больше 10, то это уже сотни файлов, которые постоянно расходятся.

Lingo.dev CLI всё автоматизирует. Просто укажи папку с переводами, запусти одну команду — и все локали обновятся. Lockfile отслеживает, что уже переведено, так что платишь только за новое или изменённое. Поддерживаются JSON, YAML, CSV, PO и markdown-файлы.

**Установка:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Как это работает:**

1. Извлекает переводимый контент из настроенных файлов
2. Отправляет контент провайдеру LLM для перевода
3. Записывает переведённый контент обратно в файловую систему
4. Создаёт файл `i18n.lock` для отслеживания завершённых переводов (чтобы избежать повторной обработки)

**Конфигурация:**

Команда `init` генерирует файл `i18n.json`. Настройте языки и бакеты:

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

Поле `provider` необязательное (по умолчанию — Lingo.dev Engine). Для кастомных LLM-провайдеров:

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

Переводы — это фича, которая всегда "почти готова". Разработчики сливают код, не обновляя локали. QA находит пропущенные переводы на стейджинге — или, что хуже, пользователи ловят их в проде. Корень проблемы: перевод — ручной этап, который легко пропустить под дедлайном.

Lingo.dev CI/CD автоматизирует переводы. Каждый пуш запускает перевод. Пропущенные строки заполняются до попадания кода в прод. Не нужно напрягаться — пайплайн всё сделает.

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

**Требования к установке:**

1. Добавьте `LINGODOTDEV_API_KEY` в секреты репозитория (Settings > Secrets and variables > Actions)
2. Для PR-воркфлоу: включите "Allow GitHub Actions to create and approve pull requests" в Settings > Actions > General

**Опции воркфлоу:**

Коммитить переводы напрямую:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Создавайте pull request'ы с переводами:

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
| `api-key`            | (обязательный)                                 | API-ключ Lingo.dev                  |
| `pull-request`       | `false`                                        | Создавать PR вместо прямого коммита |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Свой текст коммита                  |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Свой заголовок PR                   |
| `working-directory`  | `"."`                                          | Директория для запуска              |
| `parallel`           | `false`                                        | Включить параллельную обработку     |

[Читать документацию →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Статические файлы переводов подходят для UI-меток, но что делать с пользовательским контентом? Чаты, описания товаров, обращения в поддержку — всё это появляется уже после сборки и не может быть переведено заранее. В итоге вы показываете текст без перевода или строите свою сложную систему локализации.

Lingo.dev SDK переводит контент на лету. Передайте любой текст, объект или HTML — и получите локализованную версию. Работает для чатов в реальном времени, динамических уведомлений и любого контента, который появляется после деплоя. Доступно для JavaScript, PHP, Python и Ruby.

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

### Lingo.dev Compiler

Классический i18n — это боль. Нужно оборачивать каждую строку в функции `t()`, придумывать ключи переводов (`home.hero.title.v2`), поддерживать параллельные JSON-файлы и наблюдать, как компоненты раздуваются от локализационного кода. Всё настолько муторно, что команды откладывают интернационализацию до последнего, пока не приходится делать огромный рефакторинг.

Компилятор Lingo.dev убирает всю рутину. Пиши React-компоненты с обычным английским текстом — компилятор сам находит переводимые строки на этапе сборки и автоматически генерирует локализованные версии. Никаких ключей, JSON-файлов или обёрток — только React-код, который сразу работает на нескольких языках.

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

**Продакшн:** Установи `usePseudotranslator: false`, затем `next build`

Добавь директорию `.lingo/` в систему контроля версий.

**Ключевые возможности:**

- Нулевая стоимость по производительности на рантайме
- Нет ключей перевода и JSON-файлов
- Нет функций `t()` или обёрток-компонентов `<T>`
- Автоматическое определение переводимого текста в JSX
- Поддержка TypeScript
- ICU MessageFormat для плюрализации
- Ручные правки через атрибут `data-lingo-override`
- Встроенный редактор переводов

**Режимы сборки:**

- `pseudotranslator`: режим разработки с псевдопереводами (без затрат на API)
- `real`: генерация реальных переводов с помощью LLM
- `cache-only`: продакшн-режим с использованием заранее сгенерированных переводов из CI (без API-запросов)

**Поддерживаемые фреймворки:**

- Next.js (App Router с React Server Components)
- Vite + React (SPA и SSR)

Планируется поддержка других фреймворков.

[Читать документацию →](https://lingo.dev/en/compiler)

---

## Вклад в проект

Будем рады вашим вкладом! Пожалуйста, следуйте этим рекомендациям:

1. **Issues:** [Сообщить об ошибках или предложить новые функции](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Отправить изменения](https://github.com/lingodotdev/lingo.dev/pulls)
   - Для каждого PR нужен changeset: `pnpm new` (или `pnpm new:empty` для изменений без релиза)
   - Перед отправкой убедитесь, что все тесты проходят
3. **Разработка:** Это монорепозиторий на pnpm + turborepo
   - Установить зависимости: `pnpm install`
   - Запустить тесты: `pnpm test`
   - Собрать проект: `pnpm build`

**Поддержка:** [Сообщество в Discord](https://lingo.dev/go/discord)

## История звёзд

Если Lingo.dev оказался полезен, поставьте нам звезду и помогите достичь 10 000 звёзд!

[

![График истории звёзд](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Локализованная документация

**Доступные переводы:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Добавить новый язык:**

1. Добавьте код локали в [`i18n.json`](./i18n.json) в формате [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Отправьте pull request

**Формат локали BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (строчные): `en`, `zh`, `bho`
- `Script`: ISO 15924 (с заглавной буквы): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (заглавные): `US`, `CN`, `IN`
- Примеры: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
