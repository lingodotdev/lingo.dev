# lingo.dev

## 0.111.13

### Patch Changes

- [#1197](https://github.com/lingodotdev/lingo.dev/pull/1197) [`762396b`](https://github.com/lingodotdev/lingo.dev/commit/762396bb37110dbe3e4e000edb27892b318aa3ef) Thanks [@vrcprl](https://github.com/vrcprl)! - biome error logging

## 0.111.12

### Patch Changes

- [#1195](https://github.com/lingodotdev/lingo.dev/pull/1195) [`468a59b`](https://github.com/lingodotdev/lingo.dev/commit/468a59b89736c72253b1f32abbf30a950e5434ec) Thanks [@vrcprl](https://github.com/vrcprl)! - Fix Biome formatting

## 0.111.11

### Patch Changes

- [#1192](https://github.com/lingodotdev/lingo.dev/pull/1192) [`bbc71b9`](https://github.com/lingodotdev/lingo.dev/commit/bbc71b9948ccc289c9669d8b0c276c9596f6a5e7) Thanks [@vrcprl](https://github.com/vrcprl)! - Add biome support

- Updated dependencies [[`bbc71b9`](https://github.com/lingodotdev/lingo.dev/commit/bbc71b9948ccc289c9669d8b0c276c9596f6a5e7)]:
  - @lingo.dev/_spec@0.40.3
  - @lingo.dev/_compiler@0.7.10
  - @lingo.dev/_sdk@0.12.3

## 0.111.10

### Patch Changes

- [#1189](https://github.com/lingodotdev/lingo.dev/pull/1189) [`0e6d605`](https://github.com/lingodotdev/lingo.dev/commit/0e6d605a9ad6835bef26c40895760c652a69b7a2) Thanks [@vrcprl](https://github.com/vrcprl)! - upd stars

## 0.111.9

### Patch Changes

- [#1177](https://github.com/lingodotdev/lingo.dev/pull/1177) [`03138da`](https://github.com/lingodotdev/lingo.dev/commit/03138dac37e869e2e99702ffd3c76532f1c58aa6) Thanks [@davidturnbull](https://github.com/davidturnbull)! - Improve CLI command descriptions

- [#1183](https://github.com/lingodotdev/lingo.dev/pull/1183) [`9557fe5`](https://github.com/lingodotdev/lingo.dev/commit/9557fe572d3e4a1a4d8c1e35417fe3b7531c3d52) Thanks [@vrcprl](https://github.com/vrcprl)! - fix lockedKeys in xcstrings

## 0.111.8

### Patch Changes

- [#1174](https://github.com/lingodotdev/lingo.dev/pull/1174) [`64225d0`](https://github.com/lingodotdev/lingo.dev/commit/64225d073999d599ba86f65fee8e08e3e5f2800b) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - locale-codes reexport

## 0.111.7

### Patch Changes

- Updated dependencies [[`6579d70`](https://github.com/lingodotdev/lingo.dev/commit/6579d70bc670c2fdc06c09842d931b07e134151c)]:
  - @lingo.dev/_spec@0.40.2
  - @lingo.dev/_compiler@0.7.9
  - @lingo.dev/_sdk@0.12.2

## 0.111.6

### Patch Changes

- [#1164](https://github.com/lingodotdev/lingo.dev/pull/1164) [`88b7e31`](https://github.com/lingodotdev/lingo.dev/commit/88b7e3132c77d0a1e823de4ee6ef5a96a3098b97) Thanks [@vrcprl](https://github.com/vrcprl)! - upd demo

## 0.111.5

### Patch Changes

- [#1166](https://github.com/lingodotdev/lingo.dev/pull/1166) [`d9294c0`](https://github.com/lingodotdev/lingo.dev/commit/d9294c0bbb993454ad3654f77dd48d82211e0465) Thanks [@vrcprl](https://github.com/vrcprl)! - enhance cli errors debugging

## 0.111.4

### Patch Changes

- [#1157](https://github.com/lingodotdev/lingo.dev/pull/1157) [`100b141`](https://github.com/lingodotdev/lingo.dev/commit/100b141d2143e33b603830475ba55089dc421e3d) Thanks [@ankur0904](https://github.com/ankur0904)! - add --sound flag for task completion

## 0.111.3

### Patch Changes

- [`8741a20`](https://github.com/lingodotdev/lingo.dev/commit/8741a20dcaa3983131a1919f875dd2c264cb29fb) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix observability tracking

## 0.111.2

### Patch Changes

- [#1149](https://github.com/lingodotdev/lingo.dev/pull/1149) [`bd3f69d`](https://github.com/lingodotdev/lingo.dev/commit/bd3f69dde76814146f775bc87241fa2fad012ab0) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Fix CI command hanging due to process.exit calls

  - Remove PostHog shutdown() call that was causing process to hang
  - Replace process.exit() with proper exception throwing in i18n and run commands
  - Upgrade posthog-node from 5.5.1 to 5.8.1 for better stability
  - This fixes the CI command integration where process.exit() was terminating the parent process instead of returning control

## 0.111.1

### Patch Changes

- [#1144](https://github.com/lingodotdev/lingo.dev/pull/1144) [`6c174c3`](https://github.com/lingodotdev/lingo.dev/commit/6c174c38f3cf28c2af24ead18503658c3c641026) Thanks [@mathio](https://github.com/mathio)! - exit cli gracefully

## 0.111.0

### Minor Changes

- [#1134](https://github.com/lingodotdev/lingo.dev/pull/1134) [`3a642f3`](https://github.com/lingodotdev/lingo.dev/commit/3a642f33c04378706a8382aa0fde36e747fd6af5) Thanks [@mathio](https://github.com/mathio)! - useLingoLocale, setLingoLocale

### Patch Changes

- Updated dependencies [[`a35032e`](https://github.com/lingodotdev/lingo.dev/commit/a35032e7e7a188d1f5e774576352068124526e24), [`3a642f3`](https://github.com/lingodotdev/lingo.dev/commit/3a642f33c04378706a8382aa0fde36e747fd6af5)]:
  - @lingo.dev/_spec@0.40.1
  - @lingo.dev/_react@0.5.0
  - @lingo.dev/_compiler@0.7.8
  - @lingo.dev/_sdk@0.12.1

## 0.110.5

### Patch Changes

- [#1130](https://github.com/lingodotdev/lingo.dev/pull/1130) [`bc7b08e`](https://github.com/lingodotdev/lingo.dev/commit/bc7b08ef1245d1af0c68813cb18193d4f14bc7e0) Thanks [@mathio](https://github.com/mathio)! - dictionary path calculation

- Updated dependencies [[`bc7b08e`](https://github.com/lingodotdev/lingo.dev/commit/bc7b08ef1245d1af0c68813cb18193d4f14bc7e0)]:
  - @lingo.dev/_compiler@0.7.7

## 0.110.4

### Patch Changes

- [#1121](https://github.com/lingodotdev/lingo.dev/pull/1121) [`b6071e4`](https://github.com/lingodotdev/lingo.dev/commit/b6071e4f19dd1823f4f2ce54ba5495538a94d4fd) Thanks [@mathio](https://github.com/mathio)! - compiler: prevent duplicate props

- Updated dependencies [[`b6071e4`](https://github.com/lingodotdev/lingo.dev/commit/b6071e4f19dd1823f4f2ce54ba5495538a94d4fd)]:
  - @lingo.dev/_compiler@0.7.6

## 0.110.3

### Patch Changes

- [#1119](https://github.com/lingodotdev/lingo.dev/pull/1119) [`e898c1e`](https://github.com/lingodotdev/lingo.dev/commit/e898c1eeb34e4dd3e74df26465802b520018acf9) Thanks [@mathio](https://github.com/mathio)! - compiler fallback to source locale

- Updated dependencies [[`e898c1e`](https://github.com/lingodotdev/lingo.dev/commit/e898c1eeb34e4dd3e74df26465802b520018acf9)]:
  - @lingo.dev/_react@0.4.3

## 0.110.2

### Patch Changes

- [#1118](https://github.com/lingodotdev/lingo.dev/pull/1118) [`410825c`](https://github.com/lingodotdev/lingo.dev/commit/410825c8bf0029d8ee458514d6f203a7397c8f22) Thanks [@mathio](https://github.com/mathio)! - support Turbopack in Next.js v14 by Compiler

- Updated dependencies [[`410825c`](https://github.com/lingodotdev/lingo.dev/commit/410825c8bf0029d8ee458514d6f203a7397c8f22), [`bc419ae`](https://github.com/lingodotdev/lingo.dev/commit/bc419aeeb4211d80d3c0ddd65deeab62ad68fea8)]:
  - @lingo.dev/_compiler@0.7.5

## 0.110.1

### Patch Changes

- [`555384d`](https://github.com/lingodotdev/lingo.dev/commit/555384dacf79167e1bb8b9e6871e153fea763471) Thanks [@mathio](https://github.com/mathio)! - revert

## 0.110.0

### Minor Changes

- [#1065](https://github.com/lingodotdev/lingo.dev/pull/1065) [`c0486ca`](https://github.com/lingodotdev/lingo.dev/commit/c0486ca9b0451ea75d070e199f502507ba418e5e) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - Add support for `ignoredKeys` in TypeScript loader

  The TypeScript loader now fully supports the `ignoredKeys` option, allowing you to exclude specific keys (including nested keys) from localization when using both `export default` and `export const` patterns. This works seamlessly with the `run` method and the CLI, and is compatible with flattened key structures. All related tests now pass.

## 0.109.2

### Patch Changes

- [#1108](https://github.com/lingodotdev/lingo.dev/pull/1108) [`99aae2d`](https://github.com/lingodotdev/lingo.dev/commit/99aae2d09a26060c810913f740893a4a5874d9d4) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update deprecated 'lingo.dev auth --login' command references to 'lingo.dev login' in CLI error messages

## 0.109.1

### Patch Changes

- Updated dependencies [[`3cb1ebe`](https://github.com/lingodotdev/lingo.dev/commit/3cb1ebec5441882678ab30a7d1b532bc2fc397b6)]:
  - @lingo.dev/_compiler@0.7.4

## 0.109.0

### Minor Changes

- [#1066](https://github.com/lingodotdev/lingo.dev/pull/1066) [`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add hints support for xcode and jsonc buckets

### Patch Changes

- Updated dependencies [[`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e), [`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e)]:
  - @lingo.dev/_spec@0.40.0
  - @lingo.dev/_sdk@0.12.0
  - @lingo.dev/_compiler@0.7.3

## 0.108.0

### Minor Changes

- [#1061](https://github.com/lingodotdev/lingo.dev/pull/1061) [`55e9e68`](https://github.com/lingodotdev/lingo.dev/commit/55e9e687a3d0efa84b808818a848a276b1a42015) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add Discord link to CLI help text

### Patch Changes

- [#1062](https://github.com/lingodotdev/lingo.dev/pull/1062) [`1ff847b`](https://github.com/lingodotdev/lingo.dev/commit/1ff847b9273a3082178553e70c22524f5831ad36) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fixed missing placeholder replacement logic in mdx

- [#1028](https://github.com/lingodotdev/lingo.dev/pull/1028) [`b9e2551`](https://github.com/lingodotdev/lingo.dev/commit/b9e2551f349e33542212f941b3407e8517b5fb27) Thanks [@pushkar1713](https://github.com/pushkar1713)! - Make run cmd in CLI print a list of collected errors

- Updated dependencies [[`85dfc10`](https://github.com/lingodotdev/lingo.dev/commit/85dfc10961b116e31b2bb478f42013756ca49974), [`2d67369`](https://github.com/lingodotdev/lingo.dev/commit/2d673697b9cf4d91de2f48444581f8b3fd894cd6)]:
  - @lingo.dev/_sdk@0.11.0
  - @lingo.dev/_react@0.4.2
  - @lingo.dev/_compiler@0.7.2

## 0.107.6

### Patch Changes

- Updated dependencies [[`f897a7d`](https://github.com/lingodotdev/lingo.dev/commit/f897a7d0a3f7a236fb64f19bce9a8d00626d09ca)]:
  - @lingo.dev/_compiler@0.7.1

## 0.107.5

### Patch Changes

- Updated dependencies [[`bd9538a`](https://github.com/lingodotdev/lingo.dev/commit/bd9538ac6eba0ffc91ffc1fef5db6366c13e9e06)]:
  - @lingo.dev/_compiler@0.7.0

## 0.107.4

### Patch Changes

- [#1038](https://github.com/lingodotdev/lingo.dev/pull/1038) [`20a3737`](https://github.com/lingodotdev/lingo.dev/commit/20a3737ddb50b2a97699e57e03ea353b8912b78f) Thanks [@mathio](https://github.com/mathio)! - json-dictionary with locales on top level

## 0.107.3

### Patch Changes

- [#1031](https://github.com/lingodotdev/lingo.dev/pull/1031) [`afbb978`](https://github.com/lingodotdev/lingo.dev/commit/afbb978fec83d574f2c43b7d68457e435fca9b57) Thanks [@mathio](https://github.com/mathio)! - add json-dictionary loader support

- Updated dependencies [[`afbb978`](https://github.com/lingodotdev/lingo.dev/commit/afbb978fec83d574f2c43b7d68457e435fca9b57)]:
  - @lingo.dev/_spec@0.39.3
  - @lingo.dev/_compiler@0.6.3
  - @lingo.dev/_sdk@0.10.2

## 0.107.2

### Patch Changes

- [#1029](https://github.com/lingodotdev/lingo.dev/pull/1029) [`1f1e33f`](https://github.com/lingodotdev/lingo.dev/commit/1f1e33fe4d0767c2f026214a505a2aa9f3785996) Thanks [@mathio](https://github.com/mathio)! - allow wildcards when matching lockedKeys, ignoredKeys, injectLocale

- [#1023](https://github.com/lingodotdev/lingo.dev/pull/1023) [`9266fd0`](https://github.com/lingodotdev/lingo.dev/commit/9266fd0bcddf4b07ca51d2609af92a9473106f9d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update Zod dependency to version 3.25.76

- Updated dependencies [[`9266fd0`](https://github.com/lingodotdev/lingo.dev/commit/9266fd0bcddf4b07ca51d2609af92a9473106f9d)]:
  - @lingo.dev/_compiler@0.6.2
  - @lingo.dev/_spec@0.39.2
  - @lingo.dev/_sdk@0.10.1

## 0.107.1

### Patch Changes

- [#1021](https://github.com/lingodotdev/lingo.dev/pull/1021) [`6baa1a7`](https://github.com/lingodotdev/lingo.dev/commit/6baa1a7e88dbfac3783d1d49695595077fd8d209) Thanks [@mathio](https://github.com/mathio)! - add lingo.dev provider details

- Updated dependencies [[`6baa1a7`](https://github.com/lingodotdev/lingo.dev/commit/6baa1a7e88dbfac3783d1d49695595077fd8d209)]:
  - @lingo.dev/_compiler@0.6.1

## 0.107.0

### Minor Changes

- [#1019](https://github.com/lingodotdev/lingo.dev/pull/1019) [`925997d`](https://github.com/lingodotdev/lingo.dev/commit/925997d75a1edbb4211a3be8db2b186cb139327e) Thanks [@mathio](https://github.com/mathio)! - injectLocale uses forward slash now

## 0.106.0

### Minor Changes

- [#998](https://github.com/lingodotdev/lingo.dev/pull/998) [`cb2aa0f`](https://github.com/lingodotdev/lingo.dev/commit/cb2aa0f505d6b7dbc435b526e8a6f62265d1f453) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - Added support for AbortController to all public SDK methods, enabling consumers to cancel long-running operations using the standard AbortController API. Refactored internal methods to propagate AbortSignal and check for abortion between batch chunks. Updated fetch calls to use AbortSignal for network request cancellation.

### Patch Changes

- Updated dependencies [[`864c305`](https://github.com/lingodotdev/lingo.dev/commit/864c30586510e6b69739c20fa42efdf45d8881ed), [`cb2aa0f`](https://github.com/lingodotdev/lingo.dev/commit/cb2aa0f505d6b7dbc435b526e8a6f62265d1f453)]:
  - @lingo.dev/_compiler@0.6.0
  - @lingo.dev/_sdk@0.10.0

## 0.105.4

### Patch Changes

- [#1011](https://github.com/lingodotdev/lingo.dev/pull/1011) [`bfcb424`](https://github.com/lingodotdev/lingo.dev/commit/bfcb424eb4479d0d3b767e062d30f02c5bcaeb14) Thanks [@mathio](https://github.com/mathio)! - replace elements with dot in name

- Updated dependencies [[`bfcb424`](https://github.com/lingodotdev/lingo.dev/commit/bfcb424eb4479d0d3b767e062d30f02c5bcaeb14)]:
  - @lingo.dev/_compiler@0.5.5
  - @lingo.dev/_react@0.4.1

## 0.105.3

### Patch Changes

- [#1002](https://github.com/lingodotdev/lingo.dev/pull/1002) [`2b297ba`](https://github.com/lingodotdev/lingo.dev/commit/2b297babe76f9799c5154d9421fecd1ebbe1bb72) Thanks [@mathio](https://github.com/mathio)! - support custom prompts in compiler

- Updated dependencies [[`2b297ba`](https://github.com/lingodotdev/lingo.dev/commit/2b297babe76f9799c5154d9421fecd1ebbe1bb72)]:
  - @lingo.dev/_compiler@0.5.4

## 0.105.2

### Patch Changes

- [#1000](https://github.com/lingodotdev/lingo.dev/pull/1000) [`30faa6d`](https://github.com/lingodotdev/lingo.dev/commit/30faa6d10e851a38ced86ae403b3a1fd48440bca) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - xliff 1.2 implementation

## 0.105.1

### Patch Changes

- Updated dependencies [[`acd5356`](https://github.com/lingodotdev/lingo.dev/commit/acd5356b68d2261576240c173fea790864c3c31d)]:
  - @lingo.dev/_spec@0.39.1
  - @lingo.dev/_sdk@0.9.6
  - @lingo.dev/_compiler@0.5.3

## 0.105.0

### Minor Changes

- [#992](https://github.com/lingodotdev/lingo.dev/pull/992) [`4e9e368`](https://github.com/lingodotdev/lingo.dev/commit/4e9e36830ee4277ef9d65eee9ee92380a95a622c) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - feat: skip lockfile updates when --target-locale or --locale flags are provided explicitly

## 0.104.0

### Minor Changes

- [#986](https://github.com/lingodotdev/lingo.dev/pull/986) [`65701e5`](https://github.com/lingodotdev/lingo.dev/commit/65701e5b9694e811587ef600227251a1ff1384a0) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add glob pattern matching support to --file argument using minimatch library

### Patch Changes

- [#988](https://github.com/lingodotdev/lingo.dev/pull/988) [`4e55355`](https://github.com/lingodotdev/lingo.dev/commit/4e5535535029743b7a0edc4fdab3d4ee71374035) Thanks [@mathio](https://github.com/mathio)! - o11y

## 0.103.0

### Minor Changes

- [#981](https://github.com/lingodotdev/lingo.dev/pull/981) [`f644123`](https://github.com/lingodotdev/lingo.dev/commit/f644123ddf6a6254790d08af50141e4dd78c3677) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add support for plain TXT files to enable translation of fastlane App Store metadata and other plain text content

### Patch Changes

- Updated dependencies [[`f644123`](https://github.com/lingodotdev/lingo.dev/commit/f644123ddf6a6254790d08af50141e4dd78c3677)]:
  - @lingo.dev/_spec@0.39.0
  - @lingo.dev/_sdk@0.9.5
  - @lingo.dev/_compiler@0.5.2

## 0.102.4

### Patch Changes

- [#982](https://github.com/lingodotdev/lingo.dev/pull/982) [`29cf6a7`](https://github.com/lingodotdev/lingo.dev/commit/29cf6a7359707e0e341c11942d1ce6dedf7e66e5) Thanks [@mathio](https://github.com/mathio)! - fix xcstrings version

## 0.102.3

### Patch Changes

- [#972](https://github.com/lingodotdev/lingo.dev/pull/972) [`b249484`](https://github.com/lingodotdev/lingo.dev/commit/b249484d6f0060e29cd5b50b3d8ce68b857ccad5) Thanks [@mathio](https://github.com/mathio)! - support components with dot in name

- Updated dependencies [[`b249484`](https://github.com/lingodotdev/lingo.dev/commit/b249484d6f0060e29cd5b50b3d8ce68b857ccad5)]:
  - @lingo.dev/_compiler@0.5.1

## 0.102.2

### Patch Changes

- [#946](https://github.com/lingodotdev/lingo.dev/pull/946) [`f7debef`](https://github.com/lingodotdev/lingo.dev/commit/f7debef9f004e670bb1f6a45ae17067a72a6e53f) Thanks [@scm1400](https://github.com/scm1400)! - normalize paths and improve compatibility on windows

## 0.102.1

### Patch Changes

- [#969](https://github.com/lingodotdev/lingo.dev/pull/969) [`da6f0c8`](https://github.com/lingodotdev/lingo.dev/commit/da6f0c85e69687615df943323d261078742ba3f2) Thanks [@mathio](https://github.com/mathio)! - run: always push to target locales

## 0.102.0

### Minor Changes

- [#966](https://github.com/lingodotdev/lingo.dev/pull/966) [`8b306bc`](https://github.com/lingodotdev/lingo.dev/commit/8b306bcd0a3231ffd8bde283414b6d069b7a5b99) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - Add watch mode to CLI for automatic retranslation on file changes

  This release introduces a new watch mode feature that automatically triggers retranslation when changes are detected in source files:

  - **New `--watch` flag**: Enables file watching mode that monitors source files for changes
  - **New `--debounce` flag**: Configurable debounce delay (default: 5 seconds) to prevent excessive retranslations
  - **Intelligent file pattern detection**: Automatically determines which files to watch based on i18n.json bucket configurations
  - **Graceful error handling**: Robust error recovery and process management
  - **Background operation**: Non-blocking watch mode with proper cleanup on exit (Ctrl+C)

  **Usage:**

  ```bash
  # Enable watch mode with default 5-second debounce
  lingo.dev run --watch

  # Enable watch mode with custom debounce timing
  lingo.dev run --watch --debounce 7000

  # Combine with other flags
  lingo.dev run --watch --target-locale es --bucket json
  ```

  **Technical Implementation:**

  - Uses `chokidar` for robust cross-platform file watching
  - Integrates seamlessly with existing CLI pipeline (setup → plan → execute)
  - Maintains full compatibility with all existing CLI options and workflows
  - Includes comprehensive documentation in `WATCH_MODE.md`

  This feature significantly improves developer experience by eliminating the need to manually retrigger translations during development.

### Patch Changes

- [#968](https://github.com/lingodotdev/lingo.dev/pull/968) [`013fca0`](https://github.com/lingodotdev/lingo.dev/commit/013fca0f4252103ee3009fe3cdcfce2a87c80058) Thanks [@mathio](https://github.com/mathio)! - reorder falsy keys

## 0.101.0

### Minor Changes

- [#958](https://github.com/lingodotdev/lingo.dev/pull/958) [`84fd214`](https://github.com/lingodotdev/lingo.dev/commit/84fd214a21766e7683c5d645fcb8c4c0162eb0b6) Thanks [@chrissiwaffler](https://github.com/chrissiwaffler)! - feat: add Mistral AI as a supported LLM provider

  - Added Mistral AI provider support across the entire lingo.dev ecosystem
  - Users can now use Mistral models for localization by setting MISTRAL_API_KEY
  - Supports all Mistral models available through the @ai-sdk/mistral package
  - Configuration via environment variable or user-wide config: `npx lingo.dev@latest config set llm.mistralApiKey <key>`

### Patch Changes

- [#962](https://github.com/lingodotdev/lingo.dev/pull/962) [`0fc6385`](https://github.com/lingodotdev/lingo.dev/commit/0fc63856c6f49ac68a220b6e2f1c4f060e7ce78e) Thanks [@mathio](https://github.com/mathio)! - format with prettier, add prettier check for PRs

- [#955](https://github.com/lingodotdev/lingo.dev/pull/955) [`cac5429`](https://github.com/lingodotdev/lingo.dev/commit/cac54296d512d436dc3861441d5d1a3f1076792b) Thanks [@mathio](https://github.com/mathio)! - progressive push as chunks are processed

- Updated dependencies [[`84fd214`](https://github.com/lingodotdev/lingo.dev/commit/84fd214a21766e7683c5d645fcb8c4c0162eb0b6)]:
  - @lingo.dev/_compiler@0.5.0
  - @lingo.dev/_spec@0.38.0
  - @lingo.dev/_sdk@0.9.4

## 0.100.1

### Patch Changes

- [#960](https://github.com/lingodotdev/lingo.dev/pull/960) [`ce0e5cd`](https://github.com/lingodotdev/lingo.dev/commit/ce0e5cd6d1ec17f5c593d394ceb63a28666df924) Thanks [@mathio](https://github.com/mathio)! - fix compiler dictionary

## 0.100.0

### Minor Changes

- [#956](https://github.com/lingodotdev/lingo.dev/pull/956) [`ce8c75c`](https://github.com/lingodotdev/lingo.dev/commit/ce8c75c7fc1a2124d3e18444bc356c4dfce26434) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - feat: add EJS (Embedded JavaScript) templating engine support

  - Added EJS loader to support parsing and translating EJS template files
  - EJS loader extracts translatable text while preserving EJS tags and expressions
  - Updated spec package to include "ejs" in supported bucket types
  - Added comprehensive test suite covering various EJS scenarios including conditionals, loops, includes, and mixed content
  - Automatically installed EJS dependency (@types/ejs) for TypeScript support

### Patch Changes

- Updated dependencies [[`ce8c75c`](https://github.com/lingodotdev/lingo.dev/commit/ce8c75c7fc1a2124d3e18444bc356c4dfce26434)]:
  - @lingo.dev/_spec@0.37.0
  - @lingo.dev/_sdk@0.9.3
  - @lingo.dev/_compiler@0.4.1

## 0.99.8

### Patch Changes

- Updated dependencies [[`1bba8ee`](https://github.com/lingodotdev/lingo.dev/commit/1bba8eed6272ae166ceb9b92963404bfe90a4aaa)]:
  - @lingo.dev/_compiler@0.4.0

## 0.99.7

### Patch Changes

- [#947](https://github.com/lingodotdev/lingo.dev/pull/947) [`d80285a`](https://github.com/lingodotdev/lingo.dev/commit/d80285a9b12bd85425564cb00e558812fd0aee40) Thanks [@mathio](https://github.com/mathio)! - remove local variable cache

- Updated dependencies [[`d80285a`](https://github.com/lingodotdev/lingo.dev/commit/d80285a9b12bd85425564cb00e558812fd0aee40)]:
  - @lingo.dev/_compiler@0.3.5

## 0.99.6

### Patch Changes

- [`81eff21`](https://github.com/lingodotdev/lingo.dev/commit/81eff2104a4401b1c1b6cdf4dcc7ca75b7411ba4) Thanks [@mathio](https://github.com/mathio)! - fix

## 0.99.5

### Patch Changes

- [#948](https://github.com/lingodotdev/lingo.dev/pull/948) [`b39b04a`](https://github.com/lingodotdev/lingo.dev/commit/b39b04ad83d3c8001008c3cefe309d8e762b2adc) Thanks [@mathio](https://github.com/mathio)! - match --keys via minimatch in run

- [#937](https://github.com/lingodotdev/lingo.dev/pull/937) [`4e5983d`](https://github.com/lingodotdev/lingo.dev/commit/4e5983d7e59ebf9eb529c4b7c1c87689432ac873) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update documentation URLs from docs.lingo.dev to lingo.dev/cli and lingo.dev/compiler

- Updated dependencies [[`4e5983d`](https://github.com/lingodotdev/lingo.dev/commit/4e5983d7e59ebf9eb529c4b7c1c87689432ac873)]:
  - @lingo.dev/_compiler@0.3.4
  - @lingo.dev/_sdk@0.9.2

## 0.99.4

### Patch Changes

- [#933](https://github.com/lingodotdev/lingo.dev/pull/933) [`1a3cbc1`](https://github.com/lingodotdev/lingo.dev/commit/1a3cbc1751c64e5617e91812506b3c061475f16a) Thanks [@caffeinated10xprogrammer](https://github.com/caffeinated10xprogrammer)! - fix a bug in cli status command when delimiter is used

## 0.99.3

### Patch Changes

- Updated dependencies [[`76cbd9b`](https://github.com/lingodotdev/lingo.dev/commit/76cbd9b2f2e1217421ad1f671bed5b3d64b43333)]:
  - @lingo.dev/_compiler@0.3.3

## 0.99.2

### Patch Changes

- Updated dependencies [[`01f253d`](https://github.com/lingodotdev/lingo.dev/commit/01f253dd9759b518f400dff03ab51b460b9b8997)]:
  - @lingo.dev/_compiler@0.3.2

## 0.99.1

### Patch Changes

- Updated dependencies [[`8e97256`](https://github.com/lingodotdev/lingo.dev/commit/8e97256ca4e78dd09a967539ca9dec359bd558ef)]:
  - @lingo.dev/_compiler@0.3.1

## 0.99.0

### Minor Changes

- [#913](https://github.com/lingodotdev/lingo.dev/pull/913) [`1b9b113`](https://github.com/lingodotdev/lingo.dev/commit/1b9b11301978e8caa2555832d027ff93216aa6e1) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Add support for Ollama as a CLI and Compiler provider.

### Patch Changes

- [#922](https://github.com/lingodotdev/lingo.dev/pull/922) [`0329a9c`](https://github.com/lingodotdev/lingo.dev/commit/0329a9cdb5e5a63fcecab4efcd7cce22f155a0e9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add openrouter ais support for compiler

- Updated dependencies [[`215af19`](https://github.com/lingodotdev/lingo.dev/commit/215af1944667cce66e9c5966f4fb627186687b74), [`1b9b113`](https://github.com/lingodotdev/lingo.dev/commit/1b9b11301978e8caa2555832d027ff93216aa6e1), [`95c23cc`](https://github.com/lingodotdev/lingo.dev/commit/95c23ccbafd335939832dbdd0f995ebcb23082fd), [`0329a9c`](https://github.com/lingodotdev/lingo.dev/commit/0329a9cdb5e5a63fcecab4efcd7cce22f155a0e9)]:
  - @lingo.dev/_compiler@0.3.0
  - @lingo.dev/_spec@0.36.0
  - @lingo.dev/_react@0.4.0
  - @lingo.dev/_sdk@0.9.1

## 0.98.0

### Minor Changes

- [#915](https://github.com/lingodotdev/lingo.dev/pull/915) [`6b4b9e6`](https://github.com/lingodotdev/lingo.dev/commit/6b4b9e6cc9a0cb5da8a4df9e9ebda474bf2a18ed) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - feat: enhance 5xx error handling with Cloudflare status integration

- [#915](https://github.com/lingodotdev/lingo.dev/pull/915) [`6b4b9e6`](https://github.com/lingodotdev/lingo.dev/commit/6b4b9e6cc9a0cb5da8a4df9e9ebda474bf2a18ed) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - feat: enhance 5xx error handling with Cloudflare status integration

### Patch Changes

- [#919](https://github.com/lingodotdev/lingo.dev/pull/919) [`3b6574f`](https://github.com/lingodotdev/lingo.dev/commit/3b6574f0499f3f4d3c48f66ba2b828d2c1c0ceb0) Thanks [@mathio](https://github.com/mathio)! - update package import names

- Updated dependencies [[`3b6574f`](https://github.com/lingodotdev/lingo.dev/commit/3b6574f0499f3f4d3c48f66ba2b828d2c1c0ceb0), [`6b4b9e6`](https://github.com/lingodotdev/lingo.dev/commit/6b4b9e6cc9a0cb5da8a4df9e9ebda474bf2a18ed), [`6b4b9e6`](https://github.com/lingodotdev/lingo.dev/commit/6b4b9e6cc9a0cb5da8a4df9e9ebda474bf2a18ed)]:
  - @lingo.dev/_compiler@0.2.4
  - @lingo.dev/_sdk@0.9.0

## 0.97.5

### Patch Changes

- Updated dependencies [[`d7e74c6`](https://github.com/lingodotdev/lingo.dev/commit/d7e74c6cc724da8ae759ba8d8fdb1a64867d505c)]:
  - @lingo.dev/_compiler@0.2.3

## 0.97.4

### Patch Changes

- [`2dd8170`](https://github.com/lingodotdev/lingo.dev/commit/2dd8170ff0101268f2253c9248409d184da5f75c) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - relative paths + new locales

## 0.97.3

### Patch Changes

- Updated dependencies [[`1a235a1`](https://github.com/lingodotdev/lingo.dev/commit/1a235a17455fb2631f7426283aa8431209999758)]:
  - @lingo.dev/_compiler@0.2.2

## 0.97.2

### Patch Changes

- [#903](https://github.com/lingodotdev/lingo.dev/pull/903) [`cc232eb`](https://github.com/lingodotdev/lingo.dev/commit/cc232eb72d0e54b3571bbb70e88cdad24ba6372a) Thanks [@mathio](https://github.com/mathio)! - vtt parsing

## 0.97.1

### Patch Changes

- [#900](https://github.com/lingodotdev/lingo.dev/pull/900) [`fead8e0`](https://github.com/lingodotdev/lingo.dev/commit/fead8e08dc2b2869a093cb25a04f6e0aa78cf6b7) Thanks [@mathio](https://github.com/mathio)! - load API key from env var and env files

- Updated dependencies [[`fead8e0`](https://github.com/lingodotdev/lingo.dev/commit/fead8e08dc2b2869a093cb25a04f6e0aa78cf6b7)]:
  - @lingo.dev/_compiler@0.2.1

## 0.97.0

### Minor Changes

- [#897](https://github.com/lingodotdev/lingo.dev/pull/897) [`a5da697`](https://github.com/lingodotdev/lingo.dev/commit/a5da697f7efd46de31d17b202d06eb5f655ed9b9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add support for other providers in the compiler and implement Google AI as a provider.

### Patch Changes

- [#899](https://github.com/lingodotdev/lingo.dev/pull/899) [`10a0139`](https://github.com/lingodotdev/lingo.dev/commit/10a0139edc9ffbc1c52ac2226f6b0f345cc19878) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add support for --key to `lingo.dev run`

- Updated dependencies [[`a5da697`](https://github.com/lingodotdev/lingo.dev/commit/a5da697f7efd46de31d17b202d06eb5f655ed9b9)]:
  - @lingo.dev/_compiler@0.2.0
  - @lingo.dev/_react@0.3.0
  - @lingo.dev/_spec@0.35.0
  - @lingo.dev/_sdk@0.8.1

## 0.96.0

### Minor Changes

- [#895](https://github.com/lingodotdev/lingo.dev/pull/895) [`3bd4045`](https://github.com/lingodotdev/lingo.dev/commit/3bd40450cbb5c8aabce61d7f1f3ab9c7293323d9) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add PostHog tracking to run command

## 0.95.0

### Minor Changes

- [#874](https://github.com/lingodotdev/lingo.dev/pull/874) [`f140f82`](https://github.com/lingodotdev/lingo.dev/commit/f140f820d00b15f99214a7eece1a9c7f0d098e90) Thanks [@NamesMT](https://github.com/NamesMT)! - Reduce duplicated parsing and more dynamic key column naming support

## 0.94.6

### Patch Changes

- [#890](https://github.com/lingodotdev/lingo.dev/pull/890) [`145fb74`](https://github.com/lingodotdev/lingo.dev/commit/145fb74c09b42c8810f351be5a641b1366881ae1) Thanks [@mathio](https://github.com/mathio)! - do not parse LingoProvider component

- [#889](https://github.com/lingodotdev/lingo.dev/pull/889) [`0c45acc`](https://github.com/lingodotdev/lingo.dev/commit/0c45accfc45e63f597758c47033bc58d2f6059b5) Thanks [@mathio](https://github.com/mathio)! - update Groq API error handling

- Updated dependencies [[`145fb74`](https://github.com/lingodotdev/lingo.dev/commit/145fb74c09b42c8810f351be5a641b1366881ae1), [`0c45acc`](https://github.com/lingodotdev/lingo.dev/commit/0c45accfc45e63f597758c47033bc58d2f6059b5)]:
  - @lingo.dev/_compiler@0.1.13

## 0.94.5

### Patch Changes

- [#887](https://github.com/lingodotdev/lingo.dev/pull/887) [`511a2ec`](https://github.com/lingodotdev/lingo.dev/commit/511a2ecd68a9c5e2800035d5c6a6b5b31b2dc80f) Thanks [@mathio](https://github.com/mathio)! - handle when lingo dir is deleted

- Updated dependencies [[`511a2ec`](https://github.com/lingodotdev/lingo.dev/commit/511a2ecd68a9c5e2800035d5c6a6b5b31b2dc80f)]:
  - @lingo.dev/_compiler@0.1.12
  - @lingo.dev/_react@0.2.4

## 0.94.4

### Patch Changes

- [#883](https://github.com/lingodotdev/lingo.dev/pull/883) [`7191444`](https://github.com/lingodotdev/lingo.dev/commit/7191444f67864ea5b5a91a9be759b2445bf186d3) Thanks [@mathio](https://github.com/mathio)! - client-side loading state

- Updated dependencies [[`7191444`](https://github.com/lingodotdev/lingo.dev/commit/7191444f67864ea5b5a91a9be759b2445bf186d3)]:
  - @lingo.dev/_react@0.2.3
  - @lingo.dev/_compiler@0.1.11

## 0.94.3

### Patch Changes

- Updated dependencies [[`152e96a`](https://github.com/lingodotdev/lingo.dev/commit/152e96a46b98dd25d558ff0e7e20b18b954d375a)]:
  - @lingo.dev/_compiler@0.1.10

## 0.94.2

### Patch Changes

- [#872](https://github.com/lingodotdev/lingo.dev/pull/872) [`af011b1`](https://github.com/lingodotdev/lingo.dev/commit/af011b18fe96f15287609278f4d4d2b343b6c2cc) Thanks [@NamesMT](https://github.com/NamesMT)! - Allows user to type even less and benefit from lingo.dev <3

## 0.94.1

### Patch Changes

- Updated dependencies [[`a7bf553`](https://github.com/lingodotdev/lingo.dev/commit/a7bf5538b5b72e41f90371f6211378aac7d5f800), [`562e667`](https://github.com/lingodotdev/lingo.dev/commit/562e667471abb51d7dd193217eefb8e8b3f8a686)]:
  - @lingo.dev/_react@0.2.2

## 0.94.0

### Minor Changes

- [#864](https://github.com/lingodotdev/lingo.dev/pull/864) [`3750c9c`](https://github.com/lingodotdev/lingo.dev/commit/3750c9ca25a78280b04e4a2b2e6641dd21f9f3b0) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - feat(cli): add `login` and `logout` commands to replace `auth --login` and `auth --logout`

### Patch Changes

- Updated dependencies [[`77461a7`](https://github.com/lingodotdev/lingo.dev/commit/77461a7872eec3ea188b3ca6c6f7ce1fd13fdfbb)]:
  - @lingo.dev/_compiler@0.1.9

## 0.93.13

### Patch Changes

- Updated dependencies [[`1bccb7e`](https://github.com/lingodotdev/lingo.dev/commit/1bccb7ed51ac1f13ea79e618bbee551d5529efdc)]:
  - @lingo.dev/_compiler@0.1.8

## 0.93.12

### Patch Changes

- Updated dependencies [[`5b68641`](https://github.com/lingodotdev/lingo.dev/commit/5b686414f363f8ee4b79fd4e804a434db5cfcb36)]:
  - @lingo.dev/_compiler@0.1.7

## 0.93.11

### Patch Changes

- Updated dependencies [[`1f9db11`](https://github.com/lingodotdev/lingo.dev/commit/1f9db11a53d8c75ce0e83517b73d43544d0f0fd2)]:
  - @lingo.dev/_react@0.2.1

## 0.93.10

### Patch Changes

- Updated dependencies [[`7a5898b`](https://github.com/lingodotdev/lingo.dev/commit/7a5898b12dcd0015a5e57236bf65172cedb8a6ee)]:
  - @lingo.dev/_compiler@0.1.6

## 0.93.9

### Patch Changes

- Updated dependencies [[`7013b53`](https://github.com/lingodotdev/lingo.dev/commit/7013b5300d6c2c26f39da62b5ad2c7cf11158c74)]:
  - @lingo.dev/_compiler@0.1.5

## 0.93.8

### Patch Changes

- [#853](https://github.com/lingodotdev/lingo.dev/pull/853) [`cb7d5e2`](https://github.com/lingodotdev/lingo.dev/commit/cb7d5e213282c00af658159472183a763f84ca3d) Thanks [@vrcprl](https://github.com/vrcprl)! - Fix groq api key retrieval from .env

- Updated dependencies [[`cb7d5e2`](https://github.com/lingodotdev/lingo.dev/commit/cb7d5e213282c00af658159472183a763f84ca3d)]:
  - @lingo.dev/_compiler@0.1.4

## 0.93.7

### Patch Changes

- [`5d27455`](https://github.com/lingodotdev/lingo.dev/commit/5d2745545044cbaddb099f7920c96fe198879ba3) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add boolean parsing

## 0.93.6

### Patch Changes

- [#843](https://github.com/lingodotdev/lingo.dev/pull/843) [`b67a331`](https://github.com/lingodotdev/lingo.dev/commit/b67a33141253fa755b5531e52cd690bf5824d4b6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - explicit source / targets in run cmd, parallel mode for ci/cd

## 0.93.5

### Patch Changes

- Updated dependencies [[`e75e615`](https://github.com/lingodotdev/lingo.dev/commit/e75e615ab17e279deb5a505dbda682fdfc7ead62)]:
  - @lingo.dev/_react@0.2.0

## 0.93.4

### Patch Changes

- [`f42cff8`](https://github.com/lingodotdev/lingo.dev/commit/f42cff8355b1ff7bba1445bd04d11ee4672903c2) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - flat reexports

- Updated dependencies [[`f42cff8`](https://github.com/lingodotdev/lingo.dev/commit/f42cff8355b1ff7bba1445bd04d11ee4672903c2)]:
  - @lingo.dev/_compiler@0.1.3

## 0.93.3

### Patch Changes

- [`920e3f5`](https://github.com/lingodotdev/lingo.dev/commit/920e3f5c3ca1fd51b0919db13a4787cfd616de54) Thanks [@mathio](https://github.com/mathio)! - remove cloneDeep for optimization

- Updated dependencies [[`920e3f5`](https://github.com/lingodotdev/lingo.dev/commit/920e3f5c3ca1fd51b0919db13a4787cfd616de54)]:
  - @lingo.dev/_compiler@0.1.2

## 0.93.2

### Patch Changes

- [`cdb59dd`](https://github.com/lingodotdev/lingo.dev/commit/cdb59dddcd14da1ba3181a33c4c119af877cb4f3) Thanks [@mathio](https://github.com/mathio)! - update deps

## 0.93.1

### Patch Changes

- [`caef325`](https://github.com/lingodotdev/lingo.dev/commit/caef3253bc99fa7bf7a0b40e5604c3590dcb4958) Thanks [@mathio](https://github.com/mathio)! - release fix

- Updated dependencies [[`caef325`](https://github.com/lingodotdev/lingo.dev/commit/caef3253bc99fa7bf7a0b40e5604c3590dcb4958)]:
  - @lingo.dev/_compiler@0.1.1
  - @lingo.dev/_react@0.1.1

## 0.93.0

### Minor Changes

- [`e980e84`](https://github.com/lingodotdev/lingo.dev/commit/e980e84178439ad70417d38b425acf9148cfc4b6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added the compiler

### Patch Changes

- Updated dependencies [[`e980e84`](https://github.com/lingodotdev/lingo.dev/commit/e980e84178439ad70417d38b425acf9148cfc4b6)]:
  - @lingo.dev/_compiler@0.1.0
  - @lingo.dev/_react@0.1.0
  - @lingo.dev/_sdk@0.8.0
  - @lingo.dev/_spec@0.34.0

## 0.92.19

### Patch Changes

- [#828](https://github.com/lingodotdev/lingo.dev/pull/828) [`4e9734c`](https://github.com/lingodotdev/lingo.dev/commit/4e9734ce32749caa95703d2b96ba8af6cc83ef94) Thanks [@mathio](https://github.com/mathio)! - preserve order of comments in po files

## 0.92.18

### Patch Changes

- [#824](https://github.com/lingodotdev/lingo.dev/pull/824) [`69d9568`](https://github.com/lingodotdev/lingo.dev/commit/69d9568e85f4f56de3b300b4dd5973bd9c410b99) Thanks [@mathio](https://github.com/mathio)! - skip obsolete entries in po files

## 0.92.17

### Patch Changes

- [#816](https://github.com/lingodotdev/lingo.dev/pull/816) [`28a19e6`](https://github.com/lingodotdev/lingo.dev/commit/28a19e686bc13788b10fd7d9fa6769a34f86d523) Thanks [@vrcprl](https://github.com/vrcprl)! - add config get/set/unset commands

## 0.92.16

### Patch Changes

- [#806](https://github.com/lingodotdev/lingo.dev/pull/806) [`a146328`](https://github.com/lingodotdev/lingo.dev/commit/a1463289697a83ce704cff793c8840db6fa47619) Thanks [@vrcprl](https://github.com/vrcprl)! - fix variables order in po / xcode-xcstrings

- Updated dependencies [[`0272fbf`](https://github.com/lingodotdev/lingo.dev/commit/0272fbf8847240ed9453130237d5843b918f869f)]:
  - @lingo.dev/_spec@0.33.3
  - @lingo.dev/_sdk@0.7.43

## 0.92.15

### Patch Changes

- [#798](https://github.com/lingodotdev/lingo.dev/pull/798) [`48e4f00`](https://github.com/lingodotdev/lingo.dev/commit/48e4f0052b85f0d3575e83390ef82647036c1aec) Thanks [@pushkar1713](https://github.com/pushkar1713)! - added jsonrepair and trimming in explicit.ts so there should be no error now incase LLM's provide a malformed response.

- [#803](https://github.com/lingodotdev/lingo.dev/pull/803) [`f5657a9`](https://github.com/lingodotdev/lingo.dev/commit/f5657a9fae0924c7f34165bcfaa609d8740557d7) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fixed results counting logic in the summary step

## 0.92.14

### Patch Changes

- [#801](https://github.com/lingodotdev/lingo.dev/pull/801) [`3764be3`](https://github.com/lingodotdev/lingo.dev/commit/3764be3b23ee8af474ebc4751e137102af315e5e) Thanks [@vrcprl](https://github.com/vrcprl)! - add chunking to cli with byok model

## 0.92.13

### Patch Changes

- [#799](https://github.com/lingodotdev/lingo.dev/pull/799) [`6edc1d6`](https://github.com/lingodotdev/lingo.dev/commit/6edc1d6a10f8917a1f9e5a7c43a24acb4ab50116) Thanks [@vrcprl](https://github.com/vrcprl)! - fix numeric keys during key renaming step

## 0.92.12

### Patch Changes

- [#792](https://github.com/lingodotdev/lingo.dev/pull/792) [`2bce8de`](https://github.com/lingodotdev/lingo.dev/commit/2bce8deabd06b413b8f284ca102fd0669aa8aaf3) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix variables ordering mismatch

## 0.92.11

### Patch Changes

- [#787](https://github.com/lingodotdev/lingo.dev/pull/787) [`3c27920`](https://github.com/lingodotdev/lingo.dev/commit/3c27920843b37adc71f08a49aa6c0d482decea86) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix byok params

## 0.92.10

### Patch Changes

- [#785](https://github.com/lingodotdev/lingo.dev/pull/785) [`af1315a`](https://github.com/lingodotdev/lingo.dev/commit/af1315a3fd1f3247dd56f7a8d5d7101debd43a98) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - race condition in lingo.dev run

## 0.92.9

### Patch Changes

- [#782](https://github.com/lingodotdev/lingo.dev/pull/782) [`d913c20`](https://github.com/lingodotdev/lingo.dev/commit/d913c20fdf0086741c8b50fd4ddfb38eae304a24) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - parallel processing

- Updated dependencies [[`d913c20`](https://github.com/lingodotdev/lingo.dev/commit/d913c20fdf0086741c8b50fd4ddfb38eae304a24)]:
  - @lingo.dev/_spec@0.33.2
  - @lingo.dev/_sdk@0.7.42

## 0.92.8

### Patch Changes

- [#778](https://github.com/lingodotdev/lingo.dev/pull/778) [`3f2aba9`](https://github.com/lingodotdev/lingo.dev/commit/3f2aba9c1d5834faf89a26194f1f3d9f9b878d40) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add ignoredKeys

- Updated dependencies [[`3f2aba9`](https://github.com/lingodotdev/lingo.dev/commit/3f2aba9c1d5834faf89a26194f1f3d9f9b878d40)]:
  - @lingo.dev/_spec@0.33.1
  - @lingo.dev/_sdk@0.7.41

## 0.92.7

### Patch Changes

- [#772](https://github.com/lingodotdev/lingo.dev/pull/772) [`f859352`](https://github.com/lingodotdev/lingo.dev/commit/f859352a8d573bb0cff7a79790e5bb94ee8d16a3) Thanks [@vrcprl](https://github.com/vrcprl)! - fix error tracking

## 0.92.6

### Patch Changes

- [#775](https://github.com/lingodotdev/lingo.dev/pull/775) [`f2e416a`](https://github.com/lingodotdev/lingo.dev/commit/f2e416a02456f7e35dfa81822d319911202e6b43) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - template strings support for ts loader

## 0.92.5

### Patch Changes

- [#770](https://github.com/lingodotdev/lingo.dev/pull/770) [`d25eb8c`](https://github.com/lingodotdev/lingo.dev/commit/d25eb8cb6be5e3b24a4940651776f23bdc84ed56) Thanks [@vrcprl](https://github.com/vrcprl)! - upd package

## 0.92.4

### Patch Changes

- [#766](https://github.com/lingodotdev/lingo.dev/pull/766) [`bfc2b7e`](https://github.com/lingodotdev/lingo.dev/commit/bfc2b7e395ddfe01a31dfa193e94726c1d682826) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Skip lingo.dev authentication when in "Bring Your Own Key" mode

- [#768](https://github.com/lingodotdev/lingo.dev/pull/768) [`fcdf04e`](https://github.com/lingodotdev/lingo.dev/commit/fcdf04eb111c06ad24bcb1a22e66db442b6a2bc7) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix nested typescript support

## 0.92.3

### Patch Changes

- [#764](https://github.com/lingodotdev/lingo.dev/pull/764) [`a45a11a`](https://github.com/lingodotdev/lingo.dev/commit/a45a11a7323baa6a5f119b9b0913da7a910a324b) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix babel imports in ts loader

## 0.92.2

### Patch Changes

- [`8539842`](https://github.com/lingodotdev/lingo.dev/commit/8539842f878a29572c6ed8b6d077e51a247b28d0) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix missing deps

## 0.92.1

### Patch Changes

- [`2977542`](https://github.com/lingodotdev/lingo.dev/commit/29775423c728c7b0146c0c62f167806d85f2d5c6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix babel traverse import

## 0.92.0

### Minor Changes

- [#759](https://github.com/lingodotdev/lingo.dev/pull/759) [`9aa7004`](https://github.com/lingodotdev/lingo.dev/commit/9aa700491446865dc131b80419f681132b888652) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Enhance TypeScript loader to support nested fields and arrays

### Patch Changes

- Updated dependencies [[`9aa7004`](https://github.com/lingodotdev/lingo.dev/commit/9aa700491446865dc131b80419f681132b888652)]:
  - @lingo.dev/_spec@0.33.0
  - @lingo.dev/_sdk@0.7.40

## 0.91.0

### Minor Changes

- [#757](https://github.com/lingodotdev/lingo.dev/pull/757) [`5170449`](https://github.com/lingodotdev/lingo.dev/commit/517044905dfc682d6a5fa95b0605b8715e2b72c7) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add TypeScript loader for .ts files that extracts string literals from default exports

### Patch Changes

- Updated dependencies [[`5170449`](https://github.com/lingodotdev/lingo.dev/commit/517044905dfc682d6a5fa95b0605b8715e2b72c7)]:
  - @lingo.dev/_spec@0.32.0
  - @lingo.dev/_sdk@0.7.39

## 0.90.4

### Patch Changes

- [#755](https://github.com/lingodotdev/lingo.dev/pull/755) [`3ad5974`](https://github.com/lingodotdev/lingo.dev/commit/3ad597416b2b39daf53abce2a3d6d255e07b4a2e) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Fix extra escaping issue in Android loader for Dutch strings

## 0.90.3

### Patch Changes

- [`fa87f8b`](https://github.com/lingodotdev/lingo.dev/commit/fa87f8b959305b080c964634cb94d81fea1c8caf) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix android single quotes + add tests

- [`3e6c0d6`](https://github.com/lingodotdev/lingo.dev/commit/3e6c0d68b440604100936130bea5e47098418040) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix boolean flags in ci cmd

## 0.90.2

### Patch Changes

- [`8443a9e`](https://github.com/lingodotdev/lingo.dev/commit/8443a9e83bbbb33f20eff1b3bf5f107e5bd18b7d) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - easter egg ;)

## 0.90.1

### Patch Changes

- [#739](https://github.com/lingodotdev/lingo.dev/pull/739) [`bee8861`](https://github.com/lingodotdev/lingo.dev/commit/bee8861f4725344f8157f264d3c5a80870ec9ba2) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add hidden "may-the-fourth" command for Star Wars Day easter egg

## 0.90.0

### Minor Changes

- [#708](https://github.com/lingodotdev/lingo.dev/pull/708) [`ab585d5`](https://github.com/lingodotdev/lingo.dev/commit/ab585d5331c668f88c95cf192e3877368213257e) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add comprehensive Android loader implementation with support for various edge cases including HTML markup, CDATA sections, format strings, and special character escaping.

### Patch Changes

- [`2b9b6c6`](https://github.com/lingodotdev/lingo.dev/commit/2b9b6c63d6594690119c534540cc9d305da2cdd5) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - show config in ci cmd

## 0.89.6

### Patch Changes

- [#717](https://github.com/lingodotdev/lingo.dev/pull/717) [`437d5a1`](https://github.com/lingodotdev/lingo.dev/commit/437d5a1c07f702d0f7a37ae916f27ec9055a9d01) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - fix: prevent truncation of commit message and PR title by properly escaping special characters in shell commands

## 0.89.5

### Patch Changes

- [`e93f405`](https://github.com/lingodotdev/lingo.dev/commit/e93f405a06e026bc6a4f71f534af615970cefdda) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add --no-verify to ci commits

## 0.89.4

### Patch Changes

- [`90c8334`](https://github.com/lingodotdev/lingo.dev/commit/90c83344087a712f238c69b756f86dbab0a3c1e9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add missing --api-key option to ci

## 0.89.3

### Patch Changes

- [`4b080b9`](https://github.com/lingodotdev/lingo.dev/commit/4b080b9e89ec858d4638ef73a96599721e7e90ce) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - upd deps

## 0.89.2

### Patch Changes

- [`14edaed`](https://github.com/lingodotdev/lingo.dev/commit/14edaed1b3a4d3020e3358aaecc6aae2825a1886) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix o11y

## 0.89.1

### Patch Changes

- [`5ce634d`](https://github.com/lingodotdev/lingo.dev/commit/5ce634d3d54701868365d384de90bef51f432fa5) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - reuse i18n inside ci cmd

## 0.89.0

### Minor Changes

- [`c3171c4`](https://github.com/lingodotdev/lingo.dev/commit/c3171c412bb2efab38f311ebb1c740b3cd225c32) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add `ci` cmd

### Patch Changes

- [#709](https://github.com/lingodotdev/lingo.dev/pull/709) [`3fa1c35`](https://github.com/lingodotdev/lingo.dev/commit/3fa1c35b52a521fe2cfd0155ffc8cae6961a4066) Thanks [@vrcprl](https://github.com/vrcprl)! - Fix error tracking in PostHog by properly serializing error objects

## 0.88.0

### Minor Changes

- [#700](https://github.com/lingodotdev/lingo.dev/pull/700) [`c5ccf81`](https://github.com/lingodotdev/lingo.dev/commit/c5ccf81e9c2bd27bae332306da2a41e41bbeb87d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add support for locked patterns in MDX loader

  This change adds support for preserving specific patterns in MDX files during translation, including:

  - !params syntax for parameter documentation
  - !! parameter_name headings
  - !type declarations
  - !required flags
  - !values lists

  The implementation adds a new config version 1.7 with a "lockedPatterns" field that accepts an array of regex patterns to be preserved during translation.

### Patch Changes

- [#704](https://github.com/lingodotdev/lingo.dev/pull/704) [`f78bd68`](https://github.com/lingodotdev/lingo.dev/commit/f78bd6862b85d10c3f26542f55614dbc301ac90a) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Fix image regex in MDX2 loader to handle URLs with parentheses

- [#696](https://github.com/lingodotdev/lingo.dev/pull/696) [`b8c73cb`](https://github.com/lingodotdev/lingo.dev/commit/b8c73cb947f8c445e3515f8c23b3b607e5ea38c2) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Fix PostHog import in CLI to support both ESM and CommonJS environments

- Updated dependencies [[`c5ccf81`](https://github.com/lingodotdev/lingo.dev/commit/c5ccf81e9c2bd27bae332306da2a41e41bbeb87d)]:
  - @lingo.dev/_spec@0.31.0
  - @lingo.dev/_sdk@0.7.38

## 0.87.15

### Patch Changes

- [#685](https://github.com/lingodotdev/lingo.dev/pull/685) [`15b448f`](https://github.com/lingodotdev/lingo.dev/commit/15b448ff79bb58f021619fcb460837b353007609) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Fix npm package readme by making packages/cli/README.md the source of truth and creating symlinks from root readme.md and readme/en.md

## 0.87.14

### Patch Changes

- [#680](https://github.com/lingodotdev/lingo.dev/pull/680) [`b1c397b`](https://github.com/lingodotdev/lingo.dev/commit/b1c397bcd117b2ba2eea5edd713f9e3b0d4d71d5) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - split images into sections

- [#680](https://github.com/lingodotdev/lingo.dev/pull/680) [`b1c397b`](https://github.com/lingodotdev/lingo.dev/commit/b1c397bcd117b2ba2eea5edd713f9e3b0d4d71d5) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - dates in mdx

## 0.87.13

### Patch Changes

- [#678](https://github.com/lingodotdev/lingo.dev/pull/678)
  [`0e3916c`](https://github.com/lingodotdev/lingo.dev/commit/0e3916c4817cd0bc77f426aa66c97df61c6617bf)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - dates in mdx

## 0.87.12

### Patch Changes

- [#675](https://github.com/lingodotdev/lingo.dev/pull/675)
  [`99d9901`](https://github.com/lingodotdev/lingo.dev/commit/99d99013dfcfd92ad35baf94801ecee22041ae42)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - avoid msg id
  fallbacks in .po files

- [#677](https://github.com/lingodotdev/lingo.dev/pull/677)
  [`bb2be5f`](https://github.com/lingodotdev/lingo.dev/commit/bb2be5faba6a9e26000293a55185376eff4ebc22)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - reorder prettier

## 0.87.11

### Patch Changes

- [`c0d801e`](https://github.com/lingodotdev/lingo.dev/commit/c0d801e6b7efa2ec5115f27e5b8726704a5e5f99)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - retain custom
  inlinde code values

## 0.87.10

### Patch Changes

- [`1b17491`](https://github.com/lingodotdev/lingo.dev/commit/1b17491bdea7705858c13f84e2188cd37ad7b212)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - inline code
  placeholder format

## 0.87.9

### Patch Changes

- [`ab9f883`](https://github.com/lingodotdev/lingo.dev/commit/ab9f883079a111f62dde522ebe23171db9b7949e)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - inline code
  placeholders

## 0.87.8

### Patch Changes

- [`f4cf34e`](https://github.com/lingodotdev/lingo.dev/commit/f4cf34eaa63150331dded008a1d819e8b3b960dc)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add handling for
  identical unspaces fences replacement

- [`0d4142a`](https://github.com/lingodotdev/lingo.dev/commit/0d4142a2a7c92f6a04cfe30d64f967a6b8d8744d)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - quoted fences

## 0.87.7

### Patch Changes

- [`c4f6b0b`](https://github.com/lingodotdev/lingo.dev/commit/c4f6b0bdbd913195f0c2133584d3e77b55467c7d)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - trim fences'
  newlines when in quote mode

## 0.87.6

### Patch Changes

- [`71bd89a`](https://github.com/lingodotdev/lingo.dev/commit/71bd89a3a074ecfb3cc1df4ec06529b9b04d2cfb)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - multiline fences
  in quotes and jsx

## 0.87.5

### Patch Changes

- [`dfefe32`](https://github.com/lingodotdev/lingo.dev/commit/dfefe3228683347beb9976e6e61632c65d68140c)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fences after jsx
  block

## 0.87.4

### Patch Changes

- [`12afc85`](https://github.com/lingodotdev/lingo.dev/commit/12afc85dc1a9abdfd11eb9fa41fb574863cde176)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - support for
  quoted and broken code blocks

## 0.87.3

### Patch Changes

- [`dcb119c`](https://github.com/lingodotdev/lingo.dev/commit/dcb119c0ec3cc22f5954a09607f89de5a9978732)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - extra slash n for
  code fences

## 0.87.2

### Patch Changes

- [`e4c9e4f`](https://github.com/lingodotdev/lingo.dev/commit/e4c9e4f1264348ed842e341b6009b10ac5ae84ab)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add safety fence
  decoration with newlines

## 0.87.1

### Patch Changes

- [`a241343`](https://github.com/lingodotdev/lingo.dev/commit/a241343caf7ee326d4fcb6fc0d00b5f07350668b)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - mdx improvements

- [`c0ee61c`](https://github.com/lingodotdev/lingo.dev/commit/c0ee61cb482253f3c0c1a2701b1124e445a6c253)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - mdx placeholder
  replacement

## 0.87.0

### Minor Changes

- [#659](https://github.com/lingodotdev/lingo.dev/pull/659)
  [`4c1e20e`](https://github.com/lingodotdev/lingo.dev/commit/4c1e20e01af79ebc1fba6a3bdb8989494ee71b8c)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - feat: mdx

## 0.86.0

### Minor Changes

- [#656](https://github.com/lingodotdev/lingo.dev/pull/656)
  [`915a0f5`](https://github.com/lingodotdev/lingo.dev/commit/915a0f5d8b74996f2b26dd01ac9c431c85a95d85)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - code formatting
  support for advanced mdx

## 0.85.7

### Patch Changes

- [`a502caf`](https://github.com/lingodotdev/lingo.dev/commit/a502caf8680f02e769c819badd08ddb8b731d261)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - metadata
  transfers for .po

## 0.85.6

### Patch Changes

- [#651](https://github.com/lingodotdev/lingo.dev/pull/651)
  [`a6133f4`](https://github.com/lingodotdev/lingo.dev/commit/a6133f4074cce1ffd9e42b73efb5213e1fe6f76a)
  Thanks [@mathio](https://github.com/mathio)! - --file option

## 0.85.5

### Patch Changes

- [#649](https://github.com/lingodotdev/lingo.dev/pull/649)
  [`409018d`](https://github.com/lingodotdev/lingo.dev/commit/409018de74614a1fd99363c6749b0e4be9e1a278)
  Thanks [@mathio](https://github.com/mathio)! - refactor dependencies

- Updated dependencies
  [[`409018d`](https://github.com/lingodotdev/lingo.dev/commit/409018de74614a1fd99363c6749b0e4be9e1a278)]:
  - @lingo.dev/_spec@0.30.3
  - @lingo.dev/_sdk@0.7.37

## 0.85.4

### Patch Changes

- [#647](https://github.com/lingodotdev/lingo.dev/pull/647)
  [`235b6d9`](https://github.com/lingodotdev/lingo.dev/commit/235b6d914c5f542ee5f1a8a88085cfd9dea5409e)
  Thanks [@mathio](https://github.com/mathio)! - update vitest

- Updated dependencies
  [[`235b6d9`](https://github.com/lingodotdev/lingo.dev/commit/235b6d914c5f542ee5f1a8a88085cfd9dea5409e)]:
  - @lingo.dev/_spec@0.30.2
  - @lingo.dev/_sdk@0.7.36

## 0.85.3

### Patch Changes

- [#645](https://github.com/lingodotdev/lingo.dev/pull/645)
  [`d824b10`](https://github.com/lingodotdev/lingo.dev/commit/d824b106631f45fc428cf01f733aab4842b4fa81)
  Thanks [@mathio](https://github.com/mathio)! - update dependencies

- Updated dependencies
  [[`d824b10`](https://github.com/lingodotdev/lingo.dev/commit/d824b106631f45fc428cf01f733aab4842b4fa81)]:
  - @lingo.dev/_spec@0.30.1
  - @lingo.dev/_sdk@0.7.35

## 0.85.2

### Patch Changes

- [#643](https://github.com/lingodotdev/lingo.dev/pull/643)
  [`94ed627`](https://github.com/lingodotdev/lingo.dev/commit/94ed6277f08ba60b43ada1825708538860a932dd)
  Thanks [@mathio](https://github.com/mathio)! - update dependencies

## 0.85.1

### Patch Changes

- [`8da8bd0`](https://github.com/lingodotdev/lingo.dev/commit/8da8bd0039729876fdedc43d991908ccbc9a3a85)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - upd usage table

## 0.85.0

### Minor Changes

- [`486f2d2`](https://github.com/lingodotdev/lingo.dev/commit/486f2d2fec021b0e9403277da5fec7ca510047c3)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add status
  command

## 0.84.0

### Minor Changes

- [#631](https://github.com/lingodotdev/lingo.dev/pull/631)
  [`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - double formatting
  for mdx

- [#631](https://github.com/lingodotdev/lingo.dev/pull/631)
  [`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - advanced mdx
  support (shout out to @ZYJLiu!)

### Patch Changes

- Updated dependencies
  [[`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f),
  [`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f)]:
  - @lingo.dev/_spec@0.30.0
  - @lingo.dev/_sdk@0.7.34

## 0.83.0

### Minor Changes

- [#629](https://github.com/lingodotdev/lingo.dev/pull/629)
  [`58f3959`](https://github.com/lingodotdev/lingo.dev/commit/58f39599b3b765ad807e725b4089a5e9b11a01b2)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - advanced mdx
  support (shout out to @ZYJLiu!)

### Patch Changes

- Updated dependencies
  [[`58f3959`](https://github.com/lingodotdev/lingo.dev/commit/58f39599b3b765ad807e725b4089a5e9b11a01b2)]:
  - @lingo.dev/_spec@0.29.0
  - @lingo.dev/_sdk@0.7.33

## 0.82.1

### Patch Changes

- [`fd2fd5c`](https://github.com/lingodotdev/lingo.dev/commit/fd2fd5cec4ebf8467b4fd8df9dc2892a3f0249f0)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add startsWith
  for locked keys

## 0.82.0

### Minor Changes

- [#627](https://github.com/lingodotdev/lingo.dev/pull/627)
  [`fe922a4`](https://github.com/lingodotdev/lingo.dev/commit/fe922a469c2d5dac23a909a4fb67a6efd56d80d6)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add support for
  json/yaml key locking

### Patch Changes

- [`e8ea955`](https://github.com/lingodotdev/lingo.dev/commit/e8ea95551c8a3b16afe078554ebcb1d79ce817cf)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - gracefully exit
  on o11y errors

- Updated dependencies
  [[`fe922a4`](https://github.com/lingodotdev/lingo.dev/commit/fe922a469c2d5dac23a909a4fb67a6efd56d80d6)]:
  - @lingo.dev/_spec@0.28.0
  - @lingo.dev/_sdk@0.7.32

## 0.81.0

### Minor Changes

- [`ddc2b7b`](https://github.com/lingodotdev/lingo.dev/commit/ddc2b7b3513d6118245bd01fc10c1b8563b52910)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add key rename
  tracking

## 0.80.1

### Patch Changes

- [`fb450cb`](https://github.com/lingodotdev/lingo.dev/commit/fb450cb2e90dd67ec008691a03237bdeecce5807)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - upd banner
  message

## 0.80.0

### Minor Changes

- [#614](https://github.com/lingodotdev/lingo.dev/pull/614)
  [`2495afd`](https://github.com/lingodotdev/lingo.dev/commit/2495afd69e23700f96e19e5bbf74e393b29c2033)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add basic
  translators

### Patch Changes

- [#616](https://github.com/lingodotdev/lingo.dev/pull/616)
  [`516a79c`](https://github.com/lingodotdev/lingo.dev/commit/516a79c75501c5960ae944379f38591806ca43e2)
  Thanks [@mathio](https://github.com/mathio)! - po files --frozen flag

- Updated dependencies
  [[`2495afd`](https://github.com/lingodotdev/lingo.dev/commit/2495afd69e23700f96e19e5bbf74e393b29c2033),
  [`516a79c`](https://github.com/lingodotdev/lingo.dev/commit/516a79c75501c5960ae944379f38591806ca43e2),
  [`2cc6114`](https://github.com/lingodotdev/lingo.dev/commit/2cc61140fccc69ab73d40c7802a2d0e018889475)]:
  - @lingo.dev/_spec@0.27.0
  - @lingo.dev/_sdk@0.7.31

## 0.79.5

### Patch Changes

- [#612](https://github.com/lingodotdev/lingo.dev/pull/612)
  [`e541a12`](https://github.com/lingodotdev/lingo.dev/commit/e541a12436eeb4947caa077143c0b6e00b07e9b0)
  Thanks [@mathio](https://github.com/mathio)! - inject locale

## 0.79.4

### Patch Changes

- [#610](https://github.com/lingodotdev/lingo.dev/pull/610)
  [`ad05fbf`](https://github.com/lingodotdev/lingo.dev/commit/ad05fbf11b737c17a7cf2861be23ab2bf1189b52)
  Thanks [@mathio](https://github.com/mathio)! - handle prettier plugins deps

## 0.79.3

### Patch Changes

- [#606](https://github.com/lingodotdev/lingo.dev/pull/606)
  [`997a447`](https://github.com/lingodotdev/lingo.dev/commit/997a447c079a0554df17c6a7b25415058b017331)
  Thanks [@mathio](https://github.com/mathio)! - support bun package manager

## 0.79.2

### Patch Changes

- [#601](https://github.com/lingodotdev/lingo.dev/pull/601)
  [`27964ba`](https://github.com/lingodotdev/lingo.dev/commit/27964bacaf3772c573230a8967c9fc112c81d054)
  Thanks [@mathio](https://github.com/mathio)! - lingo.dev ci PR flow update

- [#605](https://github.com/lingodotdev/lingo.dev/pull/605)
  [`1dbbfd2`](https://github.com/lingodotdev/lingo.dev/commit/1dbbfd2ed9f5a7e0479dc83f700fb68ee5347a18)
  Thanks [@mathio](https://github.com/mathio)! - inject locale

- Updated dependencies
  [[`1dbbfd2`](https://github.com/lingodotdev/lingo.dev/commit/1dbbfd2ed9f5a7e0479dc83f700fb68ee5347a18)]:
  - @lingo.dev/_spec@0.26.6
  - @lingo.dev/_sdk@0.7.30

## 0.79.1

### Patch Changes

- [#602](https://github.com/lingodotdev/lingo.dev/pull/602)
  [`6d6eded`](https://github.com/lingodotdev/lingo.dev/commit/6d6ededbbd9310b9b4ae331e520da2a1e2722e79)
  Thanks [@mathio](https://github.com/mathio)! - add i18n command --file option

## 0.79.0

### Minor Changes

- [#599](https://github.com/lingodotdev/lingo.dev/pull/599)
  [`81b2447`](https://github.com/lingodotdev/lingo.dev/commit/81b244746acd54f3c69e40353e8a0b8f71a5e73c)
  Thanks [@mathio](https://github.com/mathio)! - add "ci" command

## 0.78.17

### Patch Changes

- [#596](https://github.com/lingodotdev/lingo.dev/pull/596)
  [`61b487e`](https://github.com/lingodotdev/lingo.dev/commit/61b487e1e059328a32c3cdf673255d9d2cd480d9)
  Thanks [@vrcprl](https://github.com/vrcprl)! - add new locale

- Updated dependencies
  [[`61b487e`](https://github.com/lingodotdev/lingo.dev/commit/61b487e1e059328a32c3cdf673255d9d2cd480d9)]:
  - @lingo.dev/_spec@0.26.5
  - @lingo.dev/_sdk@0.7.29

## 0.78.16

### Patch Changes

- [#595](https://github.com/lingodotdev/lingo.dev/pull/595)
  [`ca73e26`](https://github.com/lingodotdev/lingo.dev/commit/ca73e269edd31a237aeebf49244798f7222b3c72)
  Thanks [@mathio](https://github.com/mathio)! - gitignore logic

- Updated dependencies
  [[`743d93e`](https://github.com/lingodotdev/lingo.dev/commit/743d93e554841bbd96d23682d8aec63cb4eb3ec8)]:
  - @lingo.dev/_spec@0.26.4
  - @lingo.dev/_sdk@0.7.28

## 0.78.15

### Patch Changes

- [#574](https://github.com/lingodotdev/lingo.dev/pull/574)
  [`dde7fbe`](https://github.com/lingodotdev/lingo.dev/commit/dde7fbe57fc9b1d3ce28e192b778921099354dad)
  Thanks [@mathio](https://github.com/mathio)! - handle errors from i18n when
  streaming

- Updated dependencies
  [[`dde7fbe`](https://github.com/lingodotdev/lingo.dev/commit/dde7fbe57fc9b1d3ce28e192b778921099354dad)]:
  - @lingo.dev/_sdk@0.7.27

## 0.78.14

### Patch Changes

- [#553](https://github.com/lingodotdev/lingo.dev/pull/553)
  [`95023f2`](https://github.com/lingodotdev/lingo.dev/commit/95023f2c8da3958e8582628a22bf40674f8d2317)
  Thanks [@vrcprl](https://github.com/vrcprl)! - Add new locales

- Updated dependencies
  [[`95023f2`](https://github.com/lingodotdev/lingo.dev/commit/95023f2c8da3958e8582628a22bf40674f8d2317)]:
  - @lingo.dev/_spec@0.26.3
  - @lingo.dev/_sdk@0.7.26

## 0.78.13

### Patch Changes

- [#551](https://github.com/lingodotdev/lingo.dev/pull/551)
  [`30a56b6`](https://github.com/lingodotdev/lingo.dev/commit/30a56b65d3b2a0cfb32a57bfebeba0f4c014a400)
  Thanks [@mathio](https://github.com/mathio)! - support prettier plugins

## 0.78.12

### Patch Changes

- [#548](https://github.com/lingodotdev/lingo.dev/pull/548)
  [`d8b9f57`](https://github.com/lingodotdev/lingo.dev/commit/d8b9f57b2231262b0940a83af8cc16101209c029)
  Thanks [@mathio](https://github.com/mathio)! - warn if env vars override
  values from "auth --login"

- [#550](https://github.com/lingodotdev/lingo.dev/pull/550)
  [`8eea2e4`](https://github.com/lingodotdev/lingo.dev/commit/8eea2e4ac148adbecbda9794885ed5486a549037)
  Thanks [@mathio](https://github.com/mathio)! - info message

## 0.78.11

### Patch Changes

- [#546](https://github.com/lingodotdev/lingo.dev/pull/546)
  [`9089b08`](https://github.com/lingodotdev/lingo.dev/commit/9089b085b968ff3195866e377ecf3016aa06f959)
  Thanks [@mathio](https://github.com/mathio)! - add helper method to spec

- Updated dependencies
  [[`9089b08`](https://github.com/lingodotdev/lingo.dev/commit/9089b085b968ff3195866e377ecf3016aa06f959)]:
  - @lingo.dev/_spec@0.26.2
  - @lingo.dev/_sdk@0.7.25

## 0.78.10

### Patch Changes

- Updated dependencies
  [[`0b48be1`](https://github.com/lingodotdev/lingo.dev/commit/0b48be197e88dac581cc4f257789a04b43acf932)]:
  - @lingo.dev/_spec@0.26.1
  - @lingo.dev/_sdk@0.7.24

## 0.78.9

### Patch Changes

- [#543](https://github.com/lingodotdev/lingo.dev/pull/543)
  [`c6bd0ba`](https://github.com/lingodotdev/lingo.dev/commit/c6bd0ba188b3358bff7193d396be528da02aa026)
  Thanks [@mathio](https://github.com/mathio)! - run prettier in context of the
  target file

## 0.78.8

### Patch Changes

- [#540](https://github.com/lingodotdev/lingo.dev/pull/540)
  [`f82762a`](https://github.com/lingodotdev/lingo.dev/commit/f82762a958a795327b911c91f71d1cf550d37ad3)
  Thanks [@mathio](https://github.com/mathio)! - possible fix for loading
  markdown files

## 0.78.7

### Patch Changes

- Updated dependencies
  [[`7597b99`](https://github.com/lingodotdev/lingo.dev/commit/7597b99c4869f63a42e6de3c4ed25424498d15ae)]:
  - @lingo.dev/_sdk@0.7.23

## 0.78.6

### Patch Changes

- [#532](https://github.com/lingodotdev/lingo.dev/pull/532)
  [`c3b6a04`](https://github.com/lingodotdev/lingo.dev/commit/c3b6a04c8fa3a2898b0f4b68d42e15f45184b5c4)
  Thanks [@mathio](https://github.com/mathio)! - save yaml with keys and values
  in quotes

## 0.78.5

### Patch Changes

- Updated dependencies
  [[`bafa755`](https://github.com/lingodotdev/lingo.dev/commit/bafa755d9681e93741462eb7bcf9b85073d20fd7)]:
  - @lingo.dev/_spec@0.26.0
  - @lingo.dev/_sdk@0.7.22

## 0.78.4

### Patch Changes

- [#529](https://github.com/lingodotdev/lingo.dev/pull/529)
  [`d75efba`](https://github.com/lingodotdev/lingo.dev/commit/d75efbaf243ff5fe256142dcda8f2b48f806a7fd)
  Thanks [@mathio](https://github.com/mathio)! - fix --frozen flag

- [#527](https://github.com/lingodotdev/lingo.dev/pull/527)
  [`a404e2b`](https://github.com/lingodotdev/lingo.dev/commit/a404e2bf123e6a018945e5b6f9bfcfce9235ae77)
  Thanks [@mathio](https://github.com/mathio)! - update unlocalizable keys even
  with no translation changes

## 0.78.3

### Patch Changes

- [#524](https://github.com/lingodotdev/lingo.dev/pull/524)
  [`befa237`](https://github.com/lingodotdev/lingo.dev/commit/befa23704f9b010923292da89e232152c0423aed)
  Thanks [@mathio](https://github.com/mathio)! - fix vue json files

## 0.78.2

### Patch Changes

- [#518](https://github.com/lingodotdev/lingo.dev/pull/518)
  [`444a731`](https://github.com/lingodotdev/lingo.dev/commit/444a7319a1351e22e5666504169023b4c8a29d5f)
  Thanks [@mathio](https://github.com/mathio)! - support JSON messages in <i18n>
  block of .vue files

- Updated dependencies
  [[`444a731`](https://github.com/lingodotdev/lingo.dev/commit/444a7319a1351e22e5666504169023b4c8a29d5f)]:
  - @lingo.dev/_spec@0.25.3
  - @lingo.dev/_sdk@0.7.21

## 0.78.1

### Patch Changes

- [#521](https://github.com/lingodotdev/lingo.dev/pull/521)
  [`3cf6753`](https://github.com/lingodotdev/lingo.dev/commit/3cf675320f7534183e2921e0afb3dd7e50beac92)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - empty nodes in
  localizable files

## 0.78.0

### Minor Changes

- [#519](https://github.com/lingodotdev/lingo.dev/pull/519)
  [`64b9461`](https://github.com/lingodotdev/lingo.dev/commit/64b946163c5a588405abbe53ac1b0a45cc859d7f)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - treat keys w/
  empty nodes as values in `Localizable.xcstrings` skip keys w/
  `shouldTranslate: false` in `Localizable.xcstrings`

## 0.77.7

### Patch Changes

- [#515](https://github.com/lingodotdev/lingo.dev/pull/515)
  [`fd99a6c`](https://github.com/lingodotdev/lingo.dev/commit/fd99a6ca18ee21774ba5c2b7ce72d1712e374675)
  Thanks [@mathio](https://github.com/mathio)! - add typesVersions for support
  of older `moduleResolution`

- Updated dependencies
  [[`fd99a6c`](https://github.com/lingodotdev/lingo.dev/commit/fd99a6ca18ee21774ba5c2b7ce72d1712e374675)]:
  - @lingo.dev/_sdk@0.7.20

## 0.77.6

### Patch Changes

- [#507](https://github.com/lingodotdev/lingo.dev/pull/507)
  [`f0c7f6e`](https://github.com/lingodotdev/lingo.dev/commit/f0c7f6e7fa669e4f049d0b1175eb54bae20ec330)
  Thanks [@mathio](https://github.com/mathio)! - fix handling numbers in
  unlocalizable loader

## 0.77.5

### Patch Changes

- [#505](https://github.com/lingodotdev/lingo.dev/pull/505)
  [`1fc204b`](https://github.com/lingodotdev/lingo.dev/commit/1fc204bdc90ae59a9cda7cd13b0fbf61b7fc0749)
  Thanks [@mathio](https://github.com/mathio)! - init github/bitbucket/gitlab
  action

## 0.77.4

### Patch Changes

- [#503](https://github.com/lingodotdev/lingo.dev/pull/503)
  [`7f73148`](https://github.com/lingodotdev/lingo.dev/commit/7f73148e6acb67920ce1deaec8d16384115b1071)
  Thanks [@github-actions](https://github.com/apps/github-actions)! - release

- [#500](https://github.com/lingodotdev/lingo.dev/pull/500)
  [`3a526b8`](https://github.com/lingodotdev/lingo.dev/commit/3a526b86ef55b501cab167d072791b7487a20c9c)
  Thanks [@mathio](https://github.com/mathio)! - fix bucket path with \*
  filenames

## 0.77.3

### Patch Changes

- [#498](https://github.com/lingodotdev/lingo.dev/pull/498)
  [`ec2902e`](https://github.com/lingodotdev/lingo.dev/commit/ec2902e5dc31fd79cc3b6fbf478ed1f3c4df0345)
  Thanks [@mathio](https://github.com/mathio)! - build json schema for config

- Updated dependencies
  [[`ec2902e`](https://github.com/lingodotdev/lingo.dev/commit/ec2902e5dc31fd79cc3b6fbf478ed1f3c4df0345)]:
  - @lingo.dev/_spec@0.25.2
  - @lingo.dev/_sdk@0.7.19

## 0.77.2

### Patch Changes

- [#496](https://github.com/lingodotdev/lingo.dev/pull/496)
  [`beb0541`](https://github.com/lingodotdev/lingo.dev/commit/beb05411ee459461e05801a763b1fa28d288e04e)
  Thanks [@mathio](https://github.com/mathio)! - po files

- Updated dependencies
  [[`beb0541`](https://github.com/lingodotdev/lingo.dev/commit/beb05411ee459461e05801a763b1fa28d288e04e)]:
  - @lingo.dev/_spec@0.25.1
  - @lingo.dev/_sdk@0.7.18

## 0.77.1

### Patch Changes

- [#493](https://github.com/lingodotdev/lingo.dev/pull/493)
  [`81527a4`](https://github.com/lingodotdev/lingo.dev/commit/81527a457ad8ef7fe735232caacdf2cc575e5b20)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix payload
  references

- Updated dependencies
  [[`81527a4`](https://github.com/lingodotdev/lingo.dev/commit/81527a457ad8ef7fe735232caacdf2cc575e5b20)]:
  - @lingo.dev/_sdk@0.7.17

## 0.77.0

### Minor Changes

- [#487](https://github.com/lingodotdev/lingo.dev/pull/487)
  [`81c6ddf`](https://github.com/lingodotdev/lingo.dev/commit/81c6ddfb1e7b4f0e530a46a873303a7996d7264a)
  Thanks [@mathio](https://github.com/mathio)! - add mcp command

## 0.76.0

### Minor Changes

- [#490](https://github.com/lingodotdev/lingo.dev/pull/490)
  [`c3881c3`](https://github.com/lingodotdev/lingo.dev/commit/c3881c3d763c35d0e4fcad88e5f6918939c6b2a4)
  Thanks [@mathio](https://github.com/mathio)! - support multiple [locale]
  placeholders in bucket path

## 0.75.1

### Patch Changes

- [#488](https://github.com/lingodotdev/lingo.dev/pull/488)
  [`07241f5`](https://github.com/lingodotdev/lingo.dev/commit/07241f50aa7fe80d1f318106f50d8629b66628f6)
  Thanks [@mathio](https://github.com/mathio)! - init command fix

## 0.75.0

### Minor Changes

- [#485](https://github.com/lingodotdev/lingo.dev/pull/485)
  [`a096300`](https://github.com/lingodotdev/lingo.dev/commit/a0963008ea2a8bbc910b0eaeb20f4e3b3cd641a7)
  Thanks [@mathio](https://github.com/mathio)! - add support for php buckets

### Patch Changes

- Updated dependencies
  [[`a096300`](https://github.com/lingodotdev/lingo.dev/commit/a0963008ea2a8bbc910b0eaeb20f4e3b3cd641a7)]:
  - @lingo.dev/_spec@0.25.0
  - @lingo.dev/_sdk@0.7.16

## 0.74.17

### Patch Changes

- [#483](https://github.com/lingodotdev/lingo.dev/pull/483)
  [`d2963fc`](https://github.com/lingodotdev/lingo.dev/commit/d2963fc45a30d3e6972440e8ea7da8e425417cb6)
  Thanks [@mathio](https://github.com/mathio)! - fix partial cache restore

## 0.74.16

### Patch Changes

- [#477](https://github.com/lingodotdev/lingo.dev/pull/477)
  [`3d21698`](https://github.com/lingodotdev/lingo.dev/commit/3d21698e3783325ab7bb25aac6d5a8687774cf78)
  Thanks [@mathio](https://github.com/mathio)! - detect paths for existing
  locale files for each bucket during init

## 0.74.15

### Patch Changes

- [#473](https://github.com/lingodotdev/lingo.dev/pull/473)
  [`3a99763`](https://github.com/lingodotdev/lingo.dev/commit/3a99763087512ba82955303d6f0567e813f4fa05)
  Thanks [@vrcprl](https://github.com/vrcprl)! - add new locales

- Updated dependencies
  [[`3a99763`](https://github.com/lingodotdev/lingo.dev/commit/3a99763087512ba82955303d6f0567e813f4fa05)]:
  - @lingo.dev/_spec@0.24.4
  - @lingo.dev/_sdk@0.7.15

## 0.74.14

### Patch Changes

- [`0dbd288`](https://github.com/lingodotdev/lingo.dev/commit/0dbd288f292db922fa7fbaed239d26897bbe8a8e)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - refactor csv
  loader

## 0.74.13

### Patch Changes

- [#469](https://github.com/lingodotdev/lingo.dev/pull/469)
  [`ba51b9b`](https://github.com/lingodotdev/lingo.dev/commit/ba51b9b6d6ecc36e7282d471cef7bf968ccc270e)
  Thanks [@mathio](https://github.com/mathio)! - transform object with numeric
  keys

## 0.74.12

### Patch Changes

- [`c5a785a`](https://github.com/lingodotdev/lingo.dev/commit/c5a785aae6a3d786c25e7082e5e3a5309d3327e2)
  Thanks [@mathio](https://github.com/mathio)! - revert

## 0.74.11

### Patch Changes

- [#466](https://github.com/lingodotdev/lingo.dev/pull/466)
  [`9ef4da1`](https://github.com/lingodotdev/lingo.dev/commit/9ef4da115043d89218eaf46142bf69dd126448f6)
  Thanks [@mathio](https://github.com/mathio)! - transform object with numeric
  keys

## 0.74.10

### Patch Changes

- [#465](https://github.com/lingodotdev/lingo.dev/pull/465)
  [`e033656`](https://github.com/lingodotdev/lingo.dev/commit/e0336566758defbd6cf1f7ad3a210d9f94d0c8de)
  Thanks [@mathio](https://github.com/mathio)! - fix init cmd

- [#463](https://github.com/lingodotdev/lingo.dev/pull/463)
  [`f249d8f`](https://github.com/lingodotdev/lingo.dev/commit/f249d8f69d04f0ce40fd94e500e7b829b7ba1ed4)
  Thanks [@vrcprl](https://github.com/vrcprl)! - set utf-8 encoding explicitly

- Updated dependencies
  [[`f249d8f`](https://github.com/lingodotdev/lingo.dev/commit/f249d8f69d04f0ce40fd94e500e7b829b7ba1ed4)]:
  - @lingo.dev/_sdk@0.7.14

## 0.74.9

### Patch Changes

- [#461](https://github.com/lingodotdev/lingo.dev/pull/461)
  [`d31f9fc`](https://github.com/lingodotdev/lingo.dev/commit/d31f9fcc7fe1a729f093c68a0573f2a8ec077f0e)
  Thanks [@mathio](https://github.com/mathio)! - ordering of keys in xcstrings
  file to match that of Xcode

## 0.74.8

### Patch Changes

- [#457](https://github.com/lingodotdev/lingo.dev/pull/457)
  [`8ffff97`](https://github.com/lingodotdev/lingo.dev/commit/8ffff9757e28e4beef071866835a491080d7cba5)
  Thanks [@mathio](https://github.com/mathio)! - fix trailing new lines

## 0.74.7

### Patch Changes

- [#455](https://github.com/lingodotdev/lingo.dev/pull/455)
  [`96babb9`](https://github.com/lingodotdev/lingo.dev/commit/96babb956b0aa7b83627aefd596051ed1849e7ca)
  Thanks [@github-actions](https://github.com/apps/github-actions)! - i18n
  progress fix

## 0.74.6

### Patch Changes

- [#454](https://github.com/lingodotdev/lingo.dev/pull/454)
  [`9856274`](https://github.com/lingodotdev/lingo.dev/commit/98562747f3cce0d7109b24f3e5b867f003ebdfbb)
  Thanks [@mathio](https://github.com/mathio)! - fix i18n progress indicator

## 0.74.5

### Patch Changes

- [`e950be4`](https://github.com/lingodotdev/lingo.dev/commit/e950be4ff406ba4328a53a9c9ff8dd094787b105)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - remove newline
  loader from dato

## 0.74.4

### Patch Changes

- [`74bd1c9`](https://github.com/lingodotdev/lingo.dev/commit/74bd1c9c19f364c65b70e91b2f4ff63949c40adf)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - package exports

## 0.74.3

### Patch Changes

- [`c0bc85d`](https://github.com/lingodotdev/lingo.dev/commit/c0bc85d5870f9150eeecf6e806cbb4a4494b7bf0)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - move \_ packages
  from devdeps to deps

## 0.74.2

### Patch Changes

- [`dc8bfc7`](https://github.com/lingodotdev/lingo.dev/commit/dc8bfc7ddc38ade768b8aa11c56669db7eb446e6)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - publish deps

## 0.74.1

### Patch Changes

- [`6281dbd`](https://github.com/lingodotdev/lingo.dev/commit/6281dbd96bd5cfe54f194a6a1d055c8255a250de)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix sdk/spec
  exported types

## 0.74.0

### Minor Changes

- [`ee9e666`](https://github.com/lingodotdev/lingo.dev/commit/ee9e666df2a3d11f2e89af37ea47a2d714a5173b)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add belarusian

## 0.73.1

### Patch Changes

- [#437](https://github.com/lingodotdev/lingo.dev/pull/437)
  [`f643c28`](https://github.com/lingodotdev/lingo.dev/commit/f643c2810662e4ced0aa5e57f6e574d0294dab49)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - order xcstrings
  ascii-way

## 0.73.0

### Minor Changes

- [#435](https://github.com/lingodotdev/lingo.dev/pull/435)
  [`754de44`](https://github.com/lingodotdev/lingo.dev/commit/754de44bd94119c88e3fb27d0713b8e1b20c4264)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - preserve
  newlines, whitespaces while formatting

- [#435](https://github.com/lingodotdev/lingo.dev/pull/435)
  [`754de44`](https://github.com/lingodotdev/lingo.dev/commit/754de44bd94119c88e3fb27d0713b8e1b20c4264)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add json sorting

## 0.72.0

### Minor Changes

- [#433](https://github.com/lingodotdev/lingo.dev/pull/433)
  [`e895746`](https://github.com/lingodotdev/lingo.dev/commit/e895746dff9c6a146e0fa61f681b9a5d60b7d124)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - preserve
  newlines, whitespaces while formatting

## 0.71.0

### Minor Changes

- [#432](https://github.com/lingodotdev/lingo.dev/pull/432)
  [`cd836e4`](https://github.com/lingodotdev/lingo.dev/commit/cd836e45cf810f495e2c6e1449824dc84794d571)
  Thanks [@mathio](https://github.com/mathio)! - cache processed data chunks,
  recover from cache

- [#428](https://github.com/lingodotdev/lingo.dev/pull/428)
  [`5dd7b65`](https://github.com/lingodotdev/lingo.dev/commit/5dd7b6529ce174d8759e80644c3233927b1ecce4)
  Thanks [@mathio](https://github.com/mathio)! - map old env vars

## 0.70.4

### Patch Changes

- [`b4c7f1e`](https://github.com/lingodotdev/lingo.dev/commit/b4c7f1e86334d229bee62219c26f30d0b523926d)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - rename cli
  references

## 0.70.2

### Patch Changes

- [`5dda52b`](https://github.com/lingodotdev/lingo.dev/commit/5dda52bec6788ffa171a976b1739209b193c5a4c)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - optimize
  lingo.dev (dev) dependencies

## 0.70.3

### Patch Changes

- [`9917328`](https://github.com/lingodotdev/lingo.dev/commit/9917328f1293cc44caadde74d7b3c0e3e39e8691)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix export issue

## 0.70.1

### Patch Changes

- [#419](https://github.com/lingodotdev/lingo.dev/pull/419)
  [`a45feb1`](https://github.com/lingodotdev/lingo.dev/commit/a45feb1d747f8fa32c42c1726953a04c174e754a)
  Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Replexica is now
  Lingo.dev! 🎉

- Updated dependencies
  [[`a45feb1`](https://github.com/lingodotdev/lingo.dev/commit/a45feb1d747f8fa32c42c1726953a04c174e754a)]:
  - @lingo.dev/_spec@0.24.1
  - @lingo.dev/cli@0.70.1
  - @lingo.dev/_sdk@0.7.11
