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

## I team creano motori di localizzazione su Lingo.dev

Un [motore di localizzazione](https://lingo.dev/en/docs/platform/engines) è un'API di traduzione con stato che il tuo team configura e che Lingo.dev esegue. Puoi crearne uno per ogni prodotto, tipo di contenuto o brand. Ogni richiesta che passa attraverso un motore applica tutto ciò che hai configurato al suo interno, seguendo un ordine di precedenza fisso:

| Livello | Cosa configuri | Dalla documentazione |
| --- | --- | --- |
| [Modelli LLM](https://lingo.dev/en/docs/platform/llm-models) | Quale modello gestisce ogni coppia di lingue, con fallback in ordine di priorità | Oltre 400 modelli; la risposta indica quale modello è stato usato |
| [Voce del brand](https://lingo.dev/en/docs/platform/brand-voices) | Come il tuo prodotto si esprime in ogni lingua, con un testo per ogni impostazione locale | Tono e grado di formalità per ogni mercato |
| [Regole](https://lingo.dev/en/docs/platform/rules) | Le convenzioni linguistiche che un modello generico tende a non cogliere | La posizione dell'aggettivo in spagnolo, lo spazio prima del simbolo di percentuale |
| [Glossario](https://lingo.dev/en/docs/platform/glossaries) | Corrispondenze esatte dei termini per ogni impostazione locale, abbinate per significato | "911" diventa "112" per i mercati europei; i nomi dei prodotti restano invariati |
| [Revisori AI](https://lingo.dev/en/docs/platform/ai-reviewers) | Valutazioni eseguite dopo ogni traduzione | Punteggi GEMBA, BERTScore, conformità al glossario |

Glossari, set di regole e voci del brand appartengono alla tua organizzazione, e un motore li applica tramite collegamento. Un solo glossario può governare cinque motori, e una modifica raggiunge tutti e cinque. Prova una modifica nel [Playground](https://lingo.dev/en/docs/platform/playground) prima che vada in produzione: confronta un motore con un modello puro oppure due motori affiancati. I motori si configurano sulla piattaforma, dove il team di localizzazione gestisce l'infrastruttura di localizzazione.

## Usa i tuoi motori dal codice

Traduci i contenuti in un repository. `lingo push` invia i file al motore indicato in `.lingo/config.json` e `lingo pull` riscrive le traduzioni da qualsiasi macchina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Oppure richiama un motore direttamente, indicandone l'ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Il tuo agente di coding crea un motore, aggiunge termini al glossario, ottimizza le regole e confronta due motori direttamente dalla conversazione in cui è emerso il problema |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Invia i file sorgente e recupera le traduzioni da un terminale o da CI. Diciotto formati: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, stringhe Android e Xcode, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | Installa la CLI ed esegui `lingo push` come passaggio in GitHub Actions, GitLab CI/CD, Bitbucket Pipelines o in qualsiasi runner con Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Basta installarla una volta: ogni push sul branch predefinito apre o aggiorna una pull request di traduzione, oppure le traduzioni arrivano come commit nella pull request che ha modificato il sorgente. Nessun runner, nessun segreto API, nessun Lockfile da gestire |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Una chiamata sincrona per ogni coppia di lingue, oppure un job asincrono che distribuisce una richiesta su più impostazioni locali e restituisce i risultati man mano che arrivano |

[Crea il tuo primo motore di localizzazione →](https://lingo.dev)
