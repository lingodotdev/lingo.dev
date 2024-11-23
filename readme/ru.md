<p align="center">
  <a href="https://replexica.com">
    <img src="/content/banner.dark.png" width="100%" alt="Replexica" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Современная AI локализация для веб и мобильных устройств, прямо в CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://replexica.com">Сайт</a> •
  <a href="https://github.com/replexica/replexica/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribute</a> •
  <a href="#-github-action">GitHub Action</a>
</p>

<p align="center">
  <a href="https://github.com/replexica/replexica/actions/workflows/release.yml">
    <img src="https://github.com/replexica/replexica/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/replexica/replexica/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/replexica/replexica" alt="License" />
  </a>
  <a href="https://github.com/replexica/replexica/commits/main">
    <img src="https://img.shields.io/github/last-commit/replexica/replexica" alt="Last Commit" />
  </a>
</p>

<br />

Replexica AI автоматизирует локализацию программного обеспечения.

Replexica генерирует аутентичные переводы на лету, избавляя от ручной работы и оверхеда управления. Движок локализации понимает контекст продукта, создавая идеальные переводы для 60+ языков, которые звучат нативно для носителей. В итоге, команды локализуют в 100 раз быстрее, с state-of-the-art качеством, что позволяет запускать фичи для большего числа платящих пользователей по всему миру.

## 💫 Quickstart

1. **Request access**: [talk to us](https://replexica.com/go/call) стать потребителем.

2.После подтверждения инициализируйте проект:
   ```bash
   npx replexica@latest init
   ```

3. Локализируйте ваш контент:
   ```bash
   npx replexica@latest i18n
   ```

## 🤖 GitHub Action

Replexica дает возможность автоматизировать процесс локализации с помощью GitHub Action в вашем CI/CD пайплайне. Базовая установка:

```yaml
- uses: replexica/replexica@main
  with:
    api-key: ${{ secrets.REPLEXICA_API_KEY }}
```
Action запускает `replexica i18n` после каждого push-а, сохраняя актуальность ваших переводов автоматически

Для подключения через pull request and и других настроек, посетите [GitHub Action documentation](https://docs.replexica.com/setup/gha).

## 🥇 Почему команды разработки выбирают Replexica

- 🔥 **Мгновенная интеграция**: Устанавливается в течение нескольких минут
- 🔄 **CI/CD автоматизация**: Незаметная интеграция с вашим pipeline-ом
- 🌍 **60+ языков**: Расширяйтесь на весь мир без усилий
- 🧠 **Движок для локализации с ИИ**: Переводы, которые точно подойдут вашему продукту
- 📊 **Гибкий формат**: Поддерживает такие форматы как JSON, YAML, CSV, Markdown, и прочие

## 🛠️ Расширеные функции

- ⚡️ **Со скоростью молнии**: Локализация с помощью ИИ за считанные секунды
- 🔄 **Авто-обновления**: Синхронизируется с актуальным контентом
- 🌟 **Уровень носителя языка**: Все переводы звучат аутентично
- 👨‍💻 **Developer-Friendly**: Клиентский интерфейс, который интегрируется в ваш рабочий процесс
- 📈 **Масштабируемый**: Для растущих стартапов и команд больших коммерческих компаний

## 📚 Документация

Для детальных инструкций и примеров посетите [документация](https://replexica.com/go/docs).

## 🤝 Contribute

Заинтересованы в развитии продукта, даже если вы не пользователь?

Загляните [Good First Issues](https://github.com/replexica/replexica/labels/good%20first%20issue) и прочитайте [Contributing Guide](./CONTRIBUTING.md).

## 🧠 Команда

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**

Остались вопросы или пожелания? Электронная почта veronica@replexica.com.

## 🌐 Readme in other languages

- [Английский](https://github.com/replexica/replexica)
- [Испанский](/readme/es.md)
- [Французский](/readme/fr.md)
- [Русский](/readme/ru.md)
- [Немецкий](/readme/de.md)
- [Китайский](/readme/zh-Hans.md)
- [Корейский](/readme/ko.md)
- [Японский](/readme/ja.md)
- [Итальянский](/readme/it.md)
- [Арабский](/readme/ar.md)

Не видите свой язык? Просто добавьте новый языковой код в файл [`i18n.json`](./i18n.json) и откройте PR.
