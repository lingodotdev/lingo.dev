/**
 * Extract comments from code based on language
 */
export function extractComments(code, language) {
  const comments = [];

  // Define comment patterns for different languages
  const patterns = getCommentPatterns(language);

  if (!patterns) {
    return comments;
  }

  // Extract single-line comments
  if (patterns.singleLine) {
    const regex = new RegExp(patterns.singleLine.pattern, "gm");
    let match;

    while ((match = regex.exec(code)) !== null) {
      comments.push({
        type: "single",
        text: match[1].trim(),
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
      });
    }
  }

  // Extract multi-line comments
  if (patterns.multiLine) {
    const regex = new RegExp(patterns.multiLine.pattern, "gs");
    let match;

    while ((match = regex.exec(code)) !== null) {
      comments.push({
        type: "multi",
        text: match[1].trim(),
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
      });
    }
  }

  return comments.sort((a, b) => a.start - b.start);
}

/**
 * Get comment patterns for different languages
 */
function getCommentPatterns(language) {
  const patterns = {
    javascript: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    typescript: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    python: {
      singleLine: { pattern: "#\\s*(.+)$" },
      multiLine: { pattern: "\"\"\"([\\s\\S]*?)\"\"\"|'''([\\s\\S]*?)'''" },
    },
    java: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    c: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    cpp: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    csharp: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    php: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    ruby: {
      singleLine: { pattern: "#\\s*(.+)$" },
      multiLine: { pattern: "=begin([\\s\\S]*?)=end" },
    },
    go: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    rust: {
      singleLine: { pattern: "\\/\\/\\s*(.+)$" },
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
    html: {
      multiLine: { pattern: "\u003c!--([\\s\\S]*?)--\u003e" },
    },
    css: {
      multiLine: { pattern: "\\/\\*([\\s\\S]*?)\\*\\/" },
    },
  };

  return patterns[language];
}

/**
 * Inject translated comments back into code
 */
export function injectTranslations(code, comments, language) {
  let result = code;

  // Get patterns for the language to know how to format comments
  const patterns = getCommentPatterns(language);
  if (!patterns) return code;

  // Sort comments by position (reverse order for proper offset handling)
  const sortedComments = [...comments].sort((a, b) => b.start - a.start);

  for (const comment of sortedComments) {
    if (!comment.translatedText) continue;

    let translatedComment = "";

    // Format based on comment type and language patterns
    if (comment.type === "single" && patterns.singleLine) {
      // Reconstruct single line comment
      // Extract the comment marker (e.g., "//" or "#")
      const wrapper = patterns.singleLine.pattern
        .split("\\s*")[0]
        .replace(/\\/g, "");
      translatedComment = `${wrapper} ${comment.translatedText}`;
    } else if (comment.type === "multi" && patterns.multiLine) {
      // Reconstruct multi line comment
      // This is a simplified reconstruction, strict pattern matching is harder
      // We'll use standard conventions based on language
      if (["html", "xml"].includes(language)) {
        translatedComment = `<!-- ${comment.translatedText} -->`;
      } else if (["css"].includes(language)) {
        translatedComment = `/* ${comment.translatedText} */`;
      } else if (["python", "ruby"].includes(language)) {
        // Python/Ruby multiline often use same char or specific delimiters
        const marker = language === "python" ? '"""' : "=begin";
        const endMarker = language === "python" ? '"""' : "=end";
        translatedComment = `${marker} ${comment.translatedText} ${endMarker}`;
      } else {
        // Default C-style
        translatedComment = `/* ${comment.translatedText} */`;
      }
    } else {
      // Fallback if specific pattern not found
      translatedComment = `/* ${comment.translatedText} */`;
    }

    // Replace in code
    const before = result.substring(0, comment.start);
    const after = result.substring(comment.end);
    result = before + translatedComment + after;
  }

  return result;
}

/**
 * Get file icon based on file type
 */
export function getFileIcon(fileName) {
  const ext = fileName.split(".").pop().toLowerCase();

  const iconMap = {
    // JavaScript
    js: "📜",
    jsx: "⚛️",
    ts: "📘",
    tsx: "⚛️",

    // Python
    py: "🐍",

    // Web
    html: "🌐",
    css: "🎨",
    scss: "🎨",

    // Markup
    md: "📝",
    json: "📋",
    xml: "📄",
    yaml: "⚙️",
    yml: "⚙️",

    // Other
    java: "☕",
    go: "🔷",
    rs: "🦀",
    php: "🐘",
    rb: "💎",

    // Config
    gitignore: "🚫",
    env: "🔐",
  };

  return iconMap[ext] || "📄";
}
