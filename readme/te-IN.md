<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – స్థానికీకరణ ఇంజనీరింగ్ ప్లాట్‌ఫారమ్"
    />
  </a>
</p>

<p align="center">
  <strong>
    ఓపెన్-సోర్స్ స్థానికీకరణ ఇంజనీరింగ్ సాధనాలు. నాణ్యమైన, స్థిరమైన అనువాదాల
    కోసం Lingo.dev స్థానికీకరణ ఇంజనీరింగ్ ప్లాట్‌ఫారమ్‌కు కనెక్ట్ అవ్వండి.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React కోసం Lingo కంపైలర్ (ప్రారంభ ఆల్ఫా)</a>
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

| సాధనం                                              | ఇది ఏం చేస్తుంది                                       | క్విక్ కమాండ్                      |
| -------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React యాప్‌ల కోసం AI-సహాయక i18n సెటప్                  | ప్రాంప్ట్: `Set up i18n`           |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ఫైళ్లను స్థానికీకరించండి | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions లో నిరంతర స్థానికీకరణ                   | `uses: lingodotdev/lingo.dev@main` |
| [**React కోసం Lingo కంపైలర్**](#lingodev-compiler) | i18n రాపర్‌లు లేకుండా బిల్డ్-టైమ్ React స్థానికీకరణ    | `withLingo()` ప్లగిన్              |

### స్థానికీకరణ ఇంజన్‌లు

ఈ సాధనాలు [స్థానికీకరణ ఇంజన్‌లు](https://lingo.dev)కు కనెక్ట్ అవుతాయి – మీరు Lingo.dev స్థానికీకరణ ఇంజనీరింగ్ ప్లాట్‌ఫారమ్‌లో సృష్టించే స్టేట్‌ఫుల్ అనువాద APIలు. ప్రతి ఇంజన్ ప్రతి అభ్యర్థనలో పదజాలం, బ్రాండ్ వాయిస్ మరియు లొకేల్-నిర్దిష్ట సూచనలను కొనసాగిస్తుంది, [పరిభాషా లోపాలను 16.6–44.6% తగ్గిస్తుంది](https://lingo.dev/research/retrieval-augmented-localization). లేదా [మీ స్వంత LLMని తీసుకురండి](#lingodev-cli).

---

### Lingo.dev MCP

React యాప్‌లలో i18n సెటప్ చేయడం లోపాలకు గురిచేస్తుంది – AI కోడింగ్ అసిస్టెంట్‌లు కూడా ఉనికిలో లేని APIలను హాలూసినేట్ చేస్తాయి మరియు రూటింగ్‌ను విచ్ఛిన్నం చేస్తాయి. Lingo.dev MCP, Next.js, React Router మరియు TanStack Start కోసం ఫ్రేమ్‌వర్క్-నిర్దిష్ట i18n పరిజ్ఞానానికి AI అసిస్టెంట్‌లకు నిర్మాణాత్మక యాక్సెస్ అందిస్తుంది. Claude Code, Cursor, GitHub Copilot Agents మరియు Codex తో పనిచేస్తుంది.

[డాక్స్ చదవండి →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

ఒకే కమాండ్‌లో JSON, YAML, markdown, CSV మరియు PO ఫైళ్లను స్థానికీకరించండి. లాక్‌ఫైల్ ఇప్పటికే స్థానికీకరించబడిన వాటిని ట్రాక్ చేస్తుంది – కొత్త లేదా మార్చబడిన కంటెంట్ మాత్రమే ప్రాసెస్ అవుతుంది. Lingo.dev లో మీ స్థానికీకరణ ఇంజన్‌కు డిఫాల్ట్‌గా ఉంటుంది, లేదా మీ స్వంత LLMని తీసుకురండి (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[డాక్స్ చదవండి →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

మీ పైప్‌లైన్‌లో నిరంతర స్థానికీకరణ. ప్రతి పుష్ స్థానికీకరణను ట్రిగ్గర్ చేస్తుంది – కోడ్ ప్రొడక్షన్‌కు చేరే ముందు తప్పిపోయిన స్ట్రింగ్‌లు పూరించబడతాయి. GitHub Actions, GitLab CI/CD మరియు Bitbucket Pipelines కు మద్దతు ఇస్తుంది.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[డాక్స్ చదవండి →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

బ్యాకెండ్ కోడ్ నుండి నేరుగా మీ స్థానికీకరణ ఇంజిన్‌ను కాల్ చేయండి. వెబ్‌హుక్ డెలివరీ, లొకేల్ ప్రకారం వైఫల్యం ఐసోలేషన్ మరియు WebSocket ద్వారా రియల్-టైమ్ ప్రగతితో సింక్రనస్ మరియు ఎసింక్ స్థానికీకరణ.

[డాక్స్ చదవండి →](https://lingo.dev/en/docs/api)

---

### React కోసం Lingo Compiler (ప్రారంభ ఆల్ఫా)

i18n రాపర్‌లు లేకుండా బిల్డ్-టైమ్ React స్థానికీకరణ. సాదా ఆంగ్ల టెక్స్ట్‌తో కాంపోనెంట్‌లు రాయండి – కంపైలర్ అనువదించదగిన స్ట్రింగ్‌లను గుర్తించి బిల్డ్ సమయంలో స్థానికీకరించిన వేరియంట్‌లను జనరేట్ చేస్తుంది. ట్రాన్స్‌లేషన్ కీలు లేవు, JSON ఫైల్స్ లేవు, `t()` ఫంక్షన్‌లు లేవు. Next.js (App Router) మరియు Vite + React కు మద్దతు ఇస్తుంది.

[డాక్స్ చదవండి →](https://lingo.dev/en/docs/react/compiler)

---

## కంట్రిబ్యూట్ చేయడం

కంట్రిబ్యూషన్‌లకు స్వాగతం. దయచేసి ఈ మార్గదర్శకాలను అనుసరించండి:

1. **ఇష్యూలు:** [బగ్‌లను రిపోర్ట్ చేయండి లేదా ఫీచర్‌లను అభ్యర్థించండి](https://github.com/lingodotdev/lingo.dev/issues)
2. **పుల్ రిక్వెస్ట్‌లు:** [మార్పులను సమర్పించండి](https://github.com/lingodotdev/lingo.dev/pulls)
   - ప్రతి PR కు చేంజ్‌సెట్ అవసరం: `pnpm new` (లేదా రిలీజ్ కాని మార్పుల కోసం `pnpm new:empty`)
   - సమర్పించే ముందు టెస్ట్‌లు పాస్ అవుతున్నాయని నిర్ధారించుకోండి
3. **డెవలప్‌మెంట్:** ఇది pnpm + turborepo మోనోరెపో
   - డిపెండెన్సీలను ఇన్‌స్టాల్ చేయండి: `pnpm install`
   - టెస్ట్‌లు రన్ చేయండి: `pnpm test`
   - బిల్డ్ చేయండి: `pnpm build`

**సపోర్ట్:** [Discord కమ్యూనిటీ](https://lingo.dev/go/discord)

## స్టార్ హిస్టరీ

Lingo.dev మీకు ఉపయోగకరంగా ఉంటే, మాకు స్టార్ ఇచ్చి 10,000 స్టార్‌లను చేరుకోవడంలో సహాయపడండి!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## స్థానికీకరించిన డాక్యుమెంటేషన్

**అందుబాటులో ఉన్న అనువాదాలు:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**కొత్త భాషను జోడించడం:**

1. [BCP-47 ఫార్మాట్](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) ఉపయోగించి [`i18n.json`](./i18n.json)కు లొకేల్ కోడ్‌ను జోడించండి
2. పుల్ రిక్వెస్ట్‌ను సబ్మిట్ చేయండి
