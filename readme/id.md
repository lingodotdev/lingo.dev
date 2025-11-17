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
    ⚡ Lingo.dev - Toolkit i18n bertenaga AI, sumber terbuka untuk lokalisasi cepat dengan LLM.
  </strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev/compiler">Lingo.dev Compiler</a> •
  <a href="https://lingo.dev/cli">Lingo.dev CLI</a> •
  <a href="https://lingo.dev/ci">Lingo.dev CI/CD</a> •
  <a href="https://lingo.dev/sdk">Lingo.dev SDK</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="Rilis"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="Lisensi"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Komit terakhir"
    />
  </a>
</p>

---

## Temui Compiler 🆕

**Lingo.dev Compiler** adalah kompiler middleware sumber terbuka gratis yang dirancang untuk membuat aplikasi React apa pun menjadi multibahasa pada waktu build tanpa mengubah komponen React yang ada.

Instal sekali:

```bash
npm install lingo.dev
```

Aktifkan dalam konfigurasi build Anda:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Jalankan `next build` dan lihat bundle Spanyol dan Prancis muncul ✨
    
[Baca dokumentasi →](https://lingo.dev/compiler) untuk panduan lengkap, dan [bergabunglah dengan Discord kami](https://lingo.dev/go/discord) untuk mendapatkan bantuan dalam penyiapan Anda.

---

### Apa yang ada di repo ini?

| Alat         | Deskripsi Singkat                                                              | Dokumen                               |
| ----------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Lokalisasi React pada waktu build                                                 | [/compiler](https://lingo.dev/compiler) |
| **CLI**     | Lokalisasi satu perintah untuk aplikasi web & mobile, JSON, YAML, markdown, + lebih banyak | [/cli](https://lingo.dev/cli)           |
| **CI/CD**   | Auto-commit terjemahan pada setiap push + buat pull request sesuai kebutuhan      | [/ci](https://lingo.dev/ci)             |
| **SDK**     | Terjemahan real-time untuk konten yang dihasilkan pengguna                               | [/sdk](https://lingo.dev/sdk)           |


Informasi cepat untuk masing-masing di bawah ini 👇

---

### ⚡️ Lingo.dev CLI

Terjemahkan kode dan konten langsung dari terminal Anda.

```bash
npx lingo.dev@latest run
```
Ini memfingerprint setiap string, menyimpan hasil dalam cache, dan hanya menerjemahkan ulang hal-hal yang telah berubah.

[Ikuti dokumentasi →](https://lingo.dev/cli) untuk mempelajari cara menyiapkannya.

---

### 🔄 Lingo.dev CI/CD
Kirim terjemahan sempurna secara otomatis.

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
Membuat repo Anda tetap hijau dan produk Anda tetap multibahasa tanpa langkah manual.

[Baca dokumentasi →](https://lingo.dev/ci)

---

## 🧩 Lingo.dev SDK
Terjemahan instan per-permintaan untuk konten dinamis.

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
Sempurna untuk chat, komentar pengguna, dan aliran real-time lainnya.

[Baca dokumentasi →](https://lingo.dev/sdk)

---

## 🤝 Komunitas
Kami didukung oleh komunitas dan menyambut kontribusi!

- Punya ide? [Buka issue](https://github.com/lingodotdev/lingo.dev/issues)
- Ingin memperbaiki sesuatu? [Kirim PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Butuh bantuan? [Bergabunglah dengan Discord kami](https://lingo.dev/go/discord)


## ⭐ Riwayat Bintang
Jika Anda menyukai pekerjaan kami, beri kami ⭐ dan bantu kami mencapai 4.000 bintang! 🌟

[

https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme dalam bahasa lain
[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)
• Bahasa Indonesia (/readme/id.md)

Tidak melihat bahasa Anda? Tambahkan ke [`i18n.json`](./i18n.json) dan buka PR!
