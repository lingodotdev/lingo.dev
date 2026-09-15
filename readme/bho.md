<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – स्थानीयकरण इंजीनियरिंग प्लेटफ़ॉर्म"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev एगो लोकलाइजेशन इंजीनियरिंग प्लेटफॉर्म बा: अनुवाद के गुणवत्ता नापे,
    LLM से अनुवाद करे, आ देशी बोले वाला लोग से प्रूफरीड करे के सबसे बढ़िया
    तरीका।
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">दस्तावेज</a> •
  <a href="https://lingo.dev">प्लेटफॉर्म</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 महीना के DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="लाइसेंस"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="आखिरी कमिट"
    />
  </a>
</p>

---

## टीम Lingo.dev पर लोकलाइजेशन इंजन बनावेला

एगो [लोकलाइजेशन इंजन](https://lingo.dev/en/docs/platform/engines) एगो स्टेटफुल अनुवाद API बा जेकरा रउरा टीम कॉन्फ़िगर करेला आ Lingo.dev चलावेला। हर प्रोडक्ट, हर कंटेंट टाइप, या हर ब्रांड खातिर एगो बनाईं। इंजन के माध्यम से हर अनउरोध ओह सब चीज के लागू करेला जेकरा रउरा कॉन्फ़िगर कइले बानी, तय प्राथमिकता के क्रम में:

| परत                                                            | रउरा का कॉन्फ़िगर करेनी                                           | दस्तावेज से                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| [LLM मॉडल](https://lingo.dev/en/docs/platform/llm-models)      | कौन मॉडल हर भाषा जोड़ी के संभालेला, रैंक वाला फॉलबैक के साथ       | 400+ मॉडल; रिस्पॉन्स में ओह मॉडल के नाम बा जे चलल                  |
| [ब्रांड आवाज](https://lingo.dev/en/docs/platform/brand-voices) | रउरा प्रोडक्ट हर भाषा में कइसे बोलेला, हर लोकेल खातिर एगो टेक्स्ट | हर बाजार खातिर टोन आ औपचारिकता                                     |
| [नियम](https://lingo.dev/en/docs/platform/rules)               | भाषाई परंपरा जेकरा एगो सामान्य मॉडल छोड़ देला                     | स्पेनिश में विशेषण के जगह, प्रतिशत चिन्ह से पहिले जगह              |
| [शब्दावली](https://lingo.dev/en/docs/platform/glossaries)      | हर लोकेल खातिर सटीक शब्द मैपिंग, अर्थ से मिलान कइल                | "911" यूरोपीय बाजार खातिर "112" बन जाला; प्रोडक्ट नाम वइसहीं रहेला |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers)  | स्कोरिंग जे हर अनुवाद के बाद चलेला                                | GEMBA स्कोर, BERTScore, शब्दावली अनुपालन                           |

शब्दावली, नियम सेट, आ ब्रांड आवाज रउरा संगठन के होला, आ एगो इंजन ओकरा के अटैचमेंट से लागू करेला। एगो शब्दावली पाँच इंजन के चलावेला, आ एगो संपादन पाँचू तक पहुँचेला। [Playground](https://lingo.dev/en/docs/platform/playground) में बदलाव के लाइव होखे से पहिले टेस्ट करीं: एगो इंजन के रॉ मॉडल के खिलाफ तुलना करीं, या दू इंजन के साथ-साथ। इंजन प्लेटफॉर्म पर कॉन्फ़िगर कइल जाला, जहाँ लोकलाइजेशन टीम लोकलाइजेशन इन्फ्रास्ट्रक्चर चलावेला।

## कोड से अपना इंजन तक पहुँचल जाव

रिपॉजिटरी में सामग्री के अनुवाद करल जाव। `lingo push` फाइल सभ के `.lingo/config.json` में नाम वाला इंजन में भेजेला, आ `lingo pull` कौनो मशीन से अनुवाद सभ के वापस लिखेला:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

या ID से नाम देके सीधे इंजन के कॉल करल जाव:

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

|                                                                        |                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | राउर कोडिंग एजेंट इंजन बनावेला, शब्दावली शब्द जोड़ेला, नियम ट्यून करेला, आ दू गो इंजन के तुलना करेला, ओह बातचीत से जहाँ समस्या सामने आइल रहे                                    |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | टर्मिनल से या CI से स्रोत फाइल सभ के पुश करीं, अनुवाद सभ के पुल करीं। अठारह गो फॉर्मेट: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आ Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI इंस्टॉल करीं आ GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, या Node.js 22+ वाला कौनो रनर में `lingo push` के एगो कदम के रूप में चलाईं                                 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बेर इंस्टॉल करीं आ डिफॉल्ट ब्रांच में हर पुश एगो अनुवाद पुल रिक्वेस्ट खोलेला या अपडेट करेला। ना कौनो रनर, ना API key secret, ना प्रबंधित करे खातिर lockfile                  |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | हर भाषा जोड़ी खातिर एगो सिंक्रोनस कॉल, या एगो async job जवन एगो रिक्वेस्ट के बहुत भाषा सभ में फैलावेला आ परिणाम सभ के जइसहीं आवेला, डिलीवर करेला                                |

[अपना पहिला स्थानीयकरण इंजन बनाईं →](https://lingo.dev)
