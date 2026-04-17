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
    כלי הנדסת לוקליזציה בקוד פתוח. התחברו לפלטפורמת ההנדסה של Lingo.dev לתרגומים
    עקביים ואיכוtiים.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler עבור React (אלפא מוקדמת)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## התחלה מהירה

| כלי                                                 | מה הכלי עושה                                    | פקודה מהירה                        |
| --------------------------------------------------- | ----------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)                | הגדרת i18n מונחית AI עבור אפליקציות React       | הנחיה: `Set up i18n`               |
| [**Lingo CLI**](#lingodev-cli)                      | לוקליזציה של קבצי JSON, YAML, markdown, CSV, PO | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)           | לוקליזציה רציפה ב-GitHub Actions                | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler עבור React**](#lingodev-compiler) | לוקליזציה של React בזמן build ללא עטיפות i18n   | פלאגין `withLingo()`               |

### מנועי לוקליזציה

כלים אלה מתחברים ל[מנועי לוקליזציה](https://lingo.dev) – APIs תרגום עם מצב שנוצרים בפלטפורמת ההנדסה Lingo.dev. כל מנוע שומר מילונים, קול מותג והנחיות לפי שפה לאורך כל בקשה, [ומפחית שגיאות טרמינולוגיה ב-16.6–44.6%](https://lingo.dev/research/retrieval-augmented-localization). או [הביאו את ה-LLM שלכם](#lingodev-cli).

---

### Lingo.dev MCP

הגדרת i18n באפליקציות React רגישה לטעויות – אפילו עוזרי קוד מבוססי AI מזייפים APIs לא קיימים ושוברים ניתוב. Lingo.dev MCP מעניק לעוזרי AI גישה מובנית לידע i18n ספציפי לפריימוורק עבור Next.js, React Router ו-TanStack Start. עובד עם Claude Code, Cursor, GitHub Copilot Agents ו-Codex.

[קראו את התיעוד →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

לוקליזציה של קבצי JSON, YAML, markdown, CSV ו-PO בפקודה אחת. קובץ נעילה עוקב אחר מה כבר תורגם – רק תוכן חדש או ששונה עובר עיבוד. ברירת המחדל היא מנוע הלוקליזציה שלכם ב-Lingo.dev, או הביאו את ה-LLM שלכם (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[קרא את התיעוד ←](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

לוקליזציה רציפה בצינור העבודה שלך. כל push מפעיל לוקליזציה – מחרוזות חסרות מתמלאות לפני שהקוד מגיע לייצור. תומך ב-GitHub Actions, GitLab CI/CD ו-Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[קרא את התיעוד ←](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

קרא למנוע הלוקליזציה שלך ישירות מקוד backend. לוקליזציה סינכרונית ואסינכרונית עם מסירה ב-webhook, בידוד כשלים לכל locale, והתקדמות בזמן אמת דרך WebSocket.

[קרא את התיעוד ←](https://lingo.dev/en/docs/api)

---

### Lingo Compiler עבור React (אלפא מוקדמת)

לוקליזציה של React בזמן build ללא עטיפות i18n. כתוב רכיבים עם טקסט רגיל באנגלית – המהדר מזהה מחרוזות הניתנות לתרגום ומייצר גרסאות מתורגמות בזמן build. ללא מפתחות תרגום, ללא קבצי JSON, ללא פונקציות `t()`. תומך ב-Next.js (App Router) ו-Vite + React.

[קרא את התיעוד ←](https://lingo.dev/en/docs/react/compiler)

---

## תרומה

תרומות מתקבלות בברכה. אנא עקוב אחר ההנחיות הבאות:

1. **בעיות:** [דווח על באגים או בקש פיצ'רים](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [שלח שינויים](https://github.com/lingodotdev/lingo.dev/pulls)
   - כל PR דורש changeset: `pnpm new` (או `pnpm new:empty` עבור שינויים שאינם לשחרור)
   - וודא שהבדיקות עוברות לפני הגשה
3. **פיתוח:** זהו monorepo של pnpm + turborepo
   - התקן תלויות: `pnpm install`
   - הרץ בדיקות: `pnpm test`
   - בנה: `pnpm build`

**תמיכה:** [קהילת Discord](https://lingo.dev/go/discord)

## היסטוריית כוכבים

אם אתה מוצא את Lingo.dev שימושי, תן לנו כוכב ועזור לנו להגיע ל-10,000 כוכבים!

[

![תרשים היסטוריית כוכבים](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## תיעוד מתורגם

**תרגומים זמינים:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**הוספת שפה חדשה:**

1. הוסף קוד שפה ל-[`i18n.json`](./i18n.json) בפורמט [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. שלח בקשת משיכה
