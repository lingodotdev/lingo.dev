import { diffWords, Change } from "diff";

export interface DecorationRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  className: string;
}

/**
 * Calculates Monaco decorations for a given text compared to another.
 *
 * @param text The content of the editor we are decorating.
 * @param otherText The content to compare against.
 * @param side 'original' (left/input) or 'modified' (right/output).
 *             If 'original': highlight REMOVALS (red).
 *             If 'modified': highlight ADDITIONS (green).
 */
export function computeDecorations(
  text: string,
  otherText: string,
  side: "original" | "modified",
): DecorationRange[] {
  // Use diffWords for granular diffs.
  // Argument order: (oldStr, newStr)
  // If we are 'original', we want to see what was in 'text' (old) that is NOT in 'otherText' (new) -> Removed.
  // If we are 'modified', we want to see what is in 'text' (new) that was NOT in 'otherText' (old) -> Added.

  const changes = diffWords(
    side === "original" ? text : otherText,
    side === "modified" ? text : otherText,
  );

  const decorations: DecorationRange[] = [];

  // We need to track the position in 'text' as we iterate.
  // Note: diffWords returns the sequence of parts.
  // Using `diffWords` gives us: { value: "hello", added: true/false, removed: true/false }
  //
  // Crucially, `diff` library returns the sequence of ALL content.
  // HOWEVER, removed parts are NOT present in the 'modified' text, and added parts are NOT present in the 'original' text.
  //
  // Algorithm:
  // We need to trace our position in the CURRENT editor's text path.
  //
  // If side === 'original' (showing Old text):
  //   - Iterate changes:
  //     - If 'removed': This text IS present in Original. It IS the diff we want to highlight.
  //       -> Create Range, Increment Original Cursor.
  //     - If 'added': This text is NOT present in Original.
  //       -> Ignore for cursor (it exists in new only).
  //     - If neutral: This text IS present in Original.
  //       -> Increment Original Cursor.
  //
  // If side === 'modified' (showing New text):
  //   - Iterate changes:
  //     - If 'removed': This text is NOT present in Modified.
  //       -> Ignore for cursor.
  //     - If 'added': This text IS present in Modified. It IS the diff we want to highlight.
  //       -> Create Range, Increment Modified Cursor.
  //     - If neutral: This text IS present in Modified.
  //       -> Increment Modified Cursor.

  let currentLine = 1;
  let currentColumn = 1;

  for (const change of changes) {
    // Determine if this chunk exists in the current editor's text
    const existsInCurrent =
      side === "original" ? !change.added : !change.removed;

    // Determine if this chunk should be highlighted
    const shouldHighlight = side === "original" ? change.removed : change.added;

    if (!existsInCurrent) {
      // Skip this chunk as it's not part of our document
      continue;
    }

    const lines = change.value.split("\n");

    // If highlighting, add decoration for the current range
    if (shouldHighlight) {
      // We accumulate ranges. Since the chunk might span multiple lines, we handle it.
      // Actually, Monaco requires a Range.
      // Let's compute the end position.
      const endLine = currentLine + lines.length - 1;
      const endColumn =
        lines.length === 1
          ? currentColumn + lines[0].length
          : lines[lines.length - 1].length + 1;

      decorations.push({
        startLineNumber: currentLine,
        startColumn: currentColumn,
        endLineNumber: endLine,
        endColumn: endColumn,
        className: side === "original" ? "diff-removed" : "diff-added",
      });
    }

    // Advance cursor
    if (lines.length === 1) {
      currentColumn += lines[0].length;
    } else {
      currentLine += lines.length - 1;
      currentColumn = lines[lines.length - 1].length + 1;
    }
  }

  return decorations;
}
