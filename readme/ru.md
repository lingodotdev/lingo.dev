<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ ИИ-платформа с открытым исходным кодом для локализации веб и мобильных приложений.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Документация</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Внести вклад</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Отметить репозиторий</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Релиз" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Лицензия" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Последний коммит" />
  </a>
</p>

<br />

Lingo.dev — это управляемый сообществом CLI-инструмент с открытым исходным кодом для ИИ-локализации веб и мобильных приложений.

Lingo.dev создан для мгновенного получения аутентичных переводов, устраняя ручную работу и управленческие накладные расходы. В результате команды выполняют точную локализацию в 100 раз быстрее, доставляя функции большему количеству довольных пользователей по всему миру. Его можно использовать с вашей собственной LLM или с управляемым Lingo.dev движком локализации.

> **Малоизвестный факт:** Lingo.dev начинался как небольшой проект на студенческом хакатоне в 2023 году! После множества итераций мы были приняты в Y Combinator в 2024 году, и сейчас мы нанимаем сотрудников! Заинтересованы в создании инструментов локализации нового поколения? Отправляйте своё резюме на careers@lingo.dev! 🚀

## 📑 В этом руководстве

- [Быстрый старт](#-quickstart) - Начните работу за считанные минуты
- [Кэширование](#-caching-with-i18nlock) - Оптимизация обновлений переводов
- [GitHub Action](#-github-action) - Автоматизация локализации в CI/CD
- [Функции](#-supercharged-features) - Что делает Lingo.dev мощным
- [Документация](#-documentation) - Подробные руководства и справочники
- [Внести вклад](#-contribute) - Присоединяйтесь к нашему сообществу

## 💫 Быстрый старт

Интерфейс командной строки Lingo.dev разработан для работы как с вашей собственной LLM, так и с управляемым Lingo.dev движком локализации, построенным на основе новейших SOTA (передовых) LLM.

### Использование вашей собственной LLM (BYOK или Принесите свой ключ)

1. Создайте конфигурационный файл `i18n.json`:

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

2. Установите ваш API-ключ как переменную окружения:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# или для OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. Запустите локализацию:

```bash
npx lingo.dev@latest i18n
```

### Использование Lingo.dev Cloud

Зачастую приложения производственного уровня требуют таких функций, как память переводов, поддержка глоссария и контроль качества локализации. Также иногда вы хотите, чтобы эксперт решил за вас, какого провайдера LLM и какую модель использовать, и автоматически обновлял модель при выпуске новых версий. Lingo.dev — это управляемый движок локализации, который предоставляет эти функции:

1. Создайте конфигурационный файл `i18n.json` (без узла provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Аутентифицируйтесь в Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Запустите локализацию:

```bash
npx lingo.dev@latest i18n
```

## 📖 Документация

Для подробных руководств и справочников по API посетите [документацию](https://lingo.dev/go/docs).

## 🔒 Кэширование с помощью `i18n.lock`

Lingo.dev использует файл `i18n.lock` для отслеживания контрольных сумм содержимого, гарантируя, что только измененный текст будет переведен. Это улучшает:

- ⚡️ **Скорость**: Пропуск уже переведенного содержимого
- 🔄 **Согласованность**: Предотвращение ненужных повторных переводов
- 💰 **Стоимость**: Отсутствие оплаты за повторные переводы

## 🤖 GitHub Action

Lingo.dev предлагает GitHub Action для автоматизации локализации в вашем конвейере CI/CD. Вот базовая настройка:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Это действие запускает `lingo.dev i18n` при каждом push, автоматически поддерживая ваши переводы в актуальном состоянии.

Для режима pull request и других параметров конфигурации посетите нашу [документацию по GitHub Action](https://docs.lingo.dev/setup/gha).

## ⚡️ Суперспособности Lingo.dev

- 🔥 **Мгновенная интеграция**: Работает с вашей кодовой базой за считанные минуты
- 🔄 **Автоматизация CI/CD**: Настройте и забудьте
- 🌍 **Глобальный охват**: Доставляйте продукт пользователям по всему миру
- 🧠 **На базе ИИ**: Использует новейшие языковые модели для естественных переводов
- 📊 **Независимость от формата**: JSON, YAML, CSV, Markdown, Android, iOS и многие другие
- 🔍 **Чистые дифы**: Точно сохраняет структуру ваших файлов
- ⚡️ **Молниеносная скорость**: Переводы за секунды, а не дни
- 🔄 **Всегда синхронизировано**: Автоматически обновляется при изменении контента
- 🌟 **Качество на уровне человека**: Переводы, которые не звучат роботизированно
- 👨‍💻 **Создано разработчиками для разработчиков**: Мы сами используем его ежедневно
- 📈 **Растёт вместе с вами**: От побочного проекта до корпоративного масштаба

## 🤝 Внести вклад

Lingo.dev развивается сообществом, поэтому мы приветствуем любой вклад!

Есть идея для новой функции? Создайте issue на GitHub!

Хотите внести свой вклад? Создайте pull request!

## 🌐 Readme на других языках

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

Не видите свой язык? Просто добавьте новый языковой код в файл [`i18n.json`](./i18n.json) и откройте PR.
