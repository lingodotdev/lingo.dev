import { CmdRunContext } from "./_types";
import { WatchManager } from "./watch/manager";

/**
 * Main watch function - now uses the enhanced WatchManager
 * This maintains backward compatibility while using the new modular architecture
 */
export default async function watch(ctx: CmdRunContext) {
  const watchManager = new WatchManager();

  try {
    await watchManager.start(ctx);

    // Keep the process alive - shutdown is handled by signal handlers
    console.log("Press Ctrl+C to stop watching...");

    // Keep the process alive indefinitely
    await new Promise(() => {}); // This will never resolve, keeping process alive
  } catch (error) {
    console.error("Watch mode failed:", error);
    throw error;
  }
}
