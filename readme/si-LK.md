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

## කණ්ඩායම් Lingo.dev මත දේශීයකරණ එන්ජින් ගොඩනඟයි

[දේශීයකරණ එන්ජිමක්](https://lingo.dev/en/docs/platform/engines) කියන්නේ ඔබේ කණ්ඩායම සකස් කරන, Lingo.dev ක්‍රියාත්මක කරන, තත්ත්වය රඳවාගන්නා පරිවර්තන API එකක්. නිෂ්පාදනයකට එකක්, අන්තර්ගත වර්ගයකට එකක්, හෝ වෙළඳ නාමයකට එකක් ලෙස එන්ජින් ගොඩනඟන්න. එන්ජිමක් හරහා යවන සෑම ඉල්ලීමකටම, එහි ඔබ සකස් කළ සියල්ල ස්ථිර ප්‍රමුඛතා අනුපිළිවෙලකට අනුව යොදනු ලැබේ:

| ස්තරය | ඔබ සකස් කරන දේ | ලේඛන අනුව |
| --- | --- | --- |
| [LLM ආකෘති](https://lingo.dev/en/docs/platform/llm-models) | ශ්‍රේණිගත fallback සමඟ, එක් එක් භාෂා යුගලය හසුරුවන්නේ කුමන ආකෘතියද | ආකෘති 400+; ප්‍රතිචාරයේ ධාවනය වූ ආකෘතියේ නම සඳහන් වේ |
| [වෙළඳ නාම හඬ](https://lingo.dev/en/docs/platform/brand-voices) | එක් එක් භාෂාවෙන් ඔබේ නිෂ්පාදනය කතා කරන ආකාරය, එක් ලොකේල් එකකට එක් පෙළක් | වෙළඳපොළ අනුව ස්වරය සහ විධිමත්භාවය |
| [නීති](https://lingo.dev/en/docs/platform/rules) | සාමාන්‍ය ආකෘතියකට මඟහැරෙන භාෂාමය සම්මුති | ස්පාඤ්ඤ භාෂාවේ විශේෂණ පිහිටීම, ප්‍රතිශත ලකුණු වලට පෙර හිස්තැනක් |
| [Glossary](https://lingo.dev/en/docs/platform/glossaries) | අර්ථය අනුව ගැළපෙන, locale අනුව නිශ්චිත පද සමානකිරීම් | යුරෝපීය වෙළඳපොළ සඳහා "911" "112" බවට පත්වේ; නිෂ්පාදන නාම එලෙසම පවතී |
| [AI සමාලෝචකයන්](https://lingo.dev/en/docs/platform/ai-reviewers) | සෑම පරිවර්තනයකටම පසුව ක්‍රියාත්මක වන ලකුණු කිරීම | GEMBA ලකුණු, BERTScore, glossary අනුකූලතාව |

Glossary, ruleset, සහ brand voice ඔබේ සංවිධානයට අයිති වන අතර, එන්ජිමක් ඒවා අමුණාගැනීමෙන් යොදයි. එක් glossary එකක් එන්ජින් පහක් පාලනය කළ හැකි අතර, එක් සංස්කරණයක් එම පහම වෙත ළඟා වේ. වෙනසක් සජීවී කිරීමට පෙර [Playground](https://lingo.dev/en/docs/platform/playground) තුළ එය පරීක්ෂා කරන්න: එන්ජිමක් raw model එකක් සමඟ හෝ එන්ජින් දෙකක් එකිනෙකට අසළින් සසඳන්න. දේශීයකරණ කණ්ඩායම දේශීයකරණ යටිතල පහසුකම් ක්‍රියාත්මක කරන වේදිකාව මතම මෙම එන්ජින් සකස් කරයි.

## කේතයෙන් ඔබේ එන්ජින් වෙත ළඟා වන්න

repository එකක අන්තර්ගතය පරිවර්තනය කරන්න. `lingo push` මඟින් ගොනු `.lingo/config.json` හි නම් කර ඇති එන්ජිම වෙත යවයි, `lingo pull` නම් ඕනෑම යන්ත්‍රයකින් පරිවර්තන ආපසු ලියයි:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

නැතහොත්, ID එකෙන් නම් කරමින් එන්ජිමක් සෘජුවම අමතන්න:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ගැටලුව මතු වූ ඒ සංවාදයෙන්ම, ඔබේ coding agent එන්ජිමක් සාදයි, glossary පද එක් කරයි, නීති සුසර කරයි, සහ එන්ජින් දෙකක් සසඳයි |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | terminal එකකින් හෝ CI වෙතින් source ගොනු push කරන්න, පරිවර්තන pull කරන්න. ආකෘති 18ක්: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android සහ Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI ස්ථාපනය කර GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, හෝ Node.js 22+ සහිත ඕනෑම runner එකක පියවරක් ලෙස `lingo push` ධාවනය කරන්න |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | එක් වරක් ස්ථාපනය කළාම, default branch වෙත කරන සෑම push එකක්ම පරිවර්තන pull request එකක් විවෘත කරයි හෝ යාවත්කාලීන කරයි. නැතහොත් source වෙනස් කළ pull request එක තුළම commit එකක් ලෙස පරිවර්තන පැමිණේ. කළමනාකරණය කිරීමට runner එකක් නැත, API key secret එකක් නැත, Lockfile එකක් නැත |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | එක් භාෂා යුගලයකට එක් සමකාලීන call එකක්, හෝ එක් ඉල්ලීමක් බොහෝ locale වෙත පැතිරවා ප්‍රතිඵල ලැබෙන විටම භාරදෙන async job එකක් |

[ඔබේ පළමු දේශීයකරණ එන්ජිම ගොඩනඟන්න →](https://lingo.dev)
