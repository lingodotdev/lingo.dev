export const translateText = async (text, sourceLang, targetLang) => {
  try {
    const langMap = {
      'eng': 'en', 'jpn': 'ja', 'chi_sim': 'zh',
      'fra': 'fr', 'spa': 'es', 'hin': 'hi',
      'auto': 'auto' // Pass auto through
    };
    
    // If it's auto, keep it auto. Otherwise map it. Default to 'en' if unknown.
    const sourceCode = langMap[sourceLang] || 'en';

    // CALL YOUR LOCAL SERVER (The Bridge)
    const response = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text, 
        sourceLang: sourceCode, 
        targetLang 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server failed to translate");
    }

    return data.translation;

  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};