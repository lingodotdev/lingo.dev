<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – स्थानीयकरण इंजीनियरिंग मंच" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev स्थानीयकरण इंजीनियरिंग का मंच है: अनुवाद की गुणवत्ता मापने, LLMs की मदद से अनुवाद करने, और मूल-भाषियों से प्रूफ़रीड करवाने का सबसे बेहतर तरीका।</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">दस्तावेज़</a> •
  <a href="https://lingo.dev">मंच</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="महीने का Product Hunt #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="लाइसेंस" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="पिछला कमिट" /></a>
</p>

---

## टीमें Lingo.dev पर स्थानीयकरण इंजन बनाती हैं

[स्थानीयकरण इंजन](https://lingo.dev/en/docs/platform/engines) एक स्टेटफुल अनुवाद API है, जिसे आपकी टीम कॉन्फ़िगर करती है और Lingo.dev चलाता है। हर उत्पाद, हर सामग्री प्रकार, या हर ब्रांड के लिए अलग इंजन बनाइए। किसी इंजन से होकर जाने वाले हर अनुरोध पर उसमें की गई आपकी सारी कॉन्फ़िगरेशन एक तय प्राथमिकता क्रम में लागू होती है:

| परत | आप क्या कॉन्फ़िगर करते हैं | दस्तावेज़ों से |
| --- | --- | --- |
| [LLM मॉडल](https://lingo.dev/en/docs/platform/llm-models) | हर भाषा-जोड़ी को कौन-सा मॉडल संभालेगा, रैंक किए गए फॉलबैक के साथ | 400+ मॉडल; जवाब में चलाए गए मॉडल का नाम बताया जाता है |
| [ब्रांड की आवाज़](https://lingo.dev/en/docs/platform/brand-voices) | हर भाषा में आपका उत्पाद कैसे बोलता है — हर लोकेल के लिए एक पाठ | हर बाज़ार के हिसाब से लहजा और औपचारिकता |
| [नियम](https://lingo.dev/en/docs/platform/rules) | वे भाषाई परंपराएँ जो सामान्य मॉडल अक्सर चूक जाते हैं | स्पेनिश में विशेषण की स्थिति, प्रतिशत चिह्न से पहले एक स्पेस |
| [शब्दावली](https://lingo.dev/en/docs/platform/glossaries) | हर लोकेल के लिए अर्थ के आधार पर मिलाए गए सटीक शब्द-मानचित्रण | यूरोपीय बाज़ारों के लिए "911", "112" बन जाता है; उत्पाद नाम वैसे ही रहते हैं |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers) | स्कोरिंग, जो हर अनुवाद के बाद चलती है | GEMBA स्कोर, BERTScore, शब्दावली अनुपालन |

शब्दावलियाँ, नियम-समूह और ब्रांड की आवाज़ें आपके संगठन की होती हैं, और इंजन उन्हें जोड़कर लागू करता है। एक शब्दावली पाँच इंजनों को चला सकती है, और एक बदलाव पाँचों तक पहुँच जाता है। किसी बदलाव को लाइव करने से पहले [Playground](https://lingo.dev/en/docs/platform/playground) में जाँचें: किसी इंजन की तुलना सीधे मॉडल से करें, या दो इंजनों को साथ-साथ देखें। इंजन मंच पर कॉन्फ़िगर किए जाते हैं, जहाँ स्थानीयकरण टीम स्थानीयकरण ढाँचा चलाती है।

## कोड से अपने इंजनों तक पहुँचें

रिपॉज़िटरी की सामग्री का अनुवाद करें। `lingo push` फ़ाइलों को `.lingo/config.json` में दिए गए इंजन पर भेजता है, और `lingo pull` किसी भी मशीन से अनुवाद वापस लिख देता है:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

या किसी इंजन को सीधे कॉल करें और उसे उसकी ID से बताएँ:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | आपका कोडिंग एजेंट उसी बातचीत से इंजन बना सकता है, शब्दावली में शब्द जोड़ सकता है, नियमों को सहेज सकता है, और दो इंजनों की तुलना कर सकता है जहाँ समस्या सामने आई थी |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | टर्मिनल या CI से स्रोत फ़ाइलें push करें और अनुवाद pull करें। अठारह फ़ॉर्मैट: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android और Xcode स्ट्रिंग्स, SubRip, PHP |
| [CI/CD में Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI इंस्टॉल करें और GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, या Node.js 22+ वाले किसी भी रनर में `lingo push` को एक चरण के रूप में चलाएँ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बार इंस्टॉल कीजिए, फिर डिफ़ॉल्ट ब्रांच पर हर push एक अनुवाद pull request खोलता है या उसे अपडेट करता है। या फिर, जिन स्रोत बदलावों ने pull request बनाया, उसी में अनुवाद commit के रूप में पहुँच जाते हैं। न रनर, न API कुंजी secret, न सँभालने के लिए Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | हर भाषा-जोड़ी के लिए एक समकालिक कॉल, या एक असिंक जॉब जो एक अनुरोध को कई लोकेल में फैलाता है और नतीजे आते ही पहुँचा देता है |

[अपना पहला स्थानीयकरण इंजन बनाइए →](https://lingo.dev)
