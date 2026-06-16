import _ from "lodash";
import { minimatch } from "minimatch";

import { CmdRunContext, CmdRunTask } from "./_types";
import { UserIdentity } from "../../utils/observability";
import { safeDecode } from "../../utils/key-matching";
import createBucketLoader from "../../loaders";
import { Delta } from "../../utils/delta";

export function createLoaderForTask(assignedTask: CmdRunTask) {
  const bucketLoader = createBucketLoader(
    assignedTask.bucketType,
    assignedTask.bucketPathPattern,
    {
      defaultLocale: assignedTask.sourceLocale,
      injectLocale: assignedTask.injectLocale,
      formatter: assignedTask.formatter,
      keyColumn: assignedTask.keyColumn,
    },
    assignedTask.lockedKeys,
    assignedTask.lockedPatterns,
    assignedTask.ignoredKeys,
    assignedTask.preservedKeys,
    assignedTask.localizableKeys,
  );
  bucketLoader.setDefaultLocale(assignedTask.sourceLocale);

  return bucketLoader;
}

/**
 * The subset of source entries that actually needs translation for a task:
 * delta-changed keys (or everything with --force), narrowed by --key filters.
 * Shared by execute (what gets sent to the localizer) and estimate (what
 * gets counted) so the two can never disagree on scope.
 */
export function computeProcessableData(
  sourceData: Record<string, any>,
  delta: Delta,
  force: boolean | undefined,
  onlyKeys: string[],
): Record<string, any> {
  return _.chain(sourceData)
    .entries()
    .filter(
      ([key]) =>
        delta.added.includes(key) || delta.updated.includes(key) || !!force,
    )
    .filter(
      ([key]) =>
        !onlyKeys.length ||
        onlyKeys.some((pattern) =>
          minimatch(safeDecode(key), safeDecode(pattern)),
        ),
    )
    .fromPairs()
    .value();
}

/**
 * Determines the user's identity for tracking purposes.
 * Returns null if using BYOK mode or if authentication fails.
 */
export async function determineUserIdentity(
  ctx: CmdRunContext,
): Promise<UserIdentity> {
  const isByokMode = !!ctx.config?.provider;

  if (isByokMode) {
    return null;
  } else {
    try {
      const authStatus = await ctx.localizer?.checkAuth();
      if (!authStatus?.username || !authStatus?.userId) return null;
      return {
        email: authStatus.username,
        id: authStatus.userId,
      };
    } catch {
      return null;
    }
  }
}
