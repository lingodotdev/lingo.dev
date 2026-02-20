'use client';

import { useLingoContext } from '@lingo.dev/compiler/react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'hi', label: 'हिंदी' },
];

export default function LanguageSwitcher() {
    const { locale, setLocale } = useLingoContext();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 z-50 w-48 py-1 mt-2 origin-top-right bg-popover text-popover-foreground border rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={async () => {
                                    setIsOpen(false);

                                    // Sync translations if switching to a non-default language (or always)
                                    // We'll do it always to be safe and ensure latest content is captured
                                    try {
                                        // Dynamically import to avoid server-side issues if any, though this is a client component
                                        const { getAllContentStrings } = await import('@/app/lib/storage');
                                        const texts = getAllContentStrings();

                                        if (texts.length > 0) {
                                            await fetch('/api/lingo-sync', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ texts }),
                                            });
                                        }
                                    } catch (e) {
                                        console.error('Failed to sync translations:', e);
                                    }

                                    setLocale(language.code as any);
                                }}
                                className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground ${locale === language.code ? 'bg-accent/50 font-medium' : ''
                                    }`}
                            >
                                <span className="flex-1">{language.label}</span>
                                {locale === language.code && <Check className="w-4 h-4 ml-2" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
