# 🎬 Echtzeit-Videoübersetzung von Untertiteln

System zur Echtzeit-Übersetzung von Videountertiteln mittels [`lingo.dev`](https://lingo.dev/) SDK. Konzipiert mit Monorepo-Architektur: Frontend auf Vercel, WebSocket-Übersetzungsserver auf Render.

## Problemstellung

Ein globales Lebensmittelunternehmen möchte internationale Märkte erschließen. Ihre Website und Videoinhalte einschließlich UI-Text, SEO-Inhalte und lebensmittelbezogene Videos müssen mehrere Sprachen unterstützen.

Derzeit sind alle Videoinhalte auf Englisch, und die manuelle Übersetzung von Untertiteln für jedes Video ist zeitaufwändig und kostspielig. Das Unternehmen sucht eine KI-gestützte Lösung, die:

- Website-UI automatisch in mehrere Sprachen übersetzt

- Videountertitel in Echtzeit generiert und übersetzt

- SEO-freundliche mehrsprachige Inhalte gewährleistet

Ziel ist es, Zeit zu sparen, Kosten zu reduzieren und ein nahtloses mehrsprachiges Erlebnis zu bieten, ohne das Übersetzungsteam zu erweitern.

![lingo.video Screenshot auf Hindi](desktop.png)

## Inhaltsverzeichnis

- [Installation](#getting-started)
- [lingo.video Demo](https://lingo-video.vercel.app/)
- [Echtzeit-Videoübersetzung von Untertiteln: Architektur und Technologie-Stack](./docs/live-translation-architecture.md)
- [Auswirkungen & Vorteile für globale Unternehmen](#impact--benefits-for-global-companies)
- [Funktionen](#features)
- [Herausforderungen bei Echtzeit-Übersetzung & unsere Lösungen](#challenges-with-real-time-translation--how-we-solve-them)
- [Was kommt als Nächstes?](./docs/what-is-next.md)
- [Autor](#author)
- [Lizenz](#license)

## Getting Started

1. Repository klonen
```
git clone https://github.com/ShubhamOulkar/lingo.video.git
cd lingo.video
```
2. Abhängigkeiten installieren
```
pnpm install
```
3. lingo.dev API-Schlüssel von [`lingo.dev`](https://lingo.dev/) beziehen
4. `.env` Datei erstellen und `LINGODOTDEV_API_KEY` speichern
5. Frontend und WebSocket-Server gleichzeitig starten
```
pnpm dev
```

## Auswirkungen & Vorteile für globale Unternehmen

Dieses System bietet konkrete Vorteile für Organisationen, insbesondere globale Lebensmittel- und Lieferunternehmen:

- `Keine VTT-Dateipflege`: Keine Notwendigkeit, .vtt-Untertiteldateien für jede Sprache manuell zu erstellen oder zu speichern.

- `Reduzierte Datenbank- und Speicherkosten`: Untertitel werden spontan generiert und übersetzt, sodass Unternehmen nicht für die Speicherung mehrerer Sprachdateien zahlen müssen.

- `Minimaler Entwickleraufwand`: Kein zusätzlicher Entwicklungsaufwand für die Pflege mehrsprachiger Videoinhalte erforderlich.

- `Früher Markteintritt`: Videos können in Tagen statt Monaten bereitgestellt werden, was die globale Reichweite beschleunigt.

- `Unbegrenzte Sprachunterstützung`: KI-gestützte Übersetzung ermöglicht den Zugang zu jedem Land der Welt.

- `Fokus auf Produkt, nicht Übersetzung`: Teams können sich auf die Verbesserung des Kernprodukts konzentrieren, während das System mehrsprachige Inhalte automatisch verarbeitet.

## Funktionen

- **Echtzeit-Untertitelübersetzung**  
  - Übersetzt Videountertitel spontan mit [`lingo.dev`](https://lingo.dev/en/sdk) SDK und einem WebSocket-Server.  
  - Keine Notwendigkeit, `.vtt`-Dateien für mehrere Sprachen zu pflegen.
  > Hinweis: Dieses Repository enthält [.vtt-Dateien](./apps/next-app/public/subtitles/emotions.hi.vtt) für manuelle Genauigkeitstests. Sie können dies testen, indem Sie auf `CC` klicken und mit der Live-Übersetzung vergleichen.

- **UI-Übersetzung in React**  
  - React-UI aktualisiert sich automatisch mit [`Lingo Compiler`](https://lingo.dev/en/compiler) ⚡🤖.  
  - Dynamische Sprachkompilierung ohne hartcodierte Übersetzungen.  

- **SEO-freundliche mehrsprachige Inhalte**  
  - Generiert automatisch Meta-Tags und Open Graph (OG)-Tags mit [`Lingo CLI`](https://lingo.dev/en/cli).  
  - Vollständig automatisierbar über CI/CD-Pipelines.
  > Hinweis: Überprüfen Sie OG-Karten für Hindi [hier](https://opengraph.dev/panel?url=https%3A%2F%2Flingo-video.vercel.app%2Fhi) 

- **Zeit- und Kosteneffizienz**  
  - Reduziert Entwickleraufwand und eliminiert externe Übersetzer.  
  - Mehrsprachige Inhalte in **Tagen statt Monaten** bereitstellen.  

- **Unbegrenzte Sprachunterstützung**  
  - KI-gestützte Übersetzung ermöglicht weltweite Reichweite.  
  - Einfaches Hinzufügen neuer Sprachen ohne manuelle Arbeit.  

- **Fokus auf Produkt, nicht Übersetzung**  
  - Teams können sich auf die Verbesserung des Kernprodukts konzentrieren, während Übersetzungen automatisch erfolgen.  

- **Skaliert mit Videovolumen**  
  - Kann große Anzahl von Videos ohne zusätzliche Infrastruktur oder Wartung verarbeiten.

- **Anpassung an bevorzugtes System-Theme** 
  - Website kann sich automatisch an das vom Benutzer bevorzugte helle oder dunkle Theme anpassen.

## Herausforderungen bei Echtzeit-Übersetzung & unsere Lösungsansätze

Echtzeit-Übersetzungssysteme stehen vor diversen technischen und betrieblichen Herausforderungen. Dieses Projekt wurde mit produktionsreifen Lösungen konzipiert, um Latenz zu minimieren, Übersetzungskosten zu reduzieren und konsistente Genauigkeit bei umfangreichen Videoinhalten zu gewährleisten.

### ⚠️ Kernherausforderungen

1. **Netzwerklatenz**: Echtzeit-Übersetzung erfordert schnelle WebSocket-Kommunikation. Jede Netzwerkinstabilität kann Untertitel-Updates verzögern.

2. **LLM-Token-Generierungsverzögerung**: Die Übersetzungsqualität hängt von der Geschwindigkeit der Token-Generierung des LLM ab. Hohe Last oder umfangreiche Untertitel können die Antwortzeit erhöhen. Lingo SDK unterstützt kein Streaming.

3. **Redundante Übersetzungskosten**: Viele Untertitel wiederholen denselben Text in verschiedenen Videos. Ohne Optimierung wird dieselbe Token-Generierung mehrfach berechnet.

4. **Kaltstart-Probleme**: Serverlose Bereitstellungen können langsame Startzeiten aufweisen, was die Echtzeit-Untertitellieferung beeinträchtigt.

5. **Skalierung bei hohem Datenverkehr**: Mehrere Nutzer, die gleichzeitig Videos ansehen, können Übersetzungs- oder Socket-Server überlasten, wenn diese nicht optimiert sind.

## Autor

- [LinkedIn](www.linkedin.com/in/shubham-oulkar)
- [Frontend Mentor](https://www.frontendmentor.io/profile/ShubhamOulkar)
- [X](https://x.com/shubhuoulkar)

## Lizenz

Von [shubham oulkar](https://github.com/ShubhamOulkar) eingereichte Inhalte sind unter der Creative Commons Attribution 4.0 International lizenziert, wie in der [LICENSE](/LICENSE)-Datei zu finden.

## 🌐 Readme in anderen Sprachen

[हिंदी](./docs/hi.md) • [日本語](./docs/ja.md) • [Français](./docs/fr.md) • [Deutsch](./docs/de.md) • [Español](./docs/es.md)