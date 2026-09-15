<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – piattaforma di ingegneria della localizzazione"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev è la piattaforma di ingegneria della localizzazione: il modo
    migliore per misurare la qualità delle traduzioni, tradurre con LLM e
    revisionare con madrelingua.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Documentazione</a> •
  <a href="https://lingo.dev">Piattaforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="DevTool n. 1 del mese su Product Hunt"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Licenza"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Ultimo commit"
    />
  </a>
</p>

---

## I team costruiscono motori di localizzazione su Lingo.dev

Un [motore di localizzazione](https://lingo.dev/en/docs/platform/engines) è un'API di traduzione con stato che il tuo team configura e Lingo.dev esegue. Creane uno per prodotto, per tipo di contenuto o per brand. Ogni richiesta attraverso un motore applica tutto ciò che hai configurato, in un ordine di precedenza fisso:

| Livello                                                           | Cosa configuri                                                          | Dalla documentazione                                                               |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [Modelli LLM](https://lingo.dev/en/docs/platform/llm-models)      | Quale modello gestisce ogni coppia linguistica, con fallback gerarchici | Oltre 400 modelli; la risposta indica il modello utilizzato                        |
| [Voce del brand](https://lingo.dev/en/docs/platform/brand-voices) | Come parla il tuo prodotto in ogni lingua, un testo per locale          | Tono e formalità per ogni mercato                                                  |
| [Regole](https://lingo.dev/en/docs/platform/rules)                | Le convenzioni linguistiche che un modello generico non coglie          | Posizione degli aggettivi in spagnolo, spazio prima dei segni di percentuale       |
| [Glossario](https://lingo.dev/en/docs/platform/glossaries)        | Corrispondenze esatte dei termini per locale, abbinate per significato  | "911" diventa "112" per i mercati europei; i nomi dei prodotti rimangono invariati |
| [Revisori AI](https://lingo.dev/en/docs/platform/ai-reviewers)    | Valutazione che viene eseguita dopo ogni traduzione                     | Punteggi GEMBA, BERTScore, conformità al glossario                                 |

Glossari, set di regole e voci del brand appartengono alla tua organizzazione, e un motore li applica tramite collegamento. Un glossario governa cinque motori, e una modifica raggiunge tutti e cinque. Testa una modifica nel [Playground](https://lingo.dev/en/docs/platform/playground) prima che diventi operativa: confronta un motore con un modello grezzo, oppure due motori fianco a fianco. I motori vengono configurati sulla piattaforma, dove il team di localizzazione gestisce l'infrastruttura di localizzazione.

## Raggiungi i tuoi motori dal codice

Traduci il contenuto di un repository. `lingo push` invia i file al motore specificato in `.lingo/config.json`, e `lingo pull` scrive le traduzioni da qualsiasi macchina:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Oppure chiama un motore direttamente, specificandolo per ID:

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

|                                                                        |                                                                                                                                                                                    |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Il tuo agente di codifica crea un motore, aggiunge termini del glossario, ottimizza le regole e confronta due motori, direttamente dalla conversazione in cui è emerso il problema |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Carica file sorgente, scarica traduzioni, da terminale o da CI. Diciotto formati: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, stringhe Android e Xcode, SubRip, PHP         |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | Installa la CLI ed esegui `lingo push` come step in GitHub Actions, GitLab CI/CD, Bitbucket Pipelines, o qualsiasi runner con Node.js 22+                                          |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Installa una volta e ogni push sul branch predefinito apre o aggiorna una pull request di traduzione. Nessun runner, nessun segreto per chiave API, nessun lockfile da gestire     |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Una chiamata sincrona per coppia di lingue, o un job asincrono che distribuisce una richiesta a molte lingue e consegna i risultati man mano che arrivano                          |

[Costruisci il tuo primo motore di localizzazione →](https://lingo.dev)
