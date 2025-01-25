<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Передовая AI-локализация для веб и мобильных приложений прямо из CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">Сайт</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Внести вклад</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

<br />

Lingo.dev AI автоматизирует локализацию программного обеспечения от начала до конца.

Она мгновенно создает аутентичные переводы, устраняя ручную работу и управленческие издержки. Движок локализации Lingo.dev понимает контекст продукта, создавая идеальные переводы, которые носители языка ожидают увидеть на более чем 60 языках. В результате команды выполняют локализацию в 100 раз быстрее, с передовым качеством, доставляя функционал большему количеству платящих клиентов по всему миру.

## 💫 Quickstart

1. Создайте аккаунт на [сайте](https://lingo.dev)

2. Инициализируйте ваш проект:

   ```bash
   npx replexica@latest init
   ```

3. Ознакомьтесь с нашей документацией: [docs.lingo.dev](https://docs.lingo.dev)

4. Локализуйте ваше приложение (занимает секунды):
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev дает возможность автоматизировать процесс локализации с помощью GitHub Action в вашем CI/CD пайплайне. Базовая установка:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```

Action запускает `replexica i18n` после каждого push-а, сохраняя актуальность ваших переводов автоматически

Для подключения через pull request and и других настроек, посетите [GitHub Action documentation](https://docs.lingo.dev/setup/gha).

## 🥇 Почему команды выбирают Lingo.dev

- 🔥 **Мгновенная интеграция**: Настройка за считанные минуты
- 🔄 **CI/CD автоматизация**: Бесшовная интеграция в процесс разработки
- 🌍 **Более 60 языков**: Простой выход на глобальный рынок
- 🧠 **AI движок локализации**: Переводы, идеально подходящие вашему продукту
- 📊 **Гибкость форматов**: Поддержка JSON, YAML, CSV, Markdown и других

## 🛠️ Расширенные возможности

- ⚡️ **Молниеносная скорость**: AI локализация за секунды
- 🔄 **Автообновления**: Синхронизация с актуальным контентом
- 🌟 **Качество носителя языка**: Естественно звучащие переводы
- 👨‍💻 **Удобство для разработчиков**: CLI интегрируется в ваш рабочий процесс
- 📈 **Масштабируемость**: Для растущих стартапов и корпоративных команд

## 📚 Документация

Подробные руководства и API референсы доступны в [документации](https://lingo.dev/go/docs).

## 🤝 Участие в разработке

Хотите внести свой вклад, даже если вы не являетесь клиентом?

Посмотрите [задачи для начинающих](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) и прочитайте [руководство по участию](./CONTRIBUTING.md).

## 🧠 Команда

- **[Вероника](https://github.com/vrcprl)**
- **[Макс](https://github.com/maxprilutskiy)**

Вопросы или запросы? Пишите на veronica@lingo.dev

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

Не видите свой язык? Просто добавьте новый языковой код в файл [`i18n.json`](./i18n.json) и создайте PR.
