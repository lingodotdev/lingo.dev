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
    ⚡ Lingo.dev - açık kaynaklı, yapay zeka destekli, LLM'ler ile anında
    yerelleştirme için i18n araç seti.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Derleyici</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Sürüm"
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
      alt="Son Commit"
    />
  </a>
</p>

---

## Derleyici ile tanışın 🆕

**Lingo.dev Derleyici**, mevcut React bileşenlerinde herhangi bir değişiklik gerektirmeden, derleme zamanında herhangi bir React uygulamasını çok dilli hale getirmek için tasarlanmış ücretsiz, açık kaynaklı bir derleyici ara yazılımıdır.

Bir kez kurun:

```bash
npm install lingo.dev
```

Derleme yapılandırmanızda etkinleştirin:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

`next build` komutunu çalıştırın ve İspanyolca ve Fransızca paketlerin ortaya çıkışını izleyin ✨

Tam kılavuz için [belgeleri okuyun →](https://lingo.dev/compiler) ve kurulumunuzla ilgili yardım almak için [Discord'umuza katılın](https://lingo.dev/go/discord).

---

### Bu depoda neler var?

| Alet          | Özet                                                                                          | Dokümanlar                              |
| ------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- |
| **Derleyici** | Derleme zamanında React yerelleştirme                                                         | [/compiler](https://lingo.dev/compiler) |
| **CLI**       | Web ve mobil uygulamalar, JSON, YAML, markdown ve daha fazlası için tek komutla yerelleştirme | [/cli](https://lingo.dev/cli)           |
| **CI/CD**     | Her push'ta otomatik çeviri commit'leri + gerekirse pull request oluşturma                    | [/ci](https://lingo.dev/ci)             |
| **SDK**       | Kullanıcı tarafından oluşturulan içerik için gerçek zamanlı çeviri                            | [/sdk](https://lingo.dev/sdk)           |

Aşağıda her biri için hızlı bilgiler bulunmaktadır 👇

---

### ⚡️ Lingo.dev CLI

Kod ve içeriği doğrudan terminalinizden çevirin.

```bash
npx lingo.dev@latest run
```

Her dizeyi parmak iziyle işaretler, sonuçları önbelleğe alır ve yalnızca değişen kısımları yeniden çevirir.

Nasıl kurulacağını öğrenmek için [dokümanları takip edin →](https://lingo.dev/cli).

---

### 🔄 Lingo.dev CI/CD

Otomatik olarak mükemmel çeviriler yayınlayın.

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

Deponuzu yeşil tutar ve manuel adımlar olmadan ürününüzü çok dilli hale getirir.

[Belgeleri oku →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Dinamik içerik için anında istek başına çeviri.

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

[Belgeleri oku →](https://lingo.dev/sdk)

---

## 🤝 Topluluk

Topluluk odaklıyız ve katkıları seviyoruz!

- Bir fikriniz mi var? [Bir sorun açın](https://github.com/lingodotdev/lingo.dev/issues)
- Bir şeyi düzeltmek mi istiyorsunuz? [PR gönderin](https://github.com/lingodotdev/lingo.dev/pulls)
- Yardıma mı ihtiyacınız var? [Discord'umuza katılın](https://lingo.dev/go/discord)

## ⭐ Yıldız Tarihi

Yaptıklarımızı beğeniyorsanız, bize bir ⭐ verin ve 3.000 yıldıza ulaşmamıza yardımcı olun! 🌟

[

![Yıldız Geçmişi Grafiği](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Diğer dillerde Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Türkçe](/readme/tr.md)

Dilinizi görmüyor musunuz? [`i18n.json`](./i18n.json) dosyasına ekleyin ve bir PR açın!
