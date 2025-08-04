import fs from "fs";
import path from "path";
import ts from "typescript";
import { pathToFileURL } from "url";

/**
 * Static analysis script that outputs a compatibility matrix showing which bucket types
 * support which advanced configuration options (`lockedKeys`, `lockedPatterns`,
 * `ignoredKeys`, `injectLocale`).
 *
 * Usage:
 *   npx tsx src/generate-bucket-feature-docs.ts
 */

async function main() {
const currentDir = path.dirname(new URL(import.meta.url).pathname);
const repoRoot = path.resolve(currentDir, "../../..");
const sourcePath = path.join(repoRoot, "packages/cli/src/cli/loaders/index.ts");
const specPath = path.join(repoRoot, "packages/spec/src/formats.ts");

if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Could not find loader file at ${sourcePath}`);
  process.exit(1);
}

if (!fs.existsSync(specPath)) {
  console.error(`Error: Could not find spec file at ${specPath}`);
  process.exit(1);
}

const specModule = (await import(pathToFileURL(specPath).href)) as {
  bucketTypes: readonly string[];
};
const bucketTypes = specModule.bucketTypes;

const src = fs.readFileSync(sourcePath, "utf8");

// Parse the file once with the TS compiler API so we can inspect its AST.
const file = ts.createSourceFile(
  "index.ts",
  src,
  ts.ScriptTarget.Latest,
  /*setParentNodes*/ true,
);

// Matrix keyed by bucket type, each holding a record of option -> boolean.
const matrix: Record<string, Record<string, boolean>> = {};

function has(code: string, snippet: string) {
  return code.includes(snippet);
}

function analyze(caseCode: string) {
  return {
    lockedKeys: has(caseCode, "createLockedKeysLoader"),
    lockedPatterns: has(caseCode, "createMdxLockedPatternsLoader"),
    ignoredKeys: has(caseCode, "createIgnoredKeysLoader"),
    injectLocale: has(caseCode, "createInjectLocaleLoader"),
  };
}

// Recursively walk the AST to find the `switch (bucketType)` statement and inspect each `case` body.
function visit(node: ts.Node) {
  if (
    ts.isSwitchStatement(node) &&
    node.expression.getText(file) === "bucketType"
  ) {
    node.caseBlock.clauses.forEach((clause) => {
      if (ts.isCaseClause(clause) && clause.expression) {
        const bucket = clause.expression.getText(file).replace(/['"]/g, "");
        matrix[bucket] = analyze(src.slice(clause.pos, clause.end));
      }
    });
  }
  ts.forEachChild(node, visit);
}

visit(file);

// Ensure every declared bucket appears in the matrix, even if not yet implemented in the CLI.
bucketTypes.forEach((bucket: string) => {
  if (!(bucket in matrix)) {
    matrix[bucket] = {
      lockedKeys: false,
      lockedPatterns: false,
      ignoredKeys: false,
      injectLocale: false,
    };
  }
});

console.table(matrix);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
