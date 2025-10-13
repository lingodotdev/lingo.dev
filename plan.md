Add `--interactive` to `run` with parity to `i18n`

- Add CLI flag and help text
  - File: `packages/cli/src/cli/cmd/run/index.ts`
  - Add `.option("--interactive", "Review and edit AI-generated translations interactively before applying changes to files")` next to other flags.

- Reuse the `i18n` review flow without duplication
  - Extract the `reviewChanges` helper from `packages/cli/src/cli/cmd/i18n.ts` into a new module: `packages/cli/src/cli/utils/review.ts`.
  - Export a single function `reviewChanges({ pathPattern, targetLocale, currentData, proposedData, sourceData, force }): Promise<Record<string, any>>`.
  - Replace the in-file implementation in `i18n.ts` with an import from `../utils/review`.

- Integrate interactive review in `run` execution
  - File: `packages/cli/src/cli/cmd/run/execute.ts`
  - Set `effectiveConcurrency` to `1` when `ctx.flags.interactive` is `true` to avoid overlapping prompts and ensure a clean TTY.
  - In the localization progress callback, skip writing partial chunks when `ctx.flags.interactive` is `true` and continue updating the task title only.
  - After `localizer.localize(...)` returns, compute the merged and renamed `finalTargetData` exactly like `i18n`.
  - Call `reviewChanges(...)` with `pathPattern`, `targetLocale`, `currentData`, `proposedData`, `sourceData`, and `force`. Wrap this call in the existing `ioLimiter` to serialize user interaction.
  - Push the returned data to the bucket and continue checksum handling exactly as in the non-interactive branch.

- Keep behavior aligned with `i18n`
  - Preserve delta-based key renaming and checksum saving semantics.
  - Preserve task result status updates and summary rendering.

- Validation
  - Run `lingo.dev run --interactive` on a small project and confirm: no partial writes before approval, diffs show correctly, approve/skip/edit flows work, and files update only after approval.
