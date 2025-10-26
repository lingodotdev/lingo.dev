const STEP_WAIT_INTERVAL = 250;
const MAX_WAIT_INTERVAL = 2000;

export function exitGracefully(elapsedMs = 0) {
  // Check if there are any pending operations
  const hasPendingOperations = checkForPendingOperations();

  if (hasPendingOperations && elapsedMs < MAX_WAIT_INTERVAL) {
    // Wait a bit longer if there are pending operations
    setTimeout(
      () => exitGracefully(elapsedMs + STEP_WAIT_INTERVAL),
      STEP_WAIT_INTERVAL,
    );
  } else {
    // Exit immediately if no pending operations
    process.exit(0);
  }
}

function checkForPendingOperations(): boolean {
  // Check for active handles and requests using internal Node.js methods
  const activeHandles = (process as any)._getActiveHandles?.() || [];
  const activeRequests = (process as any)._getActiveRequests?.() || [];

  // Filter out standard handles that are always present
  const nonStandardHandles = activeHandles.filter((handle: any) => {
    // Skip standard handles like process.stdin, process.stdout, etc.
    if (
      handle === process.stdin ||
      handle === process.stdout ||
      handle === process.stderr
    ) {
      return false;
    }
    // Skip timers that are part of the normal process
    if (
      handle &&
      typeof handle === "object" &&
      "hasRef" in handle &&
      !handle.hasRef()
    ) {
      return false;
    }
    return true;
  });

  // Check if there are any file watchers or other async operations
  const hasFileWatchers = nonStandardHandles.some(
    (handle: any) => handle && typeof handle === "object" && "close" in handle,
  );

  // Check for pending promises or async operations
  const hasPendingPromises = activeRequests.length > 0;

  return nonStandardHandles.length > 0 || hasFileWatchers || hasPendingPromises;
}
