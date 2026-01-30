import React from 'react';
import { LocaleSwitcherProps } from '../types';
import { clsx } from 'clsx';

export function FlagsSwitcher({
  currentLocale,
  locales,
  onLocaleChange,
  className,
  showLabels = false
}: LocaleSwitcherProps) {
  return (
    <div className={clsx('lingo-switcher-flags', className)} role="group" aria-label="Select language">
      {locales.map((locale) => (
        <button
          type="button"
          key={locale.code}
          onClick={() => onLocaleChange(locale.code)}
          className={clsx(
            'lingo-flag-button',
            locale.code === currentLocale && 'lingo-active'
          )}
          aria-pressed={locale.code === currentLocale}
          aria-label={locale.label}
          title={locale.label}
        >
          {locale.flag && <span className="lingo-flag">{locale.flag}</span>}
          {showLabels && <span className="lingo-label">{locale.label}</span>}
        </button>
      ))}
    </div>
  );
}
