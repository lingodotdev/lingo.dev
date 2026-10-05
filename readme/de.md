<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – Plattform für Lokalisierungs-Engineering" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev ist die Plattform für Lokalisierungs-Engineering: der beste Weg, Übersetzungsqualität zu messen, mit LLMs zu übersetzen und mit Muttersprachlern Korrektur zu lesen.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokumentation</a> •
  <a href="https://lingo.dev">Plattform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt Nr. 1 DevTool des Monats" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Lizenz" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Letzter Commit" /></a>
</p>

---

## Teams entwickeln Lokalisierungs-Engines auf Lingo.dev

Eine [Lokalisierungs-Engine](https://lingo.dev/en/docs/platform/engines) ist eine zustandsbehaftete Übersetzungs-API, die Ihr Team konfiguriert und Lingo.dev ausführt. Erstellen Sie je eine pro Produkt, Inhaltstyp oder Marke. Jede Anfrage über eine Engine wendet alles an, was Sie darin konfiguriert haben – in einer festen Reihenfolge der Priorität:

| Ebene | Was Sie konfigurieren | Aus der Dokumentation |
| --- | --- | --- |
| [LLM-Modelle](https://lingo.dev/en/docs/platform/llm-models) | Welches Modell jedes Sprachenpaar verarbeitet – mit priorisierten Fallbacks | Über 400 Modelle; die Antwort nennt das Modell, das verwendet wurde |
| [Markenstimme](https://lingo.dev/en/docs/platform/brand-voices) | Wie Ihr Produkt in jeder Sprache klingt, mit je einem Text pro Sprache | Ton und Formalitätsgrad pro Markt |
| [Regeln](https://lingo.dev/en/docs/platform/rules) | Sprachliche Konventionen, die ein generisches Modell leicht übersieht | Adjektivstellung im Spanischen, ein Leerzeichen vor Prozentzeichen |
| [Glossar](https://lingo.dev/en/docs/platform/glossaries) | Exakte Begriffszuordnungen pro Sprache, nach Bedeutung abgeglichen | "911" wird für europäische Märkte zu "112"; Produktnamen bleiben unverändert |
| [KI-Bewerter](https://lingo.dev/en/docs/platform/ai-reviewers) | Scoring, das nach jeder Übersetzung läuft | GEMBA-Scores, BERTScore, Glossarkonformität |

Glossare, Regelsätze und Markenstimmen gehören zu Ihrer Organisation, und eine Engine wendet sie über eine Verknüpfung an. Ein Glossar steuert fünf Engines, und eine einzige Änderung erreicht alle fünf. Testen Sie eine Änderung im [Playground](https://lingo.dev/en/docs/platform/playground), bevor sie live geht: Vergleichen Sie eine Engine mit einem Rohmodell oder zwei Engines Seite an Seite. Konfiguriert werden die Engines auf der Plattform, auf der das Lokalisierungsteam die Lokalisierungsinfrastruktur betreibt.

## Greifen Sie aus dem Code auf Ihre Engines zu

Übersetzen Sie die Inhalte in einem Repository. `lingo push` sendet die Dateien an die in `.lingo/config.json` angegebene Engine, und `lingo pull` schreibt die Übersetzungen von jedem Rechner aus zurück:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Oder rufen Sie eine Engine direkt auf – per ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Ihr Coding-Agent erstellt eine Engine, fügt Glossarbegriffe hinzu, justiert Regeln und vergleicht zwei Engines – direkt in der Unterhaltung, in der das Problem aufgetaucht ist |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Quell-Dateien pushen, Übersetzungen pullen – aus dem Terminal oder aus CI. Achtzehn Formate: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android- und Xcode-Strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | Installieren Sie die CLI und führen Sie `lingo push` als Schritt in GitHub Actions, GitLab CI/CD, Bitbucket Pipelines oder auf einem beliebigen Runner mit Node.js 22+ aus |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Einmal installieren, und jeder Push auf den Standard-Branch öffnet oder aktualisiert einen Übersetzungs-Pull-Request – oder die Übersetzungen landen als Commit im Pull-Request, der die Quelle geändert hat. Kein Runner, kein API-Key-Secret, kein Lockfile, das Sie verwalten müssen |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Ein synchroner Aufruf pro Sprachenpaar oder ein asynchroner Job, der eine Anfrage auf viele Sprachen verteilt und Ergebnisse liefert, sobald sie vorliegen |

[Erstellen Sie Ihre erste Lokalisierungs-Engine →](https://lingo.dev)
