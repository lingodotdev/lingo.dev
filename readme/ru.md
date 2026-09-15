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
    Lingo.dev — это платформа для инженерии локализации: лучший способ измерять
    качество перевода, переводить с помощью LLM и вычитывать с носителями языка.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Документация</a> •
  <a href="https://lingo.dev">Платформа</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="DevTool №1 месяца на Product Hunt"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Лицензия"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Последний коммит"
    />
  </a>
</p>

---

## Команды создают движки локализации на Lingo.dev

[Движок локализации](https://lingo.dev/en/docs/platform/engines) — это API перевода с сохранением состояния, который настраивает ваша команда, а Lingo.dev запускает. Создайте один на продукт, на тип контента или на бренд. Каждый запрос через движок применяет всё, что вы в нём настроили, в фиксированном порядке приоритета:

| Слой                                                             | Что вы настраиваете                                                    | Из документации                                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [LLM-модели](https://lingo.dev/en/docs/platform/llm-models)      | Какая модель обрабатывает каждую языковую пару с резервными вариантами | Более 400 моделей; ответ указывает, какая модель была запущена                           |
| [Голос бренда](https://lingo.dev/en/docs/platform/brand-voices)  | Как ваш продукт говорит на каждом языке — один текст на локаль         | Тон и стиль для каждого рынка                                                            |
| [Правила](https://lingo.dev/en/docs/platform/rules)              | Лингвистические конвенции, которые упускает универсальная модель       | Позиция прилагательного в испанском, пробел перед знаком процента                        |
| [Глоссарий](https://lingo.dev/en/docs/platform/glossaries)       | Точные соответствия терминов по локалям, сопоставляемые по смыслу      | «911» становится «112» для европейских рынков; названия продуктов остаются без изменений |
| [AI-рецензенты](https://lingo.dev/en/docs/platform/ai-reviewers) | Оценка, которая запускается после каждого перевода                     | Оценки GEMBA, BERTScore, соответствие глоссарию                                          |

Глоссарии, наборы правил и голоса бренда принадлежат вашей организации, а движок применяет их через подключение. Один глоссарий управляет пятью движками, и одно изменение достигает всех пяти. Протестируйте изменение в [Песочнице](https://lingo.dev/en/docs/platform/playground) перед запуском: сравните движок с исходной моделью или два движка друг с другом. Движки настраиваются на платформе, где команда локализации управляет инфраструктурой локализации.

## Получите доступ к вашим движкам из кода

Переведите контент в репозитории. `lingo push` отправляет файлы в движок, указанный в `.lingo/config.json`, а `lingo pull` записывает переводы обратно с любой машины:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Или вызовите движок напрямую, указав его ID:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                        |                                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Ваш агент кодирования создаёт движок, добавляет глоссарные термины, настраивает правила и сравнивает два движка прямо в диалоге, где возникла проблема                               |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Загружайте исходные файлы, скачивайте переводы из терминала или из CI. Восемнадцать форматов: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, строки Android и Xcode, SubRip, PHP |
| [Lingo.dev в CI/CD](https://lingo.dev/en/docs/workflows)               | Установите CLI и запустите `lingo push` как шаг в GitHub Actions, GitLab CI/CD, Bitbucket Pipelines или любом раннере с Node.js 22+                                                  |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Установите один раз, и каждый пуш в основную ветку открывает или обновляет pull request с переводами. Никакого раннера, никаких секретов API-ключей, никаких lockfile для управления |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Один синхронный вызов на языковую пару или асинхронная задача, которая распределяет один запрос на множество локалей и возвращает результаты по мере готовности                      |

[Создайте свой первый движок локализации →](https://lingo.dev)
