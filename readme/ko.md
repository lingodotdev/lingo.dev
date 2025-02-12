<p align="center">
  <a href="https://lingo.dev">
    <img src="/content/banner.dark.png" width="100%" alt="Lingo.dev" />
  </a>
</p>

<p align="center">
  <strong>⚡️ CI/CD에서 바로 사용 가능한 웹 & 모바일용 AI 현지화 툴킷</strong>
</p>

<br />

<p align="center">
  <a href="https://lingo.dev">웹사이트</a> •
  <a href="https://github.com/lingodotdev/lingo.dev/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22">기여하기</a> •
  <a href="#-github-action">GitHub Action</a>
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
</p>

<br />

Lingo.dev는 최신 LLM 모델을 사용하여 소프트웨어 현지화를 엔드투엔드로 자동화합니다.

제품 컨텍스트를 이해하는 Lingo.dev 현지화 엔진은 60개 이상의 언어에서 원어민이 기대하는 수준의 완벽한 번역을 즉시 생성하여 수동 작업과 관리 부담을 제거합니다. 결과적으로 팀은 최첨단 품질로 100배 더 빠르게 현지화를 수행하여 전 세계의 더 많은 유료 고객에게 기능을 제공할 수 있습니다.

## 💫 빠른 시작

1. [웹사이트](https://lingo.dev)에서 계정 생성하기

2. 프로젝트 초기화:

   ```bash
   npx lingo.dev@latest init
   ```

3. 문서 확인하기: [docs.lingo.dev](https://docs.lingo.dev)

4. 앱 로컬라이제이션 실행(몇 초면 완료):
   ```bash
   npx lingo.dev@latest i18n
   ```

## 🤖 GitHub Action

Lingo.dev는 CI/CD 파이프라인에서 로컬라이제이션을 자동화하는 GitHub Action을 제공합니다. 기본 설정은 다음과 같습니다:

```yaml
- uses: lingodotdev/lingo.dev@main
  with:
    api-key: ${{ secrets.LINGODOTDEV_API_KEY }}
```

이 액션은 모든 푸시에서 `lingo.dev i18n`을 실행하여 번역을 자동으로 최신 상태로 유지합니다.

풀 리퀘스트 모드와 기타 설정 옵션에 대해서는 [GitHub Action 문서](https://docs.lingo.dev/setup/gha)를 참조하세요.

## 🥇 팀들이 Lingo.dev를 선택하는 이유

- 🔥 **즉시 통합**: 몇 분 만에 설정 완료
- 🔄 **CI/CD 자동화**: 개발 파이프라인과 원활한 통합
- 🌍 **60개 이상의 언어**: 손쉬운 글로벌 확장
- 🧠 **AI 현지화 엔진**: 제품에 완벽하게 맞는 번역
- 📊 **유연한 포맷**: JSON, YAML, CSV, Markdown 등 지원

## 🛠️ 강력한 기능

- ⚡️ **초고속**: 몇 초 만에 AI 현지화
- 🔄 **자동 업데이트**: 최신 콘텐츠와 동기화
- 🌟 **네이티브 품질**: 자연스러운 번역
- 👨‍💻 **개발자 친화적**: 워크플로우와 통합되는 CLI
- 📈 **확장성**: 성장하는 스타트업과 엔터프라이즈 팀을 위한 솔루션

## 📚 문서

자세한 가이드와 API 레퍼런스는 [문서](https://lingo.dev/go/docs)를 참조하세요.

## 🤝 기여하기

고객이 아니더라도 기여하고 싶으신가요?

[Good First Issues](https://github.com/lingodotdev/lingo.dev/labels/good%20first%20issue)를 확인하고 [기여 가이드](./CONTRIBUTING.md)를 읽어보세요.

## 👨‍💻 팀

- **[Veronica](https://github.com/vrcprl)**
- **[Max](https://github.com/maxprilutskiy)**
- **[Matej](https://github.com/mathio)**

문의사항이 있으신가요? veronica@lingo.dev로 이메일을 보내주세요

## 🌐 다른 언어로 된 Readme

- [영어](https://github.com/lingodotdev/lingo.dev)
- [스페인어](/readme/es.md)
- [프랑스어](/readme/fr.md)
- [러시아어](/readme/ru.md)
- [독일어](/readme/de.md)
- [중국어](/readme/zh-Hans.md)
- [한국어](/readme/ko.md)
- [일본어](/readme/ja.md)
- [이탈리아어](/readme/it.md)
- [아랍어](/readme/ar.md)
- [힌디어](/readme/hi.md)

원하는 언어가 없으신가요? [`i18n.json`](./i18n.json) 파일에 새로운 언어 코드를 추가하고 PR을 열어주세요.
