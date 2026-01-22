import { json } from '@sveltejs/kit';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
import { LINGODOTDEV_API_KEY } from '$env/static/private';

// Initialize the SDK with the API key from environment variables
const lingoDotDev = new LingoDotDevEngine({
	apiKey: LINGODOTDEV_API_KEY
});

export async function POST({ request }) {
	try {
		const { text, content, sourceLocale, targetLocale } = await request.json();

		if ((!text && !content) || !targetLocale) {
			return json({ error: 'Missing text/content or targetLocale' }, { status: 400 });
		}

		let result;

		if (content) {
			// Object translation
			result = await lingoDotDev.localizeObject(content, {
				sourceLocale: sourceLocale || 'en',
				targetLocale
			});
			return json({ translatedContent: result });
		} else {
			// Text translation
			result = await lingoDotDev.localizeText(text, {
				sourceLocale: sourceLocale || 'en',
				targetLocale
			});
			return json({ translatedText: result });
		}
	} catch (error) {
		console.error('Translation error:', error);
		return json({ error: 'Translation failed' }, { status: 500 });
	}
}
