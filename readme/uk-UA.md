<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ІІ-керований інструмент командного рядка з відкритим кодом для локалізації веб та мобільних додатків.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Документація</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Зробити внесок</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Відмітити зірочкою</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Реліз" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Ліцензія" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Останній коміт" />
  </a>
</p>

<br />

Lingo.dev — це керований спільнотою інструмент командного рядка з відкритим кодом для ІІ-керованої локалізації веб та мобільних додатків.

Lingo.dev розроблено для миттєвого створення автентичних перекладів, усуваючи ручну роботу та управлінські накладні витрати. Як результат, команди виконують точну локалізацію у 100 разів швидше, доставляючи функції більшій кількості задоволених користувачів по всьому світу. Його можна використовувати з власною LLM або з Локалізаційним Рушієм, керованим Lingo.dev.

> **Маловідомий факт:** Lingo.dev розпочався як невеликий проєкт на студентському хакатоні у 2023 році! Після багатьох ітерацій нас прийняли до Y Combinator у 2024 році, і зараз ми наймаємо працівників! Зацікавлені у створенні інструментів локалізації наступного покоління? Надсилайте своє резюме на careers@lingo.dev! 🚀

## 📑 У цьому посібнику

- [Швидкий старт](#-quickstart) - Почніть за лічені хвилини
- [Кешування](#-caching-with-i18nlock) - Оптимізуйте оновлення перекладів
- [GitHub Action](#-github-action) - Автоматизуйте локалізацію в CI/CD
- [Функції](#-supercharged-features) - Що робить Lingo.dev потужним
- [Документація](#-documentation) - Детальні посібники та довідники
- [Зробити внесок](#-contribute) - Приєднуйтесь до нашої спільноти

## 💫 Швидкий старт

Lingo.dev CLI розроблений для роботи як з вашою власною LLM, так і з Локалізаційним двигуном Lingo.dev, побудованим на основі найновіших SOTA (найсучасніших) LLM.

### Використання власної LLM (BYOK або Bring Your Own Key)

1. Створіть конфігураційний файл `i18n.json`:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "You're translating text from {source} to {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Встановіть свій API-ключ як змінну середовища:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# або для OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. Запустіть локалізацію:

```bash
npx lingo.dev@latest i18n
```

### Використання Lingo.dev Cloud

Часто програми виробничого рівня потребують таких функцій, як пам'ять перекладів, підтримка глосарію та забезпечення якості локалізації. Також іноді ви хочете, щоб експерт вирішив за вас, якого постачальника LLM та яку модель використовувати, і автоматично оновлював модель, коли випускаються нові. Lingo.dev — це керований механізм локалізації, який надає такі функції:

1. Створіть конфігураційний файл `i18n.json` (без вузла provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Автентифікуйтеся в Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Запустіть локалізацію:

```bash
npx lingo.dev@latest i18n
```

## 📖 Документація

Для детальних посібників та довідників API відвідайте [документацію](https://lingo.dev/go/docs).

## 🔒 Кешування з `i18n.lock`

Lingo.dev використовує файл `i18n.lock` для відстеження контрольних сум вмісту, гарантуючи, що перекладається лише змінений текст. Це покращує:

- ⚡️ **Швидкість**: Пропуск уже перекладеного вмісту
- 🔄 **Узгодженість**: Запобігання непотрібним повторним перекладам
- 💰 **Вартість**: Відсутність оплати за повторні переклади

## 🤖 GitHub Action

Lingo.dev пропонує GitHub Action для автоматизації локалізації у вашому CI/CD конвеєрі. Ось базове налаштування:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Ця дія запускає `lingo.dev i18n` при кожному пуші, автоматично підтримуючи ваші переклади в актуальному стані.

Для режиму запитів на злиття (pull request) та інших параметрів конфігурації відвідайте нашу [документацію GitHub Action](https://docs.lingo.dev/ci-action/gha).

## ⚡️ Суперможливості Lingo.dev

- 🔥 **Миттєва інтеграція**: Працює з вашою кодовою базою за лічені хвилини
- 🔄 **Автоматизація CI/CD**: Налаштуйте один раз і забудьте
- 🌍 **Глобальне охоплення**: Доставляйте продукт користувачам по всьому світу
- 🧠 **На базі ШІ**: Використовує найновіші мовні моделі для природних перекладів
- 📊 **Незалежність від формату**: JSON, YAML, CSV, Markdown, Android, iOS та багато інших
- 🔍 **Чисті діфи**: Точно зберігає структуру ваших файлів
- ⚡️ **Блискавична швидкість**: Переклади за секунди, а не дні
- 🔄 **Завжди синхронізовано**: Автоматично оновлюється при зміні контенту
- 🌟 **Якість на рівні людини**: Переклади, які не звучать роботизовано
- 👨‍💻 **Створено розробниками для розробників**: Ми самі використовуємо це щодня
- 📈 **Росте разом з вами**: Від побічного проєкту до корпоративного масштабу

## 🤝 Зробіть внесок

Lingo.dev розвивається спільнотою, тому ми вітаємо будь-які внески!

Маєте ідею для нової функції? Створіть issue на GitHub!

Хочете зробити внесок? Створіть pull request!

## 🌐 Readme іншими мовами

- [Англійська](https://github.com/lingodotdev/lingo.dev)
- [Китайська](/readme/zh-Hans.md)
- [Японська](/readme/ja.md)
- [Корейська](/readme/ko.md)
- [Іспанська](/readme/es.md)
- [Французька](/readme/fr.md)
- [Російська](/readme/ru.md)
- [Німецька](/readme/de.md)
- [Італійська](/readme/it.md)
- [Арабська](/readme/ar.md)
- [Гінді](/readme/hi.md)
- [Бенгальська](/readme/bn.md)

Не бачите своєї мови? Просто додайте новий код мови до файлу [`i18n.json`](./i18n.json) та відкрийте PR!
