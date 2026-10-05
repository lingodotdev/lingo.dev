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

## Lingo.dev-ல் localization engine-களை உருவாக்கும் அணிகள்

[localization engine](https://lingo.dev/en/docs/platform/engines) என்பது உங்கள் அணி அமைத்து, Lingo.dev இயக்கும் stateful translation API. ஒவ்வொரு தயாரிப்பிற்கும், ஒவ்வொரு உள்ளடக்க வகைக்கும், அல்லது ஒவ்வொரு பிராண்டிற்கும் தனித்தனியாக ஒன்றை உருவாக்கலாம். ஒரு engine வழியாக செல்லும் ஒவ்வொரு கோரிக்கையும், அதில் நீங்கள் அமைத்த அனைத்தையும் நிரந்தர முன்னுரிமை வரிசைப்படி பயன்படுத்தும்:

| அடுக்கு | நீங்கள் அமைப்பது | ஆவணங்களில் |
| --- | --- | --- |
| [LLM models](https://lingo.dev/en/docs/platform/llm-models) | ஒவ்வொரு மொழி ஜோடியையும் எந்த model கையாள வேண்டும், அதற்கான முன்னுரிமைப்படுத்தப்பட்ட fallback-களுடன் | 400+ models; எந்த model இயங்கியது என்பதை response-ல் குறிப்பிடும் |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | ஒவ்வொரு மொழியிலும் உங்கள் தயாரிப்பு எப்படி பேச வேண்டும் என்பது, ஒவ்வொரு locale-க்கும் ஒரு உரை | ஒவ்வொரு சந்தைக்கும் ஏற்ற tone மற்றும் formality |
| [Rules](https://lingo.dev/en/docs/platform/rules) | பொதுவான model தவறவிடக்கூடிய மொழிசார் நடைமுறைகள் | ஸ்பானிஷில் பெயரடையின் இடம், சதவீதக் குறிக்கு முன் ஒரு இடைவெளி |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | அர்த்தத்தின் அடிப்படையில் பொருத்தப்படும், ஒவ்வொரு locale-க்கும் துல்லியமான term mapping-கள் | ஐரோப்பிய சந்தைகளில் "911" என்பது "112" ஆக மாறும்; தயாரிப்பு பெயர்கள் அப்படியே செல்லும் |
| [AI reviewers](https://lingo.dev/en/docs/platform/ai-reviewers) | ஒவ்வொரு மொழிபெயர்ப்பிற்குப் பிறகும் இயங்கும் scoring | GEMBA மதிப்பெண்கள், BERTScore, glossary இணக்கம் |

Glossary-கள், ruleset-கள், மற்றும் brand voice-கள் உங்கள் organization-க்கு சொந்தமானவை; engine அவற்றை இணைப்பதன் மூலம் பயன்படுத்தும். ஒரு glossary ஐந்து engine-களை நிர்வகிக்கலாம்; ஒரு திருத்தம் செய்தாலே அந்த ஐந்திலும் அது சேரும். மாற்றத்தை live ஆகும் முன் [Playground](https://lingo.dev/en/docs/platform/playground)-இல் சோதிக்கலாம்: ஒரு engine-ஐ raw model-உடன் ஒப்பிடலாம், அல்லது இரண்டு engine-களை பக்கப்பக்கமாக பார்க்கலாம். localization infrastructure-ஐ localization அணி இயக்கும் அந்த platform-இல்தான் engine-கள் அமைக்கப்படுகின்றன.

## குறியீட்டிலிருந்தே உங்கள் engine-களை அணுகுங்கள்

ஒரு repository-யில் உள்ள உள்ளடக்கத்தை மொழிபெயர்க்கவும். `lingo push` `.lingo/config.json`-ல் பெயரிடப்பட்ட engine-க்கு கோப்புகளை அனுப்பும்; `lingo pull` எந்த machine-லிருந்தும் மொழிபெயர்ப்புகளை மீண்டும் எழுதும்:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

அல்லது, ID-யைக் குறிப்பிடித்து engine-ஐ நேரடியாக அழைக்கலாம்:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | பிரச்சினை வெளிப்பட்ட அதே உரையாடலிலிருந்தே, உங்கள் coding agent ஒரு engine-ஐ உருவாக்கி, glossary term-களைச் சேர்த்து, rules-ஐ செம்மைப்படுத்தி, இரண்டு engine-களை ஒப்பிடும் |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal-லிருந்தோ அல்லது CI-லிருந்தோ source கோப்புகளை push செய்து, மொழிபெயர்ப்புகளை pull செய்யுங்கள். 18 format-கள்: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android மற்றும் Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI-ஐ நிறுவி, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, அல்லது Node.js 22+ உள்ள எந்த runner-இலுமான ஒரு படியாக `lingo push`-ஐ இயக்குங்கள் |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | ஒருமுறை நிறுவினால் போதும்; அதன் பிறகு default branch-க்கு செய்யும் ஒவ்வொரு push-மும் translation pull request-ஐத் திறக்கும் அல்லது புதுப்பிக்கும். இல்லையெனில், source-ஐ மாற்றிய அதே pull request-இலேயே translations commit ஆக வந்து சேரும். runner தேவையில்லை, API key secret தேவையில்லை, நிர்வகிக்க lockfile-மும் தேவையில்லை |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | ஒவ்வொரு மொழி ஜோடிக்கும் ஒரு synchronous call, அல்லது ஒரு கோரிக்கையை பல locale-களுக்கு பிரித்து, முடிவுகள் கிடைக்கும் போதே வழங்கும் async job |

[உங்கள் முதல் localization engine-ஐ உருவாக்குங்கள் →](https://lingo.dev)
