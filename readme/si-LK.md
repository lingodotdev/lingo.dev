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
  <strong>
    Lingo.dev - LLM බලගන්වන ප්‍රාදේශීයකරණය සඳහා විවෘත මූලාශ්‍ර i18n මෙවලම්
    කට්ටලය
  </strong>
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

## ඉක්මන් ආරම්භය

| මෙවලම                              | භාවිත අවස්ථාව                                         | ඉක්මන් විධානය                      |
| ---------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React යෙදුම් සඳහා AI-සහාය i18n සැකසුම                 | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ගොනු පරිවර්තනය කරන්න    | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions හි ස්වයංක්‍රීය පරිවර්තන pipeline       | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ගතික අන්තර්ගතය සඳහා runtime පරිවර්තනය                 | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrappers නොමැතිව build-time React ප්‍රාදේශීයකරණය | `withLingo()` plugin               |

---

### Lingo.dev MCP

React යෙදුම් වල i18n පිහිටුවීම දන්නා ලෙස දෝෂ සහිත වේ - පළපුරුදු සංවර්ධකයින්ට පවා. AI කේතන සහායකයින් එය වඩාත් නරක කරයි: ඔවුන් නොපවතින API මායාවන් නිර්මාණය කරයි, middleware වින්‍යාසයන් අමතක කරයි, routing බිඳ දමයි, හෝ අතරමං වීමට පෙර අර්ධ විසඳුමක් ක්‍රියාත්මක කරයි. ගැටලුව නම් i18n පිහිටුවීම සඳහා බහු ගොනු හරහා (routing, middleware, components, configuration) සම්බන්ධීකරණය කළ වෙනස්කම් වල නිශ්චිත අනුපිළිවෙලක් අවශ්‍ය වන අතර, LLM එම සන්දර්භය පවත්වා ගැනීමට අරගල කරයි.

Lingo.dev MCP මෙය විසඳන්නේ AI සහායකයින්ට framework-විශේෂිත i18n දැනුම වෙත ව්‍යුහගත ප්‍රවේශය ලබා දීමෙනි. අනුමාන කිරීම වෙනුවට, ඔබේ සහායක Next.js, React Router සහ TanStack Start සඳහා සත්‍යාපිත ක්‍රියාත්මක රටා අනුගමනය කරයි.

**සහාය දක්වන IDE:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**සහාය දක්වන frameworks:**

- Next.js (App Router සහ Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**භාවිතය:**

ඔබේ IDE හි MCP server වින්‍යාස කිරීමෙන් පසු ([quickstart මාර්ගෝපදේශ බලන්න](https://lingo.dev/en/mcp)), ඔබේ සහායකට prompt කරන්න:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

සහායක:

1. Locale-පාදක routing වින්‍යාස කරයි (උදා., `/en`, `/es`, `/pt-BR`)
2. භාෂා මාරු components පිහිටුවයි
3. ස්වයංක්‍රීය locale හඳුනාගැනීම ක්‍රියාත්මක කරයි
4. අවශ්‍ය වින්‍යාස ගොනු ජනනය කරයි

**සටහන:** AI-සහාය කේත ජනනය අ-නිර්ණායක වේ. commit කිරීමට පෙර ජනනය කළ කේතය සමාලෝචනය කරන්න.

[ලේඛන කියවන්න →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

පරිවර්තන සමමුහුර්තව තබා ගැනීම කම්මැලි කාර්යයකි. ඔබ නව string එකක් එකතු කරයි, එය පරිවර්තනය කිරීමට අමතක කරයි, ජාත්‍යන්තර පරිශීලකයින්ට බිඳුණු UI ship කරයි. නැතහොත් ඔබ පරිවර්තකයින්ට JSON ගොනු යවයි, දින ගණනක් බලා සිටියි, පසුව ඔවුන්ගේ වැඩ අතින් නැවත ඒකාබද්ධ කරයි. භාෂා 10+ දක්වා පරිමාණය කිරීම යනු නිරන්තරයෙන් සමමුහුර්තයෙන් ඉවත් වන ගොනු සිය ගණනක් කළමනාකරණය කිරීමයි.

Lingo.dev CLI මෙය ස්වයංක්‍රීය කරයි. ඔබේ පරිවර්තන ගොනු වෙත එය යොමු කරන්න, එක් විධානයක් ධාවනය කරන්න, සහ සෑම locale එකක්ම යාවත්කාලීන වේ. Lockfile එකක් දැනටමත් පරිවර්තනය කර ඇති දේ ලුහුබඳී, එබැවින් ඔබ නව හෝ වෙනස් කළ අන්තර්ගතය සඳහා පමණක් ගෙවයි. JSON, YAML, CSV, PO ගොනු සහ markdown සඳහා සහාය දක්වයි.

**ස්ථාපනය:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**එය ක්‍රියා කරන ආකාරය:**

1. වින්‍යාසගත ගොනු වලින් පරිවර්තනය කළ හැකි අන්තර්ගතය උකහා ගනී
2. පරිවර්තනය සඳහා අන්තර්ගතය LLM සපයන්නා වෙත යවයි
3. පරිවර්තනය කළ අන්තර්ගතය ගොනු පද්ධතියට නැවත ලියයි
4. සම්පූර්ණ කළ පරිවර්තන නිරීක්ෂණය කිරීමට `i18n.lock` ගොනුව නිර්මාණය කරයි (අතිරික්ත සැකසීම වළක්වයි)

**වින්‍යාසය:**

`init` විධානය `i18n.json` ගොනුවක් ජනනය කරයි. locales සහ buckets වින්‍යාස කරන්න:

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

`provider` ක්ෂේත්‍රය විකල්ප වේ (පෙරනිමියෙන් Lingo.dev Engine වෙත). අභිරුචි LLM සපයන්නන් සඳහා:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**සහාය දක්වන LLM සපයන්නන්:**

- Lingo.dev Engine (නිර්දේශිතයි)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ලේඛන කියවන්න →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

පරිවර්තන යනු සැමවිටම "පාහේ සම්පූර්ණ" වූ විශේෂාංගයයි. ඉංජිනේරුවන් locales යාවත්කාලීන නොකර කේතය ඒකාබද්ධ කරයි. QA විසින් staging හි අතුරුදහන් පරිවර්තන හඳුනාගනී - නැතහොත් වඩාත් නරකයි, පරිශීලකයින් production හි ඒවා හඳුනාගනී. මූල හේතුව: පරිවර්තනය යනු කාල සීමා පීඩනය යටතේ මඟ හැරීමට පහසු අතින් සිදු කරන පියවරකි.

Lingo.dev CI/CD පරිවර්තන ස්වයංක්‍රීය කරයි. සෑම push එකකම පරිවර්තනය ක්‍රියාත්මක වේ. අතුරුදහන් strings කේතය production වෙත ළඟා වීමට පෙර පුරවනු ලැබේ. විනය අවශ්‍ය නැත - pipeline එය හසුරුවයි.

**සහාය දක්වන වේදිකා:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions ස්ථාපනය:**

`.github/workflows/translate.yml` නිර්මාණය කරන්න:

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

**ස්ථාපන අවශ්‍යතා:**

1. repository secrets වෙත `LINGODOTDEV_API_KEY` එක් කරන්න (Settings > Secrets and variables > Actions)
2. PR workflows සඳහා: Settings > Actions > General හි "Allow GitHub Actions to create and approve pull requests" සබල කරන්න

**Workflow විකල්ප:**

පරිවර්තන සෘජුවම commit කරන්න:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

පරිවර්තන සමඟ pull requests සාදන්න:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ලබා ගත හැකි inputs:**

| Input                | පෙරනිමි                                        | විස්තරය                              |
| -------------------- | ---------------------------------------------- | ------------------------------------ |
| `api-key`            | (අවශ්‍යයි)                                     | Lingo.dev API යතුර                   |
| `pull-request`       | `false`                                        | සෘජුවම commit කිරීම වෙනුවට PR සාදන්න |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | අභිරුචි commit පණිවිඩය               |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | අභිරුචි PR මාතෘකාව                   |
| `working-directory`  | `"."`                                          | ධාවනය කිරීමට directory එක            |
| `parallel`           | `false`                                        | සමාන්තර සැකසීම සක්‍රීය කරන්න         |

[ලේඛන කියවන්න →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

UI labels සඳහා ස්ථිතික පරිවර්තන ගොනු ක්‍රියා කරයි, නමුත් පරිශීලක-ජනනය කළ අන්තර්ගතය ගැන කුමක් කිව හැකිද? චැට් පණිවිඩ, නිෂ්පාදන විස්තර, සහාය ටිකට් - build time එකේදී නොපවතින අන්තර්ගතය පෙර-පරිවර්තනය කළ නොහැක. ඔබට පරිවර්තනය නොකළ පෙළ පෙන්වීමට හෝ අභිරුචි පරිවර්තන pipeline එකක් ගොඩනැගීමට සිදුවේ.

Lingo.dev SDK runtime එකේදී අන්තර්ගතය පරිවර්තනය කරයි. ඕනෑම පෙළක්, වස්තුවක් හෝ HTML එකක් යවන්න සහ දේශීයකරණය කළ අනුවාදයක් ආපසු ලබා ගන්න. තත්‍ය-කාලීන චැට්, ගතික දැනුම්දීම් හෝ deployment එකෙන් පසු පැමිණෙන ඕනෑම අන්තර්ගතයක් සඳහා ක්‍රියා කරයි. JavaScript, PHP, Python සහ Ruby සඳහා ලබා ගත හැක.

**ස්ථාපනය:**

```bash
npm install lingo.dev
```

**භාවිතය:**

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

**ලබා ගත හැකි SDKs:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ලේඛන කියවන්න →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

සාම්ප්‍රදායික i18n ආක්‍රමණශීලී වේ. ඔබ සෑම string එකක්ම `t()` functions වලින් ඔතා, පරිවර්තන යතුරු නිර්මාණය කර (`home.hero.title.v2`), සමාන්තර JSON ගොනු නඩත්තු කර, ඔබේ components දේශීයකරණ boilerplate සමඟ විශාල වන ආකාරය නරඹයි. එය කෙතරම් කම්මැලි කාර්යයක්ද යත්, කණ්ඩායම් ජාත්‍යන්තරකරණය එය විශාල refactor එකක් බවට පත්වන තෙක් ප්‍රමාද කරයි.

Lingo.dev Compiler උත්සවය ඉවත් කරයි. සරල ඉංග්‍රීසි පාඨයෙන් React සංරචක ලියන්න. සම්පාදකය ගොඩනැගීමේ කාලයේදී පරිවර්තනය කළ හැකි තන්තු හඳුනාගෙන ස්වයංක්‍රීයව දේශීයකරණය කළ ප්‍රභේද ජනනය කරයි. යතුරු නැත, JSON ගොනු නැත, ආවරණ ශ්‍රිත නැත - බහු භාෂාවලින් ක්‍රියා කරන React කේතය පමණි.

**ස්ථාපනය:**

```bash
pnpm install @lingo.dev/compiler
```

**සත්‍යාපනය:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**වින්‍යාසය (Next.js):**

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

**වින්‍යාසය (Vite):**

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

**සපයන්නා සැකසීම:**

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

**භාෂා මාරුකරු:**

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

**සංවර්ධනය:** `npm run dev` (ව්‍යාජ පරිවර්තකය භාවිතා කරයි, API ඇමතුම් නැත)

**නිෂ්පාදනය:** `usePseudotranslator: false` සකසන්න, පසුව `next build`

`.lingo/` නාමාවලිය අනුවාද පාලනයට commit කරන්න.

**ප්‍රධාන විශේෂාංග:**

- ධාවන කාල කාර්ය සාධන පිරිවැය ශුන්‍යයි
- පරිවර්තන යතුරු හෝ JSON ගොනු නැත
- `t()` ශ්‍රිත හෝ `<T>` ආවරණ සංරචක නැත
- JSX හි පරිවර්තනය කළ හැකි පාඨයේ ස්වයංක්‍රීය හඳුනාගැනීම
- TypeScript සහාය
- බහු වචන සඳහා ICU MessageFormat
- `data-lingo-override` ගුණාංගය හරහා අතින් අභිබවා යාම
- ඇතුළත් පරිවර්තන සංස්කාරක විජට්

**ගොඩනැගීමේ ප්‍රකාරයන්:**

- `pseudotranslator`: ස්ථාන දරණ පරිවර්තන සහිත සංවර්ධන ප්‍රකාරය (API පිරිවැය නැත)
- `real`: LLM භාවිතයෙන් සැබෑ පරිවර්තන ජනනය කරන්න
- `cache-only`: CI වෙතින් පෙර-ජනනය කළ පරිවර්තන භාවිතා කරන නිෂ්පාදන ප්‍රකාරය (API ඇමතුම් නැත)

**සහාය දක්වන රාමු:**

- Next.js (React Server Components සමඟ App Router)
- Vite + React (SPA සහ SSR)

අතිරේක රාමු සහාය සැලසුම් කර ඇත.

[ලේඛන කියවන්න →](https://lingo.dev/en/compiler)

---

## දායකත්වය

දායකත්වයන් සාදරයෙන් පිළිගනිමු. කරුණාකර මෙම මාර්ගෝපදේශ අනුගමනය කරන්න:

1. **ගැටළු:** [දෝෂ වාර්තා කරන්න හෝ විශේෂාංග ඉල්ලන්න](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [වෙනස්කම් ඉදිරිපත් කරන්න](https://github.com/lingodotdev/lingo.dev/pulls)
   - සෑම PR එකකටම changeset එකක් අවශ්‍යයි: `pnpm new` (හෝ නිකුතුවට අදාළ නොවන වෙනස්කම් සඳහා `pnpm new:empty`)
   - ඉදිරිපත් කිරීමට පෙර පරීක්ෂණ සාර්ථක වන බව සහතික කරන්න
3. **සංවර්ධනය:** මෙය pnpm + turborepo monorepo එකකි
   - dependencies ස්ථාපනය කරන්න: `pnpm install`
   - පරීක්ෂණ ධාවනය කරන්න: `pnpm test`
   - Build කරන්න: `pnpm build`

**සහාය:** [Discord ප්‍රජාව](https://lingo.dev/go/discord)

## තරු ඉතිහාසය

Lingo.dev ප්‍රයෝජනවත් නම්, අපට තරුවක් ලබා දී තරු 10,000ක් කරා ළඟා වීමට අපට උදව් කරන්න!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## දේශීයකරණය කළ ප්‍රලේඛනය

**ලබා ගත හැකි පරිවර්තන:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**නව භාෂාවක් එකතු කිරීම:**

1. [BCP-47 ආකෘතිය](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) භාවිතයෙන් [`i18n.json`](./i18n.json) වෙත locale කේතය එකතු කරන්න
2. Pull request එකක් ඉදිරිපත් කරන්න

**BCP-47 locale ආකෘතිය:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- උදාහරණ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
