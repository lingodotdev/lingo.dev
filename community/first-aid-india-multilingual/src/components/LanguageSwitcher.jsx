import React from 'react';
import { useLingo } from '../providers/LingoProvider';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🏛️' },
    { code: 'ta', name: 'தமிழ்', flag: '🕉️' }
];

export function LanguageSwitcher() {
    const { setLanguage, language } = useLingo();

    return (
        <div className="relative group">
            <button className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                <Globe className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700 uppercase">{language || 'en'}</span>
            </button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-200 hidden group-hover:block z-50">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => {
                            console.log('Switching to:', lang.code);
                            setLanguage(lang.code);
                        }}
                        className={`flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left ${language === lang.code ? 'bg-slate-100 font-bold' : ''}`}
                    >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
