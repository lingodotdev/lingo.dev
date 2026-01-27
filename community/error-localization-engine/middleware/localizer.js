/**
 * Middleware to extract the target language from the request.
 * Prioritizes 'lang' query parameter over 'Accept-Language' header.
 * Defaults to 'en' (English).
 */
function localizer(req, res, next) {
    // 1. Check query param ?lang=xx
    let lang = req.query.lang;
    
    // Normalize query param (handle arrays and objects)
    if (Array.isArray(lang)) {
        lang = lang[0];
    }
    if (typeof lang === 'string') {
        lang = lang.trim();
    }
    if (!lang) {
        lang = undefined;
    }

    // 2. Check Accept-Language header
    if (!lang && req.headers['accept-language']) {
        // Parse Accept-Language: remove quality values (;q=0.9) and take first language
        const acceptLang = req.headers['accept-language']
            .split(',')[0]
            .split(';')[0]
            .trim();
        lang = acceptLang;
    }

    // 3. Default to English
    req.targetLang = lang || 'en';
    
    // Log for debugging
    console.log(`[Request] ${req.method} ${req.path} - Target Lang: ${req.targetLang}`);
    
    next();
}

module.exports = localizer;
