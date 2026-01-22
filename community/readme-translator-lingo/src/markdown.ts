export function extractCodeBlocks(markdown: string) {
  const codeBlocks: string[] = [];
  let index = 0;

  const processed = markdown.replace(/```[\s\S]*?```/g, match => {
    const placeholder = `__CODE_BLOCK_${index}__`;
    codeBlocks.push(match);
    index++;
    return placeholder;
  });

  return { processed, codeBlocks };
}

export function restoreCodeBlocks(
  translated: string,
  codeBlocks: string[]
) {
  let result = translated;

  codeBlocks.forEach((block, i) => {
    result = result.replace(`__CODE_BLOCK_${i}__`, block);
  });

  return result;
}
