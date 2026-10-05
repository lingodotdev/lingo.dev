<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – Lokalisierungs-Engineering-Plattform"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev ist die Lokalisierungs-Engineering-Plattform: der beste Weg, um
    Übersetzungsqualität zu messen, mit LLMs zu übersetzen und mit
    Muttersprachlern Korrektur zu lesen.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokumentation</a> •
  <a href="https://lingo.dev">Plattform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool des Monats"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Lizenz"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Letzter Commit"
    />
  </a>
</p>

---

## Teams entwickeln Lokalisierungs-Engines auf Lingo.dev

Eine [Lokalisierungs-Engine](https://lingo.dev/en/docs/platform/engines) ist eine zustandsbehaftete Übersetzungs-API, die Ihr Team konfiguriert und Lingo.dev ausführt. Erstellen Sie eine Engine pro Produkt, pro Inhaltstyp oder pro Marke. Jede Anfrage durch eine Engine wendet alles an, was Sie darin konfiguriert haben, in einer festen Reihenfolge der Priorität:

| Ebene                                                           | Was Sie konfigurieren                                                    | Aus der Dokumentation                                                        |
| --------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [LLM-Modelle](https://lingo.dev/en/docs/platform/llm-models)    | Welches Modell jedes Sprachpaar verarbeitet, mit priorisierten Fallbacks | 400+ Modelle; die Antwort nennt das Modell, das ausgeführt wurde             |
| [Markenstimme](https://lingo.dev/en/docs/platform/brand-voices) | Wie Ihr Produkt in jeder Sprache spricht, ein Text pro Locale            | Ton und Formalität pro Markt                                                 |
| [Regeln](https://lingo.dev/en/docs/platform/rules)              | Die sprachlichen Konventionen, die ein generisches Modell übersieht      | Adjektivstellung im Spanischen, ein Leerzeichen vor Prozentzeichen           |
| [Glossar](https://lingo.dev/en/docs/platform/glossaries)        | Exakte Begriffszuordnungen pro Locale, abgeglichen nach Bedeutung        | „911“ wird zu „112“ für europäische Märkte; Produktnamen bleiben unverändert |
| [KI-Reviewer](https://lingo.dev/en/docs/platform/ai-reviewers)  | Bewertung, die nach jeder Übersetzung ausgeführt wird                    | GEMBA-Scores, BERTScore, Glossar-Compliance                                  |

Glossare, Regelwerke und Markenstimmen gehören zu Ihrer Organisation, und eine Engine wendet sie durch Verknüpfung an. Ein Glossar steuert fünf Engines, und eine Bearbeitung erreicht alle fünf. Testen Sie eine Änderung im [Playground](https://lingo.dev/en/docs/platform/playground), bevor sie live geht: Vergleichen Sie eine Engine mit einem Rohmodell oder zwei Engines nebeneinander. Die Engines werden auf der Plattform konfiguriert, wo das Lokalisierungs-Team die Lokalisierungs-Infrastruktur betreibt.

## Greifen Sie aus Code auf Ihre Engines zu

Übersetzen Sie den Inhalt in einem Repository. `lingo push` sendet die Dateien an die in `.lingo/config.json` benannte Engine, und `lingo pull` schreibt die Übersetzungen von jedem Rechner zurück:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Oder rufen Sie eine Engine direkt auf, indem Sie sie über ihre ID benennen:

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

|                                                                        |                                                                                                                                                                                                                |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Ihr Coding-Agent erstellt eine Engine, fügt Glossarbegriffe hinzu, passt Regeln an und vergleicht zwei Engines – direkt aus der Konversation heraus, in der das Problem aufgetreten ist                        |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Laden Sie Quelldateien hoch und ziehen Sie Übersetzungen herunter, über ein Terminal oder aus CI. Achtzehn Formate: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android- und Xcode-Strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | Installieren Sie die CLI und führen Sie `lingo push` als Schritt in GitHub Actions, GitLab CI/CD, Bitbucket Pipelines oder jedem Runner mit Node.js 22+ aus                                                    |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Einmal installieren und bei jedem Push zum Standard-Branch wird ein Übersetzungs-Pull-Request geöffnet oder aktualisiert. Kein Runner, kein API-Key-Secret, keine Lockfile-Verwaltung                          |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Ein synchroner Aufruf pro Sprachpaar oder ein asynchroner Job, der eine Anfrage auf viele Locales verteilt und Ergebnisse liefert, sobald sie vorliegen                                                        |

[Erstellen Sie Ihre erste Lokalisierungs-Engine →](https://lingo.dev)
