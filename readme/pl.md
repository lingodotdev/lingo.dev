<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – platforma inżynierii lokalizacji"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev to platforma inżynierii lokalizacyjnej: najlepszy sposób na
    mierzenie jakości tłumaczeń, tłumaczenie za pomocą LLM oraz korektę z native
    speakerami.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokumentacja</a> •
  <a href="https://lingo.dev">Platforma</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt – narzędzie deweloperskie miesiąca nr 1"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Licencja"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Ostatni commit"
    />
  </a>
</p>

---

## Zespoły budują silniki lokalizacyjne na Lingo.dev

[Silnik lokalizacyjny](https://lingo.dev/en/docs/platform/engines) to stanowe API tłumaczeniowe, które Twój zespół konfiguruje, a Lingo.dev uruchamia. Zbuduj jeden na produkt, typ treści lub markę. Każde żądanie przez silnik stosuje wszystko, co w nim skonfigurowałeś, w ustalonej kolejności priorytetów:

| Warstwa                                                          | Co konfigurujesz                                                            | Z dokumentacji                                                           |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Modele LLM](https://lingo.dev/en/docs/platform/llm-models)      | Który model obsługuje każdą parę językową, z rankingiem zapasu              | Ponad 400 modeli; odpowiedź wskazuje model, który został uruchomiony     |
| [Głos marki](https://lingo.dev/en/docs/platform/brand-voices)    | Jak Twój produkt komunikuje się w każdym języku, jeden tekst na lokalizację | Ton i formalność dla każdego rynku                                       |
| [Reguły](https://lingo.dev/en/docs/platform/rules)               | Konwencje językowe, których brakuje generycznemu modelowi                   | Pozycja przymiotnika w hiszpańskim, spacja przed znakiem procentu        |
| [Glosariusz](https://lingo.dev/en/docs/platform/glossaries)      | Dokładne mapowania terminów na lokalizację, dopasowane znaczeniowo          | "911" staje się "112" dla rynków europejskich; nazwy produktów pozostają |
| [Recenzenci AI](https://lingo.dev/en/docs/platform/ai-reviewers) | Ocenianie uruchamiane po każdym tłumaczeniu                                 | Wyniki GEMBA, BERTScore, zgodność z glosariuszem                         |

Glosariusze, zestawy reguł i głosy marki należą do Twojej organizacji, a silnik stosuje je przez przypisanie. Jeden glosariusz zarządza pięcioma silnikami, a jedna edycja dociera do wszystkich pięciu. Przetestuj zmianę w [Playground](https://lingo.dev/en/docs/platform/playground) zanim wejdzie na żywo: porównaj silnik z surowym modelem lub dwa silniki obok siebie. Silniki są konfigurowane na platformie, gdzie zespół lokalizacyjny zarządza infrastrukturą lokalizacyjną.

## Uzyskaj dostęp do swoich silników z poziomu kodu

Przetłumacz zawartość w repozytorium. `lingo push` wysyła pliki do silnika wskazanego w `.lingo/config.json`, a `lingo pull` zapisuje tłumaczenia z powrotem z dowolnej maszyny:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Możesz też wywołać silnik bezpośrednio, wskazując go po ID:

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

|                                                                        |                                                                                                                                                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Twój agent kodujący tworzy silnik, dodaje terminy do glosariusza, dostosowuje reguły i porównuje dwa silniki bezpośrednio z rozmowy, w której pojawił się problem               |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Wyślij pliki źródłowe i pobierz tłumaczenia z terminala lub z CI. Osiemnaście formatów: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android i Xcode strings, SubRip, PHP |
| [Lingo.dev w CI/CD](https://lingo.dev/en/docs/workflows)               | Zainstaluj CLI i uruchom `lingo push` jako krok w GitHub Actions, GitLab CI/CD, Bitbucket Pipelines lub dowolnym runnerze z Node.js 22+                                         |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Zainstaluj raz, a każde wysłanie do domyślnej gałęzi otworzy lub zaktualizuje pull request z tłumaczeniem. Bez runnera, bez tajnego klucza API, bez lockfile do zarządzania     |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Jedno synchroniczne wywołanie na parę języków lub asynchroniczne zadanie, które rozsyła jedno żądanie do wielu locale i dostarcza wyniki w miarę ich gotowości                  |

[Zbuduj swój pierwszy silnik lokalizacyjny →](https://lingo.dev)
