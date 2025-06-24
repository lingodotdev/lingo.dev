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
      // Process text content
      const trimmedContent = part.content.trim();
      if (trimmedContent && trimmedContent.length > 0) {
        const key = `text_${counter++}`;
        translatable[key] = trimmedContent;
        template += `__LINGO_PLACEHOLDER_${key}__`;
      } else {
        // Keep whitespace
        template += part.content;
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
