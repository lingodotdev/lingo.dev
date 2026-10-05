<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – פלטפורמת הנדסת לוקליזציה" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev היא פלטפורמת הנדסת הלוקליזציה: הדרך הטובה ביותר למדוד את איכות התרגום, לתרגם עם LLMs, ולבצע הגהה עם דוברים ילידיים.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">פלטפורמה</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool של החודש" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="רישיון" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="הקומיט האחרון" /></a>
</p>

---

## צוותים בונים מנועי לוקליזציה על גבי Lingo.dev

[מנוע לוקליזציה](https://lingo.dev/en/docs/platform/engines) הוא API לתרגום עם מצב, שהצוות שלכם מגדיר ו-Lingo.dev מריץ. אפשר לבנות מנוע נפרד לכל מוצר, לכל סוג תוכן או לכל מותג. כל בקשה שעוברת דרך מנוע מחילה את כל מה שהגדרתם בו, לפי סדר קדימויות קבוע:

| שכבה | מה מגדירים | מהתיעוד |
| --- | --- | --- |
| [מודלי LLM](https://lingo.dev/en/docs/platform/llm-models) | איזה מודל מטפל בכל צמד שפות, עם חלופות מדורגות | 400+ מודלים; התשובה מציינת איזה מודל רץ |
| [שפת המותג](https://lingo.dev/en/docs/platform/brand-voices) | איך המוצר שלכם מדבר בכל שפה, טקסט אחד לכל לוקאל | טון ורמת רשמיות לכל שוק |
| [כללים](https://lingo.dev/en/docs/platform/rules) | מוסכמות לשוניות שמודל כללי עלול לפספס | מיקום שם התואר בספרדית, רווח לפני סימן אחוז |
| [מילון מונחים](https://lingo.dev/en/docs/platform/glossaries) | מיפוי מדויק של מונחים לכל לוקאל, לפי משמעות | "911" הופך ל-"112" בשווקים אירופיים; שמות מוצרים נשארים כפי שהם |
| [מבקרי AI](https://lingo.dev/en/docs/platform/ai-reviewers) | ניקוד שרץ אחרי כל תרגום | ציוני GEMBA, ‏BERTScore, עמידה במילון המונחים |

מילוני מונחים, מערכי כללים ושפות מותג שייכים לארגון שלכם, ומנוע מחיל אותם דרך שיוך. מילון מונחים אחד יכול לשרת חמישה מנועים, ועריכה אחת מתעדכנת בכולם. בדקו שינוי ב-[Playground](https://lingo.dev/en/docs/platform/playground) לפני שהוא עולה לאוויר: השוו מנוע למודל גולמי, או שני מנועים זה לצד זה. המנועים מוגדרים בפלטפורמה, שבה צוות הלוקליזציה מפעיל את תשתית הלוקליזציה.

## גשו למנועים שלכם ישירות מהקוד

תרגמו את התוכן בריפוזיטורי. `lingo push` שולח את הקבצים למנוע שמוגדר ב-`.lingo/config.json`, ו-`lingo pull` כותב את התרגומים בחזרה מכל מכונה:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

או קראו למנוע ישירות, לפי ה-ID שלו:

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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | סוכן הקוד שלכם יוצר מנוע, מוסיף מונחים למילון, מכוונן כללים ומשווה בין שני מנועים — ישירות מתוך השיחה שבה הבעיה עלתה |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | דחפו קובצי מקור ומשכו תרגומים, מהטרמינל או מ-CI. 18 פורמטים: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, מחרוזות Android ו-Xcode, SubRip, PHP |
| [Lingo.dev ב-CI/CD](https://lingo.dev/en/docs/workflows) | התקינו את ה-CLI והריצו `lingo push` כשלב ב-GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, או בכל runner עם Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | מתקינים פעם אחת, וכל push לענף ברירת המחדל פותח או מעדכן pull request לתרגום, או שהתרגומים נוחתים כקומיט בתוך ה-pull request ששינה את המקור. בלי runner, בלי סוד של מפתח API ובלי Lockfile לניהול |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | קריאה סינכרונית אחת לכל צמד שפות, או משימה אסינכרונית שמפצלת בקשה אחת להרבה לוקאלים ומחזירה תוצאות ברגע שהן מגיעות |

[בנו את מנוע הלוקליזציה הראשון שלכם →](https://lingo.dev)
