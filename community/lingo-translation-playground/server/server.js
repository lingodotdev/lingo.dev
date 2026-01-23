const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { LingoDotDevEngine } = require("lingo.dev/sdk");

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

// Initialize Lingo.dev SDK instance
let lingoDotDev = null;
let sdkInitialized = false;

// Initialize SDK if API key is available
const API_KEY = process.env.LINGO_DEV_API_KEY;
const hasValidApiKey = API_KEY && API_KEY !== 'your_lingo_dev_api_key_here';

if (hasValidApiKey) {
  try {
    lingoDotDev = new LingoDotDevEngine({
      apiKey: API_KEY,
      // Optional: Add SDK configuration
      batchSize: 50,
      idealBatchItemSize: 500
    });
    sdkInitialized = true;
    console.log('✅ Lingo.dev SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Lingo.dev SDK:', error.message);
    sdkInitialized = false;
  }
} else {
  console.log('⚠️  No valid API key found. Running in mock mode.');
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'Translation API',
    mode: sdkInitialized ? 'SDK Mode' : 'Mock Mode',
    sdkVersion: 'lingo.dev JavaScript SDK',
    languagesSupported: TARGET_LANGUAGES.length
  });
});

// Main translation endpoint
app.post('/translate', async (req, res) => {
  try {
    const { text, inputType } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
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
          success: false,
          error: 'Invalid JSON format' 
        });
      }
    }

    // Prepare translations
    const translations = {};
    const translationDetails = {};
    
    // For each target language
    for (const lang of TARGET_LANGUAGES) {
      if (sdkInitialized && lingoDotDev) {
        // Try real Lingo.dev SDK
        try {
          console.log(`🔍 Using Lingo.dev SDK for ${lang.code}...`);
          
          if (isJson) {
            const result = await lingoDotDev.localizeObject(parsedText, {
              sourceLocale: 'en',
              targetLocale: lang.code
            });
            translations[lang.code] = result;
            translationDetails[lang.code] = { 
              source: 'sdk', 
              method: 'localizeObject',
              success: true 
            };
          } else {
            const result = await lingoDotDev.localizeText(parsedText, {
              sourceLocale: 'en',
              targetLocale: lang.code,
              fast: true  // Optional: prioritize speed
            });
            translations[lang.code] = result;
            translationDetails[lang.code] = { 
              source: 'sdk', 
              method: 'localizeText',
              success: true 
            };
          }
        } catch (apiError) {
          console.log(`⚠️ SDK failed for ${lang.code}, using mock:`, apiError.message);
          translations[lang.code] = isJson ? 
            await mockTranslateObject(parsedText, lang.code) :
            await mockTranslateText(parsedText, lang.code);
          translationDetails[lang.code] = { 
            source: 'mock', 
            reason: apiError.message,
            fallback: true 
          };
        }
      } else {
        // Use mock translations
        translations[lang.code] = isJson ? 
          await mockTranslateObject(parsedText, lang.code) :
          await mockTranslateText(parsedText, lang.code);
        translationDetails[lang.code] = { 
          source: 'mock', 
          reason: sdkInitialized ? 'sdk_error' : 'no_api_key' 
        };
      }
    }

    res.json({ 
      success: true,
      translations,
      details: translationDetails,
      inputType: isJson ? 'json' : 'text',
      languages: TARGET_LANGUAGES,
      mode: sdkInitialized ? 'SDK Mode' : 'Mock Mode',
      sdkUsed: sdkInitialized,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Translation failed',
      message: error.message,
      mode: sdkInitialized ? 'SDK Mode' : 'Mock Mode'
    });
  }
});

// Batch translation endpoint (demonstrating another SDK feature)
app.post('/translate/batch', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Text is required' 
      });
    }

    if (!sdkInitialized || !lingoDotDev) {
      return res.status(400).json({
        success: false,
        error: 'SDK not initialized. API key required for batch translation.',
        mode: 'Mock Mode'
      });
    }

    console.log('🔍 Using Lingo.dev SDK batch translation...');
    
    // Demonstrate batchLocalizeText SDK method
    const results = await lingoDotDev.batchLocalizeText(text, {
      sourceLocale: 'en',
      targetLocales: TARGET_LANGUAGES.map(lang => lang.code)
    });

    // Format results
    const translations = {};
    TARGET_LANGUAGES.forEach((lang, index) => {
      translations[lang.code] = results[index] || `[Translation for ${lang.code}]`;
    });

    res.json({ 
      success: true,
      translations,
      method: 'batchLocalizeText',
      note: 'Using Lingo.dev SDK batch translation feature',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Batch translation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Batch translation failed',
      message: error.message
    });
  }
});

// Enhanced mock translations
async function mockTranslateText(text, targetLocale) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const translations = {
    'hi': `"${text}" का हिंदी अनुवाद (Lingo.dev SDK पैटर्न)`,
    'es': `Traducción al español: "${text}" (Patrón SDK Lingo.dev)`,
    'fr': `Traduction française: "${text}" (Modèle SDK Lingo.dev)`
  };
  
  return translations[targetLocale] || `${text} [${targetLocale} translation]`;
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

// SDK demo endpoint - shows available SDK methods
app.get('/sdk-demo', (req, res) => {
  const demoInfo = {
    sdk: 'Lingo.dev JavaScript SDK',
    version: 'Latest',
    methodsAvailable: [
      {
        method: 'localizeText',
        description: 'Translate text strings',
        example: 'lingoDotDev.localizeText(text, {sourceLocale, targetLocale})'
      },
      {
        method: 'localizeObject',
        description: 'Translate nested objects',
        example: 'lingoDotDev.localizeObject(obj, {sourceLocale, targetLocale})'
      },
      {
        method: 'batchLocalizeText',
        description: 'Translate to multiple languages',
        example: 'lingoDotDev.batchLocalizeText(text, {sourceLocale, targetLocales})'
      },
      {
        method: 'localizeChat',
        description: 'Translate chat conversations',
        example: 'lingoDotDev.localizeChat(messages, {sourceLocale, targetLocale})'
      },
      {
        method: 'localizeHtml',
        description: 'Translate HTML content',
        example: 'lingoDotDev.localizeHtml(html, {sourceLocale, targetLocale})'
      }
    ],
    initialized: sdkInitialized,
    mode: sdkInitialized ? 'SDK Mode' : 'Mock Mode',
    note: 'Based on official Lingo.dev SDK documentation'
  };

  res.json(demoInfo);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Lingo.dev Translation Playground',
    description: 'Demonstrating Lingo.dev JavaScript SDK implementation',
    status: 'Running',
    endpoints: {
      'POST /translate': 'Translate text or JSON objects',
      'POST /translate/batch': 'Batch translation to all languages',
      'GET /health': 'Service health check',
      'GET /sdk-demo': 'SDK methods information'
    },
    supportedLanguages: TARGET_LANGUAGES,
    sdkStatus: sdkInitialized ? '✅ Initialized' : '⚠️ Mock Mode',
    submission: 'Community Directory Giveaway Entry'
  });
});

app.listen(PORT, () => {
  console.log(`
  🚀 LINGO.DEV SDK PLAYGROUND
  ============================
  
  Server: http://localhost:${PORT}
  Mode: ${sdkInitialized ? '✅ SDK Mode (Real API)' : '🔄 Mock Mode'}
  
  🔗 ENDPOINTS:
  - POST /translate      - Main translation endpoint
  - POST /translate/batch - Batch translation demo
  - GET /health          - Health check
  - GET /sdk-demo        - SDK methods info
  
  🎯 SDK METHODS IMPLEMENTED:
  • localizeText()       - Text string translation
  • localizeObject()     - JSON object translation  
  • batchLocalizeText()  - Multiple languages at once
  
  📝 FOR COMMUNITY SUBMISSION:
  This implements OFFICIAL Lingo.dev JavaScript SDK.
  Ready for production use with real API key.

  `);
});