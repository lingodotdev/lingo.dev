<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png" width="100%" alt="Lingo.dev – yerelleştirme mühendisliği platformu" />
  </a>
</p>

<p align="center">
  <strong>Lingo.dev, yerelleştirme mühendisliği platformudur: çeviri kalitesini ölçmenin, LLM'lerle çeviri yapmanın ve çevirileri ana dili o dil olan uzmanlarla gözden geçirmenin en iyi yolu.</strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">Dokümanlar</a> •
  <a href="https://lingo.dev">Platform</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en"><img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt'ta Ayın 1 Numaralı Geliştirici Aracı" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Lisans" /></a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main"><img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Son commit" /></a>
</p>

---

## Ekipler yerelleştirme motorlarını Lingo.dev üzerinde kuruyor

[Yerelleştirme motoru](https://lingo.dev/en/docs/platform/engines), ekibinizin yapılandırdığı ve Lingo.dev'in çalıştırdığı, durumu koruyan bir çeviri API'sidir. Ürün başına, içerik türü başına veya marka başına bir motor oluşturun. Bir motor üzerinden geçen her istek, o motorda yapılandırdığınız her şeyi sabit bir öncelik sırasına göre uygular:

| Katman | Neyi yapılandırırsınız | Dokümanlardan |
| --- | --- | --- |
| [LLM modelleri](https://lingo.dev/en/docs/platform/llm-models) | Her dil çifti için hangi modelin kullanılacağı, sıralı yedek seçeneklerle birlikte | 400+ model; yanıtta çalışan modelin adı da yer alır |
| [Marka dili](https://lingo.dev/en/docs/platform/brand-voices) | Ürününüzün her dilde nasıl konuştuğu; her yerel ayar için tek bir metin | Pazara göre ton ve resmiyet düzeyi |
| [Kurallar](https://lingo.dev/en/docs/platform/rules) | Genel amaçlı bir modelin kaçırdığı dilsel kurallar | İspanyolcada sıfatın yeri, yüzde işaretinden önce boşluk |
| [Sözlük](https://lingo.dev/en/docs/platform/glossaries) | Anlama göre eşleşen, yerel ayar bazında tam terim karşılıkları | Avrupa pazarlarında "911", "112" olur; ürün adları aynen korunur |
| [Yapay zekâ değerlendiricileri](https://lingo.dev/en/docs/platform/ai-reviewers) | Her çeviriden sonra çalışan puanlama sistemi | GEMBA puanları, BERTScore, sözlük uyumu |

Sözlükler, kural setleri ve marka dili organizasyonunuza aittir; motorlar bunları bağlayarak uygular. Tek bir sözlük beş motoru yönetebilir ve yaptığınız tek bir değişiklik beşine birden yansır. Bir değişikliği yayına almadan önce [Playground](https://lingo.dev/en/docs/platform/playground)'da test edin: bir motoru ham bir modelle ya da iki motoru yan yana karşılaştırın. Motorlar, yerelleştirme ekibinin yerelleştirme altyapısını yönettiği platform üzerinde yapılandırılır.

## Motorlarınıza kod içinden erişin

Bir repodaki içeriği çevirin. `lingo push`, dosyaları `.lingo/config.json` içinde adı belirtilen motora gönderir; `lingo pull` ise çevirileri herhangi bir makineden geri yazar:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

Ya da bir motoru kimliğini belirterek doğrudan çağırın:

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
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp) | Kodlama asistanınız, sorunun ortaya çıktığı konuşmanın içinden bir motor oluşturur, sözlük terimleri ekler, kuralları ince ayarlar ve iki motoru karşılaştırır |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli) | Kaynak dosyaları gönderin, çevirileri alın; terminalden ya da CI üzerinden. On sekiz format: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android ve Xcode dizeleri, SubRip, PHP |
| [Lingo.dev CI/CD'de](https://lingo.dev/en/docs/workflows) | CLI'ı yükleyin ve `lingo push` komutunu GitHub Actions, GitLab CI/CD, Bitbucket Pipelines veya Node.js 22+ çalıştırabilen herhangi bir runner içinde bir adım olarak çalıştırın |
| [Lingo.dev GitHub Uygulaması](https://lingo.dev/en/docs/workflows/github-app) | Bir kez yükleyin; varsayılan dala yapılan her push, bir çeviri pull request'i açar ya da günceller. Alternatif olarak çeviriler, kaynağı değiştiren pull request'e bir commit olarak eklenir. Runner yok, gizli API anahtarı yok, yönetilecek Lockfile yok |
| [Lingo.dev API](https://lingo.dev/en/docs/api) | Her dil çifti için tek bir eşzamanlı çağrı ya da tek bir isteği birçok yerel ayara dağıtan ve sonuçları geldikçe teslim eden eşzamansız bir iş |

[İlk yerelleştirme motorunuzu oluşturun →](https://lingo.dev)
