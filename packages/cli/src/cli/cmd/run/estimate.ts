import chalk from "chalk";
import { Listr } from "listr2";

import { colors } from "../../constants";
import { CmdRunContext } from "./_types";
import { commonTaskRendererOptions } from "./_const";
import { createDeltaProcessor } from "../../utils/delta";
import { computeProcessableData, createLoaderForTask } from "./_utils";

/**
 * Translatable characters of a task's processable data: the sum of leaf
 * string-value lengths — keys, markup and serialization syntax excluded.
 * Matches how the server-side estimate counts characters.
 */
export function countTranslatableChars(
  processableData: Record<string, any>,
): number {
  return Object.values(processableData).reduce(
    (sum, value) => (typeof value === "string" ? sum + value.length : sum),
    0,
  );
}

const formatUsd = (value: number) =>
  value < 0.01 && value > 0 ? "<$0.01" : `$${value.toFixed(2)}`;

/**
 * `run --estimate`: compute the same per-task translation delta as execute,
 * but instead of translating, send per-locale character counts to
 * `/process/estimate` and print the approximate cost. Nothing is translated,
 * written, or billed; lockfile and target files stay untouched.
 */
export default async function estimate(
  input: CmdRunContext,
): Promise<CmdRunContext> {
  console.log(chalk.hex(colors.orange)("[Estimate]"));

  if (!input.localizer?.estimate) {
    throw new Error(
      `Cost estimate is not available for the "${input.localizer?.id}" provider. ` +
        `Estimates use Lingo.dev server-side pricing — remove --estimate or switch to the Lingo.dev provider.`,
    );
  }

  const charsByLocale = new Map<string, number>();

  return new Listr<CmdRunContext>(
    [
      {
        title: "Computing translation delta",
        task: async (ctx, task) => {
          if (!ctx.tasks.length) {
            task.title = "Nothing to estimate — everything is up to date.";
            return;
          }

          for (const runTask of ctx.tasks) {
            const bucketLoader = createLoaderForTask(runTask);
            const deltaProcessor = createDeltaProcessor(
              runTask.bucketPathPattern,
            );
            const checksums = await deltaProcessor.loadChecksums();
            const sourceData = await bucketLoader.pull(runTask.sourceLocale);
            const targetData = await bucketLoader.pull(runTask.targetLocale);
            const delta = await deltaProcessor.calculateDelta({
              sourceData,
              targetData,
              checksums,
            });
            const processableData = computeProcessableData(
              sourceData,
              delta,
              ctx.flags.force,
              runTask.onlyKeys,
            );

            const chars = countTranslatableChars(processableData);
            charsByLocale.set(
              runTask.targetLocale,
              (charsByLocale.get(runTask.targetLocale) ?? 0) + chars,
            );
          }

          task.title = `Delta computed for ${chalk.hex(colors.yellow)(
            ctx.tasks.length.toString(),
          )} task(s)`;
        },
      },
      {
        title: "Fetching cost estimate",
        rendererOptions: { persistentOutput: true },
        task: async (ctx, task) => {
          const items = [...charsByLocale.entries()].map(
            ([targetLocale, sourceChars]) => ({ targetLocale, sourceChars }),
          );

          if (!items.length || items.every((item) => !item.sourceChars)) {
            task.title = "Estimated cost: $0.00 — nothing needs translation.";
            return;
          }

          const result = await ctx.localizer!.estimate!(items);

          const lines = result.byLocale.map(
            (row) =>
              `  ${chalk.hex(colors.yellow)(row.targetLocale)}: ~${formatUsd(
                row.estimatedCostUsd,
              )} ${chalk.dim(
                `(${row.sourceChars.toLocaleString("en-US")} chars, ~${row.estimatedOutputTokens.toLocaleString("en-US")} tokens)`,
              )}`,
          );

          task.title = `Estimated cost: ~${chalk.hex(colors.green)(
            formatUsd(result.totals.estimatedTotalCostUsd),
          )} ${chalk.dim("(estimate, not a quote — nothing was translated)")}`;
          task.output = lines.join("\n");
        },
      },
    ],
    {
      exitOnError: true,
      rendererOptions: commonTaskRendererOptions,
    },
  ).run(input);
}
