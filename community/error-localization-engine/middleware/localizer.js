/**
 * Middleware to extract the target language from the request.
 * Prioritizes 'lang' query parameter over 'Accept-Language' header.
 * Defaults to 'en' (English).
 */
function localizer(req, res, next) {
    // 1. Check query param ?lang=xx
    let lang = req.query.lang;

    // 2. Check Accept-Language header
    if (!lang && req.headers['accept-language']) {
        // Simple parse: take the first language code (e.g., 'en-US,en;q=0.9' -> 'en-US')
        // And maybe just take the first 2 chars or the full code. 
        // Lingo.dev likely supports standard BCP-47.
        const acceptLang = req.headers['accept-language'].split(',')[0].trim();
        lang = acceptLang;
    }

    // 3. Default to English
    req.targetLang = lang || 'en';
    
    // Log for debugging
    console.log(`[Request] ${req.method} ${req.path} - Target Lang: ${req.targetLang}`);
    
    next();
}

module.exports = localizer;
