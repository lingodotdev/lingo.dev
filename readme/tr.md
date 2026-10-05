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
    Lingo.dev, yerelleştirme mühendisliği platformudur: çeviri kalitesini
    ölçmek, LLM'lerle çeviri yapmak ve anadili konuşanlarla düzeltme yapmak için
    en iyi yol.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokümanlar</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt Ayın 1 Numaralı Geliştirici Aracı"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Lisans"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Son commit"
    />
  </a>
</p>

---

## Ekipler Lingo.dev üzerinde yerelleştirme motorları kurar

[Yerelleştirme motoru](https://lingo.dev/en/docs/platform/engines), ekibinizin yapılandırdığı ve Lingo.dev'in çalıştırdığı durum bilgili bir çeviri API'sidir. Ürün başına, içerik türü başına veya marka başına bir motor oluşturun. Bir motor üzerinden yapılan her istek, içinde yapılandırdığınız her şeyi sabit bir öncelik sırasına göre uygular:

| Katman                                                                       | Yapılandırdığınız şey                                                  | Dokümanlarda                                                         |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [LLM modelleri](https://lingo.dev/en/docs/platform/llm-models)               | Her dil çifti için hangi modelin devreye gireceği, sıralı yedeklerle   | 400+ model; yanıt çalışan modeli belirtir                            |
| [Marka sesi](https://lingo.dev/en/docs/platform/brand-voices)                | Ürününüzün her dilde nasıl konuştuğu, yerel ayar başına bir metin      | Pazar başına ton ve formalite                                        |
| [Kurallar](https://lingo.dev/en/docs/platform/rules)                         | Genel bir modelin kaçırdığı dilbilimsel kurallar                       | İspanyolca'da sıfat konumu, yüzde işaretinden önce boşluk            |
| [Sözlük](https://lingo.dev/en/docs/platform/glossaries)                      | Yerel ayar başına kesin terim eşleştirmeleri, anlama göre eşleştirilir | "911" Avrupa pazarları için "112" olur; ürün adları değişmeden geçer |
| [Yapay zeka inceleyicileri](https://lingo.dev/en/docs/platform/ai-reviewers) | Her çeviriden sonra çalışan puanlama                                   | GEMBA skorları, BERTScore, sözlük uyumu                              |

Sözlükler, kural kümeleri ve marka sesleri kuruluşunuza aittir ve bir motor bunları ekleme yoluyla uygular. Bir sözlük beş motoru yönetir ve bir düzenleme beşine de ulaşır. Canlıya geçmeden önce [Playground](https://lingo.dev/en/docs/platform/playground)'da bir değişikliği test edin: bir motoru ham bir modelle veya iki motoru yan yana karşılaştırın. Motorlar, yerelleştirme ekibinin yerelleştirme altyapısını çalıştırdığı platformda yapılandırılır.

## Motorlarınıza koddan ulaşın

Bir depodaki içeriği çevirin. `lingo push` dosyaları `.lingo/config.json` içinde adlandırılan motora gönderir ve `lingo pull` çevirileri herhangi bir makineden geri yazar:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ya da ID ile adlandırarak bir motoru doğrudan çağırın:

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

|                                                                        |                                                                                                                                                                                |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | Kodlama asistanınız, sorunun ortaya çıktığı konuşmadan bir motor oluşturur, sözlük terimleri ekler, kuralları ayarlar ve iki motoru karşılaştırır                              |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | Kaynak dosyaları gönderin, çevirileri alın, terminalden veya CI'dan. On sekiz format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android ve Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI'ı kurun ve GitHub Actions, GitLab CI/CD, Bitbucket Pipelines veya Node.js 22+ ile herhangi bir runner'da `lingo push`'i bir adım olarak çalıştırın                         |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Bir kez kurun ve varsayılan dala yapılan her gönderim bir çeviri pull request'i açar veya günceller. Runner yok, API anahtarı sırrı yok, yönetilecek lockfile yok              |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | Dil çifti başına bir senkron çağrı veya bir isteği birçok dile yayıp sonuçları geldikçe sunan asenkron bir iş                                                                  |

[İlk yerelleştirme motorunuzu oluşturun →](https://lingo.dev)
