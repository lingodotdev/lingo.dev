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

## Zespoły budują silniki lokalizacyjne na Lingo.dev

[Silnik lokalizacyjny](https://lingo.dev/en/docs/platform/engines) to stanowe API tłumaczeniowe, które konfiguruje Twój zespół, a uruchamia Lingo.dev. Możesz stworzyć osobny silnik dla każdego produktu, typu treści lub marki. Każde żądanie przechodzące przez silnik uwzględnia wszystko, co w nim skonfigurowano, w ustalonej kolejności priorytetów:

| Warstwa | Co konfigurujesz | Z dokumentacji |
| --- | --- | --- |
| [Modele LLM](https://lingo.dev/en/docs/platform/llm-models) | Który model obsługuje każdą parę językową, wraz z uporządkowaną listą modeli zapasowych | Ponad 400 modeli; odpowiedź zawiera nazwę modelu, który został użyty |
| [Brand voice](https://lingo.dev/en/docs/platform/brand-voices) | Jak Twój produkt komunikuje się w każdym języku — po jednym tekście dla każdego locale | Ton i poziom formalności dla każdego rynku |
| [Reguły](https://lingo.dev/en/docs/platform/rules) | Konwencje językowe, które łatwo umykają ogólnym modelom | Pozycja przymiotnika w hiszpańskim, spacja przed znakiem procentu |
| [Glosariusz](https://lingo.dev/en/docs/platform/glossaries) | Precyzyjne mapowanie terminów dla każdego locale, dopasowywane według znaczenia | „911” zmienia się w „112” na rynkach europejskich; nazwy produktów pozostają bez zmian |
| [Recenzenci AI](https://lingo.dev/en/docs/platform/ai-reviewers) | Ocena uruchamiana po każdym tłumaczeniu | Oceny GEMBA, BERTScore, zgodność z glosariuszem |

Glosariusze, zbiory reguł i brand voice należą do Twojej organizacji, a silnik stosuje je przez przypisanie. Jeden glosariusz może obsługiwać pięć silników, a jedna zmiana trafia do wszystkich pięciu. Przetestuj zmianę w [Playground](https://lingo.dev/en/docs/platform/playground), zanim trafi na produkcję: porównaj silnik z surowym modelem albo zestaw dwa silniki obok siebie. Silniki konfiguruje się na platformie, gdzie zespół lokalizacyjny zarządza całą infrastrukturą lokalizacyjną.

## Korzystaj ze swoich silników bezpośrednio w kodzie

Przetłumacz treści w repozytorium. `lingo push` wysyła pliki do silnika wskazanego w `.lingo/config.json`, a `lingo pull` zapisuje tłumaczenia z powrotem z dowolnej maszyny:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Możesz też wywołać silnik bezpośrednio, podając jego ID:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Twój agent programistyczny tworzy silnik, dodaje terminy do glosariusza, dostraja reguły i porównuje dwa silniki — bezpośrednio w rozmowie, w której pojawił się problem |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Wysyłaj pliki źródłowe i pobieraj tłumaczenia z terminala lub z CI. Osiemnaście formatów: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, ciągi znaków Androida i Xcode, SubRip, PHP |
| [Lingo.dev w CI/CD](https://lingo.dev/en/docs/workflows) | Zainstaluj CLI i uruchom `lingo push` jako krok w GitHub Actions, GitLab CI/CD, Bitbucket Pipelines lub w dowolnym runnerze z Node.js 22+ |
| [Aplikacja Lingo.dev dla GitHub](https://lingo.dev/en/docs/workflows/github-app) | Zainstaluj raz, a każdy push do domyślnej gałęzi otworzy lub zaktualizuje pull request z tłumaczeniami albo doda tłumaczenia jako commit do pull requestu, który zmienił źródło. Bez runnera, bez sekretu z kluczem API, bez zarządzania Lockfile |
| [API Lingo.dev](https://lingo.dev/en/docs/api) | Jedno synchroniczne wywołanie dla każdej pary językowej albo zadanie asynchroniczne, które rozsyła jedno żądanie do wielu locale i dostarcza wyniki, gdy tylko będą gotowe |

[Zbuduj swój pierwszy silnik lokalizacyjny →](https://lingo.dev)
