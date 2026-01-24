require('dotenv').config();
const express = require('express');
const path = require('path');
const localizer = require('./middleware/localizer');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware for local development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept-Language');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(localizer);

// Routes
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', async (req, res) => {
    const { localizeError } = require('./lingoClient');
    const msg = await localizeError("Welcome to the Error Localization Engine Demo API!", req.targetLang);
    res.send(msg);
});

// Start server
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Try: POST /api/auth/signup with JSON body { "email": "invalid", "password": "123" } and ?lang=es`);
    });
}

module.exports = app;
