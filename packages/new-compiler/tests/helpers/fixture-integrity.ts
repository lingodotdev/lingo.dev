import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";

export interface FileChecksum {
  path: string;
  hash: string;
}

export interface FixtureChecksums {
  framework: "next" | "vite";
  generatedAt: string;
  files: FileChecksum[];
}

/**
 * Generate SHA-256 hash for a file
 */
async function hashFile(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Recursively get all files in a directory (excluding specified patterns)
 */
async function getAllFiles(
  dir: string,
  baseDir: string,
  exclude: string[] = [],
): Promise<string[]> {
  const files: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    // Skip excluded paths
    if (exclude.some((pattern) => relativePath.includes(pattern))) {
      continue;
    }

    if (entry.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, baseDir, exclude);
      files.push(...subFiles);
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Generate checksums for all source files in a fixture
 */
export async function generateFixtureChecksums(
  fixturePath: string,
  framework: "next" | "vite",
): Promise<FixtureChecksums> {
  console.log(`  Generating checksums for ${framework} fixture...`);

  // Get all files except build artifacts, dependencies, and generated files
  const exclude = [
    "node_modules",
    ".next",
    "dist",
    ".lingo",
    ".turbo",
    "pnpm-lock.yaml",
    ".DS_Store",
    "routeTree.gen.ts", // TanStack Router generated file
  ];

  const files = await getAllFiles(fixturePath, fixturePath, exclude);

  // Generate checksums for each file
  const checksums: FileChecksum[] = [];
  for (const file of files) {
    const fullPath = path.join(fixturePath, file);
    const hash = await hashFile(fullPath);
    checksums.push({ path: file, hash });
  }

  return {
    framework,
    generatedAt: new Date().toISOString(),
    files: checksums,
  };
}

function getChecksumFilePath(fixturePath: string) {
  return path.join(fixturePath, ".lingo", "checksums.json");
}

/**
 * Save checksums to a JSON file
 */
export async function saveChecksums(
  fixturePath: string,
  checksums: FixtureChecksums,
): Promise<void> {
  const checksumsPath = getChecksumFilePath(fixturePath);
  await fs.mkdir(path.dirname(checksumsPath), { recursive: true });
  await fs.writeFile(checksumsPath, JSON.stringify(checksums, null, 2));
  console.log(`  ✅ Checksums saved to ${checksumsPath}`);
}

/**
 * Load checksums from a fixture
 */
export async function loadChecksums(
  fixturePath: string,
): Promise<FixtureChecksums> {
  const checksumsPath = getChecksumFilePath(fixturePath);
  const content = await fs.readFile(checksumsPath, "utf-8");
  return JSON.parse(content);
}

/**
 * Verify fixture integrity by comparing current hashes with saved checksums
 */
export async function verifyFixtureIntegrity(
  fixturePath: string,
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  const checksumsPath = getChecksumFilePath(fixturePath);
  if (!fsSync.existsSync(checksumsPath)) {
    errors.push(
      "Checksums file not found. Please run 'pnpm test:e2e:prepare' to generate it.",
    );
    return { valid: false, errors };
  }

  const savedChecksums = await loadChecksums(fixturePath);

  for (const { path: filePath, hash: expectedHash } of savedChecksums.files) {
    const fullPath = path.join(fixturePath, filePath);

    if (!fsSync.existsSync(fullPath)) {
      errors.push(`File missing: ${filePath}`);
      continue;
    }

    const currentHash = await hashFile(fullPath);
    if (currentHash !== expectedHash) {
      errors.push(`File modified: ${filePath}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
