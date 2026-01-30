<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png"
      width="100%"
      alt="Lingo.dev"
    />
  </a>
</p>

<p align="center">
  <strong>
    ⚡ Lingo.dev - LLM'ler ile anında yerelleştirme için açık kaynaklı, yapay
    zeka destekli i18n araç seti.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/mcp">Lingo.dev MCP</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
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

## Compiler ile tanışın 🆕

**Lingo.dev Compiler**, mevcut React bileşenlerinde herhangi bir değişiklik gerektirmeden, herhangi bir React uygulamasını derleme zamanında çok dilli hale getirmek için tasarlanmış ücretsiz, açık kaynaklı bir derleyici ara yazılımıdır.

> **Not:** Eski derleyiciyi (`@lingo.dev/_compiler`) kullanıyorsanız, lütfen `@lingo.dev/compiler` sürümüne geçiş yapın. Eski derleyici kullanımdan kaldırılmıştır ve gelecekteki bir sürümde kaldırılacaktır.

Bir kez yükleyin:

```bash
npm install @lingo.dev/compiler
```

Derleme yapılandırmanızda etkinleştirin:

```ts
import type { NextConfig } from "next";
import { withLingo } from "@lingo.dev/compiler/next";

const nextConfig: NextConfig = {};

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr"],
    models: "lingo.dev",
  });
}
```

`next build` komutunu çalıştırın ve İspanyolca ile Fransızca paketlerin ortaya çıkışını izleyin ✨

Tam kılavuz için [dokümantasyonu okuyun →](https://lingo.dev/compiler) ve kurulumunuzla ilgili yardım almak için [Discord sunucumuza katılın](https://lingo.dev/go/discord).

---

### Bu depoda neler var?

| Araç         | Kısaca                                                                                        | Dokümanlar                              |
| ------------ | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Derleme zamanı React yerelleştirmesi                                                          | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Web ve mobil uygulamalar, JSON, YAML, markdown ve daha fazlası için tek komutla yerelleştirme | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Her push'ta otomatik çeviri commit'i + gerektiğinde pull request oluşturma                    | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Kullanıcı tarafından oluşturulan içerik için gerçek zamanlı çeviri                            | [/sdk](https://lingo.dev/sdk)           |

Aşağıda her biri için hızlı özetler bulunmaktadır 👇

---

### ⚡️ Lingo.dev CLI

Kod ve içeriği doğrudan terminalinizden çevirin.

```bash
npx lingo.dev@latest run
```

Her string'i parmak iziyle işaretler, sonuçları önbelleğe alır ve yalnızca değişenleri yeniden çevirir.

Nasıl kurulacağını öğrenmek için [dokümantasyonu takip edin →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

Mükemmel çevirileri otomatik olarak yayınlayın.

```yaml
# .github/workflows/i18n.yml
name: Lingo.dev i18n
on: [push]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lingodotdev/lingo.dev@main
        with:
          api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Deponuzu yeşil ve ürününüzü manuel adımlar olmadan çok dilli tutar.

[Dokümantasyonu okuyun →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Dinamik içerik için istek başına anlık çeviri.

```ts
import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingoDotDev = new LingoDotDevEngine({
  apiKey: "your-api-key-here",
});

const content = {
  greeting: "Hello",
  farewell: "Goodbye",
  message: "Welcome to our platform",
};

const translated = await lingoDotDev.localizeObject(content, {
  sourceLocale: "en",
  targetLocale: "es",
});
// Returns: { greeting: "Hola", farewell: "Adiós", message: "Bienvenido a nuestra plataforma" }
```

Sohbet, kullanıcı yorumları ve diğer gerçek zamanlı akışlar için mükemmel.

[Dokümantasyonu okuyun →](https://lingo.dev/sdk)

---

## 🤝 Topluluk

Topluluk odaklıyız ve katkıları seviyoruz!

- Bir fikriniz mi var? [Bir issue açın](https://github.com/lingodotdev/lingo.dev/issues)
- Bir şeyi düzeltmek mi istiyorsunuz? [PR gönderin](https://github.com/lingodotdev/lingo.dev/pulls)
- Yardıma mı ihtiyacınız var? [Discord sunucumuza katılın](https://lingo.dev/go/discord)

## ⭐ Yıldız geçmişi

Yaptıklarımızı beğendiyseniz, bize bir ⭐ verin ve 10.000 yıldıza ulaşmamıza yardımcı olun! 🌟

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Diğer dillerde readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Dilinizi görmüyor musunuz? [`i18n.json`](./i18n.json) dosyasına ekleyin ve bir PR açın!

**Yerel ayar formatı:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) kodlarını kullanın: `language[-Script][-REGION]`

- Dil: ISO 639-1/2/3 küçük harf (`en`, `zh`, `bho`)
- Yazı sistemi: ISO 15924 başlık harfi (`Hans`, `Hant`, `Latn`)
- Bölge: ISO 3166-1 alpha-2 büyük harf (`US`, `CN`, `IN`)
- Örnekler: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
