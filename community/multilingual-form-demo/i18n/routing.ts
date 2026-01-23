import { locales } from '@/app/components/languageSwitcher/types';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: locales.map((locale) => locale.code),
    defaultLocale: 'en',
    localePrefix: 'always'
});
