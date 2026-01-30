import React from 'react';
import { LocaleSwitcherProps } from '../types';
import { clsx } from 'clsx';

export function MinimalSwitcher({
  currentLocale,
  locales,
  onLocaleChange,
  className
}: LocaleSwitcherProps) {
  const currentIndex = locales.findIndex(l => l.code === currentLocale);
  const nextLocale = locales[(currentIndex + 1) % locales.length];

  return (
    <button
      onClick={() => onLocaleChange(nextLocale.code)}
      className={clsx('lingo-switcher-minimal', className)}
      aria-label={`Switch to ${nextLocale.label}`}
      title={`Current: ${locales[currentIndex]?.label || currentLocale}`}
    >
      {nextLocale.flag && <span className="lingo-flag">{nextLocale.flag}</span>}
      <span className="lingo-code">{nextLocale.code.toUpperCase()}</span>
    </button>
  );
}
