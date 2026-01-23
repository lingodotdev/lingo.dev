/**
 * Simple proxy server to handle Lingo.dev API requests and bypass CORS
 */

import express from 'express';
import cors from 'cors';
import { LingoDotDevEngine } from 'lingo.dev/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Initialize Lingo.dev engine
let lingoDotDev;
try {
    lingoDotDev = new LingoDotDevEngine({
        apiKey: process.env.VITE_LINGO_API_KEY,
        batchSize: 50,
        idealBatchItemSize: 500
    });
    console.log('[Server] Lingo.dev SDK initialized successfully');
} catch (error) {
    console.error('[Server] Lingo.dev SDK initialization failed:', error);
}

// Translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, sourceLocale, targetLocale } = req.body;
        
        if (!text || !targetLocale) {
            return res.status(400).json({ error: 'Missing text or targetLocale' });
        }

        if (!lingoDotDev) {
            return res.status(500).json({ error: 'Lingo.dev SDK not initialized' });
        }

        console.log(`[Server] Translating text (${text.length} chars) from ${sourceLocale} to ${targetLocale}`);

        const result = await lingoDotDev.localizeText(text, {
            sourceLocale: sourceLocale || 'en',
            targetLocale: targetLocale,
            fast: true
        });

        console.log(`[Server] Translation result: "${result}"`);

        res.json({ translatedText: result });
    } catch (error) {
        console.error('[Server] Translation error:', error);
        res.status(500).json({ error: 'Translation failed', details: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`[Server] Translation proxy server running on http://localhost:${port}`);
});