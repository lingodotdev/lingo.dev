<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – உள்ளூர்மயமாக்கல் பொறியியல் தளம்" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev என்பது உள்ளூர்மயமாக்கல் பொறியியல் தளம்: மொழிபெயர்ப்பு தரத்தை அளவிடவும், LLMs மூலம் மொழிபெயர்க்கவும், தாய்மொழி பேசுபவர்களிடம் பிழைத்திருத்தம் செய்யவும் சிறந்த வழி.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ஆவணங்கள்</a> •
  <a href="https://lingo.dev">தளம்</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt மாதத்தின் #1 DevTool" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="உரிமம்" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="கடைசி commit" /></a>
</p>

---

## குழுக்கள் Lingo.dev-ல் உள்ளூர்மயமாக்கல் இயந்திரங்களை உருவாக்குகின்றன

ஒரு [உள்ளூர்மயமாக்கல் இயந்திரம்](https://lingo.dev/en/docs/platform/engines) என்பது உங்கள் குழு அமைத்து, Lingo.dev இயக்கும் நிலைதக்க மொழிபெயர்ப்பு API ஆகும். ஒவ்வொரு தயாரிப்பிற்கும், ஒவ்வொரு உள்ளடக்க வகைக்கும், அல்லது ஒவ்வொரு பிராண்டிற்கும் தனித்தனியாக ஒன்றை உருவாக்கலாம். ஒரு இயந்திரம் வழியாக வரும் ஒவ்வொரு கோரிக்கையும், அதில் நீங்கள் அமைத்த அனைத்தையும், முன்னுரிமைக்கான நிரந்தர வரிசைப்படி பயன்படுத்தும்:

| அடுக்கு | நீங்கள் அமைப்பது | ஆவணங்களில் இருந்து |
| --- | --- | --- |
| [LLM மாதிரிகள்](https://lingo.dev/en/docs/platform/llm-models) | ஒவ்வொரு மொழி ஜோடியையும் எந்த மாதிரி கையாள வேண்டும் என்பது, வரிசைப்படுத்தப்பட்ட மாற்று விருப்பங்களுடன் | 400+ மாதிரிகள்; இயங்கிய மாதிரியின் பெயர் பதிலில் காட்டப்படும் |
| [பிராண்ட் தொனி](https://lingo.dev/en/docs/platform/brand-voices) | ஒவ்வொரு மொழியிலும் உங்கள் தயாரிப்பு எப்படி பேச வேண்டும் என்பது, ஒவ்வொரு மொழிப்பிராந்தியத்திற்கும் ஒரு உரை | ஒவ்வொரு சந்தைக்கும் ஏற்ற தொனியும் மரியாதை அளவும் |
| [விதிகள்](https://lingo.dev/en/docs/platform/rules) | பொதுவான ஒரு மாதிரி தவறவிடும் மொழிநடை ஒழுங்குகள் | ஸ்பானிஷில் பெயரடையின் இடம், சதவீதக் குறிக்கு முன் ஒரு இடைவெளி |
| [சொற்களஞ்சியம்](https://lingo.dev/en/docs/platform/glossaries) | அர்த்தத்தின்படி பொருத்தப்படும், ஒவ்வொரு மொழிப்பிராந்தியத்திற்குமான துல்லியமான சொல் பொருத்தங்கள் | ஐரோப்பிய சந்தைகளில் "911" என்பது "112" ஆக மாறும்; தயாரிப்பு பெயர்கள் அப்படியே செல்லும் |
| [AI மதிப்பாய்வாளர்கள்](https://lingo.dev/en/docs/platform/ai-reviewers) | ஒவ்வொரு மொழிபெயர்ப்பிற்கும் பிறகு இயங்கும் மதிப்பீடு | GEMBA மதிப்பெண்கள், BERTScore, சொற்களஞ்சிய இணக்கம் |

சொற்களஞ்சியங்கள், விதித்தொகுப்புகள், மற்றும் பிராண்ட் தொனிகள் உங்கள் நிறுவனத்துக்குச் சொந்தமானவை; ஒரு இயந்திரம் அவற்றை இணைப்புகள் மூலம் பயன்படுத்துகிறது. ஒரு சொற்களஞ்சியம் ஐந்து இயந்திரங்களை நிர்வகிக்கலாம்; ஒரு திருத்தம் செய்தால் அந்த ஐந்திலும் அது உடனே செல்லும். மாற்றம் செயல்பாட்டுக்கு வருவதற்கு முன் அதை [Playground](https://lingo.dev/en/docs/platform/playground)-இல் சோதியுங்கள்: ஒரு இயந்திரத்தை மூல மாதிரியுடன் ஒப்பிடலாம், அல்லது இரண்டு இயந்திரங்களை பக்கப்பக்கமாக பார்க்கலாம். இயந்திரங்கள் தளத்திலேயே அமைக்கப்படுகின்றன; அங்கேயே உள்ளூர்மயமாக்கல் குழு தனது உள்ளூர்மயமாக்கல் உள்கட்டமைப்பை இயக்குகிறது.

## குறியீட்டிலிருந்தே உங்கள் இயந்திரங்களை அணுகுங்கள்

ஒரு repository-யில் உள்ள உள்ளடக்கத்தை மொழிபெயர்க்கவும். `lingo push`, `.lingo/config.json`-இல் குறிப்பிடப்பட்டுள்ள இயந்திரத்துக்கு கோப்புகளை அனுப்பும்; `lingo pull`, எந்தக் கணினியிலிருந்தும் மொழிபெயர்ப்புகளை மீண்டும் எழுதும்:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

அல்லது, ID-ஐக் குறிப்பிட்டு ஒரு இயந்திரத்தை நேரடியாக அழைக்கவும்:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | சிக்கல் தெரியவந்த அதே உரையாடலிலிருந்தே, உங்கள் குறியீட்டு உதவியாளர் ஒரு இயந்திரத்தை உருவாக்கி, சொற்களஞ்சிய சொற்களைச் சேர்த்து, விதிகளை நயப்படுத்தி, இரண்டு இயந்திரங்களை ஒப்பிடலாம் |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | மூல கோப்புகளை push செய்யவும், மொழிபெயர்ப்புகளை pull செய்யவும் — முனையத்திலிருந்தோ அல்லது CI-லிருந்தோ. பதினெட்டு வடிவங்கள்: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android மற்றும் Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI-ஐ நிறுவி, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, அல்லது Node.js 22+ உள்ள எந்த runner-லிலும் ஒரு படியாக `lingo push`-ஐ இயக்குங்கள் |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ஒருமுறை நிறுவினால், இயல்புநிலை branch-க்கு செல்லும் ஒவ்வொரு push-மும் ஒரு மொழிபெயர்ப்பு pull request-ஐத் திறக்கலாம் அல்லது புதுப்பிக்கலாம்; அல்லது source-ஐ மாற்றிய pull request-இலேயே மொழிபெயர்ப்புகள் commit ஆக வந்து சேரலாம். runner தேவையில்லை, API key ரகசியம் தேவையில்லை, நிர்வகிக்க Lockfile தேவையில்லை |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ஒவ்வொரு மொழி ஜோடிக்கும் ஒரு ஒத்திசைவு அழைப்பு, அல்லது ஒரு கோரிக்கையை பல மொழிப்பிராந்தியங்களுக்கு விரித்து, முடிவுகள் கிடைக்கும் போதே வழங்கும் ஒரு async பணி |

[உங்கள் முதல் உள்ளூர்மயமாக்கல் இயந்திரத்தை உருவாக்குங்கள் →](https://lingo.dev)
