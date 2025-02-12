<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Toolkit di localizzazione AI per web e mobile, direttamente dal CI/CD.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">Website</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Contribuisci</a> •
  <a href="#-github-action">GitHub Action</a>
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

Lingo.dev automatizza la localizzazione del software end-to-end utilizzando i più recenti modelli LLM.

Produce traduzioni autentiche istantaneamente, eliminando il lavoro manuale e l'overhead di gestione. Il motore di localizzazione di Lingo.dev comprende il contesto del prodotto, creando traduzioni perfezionate che i madrelingua si aspettano in oltre 60 lingue. Di conseguenza, i team eseguono la localizzazione 100 volte più velocemente, con una qualità all'avanguardia, distribuendo funzionalità a più clienti paganti in tutto il mondo.

## 💫 Avvio rapido

1. Crea un account sul [sito web](https://lingo.dev)

2. Inizializza il tuo progetto:

   ```bash
   npx lingo.dev@latest init
   ```

3. Consulta la nostra documentazione: [docs.lingo.dev](https://docs.lingo.dev)

4. Localizza la tua app (richiede pochi secondi):
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev offre una GitHub Action per automatizzare la localizzazione nella tua pipeline CI/CD. Ecco una configurazione base:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Questa action esegue `lingo.dev i18n` ad ogni push, mantenendo le tue traduzioni automaticamente aggiornate.

Per la modalità pull request e altre opzioni di configurazione, visita la nostra [documentazione GitHub Action](https://docs.lingo.dev/setup/gha).

## 🥇 Perché i team scelgono Lingo.dev

- 🔥 **Integrazione istantanea**: Setup in pochi minuti
- 🔄 **Automazione CI/CD**: Integrazione perfetta nel pipeline di sviluppo
- 🌍 **Oltre 60 lingue**: Espansione globale senza sforzo
- 🧠 **Motore di localizzazione AI**: Traduzioni che si adattano perfettamente al tuo prodotto
- 📊 **Flessibilità nei formati**: Supporto per JSON, YAML, CSV, Markdown e altro

## 🛠️ Funzionalità potenziate

- ⚡️ **Ultra veloce**: Localizzazione AI in pochi secondi
- 🔄 **Aggiornamenti automatici**: Sincronizzazione con i contenuti più recenti
- 🌟 **Qualità nativa**: Traduzioni che suonano autentiche
- 👨‍💻 **Developer-friendly**: CLI che si integra nel tuo workflow
- 📈 **Scalabile**: Per startup in crescita e team enterprise

## 📚 Documentazione

Per guide dettagliate e riferimenti API, visita la [documentazione](https://lingo.dev/go/docs).

## 🤝 Contribuisci

Interessato a contribuire, anche se non sei un cliente?

Dai un'occhiata alle [Good First Issues](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) e leggi la [Guida per contribuire](./CONTRIBUTING.md).

## 👨‍💻 Team

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**
- **[Matej](https://github.com/mathio)**

Domande o richieste? Scrivi a veronica@lingo.dev

## 🌐 Readme in altre lingue

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanish](/readme/es.md)
- [French](/readme/fr.md)
- [Russian](/readme/ru.md)
- [German](/readme/de.md)
- [Chinese](/readme/zh-Hans.md)
- [Korean](/readme/ko.md)
- [Japanese](/readme/ja.md)
- [Italian](/readme/it.md)
- [Arabic](/readme/ar.md)
- [Hindi](/readme/hi.md)

Non vedi la tua lingua? Aggiungi semplicemente un nuovo codice lingua al file [`i18n.json`](./i18n.json) e apri una PR.
