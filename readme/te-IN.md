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

## టీమ్‌లు Lingo.dev పై లోకలైజేషన్ ఇంజిన్‌లను నిర్మిస్తున్నాయి

[లోకలైజేషన్ ఇంజిన్](https://lingo.dev/en/docs/platform/engines) అంటే మీ టీమ్ కాన్ఫిగర్ చేసే, Lingo.dev నడిపే స్టేట్‌ఫుల్ అనువాద API. ప్రతి ప్రొడక్ట్‌కి, ప్రతి కంటెంట్ రకానికి లేదా ప్రతి బ్రాండ్‌కి ఒక్కోటి నిర్మించండి. ఒక ఇంజిన్ ద్వారా వెళ్లే ప్రతి రిక్వెస్ట్, అందులో మీరు కాన్ఫిగర్ చేసిన ప్రతిదీ ముందే నిర్ణయించిన ప్రాధాన్యత క్రమంలో వర్తింపజేస్తుంది:

| లేయర్ | మీరు కాన్ఫిగర్ చేసేది | డాక్స్‌లోని సమాచారం |
| --- | --- | --- |
| [LLM మోడళ్లు](https://lingo.dev/en/docs/platform/llm-models) | ర్యాంక్ చేసిన ఫాల్‌బ్యాక్‌లతో ప్రతి భాషా జంటను ఏ మోడల్ హ్యాండిల్ చేస్తుందో | 400+ మోడళ్లు; ఏ మోడల్ నడిచిందో రెస్పాన్స్‌లో పేరు చూపిస్తుంది |
| [బ్రాండ్ వాయిస్](https://lingo.dev/en/docs/platform/brand-voices) | ప్రతి భాషలో మీ ప్రొడక్ట్ ఎలా మాట్లాడాలో, ప్రతి లోకేల్‌కి ఒక టెక్స్ట్ | ప్రతి మార్కెట్‌కు సరిపోయే టోన్, ఫార్మాలిటీ |
| [నియమాలు](https://lingo.dev/en/docs/platform/rules) | సాధారణ మోడల్ దాటవేసే భాషా సంప్రదాయాలు | స్పానిష్‌లో విశేషణ స్థానం, శాతం గుర్తు ముందు ఖాళీ |
| [పదకోశం](https://lingo.dev/en/docs/platform/glossaries) | అర్థం ఆధారంగా సరిపోల్చే, ప్రతి లోకేల్‌కు ఖచ్చితమైన పద మ్యాపింగ్‌లు | యూరోపియన్ మార్కెట్లలో "911" "112"గా మారుతుంది; ప్రొడక్ట్ పేర్లు యథాతథంగా ఉంటాయి |
| [AI సమీక్షకులు](https://lingo.dev/en/docs/platform/ai-reviewers) | ప్రతి అనువాదం తర్వాత నడిచే స్కోరింగ్ | GEMBA స్కోర్లు, BERTScore, పదకోశ అనుసరణ |

పదకోశాలు, రూల్‌సెట్‌లు, బ్రాండ్ వాయిస్‌లు మీ సంస్థకే చెందినవి. ఇంజిన్ వాటిని అటాచ్‌మెంట్‌ల రూపంలో వర్తింపజేస్తుంది. ఒక పదకోశం ఐదు ఇంజిన్‌లను నియంత్రించగలదు, ఒకే ఎడిట్ ఆ ఐదింటికీ చేరుతుంది. మార్పు లైవ్‌కు వెళ్లే ముందు [Playground](https://lingo.dev/en/docs/platform/playground)లో పరీక్షించండి: ఒక ఇంజిన్‌ను రా మోడల్‌తో పోల్చండి, లేదా రెండు ఇంజిన్‌లను పక్కపక్కన ఉంచి చూడండి. ఈ ఇంజిన్‌లు ప్లాట్‌ఫారమ్‌లోనే కాన్ఫిగర్ అవుతాయి, అక్కడే లోకలైజేషన్ టీమ్ మొత్తం లోకలైజేషన్ ఇన్‌ఫ్రాస్ట్రక్చర్‌ను నడుపుతుంది.

## కోడ్ నుంచే మీ ఇంజిన్‌లను ఉపయోగించండి

రిపాజిటరీలోని కంటెంట్‌ను అనువదించండి. `.lingo/config.json`లో పేర్కొన్న ఇంజిన్‌కు `lingo push` ఫైళ్లను పంపిస్తుంది, అలాగే `lingo pull` ఏ మెషీన్ నుంచైనా అనువాదాలను తిరిగి రాస్తుంది:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

లేదా, ID ద్వారా పేరు పేర్కొని ఇంజిన్‌ను నేరుగా కాల్ చేయండి:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | సమస్య బయటపడిన అదే సంభాషణలోనే మీ కోడింగ్ ఏజెంట్ ఒక ఇంజిన్‌ను సృష్టించగలదు, పదకోశ పదాలను జోడించగలదు, నియమాలను మెరుగుపరచగలదు, అలాగే రెండు ఇంజిన్‌లను పోల్చగలదు |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | టెర్మినల్ నుంచీ లేదా CI నుంచీ సోర్స్ ఫైళ్లను push చేసి, అనువాదాలను pull చేయండి. పద్దెనిమిది ఫార్మాట్‌లు: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android మరియు Xcode స్ట్రింగ్‌లు, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLIని ఇన్‌స్టాల్ చేసి, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines లేదా Node.js 22+ ఉన్న ఏ రన్నర్‌లోనైనా `lingo push`ను ఒక స్టెప్‌గా నడపండి |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ఒక్కసారి ఇన్‌స్టాల్ చేస్తే చాలు—డిఫాల్ట్ బ్రాంచ్‌కు జరిగే ప్రతి push ఒక అనువాద pull request‌ను తెరుస్తుంది లేదా అప్‌డేట్ చేస్తుంది. లేదా, సోర్స్ మార్చిన అదే pull request‌లో అనువాదాలు commit‌గా చేరతాయి. రన్నర్ అవసరం లేదు, API కీ సీక్రెట్ అవసరం లేదు, నిర్వహించాల్సిన Lockfile కూడా లేదు |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ప్రతి భాషా జంటకు ఒక సింక్రోనస్ కాల్, లేదా ఒక రిక్వెస్ట్‌ను అనేక లోకేల్‌లకు విస్తరించి ఫలితాలు వచ్చిన వెంటనే అందించే ఒక అసింక్ జాబ్ |

[మీ తొలి లోకలైజేషన్ ఇంజిన్‌ను నిర్మించండి →](https://lingo.dev)
