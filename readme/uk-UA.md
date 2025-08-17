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
    ⚡ Lingo.dev - інструментарій i18n з відкритим кодом на базі ШІ для миттєвої
    локалізації за допомогою LLM.
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
</p>

---

## Знайомтеся з Compiler 🆕

**Lingo.dev Compiler** — це безкоштовне проміжне програмне забезпечення компілятора з відкритим кодом, розроблене для того, щоб зробити будь-який React-додаток багатомовним під час збірки без необхідності внесення змін до існуючих React-компонентів.

---CODE-PLACEHOLDER-f159f7253d409892d00e70ee045902a5---

Запустіть `next build` і спостерігайте, як з'являються іспанські та французькі бандли ✨

[Читати документацію →](https://lingo.dev/compiler) для повного керівництва.

---

### Що міститься в цьому репозиторії?

| Інструмент   | Коротко                                                                                  | Документація                            |
| ------------ | ---------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Локалізація React під час збірки                                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Локалізація одною командою для веб- та мобільних додатків, JSON, YAML, markdown та інших | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Автоматичний коміт перекладів при кожному пуші + створення pull request за потреби       | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Переклад контенту, створеного користувачами, в реальному часі                            | [/sdk](https://lingo.dev/sdk)           |

Нижче наведено короткий огляд кожного інструменту 👇

---

### ⚡️ Lingo.dev CLI

Перекладайте код і контент прямо з терміналу.

---CODE-PLACEHOLDER-a4836309dda7477e1ba399e340828247---

Він створює відбитки кожного рядка, кешує результати і перекладає лише те, що змінилося.

[Читати документацію →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

Автоматично доставляйте ідеальні переклади.

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

Підтримує ваш репозиторій зеленим, а ваш продукт багатомовним без ручних кроків.

[Читати документацію →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Миттєвий переклад для динамічного контенту на кожен запит.

---CODE-PLACEHOLDER-c50e1e589a70e31dd2dde95be8da6ddf---

Ідеально підходить для чатів, коментарів користувачів та інших потоків у реальному часі.

[Читати документацію →](https://lingo.dev/sdk)

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

## 🤝 Спільнота

Ми орієнтовані на спільноту і любимо внески!

- Є ідея? [Відкрийте issue](https://github.com/lingodotdev/lingo.dev/issues)
- Хочете щось виправити? [Надішліть PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Потрібна допомога? [Приєднуйтесь до нашого Discord](https://lingo.dev/go/discord)

## ⭐ Історія зірок

Якщо вам подобається те, що ми робимо, поставте нам ⭐ і допоможіть нам досягти 3 000 зірок! 🌟

[

![Графік історії зірок](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme іншими мовами

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Не бачите своєї мови? Додайте її до [`i18n.json`](./i18n.json) і відкрийте PR!

## 🌐 Readme іншими мовами

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Не бачите своєї мови? Додайте її до [`i18n.json`](./i18n.json) та відкрийте PR!
