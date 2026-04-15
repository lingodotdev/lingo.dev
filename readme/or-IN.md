<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନିୟରିଂ ପ୍ଲାଟଫର୍ମ"
    />
  </a>
</p>

<p align="center">
  <strong>
    ମୁକ୍ତ-ଉତ୍ସ ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନିୟରିଂ ଉପକରଣ। ସୁସଙ୍ଗତ, ଗୁଣବତ୍ତା ଅନୁବାଦ ପାଇଁ
    Lingo.dev ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନିୟରିଂ ପ୍ଲାଟଫର୍ମ ସହ ସଂଯୋଗ କରନ୍ତୁ।
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React ପାଇଁ Lingo Compiler (ପ୍ରାରମ୍ଭିକ ଆଲଫା)</a>
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

| ଉପକରଣ                                              | ଏହା କ'ଣ କରେ                                           | ଶୀଘ୍ର କମାଣ୍ଡ                       |
| -------------------------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React ଆପ୍ ପାଇଁ AI-ସହାୟିତ i18n ସେଟଅପ୍                  | ପ୍ରମ୍ପଟ୍: `Set up i18n`            |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ଫାଇଲ୍ ସ୍ଥାନୀୟକରଣ କରନ୍ତୁ | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions ରେ ନିରନ୍ତର ସ୍ଥାନୀୟକରଣ                  | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n ରାପର୍ ବିନା ବିଲ୍ଡ-ଟାଇମ୍ React ସ୍ଥାନୀୟକରଣ          | `withLingo()` ପ୍ଲଗଇନ୍              |

### ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନ୍

ଏହି ଉପକରଣଗୁଡ଼ିକ [ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନ୍](https://lingo.dev) ସହ ସଂଯୁକ୍ତ ହୁଅନ୍ତି – ଆପଣ Lingo.dev ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନିୟରିଂ ପ୍ଲାଟଫର୍ମରେ ସୃଷ୍ଟି କରୁଥିବା ସ୍ଥିତିଶୀଳ ଅନୁବାଦ API। ପ୍ରତ୍ୟେକ ଇଞ୍ଜିନ୍ ପ୍ରତ୍ୟେକ ଅନୁରୋଧରେ ଶବ୍ଦକୋଷ, ବ୍ରାଣ୍ଡ ସ୍ୱର, ଏବଂ ଲୋକେଲ୍-ନିର୍ଦ୍ଦିଷ୍ଟ ନିର୍ଦ୍ଦେଶାବଳୀ ବଜାୟ ରଖେ, [ପରିଭାଷା ତ୍ରୁଟି 16.6–44.6% ହ୍ରାସ କରେ](https://lingo.dev/research/retrieval-augmented-localization)। କିମ୍ବା [ନିଜର LLM ଆଣନ୍ତୁ](#lingodev-cli)।

---

### Lingo.dev MCP

React ଆପ୍‌ରେ i18n ସେଟଅପ୍ କରିବା ତ୍ରୁଟିପ୍ରବଣ – AI କୋଡିଂ ସହାୟକମାନେ ମଧ୍ୟ ଅସ୍ତିତ୍ୱହୀନ API ସୃଷ୍ଟି କରନ୍ତି ଏବଂ ରାଉଟିଂ ଭାଙ୍ଗନ୍ତି। Lingo.dev MCP, AI ସହାୟକମାନଙ୍କୁ Next.js, React Router, ଏବଂ TanStack Start ପାଇଁ ଫ୍ରେମୱାର୍କ-ନିର୍ଦ୍ଦିଷ୍ଟ i18n ଜ୍ଞାନକୁ ସଂରଚିତ ପ୍ରବେଶ ପ୍ରଦାନ କରେ। Claude Code, Cursor, GitHub Copilot Agents, ଏବଂ Codex ସହ କାମ କରେ।

[ଡକ୍ସ୍ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ଗୋଟିଏ କମାଣ୍ଡରେ JSON, YAML, markdown, CSV, ଏବଂ PO ଫାଇଲ୍ ସ୍ଥାନୀୟକରଣ କରନ୍ତୁ। ଏକ ଲକ୍‌ଫାଇଲ୍ ପୂର୍ବରୁ ସ୍ଥାନୀୟକରଣ ହୋଇଥିବା ବିଷୟବସ୍ତୁକୁ ଟ୍ରାକ୍ କରେ – କେବଳ ନୂଆ କିମ୍ବା ପରିବର୍ତ୍ତିତ ବିଷୟବସ୍ତୁ ପ୍ରକ୍ରିୟାକୃତ ହୁଏ। Lingo.dev ରେ ଆପଣଙ୍କର ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନ୍‌କୁ ଡିଫଲ୍ଟ କରେ, କିମ୍ବା ନିଜର LLM ଆଣନ୍ତୁ (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)।

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

ଆପଣଙ୍କ ପାଇପଲାଇନରେ ନିରନ୍ତର ସ୍ଥାନୀୟକରଣ। ପ୍ରତ୍ୟେକ ପୁସ୍ ସ୍ଥାନୀୟକରଣକୁ ଟ୍ରିଗର କରେ – କୋଡ୍ ପ୍ରଡକ୍ସନରେ ପହଞ୍ଚିବା ପୂର୍ବରୁ ନିଖୋଜ ଷ୍ଟ୍ରିଂଗୁଡ଼ିକ ପୂରଣ ହୋଇଯାଏ। GitHub Actions, GitLab CI/CD, ଏବଂ Bitbucket Pipelines କୁ ସମର୍ଥନ କରେ।

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

ବ୍ୟାକଏଣ୍ଡ କୋଡ୍‌ରୁ ସିଧାସଳଖ ଆପଣଙ୍କ ସ୍ଥାନୀୟକରଣ ଇଞ୍ଜିନ୍‌କୁ କଲ୍ କରନ୍ତୁ। ୱେବହୁକ୍ ଡେଲିଭରି, ଲୋକେଲ୍ ପ୍ରତି ବିଫଳତା ବିଚ୍ଛିନ୍ନତା, ଏବଂ WebSocket ମାଧ୍ୟମରେ ରିଏଲ୍-ଟାଇମ୍ ପ୍ରଗତି ସହିତ ସିଙ୍କ୍ରୋନସ୍ ଏବଂ ଏସିଙ୍କ୍ ସ୍ଥାନୀୟକରଣ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/docs/api)

---

### React ପାଇଁ Lingo Compiler (ପ୍ରାରମ୍ଭିକ ଆଲଫା)

i18n ରାପର୍ସ ବିନା ବିଲ୍ଡ-ଟାଇମ୍ React ସ୍ଥାନୀୟକରଣ। ସାଧା ଇଂରାଜୀ ଟେକ୍ସଟ୍ ସହିତ କମ୍ପୋନେଣ୍ଟ୍ ଲେଖନ୍ତୁ – କମ୍ପାଇଲର୍ ଅନୁବାଦଯୋଗ୍ୟ ଷ୍ଟ୍ରିଂଗୁଡ଼ିକୁ ଚିହ୍ନଟ କରେ ଏବଂ ବିଲ୍ଡ ସମୟରେ ସ୍ଥାନୀୟକୃତ ଭେରିଆଣ୍ଟ ସୃଷ୍ଟି କରେ। କୌଣସି ଅନୁବାଦ କୀ ନାହିଁ, JSON ଫାଇଲ୍ ନାହିଁ, `t()` ଫଙ୍କସନ୍ ନାହିଁ। Next.js (App Router) ଏବଂ Vite + React କୁ ସମର୍ଥନ କରେ।

[ଡକ୍ସ ପଢ଼ନ୍ତୁ →](https://lingo.dev/en/docs/react/compiler)

---

## ଅବଦାନ

ଅବଦାନ ସ୍ୱାଗତଯୋଗ୍ୟ। ଦୟାକରି ଏହି ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁସରଣ କରନ୍ତୁ:

1. **ଇସ୍ୟୁ:** [ବଗ୍ ରିପୋର୍ଟ କରନ୍ତୁ କିମ୍ବା ଫିଚର୍ ଅନୁରୋଧ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/issues)
2. **ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ:** [ପରିବର୍ତ୍ତନ ଦାଖଲ କରନ୍ତୁ](https://github.com/lingodotdev/lingo.dev/pulls)
   - ପ୍ରତ୍ୟେକ PR ପାଇଁ ଏକ ଚେଞ୍ଜସେଟ୍ ଆବଶ୍ୟକ: `pnpm new` (କିମ୍ବା ଅଣ-ରିଲିଜ୍ ପରିବର୍ତ୍ତନ ପାଇଁ `pnpm new:empty`)
   - ଦାଖଲ କରିବା ପୂର୍ବରୁ ନିଶ୍ଚିତ କରନ୍ତୁ ଯେ ଟେଷ୍ଟ ପାସ୍ ହେଉଛି
3. **ଡେଭଲପମେଣ୍ଟ:** ଏହା ଏକ pnpm + turborepo ମନୋରେପୋ
   - ଡିପେଣ୍ଡେନ୍ସି ଇନଷ୍ଟଲ୍ କରନ୍ତୁ: `pnpm install`
   - ଟେଷ୍ଟ ଚଲାନ୍ତୁ: `pnpm test`
   - ବିଲ୍ଡ: `pnpm build`

**ସପୋର୍ଟ:** [Discord କମ୍ୟୁନିଟି](https://lingo.dev/go/discord)

## ଷ୍ଟାର୍ ହିଷ୍ଟୋରୀ

ଯଦି Lingo.dev ଆପଣଙ୍କୁ ଉପଯୋଗୀ ଲାଗୁଛି, ଆମକୁ ଏକ ଷ୍ଟାର୍ ଦିଅନ୍ତୁ ଏବଂ ୧୦,୦୦୦ ଷ୍ଟାର୍ ପହଞ୍ଚିବାରେ ଆମକୁ ସାହାଯ୍ୟ କରନ୍ତୁ!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## ସ୍ଥାନୀୟକୃତ ଡକ୍ୟୁମେଣ୍ଟେସନ୍

**ଉପଲବ୍ଧ ଅନୁବାଦଗୁଡ଼ିକ:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**ନୂତନ ଭାଷା ଯୋଡ଼ିବା:**

1. [BCP-47 ଫର୍ମାଟ୍](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ବ୍ୟବହାର କରି [`i18n.json`](./i18n.json)ରେ ଲୋକେଲ୍ କୋଡ୍ ଯୋଡ଼ନ୍ତୁ
2. ଏକ ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ ଦାଖଲ କରନ୍ତୁ
