
interface HardcodedString {
  text: string;
  line?: number;
}

export function detectHardcodedStrings(code: string): HardcodedString[] {
  const results: HardcodedString[] = [];

  if (!code || typeof code !== "string") {
    return results;
  }

  const lines = code.split("\n");

  lines.forEach((line, index) => {
    const lineNumber = index + 1;


    if (line.trim().startsWith("//")) return;


    if (line.includes("console.")) return;


    const jsxTextRegex = />\s*([^<>{}]+?)\s*</g;
    let jsxMatch: RegExpExecArray | null;

    while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
      const text = jsxMatch[1].trim();

      if (isValidHardcodedText(text)) {
        results.push({
          text,
          line: lineNumber,
        });
      }
    }

    const propStringRegex = /=["']([^"']+)["']/g;
    let propMatch: RegExpExecArray | null;

    while ((propMatch = propStringRegex.exec(line)) !== null) {
      const text = propMatch[1].trim();

      if (isValidHardcodedText(text)) {
        results.push({
          text,
          line: lineNumber,
        });
      }
    }
  });

  return deduplicate(results);
}



function isValidHardcodedText(text: string): boolean {

  if (!text || text.length < 3) return false;


  if (/^\d+$/.test(text)) return false;


  if (text.includes(".") && !text.includes(" ")) return false;


  const ignored = ["return", "true", "false", "null", "undefined"];
  if (ignored.includes(text)) return false;

  return true;
}

function deduplicate(items: HardcodedString[]): HardcodedString[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.text}-${item.line}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
