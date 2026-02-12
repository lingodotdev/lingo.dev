# @lingo.dev/compiler

## 0.3.7

### Patch Changes

- [#1955](https://github.com/lingodotdev/lingo.dev/pull/1955) [`3c40593`](https://github.com/lingodotdev/lingo.dev/commit/3c40593dfa4c4303795e7032936b31441a0b7e02) Thanks [@AndreyHirsa](https://github.com/AndreyHirsa)! - - Migrate metadata storage from JSON files to LMDB
  - New storage locations: .lingo/metadata-dev/ and .lingo/metadata-build/
  - Update new-compiler docs
  - Remove proper-lockfile dependency

## 0.3.6

### Patch Changes

- Updated dependencies [[`27a6419`](https://github.com/lingodotdev/lingo.dev/commit/27a6419911ffbecdc8052d053a42269d00b7ea75)]:
  - lingo.dev@0.131.0

## 0.3.5

### Patch Changes

- Updated dependencies [[`ef9fcbd`](https://github.com/lingodotdev/lingo.dev/commit/ef9fcbda434a1f29d69de8b3f5faa13e3cb4921a), [`09ac536`](https://github.com/lingodotdev/lingo.dev/commit/09ac536e0106946a8f1d1b8e80f981bc689786d0)]:
  - lingo.dev@0.130.0

## 0.3.4

### Patch Changes

- Updated dependencies [[`330ee4e`](https://github.com/lingodotdev/lingo.dev/commit/330ee4e77d3f698b6f038e58e2ac8e5509cc14fe), [`ce47cf3`](https://github.com/lingodotdev/lingo.dev/commit/ce47cf34760b9377517b1204e4e84b6f1d908d6c)]:
  - lingo.dev@0.129.0

## 0.3.3

### Patch Changes

- Updated dependencies [[`1194a30`](https://github.com/lingodotdev/lingo.dev/commit/1194a301d6477bc5d7e6f037fc597eeea8a19f2f)]:
  - lingo.dev@0.128.0

## 0.3.2

### Patch Changes

- Updated dependencies [[`fa69822`](https://github.com/lingodotdev/lingo.dev/commit/fa698227c49eda4a4727f3fa0c3343fc6279730d)]:
  - lingo.dev@0.126.0

## 0.3.1

### Patch Changes

- [#1932](https://github.com/lingodotdev/lingo.dev/pull/1932) [`2c1246e`](https://github.com/lingodotdev/lingo.dev/commit/2c1246e0d640c8dd88ef6c81683d4c6556ec5110) Thanks [@AndreyHirsa](https://github.com/AndreyHirsa)! - Fixed metadata file lock contention errors (ELOCKED) during parallel builds by increasing lock retry count and timeouts

## 0.3.0

### Minor Changes

- [#1888](https://github.com/lingodotdev/lingo.dev/pull/1888) [`8cd5c6b`](https://github.com/lingodotdev/lingo.dev/commit/8cd5c6b80d6fd17f698674ec39c3f010bc8359ec) Thanks [@yashrajpatilll](https://github.com/yashrajpatilll)! - Make pluralization opt-in by default and infer the pluralization model from translation config.

## 0.2.0

### Minor Changes

- [#1900](https://github.com/lingodotdev/lingo.dev/pull/1900) [`f30b4b3`](https://github.com/lingodotdev/lingo.dev/commit/f30b4b305cde3f02d4af4eafe4d01eb0c3aa336b) Thanks [@cherkanovart](https://github.com/cherkanovart)! - Add support for OpenAI-compatible providers (Nebius, Together AI, etc.) by using Chat Completions API when OPENAI_BASE_URL is set

- [#1900](https://github.com/lingodotdev/lingo.dev/pull/1900) [`f30b4b3`](https://github.com/lingodotdev/lingo.dev/commit/f30b4b305cde3f02d4af4eafe4d01eb0c3aa336b) Thanks [@cherkanovart](https://github.com/cherkanovart)! - Add support for OpenAI-compatible providers (e.g., Nebius) via OPENAI_BASE_URL environment variable

### Patch Changes

- Updated dependencies []:
  - lingo.dev@0.125.4

## 0.1.13

### Patch Changes

- [#1874](https://github.com/lingodotdev/lingo.dev/pull/1874) [`5ca8439`](https://github.com/lingodotdev/lingo.dev/commit/5ca8439aedd2909e359652f8f3a1b33d4ccd9f6a) Thanks [@vrcprl](https://github.com/vrcprl)! - simplify observability

- Updated dependencies [[`5ca8439`](https://github.com/lingodotdev/lingo.dev/commit/5ca8439aedd2909e359652f8f3a1b33d4ccd9f6a)]:
  - lingo.dev@0.125.1

## 0.1.12

### Patch Changes

- Updated dependencies [[`e3a383b`](https://github.com/lingodotdev/lingo.dev/commit/e3a383b8a82110984cef1d1ce477d1e0bf65c488)]:
  - lingo.dev@0.125.0

## 0.1.11

### Patch Changes

- Updated dependencies [[`29c598c`](https://github.com/lingodotdev/lingo.dev/commit/29c598caa1fc6b02693eafa12d245f8fbfdfe4b8), [`29c598c`](https://github.com/lingodotdev/lingo.dev/commit/29c598caa1fc6b02693eafa12d245f8fbfdfe4b8)]:
  - lingo.dev@0.124.0

## 0.1.10

### Patch Changes

- Updated dependencies [[`403bba9`](https://github.com/lingodotdev/lingo.dev/commit/403bba908d8abd9bb4c9cd58072e54f3f72e8e96)]:
  - lingo.dev@0.123.0

## 0.1.9

### Patch Changes

- Updated dependencies [[`e8407e6`](https://github.com/lingodotdev/lingo.dev/commit/e8407e6bb3c951f0fe3d9c2a3b109cb21090e08c)]:
  - lingo.dev@0.122.0

## 0.1.8

### Patch Changes

- Updated dependencies [[`606fd5b`](https://github.com/lingodotdev/lingo.dev/commit/606fd5b10d9d15a42a65d1cb763f59210d3c8842)]:
  - lingo.dev@0.121.0

## 0.1.7

### Patch Changes

- [#1749](https://github.com/lingodotdev/lingo.dev/pull/1749) [`5bc0c89`](https://github.com/lingodotdev/lingo.dev/commit/5bc0c8952d1bc01be7a2e7b49506f6a5f8f05a59) Thanks [@sumitsaurabh927](https://github.com/sumitsaurabh927)! - create a new space for community contributions like demo apps etc

- Updated dependencies [[`348b2de`](https://github.com/lingodotdev/lingo.dev/commit/348b2de39412101bacb5ed541b0db23f0ca6213d), [`04c3679`](https://github.com/lingodotdev/lingo.dev/commit/04c3679c69231012f167da1640dc17ac57743d6b), [`5bc0c89`](https://github.com/lingodotdev/lingo.dev/commit/5bc0c8952d1bc01be7a2e7b49506f6a5f8f05a59), [`797f913`](https://github.com/lingodotdev/lingo.dev/commit/797f9132b5cf05fe457968b691bca10db1fc37bb)]:
  - lingo.dev@0.120.0

## 0.1.6

### Patch Changes

- Updated dependencies [[`978b817`](https://github.com/lingodotdev/lingo.dev/commit/978b81793dff52abb348b1b0977cb233232721d0)]:
  - lingo.dev@0.119.0

## 0.1.5

### Patch Changes

- Updated dependencies [[`18ef68f`](https://github.com/lingodotdev/lingo.dev/commit/18ef68f8d51f0d3208cfe1f1d2167e2e1580fdcc), [`d76b729`](https://github.com/lingodotdev/lingo.dev/commit/d76b729ba692f1ec258355ebed5b47d7137b001d)]:
  - lingo.dev@0.118.0

## 0.1.4

### Patch Changes

- [#1726](https://github.com/lingodotdev/lingo.dev/pull/1726) [`68b8496`](https://github.com/lingodotdev/lingo.dev/commit/68b849602a88b9f9aa3097f37ce2f0ccf97c1ad5) Thanks [@vrcprl](https://github.com/vrcprl)! - Observability improvement

- Updated dependencies [[`68b8496`](https://github.com/lingodotdev/lingo.dev/commit/68b849602a88b9f9aa3097f37ce2f0ccf97c1ad5)]:
  - lingo.dev@0.117.25

## 0.1.3

### Patch Changes

- [#1705](https://github.com/lingodotdev/lingo.dev/pull/1705) [`c77c8c8`](https://github.com/lingodotdev/lingo.dev/commit/c77c8c8b8e1db859839b184882d56a0ef7da1ab0) Thanks [@AleksandrSl](https://github.com/AleksandrSl)! - Show logs of the translator initialization to notify about possible problems with LLM keys

- Updated dependencies [[`c617611`](https://github.com/lingodotdev/lingo.dev/commit/c61761181c5f8145ec2e54f34d33ad04a90968e3)]:
  - lingo.dev@0.117.24

## 0.1.2

### Patch Changes

- [#1707](https://github.com/lingodotdev/lingo.dev/pull/1707) [`b2d335b`](https://github.com/lingodotdev/lingo.dev/commit/b2d335b37af3e300a402d75f0eb2a0112f81e7ee) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - docs: comprehensive README update with LLM configuration, manual overrides, and advanced features

  Added extensive documentation covering:
  - Complete LLM provider configuration (OpenAI, Anthropic, Google, Groq, Mistral, OpenRouter, Ollama)
  - Environment variables for all supported providers
  - Locale-pair model mapping with wildcard patterns
  - Custom translation prompts
  - Manual translation overrides using data-lingo-override attribute
  - Build modes (translate vs cache-only) and recommended workflows
  - Custom locale resolvers (server and client)
  - Configuration options table with defaults
  - Development configuration (pseudotranslator, translation server port)
  - Locale persistence configuration (cookie settings)
  - Pluralization configuration
  - Updated feature list
  - Fixed demo app paths in examples

- Updated dependencies [[`020424f`](https://github.com/lingodotdev/lingo.dev/commit/020424f2601c535e88c66aeeece5a15fb9b66b70)]:
  - lingo.dev@0.117.22

## 0.1.1

### Patch Changes

- [`b6e4ea9`](https://github.com/lingodotdev/lingo.dev/commit/b6e4ea9266723499cef5e9a55bd9b052740cfe5e) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - No-op release to test Trusted Publishing with OIDC

## 0.1.0

### Minor Changes

- [#1698](https://github.com/lingodotdev/lingo.dev/pull/1698) [`f24a5e2`](https://github.com/lingodotdev/lingo.dev/commit/f24a5e282d79838b84f46c98dd85460a0ad953c7) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Lingo.dev Compiler v1 Beta
