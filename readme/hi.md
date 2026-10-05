<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – लोकलाइज़ेशन इंजीनियरिंग प्लेटफ़ॉर्म"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev लोकलाइजेशन इंजीनियरिंग प्लेटफॉर्म है: अनुवाद गुणवत्ता मापने, LLM
    के साथ अनुवाद करने, और देशी वक्ताओं के साथ प्रूफरीड करने का सर्वोत्तम तरीका।
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">डॉक्स</a> •
  <a href="https://lingo.dev">प्लेटफॉर्म</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
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
      alt="अंतिम कमिट"
    />
  </a>
</p>

---

## टीमें Lingo.dev पर लोकलाइजेशन इंजन बनाती हैं

[लोकलाइजेशन इंजन](https://lingo.dev/en/docs/platform/engines) एक स्टेटफुल ट्रांसलेशन API है जिसे आपकी टीम कॉन्फ़िगर करती है और Lingo.dev चलाता है। प्रति उत्पाद, प्रति कंटेंट प्रकार, या प्रति ब्रांड एक इंजन बनाएं। इंजन के माध्यम से हर रिक्वेस्ट आपके द्वारा कॉन्फ़िगर की गई हर चीज़ को निश्चित प्राथमिकता क्रम में लागू करती है:

| लेयर                                                           | आप क्या कॉन्फ़िगर करते हैं                                               | डॉक्स से                                                                 |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [LLM मॉडल](https://lingo.dev/en/docs/platform/llm-models)      | कौन सा मॉडल प्रत्येक भाषा जोड़ी को संभालता है, रैंक किए गए फॉलबैक के साथ | 400+ मॉडल; रिस्पांस उस मॉडल का नाम बताता है जो चला                       |
| [ब्रांड वॉइस](https://lingo.dev/en/docs/platform/brand-voices) | आपका उत्पाद प्रत्येक भाषा में कैसे बोलता है, प्रति लोकेल एक टेक्स्ट      | प्रत्येक बाजार के लिए टोन और औपचारिकता                                   |
| [नियम](https://lingo.dev/en/docs/platform/rules)               | वे भाषाई परंपराएं जो एक सामान्य मॉडल चूक जाता है                         | स्पेनिश में विशेषण की स्थिति, प्रतिशत चिह्न से पहले स्पेस                |
| [शब्दावली](https://lingo.dev/en/docs/platform/glossaries)      | प्रति लोकेल सटीक शब्द मैपिंग, अर्थ के आधार पर मिलान किया गया             | यूरोपीय बाजारों के लिए "911" "112" बन जाता है; उत्पाद नाम यथावत रहते हैं |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers)  | प्रत्येक अनुवाद के बाद चलने वाली स्कोरिंग                                | GEMBA स्कोर, BERTScore, शब्दावली अनुपालन                                 |

शब्दावली, रूलसेट, और ब्रांड वॉइस आपके संगठन से संबंधित हैं, और एक इंजन उन्हें अटैचमेंट द्वारा लागू करता है। एक शब्दावली पांच इंजनों को नियंत्रित करती है, और एक संपादन सभी पांचों तक पहुंचता है। लाइव होने से पहले [प्लेग्राउंड](https://lingo.dev/en/docs/platform/playground) में परिवर्तन का परीक्षण करें: किसी इंजन की तुलना रॉ मॉडल से करें, या दो इंजनों की आपस में तुलना करें। इंजन प्लेटफॉर्म पर कॉन्फ़िगर किए जाते हैं, जहां लोकलाइजेशन टीम लोकलाइजेशन इंफ्रास्ट्रक्चर चलाती है।

## कोड से अपने इंजनों तक पहुँचें

किसी रिपॉज़िटरी की सामग्री का अनुवाद करें। `lingo push` फ़ाइलों को `.lingo/config.json` में नामित इंजन को भेजता है, और `lingo pull` किसी भी मशीन से अनुवाद वापस लिखता है:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

या किसी इंजन को सीधे उसकी ID से नाम देकर कॉल करें:

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

|                                                                        |                                                                                                                                                                    |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | आपका कोडिंग एजेंट एक इंजन बनाता है, शब्दावली शब्द जोड़ता है, नियमों को ट्यून करता है, और दो इंजनों की तुलना करता है—सीधे उस बातचीत से जहाँ समस्या सामने आई         |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | टर्मिनल या CI से स्रोत फ़ाइलें पुश करें, अनुवाद पुल करें। अठारह फ़ॉर्मेट: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android और Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI इंस्टॉल करें और GitHub Actions, GitLab CI/CD, Bitbucket Pipelines या Node.js 22+ वाले किसी भी रनर में एक स्टेप के रूप में `lingo push` चलाएँ                   |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बार इंस्टॉल करें और डिफ़ॉल्ट ब्रांच पर हर पुश एक अनुवाद पुल रिक्वेस्ट खोलता या अपडेट करता है। न रनर, न API की सीक्रेट, न प्रबंधन के लिए लॉकफ़ाइल                |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | प्रति भाषा जोड़ी एक सिंक्रोनस कॉल, या एक एसिंक जॉब जो एक रिक्वेस्ट को कई लोकेल में फैलाती है और परिणाम उपलब्ध होते ही डिलीवर करती है                               |

[अपना पहला लोकलाइज़ेशन इंजन बनाएँ →](https://lingo.dev)
