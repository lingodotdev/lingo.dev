<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    Lingo.dev - LLM destekli yerelleştirme için açık kaynaklı i18n araç seti
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-mcp">MCP</a> •<a href="#lingodev-cli">CLI</a> •
  <a href="#lingodev-cicd">CI/CD</a> •<a href="#lingodev-sdk">SDK</a> •
  <a href="#lingodev-compiler">Compiler</a>
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

| Araç                               | Kullanım alanı                                             | Hızlı komut                        |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | React uygulamaları için AI destekli i18n kurulumu          | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | JSON, YAML, markdown, CSV, PO dosyalarını çevir            | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | GitHub Actions'ta otomatik çeviri pipeline'ı               | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Dinamik içerik için runtime çevirisi                       | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | i18n wrapper'ları olmadan build-time React yerelleştirmesi | `withLingo()` eklentisi            |

---

### Lingo.dev MCP

AI kodlama asistanlarının doğal dil komutları aracılığıyla React uygulamalarında i18n altyapısı kurmasını sağlayan Model Context Protocol sunucusu.

**Desteklenen IDE'ler:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Desteklenen framework'ler:**

- Next.js (App Router & Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Kullanım:**

MCP sunucusunu IDE'nizde yapılandırdıktan sonra ([hızlı başlangıç kılavuzlarına bakın](https://lingo.dev/en/mcp)), asistanınıza şu şekilde komut verin:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

Asistan şunları yapacaktır:

1. Yerel ayar tabanlı yönlendirmeyi yapılandırır (örn. `/en`, `/es`, `/pt-BR`)
2. Dil değiştirme bileşenlerini kurar
3. Otomatik yerel ayar algılamayı uygular
4. Gerekli yapılandırma dosyalarını oluşturur

**Not:** Yapay zeka destekli kod üretimi deterministik değildir. Oluşturulan kodu commit etmeden önce gözden geçirin.

[Dokümantasyonu okuyun →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Uygulamaları ve içeriği yapay zeka ile çevirmek için açık kaynaklı CLI. JSON, YAML, CSV, PO dosyaları ve markdown dahil tüm endüstri standardı formatları destekler.

**Kurulum:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Nasıl çalışır:**

1. Yapılandırılmış dosyalardan çevrilebilir içeriği çıkarır
2. İçeriği çeviri için LLM sağlayıcısına gönderir
3. Çevrilen içeriği dosya sistemine geri yazar
4. Tamamlanan çevirileri izlemek için `i18n.lock` dosyası oluşturur (gereksiz işlemlerden kaçınır)

**Yapılandırma:**

`init` komutu bir `i18n.json` dosyası oluşturur. Yerel ayarları ve bucket'ları yapılandırın:

```json
{
  "$schema": "https://lingo.dev/schema/i18n.json",
  "version": "1.10",
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  }
}
```

`provider` alanı isteğe bağlıdır (varsayılan olarak Lingo.dev Engine kullanılır). Özel LLM sağlayıcıları için:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Desteklenen LLM sağlayıcıları:**

- Lingo.dev Engine (önerilir)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Dokümantasyonu okuyun →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

CI/CD pipeline'ları için otomatik çeviri iş akışları. Eksik çevirilerin production ortamına ulaşmasını önler.

**Desteklenen platformlar:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**GitHub Actions kurulumu:**

`.github/workflows/translate.yml` dosyasını oluşturun:

```yaml
name: Translate
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  translate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lingo.dev
        uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

**Kurulum gereksinimleri:**

1. Repository secrets'a `LINGODOTDEV_API_KEY` ekleyin (Settings > Secrets and variables > Actions)
2. PR workflow'ları için: Settings > Actions > General bölümünden "Allow GitHub Actions to create and approve pull requests" seçeneğini etkinleştirin

**Workflow seçenekleri:**

Çevirileri doğrudan commit edin:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Çevirilerle pull request oluşturun:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Kullanılabilir input'lar:**

| Input                | Varsayılan                                     | Açıklama                          |
| -------------------- | ---------------------------------------------- | --------------------------------- |
| `api-key`            | (zorunlu)                                      | Lingo.dev API anahtarı            |
| `pull-request`       | `false`                                        | Doğrudan commit yerine PR oluştur |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Özel commit mesajı                |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Özel PR başlığı                   |
| `working-directory`  | `"."`                                          | Çalıştırılacak dizin              |
| `parallel`           | `false`                                        | Paralel işlemeyi etkinleştir      |

[Dokümantasyonu okuyun →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Dinamik içerik için runtime çeviri kütüphanesi. JavaScript, PHP, Python ve Ruby için kullanılabilir.

**Kurulum:**

```bash
npm install lingo.dev
```

**Kullanım:**

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

// Translate objects (preserves structure)
const translated = await lingoDotDev.localizeObject(
  { greeting: "Hello", farewell: "Goodbye" },
  { sourceLocale: "en", targetLocale: "es" },
);
// { greeting: "Hola", farewell: "Adiós" }

// Translate text
const text = await lingoDotDev.localizeText("Hello!", {
  sourceLocale: "en",
  targetLocale: "fr",
});

// Translate to multiple languages at once
const results = await lingoDotDev.batchLocalizeText("Hello!", {
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
});

// Translate chat (preserves speaker names)
const chat = await lingoDotDev.localizeChat(
  [{ name: "Alice", text: "Hello!" }],
  { sourceLocale: "en", targetLocale: "es" },
);

// Translate HTML (preserves markup)
const html = await lingoDotDev.localizeHtml("<h1>Welcome</h1>", {
  sourceLocale: "en",
  targetLocale: "de",
});

// Detect language
const locale = await lingoDotDev.recognizeLocale("Bonjour le monde");
// "fr"
```

**Kullanılabilir SDK'lar:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Web uygulamaları, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[Dokümantasyonu okuyun →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

React uygulamalarını bileşenleri değiştirmeden çok dilli hale getiren derleme zamanı çeviri sistemi. Çalışma zamanı yerine derleme sırasında çalışır.

**Kurulum:**

```bash
pnpm install @lingo.dev/compiler
```

**Kimlik doğrulama:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Yapılandırma (Next.js):**

```ts
// next.config.ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceRoot: "./app",
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de"],
    models: "lingo.dev",
    dev: { usePseudotranslator: true },
  });
}
```

**Yapılandırma (Vite):**

```ts
// vite.config.ts
import { lingoCompilerPlugin } from "@lingo.dev/compiler/vite";

export default defineConfig({
  plugins: [
    lingoCompilerPlugin({
      sourceRoot: "src",
      sourceLocale: "en",
      targetLocales: ["es", "fr", "de"],
      models: "lingo.dev",
      dev: { usePseudotranslator: true },
    }),
    react(),
  ],
});
```

**Provider kurulumu:**

```tsx
// app/layout.tsx (Next.js)
import { LingoProvider } from "@lingo.dev/compiler/react";

export default function RootLayout({ children }) {
  return (
    <LingoProvider>
      <html>
        <body>{children}</body>
      </html>
    </LingoProvider>
  );
}
```

**Dil değiştirici:**

```tsx
import { useLocale, setLocale } from "@lingo.dev/compiler/react";

export function LanguageSwitcher() {
  const locale = useLocale();
  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
```

**Geliştirme:** `npm run dev` (pseudotranslator kullanır, API çağrısı yapılmaz)

**Production:** `usePseudotranslator: false` ayarlayın, ardından `next build`

`.lingo/` dizinini versiyon kontrolüne commit edin.

**Temel özellikler:**

- Sıfır çalışma zamanı performans maliyeti
- Çeviri anahtarı veya JSON dosyası yok
- `t()` fonksiyonu veya `<T>` wrapper bileşeni yok
- JSX içinde çevrilebilir metnin otomatik tespiti
- TypeScript desteği
- Çoğullar için ICU MessageFormat
- `data-lingo-override` özniteliği ile manuel geçersiz kılma
- Yerleşik çeviri editörü widget'ı

**Derleme modları:**

- `pseudotranslator`: Yer tutucu çevirilerle geliştirme modu (API maliyeti yok)
- `real`: LLM'ler kullanarak gerçek çeviriler oluştur
- `cache-only`: CI'dan önceden oluşturulmuş çevirileri kullanan production modu (API çağrısı yok)

**Desteklenen framework'ler:**

- Next.js (React Server Components ile App Router)
- Vite + React (SPA ve SSR)

Ek framework desteği planlanıyor.

[Belgeleri okuyun →](https://lingo.dev/en/compiler)

---

## Katkıda bulunma

Katkılarınızı bekliyoruz. Lütfen şu yönergeleri takip edin:

1. **Sorunlar:** [Hata bildirin veya özellik isteyin](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull request'ler:** [Değişiklik gönderin](https://github.com/lingodotdev/lingo.dev/pulls)
   - Her PR bir changeset gerektirir: `pnpm new` (veya yayınlanmayacak değişiklikler için `pnpm new:empty`)
   - Göndermeden önce testlerin geçtiğinden emin olun
3. **Geliştirme:** Bu bir pnpm + turborepo monorepo'sudur
   - Bağımlılıkları yükleyin: `pnpm install`
   - Testleri çalıştırın: `pnpm test`
   - Build edin: `pnpm build`

**Destek:** [Discord topluluğu](https://lingo.dev/go/discord)

## Yıldız geçmişi

Lingo.dev'i faydalı buluyorsanız, bize bir yıldız verin ve 10.000 yıldıza ulaşmamıza yardımcı olun!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Yerelleştirilmiş belgeler

**Mevcut çeviriler:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Yeni bir dil eklemek için:**

1. [`i18n.json`](./i18n.json) dosyasına [BCP-47 formatında](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) locale kodu ekleyin
2. Bir pull request gönderin

**BCP-47 locale formatı:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (küçük harf): `en`, `zh`, `bho`
- `Script`: ISO 15924 (başlık harfi büyük): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (büyük harf): `US`, `CN`, `IN`
- Örnekler: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
