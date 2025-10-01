# @lingo.dev/\_spec

## 0.40.3

### Patch Changes

- [#1192](https://github.com/lingodotdev/lingo.dev/pull/1192) [`bbc71b9`](https://github.com/lingodotdev/lingo.dev/commit/bbc71b9948ccc289c9669d8b0c276c9596f6a5e7) Thanks [@vrcprl](https://github.com/vrcprl)! - Add biome support

## 0.40.2

### Patch Changes

- [#1171](https://github.com/lingodotdev/lingo.dev/pull/1171) [`6579d70`](https://github.com/lingodotdev/lingo.dev/commit/6579d70bc670c2fdc06c09842d931b07e134151c) Thanks [@vrcprl](https://github.com/vrcprl)! - add el-CY en-IE fr-LU locales

## 0.40.1

### Patch Changes

- [#1016](https://github.com/lingodotdev/lingo.dev/pull/1016) [`a35032e`](https://github.com/lingodotdev/lingo.dev/commit/a35032e7e7a188d1f5e774576352068124526e24) Thanks [@davidturnbull](https://github.com/davidturnbull)! - feat: add automated config documentation generator for i18n.json schema

## 0.40.0

### Minor Changes

- [#1066](https://github.com/lingodotdev/lingo.dev/pull/1066) [`6af91a0`](https://github.com/lingodotdev/lingo.dev/commit/6af91a083d16f85051fb49a4034789abe784017e) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add hints support for xcode and jsonc buckets

## 0.39.3

### Patch Changes

- [#1031](https://github.com/lingodotdev/lingo.dev/pull/1031) [`afbb978`](https://github.com/lingodotdev/lingo.dev/commit/afbb978fec83d574f2c43b7d68457e435fca9b57) Thanks [@mathio](https://github.com/mathio)! - add json-dictionary loader support

## 0.39.2

### Patch Changes

- [#1023](https://github.com/lingodotdev/lingo.dev/pull/1023) [`9266fd0`](https://github.com/lingodotdev/lingo.dev/commit/9266fd0bcddf4b07ca51d2609af92a9473106f9d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Update Zod dependency to version 3.25.76

## 0.39.1

### Patch Changes

- [#995](https://github.com/lingodotdev/lingo.dev/pull/995) [`acd5356`](https://github.com/lingodotdev/lingo.dev/commit/acd5356b68d2261576240c173fea790864c3c31d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add Icelandic (is) locale support with is-IS regional variant

## 0.39.0

### Minor Changes

- [#981](https://github.com/lingodotdev/lingo.dev/pull/981) [`f644123`](https://github.com/lingodotdev/lingo.dev/commit/f644123ddf6a6254790d08af50141e4dd78c3677) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add support for plain TXT files to enable translation of fastlane App Store metadata and other plain text content

## 0.38.0

### Minor Changes

- [#958](https://github.com/lingodotdev/lingo.dev/pull/958) [`84fd214`](https://github.com/lingodotdev/lingo.dev/commit/84fd214a21766e7683c5d645fcb8c4c0162eb0b6) Thanks [@chrissiwaffler](https://github.com/chrissiwaffler)! - feat: add Mistral AI as a supported LLM provider

  - Added Mistral AI provider support across the entire lingo.dev ecosystem
  - Users can now use Mistral models for localization by setting MISTRAL_API_KEY
  - Supports all Mistral models available through the @ai-sdk/mistral package
  - Configuration via environment variable or user-wide config: `npx lingo.dev@latest config set llm.mistralApiKey <key>`

## 0.37.0

### Minor Changes

- [#956](https://github.com/lingodotdev/lingo.dev/pull/956) [`ce8c75c`](https://github.com/lingodotdev/lingo.dev/commit/ce8c75c7fc1a2124d3e18444bc356c4dfce26434) Thanks [@VAIBHAVSING](https://github.com/VAIBHAVSING)! - feat: add EJS (Embedded JavaScript) templating engine support

  - Added EJS loader to support parsing and translating EJS template files
  - EJS loader extracts translatable text while preserving EJS tags and expressions
  - Updated spec package to include "ejs" in supported bucket types
  - Added comprehensive test suite covering various EJS scenarios including conditionals, loops, includes, and mixed content
  - Automatically installed EJS dependency (@types/ejs) for TypeScript support

## 0.36.0

### Minor Changes

- [#913](https://github.com/lingodotdev/lingo.dev/pull/913) [`1b9b113`](https://github.com/lingodotdev/lingo.dev/commit/1b9b11301978e8caa2555832d027ff93216aa6e1) Thanks [@The-Best-Codes](https://github.com/The-Best-Codes)! - Add support for Ollama as a CLI and Compiler provider.

### Patch Changes

- [#922](https://github.com/lingodotdev/lingo.dev/pull/922) [`0329a9c`](https://github.com/lingodotdev/lingo.dev/commit/0329a9cdb5e5a63fcecab4efcd7cce22f155a0e9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add openrouter ais support for compiler

## 0.35.0

### Minor Changes

- [#897](https://github.com/lingodotdev/lingo.dev/pull/897) [`a5da697`](https://github.com/lingodotdev/lingo.dev/commit/a5da697f7efd46de31d17b202d06eb5f655ed9b9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add support for other providers in the compiler and implement Google AI as a provider.

## 0.34.0

### Minor Changes

- [`e980e84`](https://github.com/lingodotdev/lingo.dev/commit/e980e84178439ad70417d38b425acf9148cfc4b6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added the compiler

## 0.33.3

### Patch Changes

- [#805](https://github.com/lingodotdev/lingo.dev/pull/805) [`0272fbf`](https://github.com/lingodotdev/lingo.dev/commit/0272fbf8847240ed9453130237d5843b918f869f) Thanks [@Vicentesan](https://github.com/Vicentesan)! - Introduce the gregorian language (ka-GE)

## 0.33.2

### Patch Changes

- [#782](https://github.com/lingodotdev/lingo.dev/pull/782) [`d913c20`](https://github.com/lingodotdev/lingo.dev/commit/d913c20fdf0086741c8b50fd4ddfb38eae304a24) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - parallel processing

## 0.33.1

### Patch Changes

- [#778](https://github.com/lingodotdev/lingo.dev/pull/778) [`3f2aba9`](https://github.com/lingodotdev/lingo.dev/commit/3f2aba9c1d5834faf89a26194f1f3d9f9b878d40) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add ignoredKeys

## 0.33.0

### Minor Changes

- [#759](https://github.com/lingodotdev/lingo.dev/pull/759) [`9aa7004`](https://github.com/lingodotdev/lingo.dev/commit/9aa700491446865dc131b80419f681132b888652) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Enhance TypeScript loader to support nested fields and arrays

## 0.32.0

### Minor Changes

- [#757](https://github.com/lingodotdev/lingo.dev/pull/757) [`5170449`](https://github.com/lingodotdev/lingo.dev/commit/517044905dfc682d6a5fa95b0605b8715e2b72c7) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add TypeScript loader for .ts files that extracts string literals from default exports

## 0.31.0

### Minor Changes

- [#700](https://github.com/lingodotdev/lingo.dev/pull/700) [`c5ccf81`](https://github.com/lingodotdev/lingo.dev/commit/c5ccf81e9c2bd27bae332306da2a41e41bbeb87d) Thanks [@devin-ai-integration](https://github.com/apps/devin-ai-integration)! - Add support for locked patterns in MDX loader

  This change adds support for preserving specific patterns in MDX files during translation, including:

  - !params syntax for parameter documentation
  - !! parameter_name headings
  - !type declarations
  - !required flags
  - !values lists

  The implementation adds a new config version 1.7 with a "lockedPatterns" field that accepts an array of regex patterns to be preserved during translation.

## 0.30.3

### Patch Changes

- [#649](https://github.com/lingodotdev/lingo.dev/pull/649) [`409018d`](https://github.com/lingodotdev/lingo.dev/commit/409018de74614a1fd99363c6749b0e4be9e1a278) Thanks [@mathio](https://github.com/mathio)! - refactor dependencies

## 0.30.2

### Patch Changes

- [#647](https://github.com/lingodotdev/lingo.dev/pull/647) [`235b6d9`](https://github.com/lingodotdev/lingo.dev/commit/235b6d914c5f542ee5f1a8a88085cfd9dea5409e) Thanks [@mathio](https://github.com/mathio)! - update vitest

## 0.30.1

### Patch Changes

- [#645](https://github.com/lingodotdev/lingo.dev/pull/645) [`d824b10`](https://github.com/lingodotdev/lingo.dev/commit/d824b106631f45fc428cf01f733aab4842b4fa81) Thanks [@mathio](https://github.com/mathio)! - update dependencies

## 0.30.0

### Minor Changes

- [#631](https://github.com/lingodotdev/lingo.dev/pull/631) [`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - double formatting for mdx

- [#631](https://github.com/lingodotdev/lingo.dev/pull/631) [`82efe61`](https://github.com/lingodotdev/lingo.dev/commit/82efe6176db12cc7c5bbeb84f38bc3261f9eec4f) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - advanced mdx support (shout out to @ZYJLiu!)

## 0.29.0

### Minor Changes

- [#629](https://github.com/lingodotdev/lingo.dev/pull/629) [`58f3959`](https://github.com/lingodotdev/lingo.dev/commit/58f39599b3b765ad807e725b4089a5e9b11a01b2) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - advanced mdx support (shout out to @ZYJLiu!)

## 0.28.0

### Minor Changes

- [#627](https://github.com/lingodotdev/lingo.dev/pull/627) [`fe922a4`](https://github.com/lingodotdev/lingo.dev/commit/fe922a469c2d5dac23a909a4fb67a6efd56d80d6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add support for json/yaml key locking

## 0.27.0

### Minor Changes

- [#614](https://github.com/lingodotdev/lingo.dev/pull/614) [`2495afd`](https://github.com/lingodotdev/lingo.dev/commit/2495afd69e23700f96e19e5bbf74e393b29c2033) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add basic translators

### Patch Changes

- [#616](https://github.com/lingodotdev/lingo.dev/pull/616) [`516a79c`](https://github.com/lingodotdev/lingo.dev/commit/516a79c75501c5960ae944379f38591806ca43e2) Thanks [@mathio](https://github.com/mathio)! - po files --frozen flag

- [`2cc6114`](https://github.com/lingodotdev/lingo.dev/commit/2cc61140fccc69ab73d40c7802a2d0e018889475) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add Welsh language support

## 0.26.6

### Patch Changes

- [#605](https://github.com/lingodotdev/lingo.dev/pull/605) [`1dbbfd2`](https://github.com/lingodotdev/lingo.dev/commit/1dbbfd2ed9f5a7e0479dc83f700fb68ee5347a18) Thanks [@mathio](https://github.com/mathio)! - inject locale

## 0.26.5

### Patch Changes

- [#596](https://github.com/lingodotdev/lingo.dev/pull/596) [`61b487e`](https://github.com/lingodotdev/lingo.dev/commit/61b487e1e059328a32c3cdf673255d9d2cd480d9) Thanks [@vrcprl](https://github.com/vrcprl)! - add new locale

## 0.26.4

### Patch Changes

- [#584](https://github.com/lingodotdev/lingo.dev/pull/584) [`743d93e`](https://github.com/lingodotdev/lingo.dev/commit/743d93e554841bbd96d23682d8aec63cb4eb3ec8) Thanks [@khalatevarun](https://github.com/khalatevarun)! - Add unit test for utility function in locales.ts

## 0.26.3

### Patch Changes

- [#553](https://github.com/lingodotdev/lingo.dev/pull/553) [`95023f2`](https://github.com/lingodotdev/lingo.dev/commit/95023f2c8da3958e8582628a22bf40674f8d2317) Thanks [@vrcprl](https://github.com/vrcprl)! - Add new locales

## 0.26.2

### Patch Changes

- [#546](https://github.com/lingodotdev/lingo.dev/pull/546) [`9089b08`](https://github.com/lingodotdev/lingo.dev/commit/9089b085b968ff3195866e377ecf3016aa06f959) Thanks [@mathio](https://github.com/mathio)! - add helper method to spec

## 0.26.1

### Patch Changes

- [`0b48be1`](https://github.com/lingodotdev/lingo.dev/commit/0b48be197e88dac581cc4f257789a04b43acf932) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add Kinyarwanda and Kiswahili

## 0.26.0

### Minor Changes

- [#530](https://github.com/lingodotdev/lingo.dev/pull/530) [`bafa755`](https://github.com/lingodotdev/lingo.dev/commit/bafa755d9681e93741462eb7bcf9b85073d20fd7) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add Kazakh (Kazakhstan) locale (localization engine passed the benchmarks!)

## 0.25.3

### Patch Changes

- [#518](https://github.com/lingodotdev/lingo.dev/pull/518) [`444a731`](https://github.com/lingodotdev/lingo.dev/commit/444a7319a1351e22e5666504169023b4c8a29d5f) Thanks [@mathio](https://github.com/mathio)! - support JSON messages in <i18n> block of .vue files

## 0.25.2

### Patch Changes

- [#498](https://github.com/lingodotdev/lingo.dev/pull/498) [`ec2902e`](https://github.com/lingodotdev/lingo.dev/commit/ec2902e5dc31fd79cc3b6fbf478ed1f3c4df0345) Thanks [@mathio](https://github.com/mathio)! - build json schema for config

## 0.25.1

### Patch Changes

- [#496](https://github.com/lingodotdev/lingo.dev/pull/496) [`beb0541`](https://github.com/lingodotdev/lingo.dev/commit/beb05411ee459461e05801a763b1fa28d288e04e) Thanks [@mathio](https://github.com/mathio)! - po files

## 0.25.0

### Minor Changes

- [#485](https://github.com/lingodotdev/lingo.dev/pull/485) [`a096300`](https://github.com/lingodotdev/lingo.dev/commit/a0963008ea2a8bbc910b0eaeb20f4e3b3cd641a7) Thanks [@mathio](https://github.com/mathio)! - add support for php buckets

## 0.24.4

### Patch Changes

- [#473](https://github.com/lingodotdev/lingo.dev/pull/473) [`3a99763`](https://github.com/lingodotdev/lingo.dev/commit/3a99763087512ba82955303d6f0567e813f4fa05) Thanks [@vrcprl](https://github.com/vrcprl)! - add new locales

## 0.24.3

### Patch Changes

- [`dc8bfc7`](https://github.com/lingodotdev/lingo.dev/commit/dc8bfc7ddc38ade768b8aa11c56669db7eb446e6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - publish deps

## 0.24.2

### Patch Changes

- [`6281dbd`](https://github.com/lingodotdev/lingo.dev/commit/6281dbd96bd5cfe54f194a6a1d055c8255a250de) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - fix sdk/spec exported types

## 0.24.1

### Patch Changes

- [#419](https://github.com/lingodotdev/lingo.dev/pull/419) [`a45feb1`](https://github.com/lingodotdev/lingo.dev/commit/a45feb1d747f8fa32c42c1726953a04c174e754a) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Replexica is now Lingo.dev! 🎉

## 0.24.0

### Minor Changes

- [`003344f`](https://github.com/lingodotdev/lingo.dev/commit/003344ffcca98a391a298707f18476971c4d4c2b) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add locale delimiter override

## 0.23.0

### Minor Changes

- [#390](https://github.com/lingodotdev/lingo.dev/pull/390) [`a2ada16`](https://github.com/lingodotdev/lingo.dev/commit/a2ada16ecf4cd559d3486f0e4756d58808194f7e) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add explicit regional flag support

## 0.22.1

### Patch Changes

- [#371](https://github.com/lingodotdev/lingo.dev/pull/371) [`e6521b8`](https://github.com/lingodotdev/lingo.dev/commit/e6521b86637c254c011aba89a3558802c04ab3ca) Thanks [@mathio](https://github.com/mathio)! - support underscore in locale code

## 0.22.0

### Minor Changes

- [#356](https://github.com/lingodotdev/lingo.dev/pull/356) [`cff3c4e`](https://github.com/lingodotdev/lingo.dev/commit/cff3c4eb1a40f82a9c4c095e49cfd9fce053b048) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add dato support

## 0.21.1

### Patch Changes

- [`58d7b35`](https://github.com/lingodotdev/lingo.dev/commit/58d7b3567e51cc3ef0fad0288c13451381b95a98) Thanks [@vrcprl](https://github.com/vrcprl)! - Added Telugu (India) locale

## 0.21.0

### Minor Changes

- [#327](https://github.com/lingodotdev/lingo.dev/pull/327) [`3ab5de6`](https://github.com/lingodotdev/lingo.dev/commit/3ab5de66d8a913297b46095c2e73823124cc8c5b) Thanks [@partik03](https://github.com/partik03)! - added support for xliff loader

### Patch Changes

- [`9cf5299`](https://github.com/lingodotdev/lingo.dev/commit/9cf5299f7efbef70fd83f95177eac49b4d8f8007) Thanks [@vrcprl](https://github.com/vrcprl)! - Add Tagalog

## 0.20.0

### Minor Changes

- [`1556977`](https://github.com/lingodotdev/lingo.dev/commit/1556977332a6f949100283bfa8c9a9ff5e74b156) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add new locales

## 0.19.0

### Minor Changes

- [`5cb3c93`](https://github.com/lingodotdev/lingo.dev/commit/5cb3c930fff6e30cff5cc2266b794f75a0db646d) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added Latin / Cyrilic modifiers for Serbian

## 0.18.0

### Minor Changes

- [#300](https://github.com/lingodotdev/lingo.dev/pull/300) [`a6b22a3`](https://github.com/lingodotdev/lingo.dev/commit/a6b22a3237f574455d8119f914d82b0b247b4151) Thanks [@partik03](https://github.com/partik03)! - implemented srt file loader and added support for srt file format in spec

## 0.17.0

### Minor Changes

- [#275](https://github.com/lingodotdev/lingo.dev/pull/275) [`091ee35`](https://github.com/lingodotdev/lingo.dev/commit/091ee353081795bf8f61c7d41483bc309c7b62ef) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add support for `.po` format

## 0.16.0

### Minor Changes

- [#268](https://github.com/lingodotdev/lingo.dev/pull/268) [`5e282d7`](https://github.com/lingodotdev/lingo.dev/commit/5e282d7ffa5ca9494aa7046a090bb7c327085a86) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - composable loaders

## 0.15.0

### Minor Changes

- [`0071cd6`](https://github.com/lingodotdev/lingo.dev/commit/0071cd66b1c868ad3898fc368390a628c5a67767) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add csv format support

## 0.14.1

### Patch Changes

- [`2859938`](https://github.com/lingodotdev/lingo.dev/commit/28599388a91bf80cea3813bb4b8999bb4df302c9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add missing locales

## 0.14.0

### Minor Changes

- [`ca9e20e`](https://github.com/lingodotdev/lingo.dev/commit/ca9e20eef9047e20d39ccf9dff74d2f6069d4676) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - .strings support

- [`2aedf3b`](https://github.com/lingodotdev/lingo.dev/commit/2aedf3bec2d9dffc7b43fc10dea0cab5742d44af) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added support for .stringsdict

- [`626082a`](https://github.com/lingodotdev/lingo.dev/commit/626082a64b88fb3b589acd950afeafe417ce5ddc) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - added Flutter .arb support

## 0.13.0

### Minor Changes

- [#181](https://github.com/lingodotdev/lingo.dev/pull/181) [`1601f70`](https://github.com/lingodotdev/lingo.dev/commit/1601f708bdf0ff1786d3bf9b19265ac5b567f740) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Added support for .properties file

## 0.12.1

### Patch Changes

- [`bc5a28c`](https://github.com/lingodotdev/lingo.dev/commit/bc5a28c3c98b619872924b5f913229ac01387524) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Fix spec imports

## 0.12.0

### Minor Changes

- [#165](https://github.com/lingodotdev/lingo.dev/pull/165) [`5c2ca37`](https://github.com/lingodotdev/lingo.dev/commit/5c2ca37114663eaeb529a027e33949ef3839549b) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Update locale code resolution logic

## 0.11.0

### Minor Changes

- [`6870fc7`](https://github.com/lingodotdev/lingo.dev/commit/6870fc758dae9d1adb641576befbd8cda61cd5ea) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Fix version number bumping in 1.2 config autoupgrade

## 0.10.0

### Minor Changes

- [`d6e6d5c`](https://github.com/lingodotdev/lingo.dev/commit/d6e6d5c24b266de3769e95545f74632e7d75c697) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add support for multisource localization to the CLI

## 0.9.0

### Minor Changes

- [#158](https://github.com/lingodotdev/lingo.dev/pull/158) [`73c9250`](https://github.com/lingodotdev/lingo.dev/commit/73c925084989ccea120cae1617ec87776c88e83e) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Configuration spec v1.1: Improved bucket config structure, to support exclusion patterns

## 0.8.0

### Minor Changes

- [`8c8e7dd`](https://github.com/lingodotdev/lingo.dev/commit/8c8e7dd4d35669d484240d643427612ecdaf73eb) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Added new locales

## 0.7.0

### Minor Changes

- [`c0be1a2`](https://github.com/lingodotdev/lingo.dev/commit/c0be1a29e3069ef2c8bdc4e4f52d2fb17abdb1f5) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Replaced `replexica config` with `replexica show config`. Added `replexica show locale sources` and `replexica show locale targets`.

## 0.6.0

### Minor Changes

- [`10252ce`](https://github.com/lingodotdev/lingo.dev/commit/10252ceaa2685cc23f4dbeb6ac985cc2148853e2) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Add android support

## 0.5.1

### Patch Changes

- [`088de18`](https://github.com/lingodotdev/lingo.dev/commit/088de18a53f45fa8df5833fe81ed96a2ed231299) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Fix @replexica/config reference

## 0.5.0

### Minor Changes

- [#99](https://github.com/lingodotdev/lingo.dev/pull/99) [`4e94058`](https://github.com/lingodotdev/lingo.dev/commit/4e940582ea8ebe5a058b76fb33420729f7bfdcef) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - Added support for i18n lockfiles to improve AI localization performance.

## 0.4.1

### Patch Changes

- [#94](https://github.com/lingodotdev/lingo.dev/pull/94) [`abab45c`](https://github.com/lingodotdev/lingo.dev/commit/abab45cc91675f507499bf84350b080cd647c464) Thanks [@vrcprl](https://github.com/vrcprl)! - Locales mapping (ex. en -> en-US)

## 0.4.0

### Minor Changes

- [#87](https://github.com/lingodotdev/lingo.dev/pull/87) [`07657c6`](https://github.com/lingodotdev/lingo.dev/commit/07657c611306797d605718e13ce6b2c920a5a94e) Thanks [@vrcprl](https://github.com/vrcprl)! - added new core locales : ja de pt it ru uk hi zh ko tr ar and source locales yue pl sk th

## 0.3.0

### Minor Changes

- [`830d4a4`](https://github.com/lingodotdev/lingo.dev/commit/830d4a441c4d1177c9356756a9e9afc170a386d6) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - add support for shyriiwook language

## 0.2.0

### Minor Changes

- [#76](https://github.com/lingodotdev/lingo.dev/pull/76) [`69d487c`](https://github.com/lingodotdev/lingo.dev/commit/69d487c0b4c8e22f9c86867ebf6cc55ea2875dbf) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - enable french, catalan in source/target mode, and czech in source-only mode

## 0.1.0

### Minor Changes

- [#73](https://github.com/lingodotdev/lingo.dev/pull/73) [`94ab265`](https://github.com/lingodotdev/lingo.dev/commit/94ab26551577b5dfab629ffee3c82e59b56ce25d) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - intro a `@replexica/spec` package containing common definitions, constants, schemas, and types

- [#75](https://github.com/lingodotdev/lingo.dev/pull/75) [`b11b48e`](https://github.com/lingodotdev/lingo.dev/commit/b11b48e7c3ab05dd8de0ddcfe5cb4589786abbf9) Thanks [@maxprilutskiy](https://github.com/maxprilutskiy)! - framework-agnostic i18n support
