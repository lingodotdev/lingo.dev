import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Open the user's editor on `initialContent` and return the edited text.
 *
 * Drop-in replacement for `external-editor`'s `.edit()` (which pulled a
 * vulnerable `tmp` transitively). Uses `mkdtempSync` for a safe, unique temp
 * directory — no untrusted prefix/postfix, so none of the `tmp` path-traversal
 * surface — and cleans it up afterwards.
 */
export function openInEditor(initialContent: string): string {
  const dir = mkdtempSync(join(tmpdir(), "lingo-edit-"));
  const file = join(dir, "EDIT.txt");
  try {
    writeFileSync(file, initialContent, "utf8");

    const editor = process.env.VISUAL || process.env.EDITOR || (process.platform === "win32" ? "notepad" : "vi");

    // Run through a shell so multi-word/quoted editor commands parse correctly,
    // e.g. `EDITOR='"/path with spaces/code" --wait'`. Both inputs are trusted:
    // `editor` is the user's own env var and `file` is our mkdtemp path.
    const result = spawnSync(`${editor} "${file}"`, {
      stdio: "inherit",
      shell: true,
    });
    if (result.error) {
      throw result.error;
    }

    return readFileSync(file, "utf8");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
