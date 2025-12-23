export function registerCleanupOnCurrentProcess({
  cleanup,
  asyncCleanup,
}: {
  cleanup?: () => void;
  asyncCleanup?: () => Promise<void>;
}) {
  if (asyncCleanup) {
    let shuttingDown = false;
    async function performGracefulShutdown(code: number) {
      if (shuttingDown) return;
      shuttingDown = true;

      await asyncCleanup?.();

      process.exit(code);
    }

    process.on("SIGINT", () => performGracefulShutdown(0));
    process.on("SIGTERM", () => performGracefulShutdown(143));
    process.on("SIGBREAK", () => performGracefulShutdown(0));
  }

  if (cleanup) {
    process.on("exit", () => cleanup());
  }
}
