<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्म" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev हे स्थानिकीकरण अभियांत्रिकी प्लॅटफॉर्म आहे: भाषांतराची गुणवत्ता मोजण्यासाठी, LLMs सह भाषांतर करण्यासाठी आणि मूळ भाषिकांकडून प्रूफरीड करून घेण्यासाठीचा सर्वोत्तम मार्ग.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">दस्तऐवज</a> •
  <a href="https://lingo.dev">प्लॅटफॉर्म</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt वरील महिन्याचे #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="परवाना" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="शेवटची कमिट" /></a>
</p>

---

## संघ Lingo.dev वर स्थानिकीकरण इंजिने तयार करतात

[स्थानिकीकरण इंजिन](https://lingo.dev/en/docs/platform/engines) म्हणजे तुमचा संघ संरचीत करतो आणि Lingo.dev चालवते असे स्थिती-जाणिव असलेले भाषांतर API. प्रत्येक उत्पादनासाठी, प्रत्येक सामग्री प्रकारासाठी किंवा प्रत्येक ब्रँडसाठी एक इंजिन तयार करा. इंजिनमधून जाणाऱ्या प्रत्येक विनंतीवर, त्यात तुम्ही संरचीत केलेले सर्व काही प्राधान्याच्या निश्चित क्रमाने लागू होते:

| स्तर | तुम्ही काय संरचीत करता | दस्तऐवजांतून |
| --- | --- | --- |
| [LLM मॉडेल्स](https://lingo.dev/en/docs/platform/llm-models) | क्रमवारीनुसार पर्यायी पर्यायांसह, प्रत्येक भाषा-जोडी कोणते मॉडेल हाताळेल | 400+ मॉडेल्स; प्रतिसादात चाललेले मॉडेल नमूद केले जाते |
| [ब्रँडची भाषाशैली](https://lingo.dev/en/docs/platform/brand-voices) | तुमचे उत्पादन प्रत्येक भाषेत कसे बोलते — प्रत्येक लोकेलसाठी एक मजकूर | प्रत्येक बाजारासाठी टोन आणि औपचारिकता |
| [नियम](https://lingo.dev/en/docs/platform/rules) | सामान्य मॉडेलच्या नजरेतून सुटणारे भाषिक संकेत | स्पॅनिशमधील विशेषणाचे स्थान, टक्केवारी चिन्हांपूर्वीची मोकळी जागा |
| [शब्दसंग्रह](https://lingo.dev/en/docs/platform/glossaries) | अर्थानुसार जुळवले जाणारे, प्रत्येक लोकेलसाठीचे अचूक संज्ञा-मॅपिंग | युरोपीय बाजारांसाठी "911" चे "112" होते; उत्पादनांची नावे तशीच राहतात |
| [AI समीक्षक](https://lingo.dev/en/docs/platform/ai-reviewers) | प्रत्येक भाषांतरानंतर चालणारे गुणांकन | GEMBA गुण, BERTScore, शब्दसंग्रह अनुपालन |

शब्दसंग्रह, नियमसंच आणि ब्रँडची भाषाशैली तुमच्या संस्थेची मालमत्ता असतात, आणि इंजिन त्यांना जोडण्यांद्वारे लागू करते. एक शब्दसंग्रह पाच इंजिनांचे नियमन करू शकतो, आणि एकच बदल त्या पाचही इंजिनांपर्यंत पोहोचतो. बदल थेट वापरात येण्यापूर्वी [Playground](https://lingo.dev/en/docs/platform/playground) मध्ये त्याची चाचणी घ्या: एखाद्या इंजिनची कच्च्या मॉडेलशी किंवा दोन इंजिनांची समोरासमोर तुलना करा. ही इंजिने प्लॅटफॉर्मवर संरचीत केली जातात, जिथे स्थानिकीकरण संघ स्थानिकीकरणाची पायाभूत व्यवस्था चालवतो.

## कोडमधून तुमच्या इंजिनांपर्यंत पोहोचा

रिपॉझिटरीमधील सामग्रीचे भाषांतर करा. `lingo push` `.lingo/config.json` मध्ये नाव दिलेल्या इंजिनकडे फाइल्स पाठवते, आणि `lingo pull` कोणत्याही मशीनवरून भाषांतरे परत लिहिते:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

किंवा, आयडीने नाव देऊन इंजिनला थेट कॉल करा:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | तुमचा कोडिंग एजंट इंजिन तयार करतो, शब्दसंग्रहात संज्ञा जोडतो, नियमांमध्ये सूक्ष्म बदल करतो आणि समस्या जिथे समोर आली त्याच संभाषणातून दोन इंजिनांची तुलना करतो |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | टर्मिनल किंवा CI मधून स्रोत फाइल्स पुश करा, भाषांतरे पुल करा. अठरा स्वरूपे: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आणि Xcode स्ट्रिंग्स, SubRip, PHP |
| [CI/CD मधील Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI स्थापित करा आणि GitHub Actions, GitLab CI/CD, Bitbucket Pipelines किंवा Node.js 22+ असलेल्या कोणत्याही रनरमध्ये `lingo push` एक पायरी म्हणून चालवा |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एकदाच स्थापित करा आणि डीफॉल्ट शाखेवरील प्रत्येक push भाषांतरासाठी pull request उघडतो किंवा अद्ययावत करतो; किंवा स्रोत बदललेल्या pull request मध्ये भाषांतरे commit म्हणून येतात. रनर नाही, API key secret नाही, आणि व्यवस्थापित करण्यासाठी Lockfile नाही |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | प्रत्येक भाषा-जोडीसाठी एक समकालिक कॉल, किंवा एक असमकालिक जॉब जो एक विनंती अनेक लोकेल्समध्ये विभागतो आणि निष्कर्ष उपलब्ध होताच पोहोचवतो |

[तुमचे पहिले स्थानिकीकरण इंजिन तयार करा →](https://lingo.dev)
