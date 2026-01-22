import { writable } from 'svelte/store';

// Simple store to keep track of the current language
export const locale = writable<string>('en');

// Store to cache translations to avoid re-fetching the same text
// Key: "text_targetLang", Value: "translatedText"
export const translationCache = writable<Record<string, string>>({});

// Store to cache object translations
// Key: "JSON(content)::targetLang", Value: translatedObject
export const objectTranslationCache = writable<Record<string, unknown>>({});

/**
 * Helper to translate an object of strings
 *
 * @param content - The object to translate
 * @param source - The source language
 * @param target - The target language
 * @param key - A unique key to identify the object in the cache
 * @returns The translated object
 */
export async function translateObject<T extends Record<string, unknown>>(
	content: T,
	source: string,
	target: string,
	key: string
): Promise<T> {
	if (source === target) return content;

	const cacheKey = key + '::' + target;

	let cachedValue: T | undefined;
	const unsubscribe = objectTranslationCache.subscribe((c) => {
		cachedValue = c[cacheKey] as T;
	});
	unsubscribe();

	if (cachedValue) return cachedValue;

	try {
		const response = await fetch('/api/translate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content, sourceLocale: source, targetLocale: target })
		});

		if (!response.ok) throw new Error('Translation failed');

		const data = await response.json();

		objectTranslationCache.update((c) => ({ ...c, [cacheKey]: data.translatedContent }));

		return data.translatedContent;
	} catch (err) {
		console.error(err);
		return content;
	}
}

export async function translateText(text: string, source: string, target: string): Promise<string> {
	if (source === target) return text;

	// Check cache first
	const cacheKey = `${text}_${target}`;
	let cachedValue: string | undefined;

	const unsubscribe = translationCache.subscribe((c) => {
		cachedValue = c[cacheKey];
	});
	unsubscribe();

	if (cachedValue) return cachedValue;

	try {
		const response = await fetch('/api/translate', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text, sourceLocale: source, targetLocale: target })
		});

		if (!response.ok) throw new Error('Translation failed');

		const data = await response.json();

		// Update cache
		translationCache.update((c) => ({ ...c, [cacheKey]: data.translatedText }));
		return data.translatedText;
	} catch (err) {
		console.error(err);
		return text; // Fallback to original text on error
	}
}
