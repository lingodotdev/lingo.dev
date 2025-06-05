<p align="center">
  <a href="https://lingo.dev">
    <img src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.compiler.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ Kit de ferramentas i18n de código aberto, potencializado por IA para localização instantânea com LLMs.</strong>
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
    <img src="https://img.shields.io/github/license/lingodotdev/lingo.dev" alt="Licença" />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev" alt="Último commit" />
  </a>
</p>

---

## Conheça o Compiler 🆕

**Lingo.dev Compiler** é um middleware compilador gratuito e de código aberto, projetado para tornar qualquer aplicativo React multilíngue durante o tempo de compilação sem exigir alterações nos componentes React existentes.

```bash
# install once
npm install lingo.dev

# next.config.js
import lingoCompiler from "lingo.dev/compiler";

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr"],
});
```

Execute `next build` e veja os pacotes em espanhol e francês surgirem ✨

[Leia a documentação →](https://lingo.dev/compiler) para o guia completo.

---

### O que há neste repositório?

| Ferramenta   | Resumo                                                                        | Documentação                             |
| ------------ | ------------------------------------------------------------------------------ | --------------------------------------- |
| **Compiler** | Localização React em tempo de compilação                                      | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localização com um único comando para aplicativos web e mobile, JSON, YAML, markdown e mais | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit de traduções a cada push + criação de pull requests se necessário  | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Tradução em tempo real para conteúdo gerado pelo usuário                       | [/sdk](https://lingo.dev/sdk)           |

Abaixo estão os destaques de cada um 👇

---

### ⚡️ Lingo.dev CLI

Traduza código e conteúdo diretamente do seu terminal.

```bash
npx lingo.dev@latest i18n
```

Ele cria uma impressão digital de cada string, armazena resultados em cache e apenas retraduz o que foi alterado.

[Leia a documentação →](https://lingo.dev/cli)

---

### 🔄 Lingo.dev CI/CD

Entregue traduções perfeitas automaticamente.

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

Mantém seu repositório verde e seu produto multilíngue sem etapas manuais.

[Leia a documentação →](https://lingo.dev/ci)

---

### 🧩 SDK Lingo.dev

Tradução instantânea por requisição para conteúdo dinâmico.

```ts
import { translate } from "lingo.dev/sdk";

const text = await translate("Hello world", { to: "es" });
// → "¡Hola mundo!"
```

Perfeito para chat, comentários de usuários e outros fluxos em tempo real.

[Leia a documentação →](https://lingo.dev/sdk)

---

## 🤝 Comunidade

Somos orientados pela comunidade e adoramos contribuições!

- Tem uma ideia? [Abra uma issue](https://github.com/lingodotdev/lingo.dev/issues)
- Quer corrigir algo? [Envie um PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Precisa de ajuda? [Entre no nosso Discord](https://lingo.dev/go/discord)

## ⭐ Histórico de Estrelas

Se você gosta do que estamos fazendo, dê-nos uma ⭐ e ajude-nos a alcançar 3.000 estrelas! 🌟

[

![Gráfico de Histórico de Estrelas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme em outros idiomas

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [हिन्दी](/readme/hi.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md)

Não vê seu idioma? Adicione-o ao [`i18n.json`](./i18n.json) e abra um PR!