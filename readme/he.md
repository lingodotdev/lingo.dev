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
    ⚡ Lingo.dev - כלי קוד פתוח מבוסס בינה מלאכותית לתרגום מיידי באמצעות מודלי
    שפה גדולים.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="שחרור"
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
      alt="קומיט אחרון"
    />
  </a>
</p>

---

## הכירו את ה-Compiler 🆕

**Lingo.dev Compiler** הוא מידלוור קומפיילר בקוד פתוח וחינמי, המתוכנן להפוך כל אפליקציית React לרב-לשונית בזמן הבנייה מבלי לדרוש שינויים ברכיבי ה-React הקיימים.

התקינו פעם אחת:

```bash
npm install lingo.dev
```

הפעילו בהגדרות הבנייה שלכם:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

הריצו `next build` וצפו בחבילות בספרדית וצרפתית מופיעות ✨

[קראו את התיעוד →](https://lingo.dev/compiler) למדריך המלא, ו[הצטרפו לדיסקורד שלנו](https://lingo.dev/go/discord) לקבלת עזרה בהתקנה.

---

### מה נמצא במאגר זה?

| כלי          | תקציר                                                              | תיעוד                                   |
| ------------ | ------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | לוקליזציה של React בזמן בנייה                                      | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | פקודה אחת לתרגום אפליקציות ווב ומובייל, JSON, YAML, markdown, ועוד | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | קומיט אוטומטי של תרגומים בכל דחיפה + יצירת בקשות משיכה במידת הצורך | [/ci](https://lingo.dev/ci)             |
| **SDK**      | תרגום בזמן אמת לתוכן שנוצר על ידי משתמשים                          | [/sdk](https://lingo.dev/sdk)           |

להלן סקירה מהירה של כל אחד מהם 👇

---

### ⚡️ Lingo.dev CLI

תרגמו קוד ותוכן ישירות מהטרמינל שלכם.

```bash
npx lingo.dev@latest run
```

הוא מייצר טביעת אצבע לכל מחרוזת, מטמין תוצאות, ומתרגם מחדש רק את מה שהשתנה.

[עקבו אחר התיעוד ←](https://lingo.dev/cli) כדי ללמוד כיצד להגדיר זאת.

---

### 🔄 Lingo.dev CI/CD

שלחו תרגומים מושלמים באופן אוטומטי.

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

שומר על המאגר שלכם ירוק ועל המוצר שלכם רב-לשוני ללא צעדים ידניים.

[קראו את התיעוד ←](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

תרגום מיידי לפי בקשה עבור תוכן דינמי.

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

מושלם עבור צ'אט, תגובות משתמשים וזרימות בזמן אמת אחרות.

[קראו את התיעוד ←](https://lingo.dev/sdk)

---

## 🤝 קהילה

אנחנו מונעים על ידי הקהילה ואוהבים תרומות!

- יש לכם רעיון? [פתחו סוגיה](https://github.com/lingodotdev/lingo.dev/issues)
- רוצים לתקן משהו? [שלחו PR](https://github.com/lingodotdev/lingo.dev/pulls)
- צריכים עזרה? [הצטרפו לדיסקורד שלנו](https://lingo.dev/go/discord)

## ⭐ היסטוריית כוכבים

אם אתם אוהבים את מה שאנחנו עושים, תנו לנו ⭐ ועזרו לנו להגיע ל-3,000 כוכבים! 🌟

[

![תרשים היסטוריית כוכבים](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 קובץ README בשפות אחרות

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

לא רואים את השפה שלכם? הוסיפו אותה ל-[i18n.json](./i18n.json) ופתחו PR!
