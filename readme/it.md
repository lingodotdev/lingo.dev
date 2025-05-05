<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CLI open-source potenziato da IA per la localizzazione di web e mobile.</strong>
</p>

<br />

<p align="center">
  <a href="https://docs.lingo.dev">Documentazione</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuisci</a> •
  <a href="#-github-action">GitHub Action</a> •
  <a href="#">Aggiungi una stella al repository</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
</p>

<br />

Lingo.dev è un CLI open-source guidato dalla community per la localizzazione di app web e mobile potenziata dall'IA.

Lingo.dev è progettato per produrre traduzioni autentiche istantaneamente, eliminando il lavoro manuale e l'overhead di gestione. Di conseguenza, i team eseguono localizzazioni accurate 100 volte più velocemente, distribuendo funzionalità a più utenti soddisfatti in tutto il mondo. Può essere utilizzato con il proprio LLM o con il Motore di Localizzazione gestito da Lingo.dev.

> **Curiosità poco nota:** Lingo.dev è nato come piccolo progetto in un hackathon studentesco nel 2023! Dopo numerose iterazioni, siamo stati accettati in Y Combinator nel 2024, e ora stiamo assumendo! Interessati a costruire gli strumenti di localizzazione di nuova generazione? Invia il tuo CV a careers@lingo.dev! 🚀

## 📑 In questa guida

- [Avvio rapido](#-quickstart) - Inizia in pochi minuti
- [Caching](#-caching-with-i18nlock) - Ottimizza gli aggiornamenti delle traduzioni
- [GitHub Action](#-github-action) - Automatizza la localizzazione in CI/CD
- [Funzionalità](#-supercharged-features) - Cosa rende Lingo.dev potente
- [Documentazione](#-documentation) - Guide dettagliate e riferimenti
- [Contribuisci](#-contribute) - Unisciti alla nostra community

## 💫 Avvio rapido

Il CLI di Lingo.dev è progettato per funzionare sia con il tuo LLM personale, sia con il Motore di Localizzazione gestito da Lingo.dev costruito sui più recenti LLM SOTA (state-of-the-art).

### Utilizzando il tuo LLM (BYOK o Bring Your Own Key)

1. Crea un file di configurazione `i18n.json`:

```json
{
  "version": 1.5,
  "provider": {
    "id": "anthropic",
    "model": "claude-3-7-sonnet-latest",
    "prompt": "Stai traducendo testo da {source} a {target}."
  },
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Imposta la tua chiave API come variabile d'ambiente:

```bash
export ANTHROPIC_API_KEY=your_anthropic_api_key

# oppure per OpenAI

export OPENAI_API_KEY=your_openai_api_key
```

3. Esegui la localizzazione:

```bash
npx lingo.dev@latest i18n
```

### Utilizzo di Lingo.dev Cloud

Spesso, le applicazioni di livello professionale richiedono funzionalità come memoria di traduzione, supporto per glossari e controllo qualità della localizzazione. Inoltre, a volte, desideri che un esperto decida per te quale provider LLM e modello utilizzare, e che aggiorni automaticamente il modello quando ne vengono rilasciati di nuovi. Lingo.dev è un motore di localizzazione gestito che offre queste funzionalità:

1. Crea un file di configurazione `i18n.json` (senza il nodo provider):

```json
{
  "version": 1.5,
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  }
}
```

2. Autenticati con Lingo.dev:

```bash
npx lingo.dev@latest auth --login
```

3. Esegui la localizzazione:

```bash
npx lingo.dev@latest i18n
```

## 📖 Documentazione

Per guide dettagliate e riferimenti API, visita la [documentazione](https://lingo.dev/go/docs).

## 🔒 Caching con `i18n.lock`

Lingo.dev utilizza un file `i18n.lock` per tenere traccia dei checksum dei contenuti, assicurando che solo il testo modificato venga tradotto. Questo migliora:

- ⚡️ **Velocità**: Salta i contenuti già tradotti
- 🔄 **Coerenza**: Previene ritraduzioni non necessarie
- 💰 **Costo**: Nessun addebito per traduzioni ripetute

## 🤖 GitHub Action

Lingo.dev offre una GitHub Action per automatizzare la localizzazione nella pipeline CI/CD. Ecco una configurazione di base:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Questa action esegue `lingo.dev i18n` ad ogni push, mantenendo le traduzioni aggiornate automaticamente.

Per la modalità pull request e altre opzioni di configurazione, visita la nostra [documentazione GitHub Action](https://docs.lingo.dev/ci-action/gha).

## ⚡️ I superpoteri di Lingo.dev

- 🔥 **Integrazione istantanea**: Funziona con il tuo codice in pochi minuti
- 🔄 **Automazione CI/CD**: Configuralo e dimenticatene
- 🌍 **Portata globale**: Distribuisci ai tuoi utenti ovunque
- 🧠 **Basato su AI**: Utilizza i più recenti modelli linguistici per traduzioni naturali
- 📊 **Indipendente dal formato**: JSON, YAML, CSV, Markdown, Android, iOS e molti altri
- 🔍 **Diff puliti**: Preserva esattamente la struttura dei tuoi file
- ⚡️ **Velocità fulminea**: Traduzioni in secondi, non giorni
- 🔄 **Sempre sincronizzato**: Si aggiorna automaticamente quando il contenuto cambia
- 🌟 **Qualità umana**: Traduzioni che non sembrano robotiche
- 👨‍💻 **Creato da sviluppatori, per sviluppatori**: Lo usiamo noi stessi quotidianamente
- 📈 **Cresce con te**: Dal progetto personale alla scala enterprise

## 🤝 Contribuisci

Lingo.dev è guidato dalla community, quindi accogliamo con piacere tutti i contributi!

Hai un'idea per una nuova funzionalità? Crea un issue su GitHub!

Vuoi contribuire? Crea una pull request!

## 🌐 Readme in altre lingue

- [English](https://github.com/lingodotdev/lingo.dev)
- [Chinese](/readme/zh-Hans.md)
- [Japanese](/readme/ja.md)
- [Korean](/readme/ko.md)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)
- [Bengali](/readme/bn.md)

Non vedi la tua lingua? Aggiungi semplicemente un nuovo codice lingua al file [`i18n.json`](./i18n.json) e apri una PR!
