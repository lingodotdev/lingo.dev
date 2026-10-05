<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – platforma inżynierii lokalizacji" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev to platforma inżynierii lokalizacji: najlepszy sposób, by mierzyć jakość tłumaczeń, tłumaczyć z użyciem LLM-ów i robić korektę z native speakerami.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokumentacja</a> •
  <a href="https://lingo.dev">Platforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool miesiąca" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licencja" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Ostatni commit" /></a>
</p>

---

## Zespoły budują silniki lokalizacyjne na Lingo.dev

[Silnik lokalizacyjny](https://lingo.dev/en/docs/platform/engines) to stanowe API tłumaczeniowe, które konfiguruje Twój zespół, a uruchamia Lingo.dev. Możesz utworzyć osobny silnik dla każdego produktu, typu treści lub marki. Każde żądanie przechodzące przez silnik stosuje wszystko, co w nim skonfigurowano, w ustalonej kolejności priorytetów:

| Warstwa | Co konfigurujesz | Z dokumentacji |
| --- | --- | --- |
| [Modele LLM](https://lingo.dev/en/docs/platform/llm-models) | Który model obsługuje każdą parę językową, wraz z uporządkowaną listą modeli zapasowych | Ponad 400 modeli; odpowiedź zawiera nazwę modelu, który został użyty |
| [Głos marki](https://lingo.dev/en/docs/platform/brand-voices) | Jak Twój produkt komunikuje się w każdym języku — po jednym tekście dla każdego języka | Ton i poziom formalności dla każdego rynku |
| [Zasady](https://lingo.dev/en/docs/platform/rules) | Konwencje językowe, które umykają modelom ogólnego przeznaczenia | Pozycja przymiotnika w hiszpańskim, spacja przed znakiem procentu |
| [Glosariusz](https://lingo.dev/en/docs/platform/glossaries) | Precyzyjne mapowanie terminów dla każdego języka, dopasowywane według znaczenia | "911" zmienia się w "112" na rynkach europejskich; nazwy produktów przechodzą bez zmian |
| [Recenzenci AI](https://lingo.dev/en/docs/platform/ai-reviewers) | Ocena uruchamiana po każdym tłumaczeniu | Oceny GEMBA, BERTScore, zgodność z glosariuszem |

Glosariusze, zestawy zasad i głosy marki należą do Twojej organizacji, a silnik stosuje je po podpięciu. Jeden glosariusz może obsługiwać pięć silników, a jedna zmiana trafia do wszystkich pięciu. Przetestuj zmianę w [Playground](https://lingo.dev/en/docs/platform/playground), zanim trafi do użycia: porównaj silnik z surowym modelem albo zestaw dwa silniki obok siebie. Silniki konfiguruje się na platformie, gdzie zespół lokalizacyjny zarządza infrastrukturą lokalizacyjną.

## Korzystaj ze swoich silników bezpośrednio w kodzie

Przetłumacz treści w repozytorium. `lingo push` wysyła pliki do silnika wskazanego w `.lingo/config.json`, a `lingo pull` zapisuje tłumaczenia z powrotem na dowolnej maszynie:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Możesz też wywołać silnik bezpośrednio, podając jego identyfikator:

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

|| |
| --- | --- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Twój agent programistyczny tworzy silnik, dodaje terminy do glosariusza, dostraja zasady i porównuje dwa silniki — bez wychodzenia z rozmowy, w której pojawił się problem |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Wysyłaj pliki źródłowe i pobieraj tłumaczenia z terminala lub z CI. Osiemnaście formatów: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, ciągi znaków Android i Xcode, SubRip, PHP |
| [Lingo.dev w CI/CD](https://lingo.dev/en/docs/workflows) | Zainstaluj CLI i uruchom `lingo push` jako krok w GitHub Actions, GitLab CI/CD, Bitbucket Pipelines lub w dowolnym runnerze z Node.js 22+ |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Zainstaluj raz, a każdy push do domyślnej gałęzi otworzy lub zaktualizuje pull request z tłumaczeniem albo doda tłumaczenia jako commit do pull requestu, który zmienił źródło. Bez runnera, bez sekretu klucza API, bez zarządzania Lockfile |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Jedno synchroniczne wywołanie na parę językową albo zadanie asynchroniczne, które rozsyła jedno żądanie do wielu języków i dostarcza wyniki, gdy tylko są gotowe |

[Zbuduj swój pierwszy silnik lokalizacyjny →](https://lingo.dev)
