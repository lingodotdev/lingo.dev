'use client'

import { SUPPORTED_LANGUAGES } from '@/lib/lingo'
import { ChevronDown } from 'lucide-react'

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
  disabled?: boolean
}

export function LanguageSelector({ selectedLanguage, onLanguageChange, disabled = false }: LanguageSelectorProps) {
  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage)

  return (
    <div className="relative">
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:border-gray-400 transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
      
      {/* Current language indicator */}
      <div className="absolute -top-8 left-0 text-xs text-gray-500">
        {currentLanguage?.flag} {currentLanguage?.name}
      </div>
    </div>
  )
}