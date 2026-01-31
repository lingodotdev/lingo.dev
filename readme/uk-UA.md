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
    ⚡ Lingo.dev — інструментарій для миттєвої локалізації з відкритим кодом на
    основі ШІ та великих мовних моделей.
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
      alt="Реліз"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Ліцензія"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Останній коміт"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt — інструмент для розробників №1 місяця"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt — продукт №1 тижня"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt — продукт №2 дня"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="У трендах GitHub"
    />
  </a>
</p>

---

## Знайомтеся з Compiler 🆕

**Lingo.dev Compiler** — це безкоштовний компілятор-middleware з відкритим кодом, створений для того, щоб зробити будь-який React-застосунок багатомовним під час збірки без необхідності змінювати існуючі React-компоненти.

> **Примітка:** якщо ви використовуєте застарілий компілятор (`@lingo.dev/_compiler`), будь ласка, перейдіть на `@lingo.dev/compiler`. Застарілий компілятор більше не підтримується і буде видалений у майбутніх версіях.

Встановіть один раз:

```bash
npm install @lingo.dev/compiler
```

Увімкніть у конфігурації збірки:

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

Запустіть `next build` і спостерігайте, як з'являються іспанські та французькі збірки ✨

[Читайте документацію →](https://lingo.dev/compiler) для повного посібника та [приєднуйтесь до нашого Discord](https://lingo.dev/go/discord), щоб отримати допомогу з налаштуванням.

---

### Що міститься в цьому репозиторії?

| Інструмент   | Коротко                                                                                     | Документація                            |
| ------------ | ------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Локалізація React під час збірки                                                            | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Локалізація однією командою для веб- і мобільних застосунків, JSON, YAML, markdown та інших | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Автоматичний коміт перекладів при кожному push + створення pull request за потреби          | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Переклад у реальному часі для контенту, створеного користувачами                            | [/sdk](https://lingo.dev/sdk)           |

Нижче наведено короткий огляд кожного 👇

---

### ⚡️ Lingo.dev CLI

Перекладайте код і контент прямо з вашого терміналу.

```bash
npx lingo.dev@latest run
```

Він створює відбиток кожного рядка, кешує результати та перекладає лише те, що змінилося.

[Дивіться документацію →](https://lingo.dev/cli), щоб дізнатися, як його налаштувати.

---

### 🔄 Lingo.dev CI/CD

Випускайте ідеальні переклади автоматично.

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

Підтримує ваш репозиторій у робочому стані та ваш продукт багатомовним без ручних кроків.

[Читайте документацію →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Миттєвий переклад для динамічного контенту на кожен запит.

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

Ідеально підходить для чатів, коментарів користувачів та інших процесів у реальному часі.

[Читайте документацію →](https://lingo.dev/sdk)

---

## 🤝 Спільнота

Ми орієнтовані на спільноту та любимо внески!

- Є ідея? [Відкрийте issue](https://github.com/lingodotdev/lingo.dev/issues)
- Хочете щось виправити? [Надішліть PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Потрібна допомога? [Приєднуйтесь до нашого Discord](https://lingo.dev/go/discord)

## ⭐ Історія зірок

Якщо вам подобається те, що ми робимо, поставте нам ⭐ та допоможіть досягти 10 000 зірок! 🌟

[

![Графік історії зірок](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme іншими мовами

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Не бачите свою мову? Додайте її до [`i18n.json`](./i18n.json) та відкрийте PR!

**Формат локалі:** Використовуйте коди [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- Мова: ISO 639-1/2/3 у нижньому регістрі (`en`, `zh`, `bho`)
- Письмо: ISO 15924 з великої літери (`Hans`, `Hant`, `Latn`)
- Регіон: ISO 3166-1 alpha-2 у верхньому регістрі (`US`, `CN`, `IN`)
- Приклади: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
