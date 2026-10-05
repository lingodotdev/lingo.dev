<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – लोकलाइजेशन इंजीनियरिंग प्लेटफॉर्म" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev लोकलाइजेशन इंजीनियरिंग प्लेटफॉर्म हवे: अनुवाद के गुणवत्ता नापे, LLMs से अनुवाद करे, आ देसी बोलइया लोग से प्रूफरीड करवावे के सबसे बढ़िया तरीका।</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">डॉक्स</a> •
  <a href="https://lingo.dev">प्लेटफॉर्म</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt के महीना के #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="लाइसेंस" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="आखिरी कमिट" /></a>
</p>

---

## टीम सभ Lingo.dev पर लोकलाइजेशन इंजन बनावेले

[लोकलाइजेशन इंजन](https://lingo.dev/en/docs/platform/engines) एगो स्टेटफुल अनुवाद API हवे, जेकरा के रउरा टीम कॉन्फ़िगर करेले आ Lingo.dev चलावेले। हर प्रोडक्ट, हर कंटेंट टाइप, भा हर ब्रांड खातिर अलग-अलग बनाईं। इंजन से होके जाए वाला हर रिक्वेस्ट पर ओह में कइल सभे कॉन्फ़िगरेशन एगो तय प्राथमिकता क्रम में लागू हो जाला:

| परत | रउरा का कॉन्फ़िगर करीं | डॉक्स से |
| --- | --- | --- |
| [LLM मॉडल](https://lingo.dev/en/docs/platform/llm-models) | हर भाषा जोड़ी खातिर कवन मॉडल काम करी, रैंक कइल फॉलबैक के साथ | 400+ मॉडल; रिस्पॉन्स में चलल मॉडल के नाम बतावल जाला |
| [ब्रांड के आवाज़](https://lingo.dev/en/docs/platform/brand-voices) | रउरा प्रोडक्ट हर भाषा में कइसे बोलेला, हर लोकेल खातिर एगो टेक्स्ट | हर बाजार खातिर टोन आ औपचारिकता |
| [नियम](https://lingo.dev/en/docs/platform/rules) | ऊ भाषाई रिवाज जे सामान्य मॉडल अक्सर छोड़ देला | स्पेनी में विशेषण के जगह, प्रतिशत चिन्ह से पहिले खाली जगह |
| [शब्दावली](https://lingo.dev/en/docs/platform/glossaries) | हर लोकेल खातिर सटीक शब्द मिलान, मतलब के हिसाब से मिलावल गइल | "911" यूरोपीय बाजार खातिर "112" बन जाला; प्रोडक्ट के नाम जइसे के तइसे रहेला |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers) | हर अनुवाद के बाद चले वाला स्कोरिंग | GEMBA स्कोर, BERTScore, शब्दावली के पालन |

शब्दावली, नियम-समूह, आ ब्रांड के आवाज़ रउरा संगठन के हिस्सा होले, आ इंजन इनका के अटैच कइला से लागू करेला। एके शब्दावली पाँच गो इंजन पर लागू हो सकेले, आ एके बदलाव पाँचो जगह पहुँच जाला। बदलाव लाइव होखे से पहिले [Playground](https://lingo.dev/en/docs/platform/playground) में जाँच लीं: एगो इंजन के कच्चा मॉडल से तुलना करीं, भा दू गो इंजन के एक-दोसरा के बगल में देखीं। इंजन प्लेटफॉर्म पर कॉन्फ़िगर होला, जहाँ लोकलाइजेशन टीम पूरा लोकलाइजेशन इंफ्रास्ट्रक्चर चलावेले।

## कोड से अपना इंजन तक पहुँचीं

रिपॉजिटरी में मौजूद कंटेंट के अनुवाद करीं। `lingo push` फाइलन के `.lingo/config.json` में नाम दिहल इंजन तक भेजेला, आ `lingo pull` अनुवाद के कवनो मशीन से वापस लिख देला:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

भा सीधे इंजन के कॉल करीं, ओकर ID के नाँव से:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | रउरा कोडिंग एजेंट ओही बातचीत से, जहाँ दिक्कत सामने आइल, इंजन बनावेले, शब्दावली के शब्द जोड़ेले, नियम के सँवारेले, आ दू गो इंजन के तुलना करेले |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | टर्मिनल से भा CI से सोर्स फाइल push करीं, अनुवाद pull करीं। अठारह गो फॉर्मेट: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आ Xcode strings, SubRip, PHP |
| [CI/CD में Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI इंस्टॉल करीं आ GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, भा Node.js 22+ वाला कवनो रनर में `lingo push` के एगो स्टेप के रूप में चलाईं |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एक बेर इंस्टॉल करीं, आ डिफॉल्ट ब्रांच पर हर push अनुवाद वाला pull request खोलेला भा अपडेट करेला, भा अनुवाद ओही pull request में कमिट बनके पहुँच जाला जेह में सोर्स बदलल गइल रहे। ना रनर, ना API key secret, ना सँभाले खातिर Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | हर भाषा जोड़ी खातिर एगो synchronous कॉल, भा एगो async जॉब जे एके रिक्वेस्ट के कई गो लोकेल में बाँट देला आ नतीजा आवते पहुँचा देला |

[अपना पहिला लोकलाइजेशन इंजन बनाई →](https://lingo.dev)
