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
    ⚡ Lingo.dev - LLM 기반 즉시 현지화를 위한 오픈소스 AI 기반 i18n 툴킷
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

## Compiler를 만나보세요 🆕

**Lingo.dev Compiler**는 기존 React 컴포넌트를 변경하지 않고도 빌드 시점에 모든 React 앱을 다국어로 만들 수 있도록 설계된 무료 오픈소스 컴파일러 미들웨어입니다.

> **참고:** 레거시 컴파일러(`@lingo.dev/_compiler`)를 사용 중이라면 `@lingo.dev/compiler`로 마이그레이션하세요. 레거시 컴파일러는 더 이상 사용되지 않으며 향후 릴리스에서 제거될 예정입니다.

한 번만 설치:

```bash
npm install @lingo.dev/compiler
```

빌드 설정에서 활성화:

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

`next build`를 실행하면 스페인어와 프랑스어 번들이 생성됩니다 ✨

전체 가이드는 [문서 보기 →](https://lingo.dev/compiler)에서 확인하고, 설정에 도움이 필요하면 [Discord에 참여](https://lingo.dev/go/discord)하세요.

---

### 이 저장소에는 무엇이 있나요?

| 도구         | 요약                                                                  | 문서                                    |
| ------------ | --------------------------------------------------------------------- | --------------------------------------- |
| **컴파일러** | 빌드 타임 React 로컬라이제이션                                        | [/compiler](https://lingo.dev/compiler) |
| **CLI**      | 웹 및 모바일 앱, JSON, YAML, 마크다운 등을 위한 원클릭 로컬라이제이션 | [/cli](https://lingo.dev/cli)           |
| **CI/CD**    | 모든 푸시마다 번역을 자동 커밋하고 필요시 풀 리퀘스트 생성            | [/ci](https://lingo.dev/ci)             |
| **SDK**      | 사용자 생성 콘텐츠를 위한 실시간 번역                                 | [/sdk](https://lingo.dev/sdk)           |

각 도구의 핵심 내용은 아래와 같습니다 👇

---

### ⚡️ Lingo.dev CLI

터미널에서 바로 코드와 콘텐츠를 번역하세요.

```bash
npx lingo.dev@latest run
```

모든 문자열을 핑거프린팅하고 결과를 캐싱하며 변경된 부분만 재번역합니다.

설정 방법은 [문서 보기 →](https://lingo.dev/cli)에서 확인하세요.

---

### 🔄 Lingo.dev CI/CD

완벽한 번역을 자동으로 배포하세요.

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

수동 작업 없이 저장소를 깔끔하게 유지하고 제품을 다국어로 만듭니다.

[문서 보기 →](https://lingo.dev/ci)

---

### 🧩 Lingo.dev SDK

동적 콘텐츠를 위한 요청별 즉시 번역.

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

채팅, 사용자 댓글 및 기타 실시간 플로우에 적합합니다.

[문서 읽기 →](https://lingo.dev/sdk)

---

## 🤝 커뮤니티

우리는 커뮤니티 중심이며 기여를 환영합니다!

- 아이디어가 있으신가요? [이슈 열기](https://github.com/lingodotdev/lingo.dev/issues)
- 무언가를 수정하고 싶으신가요? [PR 보내기](https://github.com/lingodotdev/lingo.dev/pulls)
- 도움이 필요하신가요? [Discord 참여하기](https://lingo.dev/go/discord)

## ⭐ 스타 히스토리

저희가 하는 일이 마음에 드신다면 ⭐를 주시고 10,000개의 스타를 달성할 수 있도록 도와주세요! 🌟

[

![스타 히스토리 차트](https://api.star-history.com/svg?repos=lingodotdev/lingo.dev&type=Date)

](https://www.star-history.com/#lingodotdev/lingo.dev&Date)

## 🌐 다른 언어로 된 Readme

[English](https://github.com/lingodotdev/lingo.dev) • [中文](/readme/zh-Hans.md) • [日本語](/readme/ja.md) • [한국어](/readme/ko.md) • [Español](/readme/es.md) • [Français](/readme/fr.md) • [Русский](/readme/ru.md) • [Українська](/readme/uk-UA.md) • [Deutsch](/readme/de.md) • [Italiano](/readme/it.md) • [العربية](/readme/ar.md) • [עברית](/readme/he.md) • [हिन्दी](/readme/hi.md) • [Português (Brasil)](/readme/pt-BR.md) • [বাংলা](/readme/bn.md) • [فارسی](/readme/fa.md) • [Polski](/readme/pl.md) • [Türkçe](/readme/tr.md) • [اردو](/readme/ur.md) • [भोजपुरी](/readme/bho.md) • [অসমীয়া](/readme/as-IN.md) • [ગુજરાતી](/readme/gu-IN.md) • [മലയാളം (IN)](/readme/ml-IN.md) • [मराठी](/readme/mr-IN.md) • [ଓଡ଼ିଆ](/readme/or-IN.md) • [ਪੰਜਾਬੀ](/readme/pa-IN.md) • [සිංහල](/readme/si-LK.md) • [தமிழ்](/readme/ta-IN.md) • [తెలుగు](/readme/te-IN.md)

원하는 언어가 보이지 않나요? [`i18n.json`](./i18n.json)에 추가하고 PR을 열어주세요!

**로케일 형식:** [BCP-47](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale) 코드 사용: `language[-Script][-REGION]`

- 언어: ISO 639-1/2/3 소문자 (`en`, `zh`, `bho`)
- 문자: ISO 15924 타이틀 케이스 (`Hans`, `Hant`, `Latn`)
- 지역: ISO 3166-1 alpha-2 대문자 (`US`, `CN`, `IN`)
- 예시: `en`, `pt-BR`, `zh-Hans`, `sr-Cyrl-RS`
