# @lingo.dev/\_compiler

## 0.7.7

### Patch Changes

- [#1130](https://github.com/lingodotdev/lingo.dev/pull/1130) [`bc7b08e`](https://github.com/lingodotdev/lingo.dev/commit/bc7b08ef1245d1af0c68813cb18193d4f14bc7e0) Thanks [@mathio](https://github.com/mathio)! - dictionary path calculation

## 0.7.6

### Patch Changes

- [#1121](https://github.com/lingodotdev/lingo.dev/pull/1121) [`b6071e4`](https://github.com/lingodotdev/lingo.dev/commit/b6071e4f19dd1823f4f2ce54ba5495538a94d4fd) Thanks [@mathio](https://github.com/mathio)! - compiler: prevent duplicate props

## 0.7.5

### Patch Changes

- [#1118](https://github.com/lingodotdev/lingo.dev/pull/1118) [`410825c`](https://github.com/lingodotdev/lingo.dev/commit/410825c8bf0029d8ee458514d6f203a7397c8f22) Thanks [@mathio](https://github.com/mathio)! - support Turbopack in Next.js v14 by Compiler

- [#1116](https://github.com/lingodotdev/lingo.dev/pull/1116) [`bc419ae`](https://github.com/lingodotdev/lingo.dev/commit/bc419aeeb4211d80d3c0ddd65deeab62ad68fea8) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - fix: move vitest from dependencies to devDependencies

## 0.7.4

### Patch Changes

- [#1072](https://github.com/lingodotdev/lingo.dev/pull/1072) [`3cb1ebe`](https://github.com/lingodotdev/lingo.dev/commit/3cb1ebec5441882678ab30a7d1b532bc2fc397b6) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Fixed compiler handling of namespace imports (import \* as React from "react") and default imports.

## 0.7.3

### Patch Changes

- Updated dependencies [[`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e), [`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e)]:
  - @lingo.dev/_spec@0.40.0
  - @lingo.dev/_sdk@0.12.0

## 0.7.2

### Patch Changes

- Updated dependencies [[`85dfc10`](https://github.com/lingodotdev/lingo.dev/commit/85dfc10961b116e31b2bb478f42013756ca49974)]:
  - @lingo.dev/_sdk@0.11.0

## 0.7.1

### Patch Changes

- [#1040](https://github.com/lingodotdev/lingo.dev/pull/1040) [`f897a7d`](https://github.com/lingodotdev/lingo.dev/commit/f897a7d0a3f7a236fb64f19bce9a8d00626d09ca) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Fixed the compiler to handle type-only react imports.

## 0.7.0

### Minor Changes

- [#997](https://github.com/lingodotdev/lingo.dev/pull/997) [`bd9538a`](https://github.com/lingodotdev/lingo.dev/commit/bd9538ac6eba0ffc91ffc1fef5db6366c13e9e06) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - ### Whitespace Normalization Fix

  - Improved `normalizeJsxWhitespace` logic to preserve leading spaces inside JSX elements while removing unnecessary formatting whitespace and extra lines.
  - Ensured explicit whitespace (e.g., `{" "}`) is handled correctly without introducing double spaces.
  - Added targeted tests (`jsx-content-whitespace.spec.ts`) to verify whitespace handling.
  - Cleaned up unnecessary debug/test files created during development.

## 0.6.3

### Patch Changes

- Updated dependencies [[`afbb978`](https://github.com/lingodotdev/lingo.dev/commit/afbb978fec83d574f2c43b7d68457e435fca9b57)]:
  - @lingo.dev/_spec@0.39.3
  - @lingo.dev/_sdk@0.10.2

## 0.6.2

### Patch Changes

- [#1023](https://github.com/lingodotdev/lingo.dev/pull/1023) [`9266fd0`](https://github.com/lingodotdev/lingo.dev/commit/9266fd0bcddf4b07ca51d2609af92a9473106f9d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update Zod dependency to version 3.25.76

- Updated dependencies [[`9266fd0`](https://github.com/lingodotdev/lingo.dev/commit/9266fd0bcddf4b07ca51d2609af92a9473106f9d)]:
  - @lingo.dev/_spec@0.39.2
  - @lingo.dev/_sdk@0.10.1

## 0.6.1

### Patch Changes

- [#1021](https://github.com/lingodotdev/lingo.dev/pull/1021) [`6baa1a7`](https://github.com/lingodotdev/lingo.dev/commit/6baa1a7e88dbfac3783d1d49695595077fd8d209) Thanks [@mathio](https://github.com/mathio)! - add lingo.dev provider details

## 0.6.0

### Minor Changes

- [#1010](https://github.com/lingodotdev/lingo.dev/pull/1010) [`864c305`](https://github.com/lingodotdev/lingo.dev/commit/864c30586510e6b69739c20fa42efdf45d8881ed) Thanks [@davidturnbull](https://github.com/davidturnbull)! - improve type safety of compiler params

### Patch Changes

- Updated dependencies [[`cb2aa0f`](https://github.com/lingodotdev/lingo.dev/commit/cb2aa0f505d6b7dbc435b526e8a6f62265d1f453)]:
  - @lingo.dev/_sdk@0.10.0

## 0.5.5

### Patch Changes

- [#1011](https://github.com/lingodotdev/lingo.dev/pull/1011) [`bfcb424`](https://github.com/lingodotdev/lingo.dev/commit/bfcb424eb4479d0d3b767e062d30f02c5bcaeb14) Thanks [@mathio](https://github.com/mathio)! - replace elements with dot in name

## 0.5.4

### Patch Changes

- [#1002](https://github.com/lingodotdev/lingo.dev/pull/1002) [`2b297ba`](https://github.com/lingodotdev/lingo.dev/commit/2b297babe76f9799c5154d9421fecd1ebbe1bb72) Thanks [@mathio](https://github.com/mathio)! - support custom prompts in compiler

## 0.5.3

### Patch Changes

- Updated dependencies []:
  - @lingo.dev/_sdk@0.9.6

## 0.5.2

### Patch Changes

- Updated dependencies []:
  - @lingo.dev/_sdk@0.9.5

## 0.5.1

### Patch Changes

- [#972](https://github.com/lingodotdev/lingo.dev/pull/972) [`b249484`](https://github.com/lingodotdev/lingo.dev/commit/b249484d6f0060e29cd5b50b3d8ce68b857ccad5) Thanks [@mathio](https://github.com/mathio)! - support components with dot in name

## 0.5.0

### Minor Changes

- [#958](https://github.com/lingodotdev/lingo.dev/pull/958) [`84fd214`](https://github.com/lingodotdev/lingo.dev/commit/84fd214a21766e7683c5d645fcb8c4c0162eb0b6) Thanks [@chrissiwaffler](https://github.com/chrissiwaffler)! - feat: add Mistral AI as a supported LLM provider

  - Added Mistral AI provider support across the entire lingo.dev ecosystem
  - Users can now use Mistral models for localization by setting MISTRAL_API_KEY
  - Supports all Mistral models available through the @ai-sdk/mistral package
  - Configuration via environment variable or user-wide config: `npx lingo.dev@latest config set llm.mistralApiKey <key>`

### Patch Changes

- Updated dependencies []:
  - @lingo.dev/_sdk@0.9.4

## 0.4.1

### Patch Changes

- Updated dependencies []:
  - @lingo.dev/_sdk@0.9.3

## 0.4.0

### Minor Changes

- [#932](https://github.com/lingodotdev/lingo.dev/pull/932) [`1bba8ee`](https://github.com/lingodotdev/lingo.dev/commit/1bba8eed6272ae166ceb9b92963404bfe90a4aaa) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Add support for Next.js Turbopack with the Lingo.dev compiler.

## 0.3.5

### Patch Changes

- [#947](https://github.com/lingodotdev/lingo.dev/pull/947) [`d80285a`](https://github.com/lingodotdev/lingo.dev/commit/d80285a9b12bd85425564cb00e558812fd0aee40) Thanks [@mathio](https://github.com/mathio)! - remove local variable cache

## 0.3.4

### Patch Changes

- [#937](https://github.com/lingodotdev/lingo.dev/pull/937) [`4e5983d`](https://github.com/lingodotdev/lingo.dev/commit/4e5983d7e59ebf9eb529c4b7c1c87689432ac873) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update documentation URLs from docs.lingo.dev to lingo.dev/cli and lingo.dev/compiler

- Updated dependencies [[`4e5983d`](https://github.com/lingodotdev/lingo.dev/commit/4e5983d7e59ebf9eb529c4b7c1c87689432ac873)]:
  - @lingo.dev/_sdk@0.9.2

## 0.3.3

### Patch Changes

- [`76cbd9b`](https://github.com/lingodotdev/lingo.dev/commit/76cbd9b2f2e1217421ad1f671bed5b3d64b43333) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - dictionary merging

## 0.3.2

### Patch Changes

- [`01f253d`](https://github.com/lingodotdev/lingo.dev/commit/01f253dd9759b518f400dff03ab51b460b9b8997) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix dictionary merging

## 0.3.1

### Patch Changes

- [`8e97256`](https://github.com/lingodotdev/lingo.dev/commit/8e97256ca4e78dd09a967539ca9dec359bd558ef) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix dictionary merging

## 0.3.0

### Minor Changes

- [#913](https://github.com/lingodotdev/lingo.dev/pull/913) [`1b9b113`](https://github.com/lingodotdev/lingo.dev/commit/1b9b11301978e8caa2555832d027ff93216aa6e1) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Add support for Ollama as a CLI and Compiler provider.

- [#922](https://github.com/lingodotdev/lingo.dev/pull/922) [`0329a9c`](https://github.com/lingodotdev/lingo.dev/commit/0329a9cdb5e5a63fcecab4efcd7cce22f155a0e9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add openrouter ais support for compiler

### Patch Changes

- [#925](https://github.com/lingodotdev/lingo.dev/pull/925) [`215af19`](https://github.com/lingodotdev/lingo.dev/commit/215af1944667cce66e9c5966f4fb627186687b74) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - improved compiler concurrency, caching, added lingo.dev engine to the compiler, and updated demo apps

- Updated dependencies []:
  - @lingo.dev/_sdk@0.9.1

## 0.2.4

### Patch Changes

- [#919](https://github.com/lingodotdev/lingo.dev/pull/919) [`3b6574f`](https://github.com/lingodotdev/lingo.dev/commit/3b6574f0499f3f4d3c48f66ba2b828d2c1c0ceb0) Thanks [@mathio](https://github.com/mathio)! - update package import names

## 0.2.3

### Patch Changes

- [#911](https://github.com/lingodotdev/lingo.dev/pull/911) [`d7e74c6`](https://github.com/lingodotdev/lingo.dev/commit/d7e74c6cc724da8ae759ba8d8fdb1a64867d505c) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix hyphens in locale names

## 0.2.2

### Patch Changes

- [#905](https://github.com/lingodotdev/lingo.dev/pull/905) [`1a235a1`](https://github.com/lingodotdev/lingo.dev/commit/1a235a17455fb2631f7426283aa8431209999758) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - remove @/ path mapping in compiler

## 0.2.1

### Patch Changes

- [#900](https://github.com/lingodotdev/lingo.dev/pull/900) [`fead8e0`](https://github.com/lingodotdev/lingo.dev/commit/fead8e08dc2b2869a093cb25a04f6e0aa78cf6b7) Thanks [@mathio](https://github.com/mathio)! - load API key from env var and env files

## 0.2.0

### Minor Changes

- [#897](https://github.com/lingodotdev/lingo.dev/pull/897) [`a5da697`](https://github.com/lingodotdev/lingo.dev/commit/a5da697f7efd46de31d17b202d06eb5f655ed9b9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add support for other providers in the compiler and implement Google AI as a provider.

## 0.1.13

### Patch Changes

- [#890](https://github.com/lingodotdev/lingo.dev/pull/890) [`145fb74`](https://github.com/lingodotdev/lingo.dev/commit/145fb74c09b42c8810f351be5a641b1366881ae1) Thanks [@mathio](https://github.com/mathio)! - do not parse LingoProvider component

- [#889](https://github.com/lingodotdev/lingo.dev/pull/889) [`0c45acc`](https://github.com/lingodotdev/lingo.dev/commit/0c45accfc45e63f597758c47033bc58d2f6059b5) Thanks [@mathio](https://github.com/mathio)! - update Groq API error handling

## 0.1.12

### Patch Changes

- [#887](https://github.com/lingodotdev/lingo.dev/pull/887) [`511a2ec`](https://github.com/lingodotdev/lingo.dev/commit/511a2ecd68a9c5e2800035d5c6a6b5b31b2dc80f) Thanks [@mathio](https://github.com/mathio)! - handle when lingo dir is deleted

## 0.1.11

### Patch Changes

- [#883](https://github.com/lingodotdev/lingo.dev/pull/883) [`7191444`](https://github.com/lingodotdev/lingo.dev/commit/7191444f67864ea5b5a91a9be759b2445bf186d3) Thanks [@mathio](https://github.com/mathio)! - client-side loading state

## 0.1.10

### Patch Changes

- [#876](https://github.com/lingodotdev/lingo.dev/pull/876) [`152e96a`](https://github.com/lingodotdev/lingo.dev/commit/152e96a46b98dd25d558ff0e7e20b18b954d375a) Thanks [@vrcprl](https://github.com/vrcprl)! - fix for triggering reload on Windows

## 0.1.9

### Patch Changes

- [#866](https://github.com/lingodotdev/lingo.dev/pull/866) [`77461a7`](https://github.com/lingodotdev/lingo.dev/commit/77461a7872eec3ea188b3ca6c6f7ce1fd13fdfbb) Thanks [@vrcprl](https://github.com/vrcprl)! - normalize paths in dictionaries

## 0.1.8

### Patch Changes

- [#861](https://github.com/lingodotdev/lingo.dev/pull/861) [`1bccb7e`](https://github.com/lingodotdev/lingo.dev/commit/1bccb7ed51ac1f13ea79e618bbee551d5529efdc) Thanks [@vrcprl](https://github.com/vrcprl)! - support filePath on Windows

## 0.1.7

### Patch Changes

- [`5b68641`](https://github.com/lingodotdev/lingo.dev/commit/5b686414f363f8ee4b79fd4e804a434db5cfcb36) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - feat: unshift the plugins

## 0.1.6

### Patch Changes

- [`7a5898b`](https://github.com/lingodotdev/lingo.dev/commit/7a5898b12dcd0015a5e57236bf65172cedb8a6ee) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - merge dictionaries

## 0.1.5

### Patch Changes

- [`7013b53`](https://github.com/lingodotdev/lingo.dev/commit/7013b5300d6c2c26f39da62b5ad2c7cf11158c74) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - value.trim() issue

## 0.1.4

### Patch Changes

- [#853](https://github.com/lingodotdev/lingo.dev/pull/853) [`cb7d5e2`](https://github.com/lingodotdev/lingo.dev/commit/cb7d5e213282c00af658159472183a763f84ca3d) Thanks [@vrcprl](https://github.com/vrcprl)! - Fix groq api key retrieval from .env

## 0.1.3

### Patch Changes

- [`f42cff8`](https://github.com/lingodotdev/lingo.dev/commit/f42cff8355b1ff7bba1445bd04d11ee4672903c2) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - flat reexports

## 0.1.2

### Patch Changes

- [`920e3f5`](https://github.com/lingodotdev/lingo.dev/commit/920e3f5c3ca1fd51b0919db13a4787cfd616de54) Thanks [@mathio](https://github.com/mathio)! - remove cloneDeep for optimization

## 0.1.1

### Patch Changes

- [`caef325`](https://github.com/lingodotdev/lingo.dev/commit/caef3253bc99fa7bf7a0b40e5604c3590dcb4958) Thanks [@mathio](https://github.com/mathio)! - release fix

## 0.1.0

### Minor Changes

- [`e980e84`](https://github.com/lingodotdev/lingo.dev/commit/e980e84178439ad70417d38b425acf9148cfc4b6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added the compiler
