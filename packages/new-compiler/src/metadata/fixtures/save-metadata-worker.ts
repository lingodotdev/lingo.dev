import { saveMetadata } from "../manager";
import { generateTranslationHash } from "../../utils/hash";

const dbPath = process.argv[2];
const workerId = Number(process.argv[3]);
const iterations = Number(process.argv[4]);
const noSyncArg = process.argv[5];

if (!dbPath) {
  console.error("Missing dbPath argument");
  process.exit(2);
}

if (Number.isNaN(workerId)) {
  console.error("Invalid workerId argument");
  process.exit(2);
}

if (Number.isNaN(iterations)) {
  console.error("Invalid iterations argument");
  process.exit(2);
}

if (noSyncArg !== "true" && noSyncArg !== "false") {
  console.error("Invalid noSync argument");
  process.exit(2);
}

const noSync = noSyncArg === "true";

function createEntry(i: number) {
  const sourceText = `worker-${workerId}-entry-${i}`;
  const context = {
    filePath: `worker-${workerId}.tsx`,
    componentName: "WorkerComponent",
  };

  return {
    type: "content" as const,
    sourceText,
    context,
    location: {
      filePath: `worker-${workerId}.tsx`,
      line: i + 1,
      column: 1,
    },
    hash: generateTranslationHash(sourceText, context),
  };
}

async function main() {
  for (let i = 0; i < iterations; i += 1) {
    await saveMetadata(dbPath, [createEntry(i)], noSync);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
