export function extractText(code: string) {
  const comments: any = [];

  const lineRegex = /\/\/.*$/gm;
  const hashRegex = /#.*$/gm;
  const blockRegex = /\/\*[\s\S]*?\*\//gm;
  const tripleDoubleRegex = /"""[\s\S]*?"""/gm;
  const tripleSingleRegex = /'''[\s\S]*?'''/gm;

  const pushMatch = (match: any) => {
    comments.push({
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  };

  let match;

  while ((match = lineRegex.exec(code)) !== null) {
    pushMatch(match);
  }
  while ((match = hashRegex.exec(code)) !== null) {
    pushMatch(match);
  }
  while ((match = blockRegex.exec(code)) !== null) {
    pushMatch(match);
  }
  while ((match = tripleDoubleRegex.exec(code)) !== null) {
    pushMatch(match);
  }
  while ((match = tripleSingleRegex.exec(code)) !== null) {
    pushMatch(match);
  }

  comments.sort((a: any, b: any) => a.start - b.start);

  const cleaned = [];
  let lastEnd = -1;

  for (const c of comments) {
    if (c.start >= lastEnd) {
      cleaned.push(c);
      lastEnd = c.end;
    }
  }

  return { comments: cleaned };
}
