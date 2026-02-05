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
    Lingo.dev - Kit de ferramentas i18n de código aberto para localização com
    LLM
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

| Ferramenta                         | Caso de uso                                           | Comando rápido                     |
| ---------------------------------- | ----------------------------------------------------- | ---------------------------------- |
| [**MCP**](#lingodev-mcp)           | Configuração de i18n assistida por IA para apps React | Prompt: `Set up i18n`              |
| [**CLI**](#lingodev-cli)           | Traduzir arquivos JSON, YAML, markdown, CSV, PO       | `npx lingo.dev@latest run`         |
| [**CI/CD**](#lingodev-cicd)        | Pipeline de tradução automatizado no GitHub Actions   | `uses: lingodotdev/lingo.dev@main` |
| [**SDK**](#lingodev-sdk)           | Tradução em tempo de execução para conteúdo dinâmico  | `npm install lingo.dev`            |
| [**Compiler**](#lingodev-compiler) | Localização React em tempo de build sem wrappers i18n | Plugin `withLingo()`               |

---

### Lingo.dev MCP

Configurar i18n em aplicações React é notoriamente propenso a erros - mesmo para desenvolvedores experientes. Assistentes de IA para codificação pioram a situação: eles alucinam APIs inexistentes, esquecem configurações de middleware, quebram o roteamento ou implementam metade de uma solução antes de se perderem. O problema é que a configuração de i18n requer uma sequência precisa de mudanças coordenadas em múltiplos arquivos (roteamento, middleware, componentes, configuração), e os LLMs têm dificuldade em manter esse contexto.

O Lingo.dev MCP resolve isso fornecendo aos assistentes de IA acesso estruturado ao conhecimento de i18n específico de cada framework. Em vez de adivinhar, seu assistente segue padrões de implementação verificados para Next.js, React Router e TanStack Start.

**IDEs suportadas:**

- Claude Code
- Cursor
- GitHub Copilot Agents
- Codex (OpenAI)

**Frameworks suportados:**

- Next.js (App Router e Pages Router v13-16)
- TanStack Start (v1)
- React Router (v7)

**Uso:**

Após configurar o servidor MCP na sua IDE ([veja os guias de início rápido](https://lingo.dev/en/mcp)), solicite ao seu assistente:

```
Set up i18n with the following locales: en, es, and pt-BR. The default locale is 'en'.
```

O assistente irá:

1. Configurar roteamento baseado em locale (por exemplo, `/en`, `/es`, `/pt-BR`)
2. Configurar componentes de troca de idioma
3. Implementar detecção automática de locale
4. Gerar arquivos de configuração necessários

**Observação:** a geração de código assistida por IA é não-determinística. Revise o código gerado antes de fazer commit.

[Leia a documentação →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

Manter traduções sincronizadas é tedioso. Você adiciona uma nova string, esquece de traduzi-la e envia uma interface quebrada para usuários internacionais. Ou você envia arquivos JSON para tradutores, espera dias e depois mescla manualmente o trabalho deles de volta. Escalar para mais de 10 idiomas significa gerenciar centenas de arquivos que constantemente ficam dessincronizados.

O Lingo.dev CLI automatiza isso. Aponte-o para seus arquivos de tradução, execute um comando e todos os locales são atualizados. Um arquivo de bloqueio rastreia o que já foi traduzido, então você paga apenas por conteúdo novo ou alterado. Suporta arquivos JSON, YAML, CSV, PO e markdown.

**Configuração:**

```bash
# Initialize project
npx lingo.dev@latest init

# Run translations
npx lingo.dev@latest run
```

**Como funciona:**

1. Extrai conteúdo traduzível dos arquivos configurados
2. Envia o conteúdo para o provedor LLM para tradução
3. Grava o conteúdo traduzido de volta no sistema de arquivos
4. Cria o arquivo `i18n.lock` para rastrear traduções concluídas (evita processamento redundante)

**Configuração:**

O comando `init` gera um arquivo `i18n.json`. Configure locales e buckets:

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

O campo `provider` é opcional (padrão: Lingo.dev Engine). Para provedores LLM personalizados:

```json
{
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Translate from {source} to {target}"
  }
}
```

**Provedores LLM suportados:**

- Lingo.dev Engine (recomendado)
- OpenAI
- Anthropic
- Google
- Mistral
- OpenRouter
- Ollama

[Leia a documentação →](https://lingo.dev/en/cli)

---

### Lingo.dev CI/CD

Traduções são a funcionalidade que está sempre "quase pronta". Engenheiros fazem merge de código sem atualizar os locales. O QA detecta traduções faltando em staging - ou pior, os usuários detectam em produção. A causa raiz: tradução é uma etapa manual que é fácil de pular sob pressão de prazo.

O Lingo.dev CI/CD torna as traduções automáticas. Cada push aciona a tradução. Strings faltando são preenchidas antes do código chegar à produção. Nenhuma disciplina necessária - o pipeline cuida disso.

**Plataformas suportadas:**

- GitHub Actions
- GitLab CI/CD
- Bitbucket Pipelines

**Configuração do GitHub Actions:**

Crie `.github/workflows/translate.yml`:

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

**Requisitos de configuração:**

1. Adicione `LINGODOTDEV_API_KEY` aos secrets do repositório (Settings > Secrets and variables > Actions)
2. Para workflows de PR: Habilite "Allow GitHub Actions to create and approve pull requests" em Settings > Actions > General

**Opções de workflow:**

Fazer commit das traduções diretamente:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

Crie pull requests com traduções:

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
  pull-request: true
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Inputs disponíveis:**

| Input                | Padrão                                         | Descrição                              |
| -------------------- | ---------------------------------------------- | -------------------------------------- |
| `api-key`            | (obrigatório)                                  | Chave de API do Lingo.dev              |
| `pull-request`       | `false`                                        | Criar PR em vez de fazer commit direto |
| `commit-message`     | `"feat: update translations via @LingoDotDev"` | Mensagem de commit personalizada       |
| `pull-request-title` | `"feat: update translations via @LingoDotDev"` | Título de PR personalizado             |
| `working-directory`  | `"."`                                          | Diretório para executar                |
| `parallel`           | `false`                                        | Habilitar processamento paralelo       |

[Leia a documentação →](https://lingo.dev/en/ci/github)

---

### Lingo.dev SDK

Arquivos de tradução estáticos funcionam para labels de UI, mas e quanto ao conteúdo gerado por usuários? Mensagens de chat, descrições de produtos, tickets de suporte - conteúdo que não existe em tempo de build não pode ser pré-traduzido. Você fica preso mostrando texto não traduzido ou construindo um pipeline de tradução personalizado.

O Lingo.dev SDK traduz conteúdo em tempo de execução. Passe qualquer texto, objeto ou HTML e receba de volta uma versão localizada. Funciona para chat em tempo real, notificações dinâmicas ou qualquer conteúdo que chega após o deploy. Disponível para JavaScript, PHP, Python e Ruby.

**Instalação:**

```bash
npm install lingo.dev
```

**Uso:**

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

**SDKs disponíveis:**

- [JavaScript SDK](https://lingo.dev/en/sdk/javascript) - Aplicativos web, Node.js
- [PHP SDK](https://lingo.dev/en/sdk/php) - PHP, Laravel
- [Python SDK](https://lingo.dev/en/sdk/python) - Django, Flask
- [Ruby SDK](https://lingo.dev/en/sdk/ruby) - Rails

[Leia a documentação →](https://lingo.dev/en/sdk)

---

### Lingo.dev Compiler

A i18n tradicional é invasiva. Você envolve cada string em funções `t()`, inventa chaves de tradução (`home.hero.title.v2`), mantém arquivos JSON paralelos e vê seus componentes incharem com boilerplate de localização. É tão tedioso que as equipes adiam a internacionalização até que ela se torne uma refatoração massiva.

O Lingo.dev Compiler elimina a cerimônia. Escreva componentes React com texto em inglês simples. O compilador detecta strings traduzíveis em tempo de build e gera variantes localizadas automaticamente. Sem chaves, sem arquivos JSON, sem funções wrapper - apenas código React que funciona em vários idiomas.

**Instalação:**

```bash
pnpm install @lingo.dev/compiler
```

**Autenticação:**

```bash
# Recommended: Sign up at lingo.dev and login
npx lingo.dev@latest login

# Alternative: Add API key to .env
LINGODOTDEV_API_KEY=your_key_here

# Or use direct LLM providers (Groq, OpenAI, Anthropic, Google)
GROQ_API_KEY=your_key
```

**Configuração (Next.js):**

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

**Configuração (Vite):**

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

**Configuração do provider:**

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

**Seletor de idioma:**

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

**Desenvolvimento:** `npm run dev` (usa pseudotranslator, sem chamadas de API)

**Produção:** Defina `usePseudotranslator: false`, depois `next build`

Faça commit do diretório `.lingo/` no controle de versão.

**Recursos principais:**

- Custo zero de performance em runtime
- Sem chaves de tradução ou arquivos JSON
- Sem funções `t()` ou componentes wrapper `<T>`
- Detecção automática de texto traduzível em JSX
- Suporte a TypeScript
- ICU MessageFormat para plurais
- Substituições manuais via atributo `data-lingo-override`
- Widget integrado de editor de traduções

**Modos de build:**

- `pseudotranslator`: Modo de desenvolvimento com traduções placeholder (sem custos de API)
- `real`: Gera traduções reais usando LLMs
- `cache-only`: Modo de produção usando traduções pré-geradas do CI (sem chamadas de API)

**Frameworks suportados:**

- Next.js (App Router com React Server Components)
- Vite + React (SPA e SSR)

Suporte a frameworks adicionais planejado.

[Leia a documentação →](https://lingo.dev/en/compiler)

---

## Contribuindo

Contribuições são bem-vindas. Siga estas diretrizes:

1. **Issues:** [Reporte bugs ou solicite recursos](https://github.com/lingodotdev/lingo.dev/issues)
2. **Pull Requests:** [Envie alterações](https://github.com/lingodotdev/lingo.dev/pulls)
   - Todo PR requer um changeset: `pnpm new` (ou `pnpm new:empty` para alterações que não geram release)
   - Certifique-se de que os testes passem antes de enviar
3. **Desenvolvimento:** Este é um monorepo pnpm + turborepo
   - Instale as dependências: `pnpm install`
   - Execute os testes: `pnpm test`
   - Build: `pnpm build`

**Suporte:** [Comunidade no Discord](https://lingo.dev/go/discord)

## Histórico de estrelas

Se você acha o Lingo.dev útil, nos dê uma estrela e nos ajude a alcançar 10.000 estrelas!

[

![Gráfico do histórico de estrelas](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## Documentação localizada

**Traduções disponíveis:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**Adicionando um novo idioma:**

1. Adicione o código do locale em [`i18n.json`](./i18n.json) usando o [formato BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)
2. Envie um pull request

**Formato de locale BCP-47:** `language[-Script][-REGION]`

- `language`: ISO 639-1/2/3 (minúsculas): `en`, `zh`, `bho`
- `Script`: ISO 15924 (primeira letra maiúscula): `Hans`, `Hant`, `Latn`
- `REGION`: ISO 3166-1 alpha-2 (maiúsculas): `US`, `CN`, `IN`
- Exemplos: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
