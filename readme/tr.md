<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – yerelleştirme mühendisliği platformu"
    />
  </a>
</p>

<p align="center">
  <strong>
    Açık kaynaklı yerelleştirme mühendisliği araçları. Tutarlı, kaliteli
    çeviriler için Lingo.dev yerelleştirme mühendisliği platformuna bağlanın.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">React için Lingo Compiler (Erken alfa)</a>
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
      alt="License"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Last Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Month"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool of the Week"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Product of the Day"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github trending"
    />
  </a>
</p>

---

## Hızlı başlangıç

| Araç                                               | Ne yapar                                                          | Hızlı Komut                        |
| -------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React uygulamaları için AI destekli i18n kurulumu                 | Komut: `Set up i18n`               |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, markdown, CSV, PO dosyalarını yerelleştirir           | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions'ta sürekli yerelleştirme                           | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n sarmalayıcıları olmadan derleme zamanı React yerelleştirmesi | `withLingo()` eklentisi            |

### Yerelleştirme motorları

Bu araçlar [yerelleştirme motorlarına](https://lingo.dev) bağlanır – Lingo.dev yerelleştirme mühendisliği platformunda oluşturduğunuz durum bilgili çeviri API'leri. Her motor, sözlükler, marka sesi ve dile özel talimatları her istekte kalıcı hale getirerek [terminoloji hatalarını %16,6–44,6 azaltır](https://lingo.dev/research/retrieval-augmented-localization). Veya [kendi LLM'nizi kullanın](#lingodev-cli).

---

### Lingo.dev MCP

React uygulamalarında i18n kurulumu hatalara açıktır – AI kodlama asistanları bile var olmayan API'leri hayal eder ve yönlendirmeyi bozar. Lingo.dev MCP, AI asistanlarına Next.js, React Router ve TanStack Start için çerçeveye özel i18n bilgisine yapılandırılmış erişim sağlar. Claude Code, Cursor, GitHub Copilot Agents ve Codex ile çalışır.

[Dokümanlara git →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

JSON, YAML, markdown, CSV ve PO dosyalarını tek bir komutla yerelleştirin. Bir kilit dosyası neyin zaten yerelleştirildiğini takip eder – yalnızca yeni veya değiştirilmiş içerik işlenir. Varsayılan olarak Lingo.dev'deki yerelleştirme motorunuzu kullanır veya kendi LLM'nizi getirin (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Dokümanlara git →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Pipeline'ınızda sürekli yerelleştirme. Her push yerelleştirmeyi tetikler – eksik dizeler kod üretime ulaşmadan doldurulur. GitHub Actions, GitLab CI/CD ve Bitbucket Pipelines desteklenir.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Dokümanlara git →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

Yerelleştirme motorunuzu doğrudan backend kodundan çağırın. Webhook teslimatı, yerel ayar başına hata izolasyonu ve WebSocket üzerinden gerçek zamanlı ilerleme ile senkron ve asenkron yerelleştirme.

[Dokümanlara git →](https://lingo.dev/en/docs/api)

---

### React için Lingo Compiler (Erken alfa)

i18n sarmalayıcıları olmadan derleme zamanı React yerelleştirmesi. Düz İngilizce metin ile bileşenler yazın – derleyici çevrilebilir dizeleri algılar ve derleme zamanında yerelleştirilmiş varyantlar oluşturur. Çeviri anahtarları yok, JSON dosyaları yok, `t()` fonksiyonları yok. Next.js (App Router) ve Vite + React desteklenir.

[Dokümanlara git →](https://lingo.dev/en/docs/react/compiler)

---

## Katkıda Bulunma

Katkılar memnuniyetle karşılanır. Lütfen şu yönergeleri izleyin:

1. **Sorunlar:** [Hata bildirin veya özellik isteyin](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Request'ler:** [Değişiklik gönderin](https://github.com/lingodotdev/lingo.dev/pulls)
   - Her PR bir changeset gerektirir: `pnpm new` (veya sürüm dışı değişiklikler için `pnpm new:empty`)
   - Göndermeden önce testlerin geçtiğinden emin olun
3. **Geliştirme:** Bu bir pnpm + turborepo monorepo'sudur
   - Bağımlılıkları yükleyin: `pnpm install`
   - Testleri çalıştırın: `pnpm test`
   - Derleyin: `pnpm build`

**Destek:** [Discord topluluğu](https://lingo.dev/go/discord)

## Yıldız Geçmişi

Lingo.dev'i faydalı buluyorsanız, bize yıldız verin ve 10.000 yıldıza ulaşmamıza yardımcı olun!

[

![Yıldız Geçmişi Grafiği](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Yerelleştirilmiş Dokümantasyon

**Mevcut çeviriler:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Yeni bir dil eklemek için:**

1. [BCP-47 formatını](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) kullanarak yerel kod [`i18n.json`](./i18n.json) dosyasına ekleyin
2. Pull request gönderin
