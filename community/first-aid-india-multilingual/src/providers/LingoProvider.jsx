import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
// import { LingoDotDevEngine } from 'lingo.dev/sdk'; // Kept for reference

const LingoContext = createContext({
    language: 'en',
    setLanguage: () => { },
    t: (key, defaultText) => defaultText || key,
});

// Static translations for the DEMO
const STATIC_TRANSLATIONS = {
    hi: {
        // Home Page
        'Save Lives in': 'जान बचाएं',
        '60 Seconds': '60 सेकंड में',
        'Instant, localized first aid guides for India. Medically accurate, offline-ready, and designed for the Golden Hour.': 'भारत के लिए त्वरित, स्थानीय प्राथमिक चिकित्सा गाइड। चिकित्सकीय रूप से सटीक, ऑफलाइन और गोल्डन आवर के लिए डिज़ाइन किया गया।',
        'Search for symptoms...': 'लक्षण खोजें...',
        'Common Emergencies': 'सामान्य आपात स्थितियां',
        'View All': 'सभी देखें',
        'View All Categories': 'सभी श्रेणियां देखें',

        // Emergency Card
        'Snake Bite': 'सर्पदंश (सांप का काटना)',
        'Immediate first aid steps for Snake Bite. Click to view life-saving actions.': 'सर्पदंश के लिए तत्काल प्राथमिक चिकित्सा कदम। जीवन बचाने वाले कार्यों को देखने के लिए क्लिक करें।',
        'View Steps': 'कदम देखें',
        'Action': 'कार्रवाई',
        'CRITICAL': 'गंभीर',
        'HIGH': 'उच्च',

        // Emergency Details (Snake Bite)
        'Immediate Actions': 'तत्काल कार्रवाई',
        'Call 108': '108 पर कॉल करें',
        'India Specific Guide': 'भारत विशिष्ट गाइड',
        'Symptoms': 'लक्षण',
        "CRITICAL DON'TS": 'क्या न करें (सावधानियां)',

        // Numbers
        'Ambulance': 'एम्बुलेंस',
        'Police': 'पुलिस',
        'General': 'सामान्य',
    },
    mr: {
        // Home Page
        'Save Lives in': 'जीव वाचवा',
        '60 Seconds': '60 सेकंदात',
        'Instant, localized first aid guides for India. Medically accurate, offline-ready, and designed for the Golden Hour.': 'भारतासाठी त्वरित, स्थानिक प्रथमोपचार मार्गदर्शक. वैद्यकीयदृष्ट्या अचूक, ऑफलाइन आणि गोल्डन अवरसाठी डिझाइन केलेले.',
        'Search for symptoms...': 'लक्षणे शोधा...',
        'Common Emergencies': 'सामान्य आपत्कालीन परिस्थिती',
        'View All': 'सर्व पहा',
        'View All Categories': 'सर्व श्रेण्या पहा',

        // Emergency Card
        'Snake Bite': 'सर्पदंश (सापाने चावणे)',
        'Immediate first aid steps for Snake Bite. Click to view life-saving actions.': 'सर्पदंशासाठी त्वरित प्रथमोपचार पावले. जीव वाचवणारी कृती पाहण्यासाठी क्लिक करा.',
        'View Steps': 'पावले पहा',
        'Action': 'कृती',
        'CRITICAL': 'गंभीर',
        'HIGH': 'उच्च',

        // Emergency Details
        'Immediate Actions': 'त्वरित कृती',
        'Call 108': '108 ला कॉल करा',
        'India Specific Guide': 'भारत विशिष्ट मार्गदर्शक',
        'Symptoms': 'लक्षणे',
        "CRITICAL DON'TS": 'काय करू नये (खबरदारी)',
    },
    ta: {
        'Save Lives in': 'உயிரைக் காப்பாற்றுங்கள்',
        '60 Seconds': '60 வினாடிகளில்',
        'Common Emergencies': 'பொதுவான அவசரநிலைகள்',
        'Snake Bite': 'பாம்பு கடி',
        'View Steps': 'படிகளைப் பார்க்கவும்',
        'Call 108': '108 ஐ அழைக்கவும்',
    }
};

export function LingoProvider({ children }) {
    const [language, setLanguage] = useState('en');

    // NOTE: React requires t() to be synchronous when used in JSX. 
    // We cannot use await lingoDotDev.localizeText() directly in render.
    // For this demo, we use a hybrid Static + Mock approach which is fast and robust.

    const t = useCallback((key, defaultText) => {
        const textToTranslate = defaultText || key;

        if (language === 'en') return textToTranslate;

        // 1. Check Static Dictionary (Fastest, best for demo)
        if (STATIC_TRANSLATIONS[language] && STATIC_TRANSLATIONS[language][textToTranslate]) {
            return STATIC_TRANSLATIONS[language][textToTranslate];
        }

        // 2. Fallback to Emoji Prefix (Mock Mode functionality)
        // This ensures the user SEES that the language context is passing through
        if (language === 'hi') return `🇮🇳 ${textToTranslate}`;
        if (language === 'mr') return `🏛️ ${textToTranslate}`;
        if (language === 'ta') return `🕉️ ${textToTranslate}`;

        return textToTranslate;
    }, [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        t
    }), [language, t]);

    return (
        <LingoContext.Provider value={value}>
            {children}
        </LingoContext.Provider>
    );
}

export function useLingo() {
    return useContext(LingoContext);
}

// Export alias for backwards compatibility
export const Providers = LingoProvider;
