<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – localization engineering platform" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev is the localization engineering platform: the best way to measure translation quality, translate with LLMs, and proofread with native speakers.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Docs</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last commit" /></a>
</p>

---

## ଟିମ୍ମାନେ Lingo.dev ଉପରେ localization engine ତିଆରି କରନ୍ତି

ଏକ [localization engine](https://lingo.dev/en/docs/platform/engines) ହେଉଛି ଏମିତି ଏକ stateful translation API, ଯାହାକୁ ଆପଣଙ୍କ ଟିମ୍ କନଫିଗର୍ କରେ ଏବଂ Lingo.dev ଚଲାଏ। ପ୍ରତ୍ୟେକ ପ୍ରୋଡକ୍ଟ, ପ୍ରତ୍ୟେକ content type, କିମ୍ବା ପ୍ରତ୍ୟେକ brand ପାଇଁ ଅଲଗା ଇଞ୍ଜିନ ତିଆରି କରିପାରିବେ। ଏକ ଇଞ୍ଜିନ ମାଧ୍ୟମରେ ଯାଇଥିବା ପ୍ରତ୍ୟେକ ଅନୁରୋଧରେ, ସେଥିରେ ଆପଣ କନଫିଗର୍ କରିଥିବା ସବୁକିଛି ନିର୍ଦ୍ଧାରିତ ପ୍ରାଥମିକତା କ୍ରମରେ ଲାଗୁ ହୁଏ:

| ସ୍ତର | ଆପଣ କଣ କନଫିଗର୍ କରନ୍ତି | ଡକ୍ସରୁ |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | ର୍ୟାଙ୍କ କରାଯାଇଥିବା fallback ସହିତ, ପ୍ରତ୍ୟେକ ଭାଷା-ଯୁଗଳକୁ କେଉଁ ମଡେଲ୍ ହାଣ୍ଡଲ୍ କରିବ | 400+ ମଡେଲ୍; ରିସ୍ପୋନ୍ସରେ ଚାଲିଥିବା ମଡେଲ୍ର ନାମ ଥାଏ |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | ପ୍ରତ୍ୟେକ ଭାଷାରେ ଆପଣଙ୍କ ପ୍ରୋଡକ୍ଟ କିପରି କଥା କହେ, ପ୍ରତ୍ୟେକ locale ପାଇଁ ଗୋଟିଏ ଟେକ୍ସ୍ଟ | ପ୍ରତ୍ୟେକ ବଜାର ପାଇଁ tone ଏବଂ formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | ସାଧାରଣ ମଡେଲ୍ ଯେଉଁ ଭାଷାଗତ ପ୍ରଚଳନଗୁଡ଼ିକୁ ଧରିପାରେନି | Spanish ରେ adjective ର ସ୍ଥାନ, percentage sign ପୂର୍ବରୁ ଗୋଟିଏ ଖାଲି ଜାଗା |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | ଅର୍ଥ ଆଧାରରେ ମେଳାଯାଇଥିବା, ପ୍ରତ୍ୟେକ locale ପାଇଁ ସଠିକ୍ term mapping | ୟୁରୋପିୟ ବଜାର ପାଇଁ "911" "112" ହୋଇଯାଏ; ପ୍ରୋଡକ୍ଟ ନାମ ଯଥାବତ୍ ରହେ |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | ପ୍ରତ୍ୟେକ ଅନୁବାଦ ପରେ ଚାଲୁଥିବା scoring | GEMBA scores, BERTScore, glossary compliance |

Glossary, ruleset, ଏବଂ Brand voice ଆପଣଙ୍କ organization ର ସମ୍ପତ୍ତି, ଏବଂ ଏକ ଇଞ୍ଜିନ ସେଗୁଡ଼ିକୁ attachment ମାଧ୍ୟମରେ ଲାଗୁ କରେ। ଗୋଟିଏ glossary ପାଞ୍ଚଟି ଇଞ୍ଜିନକୁ ନିୟନ୍ତ୍ରଣ କରିପାରେ, ଏବଂ ଗୋଟିଏ edit ସମସ୍ତ ପାଞ୍ଚଟିକୁ ପହଞ୍ଚିଯାଏ। ପରିବର୍ତ୍ତନ live ହେବା ପୂର୍ବରୁ [Playground](https://lingo.dev/en/docs/platform/playground) ରେ ଟେଷ୍ଟ କରନ୍ତୁ: ଏକ ଇଞ୍ଜିନକୁ raw model ସହିତ, କିମ୍ବା ଦୁଇଟି ଇଞ୍ଜିନକୁ ପାଖାପାଖି ତୁଳନା କରନ୍ତୁ। ଇଞ୍ଜିନଗୁଡ଼ିକ platform ରେ କନଫିଗର୍ ହୁଅନ୍ତି, ଯେଉଁଠାରେ localization team localization infrastructure ଚଲାଏ।

## କୋଡ୍ ଠାରୁ ଆପଣଙ୍କ ଇଞ୍ଜିନଗୁଡ଼ିକୁ ପହଞ୍ଚନ୍ତୁ

ଏକ repository ଭିତରର content ଅନୁବାଦ କରନ୍ତୁ। `lingo push` `.lingo/config.json` ରେ ନାମିତ ଇଞ୍ଜିନକୁ ଫାଇଲଗୁଡ଼ିକ ପଠାଏ, ଏବଂ `lingo pull` ଯେକୌଣସି machine ରୁ ଅନୁବାଦଗୁଡ଼ିକୁ ପୁନି ଲେଖି ଫେରାଇ ଆଣେ:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

କିମ୍ବା, ID ଦେଇ ଏକ ଇଞ୍ଜିନକୁ ସିଧାସଳଖ call କରନ୍ତୁ:

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

| | |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ଯେଉଁ କଥୋପକଥନରେ ସମସ୍ୟା ଦେଖାଦେଇଥିଲା, ସେଠାରୁ ଆପଣଙ୍କ coding agent ଏକ ଇଞ୍ଜିନ ତିଆରି କରେ, glossary term ଯୋଡ଼େ, rules କୁ ସୁର କରେ, ଏବଂ ଦୁଇଟି ଇଞ୍ଜିନକୁ ତୁଳନା କରେ |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | ଟର୍ମିନାଲ୍ କିମ୍ବା CI ରୁ source file push କରନ୍ତୁ ଏବଂ translation pull କରନ୍ତୁ। 18ଟି format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android and Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install କରନ୍ତୁ ଏବଂ GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, କିମ୍ବା Node.js 22+ ଥିବା ଯେକୌଣସି runner ରେ `lingo push` କୁ ଗୋଟିଏ step ଭାବେ ଚଲାନ୍ତୁ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ଗୋଟେଥର install କରନ୍ତୁ, ତାପରେ default branch କୁ ପ୍ରତ୍ୟେକ push ଏକ translation pull request ଖୋଲେ କିମ୍ବା update କରେ; କିମ୍ବା source ପରିବର୍ତ୍ତନ କରିଥିବା pull request ଭିତରେ translations commit ଭାବେ ପହଞ୍ଚେ। runner ଦରକାର ନାହିଁ, API key secret ଦରକାର ନାହିଁ, manage କରିବା ପାଇଁ Lockfile ମଧ୍ୟ ନାହିଁ |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ପ୍ରତ୍ୟେକ ଭାଷା-ଯୁଗଳ ପାଇଁ ଗୋଟିଏ synchronous call, କିମ୍ବା ଏକ async job ଯାହା ଗୋଟିଏ request କୁ ଅନେକ locale କୁ ପ୍ରସାରିତ କରେ ଏବଂ ଫଳାଫଳ ଆସୁଥିବା ସହିତ ଦେଇଯାଏ |

[ଆପଣଙ୍କ ପ୍ରଥମ localization engine ତିଆରି କରନ୍ତୁ →](https://lingo.dev)
