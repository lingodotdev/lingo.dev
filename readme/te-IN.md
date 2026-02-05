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
    Lingo.dev - LLM-ఆధారిత స్థానికీకరణ కోసం ఓపెన్-సోర్స్ i18n టూల్‌కిట్
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

## త్వరిత ప్రారంభం

| టూల్                               | వినియోగ సందర్భం                                    | త్వరిత కమాండ్                      |
| ---------------------------------- | -------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React యాప్‌ల కోసం AI-సహాయక i18n సెటప్              | ప్రాంప్ట్: `Set up i18n`           |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ఫైల్స్ అనువదించండి   | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions లో ఆటోమేటెడ్ అనువాద పైప్‌లైన్       | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | డైనమిక్ కంటెంట్ కోసం రన్‌టైమ్ అనువాదం              | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n రాపర్స్ లేకుండా బిల్డ్-టైమ్ React స్థానికీకరణ | `withLingo()` ప్లగిన్              |

---

### Lingo.dev MCP

React యాప్‌లలో i18n సెటప్ చేయడం అనుభవజ్ఞులైన డెవలపర్‌లకు కూడా లోపాలకు గురయ్యే పనిగా ఉంటుంది. AI కోడింగ్ అసిస్టెంట్‌లు దీన్ని మరింత దిగజార్చుతాయి: అవి ఉనికిలో లేని APIలను హాలూసినేట్ చేస్తాయి, మిడిల్‌వేర్ కాన్ఫిగరేషన్‌లను మర్చిపోతాయి, రూటింగ్‌ను విచ్ఛిన్నం చేస్తాయి, లేదా కాంటెక్స్ట్ కోల్పోయే ముందు సగం సొల్యూషన్‌ను ఇంప్లిమెంట్ చేస్తాయి. సమస్య ఏమిటంటే, i18n సెటప్‌కు బహుళ ఫైల్స్ (రూటింగ్, మిడిల్‌వేర్, కాంపోనెంట్‌లు, కాన్ఫిగరేషన్) అంతటా సమన్వయ మార్పుల యొక్క ఖచ్చితమైన క్రమం అవసరం, మరియు LLMలు ఆ కాంటెక్స్ట్‌ను నిర్వహించడంలో ఇబ్బంది పడతాయి.

Lingo.dev MCP AI అసిస్టెంట్‌లకు ఫ్రేమ్‌వర్క్-స్పెసిఫిక్ i18n నాలెడ్జ్‌కు స్ట్రక్చర్డ్ యాక్సెస్ ఇవ్వడం ద్వారా దీన్ని పరిష్కరిస్తుంది. అంచనా వేయడానికి బదులుగా, మీ అసిస్టెంట్ Next.js, React Router మరియు TanStack Start కోసం వెరిఫైడ్ ఇంప్లిమెంటేషన్ ప్యాటర్న్‌లను అనుసరిస్తుంది.

**సపోర్ట్ చేయబడిన IDEలు:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**సపోర్ట్ చేయబడిన ఫ్రేమ్‌వర్క్‌లు:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**వినియోగం:**

మీ IDEలో MCP సర్వర్‌ను కాన్ఫిగర్ చేసిన తర్వాత ([క్విక్‌స్టార్ట్ గైడ్‌లు చూడండి](https://lingo.dev/en/mcp)), మీ అసిస్టెంట్‌ను ప్రాంప్ట్ చేయండి:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

అసిస్టెంట్ ఇలా చేస్తుంది:

1. లొకేల్-బేస్డ్ రూటింగ్‌ను కాన్ఫిగర్ చేస్తుంది (ఉదా., `/en`, `/es`, `/pt-BR`)
2. లాంగ్వేజ్ స్విచింగ్ కాంపోనెంట్‌లను సెటప్ చేస్తుంది
3. ఆటోమేటిక్ లొకేల్ డిటెక్షన్‌ను ఇంప్లిమెంట్ చేస్తుంది
4. అవసరమైన కాన్ఫిగరేషన్ ఫైల్స్‌ను జనరేట్ చేస్తుంది

**గమనిక:** AI-అసిస్టెడ్ కోడ్ జనరేషన్ నాన్-డిటర్మినిస్టిక్. కమిట్ చేయడానికి ముందు జనరేట్ చేసిన కోడ్‌ను రివ్యూ చేయండి.

[డాక్స్ చదవండి →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

అనువాదాలను సింక్‌లో ఉంచడం శ్రమతో కూడుకున్నది. మీరు కొత్త స్ట్రింగ్ జోడిస్తారు, దాన్ని అనువదించడం మర్చిపోతారు, అంతర్జాతీయ వినియోగదారులకు విచ్ఛిన్నమైన UIని షిప్ చేస్తారు. లేదా మీరు అనువాదకులకు JSON ఫైల్స్ పంపుతారు, రోజుల పాటు వేచి ఉంటారు, తర్వాత వారి పనిని మాన్యువల్‌గా తిరిగి మెర్జ్ చేస్తారు. 10+ భాషలకు స్కేల్ చేయడం అంటే నిరంతరం సింక్ నుండి డ్రిఫ్ట్ అయ్యే వందలాది ఫైల్స్‌ను నిర్వహించడం.

Lingo.dev CLI దీన్ని ఆటోమేట్ చేస్తుంది. మీ అనువాద ఫైల్స్ వైపు పాయింట్ చేయండి, ఒక కమాండ్ రన్ చేయండి, మరియు ప్రతి లొకేల్ అప్‌డేట్ అవుతుంది. లాక్‌ఫైల్ ఇప్పటికే అనువదించబడిన వాటిని ట్రాక్ చేస్తుంది, కాబట్టి మీరు కొత్త లేదా మార్చబడిన కంటెంట్ కోసం మాత్రమే చెల్లిస్తారు. JSON, YAML, CSV, PO ఫైల్స్ మరియు markdown సపోర్ట్ చేస్తుంది.

**సెటప్:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ఇది ఎలా పనిచేస్తుంది:**

1. కాన్ఫిగర్ చేసిన ఫైల్స్ నుండి అనువదించదగిన కంటెంట్‌ను సేకరిస్తుంది
2. అనువాదం కోసం కంటెంట్‌ను LLM ప్రొవైడర్‌కు పంపుతుంది
3. అనువదించిన కంటెంట్‌ను తిరిగి ఫైల్‌సిస్టమ్‌కు వ్రాస్తుంది
4. పూర్తయిన అనువాదాలను ట్రాక్ చేయడానికి `i18n.lock` ఫైల్‌ను సృష్టిస్తుంది (అనవసర ప్రాసెసింగ్‌ను నివారిస్తుంది)

**కాన్ఫిగరేషన్:**

`init` కమాండ్ `i18n.json` ఫైల్‌ను జనరేట్ చేస్తుంది. లొకేల్స్ మరియు బకెట్‌లను కాన్ఫిగర్ చేయండి:

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

`provider` ఫీల్డ్ ఐచ్ఛికం (డిఫాల్ట్‌గా Lingo.dev Engine). కస్టమ్ LLM ప్రొవైడర్ల కోసం:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**సపోర్ట్ చేయబడిన LLM ప్రొవైడర్లు:**

- Lingo.dev Engine (సిఫార్సు చేయబడింది)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[డాక్స్ చదవండి →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

అనువాదాలు ఎల్లప్పుడూ "దాదాపు పూర్తయింది" అనే ఫీచర్. ఇంజనీర్లు లొకేల్స్‌ను అప్‌డేట్ చేయకుండా కోడ్‌ను మెర్జ్ చేస్తారు. QA స్టేజింగ్‌లో తప్పిపోయిన అనువాదాలను గుర్తిస్తుంది - లేదా అధ్వాన్నంగా, యూజర్లు వాటిని ప్రొడక్షన్‌లో గుర్తిస్తారు. మూల కారణం: అనువాదం అనేది డెడ్‌లైన్ ప్రెజర్‌లో స్కిప్ చేయడం సులభమైన మాన్యువల్ స్టెప్.

Lingo.dev CI/CD అనువాదాలను ఆటోమేటిక్‌గా చేస్తుంది. ప్రతి పుష్ అనువాదాన్ని ట్రిగ్గర్ చేస్తుంది. తప్పిపోయిన స్ట్రింగ్స్ కోడ్ ప్రొడక్షన్‌కు చేరుకునే ముందే పూరించబడతాయి. క్రమశిక్షణ అవసరం లేదు - పైప్‌లైన్ దానిని నిర్వహిస్తుంది.

**సపోర్ట్ చేయబడిన ప్లాట్‌ఫారమ్‌లు:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions సెటప్:**

`.github/workflows/translate.yml` సృష్టించండి:

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

**సెటప్ అవసరాలు:**

1. రిపోజిటరీ సీక్రెట్స్‌కు `LINGODOTDEV_API_KEY` జోడించండి (Settings > Secrets and variables > Actions)
2. PR వర్క్‌ఫ్లోల కోసం: Settings > Actions > General లో "Allow GitHub Actions to create and approve pull requests" ఎనేబుల్ చేయండి

**వర్క్‌ఫ్లో ఆప్షన్స్:**

అనువాదాలను నేరుగా కమిట్ చేయండి:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

అనువాదాలతో పుల్ రిక్వెస్ట్‌లను క్రియేట్ చేయండి:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**అందుబాటులో ఉన్న ఇన్‌పుట్‌లు:**

| ఇన్‌పుట్             | డిఫాల్ట్                                       | వివరణ                                           |
| -------------------- | ---------------------------------------------- | ----------------------------------------------- |
| `api-key`            | (అవసరం)                                        | Lingo.dev API కీ                                |
| `pull-request`       | `false`                                        | నేరుగా కమిట్ చేయడానికి బదులు PR క్రియేట్ చేయండి |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | కస్టమ్ కమిట్ మెసేజ్                             |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | కస్టమ్ PR టైటిల్                                |
| `working-directory`  | `"."`                                          | రన్ చేయడానికి డైరెక్టరీ                         |
| `parallel`           | `false`                                        | పారలెల్ ప్రాసెసింగ్‌ను ఎనేబుల్ చేయండి           |

[డాక్స్ చదవండి →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

UI లేబుల్స్ కోసం స్టాటిక్ అనువాద ఫైల్స్ పని చేస్తాయి, కానీ యూజర్-జనరేటెడ్ కంటెంట్ గురించి ఏమిటి? చాట్ మెసేజ్‌లు, ప్రొడక్ట్ వివరణలు, సపోర్ట్ టికెట్లు - బిల్డ్ టైమ్‌లో ఉనికిలో లేని కంటెంట్‌ను ప్రీ-ట్రాన్స్‌లేట్ చేయలేము. మీరు అనువదించని టెక్స్ట్‌ను చూపించడం లేదా కస్టమ్ అనువాద పైప్‌లైన్‌ను నిర్మించడంలో చిక్కుకుపోతారు.

Lingo.dev SDK రన్‌టైమ్‌లో కంటెంట్‌ను అనువదిస్తుంది. ఏదైనా టెక్స్ట్, ఆబ్జెక్ట్ లేదా HTMLను పాస్ చేయండి మరియు లోకలైజ్డ్ వెర్షన్‌ను తిరిగి పొందండి. రియల్-టైమ్ చాట్, డైనమిక్ నోటిఫికేషన్లు లేదా డిప్లాయ్‌మెంట్ తర్వాత వచ్చే ఏదైనా కంటెంట్ కోసం పని చేస్తుంది. JavaScript, PHP, Python మరియు Ruby కోసం అందుబాటులో ఉంది.

**ఇన్‌స్టాలేషన్:**

```bash
npm install lingo.dev
```

**ఉపయోగం:**

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

**అందుబాటులో ఉన్న SDKలు:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - వెబ్ యాప్‌లు, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[డాక్స్ చదవండి →](https://lingo.dev/en/sdk)

---

### Lingo.dev కంపైలర్

సాంప్రదాయ i18n ఇన్వేసివ్‌గా ఉంటుంది. మీరు ప్రతి స్ట్రింగ్‌ను `t()` ఫంక్షన్లలో wrap చేస్తారు, అనువాద కీలను (`home.hero.title.v2`) ఇన్వెంట్ చేస్తారు, పారలెల్ JSON ఫైల్స్‌ను మెయింటెయిన్ చేస్తారు మరియు మీ కాంపోనెంట్లు లోకలైజేషన్ బాయిలర్‌ప్లేట్‌తో bloat అవడం చూస్తారు. ఇది చాలా టెడియస్‌గా ఉంటుంది కాబట్టి టీమ్‌లు ఇంటర్నేషనలైజేషన్‌ను అది మాసివ్ రీఫాక్టర్‌గా మారే వరకు ఆలస్యం చేస్తాయి.

Lingo.dev కంపైలర్ సంప్రదాయాన్ని తొలగిస్తుంది. సాధారణ ఆంగ్ల టెక్స్ట్‌తో React కాంపోనెంట్‌లను రాయండి. కంపైలర్ బిల్డ్ టైమ్‌లో అనువదించదగిన స్ట్రింగ్‌లను గుర్తించి, స్వయంచాలకంగా స్థానికీకరించిన వేరియంట్‌లను జనరేట్ చేస్తుంది. కీలు లేవు, JSON ఫైల్స్ లేవు, రాపర్ ఫంక్షన్‌లు లేవు - బహుళ భాషలలో పనిచేసే React కోడ్ మాత్రమే.

**ఇన్‌స్టాలేషన్:**

```bash
pnpm install @lingo.dev/compiler
```

**ప్రామాణీకరణ:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**కాన్ఫిగరేషన్ (Next.js):**

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

**కాన్ఫిగరేషన్ (Vite):**

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

**ప్రొవైడర్ సెటప్:**

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

**లాంగ్వేజ్ స్విచర్:**

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

**డెవలప్‌మెంట్:** `npm run dev` (సూడోట్రాన్స్‌లేటర్‌ను ఉపయోగిస్తుంది, API కాల్స్ లేవు)

**ప్రొడక్షన్:** `usePseudotranslator: false` సెట్ చేయండి, తర్వాత `next build`

`.lingo/` డైరెక్టరీని వెర్షన్ కంట్రోల్‌కు కమిట్ చేయండి.

**ముఖ్య ఫీచర్లు:**

- జీరో రన్‌టైమ్ పెర్ఫార్మెన్స్ కాస్ట్
- అనువాద కీలు లేదా JSON ఫైల్స్ లేవు
- `t()` ఫంక్షన్‌లు లేదా `<T>` రాపర్ కాంపోనెంట్‌లు లేవు
- JSXలో అనువదించదగిన టెక్స్ట్ యొక్క స్వయంచాలక గుర్తింపు
- TypeScript సపోర్ట్
- బహువచనాల కోసం ICU MessageFormat
- `data-lingo-override` అట్రిబ్యూట్ ద్వారా మాన్యువల్ ఓవర్‌రైడ్‌లు
- బిల్ట్-ఇన్ అనువాద ఎడిటర్ విడ్జెట్

**బిల్డ్ మోడ్‌లు:**

- `pseudotranslator`: ప్లేస్‌హోల్డర్ అనువాదాలతో డెవలప్‌మెంట్ మోడ్ (API ఖర్చులు లేవు)
- `real`: LLMలను ఉపయోగించి వాస్తవ అనువాదాలను జనరేట్ చేయండి
- `cache-only`: CIలో ముందుగా జనరేట్ చేసిన అనువాదాలను ఉపయోగించి ప్రొడక్షన్ మోడ్ (API కాల్స్ లేవు)

**సపోర్ట్ చేయబడిన ఫ్రేమ్‌వర్క్‌లు:**

- Next.js (React Server Components తో App Router)
- Vite + React (SPA మరియు SSR)

అదనపు ఫ్రేమ్‌వర్క్ సపోర్ట్ ప్లాన్ చేయబడింది.

[డాక్స్ చదవండి →](https://lingo.dev/en/compiler)

---

## సహకారం

సహకారాన్ని స్వాగతిస్తున్నాము. దయచేసి ఈ మార్గదర్శకాలను అనుసరించండి:

1. **సమస్యలు:** [బగ్‌లను నివేదించండి లేదా ఫీచర్‌లను అభ్యర్థించండి](https://github.com/lingodotdev/lingo.dev/issues)
2. **పుల్ రిక్వెస్ట్‌లు:** [మార్పులను సబ్మిట్ చేయండి](https://github.com/lingodotdev/lingo.dev/pulls)
   - ప్రతి PR కి చేంజ్‌సెట్ అవసరం: `pnpm new` (లేదా రిలీజ్ కాని మార్పులకు `pnpm new:empty`)
   - సబ్మిట్ చేసే ముందు టెస్ట్‌లు పాస్ అవుతున్నాయని నిర్ధారించుకోండి
3. **డెవలప్‌మెంట్:** ఇది pnpm + turborepo మోనోరెపో
   - డిపెండెన్సీలను ఇన్‌స్టాల్ చేయండి: `pnpm install`
   - టెస్ట్‌లను రన్ చేయండి: `pnpm test`
   - బిల్డ్: `pnpm build`

**సపోర్ట్:** [Discord కమ్యూనిటీ](https://lingo.dev/go/discord)

## స్టార్ హిస్టరీ

Lingo.dev మీకు ఉపయోగకరంగా ఉంటే, మాకు స్టార్ ఇవ్వండి మరియు 10,000 స్టార్‌లను చేరుకోవడంలో మాకు సహాయం చేయండి!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## స్థానికీకరించిన డాక్యుమెంటేషన్

**అందుబాటులో ఉన్న అనువాదాలు:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**కొత్త భాషను జోడించడం:**

1. [`i18n.json`](./i18n.json) కి [BCP-47 ఫార్మాట్](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ఉపయోగించి లొకేల్ కోడ్‌ను జోడించండి
2. పుల్ రిక్వెస్ట్‌ను సబ్మిట్ చేయండి

**BCP-47 లొకేల్ ఫార్మాట్:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (చిన్న అక్షరాలు): `en`, `zh`, `bho`
- `Script`: ISO 15924 (టైటిల్ కేస్): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (పెద్ద అక్షరాలు): `US`, `CN`, `IN`
- ఉదాహరణలు: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
