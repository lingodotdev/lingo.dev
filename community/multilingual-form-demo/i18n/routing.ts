import { locales } from '@/app/components/LanguageSwitcher/types';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: locales.map((locale) => locale.code),
    defaultLocale: 'en',
    localePrefix: 'always'
});
