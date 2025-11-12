y m<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡ Lingo.dev - kit de ferramentas de internacionalização de código aberto e alimentado por IA para localização instantânea com LLMs.</strong>
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
    <img src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg" alt="Release" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="License" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Last Commit" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Month" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square" alt="Product Hunt #1 DevTool of the Week" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square" alt="Product Hunt #2 Product of the Day" />
  </a>
  <a href="https://lingo.dev/en">
    <img src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square" alt="Github trending" />
  </a>
</p>

---

## Conheça o Compiler 🆕

**Lingo.dev Compiler** é um middleware de compilação gratuito e de código aberto, projetado para tornar qualquer aplicativo React multilíngue em tempo de compilação sem exigir alterações nos componentes React existentes.

Instale uma vez:

```bash
npm install lingo.dev
```

Habilite na configuração de compilação:

```js
import lingoCompiler from "lingo.dev/compiler";

const existingNextConfig = {};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
})(existingNextConfig);
```

Execute `next build` e veja os pacotes em espanhol e francês aparecerem ✨

[Leia a documentação →](https://lingo.dev/compiler) para o guia completo, e [Junte-se ao nosso Discord](https://lingo.dev/go/discord) para obter ajuda com sua configuração.

---

### O que há neste repositório?

| Ferramenta         | TL;DR                                                                          | Docs                                    |
| ------------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler**       | Localização React em tempo de compilação                                       | [/compiler](https://lingo.dev/compiler) |
| **CLI**            | Localização de um comando para aplicativos web e móveis, JSON, YAML, markdown, + mais | [/cli](https://lingo.dev/cli)           |
| **CI/CD**          | Auto-commit traduções em cada push + criar pull requests se necessário         | [/ci](https://lingo.dev/ci)             |
| **SDK**            | Tradução em tempo real para conteúdo gerado por usuários                       | [/sdk](https://lingo.dev/sdk)           |

Abaixo estão os destaques rápidos de cada um 👇

---

### ⚡️ Lingo.dev CLI

Traduza código e conteúdo diretamente do seu terminal.

```bash
npx lingo.dev@latest run
```

Ele identifica cada string, armazena em cache os resultados e apenas re-traduz o que mudou.

[Siga a documentação →](https://lingo.dev/cli) para aprender como configurá-lo.

---

### 🔄 Lingo.dev CI/CD

Envie traduções perfeitas automaticamente.

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

Mantém seu repositório verde e seu produto multilíngue sem as etapas manuais.

[Leia a documentação →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Tradução instantânea por solicitação para conteúdo dinâmico.

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

Perfeito para chat, comentários de usuários e outros fluxos em tempo real.

[Leia a documentação →](https://lingo.dev/sdk)

---

## 🤝 Comunidade

Somos orientados pela comunidade e amamos contribuições!

- Tem uma ideia? [Abra uma issue](https://github.com/lingodotdev/lingo.dev/issues)
- Quer corrigir algo? [Envie um PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Precisa de ajuda? [Junte-se ao nosso Discord](https://lingo.dev/go/discord)

## ⭐ Histórico de Estrelas

Se gostar do que estamos fazendo, dê-nos uma ⭐ e ajude-nos a alcançar 4.000 estrelas! 🌟

[![Gráfico do Histórico de Estrelas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 README em outros idiomas

[العربية](/readme/ar.md) • [বাংলা](/readme/bn.md) • [中文](/readme/zh-Hans.md) • [Deutsch](/readme/de.md) • [English](https://github.com/lingodotdev/lingo.dev) • [Español](/readme/es.md) • [فارسی](/readme/fa.md) • [Français](/readme/fr.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Italiano](/readme/it.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Português](/readme/pt.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md)

Não vê seu idioma? Adicione-o ao [`i18n.json`](./i18n.json) e abra um PR!
