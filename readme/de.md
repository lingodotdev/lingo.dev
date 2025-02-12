<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ KI-Lokalisierungs-Toolkit für Web & Mobile, direkt aus der CI/CD-Pipeline.</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">Website</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">Mitmachen</a> •
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

Lingo.dev automatisiert die Software-Lokalisierung End-to-End mit modernsten LLM-Modellen.

Es erstellt sofort authentische Übersetzungen und eliminiert manuelle Arbeit und Verwaltungsaufwand. Die Lingo.dev Lokalisierungs-Engine versteht den Produktkontext und erstellt perfekte Übersetzungen, die Muttersprachler in über 60 Sprachen erwarten. Teams können dadurch 100-mal schneller lokalisieren, mit modernster Qualität, und Features an mehr zahlende Kunden weltweit ausliefern.

## 💫 Schnellstart

1. Erstelle einen Account auf [der Website](https://lingo.dev)

2. Initialisiere dein Projekt:

   ```bash
   npx lingo.dev@latest init
   ```

3. Schau dir unsere Docs an: [docs.lingo.dev](https://docs.lingo.dev)

4. Lokalisiere deine App (dauert nur Sekunden):
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev bietet eine GitHub Action zur Automatisierung der Lokalisierung in deiner CI/CD-Pipeline. Hier ist ein grundlegendes Setup:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Diese Action führt `lingo.dev i18n` bei jedem Push aus und hält deine Übersetzungen automatisch aktuell.

Für den Pull-Request-Modus und weitere Konfigurationsoptionen besuche unsere [GitHub Action Dokumentation](https://docs.lingo.dev/setup/gha).

## 🥇 Warum Teams sich für Lingo.dev entscheiden

- 🔥 **Sofortige Integration**: Setup in Minuten
- 🔄 **CI/CD Automation**: Nahtlose Integration in Dev-Pipelines
- 🌍 **60+ Sprachen**: Mühelose globale Expansion
- 🧠 **KI-Lokalisierungs-Engine**: Übersetzungen, die wirklich zu Ihrem Produkt passen
- 📊 **Format-Flexibel**: Unterstützt JSON, YAML, CSV, Markdown und mehr

## 🛠️ Leistungsstarke Features

- ⚡️ **Blitzschnell**: KI-Lokalisierung in Sekunden
- 🔄 **Auto-Updates**: Synchronisiert mit den neuesten Inhalten
- 🌟 **Native Qualität**: Authentisch klingende Übersetzungen
- 👨‍💻 **Developer-Friendly**: CLI, das sich in Ihren Workflow integriert
- 📈 **Skalierbar**: Für wachsende Startups und Enterprise-Teams

## 📚 Dokumentation

Detaillierte Anleitungen und API-Referenzen finden Sie in der [Dokumentation](https://lingo.dev/go/docs).

## 🤝 Mitmachen

Interesse am Mitwirken, auch wenn Sie kein Kunde sind?

Schauen Sie sich die [Good First Issues](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue) an und lesen Sie den [Leitfaden zum Mitwirken](./CONTRIBUTING.md).

## 👨‍💻 Team

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**
- **[Matej](https://github.com/mathio)**

Fragen oder Anfragen? E-Mail an veronica@lingo.dev

## 🌐 Readme in anderen Sprachen

- [English](https://github.com/lingodotdev/lingo.dev)
- [Spanisch](/readme/es.md)
- [Französisch](/readme/fr.md)
- [Russisch](/readme/ru.md)
- [Deutsch](/readme/de.md)
- [Chinesisch](/readme/zh-Hans.md)
- [Koreanisch](/readme/ko.md)
- [Japanisch](/readme/ja.md)
- [Italienisch](/readme/it.md)
- [Arabisch](/readme/ar.md)
- [Hindi](/readme/hi.md)

Siehst du deine Sprache nicht? Füge einfach einen neuen Sprachcode zur [`i18n.json`](./i18n.json) Datei hinzu und erstelle einen PR.
