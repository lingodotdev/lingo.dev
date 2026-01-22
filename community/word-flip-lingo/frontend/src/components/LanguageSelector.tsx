import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';
import { LANGUAGES } from '../data/languages';

interface LanguageSelectorProps {
  label: string;
  selectedLanguage: string;
  onSelect: (lang: string) => void;
  align?: 'left' | 'right' | 'center';
  exclude?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, selectedLanguage, onSelect, align = 'center', exclude }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="lang-item-container" ref={dropdownRef}>
      <div className="lang-item" onClick={() => setIsOpen(!isOpen)}>
        <span className="lang-tag">{label}</span>
        <span className="lang-name">
          {selectedLanguage}
          <svg className={`chevron ${isOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div className={`lang-dropdown align-${align}`}>
          <div className="dropdown-header">Select Language</div>
          <div className="lang-list">
            {LANGUAGES.map((lang) => {
                const isExcluded = exclude === lang.name;
                return (
                <div
                  key={lang.code}
                  className={`lang-option ${selectedLanguage === lang.name ? 'selected' : ''} ${isExcluded ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!isExcluded) {
                      onSelect(lang.name);
                      setIsOpen(false);
                    }
                  }}
                >
                  {lang.name}
                  {selectedLanguage === lang.name && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60CE01" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {isExcluded && <span className="excluded-label">Selected</span>}
                </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
