<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – உள்ளூர்மயமாக்கல் பொறியியல் தளம்"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev என்பது உள்ளூர்மயமாக்கல் பொறியியல் தளம்: மொழிபெயர்ப்பு தரத்தை
    அளவிடவும், LLM களுடன் மொழிபெயர்க்கவும், மற்றும் சொந்த மொழி பேசுபவர்களுடன்
    சரிபார்க்கவும் சிறந்த வழி.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ஆவணங்கள்</a> •
  <a href="https://lingo.dev">தளம்</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt மாதத்தின் #1 DevTool"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="உரிமம்"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="கடைசி commit"
    />
  </a>
</p>

---

## குழுக்கள் Lingo.dev இல் உள்ளூர்மயமாக்கல் இயந்திரங்களை உருவாக்குகின்றன

[உள்ளூர்மயமாக்கல் இயந்திரம்](https://lingo.dev/en/docs/platform/engines) என்பது உங்கள் குழு கட்டமைக்கும் மற்றும் Lingo.dev இயக்கும் ஒரு நிலையான மொழிபெயர்ப்பு API ஆகும். ஒவ்வொரு தயாரிப்புக்கும், உள்ளடக்க வகைக்கும் அல்லது பிராண்டுக்கும் ஒன்றை உருவாக்குங்கள். ஒரு இயந்திரம் வழியாக செல்லும் ஒவ்வொரு கோரிக்கையும் நீங்கள் அதில் கட்டமைத்த அனைத்தையும் நிலையான முன்னுரிமை வரிசையில் பயன்படுத்துகிறது:

| அடுக்கு                                                                 | நீங்கள் கட்டமைப்பது                                                                 | ஆவணங்களிலிருந்து                                                                      |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [LLM மாதிரிகள்](https://lingo.dev/en/docs/platform/llm-models)          | ஒவ்வொரு மொழி ஜோடியையும் எந்த மாதிரி கையாளுகிறது, தரவரிசைப்படுத்தப்பட்ட மாற்றுகளுடன் | 400+ மாதிரிகள்; பதில் இயங்கிய மாதிரியின் பெயரைக் குறிப்பிடுகிறது                      |
| [பிராண்ட் குரல்](https://lingo.dev/en/docs/platform/brand-voices)       | ஒவ்வொரு மொழியிலும் உங்கள் தயாரிப்பு எப்படி பேசுகிறது, ஒவ்வொரு இடத்திற்கும் ஒரு உரை  | சந்தைக்கு ஏற்ற தொனியும் முறைமையும்                                                    |
| [விதிகள்](https://lingo.dev/en/docs/platform/rules)                     | பொதுவான மாதிரி தவறவிடும் மொழியியல் மரபுகள்                                          | ஸ்பானிஷில் பெயரடை நிலை, சதவீதக் குறியீடுகளுக்கு முன் இடைவெளி                          |
| [சொற்களஞ்சியம்](https://lingo.dev/en/docs/platform/glossaries)          | ஒவ்வொரு இடத்திற்கும் துல்லியமான சொல் மேப்பிங்குகள், பொருளின்படி பொருந்துகிறது       | "911" ஐரோப்பிய சந்தைகளுக்கு "112" ஆக மாறுகிறது; தயாரிப்பு பெயர்கள் மாறாமல் செல்கின்றன |
| [AI மதிப்பாய்வாளர்கள்](https://lingo.dev/en/docs/platform/ai-reviewers) | ஒவ்வொரு மொழிபெயர்ப்புக்குப் பிறகும் இயங்கும் மதிப்பீடு                              | GEMBA மதிப்பெண்கள், BERTScore, சொற்களஞ்சிய இணக்கம்                                    |

சொற்களஞ்சியங்கள், விதிகள் தொகுப்புகள் மற்றும் பிராண்ட் குரல்கள் உங்கள் நிறுவனத்திற்கு சொந்தமானவை, மேலும் ஒரு இயந்திரம் அவற்றை இணைப்பின் மூலம் பயன்படுத்துகிறது. ஒரு சொற்களஞ்சியம் ஐந்து இயந்திரங்களை நிர்வகிக்கிறது, மேலும் ஒரு திருத்தம் ஐந்தையும் சென்றடைகிறது. நேரலையில் செல்வதற்கு முன் [Playground](https://lingo.dev/en/docs/platform/playground) இல் ஒரு மாற்றத்தை சோதித்துப் பாருங்கள்: ஒரு இயந்திரத்தை மூல மாதிரிக்கு எதிராக, அல்லது இரண்டு இயந்திரங்களை அருகருகே ஒப்பிடுங்கள். இயந்திரங்கள் தளத்தில் கட்டமைக்கப்படுகின்றன, அங்கு உள்ளூர்மயமாக்கல் குழு உள்ளூர்மயமாக்கல் உள்கட்டமைப்பை இயக்குகிறது.

## குறியீட்டிலிருந்து உங்கள் என்ஜின்களை அணுகவும்

களஞ்சியத்தில் உள்ள உள்ளடக்கத்தை மொழிபெயர்க்கவும். `lingo push` கோப்புகளை `.lingo/config.json` இல் குறிப்பிட்ட என்ஜினுக்கு அனுப்புகிறது, மேலும் `lingo pull` எந்த இயந்திரத்திலிருந்தும் மொழிபெயர்ப்புகளை மீண்டும் எழுதுகிறது:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

அல்லது ID மூலம் குறிப்பிட்டு என்ஜினை நேரடியாக அழைக்கவும்:

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

|                                                                        |                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | உங்கள் கோடிங் ஏஜென்ட் ஒரு என்ஜினை உருவாக்குகிறது, சொற்களஞ்சிய சொற்களைச் சேர்க்கிறது, விதிகளை டியூன் செய்கிறது, மற்றும் இரண்டு என்ஜின்களை ஒப்பிடுகிறது—பிரச்சனை எழுந்த உரையாடலிலிருந்தே                                 |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | மூல கோப்புகளைப் புஷ் செய்யுங்கள், மொழிபெயர்ப்புகளை புல் செய்யுங்கள், டெர்மினல் அல்லது CI இலிருந்து. பதினெட்டு வடிவங்கள்: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android மற்றும் Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI ஐ நிறுவவும் மற்றும் `lingo push` ஐ GitHub Actions, GitLab CI/CD, Bitbucket Pipelines அல்லது Node.js 22+ கொண்ட எந்த ரன்னரிலும் ஒரு படியாக இயக்கவும்                                                                 |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ஒருமுறை நிறுவவும், இயல்புநிலை கிளைக்கான ஒவ்வொரு புஷ்ஷும் ஒரு மொழிபெயர்ப்பு புல் கோரிக்கையைத் திறக்கிறது அல்லது புதுப்பிக்கிறது. ரன்னர் இல்லை, API கீ ரகசியம் இல்லை, நிர்வகிக்க லாக்ஃபைல் இல்லை                         |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | ஒரு மொழி ஜோடிக்கு ஒரு ஒத்திசைவான அழைப்பு, அல்லது ஒரு கோரிக்கையை பல மொழிகளுக்கு விரிவுபடுத்தி முடிவுகளை அவை வந்தவுடன் வழங்கும் async வேலை                                                                               |

[உங்கள் முதல் உள்ளாக்க என்ஜினைக் கட்டமைக்கவும் →](https://lingo.dev)