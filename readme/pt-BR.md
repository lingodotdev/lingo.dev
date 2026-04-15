<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – plataforma de engenharia de localização"
    />
  </a>
</p>

<p align="center">
  <strong>
    Ferramentas de engenharia de localização de código aberto. Conecte-se à
    plataforma de engenharia de localização Lingo.dev para traduções
    consistentes e de qualidade.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler para React (Alpha inicial)</a>
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

## Início rápido

| Ferramenta                                          | O que faz                                                  | Comando Rápido                     |
| --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)                | Configuração de i18n assistida por IA para apps React      | Prompt: `Set up i18n`              |
| [**Lingo CLI**](#lingodev-cli)                      | Localize arquivos JSON, YAML, markdown, CSV, PO            | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)           | Localização contínua em GitHub Actions                     | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler para React**](#lingodev-compiler) | Localização React em tempo de compilação sem wrappers i18n | Plugin `withLingo()`               |

### Motores de localização

Essas ferramentas se conectam a [motores de localização](https://lingo.dev) – APIs de tradução com estado que você cria na plataforma de engenharia de localização Lingo.dev. Cada motor mantém glossários, tom de marca e instruções por localidade em cada solicitação, [reduzindo erros de terminologia em 16,6–44,6%](https://lingo.dev/research/retrieval-augmented-localization). Ou [traga seu próprio LLM](#lingodev-cli).

---

### Lingo.dev MCP

Configurar i18n em apps React é propenso a erros – até assistentes de codificação com IA alucinam APIs inexistentes e quebram roteamento. O Lingo.dev MCP dá aos assistentes de IA acesso estruturado ao conhecimento de i18n específico de frameworks para Next.js, React Router e TanStack Start. Funciona com Claude Code, Cursor, GitHub Copilot Agents e Codex.

[Leia a documentação →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Localize arquivos JSON, YAML, markdown, CSV e PO em um único comando. Um arquivo de bloqueio rastreia o que já foi localizado – apenas conteúdo novo ou alterado é processado. Padrão para seu motor de localização no Lingo.dev, ou traga seu próprio LLM (OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama).

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[Leia a documentação →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

Localização contínua no seu pipeline. Cada push aciona a localização – strings ausentes são preenchidas antes do código chegar à produção. Compatível com GitHub Actions, GitLab CI/CD e Bitbucket Pipelines.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[Leia a documentação →](https://lingo.dev/en/docs/integrations)

---

### API Lingo.dev

Acione seu motor de localização diretamente do código backend. Localização síncrona e assíncrona com entrega via webhook, isolamento de falhas por locale e progresso em tempo real via WebSocket.

[Leia a documentação →](https://lingo.dev/en/docs/api)

---

### Compilador Lingo para React (Alfa inicial)

Localização React em tempo de compilação sem wrappers i18n. Escreva componentes com texto em inglês simples – o compilador detecta strings traduzíveis e gera variantes localizadas no build. Sem chaves de tradução, sem arquivos JSON, sem funções `t()`. Compatível com Next.js (App Router) e Vite + React.

[Leia a documentação →](https://lingo.dev/en/docs/react/compiler)

---

## Contribuindo

Contribuições são bem-vindas. Siga estas diretrizes:

1. **Issues:** [Reporte bugs ou solicite recursos](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Envie alterações](https://github.com/lingodotdev/lingo.dev/pulls)
   - Todo PR requer um changeset: `pnpm new` (ou `pnpm new:empty` para alterações que não geram release)
   - Garanta que os testes passem antes de enviar
3. **Desenvolvimento:** Este é um monorepo pnpm + turborepo
   - Instale as dependências: `pnpm install`
   - Execute os testes: `pnpm test`
   - Build: `pnpm build`

**Suporte:** [Comunidade no Discord](https://lingo.dev/go/discord)

## Histórico de Estrelas

Se você acha o Lingo.dev útil, nos dê uma estrela e ajude-nos a alcançar 10.000 estrelas!

[

![Gráfico do Histórico de Estrelas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentação Localizada

**Traduções disponíveis:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Adicionando um novo idioma:**

1. Adicione o código do idioma em [`i18n.json`](./i18n.json) usando [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Envie um pull request
