<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – платформа локализационной инженерии"
    />
  </a>
</p>

<p align="center">
  <strong>
    Инструменты локализационной инженерии с открытым исходным кодом.
    Подключайтесь к платформе локализационной инженерии Lingo.dev для стабильных
    и качественных переводов.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">
    Lingo Compiler для React (Ранняя альфа-версия)
  </a>
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

| Инструмент                                         | Что делает                                         | Быстрая команда                    |
| -------------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | Настройка i18n для React-приложений с помощью ИИ   | Запрос: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                     | Локализация JSON, YAML, markdown, CSV, PO-файлов   | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | Непрерывная локализация в GitHub Actions           | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler для React**](#lingodev-compiler) | Локализация React на этапе сборки без i18n-обёрток | Плагин `withLingo()`               |

### Движки локализации

Эти инструменты подключаются к [движкам локализации](https://lingo.dev) – API перевода с сохранением состояния, которые вы создаёте на платформе локализационной инженерии Lingo.dev. Каждый движок сохраняет глоссарии, голос бренда и инструкции для каждой локали при каждом запросе, [сокращая терминологические ошибки на 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). Или [используйте собственную LLM](#lingodev-cli).

---

### Lingo.dev MCP

Настройка i18n в React-приложениях — процесс, подверженный ошибкам: даже ИИ-ассистенты генерируют несуществующие API и ломают маршрутизацию. Lingo.dev MCP предоставляет ИИ-ассистентам структурированный доступ к специфическим для фреймворков знаниям по i18n для Next.js, React Router и TanStack Start. Работает с Claude Code, Cursor, GitHub Copilot Agents и Codex.

[Читать документацию →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Локализуйте JSON, YAML, markdown, CSV и PO-файлы одной командой. Файл блокировки отслеживает уже локализованный контент — обрабатывается только новое или изменённое содержимое. По умолчанию использует ваш движок локализации на Lingo.dev, либо подключите собственную LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Читать документацию →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Непрерывная локализация в вашем конвейере. Каждый пуш запускает локализацию – недостающие строки заполняются до того, как код попадёт в продакшн. Поддерживает GitHub Actions, GitLab CI/CD и Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Читать документацию →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Вызывайте движок локализации напрямую из бэкенд-кода. Синхронная и асинхронная локализация с доставкой через вебхуки, изоляция ошибок для каждой локали и отслеживание прогресса в реальном времени через WebSocket.

[Читать документацию →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler для React (Ранняя альфа)

Локализация React на этапе сборки без обёрток i18n. Пишите компоненты с обычным английским текстом – компилятор обнаруживает переводимые строки и генерирует локализованные варианты на этапе сборки. Никаких ключей переводов, никаких JSON-файлов, никаких функций `t()`. Поддерживает Next.js (App Router) и Vite + React.

[Читать документацию →](https://lingo.dev/en/docs/react/compiler)

---

## Участие в проекте

Приветствуются любые вклады. Пожалуйста, следуйте этим рекомендациям:

1. **Проблемы:** [Сообщайте об ошибках или запрашивайте функции](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Request'ы:** [Отправляйте изменения](https://github.com/lingodotdev/lingo.dev/pulls)
   - Каждый PR требует changeset: `pnpm new` (или `pnpm new:empty` для изменений без релиза)
   - Убедитесь, что тесты проходят перед отправкой
3. **Разработка:** Это монорепозиторий на pnpm + turborepo
   - Установите зависимости: `pnpm install`
   - Запустите тесты: `pnpm test`
   - Сборка: `pnpm build`

**Поддержка:** [Сообщество в Discord](https://lingo.dev/go/discord)

## История звёзд

Если Lingo.dev полезен для вас, поставьте нам звезду и помогите достичь 10 000 звёзд!

[

![Диаграмма истории звёзд](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Локализованная документация

**Доступные переводы:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Добавление нового языка:**

1. Добавьте код локали в [`i18n.json`](./i18n.json), используя [формат BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Отправьте pull request
