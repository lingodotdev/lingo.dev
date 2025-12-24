import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import {
  generateFixtureChecksums,
  saveChecksums,
} from "./fixture-integrity.js";

const execAsync = promisify(exec);

// Helper to recursively copy directory
async function copyDir(
  src: string,
  dest: string,
  filter?: (src: string) => boolean,
): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (filter && !filter(srcPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, filter);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Prepare test fixtures by copying demo apps and installing dependencies
 * Run this once before running tests
 */
export async function prepareAllFixtures(): Promise<void> {
  const fixturesDir = path.join(process.cwd(), "tests", "fixtures");
  const demoDir = path.join(process.cwd(), "..", "..", "demo");

  console.log("Preparing test fixtures...");

  // Create fixtures directory
  await fs.mkdir(fixturesDir, { recursive: true });

  // Prepare Next.js fixture
  await prepareFixture("next", demoDir, fixturesDir);

  // Prepare Vite fixture
  await prepareFixture("vite", demoDir, fixturesDir);

  console.log("\n✅ All fixtures prepared successfully!");
  console.log("You can now run tests with: pnpm test:e2e");
}

async function prepareFixture(
  framework: "next" | "vite",
  demoDir: string,
  fixturesDir: string,
): Promise<void> {
  console.log(`\n📦 Preparing ${framework} fixture...`);

  const sourcePath = path.join(
    demoDir,
    framework === "next" ? "new-compiler-next16" : "new-compiler-vite-react-spa",
  );
  const destPath = path.join(fixturesDir, framework);

  // Remove existing fixture if it exists
  if (fsSync.existsSync(destPath)) {
    console.log(`  Removing existing ${framework} fixture...`);
    await fs.rm(destPath, { recursive: true, force: true });
  }

  // Copy demo app (excluding build artifacts and node_modules)
  console.log(`  Copying ${framework} demo app...`);
  await copyDir(sourcePath, destPath, (src: string) => {
    const name = path.basename(src);
    // Exclude build artifacts and node_modules (we'll install fresh)
    return ![".next", "dist", ".lingo", ".turbo", "node_modules"].includes(
      name,
    );
  });

  // Modify vite.config.ts to disable devtools (port conflicts in tests)
  if (framework === "vite") {
    const viteConfigPath = path.join(destPath, "vite.config.ts");
    let viteConfig = await fs.readFile(viteConfigPath, "utf-8");
    // Comment out devtools plugin
    viteConfig = viteConfig.replace(
      /devtools\(\)/g,
      "// devtools() // Disabled for e2e tests",
    );
    await fs.writeFile(viteConfigPath, viteConfig);
    console.log(`  Modified vite.config.ts to disable devtools`);
  }

  // Update package.json to use local compiler with file: reference
  console.log(`  Updating package.json to use local compiler...`);
  const packageJsonPath = path.join(destPath, "package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
  // Use current directory (compiler/) which contains package.json and build/
  const compilerRoot = process.cwd();

  // Replace workspace:* with file: path
  if (packageJson.dependencies?.["@lingo.dev/compiler"]) {
    packageJson.dependencies["@lingo.dev/compiler"] = `file:${compilerRoot}`;
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

  // Install dependencies once during preparation
  console.log(`  Installing dependencies for ${framework}...`);
  try {
    // Use --ignore-workspace to prevent pnpm from treating this as a workspace package
    await execAsync("pnpm install --no-frozen-lockfile --ignore-workspace", {
      cwd: destPath,
      timeout: 120000,
      env: { ...process.env, CI: "true" },
    });
    console.log(`  ✅ ${framework} fixture ready with dependencies installed`);
  } catch (error: any) {
    console.error(`  ❌ Failed to install dependencies:`, error.message);
    if (error.stdout) console.error(`  stdout: ${error.stdout}`);
    if (error.stderr) console.error(`  stderr: ${error.stderr}`);
    throw error;
  }

  // Generate checksums for integrity verification
  const checksums = await generateFixtureChecksums(destPath, framework);
  await saveChecksums(destPath, checksums);
  console.log(
    `  ✅ Generated checksums for ${checksums.files.length} source files`,
  );
}

// Run if executed directly
// When run via tsx, always execute (as opposed to being imported)
if (typeof process !== "undefined" && process.argv[1]) {
  // Check if this is the main module being executed
  const scriptPath = process.argv[1].replace(/\\/g, "/");
  const currentFile = import.meta.url
    .replace("file:///", "")
    .replace(/\\/g, "/");

  if (
    currentFile.endsWith(scriptPath) ||
    scriptPath.endsWith("prepare-fixtures.ts")
  ) {
    prepareAllFixtures().catch((error) => {
      console.error("Failed to prepare fixtures:", error);
      process.exit(1);
    });
  }
}
