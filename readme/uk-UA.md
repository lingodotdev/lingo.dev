<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – платформа для інженерії локалізації"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev — це платформа для локалізаційної інженерії: найкращий спосіб
    вимірювати якість перекладу, перекладати за допомогою LLM і коригувати з
    носіями мови.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Документація</a> •
  <a href="https://lingo.dev">Платформа</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt — DevTool місяця №1"
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

## Команди будують локалізаційні движки на Lingo.dev

[Локалізаційний движок](https://lingo.dev/en/docs/platform/engines) — це API перекладу зі збереженням стану, який налаштовує ваша команда, а Lingo.dev запускає. Створюйте один движок на продукт, на тип контенту або на бренд. Кожен запит через движок застосовує все, що ви в ньому налаштували, у фіксованому порядку пріоритетів:

| Рівень                                                           | Що ви налаштовуєте                                                       | З документації                                                                 |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| [Моделі LLM](https://lingo.dev/en/docs/platform/llm-models)      | Яка модель обробляє кожну мовну пару з ранжованими резервними варіантами | Понад 400 моделей; відповідь містить назву моделі, що виконала переклад        |
| [Голос бренду](https://lingo.dev/en/docs/platform/brand-voices)  | Як ваш продукт говорить кожною мовою — один текст на локаль              | Тон і формальність для кожного ринку                                           |
| [Правила](https://lingo.dev/en/docs/platform/rules)              | Лінгвістичні конвенції, які не враховує загальна модель                  | Позиція прикметників в іспанській, пробіл перед знаком відсотка                |
| [Глосарій](https://lingo.dev/en/docs/platform/glossaries)        | Точні відповідності термінів для кожної локалі, зіставлені за значенням  | «911» стає «112» для європейських ринків; назви продуктів залишаються без змін |
| [AI-рецензенти](https://lingo.dev/en/docs/platform/ai-reviewers) | Оцінювання, що виконується після кожного перекладу                       | Оцінки GEMBA, BERTScore, відповідність глосарію                                |

Глосарії, набори правил і голоси бренду належать вашій організації, і движок застосовує їх через підключення. Один глосарій керує п'ятьма движками, і одна зміна поширюється на всі п'ять. Протестуйте зміну в [Пісочниці](https://lingo.dev/en/docs/platform/playground) перед її впровадженням: порівняйте движок із базовою моделлю або два движки один з одним. Движки налаштовуються на платформі, де локалізаційна команда керує локалізаційною інфраструктурою.

## Отримайте доступ до ваших двигунів з коду

Перекладіть вміст репозиторію. `lingo push` надсилає файли двигуну, зазначеному в `.lingo/config.json`, а `lingo pull` записує переклади назад з будь-якої машини:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Або викличте двигун безпосередньо, вказавши його ID:

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

|                                                                        |                                                                                                                                                                                     |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Ваш агент кодування створює двигун, додає терміни глосарію, налаштовує правила та порівнює два двигуни безпосередньо з розмови, де виникла проблема                                 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Завантажуйте вихідні файли, отримуйте переклади з терміналу або з CI. Вісімнадцять форматів: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, рядки Android та Xcode, SubRip, PHP |
| [Lingo.dev у CI/CD](https://lingo.dev/en/docs/workflows)               | Встановіть CLI і запустіть `lingo push` як крок у GitHub Actions, GitLab CI/CD, Bitbucket Pipelines або будь-якому виконавці з Node.js 22+                                          |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Встановіть один раз, і кожен push до гілки за замовчуванням відкриває або оновлює pull request з перекладом. Без виконавця, без секретного API-ключа, без lockfile для керування    |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Один синхронний виклик на мовну пару або асинхронна задача, яка розподіляє один запит на багато локалей і надає результати по мірі їх готовності                                    |

[Створіть свій перший двигун локалізації →](https://lingo.dev)
