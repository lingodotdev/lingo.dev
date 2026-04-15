<p align="center">
  <a href="https://lingo.dev">
    <img
      src="https://raw.githubusercontent.com/lingodotdev/lingo.dev/main/content/banner.png"
      width="100%"
      alt="Lingo.dev – 로컬라이제이션 엔지니어링 플랫폼"
    />
  </a>
</p>

<p align="center">
  <strong>
    오픈소스 로컬라이제이션 엔지니어링 도구. Lingo.dev 로컬라이제이션 엔지니어링
    플랫폼에 연결하여 일관되고 품질 높은 번역을 실현하세요.
  </strong>
</p>

<br />

<p align="center">
  <a href="#lingodev-api">Lingo API</a> •
  <a href="#lingodev-mcp">Lingo React MCP</a> •
  <a href="#lingodev-cli">Lingo CLI</a> •
  <a href="#lingodev-cicd">Lingo GitHub Action</a> •
  <a href="#lingodev-compiler">Lingo Compiler for React (얼리 알파)</a>
</p>

<p align="center">
  <a href="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml">
    <img
      src="https://github.com/lingodotdev/lingo.dev/actions/workflows/release.yml/badge.svg"
      alt="릴리스"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/blob/main/LICENSE.md">
    <img
      src="https://img.shields.io/github/license/lingodotdev/lingo.dev"
      alt="라이선스"
    />
  </a>
  <a href="https://github.com/lingodotdev/lingo.dev/commits/main">
    <img
      src="https://img.shields.io/github/last-commit/lingodotdev/lingo.dev"
      alt="최근 커밋"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 이달의 개발 도구 1위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20Product%20of%20the%20Week-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 이주의 제품 1위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%232%20Product%20of%20the%20Day-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 오늘의 제품 2위"
    />
  </a>
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/GitHub-Trending-blue?logo=github&style=flat-square"
      alt="Github 트렌딩"
    />
  </a>
</p>

---

## 빠른 시작

| 도구                                               | 기능                                              | 빠른 명령어                        |
| -------------------------------------------------- | ------------------------------------------------- | ---------------------------------- |
| [**Lingo React MCP**](#lingodev-mcp)               | React 앱을 위한 AI 기반 i18n 설정                 | 프롬프트: `Set up i18n`            |
| [**Lingo CLI**](#lingodev-cli)                     | JSON, YAML, 마크다운, CSV, PO 파일 로컬라이제이션 | `npx lingo.dev@latest run`         |
| [**Lingo GitHub Action**](#lingodev-cicd)          | GitHub Actions에서 지속적 로컬라이제이션          | `uses: lingodotdev/lingo.dev@main` |
| [**Lingo Compiler for React**](#lingodev-compiler) | i18n 래퍼 없이 빌드 타임 React 로컬라이제이션     | `withLingo()` 플러그인             |

### 로컬라이제이션 엔진

이 도구들은 Lingo.dev 로컬라이제이션 엔지니어링 플랫폼에서 생성하는 [로컬라이제이션 엔진](https://lingo.dev)에 연결됩니다. 각 엔진은 모든 요청에서 용어집, 브랜드 보이스, 로케일별 지침을 유지하여 [용어 오류를 16.6–44.6% 감소](https://lingo.dev/research/retrieval-augmented-localization)시킵니다. 또는 [자체 LLM을 사용](#lingodev-cli)할 수도 있습니다.

---

### Lingo.dev MCP

React 앱에서 i18n을 설정하는 것은 오류가 발생하기 쉽습니다. AI 코딩 어시스턴트조차 존재하지 않는 API를 환각으로 생성하고 라우팅을 망가뜨립니다. Lingo.dev MCP는 AI 어시스턴트에게 Next.js, React Router, TanStack Start를 위한 프레임워크별 i18n 지식에 대한 구조화된 액세스를 제공합니다. Claude Code, Cursor, GitHub Copilot Agents, Codex와 함께 작동합니다.

[문서 보기 →](https://lingo.dev/en/mcp)

---

### Lingo.dev CLI

JSON, YAML, 마크다운, CSV, PO 파일을 한 번의 명령으로 로컬라이제이션하세요. 락파일이 이미 로컬라이제이션된 내용을 추적하므로 새로운 콘텐츠나 변경된 콘텐츠만 처리됩니다. 기본적으로 Lingo.dev의 로컬라이제이션 엔진을 사용하거나, 자체 LLM(OpenAI, Anthropic, Google, Mistral, OpenRouter, Ollama)을 사용할 수 있습니다.

```bash
npx lingo.dev@latest init
npx lingo.dev@latest run
```

[문서 보기 →](https://lingo.dev/en/docs/cli)

---

### Lingo.dev CI/CD

파이프라인 내 지속적 현지화. 모든 푸시가 현지화를 트리거하며, 누락된 문자열은 코드가 프로덕션에 도달하기 전에 채워집니다. GitHub Actions, GitLab CI/CD, Bitbucket Pipelines를 지원합니다.

```yaml
uses: lingodotdev/lingo.dev@main
with:
  api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

[문서 보기 →](https://lingo.dev/en/docs/integrations)

---

### Lingo.dev API

백엔드 코드에서 직접 현지화 엔진을 호출하세요. 웹훅 전달을 통한 동기 및 비동기 현지화, 로케일별 장애 격리, WebSocket을 통한 실시간 진행 상황 제공.

[문서 보기 →](https://lingo.dev/en/docs/api)

---

### Lingo Compiler for React (얼리 알파)

i18n 래퍼 없이 빌드 타임에 React를 현지화하세요. 평범한 영어 텍스트로 컴포넌트를 작성하면, 컴파일러가 번역 가능한 문자열을 감지하고 빌드 시점에 현지화된 변형을 생성합니다. 번역 키도, JSON 파일도, `t()` 함수도 필요 없습니다. Next.js (App Router) 및 Vite + React를 지원합니다.

[문서 보기 →](https://lingo.dev/en/docs/react/compiler)

---

## 기여하기

기여를 환영합니다. 다음 가이드라인을 따라주세요:

1. **이슈:** [버그 신고 또는 기능 요청](https://github.com/lingodotdev/lingo.dev/issues)
2. **풀 리퀘스트:** [변경 사항 제출](https://github.com/lingodotdev/lingo.dev/pulls)
   - 모든 PR에는 체인지셋이 필요합니다: `pnpm new` (릴리스하지 않는 변경 사항의 경우 `pnpm new:empty`)
   - 제출 전 테스트가 통과하는지 확인하세요
3. **개발:** pnpm + turborepo 모노레포입니다
   - 의존성 설치: `pnpm install`
   - 테스트 실행: `pnpm test`
   - 빌드: `pnpm build`

**지원:** [Discord 커뮤니티](https://lingo.dev/go/discord)

## 스타 히스토리

Lingo.dev가 유용하다면 스타를 주시고 10,000개 스타 달성을 도와주세요!

[

![Star History Chart](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 현지화된 문서

**사용 가능한 번역:**

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

**새 언어 추가하기:**

1. [BCP-47 형식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale)을 사용하여 [`i18n.json`](./i18n.json)에 로케일 코드 추가
2. Pull request 제출
