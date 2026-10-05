<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## Команди створюють рушії локалізації на Lingo.dev

[Рушій локалізації](https://lingo.dev/en/docs/platform/engines) — це API перекладу зі станом, який налаштовує ваша команда, а Lingo.dev запускає. Створюйте окремий рушій для кожного продукту, типу контенту чи бренду. Кожен запит через рушій застосовує все, що ви в ньому налаштували, у фіксованому порядку пріоритету:

| Рівень | Що ви налаштовуєте | У документації |
| --- | --- | --- |
| [LLM-моделі](https://lingo.dev/en/docs/platform/llm-models) | Яка модель обробляє кожну мовну пару, з резервними варіантами за пріоритетом | Понад 400 моделей; у відповіді вказано, яка саме модель спрацювала |
| [Голос бренду](https://lingo.dev/en/docs/platform/brand-voices) | Як ваш продукт звучить кожною мовою — один текст для кожної локалі | Тон і рівень формальності для кожного ринку |
| [Правила](https://lingo.dev/en/docs/platform/rules) | Мовні норми, які універсальна модель може не врахувати | Позиція прикметника в іспанській мові, пробіл перед знаком відсотка |
| [Глосарій](https://lingo.dev/en/docs/platform/glossaries) | Точні відповідники термінів для кожної локалі, зіставлені за змістом | "911" стає "112" для європейських ринків; назви продуктів залишаються без змін |
| [AI-рецензенти](https://lingo.dev/en/docs/platform/ai-reviewers) | Оцінювання, яке виконується після кожного перекладу | Оцінки GEMBA, BERTScore, відповідність глосарію |

Глосарії, набори правил і голоси бренду належать вашій організації, а рушій застосовує їх через підключення. Один глосарій може керувати п’ятьма рушіями, і одна правка одразу поширюється на всі п’ять. Перевірте зміну в [Playground](https://lingo.dev/en/docs/platform/playground), перш ніж запускати її в роботу: порівняйте рушій із чистою моделлю або два рушії поруч. Рушії налаштовуються на платформі, де команда локалізації керує всією інфраструктурою локалізації.

## Підключайтеся до своїх рушіїв із коду

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Ваш агент для розробки створює рушій, додає терміни до глосарію, налаштовує правила й порівнює два рушії — просто в розмові, де виникла проблема |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Надсилайте вихідні файли й отримуйте переклади з термінала або з CI. Вісімнадцять форматів: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, рядки Android і Xcode, SubRip, PHP |
| [Lingo.dev у CI/CD](https://lingo.dev/en/docs/workflows) | Установіть CLI і запустіть `lingo push` як крок у GitHub Actions, GitLab CI/CD, Bitbucket Pipelines або в будь-якому runner із Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Установіть один раз — і кожен push у гілку за замовчуванням відкриватиме або оновлюватиме pull request із перекладами, або переклади потраплятимуть як commit у pull request, що змінив джерело. Без runner, без секретного API-ключа, без потреби керувати lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Один синхронний виклик для кожної мовної пари або асинхронне завдання, яке розподіляє один запит на багато локалей і повертає результати в міру їх надходження |

[Створіть свій перший рушій локалізації →](https://lingo.dev)
