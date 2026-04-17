<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – સ્થાનિકીકરણ એન્જિનિયરિંગ પ્લેટફોર્મ"
    />
  </a>
</p>

<p align="center">
  <strong>
    ઓપન-સોર્સ સ્થાનિકીકરણ એન્જિનિયરિંગ સાધનો. સુસંગત, ગુણવત્તાયુક્ત અનુવાદો માટે
    Lingo.dev સ્થાનિકીકરણ એન્જિનિયરિંગ પ્લેટફોર્મ સાથે જોડાઓ.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React માટે Lingo Compiler (પ્રારંભિક આલ્ફા)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Release"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## ઝડપી શરૂઆત

| સાધન                                               | તે શું કરે છે                                          | ઝડપી આદેશ                          |
| -------------------------------------------------- | ------------------------------------------------------ | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React એપ્લિકેશનો માટે AI-સહાયિત i18n સેટઅપ             | પ્રોમ્પ્ટ: `Set up i18n`           |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO ફાઇલોનું સ્થાનિકીકરણ કરો | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions માં સતત સ્થાનિકીકરણ                     | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n રેપર વગર બિલ્ડ-ટાઇમ React સ્થાનિકીકરણ             | `withLingo()` પ્લગઇન               |

### સ્થાનિકીકરણ એન્જિનો

આ સાધનો [સ્થાનિકીકરણ એન્જિનો](https://lingo.dev) સાથે જોડાય છે – સ્ટેટફુલ અનુવાદ API જે તમે Lingo.dev સ્થાનિકીકરણ એન્જિનિયરિંગ પ્લેટફોર્મ પર બનાવો છો. દરેક એન્જિન દરેક રિક્વેસ્ટમાં ગ્લોસરી, બ્રાન્ડ વૉઇસ અને લોકેલ-વિશિષ્ટ સૂચનાઓ જાળવી રાખે છે, જે [શબ્દકોશ ભૂલો 16.6–44.6% સુધી ઘટાડે છે](https://lingo.dev/research/retrieval-augmented-localization). અથવા [તમારું પોતાનું LLM લાવો](#lingodev-cli).

---

### Lingo.dev MCP

React એપ્લિકેશનોમાં i18n સેટઅપ કરવું ભૂલ-પ્રવણ છે – AI કોડિંગ સહાયકો પણ અસ્તિત્વમાં નથી એવા API વિશે ભ્રમણા કરે છે અને રૂટિંગ તોડે છે. Lingo.dev MCP, AI સહાયકોને Next.js, React Router અને TanStack Start માટે ફ્રેમવર્ક-વિશિષ્ટ i18n જ્ઞાનની સંરચિત ઍક્સેસ આપે છે. Claude Code, Cursor, GitHub Copilot Agents અને Codex સાથે કામ કરે છે.

[ડોક્સ વાંચો →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

એક આદેશમાં JSON, YAML, markdown, CSV અને PO ફાઇલોનું સ્થાનિકીકરણ કરો. લૉકફાઇલ શું પહેલેથી સ્થાનિકીકૃત થયું છે તે ટ્રૅક કરે છે – ફક્ત નવી અથવા બદલાયેલી સામગ્રી પ્રોસેસ થાય છે. Lingo.dev પર તમારા સ્થાનિકીકરણ એન્જિનને ડિફૉલ્ટ કરે છે, અથવા તમારું પોતાનું LLM લાવો (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[દસ્તાવેજો વાંચો →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

તમારી પાઇપલાઇનમાં સતત સ્થાનિકીકરણ. દરેક પુશ સ્થાનિકીકરણને ટ્રિગર કરે છે – કોડ ઉત્પાદનમાં પહોંચે તે પહેલાં ખૂટતી સ્ટ્રિંગ્સ ભરાઈ જાય છે. GitHub Actions, GitLab CI/CD અને Bitbucket Pipelines ને સપોર્ટ કરે છે.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[દસ્તાવેજો વાંચો →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

બેકએન્ડ કોડમાંથી સીધા તમારા સ્થાનિકીકરણ એન્જિનને કૉલ કરો. વેબહૂક ડિલિવરી સાથે સિંક્રનસ અને એસિંક સ્થાનિકીકરણ, લોકેલ દીઠ નિષ્ફળતા અલગીકરણ અને WebSocket દ્વારા રિયલ-ટાઇમ પ્રગતિ.

[દસ્તાવેજો વાંચો →](https://lingo.dev/en/docs/api)

---

### React માટે Lingo કમ્પાઇલર (પ્રારંભિક આલ્ફા)

i18n રેપર્સ વિના બિલ્ડ-ટાઇમ React સ્થાનિકીકરણ. સાદા અંગ્રેજી ટેક્સ્ટ સાથે કોમ્પોનન્ટ્સ લખો – કમ્પાઇલર ભાષાંતરિત કરી શકાય તેવી સ્ટ્રિંગ્સ શોધે છે અને બિલ્ડ સમયે સ્થાનિકીકૃત વેરિઅન્ટ્સ જનરેટ કરે છે. કોઈ ભાષાંતર કી નહીં, કોઈ JSON ફાઇલો નહીં, કોઈ `t()` ફંક્શન્સ નહીં. Next.js (App Router) અને Vite + React ને સપોર્ટ કરે છે.

[દસ્તાવેજો વાંચો →](https://lingo.dev/en/docs/react/compiler)

---

## યોગદાન

યોગદાન આવકાર્ય છે. કૃપા કરીને આ માર્ગદર્શિકાઓનું પાલન કરો:

1. **ઇશ્યૂઝ:** [બગ્સની જાણ કરો અથવા સુવિધાઓની વિનંતી કરો](https://github.com/lingodotdev/lingo.dev/issues)
2. **પુલ રિક્વેસ્ટ્સ:** [ફેરફારો સબમિટ કરો](https://github.com/lingodotdev/lingo.dev/pulls)
   - દરેક PR ને ચેન્જસેટની જરૂર છે: `pnpm new` (અથવા નોન-રિલીઝ ફેરફારો માટે `pnpm new:empty`)
   - સબમિટ કરતાં પહેલાં ટેસ્ટ પાસ થાય તેની ખાતરી કરો
3. **ડેવલપમેન્ટ:** આ pnpm + turborepo મોનોરેપો છે
   - ડિપેન્ડન્સીઝ ઇન્સ્ટોલ કરો: `pnpm install`
   - ટેસ્ટ ચલાવો: `pnpm test`
   - બિલ્ડ: `pnpm build`

**સપોર્ટ:** [Discord સમુદાય](https://lingo.dev/go/discord)

## સ્ટાર હિસ્ટ્રી

જો તમને Lingo.dev ઉપયોગી લાગે, તો અમને સ્ટાર આપો અને 10,000 સ્ટાર સુધી પહોંચવામાં અમારી મદદ કરો!

[

![સ્ટાર હિસ્ટ્રી ચાર્ટ](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## સ્થાનિકીકૃત દસ્તાવેજીકરણ

**ઉપલબ્ધ અનુવાદો:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**નવી ભાષા ઉમેરવી:**

1. [BCP-47 ફોર્મેટ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)નો ઉપયોગ કરીને [`i18n.json`](./i18n.json)માં લોકેલ કોડ ઉમેરો
2. પુલ રિક્વેસ્ટ સબમિટ કરો
