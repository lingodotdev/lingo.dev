<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev — платформа для інженерії локалізації" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev — платформа для інженерії локалізації: найкращий спосіб вимірювати якість перекладу, перекладати за допомогою LLM і вичитувати тексти з носіями мови.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Документація</a> •
  <a href="https://lingo.dev">Платформа</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt: DevTool місяця №1" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Ліцензія" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Останній коміт" /></a>
</p>

---

## Команди створюють рушії локалізації на Lingo.dev

[Рушій локалізації](https://lingo.dev/en/docs/platform/engines) — це stateful API перекладу, який ваша команда налаштовує, а Lingo.dev запускає. Створюйте окремий рушій для кожного продукту, типу контенту або бренду. У кожному запиті через рушій застосовується все, що ви в ньому налаштували, у фіксованому порядку пріоритету:

| Рівень | Що ви налаштовуєте | Із документації |
| --- | --- | --- |
| [LLM-моделі](https://lingo.dev/en/docs/platform/llm-models) | Яка модель обробляє кожну мовну пару, із пріоритизованими резервними варіантами | Понад 400 моделей; у відповіді вказується модель, яка спрацювала |
| [Голос бренду](https://lingo.dev/en/docs/platform/brand-voices) | Як ваш продукт звучить кожною мовою, по одному тексту для кожної локалі | Тон і рівень формальності для кожного ринку |
| [Правила](https://lingo.dev/en/docs/platform/rules) | Мовні норми, які універсальна модель може пропустити | Позиція прикметника в іспанській мові, пробіл перед знаком відсотка |
| [Глосарій](https://lingo.dev/en/docs/platform/glossaries) | Точні відповідники термінів для кожної локалі, зіставлені за змістом | "911" стає "112" для європейських ринків; назви продуктів лишаються без змін |
| [AI-рецензенти](https://lingo.dev/en/docs/platform/ai-reviewers) | Оцінювання, яке запускається після кожного перекладу | Оцінки GEMBA, BERTScore, відповідність глосарію |

Глосарії, набори правил і голоси бренду належать вашій організації, а рушій застосовує їх через підключення. Один глосарій може керувати п’ятьма рушіями, і одна правка одразу доходить до всіх п’яти. Перевірте зміну в [Playground](https://lingo.dev/en/docs/platform/playground), перш ніж вона піде в продакшн: порівняйте рушій із сирою моделлю або два рушії поруч. Рушії налаштовуються на платформі, де команда локалізації керує всією інфраструктурою локалізації.

## Працюйте зі своїми рушіями з коду

Перекладайте контент у репозиторії. `lingo push` надсилає файли до рушія, вказаного в `.lingo/config.json`, а `lingo pull` записує переклади назад з будь-якої машини:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Або викликайте рушій напряму, вказавши його ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Ваш агент для кодування створює рушій, додає терміни до глосарію, налаштовує правила та порівнює два рушії — прямо в розмові, де виникла проблема |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Надсилайте вихідні файли й отримуйте переклади з термінала або з CI. Підтримується 18 форматів: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, рядки Android і Xcode, SubRip, PHP |
| [Lingo.dev у CI/CD](https://lingo.dev/en/docs/workflows) | Установіть CLI і запускайте `lingo push` як крок у GitHub Actions, GitLab CI/CD, Bitbucket Pipelines або в будь-якому раннері з Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Установіть один раз — і кожен push у гілку за замовчуванням відкриватиме або оновлюватиме pull request із перекладом, або переклади потраплятимуть як коміт у pull request, який змінив вихідний текст. Жодного раннера, жодного секретного API-ключа, жодного Lockfile, яким треба керувати |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Один синхронний виклик на мовну пару або асинхронне завдання, яке розгортає один запит на багато локалей і повертає результати в міру їх надходження |

[Створіть свій перший рушій локалізації →](https://lingo.dev)
