import React, { createContext, useContext, useState } from 'react';

const LingoContext = createContext({
    language: 'en',
    setLanguage: () => { },
    t: (key, defaultText) => defaultText || key,
});

export function LingoProvider({ children, config }) {
    const [language, setLanguage] = useState(config?.source || 'en');

    const t = (key, defaultText) => {
        if (language === 'hi' && defaultText) return `[हिंदी] ${defaultText}`;
        if (language === 'mr' && defaultText) return `[मराठी] ${defaultText}`;
        if (language === 'ta' && defaultText) return `[தமிழ்] ${defaultText}`;
        return defaultText || key;
    };

    return (
        <LingoContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LingoContext.Provider>
    );
}

export function useLingo() {
    return useContext(LingoContext);
}
