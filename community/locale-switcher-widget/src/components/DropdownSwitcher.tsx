import React, { useState, useRef, useEffect } from 'react';
import { LocaleSwitcherProps } from '../types';
import { clsx } from 'clsx';

export function DropdownSwitcher({
  currentLocale,
  locales,
  onLocaleChange,
  className,
  showLabels = true,
  position = 'bottom'
}: LocaleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = locales.find(l => l.code === currentLocale) || locales[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onLocaleChange(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx('lingo-switcher-dropdown', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lingo-switcher-trigger"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {currentOption.flag && <span className="lingo-flag">{currentOption.flag}</span>}
        {showLabels && <span className="lingo-label">{currentOption.label}</span>}
        <span className="lingo-arrow" aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div
          className={clsx('lingo-switcher-menu', `lingo-position-${position}`)}
          role="menu"
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleSelect(locale.code)}
              className={clsx(
                'lingo-switcher-option',
                locale.code === currentLocale && 'lingo-active'
              )}
              role="menuitem"
            >
              {locale.flag && <span className="lingo-flag">{locale.flag}</span>}
              {showLabels && <span className="lingo-label">{locale.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
