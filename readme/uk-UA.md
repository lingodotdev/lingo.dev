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
    Lingo.dev - інструментарій i18n з відкритим кодом для локалізації на основі
    LLM
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
      alt="Product Hunt #1 DevTool місяця"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool тижня"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 продукт дня"
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

## Швидкий старт

| Інструмент                         | Випадок використання                                | Швидка команда                     |
| ---------------------------------- | --------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | Налаштування i18n з допомогою AI для React-додатків | Промпт: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Переклад JSON, YAML, markdown, CSV, PO файлів       | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Автоматизований конвеєр перекладу в GitHub Actions  | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Переклад у runtime для динамічного контенту         | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Локалізація React на етапі збірки без i18n-обгорток | плагін `withLingo()`               |

---

### Lingo.dev MCP

Сервер Model Context Protocol, який дозволяє AI-асистентам для кодування налаштовувати інфраструктуру i18n у React-додатках через промпти природною мовою.

**Підтримувані IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Підтримувані фреймворки:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Використання:**

Після налаштування MCP-сервера у вашому IDE ([див. посібники швидкого старту](https://lingo.dev/en/mcp)), запитайте свого асистента:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Асистент виконає:

1. Налаштує маршрутизацію на основі локалі (наприклад, `/en`, `/es`, `/pt-BR`)
2. Налаштує компоненти перемикання мови
3. Реалізує автоматичне визначення локалі
4. Згенерує необхідні конфігураційні файли

**Примітка:** генерація коду за допомогою AI є недетермінованою. Перевірте згенерований код перед комітом.

[Читати документацію →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

CLI з відкритим вихідним кодом для перекладу застосунків і контенту за допомогою AI. Підтримує всі стандартні галузеві формати, включаючи JSON, YAML, CSV, PO-файли та markdown.

**Налаштування:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Як це працює:**

1. Витягує контент для перекладу з налаштованих файлів
2. Надсилає контент до LLM-провайдера для перекладу
3. Записує перекладений контент назад у файлову систему
4. Створює файл `i18n.lock` для відстеження завершених перекладів (уникає надлишкової обробки)

**Конфігурація:**

Команда `init` генерує файл `i18n.json`. Налаштуйте локалі та бакети:

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

Поле `provider` є опціональним (за замовчуванням використовується Lingo.dev Engine). Для власних LLM-провайдерів:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Підтримувані LLM-провайдери:**

- Lingo.dev Engine (рекомендовано)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Читати документацію →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Автоматизовані робочі процеси перекладу для CI/CD-конвеєрів. Запобігає потраплянню неповних перекладів у продакшн.

**Підтримувані платформи:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Налаштування GitHub Actions:**

Створіть `.github/workflows/translate.yml`:

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

**Вимоги до налаштування:**

1. Додайте `LINGODOTDEV_API_KEY` до секретів репозиторію (Settings > Secrets and variables > Actions)
2. Для PR-воркфлоу: увімкніть "Allow GitHub Actions to create and approve pull requests" у Settings > Actions > General

**Опції воркфлоу:**

Комітити переклади безпосередньо:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Створювати pull request з перекладами:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Доступні параметри:**

| Параметр             | За замовчуванням                               | Опис                               |
| -------------------- | ---------------------------------------------- | ---------------------------------- |
| `api-key`            | (обов'язково)                                  | API-ключ Lingo.dev                 |
| `pull-request`       | `false`                                        | Створити PR замість прямого коміту |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Власне повідомлення коміту         |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Власний заголовок PR               |
| `working-directory`  | `"."`                                          | Директорія для виконання           |
| `parallel`           | `false`                                        | Увімкнути паралельну обробку       |

[Читати документацію →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Бібліотека для перекладу в реальному часі для динамічного контенту. Доступна для JavaScript, PHP, Python та Ruby.

**Встановлення:**

```bash
npm install lingo.dev
```

**Використання:**

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

**Доступні SDK:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) — веб-застосунки, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) — PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) — Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) — Rails

[Читати документацію →](https://lingo.dev/en/sdk)

---

### Компілятор Lingo.dev

Система перекладу на етапі збірки, яка робить React-додатки багатомовними без зміни компонентів. Працює під час збірки, а не виконання.

**Встановлення:**

```bash
pnpm install @lingo.dev/compiler
```

**Автентифікація:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Конфігурація (Next.js):**

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

**Конфігурація (Vite):**

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

**Налаштування провайдера:**

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

**Перемикач мови:**

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

**Розробка:** `npm run dev` (використовує псевдоперекладач, без викликів API)

**Продакшн:** Встановіть `usePseudotranslator: false`, потім `next build`

Закомітьте директорію `.lingo/` до системи контролю версій.

**Ключові можливості:**

- Нульові витрати продуктивності під час виконання
- Без ключів перекладу або JSON-файлів
- Без функцій `t()` або компонентів-обгорток `<T>`
- Автоматичне виявлення тексту для перекладу в JSX
- Підтримка TypeScript
- ICU MessageFormat для множини
- Ручне перевизначення через атрибут `data-lingo-override`
- Вбудований віджет редактора перекладів

**Режими збірки:**

- `pseudotranslator`: режим розробки з плейсхолдер-перекладами (без витрат на API)
- `real`: генерація реальних перекладів за допомогою LLM
- `cache-only`: продакшн-режим з використанням попередньо згенерованих перекладів з CI (без викликів API)

**Підтримувані фреймворки:**

- Next.js (App Router з React Server Components)
- Vite + React (SPA та SSR)

Планується підтримка додаткових фреймворків.

[Читати документацію →](https://lingo.dev/en/compiler)

---

## Внесок у проєкт

Вітаємо внески. Будь ласка, дотримуйтесь цих рекомендацій:

1. **Проблеми:** [Повідомити про помилки або запитати функції](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Надіслати зміни](https://github.com/lingodotdev/lingo.dev/pulls)
   - Кожен PR вимагає changeset: `pnpm new` (або `pnpm new:empty` для змін без релізу)
   - Переконайтеся, що тести проходять перед надсиланням
3. **Розробка:** Це монорепозиторій pnpm + turborepo
   - Встановити залежності: `pnpm install`
   - Запустити тести: `pnpm test`
   - Зібрати: `pnpm build`

**Підтримка:** [Спільнота Discord](https://lingo.dev/go/discord)

## Історія зірок

Якщо Lingo.dev корисний для вас, поставте нам зірку та допоможіть досягти 10 000 зірок!

[

![Графік історії зірок](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Локалізована документація

**Доступні переклади:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Додавання нової мови:**

1. Додайте код локалі до [`i18n.json`](./i18n.json), використовуючи [формат BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Надішліть pull request

**Формат локалі BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (нижній регістр): `en`, `zh`, `bho`
- `Script`: ISO 15924 (регістр заголовка): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (верхній регістр): `US`, `CN`, `IN`
- Приклади: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
