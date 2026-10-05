<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – פלטפורמת הנדסת לוקליזציה"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev היא פלטפורמת הנדסת הלוקליזציה: הדרך הטובה ביותר למדוד איכות תרגום,
    לתרגם עם מודלי שפה גדולים, ולהגיה עם דוברים שפת אם.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">מסמכים</a> •
  <a href="https://lingo.dev">פלטפורמה</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="כלי הפיתוח מס' 1 של החודש ב-Product Hunt"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="רישיון"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="התחייבות אחרונה"
    />
  </a>
</p>

---

## צוותים בונים מנועי לוקליזציה על Lingo.dev

[מנוע לוקליזציה](https://lingo.dev/en/docs/platform/engines) הוא API תרגום עם מצב שהצוות שלך מגדיר ו-Lingo.dev מריץ. בנה אחד למוצר, לסוג תוכן, או למותג. כל בקשה דרך מנוע מיישמת את כל מה שהגדרת בו, בסדר עדיפויות קבוע:

| שכבה                                                          | מה שאתה מגדיר                                     | מהמסמכים                                                          |
| ------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| [מודלי LLM](https://lingo.dev/en/docs/platform/llm-models)    | איזה מודל מטפל בכל זוג שפות, עם גיבויים מדורגים   | 400+ מודלים; התגובה מציינת את המודל שרץ                           |
| [קול מותג](https://lingo.dev/en/docs/platform/brand-voices)   | איך המוצר שלך מדבר בכל שפה, טקסט אחד לכל לוקאל    | טון ורמת פורמליות לכל שוק                                         |
| [כללים](https://lingo.dev/en/docs/platform/rules)             | המוסכמות הלשוניות שמודל גנרי מחמיץ                | מיקום שם תואר בספרדית, רווח לפני סימני אחוזים                     |
| [מילון מונחים](https://lingo.dev/en/docs/platform/glossaries) | מיפוי מדויק של מונחים לכל לוקאל, מותאם לפי משמעות | "911" הופך ל-"112" בשווקים אירופיים; שמות מוצרים עוברים ללא שינוי |
| [בודקי AI](https://lingo.dev/en/docs/platform/ai-reviewers)   | ניקוד שרץ אחרי כל תרגום                           | ציוני GEMBA, BERTScore, עמידה במילון המונחים                      |

מילוני מונחים, ערכות כללים וקולות מותג שייכים לארגון שלך, ומנוע מיישם אותם באמצעות חיבור. מילון מונחים אחד שולט בחמישה מנועים, ועריכה אחת מגיעה לכל החמישה. בדוק שינוי ב-[מגרש משחקים](https://lingo.dev/en/docs/platform/playground) לפני שהוא עובר לפרודקשן: השווה מנוע מול מודל גולמי, או שני מנועים זה מול זה. המנועים מוגדרים בפלטפורמה, שם צוות הלוקליזציה מריץ את תשתית הלוקליזציה.

## גישה למנועים שלך מקוד

תרגם תוכן במאגר. `lingo push` שולח את הקבצים למנוע הנקרא ב-`.lingo/config.json`, ו-`lingo pull` כותב את התרגומים בחזרה מכל מכונה:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

או קרא למנוע ישירות, על ידי ציון שם המזהה שלו:

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

|                                                                                |                                                                                                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                                 | סוכן הקידוד שלך יוצר מנוע, מוסיף מונחי מילון, מכוונן כללים ומשווה בין שני מנועים, מתוך השיחה שבה עלתה הבעיה                                             |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                                 | דחוף קבצי מקור, משוך תרגומים, ממסוף או מ-CI. שמונה עשר פורמטים: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, מחרוזות Android ו-Xcode, SubRip, PHP |
| [Lingo.dev ב-CI/CD](https://lingo.dev/en/docs/workflows)                       | התקן את ה-CLI והרץ `lingo push` כשלב ב-GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, או כל runner עם Node.js 22+                                   |
| [אפליקציית Lingo.dev ל-GitHub](https://lingo.dev/en/docs/workflows/github-app) | התקן פעם אחת וכל push לענף ברירת המחדל פותח או מעדכן בקשת משיכה לתרגום. ללא runner, ללא סוד API key, ללא lockfile לניהול                                |
| [API של Lingo.dev](https://lingo.dev/en/docs/api)                              | קריאה סינכרונית אחת לכל צמד שפות, או משימה אסינכרונית שמפזרת בקשה אחת לאזורי שפה רבים ומספקת תוצאות עם הגעתן                                            |

[בנה את מנוע הלוקליזציה הראשון שלך ←](https://lingo.dev)
