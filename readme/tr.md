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

## Ekipler yerelleştirme motorlarını Lingo.dev üzerinde kuruyor

Bir [yerelleştirme motoru](https://lingo.dev/en/docs/platform/engines), ekibinizin yapılandırdığı ve Lingo.dev’in çalıştırdığı, durum bilgisine sahip bir çeviri API’sidir. Ürün başına, içerik türü başına veya marka başına bir motor kurabilirsiniz. Bir motor üzerinden geçen her istek, o motorda yaptığınız tüm yapılandırmaları sabit bir öncelik sırasıyla uygular:

| Katman | Yapılandırdığınız alan | Dokümanlardan örnekler |
| --- | --- | --- |
| [LLM modelleri](https://lingo.dev/en/docs/platform/llm-models) | Her dil çifti için hangi modelin kullanılacağı ve devreye girecek yedek modellerin sırası | 400’den fazla model; yanıtta kullanılan modelin adı da yer alır |
| [Marka sesi](https://lingo.dev/en/docs/platform/brand-voices) | Ürününüzün her dilde nasıl konuşacağı; locale başına tek bir metin | Pazar bazında ton ve resmiyet düzeyi |
| [Kurallar](https://lingo.dev/en/docs/platform/rules) | Genel amaçlı bir modelin gözden kaçırabileceği dilsel kurallar | İspanyolcada sıfatın yeri, yüzde işaretinden önce boşluk |
| [Sözlük](https://lingo.dev/en/docs/platform/glossaries) | Anlama göre eşleştirilen, locale bazında kesin terim karşılıkları | Avrupa pazarlarında "911", "112" olarak çevrilir; ürün adları aynen korunur |
| [AI reviewer’ları](https://lingo.dev/en/docs/platform/ai-reviewers) | Her çeviriden sonra çalışan puanlama sistemi | GEMBA puanları, BERTScore, sözlük uyumluluğu |

Sözlükler, kural setleri ve marka sesleri kuruluşunuza aittir; motorlar bunları ekleyerek uygular. Tek bir sözlük beş motoru yönetebilir ve yaptığınız tek bir değişiklik beşine birden yansır. Bir değişikliği canlıya almadan önce [Playground](https://lingo.dev/en/docs/platform/playground) içinde test edin: bir motoru ham bir modelle karşılaştırın ya da iki motoru yan yana koyun. Motorlar platform üzerinde yapılandırılır; yerelleştirme ekibi de yerelleştirme altyapısını burada yönetir.

## Motorlarınıza kod içinden erişin

Bir repodaki içeriği çevirin. `lingo push`, dosyaları `.lingo/config.json` içinde adı geçen motora gönderir; `lingo pull` ise çevirileri herhangi bir makineden geri yazar:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ya da bir motoru doğrudan, kimliğini belirterek çağırın:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Yazılım ajanınız, sorunun ortaya çıktığı konuşmanın içinden motor oluşturur, sözlük terimleri ekler, kuralları ince ayarlar ve iki motoru karşılaştırır |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Kaynak dosyaları gönderin, çevirileri geri alın; ister terminalden ister CI üzerinden. Toplam 18 format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android ve Xcode strings, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows) | CLI’yi yükleyin ve `lingo push` komutunu GitHub Actions, GitLab CI/CD, Bitbucket Pipelines veya Node.js 22+ çalıştırabilen herhangi bir runner içinde bir adım olarak çalıştırın |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | Bir kez kurun; varsayılan branch’e yapılan her push bir çeviri pull request’i açar ya da günceller. Alternatif olarak, çeviriler kaynağı değiştiren pull request’e bir commit olarak eklenir. Runner yok, gizli API anahtarı yok, yönetilecek Lockfile yok |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Dil çifti başına tek bir eşzamanlı çağrı yapın ya da tek bir isteği birçok locale’e dağıtan ve sonuçları geldikçe teslim eden eşzamansız bir iş çalıştırın |

[İlk yerelleştirme motorunuzu kurun →](https://lingo.dev)
