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
    ⚡ Lingo.dev — открытый инструмент i18n с поддержкой ИИ для мгновенной
    локализации с использованием LLM.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
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
</p>

---

## Знакомьтесь: Compiler 🆕

**Lingo.dev Compiler** — это бесплатное программное обеспечение с открытым исходным кодом, предназначенное для того, чтобы сделать любое React-приложение многоязычным на этапе сборки без необходимости вносить изменения в существующие React-компоненты.

Установите один раз:

```bash
npm install lingo.dev
```

Активируйте в конфигурации сборки:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Запустите `next build` и наблюдайте, как появляются пакеты на испанском и французском языках ✨

[Прочитайте документацию →](https://lingo.dev/compiler) для полного руководства и [присоединяйтесь к нашему Discord](https://lingo.dev/go/discord), чтобы получить помощь с настройкой.

---

### Что внутри этого репозитория?

| Инструмент   | Краткое описание                                                                                 | Документация                            |
| ------------ | ------------------------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Локализация React на этапе сборки                                                                | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Локализация для веб- и мобильных приложений, JSON, YAML, markdown и других                       | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Автоматическое добавление переводов при каждом пуше + создание pull request'ов при необходимости | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Перевод в реальном времени для пользовательского контента                                        | [/sdk](https://lingo.dev/sdk)           |

Ниже представлены основные моменты для каждого инструмента 👇

---

### ⚡️ Lingo.dev CLI

Переводите код и контент прямо из терминала.

```bash
npx lingo.dev@latest run
```

Он создает отпечатки для каждой строки, кэширует результаты и переводит только измененные строки.

[Следуйте документации →](https://lingo.dev/cli), чтобы узнать, как настроить.

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

Поддерживает ваш репозиторий в порядке и делает ваш продукт многоязычным без ручных шагов.

[Прочитайте документацию →](https://lingo.dev/ci)

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

Идеально подходит для чатов, пользовательских комментариев и других потоков в реальном времени.

[Читать документацию →](https://lingo.dev/sdk)

---

## 🤝 Сообщество

Мы ориентированы на сообщество и рады любым вкладам!

- Есть идея? [Создайте задачу](https://github.com/lingodotdev/lingo.dev/issues)
- Хотите что-то исправить? [Отправьте PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Нужна помощь? [Присоединяйтесь к нашему Discord](https://lingo.dev/go/discord)

## ⭐ История звёзд

Если вам нравится то, что мы делаем, поставьте нам ⭐ и помогите достичь 3,000 звёзд! 🌟

[

![График истории звёзд](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme на других языках

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Не видите своего языка? Добавьте его в [`i18n.json`](./i18n.json) и отправьте PR!
