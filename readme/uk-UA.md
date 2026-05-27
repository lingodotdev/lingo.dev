<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – платформа для інженерії локалізації"
    />
  </a>
</p>

<p align="center">
  <strong>
    Інструменти інженерії локалізації з відкритим кодом. Підключайтеся до
    платформи Lingo.dev для послідовних і якісних перекладів.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler для React (Рання альфа)</a>
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

| Інструмент                                         | Що він робить                                      | Швидка команда                     |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | Налаштування i18n для React-застосунків з AI       | Запит: `Set up i18n`               |
| [**Lingo CLI**](#lingodev-cli)                     | Локалізація JSON, YAML, markdown, CSV, PO файлів   | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | Безперервна локалізація в GitHub Actions           | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler для React**](#lingodev-compiler) | Локалізація React під час збірки без i18n-обгорток | Плагін `withLingo()`               |

### Рушії локалізації

Ці інструменти підключаються до [рушіїв локалізації](https://lingo.dev) – API перекладу зі збереженням стану, які ви створюєте на платформі Lingo.dev. Кожен рушій зберігає глосарії, тон бренду та інструкції для кожної локалі в усіх запитах, [зменшуючи термінологічні помилки на 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). Або [використовуйте власну LLM](#lingodev-cli).

---

### Lingo.dev MCP

Налаштування i18n у React-застосунках часто призводить до помилок – навіть AI-асистенти генерують неіснуючі API та ламають маршрутизацію. Lingo.dev MCP надає AI-асистентам структурований доступ до знань про i18n для Next.js, React Router і TanStack Start. Працює з Claude Code, Cursor, GitHub Copilot Agents і Codex.

[Читати документацію →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Локалізуйте JSON, YAML, markdown, CSV і PO файли однією командою. Lockfile відстежує вже локалізований контент – обробляються лише нові або змінені дані. За замовчуванням використовується ваш рушій локалізації на Lingo.dev, або підключіть власну LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Читати документацію →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Безперервна локалізація у вашому конвеєрі. Кожен push запускає локалізацію — відсутні рядки заповнюються до того, як код потрапить у продакшн. Підтримує GitHub Actions, GitLab CI/CD та Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Читати документацію →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Викликайте свій механізм локалізації безпосередньо з бекенд-коду. Синхронна та асинхронна локалізація з доставкою через вебхуки, ізоляцією помилок для кожної локалі та моніторингом прогресу в реальному часі через WebSocket.

[Читати документацію →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler для React (рання альфа)

Локалізація React на етапі збірки без обгорток i18n. Пишіть компоненти з простим текстом англійською — компілятор виявляє рядки для перекладу та генерує локалізовані варіанти під час збірки. Без ключів перекладу, без JSON-файлів, без функцій `t()`. Підтримує Next.js (App Router) і Vite + React.

[Читати документацію →](https://lingo.dev/en/docs/react/compiler)

---

## Долучайтеся

Вітаємо ваш внесок. Будь ласка, дотримуйтесь цих рекомендацій:

1. **Issues:** [Повідомте про баги або запропонуйте функції](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Надішліть зміни](https://github.com/lingodotdev/lingo.dev/pulls)
   - Кожен PR потребує чейнджсету: `pnpm new` (або `pnpm new:empty` для змін без релізу)
   - Переконайтеся, що тести проходять перед надсиланням
3. **Розробка:** Це монорепозиторій на pnpm + turborepo
   - Встановіть залежності: `pnpm install`
   - Запустіть тести: `pnpm test`
   - Зберіть проєкт: `pnpm build`

**Підтримка:** [Спільнота в Discord](https://lingo.dev/go/discord)

## Історія зірок

Якщо Lingo.dev виявився корисним, поставте нам зірку та допоможіть досягти 10 000 зірок!

[

![Графік історії зірок](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Локалізована документація

**Доступні переклади:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Додавання нової мови:**

1. Додайте код локалі до [`i18n.json`](./i18n.json), використовуючи [формат BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Надішліть pull request
