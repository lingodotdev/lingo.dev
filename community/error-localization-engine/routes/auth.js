const express = require('express');
const router = express.Router();
const { localizeError } = require('../lingoClient');

// Mock database
const users = [];

/**
 * POST /api/auth/signup
 * Body: { email, password }
 */
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const lang = req.targetLang;

    // 1. Validation Logic
    if (!email || !email.includes('@')) {
        const errorMsg = await localizeError({ 
            error: "Validation Failed", 
            message: "Please provide a valid email address." 
        }, lang);
        return res.status(400).json(errorMsg);
    }

    if (!password || password.length < 6) {
        const errorMsg = await localizeError({ 
            error: "Validation Failed", 
            message: "Password must be at least 6 characters long." 
        }, lang);
        return res.status(400).json(errorMsg);
    }

    if (users.find(u => u.email === email)) {
        const errorMsg = await localizeError({ 
            error: "Conflict", 
            message: "User with this email already exists." 
        }, lang);
        return res.status(409).json(errorMsg);
    }

    // Success
    // NOTE: This is a demo. In production, use argon2id or bcrypt for password hashing
    users.push({ email, password });
    
    // Even success messages can be localized!
    const successMsg = await localizeError({ 
        message: "User registered successfully." 
    }, lang);
    
    res.status(201).json(successMsg);
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const lang = req.targetLang;

    // Simulate finding user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        // Generic error for security, but localized
        const errorMsg = await localizeError({ 
            error: "Unauthorized", 
            message: "Invalid email or password." 
        }, lang);
        return res.status(401).json(errorMsg);
    }

    const successMsg = await localizeError({ 
        message: "Login successful.",
        token: "fake-jwt-token-123456"
    }, lang);

    res.json(successMsg);
});

module.exports = router;
