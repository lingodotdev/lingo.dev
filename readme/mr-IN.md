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

## टीम्स Lingo.dev वर localization engine तयार करतात

[localization engine](https://lingo.dev/en/docs/platform/engines) ही एक stateful translation API आहे, जी तुमची टीम कॉन्फिगर करते आणि Lingo.dev चालवते. प्रत्येक उत्पादनासाठी, प्रत्येक content type साठी किंवा प्रत्येक brand साठी स्वतंत्र engine तयार करा. engine मधून जाणाऱ्या प्रत्येक request वर, त्यात तुम्ही कॉन्फिगर केलेल्या सर्व गोष्टी प्राधान्यक्रमाच्या निश्चित क्रमाने लागू होतात:

| स्तर | तुम्ही काय कॉन्फिगर करता | दस्तऐवजांमधून |
| --- | --- | --- |
| [LLM मॉडेल्स](https://lingo.dev/en/docs/platform/llm-models) | क्रमवारीनुसार fallback ठेवून, प्रत्येक language pair कोणते model हाताळेल | 400+ models; प्रतिसादात चालवलेल्या model चे नाव दिसते |
| [ब्रँडचा आवाज](https://lingo.dev/en/docs/platform/brand-voices) | तुमचे उत्पादन प्रत्येक भाषेत कसे बोलते, प्रत्येक locale साठी एक मजकूर | प्रत्येक बाजारासाठी tone आणि औपचारिकतेचा स्तर |
| [नियम](https://lingo.dev/en/docs/platform/rules) | सामान्य model च्या नजरेतून सुटणाऱ्या भाषिक पद्धती | स्पॅनिशमधील विशेषणाचे स्थान, टक्केवारीच्या चिन्हापूर्वीची जागा |
| [शब्दसंग्रह](https://lingo.dev/en/docs/platform/glossaries) | अर्थानुसार जुळवले जाणारे, प्रत्येक locale साठी अचूक संज्ञा mapping | युरोपीय बाजारांसाठी "911" चे "112" होते; उत्पादनांची नावे जशीच्या तशी राहतात |
| [AI पुनरावलोकक](https://lingo.dev/en/docs/platform/ai-reviewers) | प्रत्येक भाषांतरानंतर चालणारे scoring | GEMBA scores, BERTScore, glossary compliance |

Glossaries, rulesets आणि brand voices तुमच्या संस्थेच्या मालकीचे असतात, आणि engine त्यांना attachment द्वारे लागू करते. एक glossary पाच engines नियंत्रित करू शकते, आणि एक edit त्या सर्व पाचांपर्यंत पोहोचतो. बदल live होण्यापूर्वी [Playground](https://lingo.dev/en/docs/platform/playground) मध्ये तो तपासा: एखाद्या engine ची raw model शी किंवा दोन engines ची एकमेकांशी तुलना करा. engines प्लॅटफॉर्मवर कॉन्फिगर केले जातात, जिथे localization टीम localization infrastructure चालवते.

## कोडमधून तुमच्या engines पर्यंत पोहोचा

repository मधील content चे भाषांतर करा. `lingo push` `.lingo/config.json` मध्ये नाव दिलेल्या engine कडे files पाठवते, आणि `lingo pull` कोणत्याही machine वरून भाषांतरे परत लिहिते:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

किंवा engine ला त्याच्या ID ने थेट call करा:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ज्या संभाषणात समस्या समोर आली, त्याच संभाषणातून तुमचा coding agent engine तयार करतो, glossary terms जोडतो, rules tune करतो आणि दोन engines ची तुलना करतो |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal मधून किंवा CI मधून source files push करा आणि translations pull करा. अठरा formats: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android आणि Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI install करा आणि GitHub Actions, GitLab CI/CD, Bitbucket Pipelines किंवा Node.js 22+ असलेल्या कोणत्याही runner मध्ये `lingo push` एक step म्हणून चालवा |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | एकदाच install करा, आणि default branch वरील प्रत्येक push translation pull request उघडतो किंवा अपडेट करतो; किंवा source बदललेल्या pull request मध्ये translations commit म्हणून येतात. runner नाही, API key secret नाही, आणि व्यवस्थापित करायला lockfile नाही |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | प्रत्येक language pair साठी एक synchronous call, किंवा एक async job जी एक request अनेक locales मध्ये पाठवते आणि परिणाम मिळताच परत देते |

[तुमचे पहिले localization engine तयार करा →](https://lingo.dev)
