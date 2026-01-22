// Background service worker for handling Lingo.dev API calls

// Listen for translation requests from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateText') {
    translateText(request.text, request.targetLanguage, request.apiKey, request.apiEndpoint)
      .then((translatedText) => {
        sendResponse({ success: true, translatedText });
      })
      .catch((error) => {
        console.error('Translation error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

/**
 * Translate text using Lingo.dev API
 * 
 * Note: This implementation uses a standard translation API pattern.
 * You may need to adjust the endpoint URL and request format based on
 * Lingo.dev's actual API documentation.
 */
async function translateText(text, targetLanguage, apiKey, apiEndpoint) {
  if (!text || !text.trim()) {
    throw new Error('Text is empty');
  }

  if (!apiKey) {
    throw new Error('API key is required');
  }

  // Map language codes to full names if needed
  const languageMap = {
    'en': 'English',
    'hi': 'Hindi',
    'ja': 'Japanese',
    'es': 'Spanish'
  };

  const targetLangName = languageMap[targetLanguage] || targetLanguage;

  try {
    // Try multiple possible API endpoint patterns
    const possibleEndpoints = [
      'https://api.lingo.dev/v1/translate',
      'https://api.lingo.dev/translate',
      'https://translate.lingo.dev/api/v1/translate',
      'https://api.lingo.dev/api/translate'
    ];

    // Try different header formats
    const headerFormats = [
      { 'Authorization': `Bearer ${apiKey}` },
      { 'X-API-Key': apiKey },
      { 'Authorization': `ApiKey ${apiKey}` },
      { 'X-Lingo-API-Key': apiKey }
    ];

    // Try different request body formats
    const bodyFormats = [
      { text: text, target_language: targetLanguage },
      { text: text, targetLanguage: targetLanguage },
      { text: text, to: targetLanguage },
      { text: text, lang: targetLanguage },
      { content: text, target_language: targetLanguage },
      { query: text, target_language: targetLanguage }
    ];

    // Use provided endpoint or default
    const apiUrl = apiEndpoint || possibleEndpoints[0];
    const headers = {
      'Content-Type': 'application/json',
      ...headerFormats[0]
    };
    const body = bodyFormats[0];

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      let errorData = {};
      try {
        const text = await response.text();
        errorData = text ? JSON.parse(text) : {};
      } catch (e) {
        // Response is not JSON
      }

      // Provide helpful error message based on status code
      if (response.status === 404) {
        throw new Error(
          `API endpoint not found (404). The endpoint "${apiUrl}" may be incorrect. ` +
          `Please check Lingo.dev API documentation for the correct endpoint URL. ` +
          `Error details: ${errorData.message || errorData.error || 'Not found'}`
        );
      } else if (response.status === 401 || response.status === 403) {
        throw new Error(
          `Authentication failed (${response.status}). Please check your API key. ` +
          `Error: ${errorData.message || errorData.error || 'Unauthorized'}`
        );
      } else {
        throw new Error(
          `API request failed with status ${response.status}. ` +
          `Error: ${errorData.message || errorData.error || 'Unknown error'}`
        );
      }
    }

    const data = await response.json();
    
    // Handle different possible response formats
    // Common patterns:
    // - { translated_text: "..." }
    // - { translation: "..." }
    // - { text: "..." }
    // - { result: "..." }
    // - { data: { translated_text: "..." } }
    
    const translatedText = 
      data.translated_text || 
      data.translation || 
      data.text || 
      data.result || 
      (data.data && data.data.translated_text) ||
      data;

    if (!translatedText || typeof translatedText !== 'string') {
      throw new Error('Invalid response format from API');
    }

    return translatedText;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to Lingo.dev API');
    }
    
    // Re-throw with more context
    throw new Error(`Translation failed: ${error.message}`);
  }
}

// Log service worker startup (for debugging)
console.log('Lingo Page Translator background service worker loaded');
