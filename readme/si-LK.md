<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – ස්ථානීයකරණ ඉංජිනේරු වේදිකාව" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev යනු ස්ථානීයකරණ ඉංජිනේරු වේදිකාවයි: පරිවර්තන ගුණාත්මකභාවය මැනීමට, LLMs සමඟ පරිවර්තනය කිරීමට, සහ ස්වදේශීය කථිකයන් සමඟ සෝදුපත් කිරීමට ඇති හොඳම ක්‍රමය.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">ලේඛන</a> •
  <a href="https://lingo.dev">වේදිකාව</a> •
  <a href="https://lingo.dev/go/discord">ඩිස්කෝඩ්</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt මාසයේ #1 සංවර්ධක මෙවලම" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="බලපත්‍රය" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="අවසන් commit" /></a>
</p>

---

## කණ්ඩායම් Lingo.dev මත ස්ථානීයකරණ එන්ජින් ගොඩනඟයි

[ස්ථානීයකරණ එන්ජිනයක්](https://lingo.dev/en/docs/platform/engines) කියන්නේ ඔබේ කණ්ඩායම වින්‍යාස කරන, Lingo.dev ක්‍රියාත්මක කරන, තත්ත්වය රඳවාගන්නා පරිවර්තන API එකක්. නිෂ්පාදනයකට එකක්, අන්තර්ගත වර්ගයකට එකක්, හෝ වෙළඳ නාමයකට එකක් ලෙස ගොඩනඟන්න. එන්ජිනයක් හරහා යන සෑම ඉල්ලීමකටම, එහි ඔබ වින්‍යාස කළ සියල්ල ස්ථිර ප්‍රමුඛතා අනුපිළිවෙළකට අනුව යෙදේ:

| ස්තරය | ඔබ වින්‍යාස කරන දේ | ලේඛන අනුව |
| --- | --- | --- |
| [LLM මාදිලි](https://lingo.dev/en/docs/platform/llm-models) | ශ්‍රේණිගත fallback සමඟ, එක් එක් භාෂා යුගලය හසුරුවන මාදිලිය | මාදිලි 400+; ක්‍රියාත්මක වූ මාදිලියේ නම ප්‍රතිචාරයේ සඳහන් වේ |
| [වෙළඳ නාම හඬ](https://lingo.dev/en/docs/platform/brand-voices) | එක් එක් භාෂාවෙන් ඔබේ නිෂ්පාදනය කතා කරන ආකාරය, එක් එක් ප්‍රාදේශිකයට වෙනම පෙළක් | වෙළඳපොළ අනුව ස්වරය සහ විධිමත්භාවය |
| [නීති](https://lingo.dev/en/docs/platform/rules) | සාමාන්‍ය මාදිලියකට මඟහැරෙන භාෂාමය සම්මතයන් | ස්පාඤ්ඤ භාෂාවේ විශේෂණ පිහිටීම, ප්‍රතිශත ලකුණුට පෙර හිස් තැනක් |
| [පදකෝෂය](https://lingo.dev/en/docs/platform/glossaries) | අර්ථය අනුව ගැළපෙන, එක් එක් ප්‍රාදේශිකයට නිරවද්‍ය පද සිතියම්කරණය | යුරෝපීය වෙළඳපොළ සඳහා "911" යන්න "112" වෙයි; නිෂ්පාදන නාම එලෙසම තබාගනී |
| [AI සමාලෝචකයන්](https://lingo.dev/en/docs/platform/ai-reviewers) | සෑම පරිවර්තනයකටම පසු ක්‍රියාත්මක වන ලකුණුකරණය | GEMBA ලකුණු, BERTScore, පදකෝෂ අනුකූලතාව |

පදකෝෂ, නීති කට්ටල, සහ වෙළඳ නාම හඬ ඔබේ සංවිධානයට අයිති වන අතර, එන්ජිනයක් ඒවා බැඳීම මඟින් යොදයි. එක් පදකෝෂයක් එන්ජින් පහක් පාලනය කළ හැකි අතර, එක් සංස්කරණයක් ඒ පහටම ළඟා වේ. වෙනසක් සජීවී වීමට පෙර [Playground](https://lingo.dev/en/docs/platform/playground) තුළ එය පරීක්ෂා කරන්න: එන්ජිනයක් raw model එකක් සමඟ සසඳන්න, හෝ එන්ජින් දෙකක් අසල අසලින් බලන්න. එන්ජින් වින්‍යාස කරන්නේ ස්ථානීයකරණ කණ්ඩායම ස්ථානීයකරණ යටිතල පහසුකම් ක්‍රියාත්මක කරන වේදිකාව තුළය.

## කේතයෙන්ම ඔබේ එන්ජින් වෙත ළඟා වන්න

කෝෂාගාරයක ඇති අන්තර්ගතය පරිවර්තනය කරන්න. `lingo push` මඟින් `.lingo/config.json` තුළ නම් කර ඇති එන්ජිනය වෙත ගොනු යවයි, සහ `lingo pull` මඟින් ඕනෑම යන්ත්‍රයකින් පරිවර්තන නැවත ලියයි:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

නැත්නම්, ID එක සඳහන් කරමින් එන්ජිනයක් සෘජුවම අමතන්න:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | ගැටලුව මතු වූ ඒම සංවාදය තුළම, ඔබේ කේත ලිවීමේ නියෝජිතයා එන්ජිනයක් සාදයි, පදකෝෂ පද එකතු කරයි, නීති සුසර කරයි, සහ එන්ජින් දෙකක් සසඳයි |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | මූලාශ්‍ර ගොනු push කරන්න, පරිවර්තන pull කරන්න—ටර්මිනලයකින් හෝ CI වෙතින්. ආකෘති 18ක්: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android සහ Xcode strings, SubRip, PHP |
| [CI/CD තුළ Lingo.dev](https://lingo.dev/en/docs/workflows) | CLI ස්ථාපනය කර, GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, හෝ Node.js 22+ ඇති ඕනෑම runner එකක පියවරක් ලෙස `lingo push` ධාවනය කරන්න |
| [Lingo.dev GitHub යෙදුම](https://lingo.dev/en/docs/workflows/github-app) | එක් වරක් ස්ථාපනය කරන්න. එවිට පෙරනිමි ශාඛාවට යවන සෑම push එකක්ම පරිවර්තන pull request එකක් විවෘත කරයි හෝ යාවත්කාලීන කරයි, නැත්නම් මූලාශ්‍රය වෙනස් කළ pull request එක තුළම පරිවර්තන commit එකක් ලෙස ගොඩබසී. runner එකක් නැහැ, API යතුරු රහසක් නැහැ, කළමනාකරණය කිරීමට Lockfile එකක් නැහැ |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | සෑම භාෂා යුගලයකටම එක් සමකාලීන ඇමතුමක්, හෝ එක් ඉල්ලීමක් ප්‍රාදේශික ගණනාවකට බෙදා හැර ප්‍රතිඵල ලැබෙන සැණින් ලබාදෙන async කාර්යයක් |

[ඔබේ පළමු ස්ථානීයකරණ එන්ජිනය ගොඩනඟන්න →](https://lingo.dev)
