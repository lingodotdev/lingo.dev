<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्म"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev हे स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्म आहे: भाषांतर गुणवत्ता
    मोजण्याचा, LLM सह भाषांतर करण्याचा आणि मूळ भाषिकांसह प्रूफरीड करण्याचा
    सर्वोत्तम मार्ग.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">दस्तऐवज</a> •
  <a href="https://lingo.dev">प्लॅटफॉर्म</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt महिन्यातील #1 DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="परवाना"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="शेवटची कमिट"
    />
  </a>
</p>

---

## टीम्स Lingo.dev वर स्थानिकीकरण इंजिन तयार करतात

[स्थानिकीकरण इंजिन](https://lingo.dev/en/docs/platform/engines) हे एक स्टेटफुल भाषांतर API आहे जे तुमची टीम कॉन्फिगर करते आणि Lingo.dev चालवते. प्रति उत्पादन, प्रति सामग्री प्रकार किंवा प्रति ब्रँड एक तयार करा. इंजिनमधून जाणारी प्रत्येक विनंती तुम्ही त्यात कॉन्फिगर केलेले सर्वकाही, प्राधान्यक्रमाच्या ठराविक क्रमाने लागू करते:

| स्तर                                                            | तुम्ही काय कॉन्फिगर करता                                      | दस्तऐवजांमधून                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------- |
| [LLM मॉडेल](https://lingo.dev/en/docs/platform/llm-models)      | कोणते मॉडेल प्रत्येक भाषा जोडी हाताळते, रँक केलेल्या फॉलबॅकसह | 400+ मॉडेल; प्रतिसादात चालवलेल्या मॉडेलचे नाव दर्शविले जाते           |
| [ब्रँड व्हॉइस](https://lingo.dev/en/docs/platform/brand-voices) | तुमचे उत्पादन प्रत्येक भाषेत कसे बोलते, प्रति लोकॅल एक मजकूर  | प्रत्येक बाजारासाठी टोन आणि औपचारिकता                                 |
| [नियम](https://lingo.dev/en/docs/platform/rules)                | सामान्य मॉडेल चुकवलेल्या भाषिक परंपरा                         | स्पॅनिशमध्ये विशेषणाची स्थिती, टक्केवारी चिन्हांपूर्वी जागा           |
| [शब्दावली](https://lingo.dev/en/docs/platform/glossaries)       | प्रति लोकॅल अचूक शब्द मॅपिंग, अर्थानुसार जुळवलेले             | युरोपियन बाजारासाठी "911" हे "112" बनते; उत्पादनांची नावे तशीच राहतात |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers)   | प्रत्येक भाषांतरानंतर चालणारे स्कोअरिंग                       | GEMBA स्कोअर, BERTScore, शब्दावली अनुपालन                             |

शब्दावली, नियमसंच आणि ब्रँड व्हॉइस तुमच्या संस्थेचे आहेत आणि इंजिन ते संलग्नकाद्वारे लागू करते. एक शब्दावली पाच इंजिनला नियंत्रित करते आणि एक संपादन सर्व पाचांपर्यंत पोहोचते. लाइव्ह होण्यापूर्वी [Playground](https://lingo.dev/en/docs/platform/playground) मध्ये बदलाची चाचणी घ्या: कच्च्या मॉडेलच्या विरुद्ध इंजिनची तुलना करा किंवा दोन इंजिन शेजारी शेजारी तुलना करा. इंजिन प्लॅटफॉर्मवर कॉन्फिगर केली जातात, जिथे स्थानिकीकरण टीम स्थानिकीकरण पायाभूत सुविधा चालवते.

## कोडमधून तुमच्या इंजिनपर्यंत पोहोचा

रिपॉझिटरीमधील सामग्रीचे भाषांतर करा. `lingo push` फायली `.lingo/config.json` मध्ये नमूद केलेल्या इंजिनला पाठवते, आणि `lingo pull` कोणत्याही मशीनवरून भाषांतरे परत लिहिते:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

किंवा ID द्वारे नाव देऊन थेट इंजिनला कॉल करा:

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

|                                                                        |                                                                                                                                                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | तुमचा कोडिंग एजंट इंजिन तयार करतो, शब्दकोश शब्द जोडतो, नियम ट्यून करतो आणि समस्या उद्भवलेल्या संवादातूनच दोन इंजिनची तुलना करतो                                         |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | टर्मिनलमधून किंवा CI मधून स्रोत फायली पुश करा, भाषांतरे पुल करा. अठरा फॉरमॅट: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आणि Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI इन्स्टॉल करा आणि GitHub Actions, GitLab CI/CD, Bitbucket Pipelines किंवा Node.js 22+ असलेल्या कोणत्याही रनरमध्ये एक स्टेप म्हणून `lingo push` चालवा                 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एकदा इन्स्टॉल करा आणि डीफॉल्ट ब्रँचवरील प्रत्येक पुश भाषांतर पुल रिक्वेस्ट उघडतो किंवा अपडेट करतो. रनर नाही, API की सिक्रेट नाही, व्यवस्थापित करण्यासाठी लॉकफाइल नाही   |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | प्रत्येक भाषा जोडीसाठी एक सिंक्रोनस कॉल, किंवा एक async जॉब जे एका विनंतीला अनेक लोकेलमध्ये पसरवते आणि परिणाम आल्यावर वितरित करते                                       |

[तुमचे पहिले लोकलायझेशन इंजिन तयार करा →](https://lingo.dev)
