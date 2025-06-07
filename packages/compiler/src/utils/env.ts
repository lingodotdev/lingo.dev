import fs from "fs";

/**
 * Checks if the compiler is running in CI or Docker environment.
 * Returns true if either:
 * - CI environment variable is set
 * - /.dockerenv file exists (indicating Docker environment)
 */
export function isRunningInCIOrDocker(): boolean {
  return Boolean(process.env.CI) || fs.existsSync("/.dockerenv");
}
