import type { FormContent, SupportedLocale, TranslatableFormContent } from '../types/form';
import { lingoEngine } from './lingo';

// In-memory translation cache
const translationCache = new Map<string, FormContent>();

/**
 * Flattens FormContent into a flat object for translation
 */
function flattenFormContent(content: FormContent): TranslatableFormContent {
  const flattened: TranslatableFormContent = {
    title: content.title,
    description: content.description,
    submitButtonText: content.submitButtonText,
  };

  content.fields.forEach((field, index) => {
    flattened[`field_${index}_label`] = field.label;
    flattened[`field_${index}_placeholder`] = field.placeholder;
    flattened[`field_${index}_helperText`] = field.helperText;
    flattened[`field_${index}_errorMessage`] = field.errorMessage;
    
    // Flatten options if they exist
    if (field.options && field.options.length > 0) {
      field.options.forEach((option, optionIndex) => {
        flattened[`field_${index}_option_${optionIndex}`] = option;
      });
    }
  });

  return flattened;
}

/**
 * Reconstructs FormContent from a flat translated object
 */
function unflattenFormContent(
  translated: Record<string, string>,
  originalContent: FormContent
): FormContent {
  return {
    title: translated.title || originalContent.title,
    description: translated.description || originalContent.description,
    submitButtonText: translated.submitButtonText || originalContent.submitButtonText,
    fields: originalContent.fields.map((field, index) => ({
      ...field,
      label: translated[`field_${index}_label`] || field.label,
      placeholder: translated[`field_${index}_placeholder`] || field.placeholder,
      helperText: translated[`field_${index}_helperText`] || field.helperText,
      errorMessage: translated[`field_${index}_errorMessage`] || field.errorMessage,
      options: field.options?.map((option, optionIndex) => 
        translated[`field_${index}_option_${optionIndex}`] || option
      ),
    })),
  };
}

/**
 * Generates a cache key based on content and locale
 */
function getCacheKey(content: FormContent, locale: SupportedLocale): string {
  return `${locale}:${JSON.stringify(content)}`;
}

/**
 * Translates form content to the target locale using Lingo.dev
 */
export async function translateFormContent(
  content: FormContent,
  targetLocale: SupportedLocale,
  onProgress?: (progress: number) => void
): Promise<FormContent> {
  // Return original content for English (source language)
  if (targetLocale === 'en') {
    return content;
  }

  // Check if Lingo is configured
  if (!lingoEngine) {
    console.warn('Lingo.dev is not configured. Returning original content.');
    return content;
  }

  // Check cache first
  const cacheKey = getCacheKey(content, targetLocale);
  const cached = translationCache.get(cacheKey);
  if (cached) {
    onProgress?.(100);
    return cached;
  }

  try {
    // Flatten the form content for translation
    const flatContent = flattenFormContent(content);

    // Translate using Lingo.dev SDK
    const translated = await lingoEngine.localizeObject(
      flatContent,
      {
        sourceLocale: 'en',
        targetLocale: targetLocale,
      },
      (progress) => {
        onProgress?.(progress);
      }
    );

    // Reconstruct the form content
    const translatedContent = unflattenFormContent(translated, content);

    // Cache the result
    translationCache.set(cacheKey, translatedContent);

    return translatedContent;
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}

/**
 * Clears the translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}
