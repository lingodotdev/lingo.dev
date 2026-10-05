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

## ટીમો Lingo.dev પર localization engines બનાવે છે

[localization engine](https://lingo.dev/en/docs/platform/engines) એક stateful translation API છે, જેને તમારી ટીમ રૂપરેખાંકિત કરે છે અને Lingo.dev ચલાવે છે. દરેક પ્રોડક્ટ, દરેક content type અથવા દરેક બ્રાન્ડ માટે અલગ engine બનાવો. engine મારફતે જતી દરેક વિનંતી તેમાં તમે રૂપરેખાંકિત કરેલી દરેક સેટિંગને પ્રાધાન્યના નક્કી કરેલા ક્રમમાં લાગુ કરે છે:

| સ્તર | તમે શું રૂપરેખાંકિત કરો છો | ડૉક્સમાંથી |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | ક્રમબદ્ધ fallback સાથે, દરેક language pair માટે કયો model કામ કરે છે | 400+ models; responseમાં ચલાવાયેલા modelનું નામ આવે છે |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | દરેક ભાષામાં તમારું પ્રોડક્ટ કેવી રીતે બોલે છે, દરેક locale માટે એક લખાણ | દરેક બજાર માટે tone અને formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | ભાષાકીય પરંપરાઓ, જે સામાન્ય model ઘણીવાર ચૂકી જાય છે | Spanishમાં adjectiveનું સ્થાન, percentage signs પહેલાં space |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | અર્થના આધારે મેળ ખાતા, દરેક locale માટે ચોક્કસ term mappings | યુરોપિયન બજારો માટે "911" "112" બને છે; પ્રોડક્ટના નામો જેમના તેમ રહે છે |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | દરેક અનુવાદ પછી ચાલતું scoring | GEMBA scores, BERTScore, glossary compliance |

Glossaries, rulesets અને brand voices તમારી organizationની માલિકીની સંપત્તિ છે, અને engine તેમને attachment દ્વારા લાગુ કરે છે. એક glossary પાંચ enginesને સંચાલિત કરી શકે છે, અને એક ફેરફાર બધાં પાંચ સુધી પહોંચે છે. ફેરફાર live થાય તે પહેલાં [Playground](https://lingo.dev/en/docs/platform/playground)માં તેને ચકાસો: raw model સામે engineની તુલના કરો, અથવા બે enginesને બાજુબાજુ સરખાવો. engines પ્લેટફોર્મ પર રૂપરેખાંકિત થાય છે, જ્યાં localization ટીમ localization infrastructure ચલાવે છે.

## કોડમાંથી તમારા engines સુધી પહોંચો

repositoryમાં રહેલી સામગ્રીનું અનુવાદ કરો. `lingo push` `.lingo/config.json`માં નામ આપેલા engineને files મોકલે છે, અને `lingo pull` કોઈપણ machine પરથી translations પાછાં લખે છે:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

અથવા, ID દ્વારા નામ આપીને engineને સીધું કૉલ કરો:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | જે conversationમાં સમસ્યા સામે આવી હતી, એ જમાંથી તમારો coding agent engine બનાવે છે, glossary terms ઉમેરે છે, rules tune કરે છે અને બે enginesની તુલના કરે છે |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal અથવા CIમાંથી source files push કરો અને translations pull કરો. અઢાર formats: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android અને Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI ઇન્સ્ટોલ કરો અને GitHub Actions, GitLab CI/CD, Bitbucket Pipelines અથવા Node.js 22+ ધરાવતા કોઈપણ runnerમાં step તરીકે `lingo push` ચલાવો |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | એકવાર ઇન્સ્ટોલ કરો, પછી default branch પરનો દરેક push translation pull request ખોલે છે અથવા અપડેટ કરે છે, અથવા translations source બદલનારી pull requestમાં commit તરીકે આવી જાય છે. કોઈ runner નહીં, કોઈ API key secret નહીં, અને સંભાળવા માટે કોઈ Lockfile નહીં |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | દરેક language pair માટે એક synchronous call, અથવા એક async job જે એક વિનંતીને અનેક localesમાં fan out કરે છે અને પરિણામો મળતાં જાય તેમ પહોંચાડે છે |

[તમારું પહેલું localization engine બનાવો →](https://lingo.dev)
