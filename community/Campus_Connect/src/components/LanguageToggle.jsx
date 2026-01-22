import { useState } from "react";
import { setLocale } from "../i18n";
import './LanguageToggle.css';

export default function LanguageToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = localStorage.getItem('lingo_locale') || 'en';

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className={`sticky-language-wrapper ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="globe-trigger" 
        onClick={toggleMenu}
        aria-label="Toggle language menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
        </svg>
      </button>

      <div className="language-options">
        {['en', 'hi', 'pa'].map(lang => (
          <button
            key={lang}
            onClick={() => {
              setLocale(lang);
              setIsOpen(false);
            }}
            className={`lang-option-btn ${currentLocale === lang ? 'active' : ''}`}
          >
            {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'}
          </button>
        ))}
      </div>
    </div>
  );
}
