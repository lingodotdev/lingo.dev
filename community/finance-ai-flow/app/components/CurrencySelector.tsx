'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';

interface CurrencySelectorProps {
    currentLocale: string;
    onLocaleChange: (locale: string) => void;
}

const OPTIONS = [
    { locale: 'en-US', label: 'USD (United States)', flag: '🇺🇸' },
    { locale: 'en-IN', label: 'INR (India)', flag: '🇮🇳' },
    { locale: 'de-DE', label: 'EUR (Germany)', flag: '🇩🇪' },
    { locale: 'fr-FR', label: 'EUR (France)', flag: '🇫🇷' },
    { locale: 'ja-JP', label: 'JPY (Japan)', flag: '🇯🇵' },
];

export function CurrencySelector({ currentLocale, onLocaleChange }: CurrencySelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = OPTIONS.find(opt => opt.locale === currentLocale) || OPTIONS[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef} style={{ position: 'relative', zIndex: 50 }}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls="currency-options"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    cursor: 'pointer',
                    minWidth: '200px',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.875rem'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{selectedOption.flag}</span>
                    <span style={{ fontWeight: 500 }}>{selectedOption.label.split('(')[0].trim()}</span>
                </div>
                <ChevronDown size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="listbox"
                        id="currency-options"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            left: 0,
                            background: '#0a0a0b',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            padding: '0.25rem'
                        }}
                    >
                        {OPTIONS.map((option) => (
                            <button
                                type="button"
                                key={option.locale}
                                onClick={() => {
                                    onLocaleChange(option.locale);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.625rem 0.75rem',
                                    cursor: 'pointer',
                                    width: '100%',
                                    textAlign: 'left',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    background: currentLocale === option.locale ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: currentLocale === option.locale ? 'white' : 'var(--text-muted)',
                                    transition: 'all 0.2s'
                                }}
                                aria-selected={currentLocale === option.locale}
                                onMouseEnter={(e) => {
                                    if (currentLocale !== option.locale) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                        e.currentTarget.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentLocale !== option.locale) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-muted)';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '1.25rem' }}>{option.flag}</span>
                                <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
