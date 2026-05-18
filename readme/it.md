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
    Strumenti open-source di ingegneria della localizzazione. Connettiti alla
    piattaforma di ingegneria della localizzazione Lingo.dev per traduzioni
    coerenti e di qualità.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">API Lingo</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">CLI Lingo</a> •
  <a href="#lingodev-cicd">Azione GitHub Lingo</a> •
  <a href="#lingodev-compiler">Compilatore Lingo per React (Alpha iniziale)</a>
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
      alt="Licenza"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Ultimo commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool del mese"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool della settimana"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 prodotto del giorno"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Trending su Github"
    />
  </a>
</p>

---

## Quick start

| Strumento                                             | Cosa fa                                                  | Comando rapido                     |
| ----------------------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)                  | Configurazione i18n assistita da AI per app React        | Prompt: `Set up i18n`              |
| [**CLI Lingo**](#lingodev-cli)                        | Localizza file JSON, YAML, markdown, CSV, PO             | `npx lingo.dev@latest run`         |
| [**Azione GitHub Lingo**](#lingodev-cicd)             | Localizzazione continua in GitHub Actions                | `uses: lingodotdev/lingo.dev@main` |
| [**Compilatore Lingo per React**](#lingodev-compiler) | Localizzazione React in fase di build senza wrapper i18n | Plugin `withLingo()`               |

### Motori di localizzazione

Questi strumenti si connettono ai [motori di localizzazione](https://lingo.dev) – API di traduzione stateful che crei sulla piattaforma di ingegneria della localizzazione Lingo.dev. Ogni motore conserva glossari, tono di marca e istruzioni per locale in ogni richiesta, [riducendo gli errori terminologici del 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). Oppure [porta il tuo LLM](#lingodev-cli).

---

### Lingo.dev MCP

Configurare i18n nelle app React è soggetto a errori – anche gli assistenti di codifica AI allucinano API inesistenti e rompono il routing. Lingo.dev MCP fornisce agli assistenti AI accesso strutturato alla conoscenza i18n specifica per framework come Next.js, React Router e TanStack Start. Funziona con Claude Code, Cursor, GitHub Copilot Agents e Codex.

[Leggi la documentazione →](https://lingo.dev/en/mcp)

---

### CLI Lingo.dev

Localizza file JSON, YAML, markdown, CSV e PO con un solo comando. Un lockfile tiene traccia di ciò che è già localizzato – solo i contenuti nuovi o modificati vengono elaborati. Utilizza di default il tuo motore di localizzazione su Lingo.dev, oppure porta il tuo LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Leggi la documentazione →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Localizzazione continua nella tua pipeline. Ogni push attiva la localizzazione: le stringhe mancanti vengono completate prima che il codice arrivi in produzione. Supporta GitHub Actions, GitLab CI/CD e Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Leggi la documentazione →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Chiama il tuo motore di localizzazione direttamente dal codice backend. Localizzazione sincrona e asincrona con consegna webhook, isolamento dei fallimenti per locale e avanzamento in tempo reale tramite WebSocket.

[Leggi la documentazione →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler per React (Alpha iniziale)

Localizzazione React a tempo di build senza wrapper i18n. Scrivi componenti con testo in inglese semplice: il compilatore rileva le stringhe traducibili e genera varianti localizzate a tempo di build. Niente chiavi di traduzione, niente file JSON, niente funzioni `t()`. Supporta Next.js (App Router) e Vite + React.

[Leggi la documentazione →](https://lingo.dev/en/docs/react/compiler)

---

## Come contribuire

I contributi sono benvenuti. Segui queste linee guida:

1. **Segnalazioni:** [Segnala bug o richiedi funzionalità](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Request:** [Invia modifiche](https://github.com/lingodotdev/lingo.dev/pulls)
   - Ogni PR richiede un changeset: `pnpm new` (o `pnpm new:empty` per modifiche che non richiedono rilascio)
   - Assicurati che i test passino prima di inviare
3. **Sviluppo:** Questo è un monorepo pnpm + turborepo
   - Installa le dipendenze: `pnpm install`
   - Esegui i test: `pnpm test`
   - Build: `pnpm build`

**Supporto:** [Community Discord](https://lingo.dev/go/discord)

## Storico delle stelle

Se trovi Lingo.dev utile, regalaci una stella e aiutaci a raggiungere 10.000 stelle!

[

![Grafico storico delle stelle](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentazione Localizzata

**Traduzioni disponibili:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Aggiunta di una nuova lingua:**

1. Aggiungi il codice locale a [`i18n.json`](./i18n.json) utilizzando il [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Invia una pull request
