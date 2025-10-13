Title: Add `--strict` to `run` with fail-fast behavior matching `i18n`

Objective
- Implement a `--strict` flag for the `run` command that stops processing immediately on the first error, mirroring the `i18n` command’s fail-fast behavior.

Scope
- `packages/cli/src/cli/cmd/run/index.ts`
- `packages/cli/src/cli/cmd/run/execute.ts`
- Verification only, no changes required in `packages/cli/src/cli/cmd/run/_types.ts:46`.

Implementation Steps
1) Expose CLI flag in `packages/cli/src/cli/cmd/run/index.ts:60`:
   - Add `.option("--strict", "Stop immediately on first error instead of continuing to process remaining buckets and locales (fail-fast mode)")` alongside the other flags.

2) Enforce fail-fast execution in `packages/cli/src/cli/cmd/run/execute.ts`:
   - Top-level Listr: set `exitOnError` to `true` when `input.flags.strict` is `true`.
   - Worker sub-Listr: set `exitOnError` to `true` when `ctx.flags.strict` is `true`.
   - In `createWorkerTask` error handling, rethrow on error when `args.ctx.flags.strict` is `true`; otherwise, return the `{ status: "error", ... }` result so non-strict runs continue.

3) Types validation
   - No change required; `packages/cli/src/cli/cmd/run/_types.ts:46` already defines `strict: z.boolean().optional()` and is consumed via `flagsSchema.parse(args)`.

Behavioral Guarantees
- With `--strict`, the first task error aborts the pipeline immediately and returns a non-zero exit code.
- Without `--strict`, the pipeline continues processing remaining tasks and reports a per-task summary including errors and successes.
- Watch mode continues to observe files. Each triggered run honors `--strict` for that run and resumes watching afterward.

Rationale From `i18n` Review
- `packages/cli/src/cli/cmd/i18n.ts:522` and `packages/cli/src/cli/cmd/i18n.ts:548` throw on errors when `flags.strict` is `true` and otherwise continue while tracking errors. The above changes apply the same semantics to the `run` pipeline, which executes tasks concurrently via Listr.

