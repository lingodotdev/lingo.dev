export interface LocaleOption {
  code: string;
  label: string;
  flag?: string;
}

export interface LocaleSwitcherProps {
  /** Current active locale */
  currentLocale: string;
  /** Available locales */
  locales: LocaleOption[];
  /** Callback when locale is changed */
  onLocaleChange: (locale: string) => void;
  /** Display variant */
  variant?: 'dropdown' | 'flags' | 'minimal';
  /** Custom className */
  className?: string;
  /** Show labels alongside flags */
  showLabels?: boolean;
  /** Position for dropdown */
  position?: 'bottom' | 'top';
}
