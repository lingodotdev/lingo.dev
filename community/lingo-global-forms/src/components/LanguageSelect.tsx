import React from 'react';
import type { SupportedLocale } from '../types/form';
import { SUPPORTED_LOCALES } from '../types/form';

interface LanguageSelectProps {
  value: SupportedLocale;
  onChange: (locale: SupportedLocale) => void;
  disabled?: boolean;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-dropdown" className="text-sm font-medium text-slate-600">
        Preview Language
      </label>
      <select
        id="language-dropdown"
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedLocale)}
        disabled={disabled}
        className="form-select pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.flag} {locale.name}
          </option>
        ))}
      </select>
    </div>
  );
};
