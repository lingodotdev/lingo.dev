export const locales = ['en', 'es', 'fr', 'de', 'it', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const routing = {
  locales,
  defaultLocale: 'en' as const,
  localePrefix: 'always' as const
};