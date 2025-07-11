import fs from "fs";
import ts from "typescript";
import { bucketTypes } from "@lingo.dev/_spec";

/**
 * Static analysis script that outputs a compatibility matrix showing which bucket types
 * support which advanced configuration options (`lockedKeys`, `lockedPatterns`,
 * `ignoredKeys`, `injectLocale`).
 *
 * Usage:
 *   npx ts-node scripts/generate-bucket-matrix.ts
 */

// Read the root loader switch file that composes individual loaders per bucket.
const sourcePath =
  "/Users/david/work/demos/packages/cli/src/cli/loaders/index.ts";
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

function analyse(caseCode: string) {
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
        matrix[bucket] = analyse(src.slice(clause.pos, clause.end));
      }
    });
  }
  ts.forEachChild(node, visit);
}

visit(file);

// Ensure every declared bucket appears in the matrix, even if not yet implemented in the CLI.
bucketTypes.forEach((bucket) => {
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
