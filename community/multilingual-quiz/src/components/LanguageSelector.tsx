import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, useTranslation, Language } from '../context/TranslationContext';
import './LanguageSelector.css';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button 
        className="language-button" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="flag">{currentLanguage.flag}</span>
        <span className="language-name">{currentLanguage.name}</span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {SUPPORTED_LANGUAGES.map((language) => (
            <button
              key={language.code}
              className={`language-option ${
                currentLanguage.code === language.code ? 'active' : ''
              }`}
              onClick={() => handleLanguageChange(language)}
            >
              <span className="flag">{language.flag}</span>
              <span className="language-name">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
