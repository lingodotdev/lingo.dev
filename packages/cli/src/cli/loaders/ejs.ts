import * as ejs from "ejs";
import { ILoader } from "./_types";
import { createLoader } from "./_utils";

interface EjsParseResult {
  content: string;
  translatable: Record<string, string>;
}

function parseEjsForTranslation(input: string): EjsParseResult {
  const translatable: Record<string, string> = {};
  let counter = 0;

  // Regular expression for all EJS tags
  const ejsTagRegex = /<%[\s\S]*?%>/g;

  // Split content by EJS tags, preserving both text and EJS parts
  const parts: Array<{ type: 'text' | 'ejs', content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = ejsTagRegex.exec(input)) !== null) {
    // Add text before the tag
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: input.slice(lastIndex, match.index)
      });
    }
    // Add the EJS tag
    parts.push({
      type: 'ejs',
      content: match[0]
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last tag
  if (lastIndex < input.length) {
    parts.push({
      type: 'text',
      content: input.slice(lastIndex)
    });
  }

  // Build the template and extract translatable content
  let template = '';
  
  for (const part of parts) {
    if (part.type === 'ejs') {
      // Keep EJS tags as-is
      template += part.content;
    } else {
      // For text content, extract translatable parts while preserving HTML structure
      const textContent = part.content;
      
      // Extract text content from HTML tags while preserving structure
      const htmlTagRegex = /<[^>]+>/g;
      const textParts: Array<{ type: 'html' | 'text', content: string }> = [];
      let lastTextIndex = 0;
      let htmlMatch;

      while ((htmlMatch = htmlTagRegex.exec(textContent)) !== null) {
        // Add text before the HTML tag
        if (htmlMatch.index > lastTextIndex) {
          const textBefore = textContent.slice(lastTextIndex, htmlMatch.index);
          if (textBefore.trim()) {
            textParts.push({ type: 'text', content: textBefore });
          } else {
            textParts.push({ type: 'html', content: textBefore });
          }
        }
        // Add the HTML tag
        textParts.push({ type: 'html', content: htmlMatch[0] });
        lastTextIndex = htmlMatch.index + htmlMatch[0].length;
      }

      // Add remaining text after the last HTML tag
      if (lastTextIndex < textContent.length) {
        const remainingText = textContent.slice(lastTextIndex);
        if (remainingText.trim()) {
          textParts.push({ type: 'text', content: remainingText });
        } else {
          textParts.push({ type: 'html', content: remainingText });
        }
      }

      // If no HTML tags found, treat entire content as text
      if (textParts.length === 0) {
        const trimmedContent = textContent.trim();
        if (trimmedContent) {
          textParts.push({ type: 'text', content: textContent });
        } else {
          textParts.push({ type: 'html', content: textContent });
        }
      }

      // Process text parts
      for (const textPart of textParts) {
        if (textPart.type === 'text') {
          const trimmedContent = textPart.content.trim();
          if (trimmedContent) {
            const key = `text_${counter++}`;
            translatable[key] = trimmedContent;
            template += textPart.content.replace(trimmedContent, `__LINGO_PLACEHOLDER_${key}__`);
          } else {
            template += textPart.content;
          }
        } else {
          template += textPart.content;
        }
      }
    }
  }

  return { content: template, translatable };
}

function reconstructEjsWithTranslation(template: string, translatable: Record<string, string>): string {
  let result = template;
  
  // Replace placeholders with translated content
  for (const [key, value] of Object.entries(translatable)) {
    const placeholder = `__LINGO_PLACEHOLDER_${key}__`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  
  return result;
}

export default function createEjsLoader(): ILoader<string, Record<string, any>> {
  return createLoader({
    async pull(locale, input) {
      if (!input || input.trim() === '') {
        return {};
      }

      try {
        const parseResult = parseEjsForTranslation(input);
        return parseResult.translatable;
      } catch (error) {
        console.warn('Warning: Could not parse EJS template, treating as plain text');
        // Fallback: treat entire input as translatable content
        return { content: input.trim() };
      }
    },

    async push(locale, data, originalInput) {
      if (!originalInput) {
        // If no original input, reconstruct from data
        return Object.values(data).join('\n');
      }

      try {
        const parseResult = parseEjsForTranslation(originalInput);
        
        // Merge original translatable content with new translations
        const mergedTranslatable = { ...parseResult.translatable, ...data };
        
        return reconstructEjsWithTranslation(parseResult.content, mergedTranslatable);
      } catch (error) {
        console.warn('Warning: Could not reconstruct EJS template, returning translated data');
        return Object.values(data).join('\n');
      }
    },
  });
}
