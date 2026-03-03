import { CmdRunTask, CmdRunTaskResult } from "./_types";

export function applyRunExitCode(results: Map<CmdRunTask, CmdRunTaskResult>) {
  const hasErrors = Array.from(results.values()).some(
    (r) => r.status === "error",
  );
  if (hasErrors) {
    process.exitCode = 1;
  }
  return hasErrors;
}
