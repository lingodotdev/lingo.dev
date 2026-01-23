import { LingoDotDevEngine } from 'lingo.dev/sdk';

export const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.NEXT_PUBLIC_LINGODOTDEV_API_KEY
});

/**
 * Translate story using Lingo.dev SDK with batch translation
 * This showcases Lingo.dev's real-time translation capabilities
 */
// export async function translateStoryToAllLanguages(
//     englishStory: string,
//     targetLocales: SupportedLocale[]
// ): Promise<Record<SupportedLocale, string>> {
//     try {
//         // Use Lingo.dev's batch translation to translate to all languages at once
//         const results = await lingoDotDev.batchLocalizeText(englishStory, {
//             sourceLocale: 'en',
//             targetLocales: targetLocales.filter(locale => locale !== 'en'),
//         });

//         // Build result object with English and all translations
//         const translations: Record<string, string> = {
//             en: englishStory,
//         };

//         // Map results back to locale codes
//         targetLocales.filter(locale => locale !== 'en').forEach((locale, index) => {
//             translations[locale] = results[index];
//         });

//         return translations as Record<SupportedLocale, string>;
//     } catch (error) {
//         console.error('Lingo.dev translation error:', error);
//         // Fallback: return English for all languages if translation fails
//         const fallback: Record<string, string> = {};
//         targetLocales.forEach(locale => {
//             fallback[locale] = englishStory;
//         });
//         return fallback as Record<SupportedLocale, string>;
//     }
// }

// /**
//  * Translate story using Lingo.dev SDK
//  */
// export async function translateStory(
//     story: string,
//     sourceLocale: SupportedLocale,
//     targetLocale: SupportedLocale
// ): Promise<string> {
//     try {
//         if (sourceLocale === targetLocale) {
//             return story;
//         }

//         const result = await lingoDotDev.localizeText(story, {
//             sourceLocale,
//             targetLocale,
//         });

//         return result;
//     } catch (error) {
//         console.error('Lingo.dev translation error:', error);
//         return story;
//     }
// }

// /**
//  * Batch translate stories to multiple locales
//  */
// export async function batchTranslate(
//     stories: Record<string, string>,
//     targetLocales: SupportedLocale[]
// ): Promise<Record<string, Record<string, string>>> {
//     const result: Record<string, Record<string, string>> = {};

//     for (const [key, story] of Object.entries(stories)) {
//         result[key] = await translateStoryToAllLanguages(story, targetLocales);
//     }

//     return result;
// }
