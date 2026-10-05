<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – లోకలైజేషన్ ఇంజినీరింగ్ ప్లాట్‌ఫారమ్" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev అనేది లోకలైజేషన్ ఇంజినీరింగ్ ప్లాట్‌ఫారమ్: అనువాద నాణ్యతను కొలవడానికి, LLMs‌తో అనువదించడానికి, స్థానిక భాషా నిపుణులతో ప్రూఫ్‌రీడ్ చేయించడానికి ఉత్తమ మార్గం.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">డాక్స్</a> •
  <a href="https://lingo.dev">ప్లాట్‌ఫారమ్</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt నెలలో #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="లైసెన్స్" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="ఇటీవలి కమిట్" /></a>
</p>

---

## టీమ్‌లు Lingo.dev పై లోకలైజేషన్ ఇంజిన్‌లను నిర్మిస్తాయి

[లోకలైజేషన్ ఇంజిన్](https://lingo.dev/en/docs/platform/engines) అనేది మీ టీమ్ కాన్ఫిగర్ చేసి, Lingo.dev నడిపే స్టేట్‌ఫుల్ అనువాద API. ప్రతి ప్రొడక్ట్‌కు, ప్రతి కంటెంట్ రకానికి, లేదా ప్రతి బ్రాండ్‌కు ఒకదాన్ని నిర్మించండి. ఒక ఇంజిన్ ద్వారా వెళ్లే ప్రతి రిక్వెస్ట్, మీరు అందులో కాన్ఫిగర్ చేసిన ప్రతిదాన్ని నిర్ణీత ప్రాధాన్య క్రమంలో వర్తింపజేస్తుంది:

| లేయర్ | మీరు కాన్ఫిగర్ చేసేది | డాక్స్‌లో నుంచి |
| --- | --- | --- |
| [LLM మోడళ్లు](https://lingo.dev/en/docs/platform/llm-models) | ర్యాంక్ చేసిన fallback‌లతో, ప్రతి భాషా జంటను ఏ మోడల్ నిర్వహించాలో | 400+ మోడళ్లు; ఏ మోడల్ నడిచిందో రిస్పాన్స్‌లో పేరు కనిపిస్తుంది |
| [బ్రాండ్ వాయిస్](https://lingo.dev/en/docs/platform/brand-voices) | ప్రతి భాషలో మీ ప్రొడక్ట్ ఎలా మాట్లాడాలన్నది, ప్రతి లోకేల్‌కు ఒక టెక్స్ట్ | ప్రతి మార్కెట్‌కు సరిపోయే టోన్, ఫార్మాలిటీ |
| [నియమాలు](https://lingo.dev/en/docs/platform/rules) | సాధారణ మోడల్ మిస్ చేసే భాషా సంప్రదాయాలు | స్పానిష్‌లో విశేషణ స్థానం, శాతం గుర్తుల ముందు ఖాళీ |
| [పదకోశం](https://lingo.dev/en/docs/platform/glossaries) | అర్థం ఆధారంగా సరిపోల్చే, ప్రతి లోకేల్‌కు ఖచ్చితమైన పద మ్యాపింగ్‌లు | యూరోపియన్ మార్కెట్లలో "911" ను "112"గా మారుస్తుంది; ప్రొడక్ట్ పేర్లు యథాతథంగా ఉంటాయి |
| [AI సమీక్షకులు](https://lingo.dev/en/docs/platform/ai-reviewers) | ప్రతి అనువాదం తర్వాత నడిచే స్కోరింగ్ | GEMBA స్కోర్లు, BERTScore, పదకోశ అనుసరణ |

పదకోశాలు, రూల్‌సెట్‌లు, బ్రాండ్ వాయిస్‌లు మీ సంస్థకే చెందుతాయి, మరియు ఇంజిన్ వాటిని అటాచ్‌మెంట్‌ల ద్వారా వర్తింపజేస్తుంది. ఒక పదకోశం ఐదు ఇంజిన్‌లను నియంత్రించగలదు, ఒక ఎడిట్ ఐదింటికీ చేరుతుంది. మార్పు లైవ్‌కు వెళ్లే ముందు [Playground](https://lingo.dev/en/docs/platform/playground)లో దాన్ని పరీక్షించండి: ఒక ఇంజిన్‌ను raw model‌తో పోల్చండి, లేదా రెండు ఇంజిన్‌లను పక్కపక్కన సరిపోల్చండి. ఇంజిన్‌లు ప్లాట్‌ఫారమ్‌లోనే కాన్ఫిగర్ అవుతాయి; లోకలైజేషన్ టీమ్ కూడా అక్కడి నుంచే లోకలైజేషన్ ఇన్‌ఫ్రాస్ట్రక్చర్‌ను నడుపుతుంది.

## కోడ్ నుంచే మీ ఇంజిన్‌లను ఉపయోగించండి

ఒక repositoryలోని కంటెంట్‌ను అనువదించండి. `.lingo/config.json`లో పేరున్న ఇంజిన్‌కు `lingo push` ఫైళ్లను పంపుతుంది, మరియు `lingo pull` ఏ మెషీన్ నుంచైనా అనువాదాలను తిరిగి రాస్తుంది:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

లేదా, ID పేర్కొని నేరుగా ఒక ఇంజిన్‌ను కాల్ చేయండి:

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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | సమస్య కనిపించిన అదే సంభాషణలోనే, మీ coding agent ఒక ఇంజిన్‌ను సృష్టించగలదు, పదకోశ పదాలను జోడించగలదు, నియమాలను మెరుగుపరచగలదు, రెండు ఇంజిన్‌లను పోల్చగలదు |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | టెర్మినల్ నుంచీ లేదా CI నుంచీ source ఫైళ్లను push చేయండి, అనువాదాలను pull చేయండి. 18 ఫార్మాట్‌లు: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android మరియు Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLIని ఇన్‌స్టాల్ చేసి, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, లేదా Node.js 22+ ఉన్న ఏ runnerలోనైనా `lingo push`ను ఒక స్టెప్‌గా నడపండి |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ఒక్కసారి ఇన్‌స్టాల్ చేస్తే చాలు. default branch‌కు ప్రతి push ఒక translation pull request‌ను తెరుస్తుంది లేదా అప్‌డేట్ చేస్తుంది. లేదంటే, source మార్చిన అదే pull requestలో అనువాదాలు ఒక commit‌గా చేరతాయి. runner అవసరం లేదు, API key secret అవసరం లేదు, నిర్వహించాల్సిన Lockfile కూడా లేదు |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ప్రతి భాషా జంటకు ఒక synchronous call, లేదా ఒకే రిక్వెస్ట్‌ను అనేక లోకేల్‌లకు పంపించి, ఫలితాలు వచ్చిన వెంటనే అందించే async job |

[మీ తొలి లోకలైజేషన్ ఇంజిన్‌ను నిర్మించండి →](https://lingo.dev)
