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
    Lingo.dev అనేది స్థానికీకరణ ఇంజనీరింగ్ ప్లాట్‌ఫారమ్: అనువాద నాణ్యతను
    కొలవడానికి, LLMలతో అనువదించడానికి, మరియు స్థానిక మాట్లాడేవారితో దిద్దుబాటు
    చేయడానికి ఉత్తమ మార్గం.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">డాక్స్</a> •
  <a href="https://lingo.dev">ప్లాట్‌ఫారమ్</a> •
  <a href="https://lingo.dev/go/discord">డిస్కార్డ్</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 నెల యొక్క డెవ్‌టూల్"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="లైసెన్స్"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="చివరి కమిట్"
    />
  </a>
</p>

---

## టీమ్‌లు Lingo.dev పై స్థానికీకరణ ఇంజన్‌లను రూపొందిస్తాయి

[స్థానికీకరణ ఇంజన్](https://lingo.dev/en/docs/platform/engines) అంటే మీ టీమ్ కాన్ఫిగర్ చేసి Lingo.dev రన్ చేసే స్టేట్‌ఫుల్ అనువాద API. ప్రతి ప్రొడక్ట్‌కు, ప్రతి కంటెంట్ రకానికి లేదా ప్రతి బ్రాండ్‌కు ఒకటి రూపొందించండి. ఇంజన్ ద్వారా వచ్చే ప్రతి రిక్వెస్ట్ మీరు కాన్ఫిగర్ చేసిన అన్నింటినీ నిర్ణీత ప్రాధాన్యత క్రమంలో వర్తింపజేస్తుంది:

| లేయర్                                                             | మీరు కాన్ఫిగర్ చేసేది                                                 | డాక్స్ నుండి                                                                 |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [LLM మోడల్స్](https://lingo.dev/en/docs/platform/llm-models)      | ప్రతి భాషా జతకు ఏ మోడల్ నిర్వహిస్తుంది, ర్యాంక్ చేసిన ఫాల్‌బ్యాక్‌లతో | 400+ మోడల్స్; రెస్పాన్స్ రన్ అయిన మోడల్‌ను పేర్కొంటుంది                      |
| [బ్రాండ్ వాయిస్](https://lingo.dev/en/docs/platform/brand-voices) | ప్రతి భాషలో మీ ప్రొడక్ట్ ఎలా మాట్లాడుతుంది, లొకేల్‌కు ఒక టెక్స్ట్     | ప్రతి మార్కెట్‌కు టోన్ మరియు ఫార్మాలిటీ                                      |
| [రూల్స్](https://lingo.dev/en/docs/platform/rules)                | సాధారణ మోడల్ తప్పించుకునే భాషాపరమైన సంప్రదాయాలు                       | స్పానిష్‌లో విశేషణ స్థానం, శాతపు గుర్తుల ముందు స్పేస్                        |
| [గ్లోసరీ](https://lingo.dev/en/docs/platform/glossaries)          | లొకేల్‌కు ఖచ్చితమైన టర్మ్ మ్యాపింగ్‌లు, అర్థం ద్వారా మ్యాచ్ అవుతాయి   | "911" యూరోపియన్ మార్కెట్ల కోసం "112" అవుతుంది; ప్రొడక్ట్ పేర్లు అలాగే ఉంటాయి |
| [AI రివ్యూయర్స్](https://lingo.dev/en/docs/platform/ai-reviewers) | ప్రతి అనువాదం తర్వాత రన్ అయ్యే స్కోరింగ్                              | GEMBA స్కోర్లు, BERTScore, గ్లోసరీ కంప్లయన్స్                                |

గ్లోసరీలు, రూల్‌సెట్‌లు మరియు బ్రాండ్ వాయిస్‌లు మీ సంస్థకు చెందినవి, మరియు ఇంజన్ వాటిని అటాచ్‌మెంట్ ద్వారా వర్తింపజేస్తుంది. ఒక గ్లోసరీ ఐదు ఇంజన్‌లను నియంత్రిస్తుంది, మరియు ఒక సవరణ ఐదింటికి చేరుతుంది. మార్పు లైవ్ అయ్యే ముందు [ప్లేగ్రౌండ్](https://lingo.dev/en/docs/platform/playground)లో పరీక్షించండి: ఇంజన్‌ను రా మోడల్‌తో పోల్చండి, లేదా రెండు ఇంజన్‌లను ప్రక్కప్రక్కన పోల్చండి. ఇంజన్‌లు ప్లాట్‌ఫారమ్‌పై కాన్ఫిగర్ చేయబడతాయి, అక్కడ స్థానికీకరణ టీమ్ స్థానికీకరణ ఇన్‌ఫ్రాస్ట్రక్చర్‌ను నడుపుతుంది.

## కోడ్ నుండి మీ ఇంజిన్‌లను యాక్సెస్ చేయండి

రిపోజిటరీలోని కంటెంట్‌ను అనువదించండి. `lingo push` ఫైల్స్‌ను `.lingo/config.json` లో పేర్కొన్న ఇంజిన్‌కు పంపుతుంది, మరియు `lingo pull` ఏ మెషీన్ నుండైనా అనువాదాలను తిరిగి వ్రాస్తుంది:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

లేదా ID ద్వారా పేరు పెట్టి ఇంజిన్‌ను నేరుగా కాల్ చేయండి:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
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

|                                                                        |                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | మీ కోడింగ్ ఏజెంట్ ఇంజిన్‌ను సృష్టిస్తుంది, గ్లోసరీ టర్మ్స్ జోడిస్తుంది, నియమాలను ట్యూన్ చేస్తుంది మరియు సమస్య ఉద్భవించిన సంభాషణ నుండే రెండు ఇంజిన్‌లను పోల్చుతుంది                                              |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | టెర్మినల్ నుండి లేదా CI నుండి సోర్స్ ఫైల్స్‌ను పుష్ చేయండి, అనువాదాలను పుల్ చేయండి. పద్దెనిమిది ఫార్మాట్‌లు: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android మరియు Xcode స్ట్రింగ్స్, SubRip, PHP    |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI ఇన్‌స్టాల్ చేసి, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines లేదా Node.js 22+ ఉన్న ఏదైనా రన్నర్‌లో `lingo push` ను స్టెప్‌గా రన్ చేయండి                                                               |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ఒకసారి ఇన్‌స్టాల్ చేయండి మరియు డిఫాల్ట్ బ్రాంచ్‌కు ప్రతి పుష్ అనువాద పుల్ రిక్వెస్ట్‌ను ఓపెన్ చేస్తుంది లేదా అప్‌డేట్ చేస్తుంది. రన్నర్ అవసరం లేదు, API కీ సీక్రెట్ అవసరం లేదు, మేనేజ్ చేయడానికి లాక్‌ఫైల్ లేదు |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | ప్రతి భాషా జత కోసం ఒక సింక్రనస్ కాల్, లేదా ఒక రిక్వెస్ట్‌ను అనేక లొకేల్‌లకు విస్తరించి ఫలితాలు వచ్చినప్పుడు డెలివర్ చేసే అసింక్ జాబ్                                                                            |

[మీ మొదటి లొకలైజేషన్ ఇంజిన్‌ను నిర్మించండి →](https://lingo.dev)
