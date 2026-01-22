import { redirect } from '@sveltejs/kit';
import parser from 'accept-language-parser';

export const load = ({ request }) => {
    // Basic language detection
    const acceptLanguage = request.headers.get('accept-language') || undefined;
    const languages = parser.parse(acceptLanguage);
    
    // Default to 'en'
    let targetLang = 'en';

    // Simple logic: if 'es' or 'fr' is preferred, pick it.
    // In a real app, match against your supported locales.
    if (languages.length > 0) {
        const preferred = languages.find(l => ['en', 'es', 'fr'].includes(l.code));
        if (preferred) {
            targetLang = preferred.code;
        }
    }

    throw redirect(307, `/${targetLang}`);
};
