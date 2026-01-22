const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Target languages
const TARGET_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'Translation API',
    mode: process.env.LINGO_DEV_API_KEY ? 'API Mode' : 'Mock Mode'
  });
});

// Main translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, inputType } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Text is required' 
      });
    }

    // Parse JSON if inputType is 'json'
    let parsedText = text;
    let isJson = false;
    
    if (inputType === 'json') {
      try {
        parsedText = JSON.parse(text);
        isJson = true;
      } catch (error) {
        return res.status(400).json({ 
          error: 'Invalid JSON format' 
        });
      }
    }

    // Check for API key
    const API_KEY = process.env.LINGO_DEV_API_KEY;
    const hasValidApiKey = API_KEY && API_KEY !== 'your_lingo_dev_api_key_here';
    
    // Prepare translations
    const translations = {};
    const translationDetails = {};
    
    // For each target language
    for (const lang of TARGET_LANGUAGES) {
      if (hasValidApiKey) {
        // Try real Lingo.dev API
        try {
          console.log(`🔍 Attempting Lingo.dev API for ${lang.code}...`);
          
          if (isJson) {
            const result = await tryLingoApi(parsedText, lang.code, 'object');
            translations[lang.code] = result.translation;
            translationDetails[lang.code] = { source: 'api', method: result.method };
          } else {
            const result = await tryLingoApi(parsedText, lang.code, 'text');
            translations[lang.code] = result.translation;
            translationDetails[lang.code] = { source: 'api', method: result.method };
          }
        } catch (apiError) {
          console.log(`⚠️ API failed for ${lang.code}, using mock`);
          translations[lang.code] = isJson ? 
            await mockTranslateObject(parsedText, lang.code) :
            await mockTranslateText(parsedText, lang.code);
          translationDetails[lang.code] = { source: 'mock', reason: apiError.message };
        }
      } else {
        // Use mock translations
        translations[lang.code] = isJson ? 
          await mockTranslateObject(parsedText, lang.code) :
          await mockTranslateText(parsedText, lang.code);
        translationDetails[lang.code] = { source: 'mock', reason: 'no_api_key' };
      }
    }

    res.json({ 
      success: true,
      translations,
      details: translationDetails,
      inputType: isJson ? 'json' : 'text',
      languages: TARGET_LANGUAGES,
      mode: hasValidApiKey ? 'API Mode' : 'Mock Mode'
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Translation failed',
      message: error.message
    });
  }
});

// Try multiple Lingo.dev API endpoint patterns
async function tryLingoApi(content, targetLocale, type = 'text') {
  const API_KEY = process.env.LINGO_DEV_API_KEY;
  
  const endpoints = [
    // Common API patterns to try
    {
      url: 'https://api.lingo.dev/v1/translate',
      body: type === 'text' 
        ? { text: content, target: targetLocale, source: 'en' }
        : { content: JSON.stringify(content), target: targetLocale, source: 'en', format: 'json' }
    },
    {
      url: 'https://api.lingo.dev/translate',
      body: type === 'text'
        ? { q: content, target: targetLocale, source: 'en' }
        : { q: JSON.stringify(content), target: targetLocale, source: 'en' }
    },
    {
      url: 'https://api.lingo.dev/api/translate',
      body: { 
        text: content, 
        target_language: targetLocale, 
        source_language: 'en' 
      }
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint.url}`);
      
      const response = await axios.post(
        endpoint.url,
        endpoint.body,
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      // Try to extract translation from various response formats
      let translation;
      if (type === 'text') {
        translation = extractTranslationFromResponse(response.data);
      } else {
        translation = extractObjectFromResponse(response.data);
      }

      if (translation) {
        return { 
          translation, 
          method: endpoint.url,
          success: true 
        };
      }
    } catch (error) {
      // Try next endpoint
      continue;
    }
  }

  throw new Error('No working API endpoint found');
}

function extractTranslationFromResponse(data) {
  // Try different response formats
  if (typeof data === 'string') return data;
  if (data?.translatedText) return data.translatedText;
  if (data?.translation) return data.translation;
  if (data?.text) return data.text;
  if (data?.result) return data.result;
  if (data?.data?.text) return data.data.text;
  return null;
}

function extractObjectFromResponse(data) {
  if (data?.translated_object) return data.translated_object;
  if (data?.object) return data.object;
  if (data?.data) return data.data;
  if (typeof data === 'object') return data;
  return null;
}

// Enhanced mock translations
async function mockTranslateText(text, targetLocale) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const translations = {
    'hi': `"${text}" का हिंदी अनुवाद`,
    'es': `Traducción al español: "${text}"`,
    'fr': `Traduction française: "${text}"`
  };
  
  return translations[targetLocale] || `${text} [${targetLocale}]`;
}

async function mockTranslateObject(obj, targetLocale) {
  const translatedObj = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translatedObj[key] = await mockTranslateText(value, targetLocale);
    } else if (typeof value === 'object' && value !== null) {
      translatedObj[key] = await mockTranslateObject(value, targetLocale);
    } else {
      translatedObj[key] = value;
    }
  }
  
  return translatedObj;
}

// Debug endpoint to test API connectivity
app.get('/debug', async (req, res) => {
  const API_KEY = process.env.LINGO_DEV_API_KEY;
  const hasValidApiKey = API_KEY && API_KEY !== 'your_lingo_dev_api_key_here';
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    apiKey: hasValidApiKey ? 'Present' : 'Not present',
    mode: hasValidApiKey ? 'API Mode' : 'Mock Mode',
    endpointsToTry: [
      'https://api.lingo.dev/v1/translate',
      'https://api.lingo.dev/translate',
      'https://api.lingo.dev/api/translate'
    ],
    note: 'Waiting for correct endpoints from Lingo.dev team'
  };

  // Test connectivity if we have API key
  if (hasValidApiKey) {
    debugInfo.connectivityTests = [];
    
    for (const endpoint of debugInfo.endpointsToTry) {
      try {
        const response = await axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${API_KEY}` },
          timeout: 3000
        });
        debugInfo.connectivityTests.push({
          endpoint,
          status: response.status,
          working: true
        });
      } catch (error) {
        debugInfo.connectivityTests.push({
          endpoint,
          status: error.response?.status || 'timeout',
          working: false,
          error: error.message
        });
      }
    }
  }

  res.json(debugInfo);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Lingo.dev Translation API',
    status: 'Running',
    endpoints: {
      'POST /translate': 'Translate text or JSON objects',
      'GET /health': 'Service health check',
      'GET /debug': 'Debug API connectivity'
    },
    supportedLanguages: TARGET_LANGUAGES,
    note: 'Waiting for correct API endpoints from Lingo.dev team'
  });
});

app.listen(PORT, () => {
  const hasValidApiKey = process.env.LINGO_DEV_API_KEY && 
                        process.env.LINGO_DEV_API_KEY !== 'your_lingo_dev_api_key_here';
  
  console.log(`
  🌐 Translation API Server
  =========================
  
  Server: http://localhost:${PORT}
  Mode: ${hasValidApiKey ? '🔐 API Mode' : '🔄 Mock Mode'}
  
  Endpoints:
  - POST /translate - Main translation endpoint
  - GET /health     - Health check
  - GET /debug      - Debug info
  
  Status: ${hasValidApiKey ? 'Ready for API endpoints' : 'Using mock data'}
  
  ⚠️  Note: Waiting for correct Lingo.dev API endpoints
      Current endpoints might return 404
      Check /debug for connectivity tests
  `);
});