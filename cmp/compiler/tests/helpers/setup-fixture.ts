import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { exec, spawn, ChildProcess } from "child_process";
import { promisify } from "util";
import { verifyFixtureIntegrity } from "./fixture-integrity.js";
import * as os from "node:os";

const execAsync = promisify(exec);

// Track active fixtures for cleanup
const activeFixtures = new Set<TestFixture>();

// Global cleanup handler
function setupGlobalCleanup() {
  let cleanupInProgress = false;

  const cleanup = async () => {
    if (cleanupInProgress) return;
    cleanupInProgress = true;

    console.log("\n🧹 Cleaning up all test fixtures...");
    const fixtures = Array.from(activeFixtures);
    await Promise.all(
      fixtures.map((fixture) =>
        fixture.clean().catch((e) => console.error("Cleanup error:", e)),
      ),
    );
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("beforeExit", cleanup);
}

// Call once when module loads
setupGlobalCleanup();

// Helper to kill process tree (cross-platform)
function killProcessTree(proc: ChildProcess): void {
  if (!proc.pid) return;

  if (process.platform === "win32") {
    // Windows: use taskkill to kill process tree
    try {
      execAsync(`taskkill /pid ${proc.pid} /T /F`).catch(() => {
        // Process might already be dead
      });
    } catch (e) {
      // Ignore errors
    }
  } else {
    // Unix: kill process group
    try {
      process.kill(-proc.pid, "SIGTERM");
      setTimeout(() => {
        try {
          process.kill(-proc.pid, "SIGKILL");
        } catch (e) {
          // Already dead
        }
      }, 2000);
    } catch (e) {
      // Fallback to killing just the process
      proc.kill("SIGTERM");
      setTimeout(() => {
        if (!proc.killed) {
          proc.kill("SIGKILL");
        }
      }, 2000);
    }
  }
}

export type Framework = "next" | "vite";

export interface TestFixtureOptions {
  framework: Framework;
  config?: any;
  bundleInitialLocale?: boolean;
}

export interface DevServer {
  port: number;
  stop: () => Promise<void>;
}

export interface ProdServer {
  port: number;
  stop: () => Promise<void>;
}

export type CleanupCallback = () => Promise<void> | void;

export interface TestFixture {
  framework: Framework;
  path: (p: string) => string;
  startDev: () => Promise<DevServer>;
  build: () => Promise<string>;
  startProduction: () => Promise<ProdServer>;
  clean: () => Promise<void>;
  updateFile: (
    filePath: string,
    updater: (content: string) => string,
  ) => Promise<void>;
  createFile: (filePath: string, content: string) => Promise<void>;
  registerCleanup: (callback: CleanupCallback) => void;
  runCleanups: () => Promise<void>;
}

export async function setupFixture(
  options: TestFixtureOptions,
): Promise<TestFixture> {
  const { framework } = options;

  const fixturePath = path.join(process.cwd(), "tests", "fixtures", framework);
  if (!fsSync.existsSync(fixturePath)) {
    throw new Error(
      `Fixture for ${framework} not found. Run "pnpm test:prepare" first.`,
    );
  }

  const { valid, errors } = await verifyFixtureIntegrity(fixturePath);
  if (!valid) {
    console.error(`❌ Fixture integrity check failed for ${framework}:`);
    errors.forEach((error) => console.error(`  - ${error}`));
    throw new Error(
      `Fixture integrity check failed. Please run "pnpm test:prepare" to recreate fixtures.`,
    );
  }
  console.log(
    `Setting up ${framework} test from prepared fixture at ${fixturePath}`,
  );
  console.log(`✅ Fixture ready (using prepared node_modules)`);

  // Apply custom config if provided
  if (options.config) {
    await updateConfig(fixturePath, framework, options.config);
  }

  // Cleanup callbacks stack (LIFO order - last registered runs first)
  const cleanupCallbacks: CleanupCallback[] = [];

  const fixture: TestFixture = {
    framework,
    path: (p: string) => path.join(fixturePath, p),

    async startDev(): Promise<DevServer> {
      // Both Next.js and Vite are configured to use port 3000 in the demo apps
      const port = 3000;

      console.log(`Starting dev server for ${framework} on port ${port}...`);
      const isWindows = os.platform() === "win32";
      const devProcess = spawn(isWindows ? "pnpm.cmd" : "pnpm", ["dev"], {
        cwd: fixturePath,
        stdio: "pipe",
        shell: isWindows,
        detached: !isWindows, // Use process groups on Unix
      });

      let startupError: Error | null = null;

      devProcess.on("error", (error) => {
        console.error(`[${framework} dev] Process error:`, error);
        startupError = error;
      });

      devProcess.on("exit", (code, signal) => {
        if (code !== 0 && code !== null) {
          console.error(`[${framework} dev] Process exited with code ${code}`);
        }
      });

      // Capture output for debugging
      devProcess.stdout?.on("data", (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[${framework} dev]: ${output}`);
        }
      });

      devProcess.stderr?.on("data", (data) => {
        const output = data.toString().trim();
        if (output) {
          console.error(`[${framework} dev error]: ${output}`);
        }
      });

      // Wait for server to be ready
      try {
        await waitForPort(port, 60000);
      } catch (error) {
        killProcessTree(devProcess);
        if (startupError) {
          throw new Error(
            `Dev server failed to start: ${startupError.message}`,
          );
        }
        throw error;
      }

      return {
        port,
        stop: async () => {
          console.log(`Stopping dev server for ${framework}...`);
          return new Promise<void>((resolve) => {
            devProcess.once("exit", () => {
              console.log(`Dev server stopped for ${framework}`);
              resolve();
            });

            killProcessTree(devProcess);

            // Force resolve after timeout
            setTimeout(() => {
              resolve();
            }, 5000);
          });
        },
      };
    },

    async build(): Promise<string> {
      console.log(`Building ${framework}...`);
      try {
        const result = await execAsync("pnpm build", {
          cwd: fixturePath,
          timeout: 120000,
        });
        console.log(`✅ Build completed for ${framework}`);
        return result.stdout + result.stderr;
      } catch (error: any) {
        console.error(
          `❌ Build failed for ${framework}:`,
          error.stdout,
          error.stderr,
        );
        throw error;
      }
    },

    async startProduction(): Promise<ProdServer> {
      const port = framework === "next" ? 3000 : 4173;

      console.log(`Starting production server for ${framework}...`);

      const isWindows = os.platform() === "win32";
      const prodProcess = spawn(isWindows ? "pnpm.cmd" : "pnpm", ["start"], {
        cwd: fixturePath,
        stdio: "pipe",
        shell: isWindows,
        detached: !isWindows,
      });

      let startupError: Error | null = null;

      prodProcess.on("error", (error) => {
        console.error(`[${framework} prod] Process error:`, error);
        startupError = error;
      });

      prodProcess.on("exit", (code, signal) => {
        if (code !== 0 && code !== null) {
          console.error(`[${framework} prod] Process exited with code ${code}`);
        }
      });

      // Capture output for debugging
      prodProcess.stdout?.on("data", (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[${framework} prod]: ${output}`);
        }
      });

      prodProcess.stderr?.on("data", (data) => {
        const output = data.toString().trim();
        if (output) {
          console.error(`[${framework} prod error]: ${output}`);
        }
      });

      try {
        await waitForPort(port, 60000);
      } catch (error) {
        killProcessTree(prodProcess);
        if (startupError) {
          throw new Error(
            `Production server failed to start: ${startupError.message}`,
          );
        }
        throw error;
      }

      return {
        port,
        stop: async () => {
          console.log(`Stopping production server for ${framework}...`);
          return new Promise<void>((resolve) => {
            prodProcess.once("exit", () => {
              console.log(`Production server stopped for ${framework}`);
              resolve();
            });

            killProcessTree(prodProcess);

            // Force resolve after timeout
            setTimeout(() => {
              resolve();
            }, 5000);
          });
        },
      };
    },

    async clean(): Promise<void> {
      console.log(`Cleaning up fixture at ${fixturePath}...`);
      await this.runCleanups();
      activeFixtures.delete(fixture);
    },

    async updateFile(
      filePath: string,
      updater: (content: string) => string,
    ): Promise<void> {
      const fullPath = path.join(fixturePath, filePath);

      // Read original content before modifying
      const originalContent = await fs.readFile(fullPath, "utf-8");

      // Register cleanup to restore file to original state
      fixture.registerCleanup(async () => {
        await fs.writeFile(fullPath, originalContent);
        console.log(`  🔄 Restored ${filePath} to original state`);
      });

      // Apply the update
      const updatedContent = updater(originalContent);
      await fs.writeFile(fullPath, updatedContent);
    },

    async createFile(filePath: string, content: string): Promise<void> {
      const fullPath = path.join(fixturePath, filePath);

      // Register cleanup to delete created file
      fixture.registerCleanup(async () => {
        if (fsSync.existsSync(fullPath)) {
          await fs.unlink(fullPath);
          console.log(`  🗑️  Deleted ${filePath}`);
        }
      });

      // Create the file
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, content);
    },

    registerCleanup(callback: CleanupCallback): void {
      cleanupCallbacks.push(callback);
    },

    async runCleanups(): Promise<void> {
      // Run cleanups in reverse order (LIFO)
      while (cleanupCallbacks.length > 0) {
        const callback = cleanupCallbacks.pop();
        if (callback) {
          try {
            await callback();
          } catch (error) {
            console.error("Cleanup callback failed:", error);
          }
        }
      }
    },
  };

  activeFixtures.add(fixture);

  return fixture;
}

async function waitForPort(port: number, timeout = 60000): Promise<void> {
  const startTime = Date.now();
  let lastError: Error | null = null;

  console.log(`Waiting for port ${port} to be ready...`);

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(`http://localhost:${port}`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout per request
      });

      // Accept any response (200, 404, etc) as "ready"
      console.log(`✅ Port ${port} is ready (status: ${response.status})`);
      return;
    } catch (e: any) {
      lastError = e;
      // Only log occasionally to avoid spam
      if ((Date.now() - startTime) % 5000 < 500) {
        console.log(
          `  Still waiting for port ${port}... (${Math.floor((Date.now() - startTime) / 1000)}s)`,
        );
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Port ${port} did not become available within ${timeout}ms. Last error: ${lastError?.message}`,
  );
}

async function updateConfig(
  tempPath: string,
  framework: Framework,
  config: any,
): Promise<void> {
  if (framework === "next") {
    const configPath = path.join(tempPath, "next.config.ts");
    // For now, just log that we would update the config
    console.log(`Would update Next.js config with:`, config);
    // TODO: Implement config merging
  } else {
    const configPath = path.join(tempPath, "vite.config.ts");
    console.log(`Would update Vite config with:`, config);
    // TODO: Implement config merging
  }
}

/**
 * Find the translation server port by checking common ports
 */
export async function findTranslationServerPort(): Promise<number | null> {
  // Translation server typically starts at port 60000 and increments
  for (let port = 60000; port < 60010; port++) {
    try {
      const response = await fetch(`http://localhost:${port}/health`, {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        return port;
      }
    } catch (e) {
      // Port not available
    }
  }
  return null;
}
