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
    Lingo.dev - LLM-ଚାଳିତ ଲୋକାଲାଇଜେସନ୍ ପାଇଁ ଓପନ୍-ସୋର୍ସ i18n ଟୁଲକିଟ୍
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

## ଶୀଘ୍ର ଆରମ୍ଭ

| ଟୁଲ୍                               | ବ୍ୟବହାର କେସ୍                                      | ଶୀଘ୍ର କମାଣ୍ଡ                       |
| ---------------------------------- | ------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React ଆପ୍ ପାଇଁ AI-ସହାୟକ i18n ସେଟଅପ୍               | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO ଫାଇଲ୍ ଅନୁବାଦ କରନ୍ତୁ | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions ରେ ସ୍ୱୟଂଚାଳିତ ଅନୁବାଦ ପାଇପଲାଇନ୍     | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | ଡାଇନାମିକ୍ କଣ୍ଟେଣ୍ଟ ପାଇଁ ରନଟାଇମ୍ ଅନୁବାଦ            | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n ରାପର୍ ବିନା ବିଲ୍ଡ-ଟାଇମ୍ React ଲୋକାଲାଇଜେସନ୍    | `withLingo()` plugin               |

---

### Lingo.dev MCP

React apps ରେ i18n ସେଟଅପ୍ କରିବା ଅତ୍ୟନ୍ତ ତ୍ରୁଟିପୂର୍ଣ୍ଣ - ଅଭିଜ୍ଞ ଡେଭଲପରମାନଙ୍କ ପାଇଁ ମଧ୍ୟ। AI କୋଡିଂ ଆସିଷ୍ଟାଣ୍ଟଗୁଡ଼ିକ ଏହାକୁ ଆହୁରି ଖରାପ କରିଦିଅନ୍ତି: ସେମାନେ ଅସ୍ତିତ୍ୱହୀନ APIs କୁ hallucinate କରନ୍ତି, middleware configurations ଭୁଲିଯାଆନ୍ତି, routing ଭାଙ୍ଗିଦିଅନ୍ତି, କିମ୍ବା ହଜିଯିବା ପୂର୍ବରୁ ଅଧା ସମାଧାନ implement କରନ୍ତି। ସମସ୍ୟା ହେଉଛି ଯେ i18n ସେଟଅପ୍ ଏକାଧିକ ଫାଇଲ୍ (routing, middleware, components, configuration) ମଧ୍ୟରେ ସମନ୍ୱିତ ପରିବର୍ତ୍ତନଗୁଡ଼ିକର ଏକ ସଠିକ୍ କ୍ରମ ଆବଶ୍ୟକ କରେ, ଏବଂ LLMs ସେହି context ବଜାୟ ରଖିବାରେ ସଂଘର୍ଷ କରନ୍ତି।

Lingo.dev MCP AI ଆସିଷ୍ଟାଣ୍ଟମାନଙ୍କୁ framework-specific i18n ଜ୍ଞାନକୁ structured access ଦେଇ ଏହାର ସମାଧାନ କରେ। ଅନୁମାନ କରିବା ପରିବର୍ତ୍ତେ, ଆପଣଙ୍କର ଆସିଷ୍ଟାଣ୍ଟ Next.js, React Router, ଏବଂ TanStack Start ପାଇଁ verified implementation patterns ଅନୁସରଣ କରେ।

**ସମର୍ଥିତ IDEs:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**ସମର୍ଥିତ frameworks:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**ବ୍ୟବହାର:**

ଆପଣଙ୍କର IDE ରେ MCP server କନଫିଗର୍ କରିବା ପରେ ([quickstart guides ଦେଖନ୍ତୁ](https://lingo.dev/en/mcp)), ଆପଣଙ୍କର ଆସିଷ୍ଟାଣ୍ଟକୁ prompt କରନ୍ତୁ:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

ଆସିଷ୍ଟାଣ୍ଟ କରିବ:

1. Locale-based routing କନଫିଗର୍ କରିବ (ଯଥା, `/en`, `/es`, `/pt-BR`)
2. Language switching components ସେଟଅପ୍ କରିବ
3. Automatic locale detection implement କରିବ
4. ଆବଶ୍ୟକ configuration ଫାଇଲ୍ generate କରିବ

**ଧ୍ୟାନ ଦିଅନ୍ତୁ:** AI-assisted କୋଡ୍ generation non-deterministic ଅଟେ। Commit କରିବା ପୂର୍ବରୁ generated କୋଡ୍ review କରନ୍ତୁ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ଅନୁବାଦଗୁଡ଼ିକୁ sync ରେ ରଖିବା କ୍ଲାନ୍ତିକର। ଆପଣ ଏକ ନୂଆ string ଯୋଡ଼ନ୍ତି, ଏହାକୁ ଅନୁବାଦ କରିବାକୁ ଭୁଲିଯାଆନ୍ତି, ଆନ୍ତର୍ଜାତୀୟ ବ୍ୟବହାରକାରୀଙ୍କୁ ଭଙ୍ଗା UI ship କରନ୍ତି। କିମ୍ବା ଆପଣ translators କୁ JSON ଫାଇଲ୍ ପଠାନ୍ତି, ଦିନେ ଅପେକ୍ଷା କରନ୍ତି, ତା'ପରେ manually ସେମାନଙ୍କର କାମକୁ ପୁଣି merge କରନ୍ତି। 10+ ଭାଷାକୁ scale କରିବାର ଅର୍ଥ ହେଉଛି ଶହ ଶହ ଫାଇଲ୍ manage କରିବା ଯାହା କ୍ରମାଗତ ଭାବରେ sync ବାହାରେ drift କରେ।

Lingo.dev CLI ଏହାକୁ automate କରେ। ଏହାକୁ ଆପଣଙ୍କର translation ଫାଇଲ୍ ଆଡ଼କୁ point କରନ୍ତୁ, ଗୋଟିଏ command ଚଲାନ୍ତୁ, ଏବଂ ପ୍ରତ୍ୟେକ locale update ହୁଏ। ଏକ lockfile ଟ୍ରାକ୍ କରେ କ'ଣ ପୂର୍ବରୁ ଅନୁବାଦିତ ହୋଇଛି, ତେଣୁ ଆପଣ କେବଳ ନୂଆ କିମ୍ବା ପରିବର୍ତ୍ତିତ content ପାଇଁ ଦେୟ ଦିଅନ୍ତି। JSON, YAML, CSV, PO ଫାଇଲ୍, ଏବଂ markdown କୁ support କରେ।

**ସେଟଅପ୍:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**ଏହା କିପରି କାମ କରେ:**

1. କନଫିଗର୍ କରାଯାଇଥିବା ଫାଇଲଗୁଡ଼ିକରୁ ଅନୁବାଦଯୋଗ୍ୟ କଣ୍ଟେଣ୍ଟ ବାହାର କରେ
2. ଅନୁବାଦ ପାଇଁ LLM provider କୁ କଣ୍ଟେଣ୍ଟ ପଠାଏ
3. ଅନୁବାଦିତ କଣ୍ଟେଣ୍ଟକୁ filesystem ରେ ଲେଖେ
4. ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଥିବା ଅନୁବାଦଗୁଡ଼ିକୁ ଟ୍ରାକ୍ କରିବା ପାଇଁ `i18n.lock` ଫାଇଲ୍ ସୃଷ୍ଟି କରେ (ଅନାବଶ୍ୟକ ପ୍ରକ୍ରିୟାକରଣରୁ ଦୂରେଇ ରହେ)

**କନଫିଗରେସନ୍:**

`init` କମାଣ୍ଡ ଏକ `i18n.json` ଫାଇଲ୍ ସୃଷ୍ଟି କରେ। locales ଏବଂ buckets କନଫିଗର୍ କରନ୍ତୁ:

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

`provider` ଫିଲ୍ଡ ଇଚ୍ଛାଧୀନ (ଡିଫଲ୍ଟ Lingo.dev Engine)। କଷ୍ଟମ୍ LLM providers ପାଇଁ:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**ସପୋର୍ଟ କରାଯାଉଥିବା LLM providers:**

- Lingo.dev Engine (ସୁପାରିଶ କରାଯାଏ)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

ଅନୁବାଦ ହେଉଛି ସେହି ଫିଚର୍ ଯାହା ସବୁବେଳେ "ପ୍ରାୟ ସମ୍ପୂର୍ଣ୍ଣ" ହୋଇଥାଏ। ଇଞ୍ଜିନିୟର୍‌ମାନେ locales ଅପଡେଟ୍ ନକରି କୋଡ୍ merge କରନ୍ତି। QA staging ରେ ହଜିଯାଇଥିବା ଅନୁବାଦ ଧରିଥାଏ - କିମ୍ବା ଆହୁରି ଖରାପ, ୟୁଜର୍‌ମାନେ production ରେ ସେଗୁଡ଼ିକୁ ଧରନ୍ତି। ମୂଳ କାରଣ: ଅନୁବାଦ ଏକ manual ପଦକ୍ଷେପ ଯାହା deadline pressure ରେ ଛାଡ଼ିବା ସହଜ।

Lingo.dev CI/CD ଅନୁବାଦକୁ ସ୍ୱୟଂଚାଳିତ କରେ। ପ୍ରତ୍ୟେକ push ଅନୁବାଦ ଟ୍ରିଗର୍ କରେ। କୋଡ୍ production ରେ ପହଞ୍ଚିବା ପୂର୍ବରୁ ହଜିଯାଇଥିବା strings ପୂରଣ ହୋଇଯାଏ। କୌଣସି ଅନୁଶାସନ ଆବଶ୍ୟକ ନାହିଁ - pipeline ଏହାକୁ ସମ୍ଭାଳେ।

**ସପୋର୍ଟ କରାଯାଉଥିବା platforms:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions ସେଟଅପ୍:**

`.github/workflows/translate.yml` ସୃଷ୍ଟି କରନ୍ତୁ:

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

**ସେଟଅପ୍ ଆବଶ୍ୟକତା:**

1. repository secrets ରେ `LINGODOTDEV_API_KEY` ଯୋଡ଼ନ୍ତୁ (Settings > Secrets and variables > Actions)
2. PR workflows ପାଇଁ: Settings > Actions > General ରେ "Allow GitHub Actions to create and approve pull requests" ସକ୍ଷମ କରନ୍ତୁ

**Workflow ବିକଳ୍ପଗୁଡ଼ିକ:**

ଅନୁବାଦଗୁଡ଼ିକୁ ସିଧାସଳଖ commit କରନ୍ତୁ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

ଅନୁବାଦ ସହିତ pull request ସୃଷ୍ଟି କରନ୍ତୁ:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**ଉପଲବ୍ଧ input ଗୁଡ଼ିକ:**

| Input                | Default                                        | Description                                      |
| -------------------- | ---------------------------------------------- | ------------------------------------------------ |
| `api-key`            | (ଆବଶ୍ୟକ)                                       | Lingo.dev API key                                |
| `pull-request`       | `false`                                        | ସିଧାସଳଖ commit କରିବା ପରିବର୍ତ୍ତେ PR ସୃଷ୍ଟି କରନ୍ତୁ |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | କଷ୍ଟମ୍ commit message                            |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | କଷ୍ଟମ୍ PR title                                  |
| `working-directory`  | `"."`                                          | ଚଲାଇବା ପାଇଁ ଡିରେକ୍ଟୋରୀ                           |
| `parallel`           | `false`                                        | ସମାନ୍ତରାଳ ପ୍ରକ୍ରିୟାକରଣ ସକ୍ଷମ କରନ୍ତୁ              |

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

ଷ୍ଟାଟିକ୍ ଅନୁବାଦ ଫାଇଲଗୁଡ଼ିକ UI label ପାଇଁ କାମ କରେ, କିନ୍ତୁ ବ୍ୟବହାରକାରୀ-ସୃଷ୍ଟି କଣ୍ଟେଣ୍ଟ ବିଷୟରେ କ'ଣ? ଚାଟ୍ ମେସେଜ୍, ପ୍ରଡକ୍ଟ ବର୍ଣ୍ଣନା, ସପୋର୍ଟ ଟିକେଟ୍ - ଯେଉଁ କଣ୍ଟେଣ୍ଟ build time ରେ ବିଦ୍ୟମାନ ନାହିଁ ତାହା ପୂର୍ବରୁ ଅନୁବାଦ କରାଯାଇପାରିବ ନାହିଁ। ଆପଣ ଅନୁବାଦିତ ନଥିବା ଟେକ୍ସଟ୍ ଦେଖାଇବାକୁ କିମ୍ବା କଷ୍ଟମ୍ ଅନୁବାଦ pipeline ନିର୍ମାଣ କରିବାକୁ ବାଧ୍ୟ ହୁଅନ୍ତି।

Lingo.dev SDK runtime ରେ କଣ୍ଟେଣ୍ଟ ଅନୁବାଦ କରେ। କୌଣସି ଟେକ୍ସଟ୍, object, କିମ୍ବା HTML ପାସ୍ କରନ୍ତୁ ଏବଂ ଏକ ଲୋକାଲାଇଜ୍ ହୋଇଥିବା ସଂସ୍କରଣ ଫେରାଇ ପାଆନ୍ତୁ। ରିଅଲ୍-ଟାଇମ୍ ଚାଟ୍, ଡାଇନାମିକ୍ ନୋଟିଫିକେସନ୍, କିମ୍ବା deployment ପରେ ଆସୁଥିବା କୌଣସି କଣ୍ଟେଣ୍ଟ ପାଇଁ କାମ କରେ। JavaScript, PHP, Python, ଏବଂ Ruby ପାଇଁ ଉପଲବ୍ଧ।

**ଇନଷ୍ଟଲେସନ୍:**

```bash
npm install lingo.dev
```

**ବ୍ୟବହାର:**

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

**ଉପଲବ୍ଧ SDK ଗୁଡ଼ିକ:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web apps, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

ପାରମ୍ପରିକ i18n ଆକ୍ରମଣାତ୍ମକ। ଆପଣ ପ୍ରତ୍ୟେକ string କୁ `t()` function ରେ wrap କରନ୍ତି, ଅନୁବାଦ key ଉଦ୍ଭାବନ କରନ୍ତି (`home.hero.title.v2`), ସମାନ୍ତରାଳ JSON ଫାଇଲ୍ ରକ୍ଷଣାବେକ୍ଷଣ କରନ୍ତି, ଏବଂ ଆପଣଙ୍କ component ଗୁଡ଼ିକୁ localization boilerplate ସହିତ ଫୁଲିବାର ଦେଖନ୍ତି। ଏହା ଏତେ କ୍ଲାନ୍ତିକର ଯେ ଦଳଗୁଡ଼ିକ internationalization କୁ ବିଳମ୍ବ କରନ୍ତି ଯେପର୍ଯ୍ୟନ୍ତ ଏହା ଏକ ବିରାଟ refactor ହୋଇଯାଏ।

Lingo.dev Compiler ଆନୁଷ୍ଠାନିକତାକୁ ହଟାଇଥାଏ। ସାଧା ଇଂରାଜୀ ଟେକ୍ସଟ୍ ସହିତ React components ଲେଖନ୍ତୁ। Compiler ବିଲ୍ଡ ସମୟରେ ଅନୁବାଦଯୋଗ୍ୟ strings ଚିହ୍ନଟ କରେ ଏବଂ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଲୋକାଲାଇଜ୍ଡ variants ସୃଷ୍ଟି କରେ। କୌଣସି keys ନାହିଁ, କୌଣସି JSON ଫାଇଲ୍ ନାହିଁ, କୌଣସି wrapper functions ନାହିଁ - କେବଳ React code ଯାହା ଏକାଧିକ ଭାଷାରେ କାମ କରେ।

**ଇନଷ୍ଟଲେସନ୍:**

```bash
pnpm install @lingo.dev/compiler
```

**ପ୍ରମାଣୀକରଣ:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**କନଫିଗରେସନ୍ (Next.js):**

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

**କନଫିଗରେସନ୍ (Vite):**

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

**Provider ସେଟଅପ୍:**

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

**ଭାଷା ସୁଇଚର୍:**

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

**ଡେଭଲପମେଣ୍ଟ:** `npm run dev` (pseudotranslator ବ୍ୟବହାର କରେ, କୌଣସି API calls ନାହିଁ)

**ପ୍ରଡକ୍ସନ୍:** `usePseudotranslator: false` ସେଟ୍ କରନ୍ତୁ, ତାପରେ `next build`

`.lingo/` ଡିରେକ୍ଟୋରୀକୁ version control ରେ commit କରନ୍ତୁ।

**ମୁଖ୍ୟ ବୈଶିଷ୍ଟ୍ୟଗୁଡ଼ିକ:**

- ଶୂନ୍ୟ runtime performance cost
- କୌଣସି translation keys କିମ୍ବା JSON ଫାଇଲ୍ ନାହିଁ
- କୌଣସି `t()` functions କିମ୍ବା `<T>` wrapper components ନାହିଁ
- JSX ରେ ଅନୁବାଦଯୋଗ୍ୟ ଟେକ୍ସଟ୍ର ସ୍ୱୟଂଚାଳିତ ଚିହ୍ନଟ
- TypeScript ସପୋର୍ଟ
- ବହୁବଚନ ପାଇଁ ICU MessageFormat
- `data-lingo-override` attribute ମାଧ୍ୟମରେ manual overrides
- ବିଲ୍ଟ-ଇନ୍ translation editor widget

**ବିଲ୍ଡ modes:**

- `pseudotranslator`: placeholder translations ସହିତ development mode (କୌଣସି API costs ନାହିଁ)
- `real`: LLMs ବ୍ୟବହାର କରି ପ୍ରକୃତ translations ସୃଷ୍ଟି କରେ
- `cache-only`: CI ରୁ pre-generated translations ବ୍ୟବହାର କରି production mode (କୌଣସି API calls ନାହିଁ)

**ସପୋର୍ଟେଡ୍ frameworks:**

- Next.js (React Server Components ସହିତ App Router)
- Vite + React (SPA ଏବଂ SSR)

ଅତିରିକ୍ତ framework ସପୋର୍ଟ ଯୋଜନା କରାଯାଇଛି।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/compiler)

---

## ଅବଦାନ

ଅବଦାନକୁ ସ୍ୱାଗତ। ଦୟାକରି ଏହି ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁସରଣ କରନ୍ତୁ:

1. **ସମସ୍ୟା:** [ବଗ୍ ରିପୋର୍ଟ କରନ୍ତୁ କିମ୍ବା ଫିଚର୍ ଅନୁରୋଧ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ:** [ପରିବର୍ତ୍ତନ ସବମିଟ୍ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ପ୍ରତ୍ୟେକ PR ପାଇଁ ଏକ changeset ଆବଶ୍ୟକ: `pnpm new` (କିମ୍ବା ନନ୍-ରିଲିଜ୍ ପରିବର୍ତ୍ତନ ପାଇଁ `pnpm new:empty`)
   - ସବମିଟ୍ କରିବା ପୂର୍ବରୁ ଟେଷ୍ଟ ପାସ୍ ହେବା ନିଶ୍ଚିତ କରନ୍ତୁ
3. **ଡେଭଲପମେଣ୍ଟ:** ଏହା ଏକ pnpm + turborepo monorepo
   - ଡିପେଣ୍ଡେନ୍ସି ଇନଷ୍ଟଲ୍ କରନ୍ତୁ: `pnpm install`
   - ଟେଷ୍ଟ ଚଲାନ୍ତୁ: `pnpm test`
   - ବିଲ୍ଡ: `pnpm build`

**ସପୋର୍ଟ:** [Discord କମ୍ୟୁନିଟି](https://lingo.dev/go/discord)

## ଷ୍ଟାର୍ ହିଷ୍ଟୋରୀ

ଯଦି ଆପଣ Lingo.dev କୁ ଉପଯୋଗୀ ମନେ କରନ୍ତି, ଆମକୁ ଏକ ଷ୍ଟାର୍ ଦିଅନ୍ତୁ ଏବଂ 10,000 ଷ୍ଟାର୍ ପହଞ୍ଚିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ସ୍ଥାନୀୟକୃତ ଡକ୍ୟୁମେଣ୍ଟେସନ୍

**ଉପଲବ୍ଧ ଅନୁବାଦ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ନୂତନ ଭାଷା ଯୋଡ଼ିବା:**

1. [`i18n.json`](./i18n.json) ରେ [BCP-47 ଫର୍ମାଟ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ବ୍ୟବହାର କରି ଲୋକେଲ୍ କୋଡ୍ ଯୋଡ଼ନ୍ତୁ
2. ଏକ pull request ସବମିଟ୍ କରନ୍ତୁ

**BCP-47 ଲୋକେଲ୍ ଫର୍ମାଟ:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (lowercase): `en`, `zh`, `bho`
- `Script`: ISO 15924 (title case): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (uppercase): `US`, `CN`, `IN`
- ଉଦାହରଣ: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
