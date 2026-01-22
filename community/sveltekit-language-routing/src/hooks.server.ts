import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Extract language from path (e.g., /en/about -> en)
	// Default to 'en' if not found or if at root (though root redirects)
	const [, lang] = event.url.pathname.split('/');
	
    // Validate lang (optional, but good for safety)
    const validLangs = ['en', 'es', 'fr'];
    const selectedLang = validLangs.includes(lang) ? lang : 'en';

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', selectedLang)
	});
};
