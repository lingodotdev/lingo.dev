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
    Lingo.dev는 로컬라이제이션 엔지니어링 플랫폼입니다: 번역 품질 측정, LLM을
    활용한 번역, 그리고 원어민 검수를 위한 최고의 솔루션입니다.
  </strong>
</p>

<p align="center">
  <a href="https://lingo.dev/en/docs">문서</a> •
  <a href="https://lingo.dev">플랫폼</a> •
  <a href="https://lingo.dev/go/discord">Discord</a>
</p>

<p align="center">
  <a href="https://lingo.dev/en">
    <img
      src="https://img.shields.io/badge/Product%20Hunt-%231%20DevTool%20of%20the%20Month-orange?logo=producthunt&style=flat-square"
      alt="Product Hunt 이달의 개발 도구 1위"
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
</p>

---

## 팀은 Lingo.dev에서 로컬라이제이션 엔진을 구축합니다

[로컬라이제이션 엔진](https://lingo.dev/en/docs/platform/engines)은 팀이 구성하고 Lingo.dev가 실행하는 상태 기반 번역 API입니다. 제품별, 콘텐츠 유형별 또는 브랜드별로 엔진을 구축하세요. 엔진을 통과하는 모든 요청은 고정된 우선순위에 따라 구성된 모든 설정을 적용합니다:

| 레이어                                                           | 구성 내용                                         | 문서 참고사항                                            |
| ---------------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| [LLM 모델](https://lingo.dev/en/docs/platform/llm-models)        | 각 언어 쌍을 처리할 모델과 우선순위별 대체 모델   | 400개 이상의 모델; 응답에 실행된 모델명 표시             |
| [브랜드 보이스](https://lingo.dev/en/docs/platform/brand-voices) | 각 언어에서 제품이 소통하는 방식, 로케일별 텍스트 | 시장별 어조 및 격식 수준                                 |
| [규칙](https://lingo.dev/en/docs/platform/rules)                 | 일반 모델이 놓치는 언어적 규칙                    | 스페인어 형용사 위치, 백분율 기호 앞 공백                |
| [용어집](https://lingo.dev/en/docs/platform/glossaries)          | 로케일별 정확한 용어 매핑, 의미 기반 매칭         | 유럽 시장에서 "911"은 "112"로 변환; 제품명은 그대로 유지 |
| [AI 리뷰어](https://lingo.dev/en/docs/platform/ai-reviewers)     | 모든 번역 후 실행되는 평가                        | GEMBA 점수, BERTScore, 용어집 준수도                     |

용어집, 규칙 세트, 브랜드 보이스는 조직에 속하며, 엔진은 이들을 첨부하여 적용합니다. 하나의 용어집이 다섯 개의 엔진을 관리하며, 한 번의 수정이 다섯 개 모두에 적용됩니다. [플레이그라운드](https://lingo.dev/en/docs/platform/playground)에서 변경사항을 실제 적용 전에 테스트하세요: 엔진과 원본 모델을 비교하거나 두 엔진을 나란히 비교할 수 있습니다. 엔진은 플랫폼에서 구성되며, 로컬라이제이션 팀이 로컬라이제이션 인프라를 운영하는 곳입니다.

## 코드에서 엔진에 접근하기

리포지토리의 콘텐츠를 번역하세요. `lingo push`는 파일을 `.lingo/config.json`에 명명된 엔진으로 전송하고, `lingo pull`는 모든 머신에서 번역을 다시 작성합니다:

```bash
npm install -g @lingo.dev/cli
lingo init && lingo link
lingo push
```

또는 ID로 엔진을 직접 호출하세요:

```javascript
const res = await fetch("https://api.lingo.dev/process/localize", {
  method: "POST",
  headers: {
    "X-API-Key": process.env.LINGO_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    engineId: "eng_abc123",
    sourceLocale: "en",
    targetLocale: "de",
    data: { greeting: "Hello, world!", cta: "Get started" },
  }),
});

const { data, model, usage } = await res.json();
// data:  { greeting: "Hallo, Welt!", cta: "Jetzt starten" }
// model: "anthropic/claude-sonnet-4.5"
// usage: { inputTokens: 2789, outputTokens: 861, cost: 0.023012 }
```

|                                                                        |                                                                                                                                                               |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Lingo.dev MCP](https://lingo.dev/en/docs/mcp)                         | 코딩 에이전트가 엔진을 생성하고, 용어집 용어를 추가하며, 규칙을 조정하고, 문제가 발생한 대화에서 두 엔진을 비교합니다                                         |
| [Lingo.dev CLI](https://lingo.dev/en/docs/cli)                         | 터미널 또는 CI에서 소스 파일을 푸시하고 번역을 풀합니다. 18가지 형식: JSON, YAML, Markdown, MDX, PO, XLIFF, Flutter ARB, Android 및 Xcode 문자열, SubRip, PHP |
| [Lingo.dev in CI/CD](https://lingo.dev/en/docs/workflows)              | CLI를 설치하고 GitHub Actions, GitLab CI/CD, Bitbucket Pipelines 또는 Node.js 22+ 지원 러너에서 `lingo push`를 단계로 실행하세요                              |
| [Lingo.dev GitHub App](https://lingo.dev/en/docs/workflows/github-app) | 한 번 설치하면 기본 브랜치에 푸시할 때마다 번역 풀 리퀘스트가 열리거나 업데이트됩니다. 러너, API 키 시크릿, 관리할 락파일이 필요 없습니다                     |
| [Lingo.dev API](https://lingo.dev/en/docs/api)                         | 언어 쌍당 하나의 동기 호출, 또는 하나의 요청을 여러 로케일로 분산하고 결과가 도착하는 대로 전달하는 비동기 작업                                               |

[첫 번째 현지화 엔진 구축하기 →](https://lingo.dev)
