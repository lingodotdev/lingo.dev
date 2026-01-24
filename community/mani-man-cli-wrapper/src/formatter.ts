/**
 * ANSI escape sequence pattern for terminal formatting.
 * Matches sequences like \x1b[1m (bold), \x1b[0m (reset), etc.
 */
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

interface FormatMarker {
  code: string;
  position: number;
  relativePosition: number; // Position as percentage of total text
}

/**
 * Strips all ANSI escape sequences from text.
 */
export function stripAnsi(text: string): string {
  return text.replace(ANSI_PATTERN, "");
}

/**
 * Extracts ANSI escape sequences and their positions from text.
 */
function extractFormatMarkers(text: string): FormatMarker[] {
  const markers: FormatMarker[] = [];
  const plainText = stripAnsi(text);
  const totalLength = plainText.length || 1;

  let match: RegExpExecArray | null;
  let plainPosition = 0;

  // Reset the regex
  ANSI_PATTERN.lastIndex = 0;

  let lastIndex = 0;
  const workingText = text;

  while ((match = ANSI_PATTERN.exec(workingText)) !== null) {
    // Calculate plain text position by counting non-ANSI chars before this match
    const textBefore = workingText.slice(lastIndex, match.index);
    plainPosition += stripAnsi(textBefore).length;

    markers.push({
      code: match[0],
      position: plainPosition,
      relativePosition: plainPosition / totalLength,
    });

    lastIndex = match.index + match[0].length;
  }

  return markers;
}

/**
 * Applies format markers to translated text based on relative positions.
 * Since translation changes text length, we use proportional repositioning.
 */
function applyFormatMarkers(text: string, markers: FormatMarker[]): string {
  if (markers.length === 0) {
    return text;
  }

  const totalLength = text.length || 1;
  const result: string[] = [];
  let lastPosition = 0;

  // Sort markers by relative position
  const sortedMarkers = [...markers].sort(
    (a, b) => a.relativePosition - b.relativePosition
  );

  for (const marker of sortedMarkers) {
    // Calculate new position proportionally
    const newPosition = Math.round(marker.relativePosition * totalLength);
    const clampedPosition = Math.max(lastPosition, Math.min(newPosition, totalLength));

    // Add text before this marker
    if (clampedPosition > lastPosition) {
      result.push(text.slice(lastPosition, clampedPosition));
    }

    // Add the ANSI code
    result.push(marker.code);
    lastPosition = clampedPosition;
  }

  // Add remaining text
  if (lastPosition < totalLength) {
    result.push(text.slice(lastPosition));
  }

  return result.join("");
}

/**
 * Translates text while attempting to preserve ANSI formatting.
 * 
 * Strategy:
 * 1. Extract format markers with relative positions
 * 2. Strip ANSI codes for translation
 * 3. Translate plain text
 * 4. Reapply format markers at proportional positions
 */
export async function translateWithFormatting(
  text: string,
  translateFn: (plainText: string) => Promise<string>
): Promise<string> {
  // Extract format markers
  const markers = extractFormatMarkers(text);

  // Strip ANSI codes for translation
  const plainText = stripAnsi(text);

  // Translate the plain text
  const translatedText = await translateFn(plainText);

  // If no formatting was present, return as-is
  if (markers.length === 0) {
    return translatedText;
  }

  // Reapply formatting at proportional positions
  return applyFormatMarkers(translatedText, markers);
}

/**
 * Simple line-by-line formatting preservation.
 * Better for man pages where formatting is typically line-scoped.
 */
export async function translateLinesWithFormatting(
  text: string,
  translateFn: (plainText: string) => Promise<string>
): Promise<string> {
  const lines = text.split("\n");
  const translatedLines: string[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      translatedLines.push(line);
      continue;
    }

    // Check if line has formatting
    const hasFormatting = ANSI_PATTERN.test(line);

    if (hasFormatting) {
      const translated = await translateWithFormatting(line, translateFn);
      translatedLines.push(translated);
    } else {
      const translated = await translateFn(line);
      translatedLines.push(translated);
    }
  }

  return translatedLines.join("\n");
}
