<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - ערכת כלים בקוד פתוח מבוססת AI לתרגום מיידי עם מודלי שפה
    גדולים.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

## הכירו את ה-Compiler 🆕

**Lingo.dev Compiler** הוא תוכנת ביניים חינמית בקוד פתוח, שתוכננה להפוך כל אפליקציית React לרב-לשונית בזמן הבנייה ללא צורך בשינויים בקומפוננטות ה-React הקיימות.

התקנה חד-פעמית:

```bash
npm install @lingo.dev/compiler
```

הפעלה בקובץ תצורת הבנייה:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

הריצו `next build` וצפו בחבילות בספרדית ובצרפתית מופיעות ✨

[קראו את התיעוד →](https://lingo.dev/compiler) למדריך המלא, ו[הצטרפו ל-Discord שלנו](https://lingo.dev/go/discord) כדי לקבל עזרה בהגדרה.

---

### מה נמצא בתוך הריפו הזה?

| כלי          | תקציר                                                              | תיעוד                                   |
| ------------ | ------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | תרגום React בזמן בנייה                                             | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | תרגום בפקודה אחת לאפליקציות ווב ומובייל, JSON, YAML, markdown ועוד | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | תרגומים אוטומטיים בכל push + יצירת pull requests במידת הצורך       | [/ci](https://lingo.dev/ci)             |
| **SDK**      | תרגום בזמן אמת לתוכן שנוצר על ידי משתמשים                          | [/sdk](https://lingo.dev/sdk)           |

להלן הנקודות המרכזיות עבור כל אחד 👇

---

### ⚡️ Lingo.dev CLI

תרגם קוד ותוכן ישירות מהטרמינל שלך.

```bash
npx lingo.dev@latest run
```

הוא יוצר טביעת אצבע לכל מחרוזת, שומר תוצאות במטמון, ומתרגם מחדש רק את מה שהשתנה.

[עקוב אחר התיעוד ←](https://lingo.dev/cli) כדי ללמוד כיצד להגדיר אותו.

---

### 🔄 Lingo.dev CI/CD

שלח תרגומים מושלמים באופן אוטומטי.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

שומר על המאגר שלך ירוק ועל המוצר שלך רב-לשוני ללא שלבים ידניים.

[קרא את התיעוד ←](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

תרגום מיידי לכל בקשה עבור תוכן דינמי.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

מושלם עבור צ'אט, תגובות משתמשים ותהליכים אחרים בזמן אמת.

[קרא את התיעוד ←](https://lingo.dev/sdk)

---

## 🤝 קהילה

אנחנו מונעים על ידי הקהילה ואוהבים תרומות!

- יש לך רעיון? [פתח issue](https://github.com/lingodotdev/lingo.dev/issues)
- רוצה לתקן משהו? [שלח PR](https://github.com/lingodotdev/lingo.dev/pulls)
- צריך עזרה? [הצטרף לדיסקורד שלנו](https://lingo.dev/go/discord)

## ⭐ היסטוריית כוכבים

אם אתה אוהב את מה שאנחנו עושים, תן לנו ⭐ ועזור לנו להגיע ל-6,000 כוכבים! 🌟

[

![תרשים היסטוריית כוכבים](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 קובץ readme בשפות אחרות

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

לא רואה את השפה שלך? הוסף אותה ל-`i18n.json` ופתח PR!

**פורמט לוקייל:** יש להשתמש בקודים של [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- שפה: ISO 639-1/2/3 באותיות קטנות (`en`, `zh`, `bho`)
- כתב: ISO 15924 באותיות רישיות (`Hans`, `Hant`, `Latn`)
- אזור: ISO 3166-1 alpha-2 באותיות גדולות (`US`, `CN`, `IN`)
- דוגמאות: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
