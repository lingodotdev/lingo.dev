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
    ⚡ Lingo.dev - kit de ferramentas i18n de código aberto, com IA, para
    localização instantânea com LLMs.
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
      alt="Licença"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="Último Commit"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool do Mês"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #1 DevTool da Semana"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt #2 Produto do Dia"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Trending no Github"
    />
  </a>
</p>

---

## Conheça o Compiler 🆕

**Lingo.dev Compiler** é um middleware de compilação gratuito e de código aberto, projetado para tornar qualquer aplicativo React multilíngue em tempo de build sem exigir alterações nos componentes React existentes.

> **Nota:** Se você está usando o compilador legado (`@lingo.dev/_compiler`), por favor migre para `@lingo.dev/compiler`. O compilador legado está obsoleto e será removido em uma versão futura.

Instale uma vez:

```bash
npm install @lingo.dev/compiler
```

Habilite na sua configuração de build:

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

Execute `next build` e veja os bundles em espanhol e francês aparecerem ✨

[Leia a documentação →](https://lingo.dev/compiler) para o guia completo, e [Entre no nosso Discord](https://lingo.dev/go/discord) para obter ajuda com sua configuração.

---

### O que há dentro deste repositório?

| Ferramenta   | Resumo                                                                                | Documentação                            |
| ------------ | ------------------------------------------------------------------------------------- | --------------------------------------- |
| **Compiler** | Localização React em tempo de build                                                   | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | Localização com um comando para aplicativos web e mobile, JSON, YAML, markdown e mais | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | Auto-commit de traduções a cada push + criação de pull requests quando necessário     | [/ci](https://lingo.dev/ci)             |
| **SDK**      | Tradução em tempo real para conteúdo gerado por usuários                              | [/sdk](https://lingo.dev/sdk)           |

Abaixo estão os destaques de cada um 👇

---

### ⚡️ Lingo.dev CLI

Traduza código e conteúdo diretamente do seu terminal.

```bash
npx lingo.dev@latest run
```

Ele cria uma impressão digital de cada string, armazena resultados em cache e só retraduz o que mudou.

[Siga a documentação →](https://lingo.dev/cli) para aprender como configurá-lo.

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

Mantém seu repositório verde e seu produto multilíngue sem as etapas manuais.

[Leia a documentação →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

Tradução instantânea por requisição para conteúdo dinâmico.

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

Somos orientados pela comunidade e adoramos contribuições!

- Tem uma ideia? [Abra uma issue](https://github.com/lingodotdev/lingo.dev/issues)
- Quer corrigir algo? [Envie um PR](https://github.com/lingodotdev/lingo.dev/pulls)
- Precisa de ajuda? [Entre no nosso Discord](https://lingo.dev/go/discord)

## ⭐ Histórico de estrelas

Se você gosta do que estamos fazendo, nos dê uma ⭐ e nos ajude a alcançar 10.000 estrelas! 🌟

[

![Gráfico de histórico de estrelas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 Readme em outros idiomas

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

Não vê seu idioma? Adicione-o em [`i18n.json`](./i18n.json) e abra um PR!

**Formato de locale:** Use códigos [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale): `language[-Script][-REGION]`

- Idioma: ISO 639-1/2/3 minúsculas (`en`, `zh`, `bho`)
- Script: ISO 15924 title case (`Hans`, `Hant`, `Latn`)
- Região: ISO 3166-1 alpha-2 maiúsculas (`US`, `CN`, `IN`)
- Exemplos: `en`, `pt-BR`, `zh-Hans`, {/_ INLINE_CODE_PLACEHOLDER_6e553bb40a655db7be211ded60744c98 _/
