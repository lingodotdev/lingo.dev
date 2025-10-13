Goal: Add an equivalent `--frozen` flag to the `run` command with behavior matching the `i18n` command.

Implementation Plan

1) Add CLI flag
- Update `src/cli/cmd/run/index.ts` to define `--frozen` with this description: `Validate translations are up-to-date without making changes - fails if source files, target files, or lockfile are out of sync. Ideal for CI/CD to ensure translation consistency before deployment`.

2) Add frozen validation step
- Create `src/cli/cmd/run/frozen.ts` exporting `async function frozen(ctx: CmdRunContext): Promise<void>` that runs a `Listr` pipeline with two tasks:
  - Ensure lockfile exists:
    - Compute buckets with `getBuckets(ctx.config!)`, apply `ctx.flags.bucket` and `ctx.flags.file` filtering consistent with `plan.ts` (substring or `minimatch` on `bucketPath.pathPattern`).
    - Determine locales: `_sourceLocale = ctx.flags.sourceLocale || ctx.config!.locale.source` and `_targetLocales = ctx.flags.targetLocale || ctx.config!.locale.targets`.
    - If `createDeltaProcessor("").checkIfLockExists()` returns false, for each filtered bucket path:
      - Build a loader via `createBucketLoader(bucket.type, bucketPath.pathPattern, { defaultLocale: resolveOverriddenLocale(_sourceLocale, bucketPath.delimiter), injectLocale: bucket.injectLocale, formatter: ctx.config!.formatter }, bucket.lockedKeys, bucket.lockedPatterns, bucket.ignoredKeys)`.
      - `await loader.init()`; `const sourceData = await loader.pull(_sourceLocale)`.
      - `const delta = createDeltaProcessor(bucketPath.pathPattern)`; `await delta.saveChecksums(await delta.createChecksums(sourceData))`.
  - Validate frozen state (enabled when `ctx.flags.frozen` is true):
    - For each filtered bucket path:
      - Build a loader via `createBucketLoader(..., { defaultLocale: resolveOverriddenLocale(_sourceLocale, bucketPath.delimiter), returnUnlocalizableKeys: true, injectLocale: bucket.injectLocale }, bucket.lockedKeys)`.
      - `await loader.init()`.
      - Pull source: `const { unlocalizable: srcUnlocalizable, ...src } = await loader.pull(_sourceLocale)`.
      - Compare current checksums to saved checksums: if any key differs, throw `new Error("Localization data has changed; please update i18n.lock or run without --frozen. Details: Source file has been updated.")`.
      - For each target locale in `_targetLocales`, resolve with `resolveOverriddenLocale` and pull target: `const { unlocalizable: tgtUnlocalizable, ...tgt } = await loader.pull(targetLocale)`.
      - If any keys are missing in `tgt` compared to `src`, throw with details `Target file is missing translations.`
      - If any extra keys exist in `tgt` not present in `src`, throw with details `Target file has extra translations not present in the source file.`
      - If `!_.isEqual(srcUnlocalizable, tgtUnlocalizable)`, throw with details `Unlocalizable data (such as booleans, dates, URLs, etc.) do not match.`
    - If no mismatches are found, complete successfully.

3) Wire the step into run
- In `src/cli/cmd/run/index.ts`, call `await frozen(ctx);` immediately after `await plan(ctx);` and before `await execute(ctx);`.

Notes
- Use `resolveOverriddenLocale` exactly as in `plan.ts` for both source and target locales per bucket path delimiter.
- Use `returnUnlocalizableKeys: true` only for the validation loader.
- Do not change any other behaviors, including lockfile saving semantics in `execute.ts` and existing task planning, concurrency, or summary output.

