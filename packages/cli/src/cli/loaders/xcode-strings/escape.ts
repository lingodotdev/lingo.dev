/**
 * Unescape a string value from .strings file format
 * Handles: \", \\, \n, \t, etc.
 */
export function unescapeString(raw: string): string {
  let result = "";
  let i = 0;

  while (i < raw.length) {
    if (raw[i] === "\\" && i + 1 < raw.length) {
      const nextChar = raw[i + 1];
      switch (nextChar) {
        case '"':
          result += '"';
          i += 2;
          break;
        case "\\":
          result += "\\";
          i += 2;
          break;
        case "n":
          result += "\n";
          i += 2;
          break;
        case "t":
          result += "\t";
          i += 2;
          break;
        case "r":
          result += "\r";
          i += 2;
          break;
        default:
          // Unknown escape - keep as-is
          result += raw[i];
          i++;
          break;
      }
    } else {
      result += raw[i];
      i++;
    }
  }

  return result;
}

/**
 * Escape a string value for .strings file format
 * Escapes: \, ", newlines to \n
 */
export function escapeString(str: string): string {
  if (str == null) {
    return "";
  }

  let result = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    switch (char) {
      case "\\":
        result += "\\\\";
        break;
      case '"':
        result += '\\"';
        break;
      case "\n":
        result += "\\n";
        break;
      case "\r":
        result += "\\r";
        break;
      case "\t":
        result += "\\t";
        break;
      default:
        result += char;
        break;
    }
  }

  return result;
}
