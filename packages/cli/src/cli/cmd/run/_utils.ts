import { CmdRunContext } from "./_types";

/**
 * Determines the user's email for tracking purposes.
 * Returns null if using BYOK mode or if authentication fails.
 */
export async function determineEmail(
  ctx: CmdRunContext,
): Promise<string | null> {
  const isByokMode = !!ctx.config?.provider;

  if (isByokMode) {
    return null;
  } else {
    try {
      const authStatus = await ctx.localizer?.checkAuth();
      return authStatus?.username || null;
    } catch {
      return null;
    }
  }
}
