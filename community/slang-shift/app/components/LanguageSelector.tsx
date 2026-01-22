'use client';

import { motion } from 'framer-motion';

interface Language {
    code: string;
    name: string;
    flag: string;
    nativeName: string;
}

const LANGUAGES: Language[] = [
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
];

interface LanguageSelectorProps {
    selected: string;
    onChange: (code: string) => void;
}

export default function LanguageSelector({ selected, onChange }: LanguageSelectorProps) {
    return (
        <div>
            <label className="block text-small font-medium text-[var(--text-secondary)] mb-3">
                Target Language
            </label>

            <div className="pill-group">
                {LANGUAGES.map((lang) => (
                    <motion.button
                        key={lang.code}
                        onClick={() => onChange(lang.code)}
                        className={`pill ${selected === lang.code ? 'active' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        layout
                    >
                        <span className="mr-1.5">{lang.flag}</span>
                        <span>{lang.name}</span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
