/**
 * Lingo.dev SDK Integration (Optional)
 * 
 * This file demonstrates how to integrate the Lingo.dev SDK
 * for future localization features (e.g., translating transaction categories)
 */

// The SDK automatically uses LINGODOTDEV_API_KEY from environment variables
// No need to manually pass the API key to the SDK

export async function translateText(
    texts: string[],
    targetLocale: string,
    sourceLocale: string = "en"
): Promise<string[]> {
    // Verify API key is configured
    if (!process.env.LINGODOTDEV_API_KEY) {
        throw new Error("LINGODOTDEV_API_KEY is not configured");
    }

    // In a real implementation, you would use:
    // import { LingoDotDevEngine } from "lingo.dev/sdk";
    // const lingo = new LingoDotDevEngine();
    // return await lingo.localizeObject(texts, targetLocale, sourceLocale);

    // For now, return original texts (placeholder)
    console.log("Lingo.dev SDK integration ready - add @lingodotdev/sdk to use");
    return texts;
}

export async function translateCategoryNames(
    categories: string[],
    targetLocale: string
): Promise<Record<string, string>> {
    const translations = await translateText(categories, targetLocale);

    return categories.reduce((acc, category, index) => {
        acc[category] = translations[index];
        return acc;
    }, {} as Record<string, string>);
}
