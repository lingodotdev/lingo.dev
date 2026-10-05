<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev — платформа локализационной инженерии" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev — платформа локализационной инженерии. Это лучший способ оценить качество перевода, переводить с помощью LLM и проверять переводы вместе с носителями языка.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Документация</a> •
  <a href="https://lingo.dev">Платформа</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt — инструмент №1 для разработчиков месяца" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Лицензия" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Последний коммит" /></a>
</p>

---

## Команды создают движки локализации на Lingo.dev

[Движок локализации](https://lingo.dev/en/docs/platform/engines) — это API перевода с сохранением состояния. Ваша команда его настраивает, а Lingo.dev запускает. Создавайте по одному движку на продукт, тип контента или бренд. Каждый запрос через движок учитывает всё, что вы в нём настроили, в строго заданном порядке приоритета:

| Слой | Что вы настраиваете | Из документации |
| --- | --- | --- |
| [LLM-модели](https://lingo.dev/en/docs/platform/llm-models) | Какая модель обрабатывает каждую языковую пару, и резервные модели по приоритету | 400+ моделей. В ответе указано, какая модель отработала |
| [Тональность бренда](https://lingo.dev/en/docs/platform/brand-voices) | Как ваш продукт говорит на каждом языке: отдельный текст для каждой локали | Тон и степень формальности для каждого рынка |
| [Правила](https://lingo.dev/en/docs/platform/rules) | Языковые нормы, которые универсальная модель упускает | Порядок прилагательных в испанском, пробел перед знаком процента |
| [Глоссарий](https://lingo.dev/en/docs/platform/glossaries) | Точные соответствия терминов для каждой локали с учётом смысла | «911» превращается в «112» для европейских рынков, а названия продуктов остаются без изменений |
| [AI-эвалюаторы](https://lingo.dev/en/docs/platform/ai-reviewers) | Оценка после каждого перевода | Оценки GEMBA, BERTScore, соответствие глоссарию |

Глоссарии, наборы правил и тональности бренда принадлежат вашей организации, а движок применяет их после подключения. Один глоссарий работает сразу для пяти движков, и одна правка доходит до всех пяти. Проверьте изменение в [Playground](https://lingo.dev/en/docs/platform/playground) до запуска: сравните движок с «чистой» моделью или два движка друг с другом. Движки настраиваются на платформе, где команда локализации управляет всей инфраструктурой локализации.

## Подключайте движки из кода

Переведите контент в репозитории. Команда `lingo push` отправляет файлы в движок, указанный в `.lingo/config.json`, а `lingo pull` записывает переводы обратно с любого компьютера:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Или вызовите движок напрямую, указав его ИД:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: { "X-API-Key": process.env.LINGO_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Ваш агент для написания кода создаёт движок, добавляет термины в глоссарий, настраивает правила и сравнивает два движка — прямо в диалоге, где возникла проблема |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Отправляйте исходные файлы и получайте переводы из терминала или CI. Восемнадцать форматов: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, строки Android и Xcode, SubRip, PHP |
| [Lingo.dev в CI/CD](https://lingo.dev/en/docs/workflows) | Установите CLI и запускайте `lingo push` отдельным шагом в GitHub Actions, GitLab CI/CD, Bitbucket Pipelines или на любом раннере с Node.js 22+ |
| [GitHub-приложение Lingo.dev](https://lingo.dev/en/docs/workflows/github-app) | Установите один раз, и каждый push в ветку по умолчанию будет открывать или обновлять pull request с переводами. Либо переводы попадут коммитом в тот pull request, где изменился исходный текст. Не нужны ни раннер, ни секрет с ключом API, ни lockfile, которым нужно управлять |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Один синхронный вызов на языковую пару или асинхронное задание: оно разворачивает один запрос на множество локалей и отдаёт результаты по мере готовности |

[Создайте свой первый движок локализации →](https://lingo.dev)
