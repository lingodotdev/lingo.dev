import { CmdRunContext } from "./_types";

/**
 * Determines the authentication ID for tracking purposes
 */
export async function determineAuthId(
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
