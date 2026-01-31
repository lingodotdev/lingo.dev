<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev - ערכת כלים קוד פתוח ל-i18n עם תרגום מבוסס LLM</strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

| כלי                                | מקרה שימוש                                         | פקודה מהירה                        |
| ---------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | הגדרת i18n בסיוע AI עבור אפליקציות React           | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | תרגום קבצי JSON, YAML, markdown, CSV, PO           | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | צינור תרגום אוטומטי ב-GitHub Actions               | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | תרגום בזמן ריצה לתוכן דינמי                        | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | לוקליזציה של React בזמן build ללא wrappers של i18n | תוסף `withLingo()`                 |

---

### Lingo.dev MCP

שרת Model Context Protocol המאפשר לעוזרי קידוד AI להגדיר תשתית i18n באפליקציות React באמצעות הנחיות בשפה טבעית.

**סביבות פיתוח נתמכות:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**פריימוורקים נתמכים:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**שימוש:**

לאחר הגדרת שרת MCP בסביבת הפיתוח שלך ([ראה מדריכי התחלה מהירה](https://lingo.dev/en/mcp)), בקש מהעוזר שלך:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

העוזר יבצע:

1. הגדרת ניתוב מבוסס locale (לדוגמה, `/en`, `/es`, `/pt-BR`)
2. הגדרת רכיבי החלפת שפה
3. יישום זיהוי locale אוטומטי
4. יצירת קבצי הגדרות נדרשים

**שים לב:** יצירת קוד בעזרת AI אינה דטרמיניסטית. יש לבדוק את הקוד שנוצר לפני ביצוע commit.

[קרא את התיעוד ←](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

כלי CLI בקוד פתוח לתרגום אפליקציות ותוכן באמצעות AI. תומך בכל הפורמטים הסטנדרטיים בתעשייה כולל JSON, YAML, CSV, קבצי PO ו-markdown.

**התקנה:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**איך זה עובד:**

1. מחלץ תוכן הניתן לתרגום מקבצים מוגדרים
2. שולח תוכן לספק LLM לתרגום
3. כותב תוכן מתורגם חזרה למערכת הקבצים
4. יוצר קובץ `i18n.lock` למעקב אחר תרגומים שהושלמו (מונע עיבוד מיותר)

**הגדרות:**

הפקודה `init` מייצרת קובץ `i18n.json`. הגדר locales ו-buckets:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

השדה `provider` הוא אופציונלי (ברירת המחדל היא Lingo.dev Engine). עבור ספקי LLM מותאמים אישית:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ספקי LLM נתמכים:**

- Lingo.dev Engine (מומלץ)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[קרא את התיעוד ←](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

תהליכי עבודה אוטומטיים לתרגום עבור צינורות CI/CD. מונע הגעת תרגומים לא שלמים לסביבת הייצור.

**פלטפורמות נתמכות:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**הגדרת GitHub Actions:**

צור `.github/workflows/translate.yml`:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**דרישות הגדרה:**

1. הוסף `LINGODOTDEV_API_KEY` ל-secrets של המאגר (Settings > Secrets and variables > Actions)
2. עבור workflows של PR: הפעל "Allow GitHub Actions to create and approve pull requests" ב-Settings > Actions > General

**אפשרויות workflow:**

בצע commit של תרגומים ישירות:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

צור pull requests עם תרגומים:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**פרמטרי קלט זמינים:**

| Input                | Default                                        | Description                     |
| -------------------- | ---------------------------------------------- | ------------------------------- |
| `api-key`            | (required)                                     | מפתח API של Lingo.dev           |
| `pull-request`       | `false`                                        | צור PR במקום לבצע commit ישירות |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | הודעת commit מותאמת אישית       |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | כותרת PR מותאמת אישית           |
| `working-directory`  | `"."`                                          | ספרייה להרצה                    |
| `parallel`           | `false`                                        | הפעל עיבוד מקבילי               |

[קרא את התיעוד ←](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ספריית תרגום בזמן ריצה לתוכן דינמי. זמינה עבור JavaScript, PHP, Python ו-Ruby.

**התקנה:**

```bash
npm install lingo.dev
```

**שימוש:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**SDKs זמינים:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - אפליקציות web, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[קרא את התיעוד ←](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

מערכת תרגום בזמן build שהופכת אפליקציות React לרב-לשוניות ללא שינוי קומפוננטות. פועלת במהלך ה-build ולא ב-runtime.

**התקנה:**

```bash
pnpm install @lingo.dev/compiler
```

**אימות:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**הגדרות (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**הגדרות (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**הגדרת Provider:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**מחליף שפה:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**פיתוח:** `npm run dev` (משתמש ב-pseudotranslator, ללא קריאות API)

**ייצור:** הגדר `usePseudotranslator: false`, ואז `next build`

בצע commit לתיקיית `.lingo/` ל-version control.

**תכונות עיקריות:**

- ללא עלות ביצועים ב-runtime
- ללא מפתחות תרגום או קבצי JSON
- ללא פונקציות `t()` או קומפוננטות wrapper מסוג `<T>`
- זיהוי אוטומטי של טקסט הניתן לתרגום ב-JSX
- תמיכה ב-TypeScript
- ICU MessageFormat עבור רבים
- עקיפות ידניות באמצעות attribute `data-lingo-override`
- widget מובנה לעריכת תרגומים

**מצבי build:**

- `pseudotranslator`: מצב פיתוח עם תרגומי placeholder (ללא עלויות API)
- `real`: יצירת תרגומים אמיתיים באמצעות LLMs
- `cache-only`: מצב ייצור המשתמש בתרגומים שנוצרו מראש מ-CI (ללא קריאות API)

**frameworks נתמכים:**

- Next.js (App Router עם React Server Components)
- Vite + React (SPA ו-SSR)

תמיכה ב-frameworks נוספים מתוכננת.

[קרא את התיעוד ←](https://lingo.dev/en/compiler)

---

## תרומה לפרויקט

תרומות מתקבלות בברכה. אנא עקוב אחר ההנחיות הבאות:

1. **בעיות:** [דווח על באגים או בקש תכונות](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [שלח שינויים](https://github.com/lingodotdev/lingo.dev/pulls)
   - כל PR דורש changeset: `pnpm new` (או `pnpm new:empty` עבור שינויים שאינם לשחרור)
   - ודא שהבדיקות עוברות לפני השליחה
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

1. הוסף קוד locale ל-[`i18n.json`](./i18n.json) באמצעות [פורמט BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. שלח pull request

**פורמט locale BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (אותיות קטנות): `en`, `zh`, `bho`
- `Script`: ISO 15924 (אות ראשונה גדולה): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (אותיות גדולות): `US`, `CN`, `IN`
- דוגמאות: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
